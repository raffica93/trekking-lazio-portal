'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function writeRegistryPair(files, contents, fsImpl = fs) {
  if (!Array.isArray(files) || files.length !== 2) throw new Error('Expected exactly two registry output paths');
  const token = `${process.pid}-${crypto.randomBytes(6).toString('hex')}`;
  const prepared = [];
  const renamed = [];
  try {
    files.forEach((file, index) => {
      const directory = path.dirname(file);
      fsImpl.mkdirSync(directory, { recursive: true });
      const temp = path.join(directory, `.${path.basename(file)}.${token}.${index}.tmp`);
      const existed = fsImpl.existsSync(file);
      const original = existed ? fsImpl.readFileSync(file) : null;
      fsImpl.writeFileSync(temp, contents);
      prepared.push({ file, temp, existed, original });
    });
    for (const item of prepared) {
      fsImpl.renameSync(item.temp, item.file);
      renamed.push(item);
    }
  } catch (error) {
    const rollbackErrors = [];
    for (const item of renamed.reverse()) {
      try {
        if (!item.existed) fsImpl.unlinkSync(item.file);
        else {
          const rollback = `${item.file}.${token}.rollback`;
          fsImpl.writeFileSync(rollback, item.original);
          fsImpl.renameSync(rollback, item.file);
        }
      } catch (rollbackError) { rollbackErrors.push(rollbackError); }
    }
    if (rollbackErrors.length) {
      throw new AggregateError([error, ...rollbackErrors], 'Registry pair write failed and rollback was incomplete');
    }
    throw error;
  } finally {
    for (const item of prepared) {
      try { if (fsImpl.existsSync(item.temp)) fsImpl.unlinkSync(item.temp); } catch { /* Preserve the original failure. */ }
    }
  }
}

module.exports = { writeRegistryPair };
