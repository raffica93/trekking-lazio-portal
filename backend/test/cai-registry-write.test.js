const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { writeRegistryPair } = require('../scripts/cai-registry-write');

test('registry pair write prepares both outputs and rolls back if second rename fails', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cai-registry-write-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const first = path.join(directory, 'backend.json');
  const second = path.join(directory, 'frontend.json');
  fs.writeFileSync(first, 'old-backend');
  fs.writeFileSync(second, 'old-frontend');

  let failSecondRename = true;
  let firstRename = true;
  const injectedFs = {
    mkdirSync: (...args) => fs.mkdirSync(...args),
    existsSync: (...args) => fs.existsSync(...args),
    readFileSync: (...args) => fs.readFileSync(...args),
    writeFileSync: (...args) => fs.writeFileSync(...args),
    unlinkSync: (...args) => fs.unlinkSync(...args),
    renameSync: (from, to) => {
      if (firstRename) {
        firstRename = false;
        assert.ok(fs.readdirSync(directory).some(name => name.endsWith('.1.tmp')), 'second output is staged before the first rename');
      }
      if (to === second && failSecondRename) {
        failSecondRename = false;
        throw new Error('injected second rename failure');
      }
      return fs.renameSync(from, to);
    }
  };

  assert.throws(() => writeRegistryPair([first, second], 'new-content', injectedFs), /injected second rename failure/);
  assert.equal(fs.readFileSync(first, 'utf8'), 'old-backend');
  assert.equal(fs.readFileSync(second, 'utf8'), 'old-frontend');
  assert.deepEqual(fs.readdirSync(directory).sort(), ['backend.json', 'frontend.json']);
});
