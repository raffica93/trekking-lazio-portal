const { fork } = require('node:child_process');
const path = require('node:path');

function runSourceProcess(source, { now, budgetMs = 60_000, maxDocuments = 12 } = {}) {
  return new Promise((resolve, reject) => {
    const child = fork(path.join(__dirname, '..', 'scripts', 'source-worker.js'), [], {
      stdio: ['ignore', 'ignore', 'ignore', 'ipc'], windowsHide: true,
      execArgv: ['--max-old-space-size=384']
    });
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true; clearTimeout(timer);
      if (child.connected) child.disconnect();
      child.kill();
      if (error) reject(error); else resolve(result);
    };
    const timer = setTimeout(() => finish(new Error(`Section worker timed out after ${budgetMs + 15_000}ms`)), budgetMs + 15_000);
    child.on('message', (message) => finish(message.ok ? null : Object.assign(new Error(message.error), { details: message.details }), message.result));
    child.on('error', (error) => finish(error));
    child.on('exit', (code) => { if (!settled) finish(new Error(`Section worker exited without a result (${code})`)); });
    child.send({ source, options: { now: typeof now === 'string' ? now : now?.toISO(), budgetMs, maxDocuments } });
  });
}

module.exports = { runSourceProcess };
