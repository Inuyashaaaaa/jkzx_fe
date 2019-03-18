import lodash from 'lodash';
import { assert } from '@/lib/utils';

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
  extraLegs = [],
  title,
  data = fillValues({}, leg.columns, 'defaultValue'),
  id = String(new Date().getTime()),
}) {
  return {
    id,
    // 根据 value 初始化 rowData
    data,
    $title: title,
    // 判断类型变化时候要用，这里表示 dataSourceItem 的原类型，是唯一的
    // @todo 类型变化判断使用 @types
    $type: leg.type,
    $types: [leg.type, ...extraLegs.map(item => item.type)],
  };
}
