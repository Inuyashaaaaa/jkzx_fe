import _ from 'lodash';
import Mock from 'mockjs';
import moment from 'moment';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import React from 'react';
import uuidv4 from 'uuid/v4';

// based on vanilla lodash, todo: rewrite with lodash/fp
// uses isPlainObject to detect ojbects to go deep into
// detects circular references using Set()

export const mapValuesDeep = (originalObj, mapFunc) => {
  const visitedObjects = new Set();

  const mapValues = (originalObj, mapFunc) =>
    _.mapValues(originalObj, value => {
      if (_.isPlainObject(value)) {
        // detecting circular references
        if (visitedObjects.has(value)) {
          return value;
        }

        visitedObjects.add(value);
        return mapValues(value, mapFunc);
      }

      return mapFunc(value);
    });

  return mapValues(originalObj, mapFunc);
};

export const assertType = (condition, used, defaultVal, message) => {
  let result = false;
  if (typeof condition === 'function') {
    result = condition();
  }
  result = condition;

  if (result) {
    return used;
  }
  return defaultVal;
};

export function someDeep(arr, cb, fieldName = 'children') {
  return arr.some(item => {
    if (item[fieldName]) {
      return someDeep(item[fieldName], cb, fieldName);
    }
    return cb(item);
  });
}

export const isAllSame = arr => {
  return arr.every(item => item === arr[0]);
};

export const securityCall = (callback, ok, errorHandle) => {
  try {
    const val = callback();
    if (val instanceof Promise) {
      return val.then(ok).catch(errorHandle);
    }
    return ok(val);
  } catch (error) {
    return errorHandle(error);
  }
};

export const judagePromise = (val, cb) => {
  if (val instanceof Promise) {
    return val.then(cb);
  }
  return cb(val);
};

export const getDiffProps = (props, next) => {
  const diff = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in props) {
    if (props[key] !== next[key]) {
      diff.push(key);
    }
  }
  return diff;
};

export const mockData = (fields, range = '5-10'): any => {
  const fake = Mock.mock({
    [`list|${range}`]: [
      {
        ..._.mapValues(fields, val => {
          if (Array.isArray(val)) {
            return () => {
              return val[_.random(val.length - 1)];
            };
          }
          return val;
        }),
      },
    ],
  }).list;

  if (Array.isArray(fake)) {
    return fake.map(item => {
      return { ...item, id: uuidv4() };
    });
  }

  return {
    ...fake,
    id: uuidv4(),
  };
};

export function isShallowEqual(object, other) {
  if (typeof object !== 'object' || typeof other !== 'object') {
    return object === other;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in object) {
    if (object[key] !== other[key]) {
      return false;
    }
  }
  return true;
}

export function isType(target, Type) {
  if (Type.constructor === String) {
    // Compatible writes
    Type = { name: Type };
  }
  return Object.prototype.toString.call(target) === `[object ${Type.name}]`;
}

export function notType(target, Type) {
  return !isType(target, Type);
}

// fixed 返回一个新对象
export function set(target, path, value) {
  if (isType(value, 'Function')) {
    return _.set({ ...target }, path, value(_.get(target, path)));
  }
  return _.set({ ...target }, path, value);
}

export const wrapType = (item, Type, defaults?) => {
  if (notType(item, Type)) {
    return defaults || new Type(item);
  }
  return item;
};

export const assert = (condition, message) => {
  if (!wrapType(condition, Function, () => !!condition)()) {
    throw new Error(message);
  }
};

// deprecated => wrap
// 始终返回 array
export function getArray(arr) {
  return isType(arr, 'Array') ? arr : [arr];
}

/**
 * return a new maped array
 *
 * @export
 * @param {*} arr
 * @param {*} cb
 * @param {*} fieldName
 * @param {boolean} [onlyValue=true] 是否只会返回数值
 * @returns
 */
export function mapDeep(arr, cb, fieldName, onlyValue = true) {
  return arr.map(item => {
    if (fieldName && item[fieldName]) {
      if (onlyValue) {
        return mapDeep(item[fieldName], cb, fieldName, onlyValue);
      }
      return {
        ...item,
        [fieldName]: mapDeep(item[fieldName], cb, fieldName, onlyValue),
      };
    }
    return cb(item);
  });
}

export function wrapDebounce(timeout = 200) {
  return function wrapper(cb) {
    return _.debounce(cb, timeout);
  };
}

