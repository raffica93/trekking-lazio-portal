const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { ocrPdfLines } = require('../adapters/pdf-ocr');
const { scrapeDeterministic, pdfLines } = require('../adapters/deterministic');

function blankPdf() {
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 300] /Resources << >> /Contents 4 0 R >>\nendobj\n',
    '4 0 obj\n<< /Length 0 >>\nstream\n\nendstream\nendobj\n'
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const object of objects) { offsets.push(Buffer.byteLength(pdf)); pdf += object; }
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf);
}

test('OCR renders pages, recognizes them in order, and removes its temporary directory', async () => {
  const tempRoot = os.tmpdir();
  const before = new Set((await fs.readdir(tempRoot)).filter((name) => name.startsWith('cai-pdf-ocr-')));
  const calls = [];
  const lines = await ocrPdfLines(Buffer.from('%PDF-test'), {
    pageCount: 2,
    runCommand: async (command, args) => {
      calls.push([command, args]);
      if (command === 'pdftoppm') {
        const outputDir = path.dirname(args.at(-1));
        await fs.writeFile(path.join(outputDir, 'page-1.png'), 'page one');
        await fs.writeFile(path.join(outputDir, 'page-2.png'), 'page two');
        return { stdout: '' };
      }
      return { stdout: `recognized ${path.basename(args[0])}` };
    }
  });
  const after = new Set((await fs.readdir(tempRoot)).filter((name) => name.startsWith('cai-pdf-ocr-')));
  assert.deepEqual(lines, ['recognized page-1.png', 'recognized page-2.png']);
  assert.equal(calls.length, 3);
  assert.deepEqual(after, before);
});

test('OCR enforces a page limit before starting external tools', async () => {
  let invoked = false;
  await assert.rejects(ocrPdfLines(Buffer.from(''), {
    pageCount: 161,
    runCommand: async () => { invoked = true; }
  }), /between 1 and 160/);
  assert.equal(invoked, false);
});

test('deterministic scraper sends text-empty PDFs through OCR and parses OCR lines', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-scrape-ocr-test-'));
  let called = false;
  try {
    const source = { id: 'ocr-test', organizer: 'CAI OCR', region: 'Lazio', url: 'https://example.org/calendario.pdf', enabled: true };
    const result = await scrapeDeterministic(source, {
      now: '2026-08-01', cacheDir: tmp,
      fetchDoc: async (url) => ({ url, hash: 'blank-pdf', contentType: 'application/pdf', buffer: blankPdf() }),
      recognizePdf: async (_buffer, { pageCount }) => {
        called = true;
        assert.equal(pageCount, 1);
        return ['Programma 2026', '12 settembre Escursione Monte Rosa'];
      }
    });
    assert.equal(called, true);
    assert.equal(result.methods.includes('pdf-ocr'), true);
    assert.equal(result.excursions[0].date, '2026-09-12');
    assert.equal(result.excursions[0].locationSource, 'pdf-ocr');
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
});

test('deterministic scraper passes remaining budget to OCR and retries after an OCR failure', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-scrape-ocr-retry-'));
  const source = { id: 'ocr-retry-test', organizer: 'CAI OCR', region: 'Lazio', url: 'https://example.org/calendario.pdf', enabled: true };
  let calls = 0;
  try {
    const options = {
      now: '2026-08-01', budgetMs: 10_000, cacheDir: tmp,
      fetchDoc: async (url) => ({ url, hash: 'same-blank-pdf', contentType: 'application/pdf', buffer: blankPdf() }),
      recognizePdf: async (_buffer, { timeoutMs }) => {
        calls += 1;
        assert.ok(timeoutMs > 0 && timeoutMs <= 10_000);
        if (calls === 1) throw new Error('tesseract unavailable');
        return ['Programma 2026', '12 settembre Escursione Monte Rosa'];
      }
    };
    const first = await scrapeDeterministic(source, options);
    assert.equal(first.issues.some((issue) => /tesseract unavailable/.test(issue.message)), true);
    assert.deepEqual((await fs.readdir(tmp)).filter((name) => name.startsWith('events-')), []);
    const second = await scrapeDeterministic(source, options);
    assert.equal(second.excursions[0].date, '2026-09-12');
    assert.equal(calls, 2);
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
});

test('scrape skips OCR when its budget is exhausted', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-scrape-ocr-budget-'));
  let called = false;
  try {
    const source = { id: 'ocr-budget-test', organizer: 'CAI OCR', region: 'Lazio', url: 'https://example.org/calendario.pdf', enabled: true };
    const result = await scrapeDeterministic(source, {
      now: '2026-08-01', budgetMs: 40, cacheDir: tmp,
      fetchDoc: async (url) => {
        await new Promise((resolve) => setTimeout(resolve, 60));
        return { url, hash: 'budget-blank-pdf', contentType: 'application/pdf', buffer: blankPdf() };
      },
      recognizePdf: async () => { called = true; return []; }
    });
    assert.equal(called, false);
    assert.equal(result.issues.some((issue) => /time budget is exhausted/.test(issue.message)), true);
    assert.deepEqual((await fs.readdir(tmp)).filter((name) => name.startsWith('events-')), []);
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
});

test('pdfLines remains available with its original array return value', async () => {
  assert.deepEqual(await pdfLines(blankPdf()), []);
});

test('OCR reports a missing executable while still cleaning temporary files', async () => {
  const tempRoot = os.tmpdir();
  const before = new Set((await fs.readdir(tempRoot)).filter((name) => name.startsWith('cai-pdf-ocr-')));
  await assert.rejects(ocrPdfLines(Buffer.from('%PDF-test'), {
    pageCount: 1,
    runCommand: async (command, args) => {
      if (command === 'pdftoppm') {
        await fs.writeFile(`${args.at(-1)}-1.png`, 'page');
        return { stdout: '' };
      }
      const error = new Error('tesseract not found');
      error.code = 'ENOENT';
      throw error;
    }
  }), /tesseract not found/);
  const after = new Set((await fs.readdir(tempRoot)).filter((name) => name.startsWith('cai-pdf-ocr-')));
  assert.deepEqual(after, before);
});
