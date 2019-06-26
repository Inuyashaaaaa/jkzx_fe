import _ from 'lodash';
import { remove } from './utils';

/**
 * toggle value
 *
 * @example
 * toggleItem([1, 2, 3], 1) => [2, 3]
 * toggleItem([1, 2, 3], 4) => [1, 2, 3, 4]
 * toggleItem([], 1) => [1]
 * toggleItem([1, 2, 3], 10, item => item === 10) => [2, 3]
 *
 * @export
 * @param {*} array
 * @param {*} item
 * @param {*} [defaultItem=item]
 * @return array
 */
export function toggleItem(array, item, predicate?: (item: any, index: number) => boolean) {
  predicate = predicate || (it => it === item);
  if (!array || array.length === 0) return [item];
  const findIndex = array.findIndex(predicate);
  if (findIndex !== -1) return remove(array, findIndex);
  return array.concat(item);
}
