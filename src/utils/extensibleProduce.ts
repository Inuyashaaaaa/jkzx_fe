import produce, { IProduce } from 'immer';
import _ from 'lodash';

const extensibleProduce: IProduce = (...args: any[]) => {
  const [base, recipe, listener] = args;
  const state = produce(base, recipe, listener);

  if (typeof state === 'function') {
    return (...theArguments: any[]) => {
      const _state = state(...theArguments);
      return judage(_state);
    };
  }

  return judage(state);
};

const judage = state => {
  return _.cloneDeep(state);
};

export { extensibleProduce };
