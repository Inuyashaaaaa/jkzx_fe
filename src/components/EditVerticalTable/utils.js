import lodash from 'lodash';
import { SEPARATOR } from './constants';
import { assert } from '@/utils';
import createEventBus from '@/utils/eventBus';

export const joinCellFieldKey = (key, id) => `${key}${SEPARATOR}${id}`;

export const splitCellFieldKey = str => {
  const [key, id] = str.split(SEPARATOR);
  return { key, id };
};

/* eslint-disable no-restricted-syntax, consistent-return */
export function findColumn(legRuls, dataIndex) {
  if (!dataIndex) return undefined;
  for (const rule of legRuls) {
    // dataIndex 不会和有 children 的 cloumn 一样的，如果出现直接返回，否则去检查 children
    if (rule.dataIndex === dataIndex) {
      return rule;
    }
    if (rule.children) {
      const targetRule = findColumn(rule.children, dataIndex);
      if (targetRule) {
        return targetRule;
      }
    }
  }
}
/* eslint-enable */

export function fillValues(data, columns, fieldName, dist = {}) {
  // eslint-disable-next-line consistent-return
  columns.forEach(column => {
    if (column.children) {
      return fillValues(data, column.children, fieldName, dist);
    }
    const { [fieldName]: value } = column;
    if (value) {
      assert(column.dataIndex, `${column.name}.dataIndex must be exist`);
      // eslint-disable-next-line no-param-reassign
      dist[column.dataIndex] = lodash.isFunction(value) ? value(data) : value;
    } else if (data[column.dataIndex]) {
      // eslint-disable-next-line no-param-reassign
      dist[column.dataIndex] = data[column.dataIndex];
    }
  });
  return dist;
}

export function createDataSourceItem({
  leg,
  title,
  data = fillValues({}, leg.columns, 'defaultValue'),
  id = String(new Date().getTime()),
}) {
  return {
    id,
    // 根据 value 初始化 rowData
    data,
    $title: title,
    $type: leg.type, // 判断类型变化时候要用，这里表示 dataSourceItem 的原类型，是唯一的
    $types: [leg.type],
  };
}

export function replaceChangedDataSourceItem(dataSource, nextItem) {
  return dataSource.map(item => {
    if (item.id === nextItem.id) {
      return nextItem;
    }
    return item;
  });
}

export const EventBus = createEventBus();
