const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const execFileAsync = promisify(execFile);

async function run(command, args, options = {}) {
  return execFileAsync(command, args, { windowsHide: true, maxBuffer: 16 * 1024 * 1024, timeout: 120_000, ...options });
}

async function ocrPdfLines(buffer, { pageCount, renderCommand = 'pdftoppm', ocrCommand = 'tesseract', runCommand = run, timeoutMs = 120_000 } = {}) {
  if (!Number.isInteger(pageCount) || pageCount < 1 || pageCount > 160) throw new Error('OCR page count must be between 1 and 160');
  const deadline = Date.now() + timeoutMs;
  const timedRun = (command, args) => {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error(`PDF OCR exceeded its ${timeoutMs} ms time limit`);
    return runCommand(command, args, { timeout: remaining, maxBuffer: 16 * 1024 * 1024, windowsHide: true });
  };
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-pdf-ocr-'));
  try {
    const pdfPath = path.join(dir, 'source.pdf');
    const prefix = path.join(dir, 'page');
    await fs.writeFile(pdfPath, buffer);
    await timedRun(renderCommand, ['-f', '1', '-l', String(pageCount), '-r', '160', '-png', '-gray', pdfPath, prefix]);
    const images = (await fs.readdir(dir))
      .filter((name) => /^page-\d+\.png$/i.test(name))
      .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
    if (images.length !== pageCount) throw new Error(`PDF rasterizer produced ${images.length} of ${pageCount} pages`);
    const lines = [];
    for (const image of images) {
      const imagePath = path.join(dir, image);
      let stdout;
      try {
        ({ stdout } = await timedRun(ocrCommand, [imagePath, 'stdout', '-l', 'ita+eng', '--psm', '6']));
      } catch (primaryError) {
        try {
          ({ stdout } = await timedRun(ocrCommand, [imagePath, 'stdout', '-l', 'ita+eng', '--psm', '4']));
        } catch (fallbackError) {
          throw new Error(`OCR failed for ${image}: psm 6: ${primaryError.message}; psm 4: ${fallbackError.message}`);
        }
      }
      lines.push(...String(stdout || '').split(/\r?\n/));
    }
    return lines;
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

const MAX_OCR_PAGES = 8;
const MAX_PDF_PAGES = 400;
const OCR_PAGE_BUDGET_MS = 20_000;

async function ocrPdfFilePages(pdfPath, {
  pageCount,
  pages,
  renderCommand = 'pdftoppm',
  ocrCommand = 'tesseract',
  runCommand = run,
  timeoutMs = 90_000,
  maxPages = MAX_OCR_PAGES
} = {}) {
  if (!Number.isInteger(pageCount) || pageCount < 1 || pageCount > MAX_PDF_PAGES) {
    throw new Error(`PDF page count must be between 1 and ${MAX_PDF_PAGES}`);
  }
  const selected = [...new Set((pages || Array.from({ length: Math.min(pageCount, maxPages) }, (_v, index) => index + 1))
    .map(Number).filter((page) => Number.isInteger(page) && page >= 1 && page <= pageCount))].slice(0, maxPages);
  if (!selected.length) throw new Error('PDF OCR requires at least one valid page');
  const deadline = Date.now() + Math.min(timeoutMs, 90_000);
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-pdf-page-ocr-'));
  const lines = [];
  const failures = [];
  const runWithinBudget = async (command, args) => {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error('PDF OCR exceeded its total 90 second budget');
    return runCommand(command, args, {
      timeout: Math.min(OCR_PAGE_BUDGET_MS, remaining),
      maxBuffer: 4 * 1024 * 1024,
      windowsHide: true
    });
  };
  try {
    for (const page of selected) {
      let best = '';
      const recognize = async (dpi, psm) => {
        const prefix = path.join(dir, `page-${page}-${dpi}`);
        const args = ['-f', String(page), '-l', String(page), '-r', String(dpi), '-png', '-gray', pdfPath, prefix];
        await runWithinBudget(renderCommand, args);
        const candidates = (await fs.readdir(dir)).filter((name) => name.startsWith(`page-${page}-${dpi}-`) && name.endsWith('.png'));
        if (candidates.length !== 1) throw new Error(`PDF renderer produced ${candidates.length} images for page ${page}`);
        const imagePath = path.join(dir, candidates[0]);
        const { stdout } = await runWithinBudget(ocrCommand, [imagePath, 'stdout', '-l', 'ita+eng', '--psm', String(psm)]);
        const text = String(stdout || '').trim();
        if (text.replace(/\s/g, '').length > best.replace(/\s/g, '').length) best = text;
        await fs.rm(imagePath, { force: true });
      };
      try { await recognize(200, 6); } catch (error) { failures.push(`page ${page} 200dpi psm6: ${error.message}`); }
      if (best.replace(/\s/g, '').length < 60 && Date.now() < deadline) {
        try { await recognize(200, 4); } catch (error) { failures.push(`page ${page} 200dpi psm4: ${error.message}`); }
      }
      if (best.replace(/\s/g, '').length < 60 && Date.now() < deadline) {
        try { await recognize(300, 6); } catch (error) { failures.push(`page ${page} 300dpi psm6: ${error.message}`); }
      }
      if (best) lines.push(...best.split(/\r?\n/));
    }
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
  if (!lines.length && failures.length) throw new Error(failures.join('; '));
  return lines;
}

async function ocrPdfPageLines(buffer, options = {}) {
  if (!Buffer.isBuffer(buffer) || buffer.length > 32 * 1024 * 1024) {
    throw new Error('In-memory PDF OCR input must not exceed 32 MiB');
  }
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-pdf-page-src-'));
  try {
    const file = path.join(dir, 'source.pdf');
    await fs.writeFile(file, buffer);
    return await ocrPdfFilePages(file, options);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

async function ocrImageLines(buffer, { ocrCommand = 'tesseract', runCommand = run, timeoutMs = 30_000 } = {}) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 16 || buffer.length > 12 * 1024 * 1024) {
    throw new Error('Image OCR input must be between 16 bytes and 12 MiB');
  }
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-image-ocr-'));
  try {
    const imagePath = path.join(dir, 'source-image');
    await fs.writeFile(imagePath, buffer);
    const { stdout } = await runCommand(ocrCommand, [imagePath, 'stdout', '-l', 'ita+eng', '--psm', '4'], {
      timeout: timeoutMs, maxBuffer: 16 * 1024 * 1024, windowsHide: true
    });
    return String(stdout || '').split(/\r?\n/);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

module.exports = { ocrPdfLines, ocrPdfPageLines, ocrPdfFilePages, ocrImageLines, MAX_OCR_PAGES, MAX_PDF_PAGES };
