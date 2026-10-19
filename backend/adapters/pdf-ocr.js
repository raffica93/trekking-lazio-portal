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
      const { stdout } = await timedRun(ocrCommand, [imagePath, 'stdout', '-l', 'ita+eng', '--psm', '6']);
      lines.push(...String(stdout || '').split(/\r?\n/));
    }
    return lines;
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

module.exports = { ocrPdfLines };
