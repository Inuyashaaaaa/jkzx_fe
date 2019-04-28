const path = require('path');
const shell = require('shelljs');
const mkdirp = require('mkdirp');
const fs = require('fs');

const TEST_CONTAINER = 'FE-test';
const PROD_CONTAINER = 'FE-prod';
const RELEASE_CONTAINER = 'FE-release';
const DOC_CONTAINER = 'FE-doc';
const USER_PATH = shell.exec('cd ~ && pwd').stdout.trim();

const exists = (src, dst) => {
  return fs.existsSync(dst);
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

function last(prodContainerPath) {
  const lastPath = path.join(prodContainerPath, 'last');

  if (exists(lastPath)) {
    remove(lastPath);
  }

  cp(path.join(__dirname, '../dist/*'), lastPath);
}

function prod() {
  const prodContainerPath = path.join(USER_PATH, PROD_CONTAINER);
  // @todo 获取当前 master 的标签作为文件名
  const filename = new Date().toISOString();
  console.log(`文件名：${filename}`);

  // 拷贝文件到目标位置
  cp(path.join(__dirname, '../dist/*'), path.join(prodContainerPath, filename));

  // 更新 last
  last(prodContainerPath);
}

function test() {
  const prodContainerPath = path.join(USER_PATH, TEST_CONTAINER);
  // 检测目标容器
  // @todo 获取当前 master 的标签作为文件名
  const filename = new Date().toISOString();
  console.log(`文件名：${filename}`);

  // 拷贝文件到目标位置
  cp(path.join(__dirname, '../dist/*'), path.join(prodContainerPath, filename));

  // 更新 last
  last(prodContainerPath);
}

function release() {
  const prodContainerPath = path.join(USER_PATH, RELEASE_CONTAINER);
  // 检测目标容器
  // @todo 获取当前 master 的标签作为文件名
  const filename = new Date().toISOString();
  console.log(`文件名：${filename}`);

  // 拷贝文件到目标位置
  cp(path.join(__dirname, '../dist/*'), path.join(prodContainerPath, filename));

  // 更新 last
  last(prodContainerPath);
}

function doc() {
  const prodContainerPath = path.join(USER_PATH, DOC_CONTAINER);

  cp(path.join(__dirname, '../docs/*'), path.join(prodContainerPath));
}

console.log('deploy start!');

// 读取环境变量，区分测试和生产环境
const denv = process.env.DEPLOY_DIST;
console.log(`发布环境：${denv}`);

if (denv === 'prod') {
  prod();
}

if (denv === 'release') {
  release();
}

if (denv === 'test') {
  test();
}

if (denv === 'doc') {
  doc();
}
