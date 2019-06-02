const path = require('path');
const shell = require('shelljs');
const mkdirp = require('mkdirp');
const fs = require('fs');

const TEST_CONTAINER = 'FE-test';
const PROD_CONTAINER = 'FE-prod';
const RELEASE_CONTAINER = 'FE-release';
// const FEATURE_CONTAINER = 'FE-feature';
const DOC_CONTAINER = 'FE-doc';
const USER_PATH = shell.exec('cd ~ && pwd').stdout.trim();

const BUNDLE_NAME = 'dist';
const DOC_BUNDLE_NAME = 'docs';

const exists = src => {
  return fs.existsSync(src);
};

const remove = src => {
  if (shell.exec(`rm -rf ${src}`).code !== 0) {
    throw new Error('cp wrong!');
  }
};

function cp(from, to) {
  if (!exists(to)) {
    mkdirp.sync(to);
  }

  if (shell.exec(`cp -R ${from} ${to}`).code !== 0) {
    throw new Error('cp wrong!');
  }
}

function upload(bundleName) {
  const remoteUsername = 'root';
  const remoteIp = '10.1.5.28';
  const branchName = process.env.CI_BUILD_REF_NAME;
  const remoteFolder = `/home/share/bct_product/frontend/${branchName}/`;
  const remotePaths = path.join(remoteFolder, bundleName);
  console.log(
    `upload: remoteUsername: ${remoteUsername} remoteIp: ${remoteIp} remoteFolder: ${remoteFolder} bundle: ${bundleName}`
  );
  try {
    shell.exec(
      `rsh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -l ${remoteUsername} ${remoteIp} rm -rf ${remotePaths}`
    );
    // https://stackoverflow.com/questions/3663895/ssh-the-authenticity-of-host-hostname-cant-be-established
    shell.exec(
      `scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -r ${bundleName} ${remoteUsername}@${remoteIp}:${remoteFolder}`
    );
    shell.exec(
      `./scripts/ci/greet.sh ${remoteIp}:${branchName}:${remotePaths} ${`前端打包上传完毕`} ${
        process.env.CI_COMMIT_SHA
      }`
    );
  } catch (error) {
    console.log(`上传失败: scp -r ${remotePaths} ${remoteUsername}@${remoteIp}:${remoteFolder}`);
  }
}

function bundle(prodContainerPath, distpath, filename = new Date().toISOString()) {
  cp(path.join(__dirname, distpath), path.join(prodContainerPath, filename));

  const lastPath = path.join(prodContainerPath, 'last');

  if (exists(lastPath)) {
    remove(lastPath);
  }

  cp(path.join(__dirname, distpath), lastPath);
}

function prod() {
  const prodContainerPath = path.join(USER_PATH, PROD_CONTAINER);

  // 更新 last
  bundle(prodContainerPath, '../dist/*');

  upload(BUNDLE_NAME);
}

function test() {
  const prodContainerPath = path.join(USER_PATH, TEST_CONTAINER);

  // 更新 last
  bundle(prodContainerPath, '../dist/*');

  upload(BUNDLE_NAME);
}

function release() {
  const prodContainerPath = path.join(USER_PATH, RELEASE_CONTAINER);

  // 更新 last
  bundle(prodContainerPath, '../dist/*');

  upload(BUNDLE_NAME);
}

function hotfix() {
  upload(BUNDLE_NAME);
}

function feature() {
  upload(BUNDLE_NAME);
}

function doc() {
  const prodContainerPath = path.join(USER_PATH, DOC_CONTAINER);

  bundle(prodContainerPath, '../docs/*');

  upload(DOC_BUNDLE_NAME);
}

console.log('deploy start!');

// 读取环境变量，区分测试和生产环境
const denv = process.env.DEPLOY_DIST;
console.log(`发布环境：${denv}`);

if (denv === 'hotfix') {
  hotfix();
}

if (denv === 'prod') {
  prod();
}

if (denv === 'release') {
  release();
}

if (denv === 'test') {
  test();
}

if (denv === 'feature') {
  feature();
}

if (denv === 'doc') {
  doc();
}
