/* eslint-disable no-console, no-underscore-dangle */
import moment from 'moment';
import colorLog from 'log-with-style';
import { isType } from '@/utils';
import lodash from 'lodash';

const consoleLog = console.log;
const consoleGroup = console.group;
const consoleGroupEnd = console.groupEnd;

let lastDate = null;
const colors = ['teal', 'blue', 'red'];
const defaultColor = 'green';

function checkEnv(cb) {
  if (process.env.NODE_ENV === 'production') return;
  const now = moment();
  const nowFormat = now.format('HH:mm:ss');
  if (lastDate) {
    consoleLog(`%c${now.diff(lastDate)}ms`, 'color: grey');
  }
  lastDate = now;
  consoleGroup(nowFormat);
  cb();
  consoleGroupEnd(nowFormat);
}

function getParams(args) {
  const titles = lodash.dropRight(args);
  const body = lodash.last(args);
  return { titles, body };
}

function _log({ titles, body }) {
  colorLog(
    titles
      .map((text, index) => {
        return `[c="color:${colors[index] || defaultColor}"]${text}[c]`;
      })
      .join('.')
  );
  consoleLog(body);
}

function assert(predicate, ...args) {
  return checkEnv(() => {
    let result = predicate;
    if (isType(predicate, 'Function')) {
      result = assert();
    }
    if (!result) {
      _log(getParams(args));
    }
  });
}

function log(...args) {
  return checkEnv(() => {
    _log(getParams(args));
  });
}

export { log, assert };
