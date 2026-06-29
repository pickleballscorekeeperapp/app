const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const expected = {
  owner: 'abridegan',
  easFullName: '@abridegan/pickleball-score-keeper',
  easProjectId: '6f29222e-67f0-411b-851b-32e23775487e',
  iosBundleId: 'com.courtsideviewapp.pickleballscorekeeper',
  androidPackage: 'com.courtsideviewapp.pickleballscorekeeper',
  origin: 'https://github.com/pickleballscorekeeperapp/app.git',
};

function fail(message) {
  console.error(`Boundary check failed: ${message}`);
  process.exit(1);
}

function run(command, args) {
  return execFileSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

const appJson = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));
const expo = appJson.expo || {};

if (expo.owner !== expected.owner) {
  fail(`app.json owner is ${expo.owner}; expected ${expected.owner}`);
}

if (expo.extra?.eas?.projectId !== expected.easProjectId) {
  fail(
    `app.json EAS projectId is ${expo.extra?.eas?.projectId}; expected ${expected.easProjectId}`,
  );
}

if (expo.ios?.bundleIdentifier !== expected.iosBundleId) {
  fail(
    `iOS bundleIdentifier is ${expo.ios?.bundleIdentifier}; expected ${expected.iosBundleId}`,
  );
}

if (expo.android?.package !== expected.androidPackage) {
  fail(`Android package is ${expo.android?.package}; expected ${expected.androidPackage}`);
}

let origin;
try {
  origin = run('git', ['remote', 'get-url', 'origin']);
} catch {
  fail('git origin remote is not configured');
}

if (origin !== expected.origin) {
  fail(`git origin is ${origin}; expected ${expected.origin}`);
}

let easInfo;
try {
  easInfo = run('npx', ['eas', 'project:info', '--non-interactive']);
} catch {
  fail('could not read EAS project info; run `npx eas login` and retry');
}

if (!easInfo.includes(`fullName  ${expected.easFullName}`)) {
  fail(`EAS fullName did not match ${expected.easFullName}`);
}

if (!easInfo.includes(`ID        ${expected.easProjectId}`)) {
  fail(`EAS project ID did not match ${expected.easProjectId}`);
}

console.log('Boundary check passed: Pickleball app is linked to its own repo, bundle IDs, and EAS project.');