/**
 * toggle value
 *
 * @example
 * toggleItem([1, 2, 3], 1) => [2, 3]
 * toggleItem([1, 2, 3], 4) => [1, 2, 3, 4]
 * toggleItem([], 1) => [1]
 * toggleItem([1, 2, 3], item => item === 1) => [2, 3]
 *
 * @export
 * @param {*} array
 * @param {*} item
 * @param {*} [defaultItem=item]
 * @returns
 */
export function toggleItem(array, item, predicate?: (item: any) => boolean) {
  if (!array || array.length === 0) return [item];
  if (predicate ? _.find(array, predicate) : array.indexOf(item) !== -1) {
    return array.filter(it => (predicate ? !predicate(it) : it !== item));
  }
  return array.concat(item);
}

// ?
export function toggleObject(obj, key) {
  if (!obj) return { [key]: true };
  return {
    ...obj,
    [key]: !obj[key],
  };
}

export function delay<T = any>(timeout, result?) {
  return new Promise<T>((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(typeof result === 'function' ? result() : result);
      }, timeout);
    } catch {
      reject();
    }
  });
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    // tslint:disable-next-line:no-shadowed-variable
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export function removeWithIndex(arr, indexs) {
  const nextArr = [...arr];
  let removeItemLen = 0;
  indexs.forEach(index => {
    // eslint-disable-next-line
    nextArr.splice(index - removeItemLen++, 1);
  });
  return nextArr;
}

export function baseTree(arr, paths, labelPaths) {
  if (!arr || arr.length === 0) return [];

  if (paths.length !== labelPaths.length) {
    throw new Error('arr2treeOptions: paths.length should be equal with labelPaths.length.');
  }

  const deeps = paths.map((path, index) => {
    return _.unionBy(arr, item => item[paths[index]]).filter(item => !!item[paths[index]]);
  });

  function getTree(deeps, _item?, index = 0) {
    const deep = deeps[index];

    if (!deep) return [];

    return deep
      .filter(item => {
        if (!_item) {
          return true;
        }

        return _.range(index).every(iindex => {
          return item[paths[iindex]] === _item[paths[iindex]];
        });
      })
      .map(item => {
        return {
          data: item,
          label: item[labelPaths[index]],
          value: item[paths[index]],
          children: getTree(deeps, item, index + 1),
        };
      });
  }
  return getTree(deeps);
}

export function arr2treeOptions(arr, paths, labelPaths) {
  if (!arr || arr.length === 0) return [];
  const length = paths.length;
  if (paths.length !== labelPaths.length) {
    throw new Error('arr2treeOptions: paths.length should be equal with labelPaths.length.');
  }
  const deeps = _.unionBy(arr, paths[0]).map(item => item[paths[0]]);
  function getTreeData(a, index) {
    if (index === length) {
      return;
    }
    if (a === null) return;
    const data = _.uniq(
      arr
        .filter(iitem => {
          return iitem[paths[index]] === a;
        })
        .map(value => value[paths[index + 1]])
    );
    return {
      [a]: data.map(c => getTreeData(c, index + 1)),
    };
  }
  const x = deeps.map(item => {
    return getTreeData(item, 0);
  });
  function getTree(deep, index = 0) {
    if (!deep) return [];

    return deep.map(value => {
      if (Object.keys(value)[0] === undefined) return;
      if (_.values(value)[0][0] === undefined) {
        return {
          data: _.values(value)[0],
          label: arr.find(params => params[paths[index]] === Object.keys(value)[0])[
            labelPaths[index]
          ],
          value: Object.keys(value)[0],
          children: [],
        };
      }
      return {
        data: _.values(value)[0],
        label: arr.find(params => params[paths[index]] === Object.keys(value)[0])[
          labelPaths[index]
        ],
        value: Object.keys(value)[0],
        children: getTree(_.values(value)[0], index + 1),
      };
    });
  }
  return getTree(x);
}

export const remove = (array: any[], index: number): any[] => {
  if (!Array.isArray(array)) return array;
  const clone = [...array];
  clone.splice(index, 1);
  return clone;
};

export const insert = (array: any[], index: number, data: any): any[] => {
  if (!Array.isArray(array)) return array;
  const clone = [...array];
  clone.splice(index, 1, data);
  return clone;
};
