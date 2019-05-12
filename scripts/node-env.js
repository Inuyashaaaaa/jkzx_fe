#!/usr/bin/env node
const process = require('child_process');
const pjs = require('../package.json');

const hope = pjs['hope-env'];

if (!hope) {
  throw new Error('hope env is not defiend!');
}

process.exec('node -v', (nerror, nodeV) => {
  nodeV = nodeV.trim();
  if (nerror) {
    throw new Error(nerror);
  }
  process.exec('yarn -v', (yerror, yarnV) => {
    yarnV = yarnV.trim();
    if (yerror) {
      throw new Error(yerror);
    }

    const result = nodeV === hope.node && yarnV === hope.yarn;

    console.log(`
${!result ? '环境错误，请升级对应模块' : '环境匹配，允许正常启动'}

node: ${nodeV}${`${nodeV !== hope.node ? ` -> ${hope.node}` : ''}`}
yarn: ${yarnV}${`${yarnV !== hope.yarn ? ` -> ${hope.yarn}` : ''}`}
`);

    if (!result) {
      throw new Error('env error');
    }
  });
});
