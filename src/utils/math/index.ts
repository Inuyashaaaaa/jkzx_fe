import * as math from 'mathjs';

export interface MathParams {
  /**
   * 方法名
   * @default 'round'
   */
  method: string;
  /**
   *传入数值
   * @default [Math.E,3]
   */
  params: any[];
}

export const mathTy = (data: MathParams): string => {
  const { params, method } = data;
  return math[method](...params);
};

mathTy.express = math.evaluate;

export const params: MathParams = {} as any;
