import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { Select, Input } from '@/containers';
import GroupList from './Operation/GroupList';

export const PROCESS_CONFIGS = [
  {
    label: '不允许审批自己发起的审批单',
    value: 'can_start_by_self',
  },
];

export const TASKTYPE = {
  insertData: 'INPUT_DATA',
  modifyData: 'MODIFY_DATA',
  reviewData: 'REVIEW_DATA',
};

export const REVIEW_DATA = 'reviewData';

export const TRIGGERTYPE = [
  {
    label: '默认触发',
    value: 'all',
  },
];

export const OPERATION_MAP = {
  OR: '满足任一条件时触发',
  AND: '满足所有条件时触发',
};

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
  {
    label: '不等于',
    value: 'NE',
  },
];

export const SYMBOL_MAP = {
  GT: '>',
  LT: '<',
  EQ: '=',
  GE: '>=',
  LE: '<=',
  NE: '!=',
};

export const RETURN_NUMBER = 'returnNumberIndexImpl';
