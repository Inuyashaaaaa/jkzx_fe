export const operation = [
  {
    label: '满足任一条件时触发',
    value: 'OR',
  },
  {
    label: '满足所有条件时触发',
    value: 'AND',
  },
];

export const OPERATION_MAP = {
  OR: '满足任一条件时触发',
  AND: '满足所有条件时触发',
};

export const symbol = [
  {
    label: '大于',
    value: 'GT',
  },
  {
    label: '小于',
    value: 'LT',
  },
  {
    label: '等于',
    value: 'EQ',
  },
  {
    label: '大于等于',
    value: 'GE',
  },
  {
    label: '小于等于',
    value: 'LE',
  },
];

export const SYMBOL_MAP = {
  GT: '>',
  LT: '<',
  EQ: '=',
  GE: '>=',
  LE: '<=',
};

export const RETURN_NUMBER = 'returnNumberIndexImpl';
