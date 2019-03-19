import { ValidationRule } from 'antd/lib/form';
import { IColDef, ILinkageMeta, ITableInput } from './types';

export type ILinkageMetaRules = ILinkageMeta<ValidationRule[]>;

export type ILinkageMetaInput = ILinkageMeta<ITableInput>;

export type ILinkageMetaExsitable = ILinkageMeta<boolean>;

export type ILinkageMetaGetValue = ILinkageMeta<(record: any) => any | void>;

export const normalizeRules = (record: any, colDef: IColDef): ILinkageMetaRules => {
  const rules = colDef.rules;
  if (!rules) {
    return {
      value: [],
      depends: [],
    };
  }
  if (typeof rules === 'function') {
    const result = rules(record);
    if (Array.isArray(result)) {
      return {
        depends: [],
        value: result,
      };
    }
    return result;
  }
  if (Array.isArray(rules)) {
    return {
      depends: [],
      value: rules,
    };
  }
  throw new Error('normalRules: not match!');
};

export const normalizeInput = (record: any, colDef: IColDef): ILinkageMetaInput => {
  const input = colDef.input;
  if (input === undefined) {
    return {
      value: {},
      depends: [],
    };
  }
  if (typeof input === 'function') {
    const result = input(record);
    if ((result as ILinkageMetaInput).depends) {
      return result as ILinkageMetaInput;
    }
    return {
      value: result,
      depends: [],
    };
  }
  if (typeof input === 'object') {
    return {
      depends: [],
      value: input,
    };
  }
  throw new Error('normalInput: not match!');
};

export const normalizeExsitable = (data: any, colDef): ILinkageMetaExsitable => {
  const exsitable = colDef.exsitable;
  if (exsitable === undefined) {
    return {
      value: true,
      depends: [],
    };
  }
  if (typeof exsitable === 'function') {
    const result = exsitable({ data, colDef });
    if (typeof result === 'boolean' || result === undefined) {
      return {
        depends: [],
        value: result,
      };
    }
    return result;
  }
  if (typeof exsitable === 'boolean') {
    return {
      depends: [],
      value: exsitable,
    };
  }
  throw new Error('normalExsitable: not match!');
};

export const normalizeGetValue = (data: any, colDef: IColDef): ILinkageMetaGetValue => {
  const getValue = colDef.getValue;
  if (!getValue) {
    return {
      value: undefined,
      depends: [],
    };
  }
  if (typeof getValue === 'function') {
    return getValue({ colDef, data });
  }
  if (typeof getValue === 'object') {
    return getValue;
  }
  throw new Error('normalGetValue: not match!');
};
