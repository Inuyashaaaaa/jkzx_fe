export interface MethodParams {
  /**
   * 进行数学运算
   * @default mathTy.express('1+2/3-4')
   */
  express: () => string;
  /**
   *将返回的数据转换为正确的数学格式
   * @default mathTy({method:"chain",params:[3,4]}).done()
   */
  done: () => string;
  /**
   *将返回的数据转换为正确的数学格式
   * @default mathTy({method:"matrix",params:[[1,4,9,16,25]]}).valueOf()
   */
  valueOf: () => string;
}

export const Methods: MethodParams = {} as any;
