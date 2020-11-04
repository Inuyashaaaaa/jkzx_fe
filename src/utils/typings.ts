export type PickParamsType<T> = T extends any[] ? T[0] : any;

export type PickRPCParamsType<T> = T extends any[]
  ? T[0] extends { method: any; params: any }
    ? T[0]['params']
    : any
  : any;

// 提取服务的返回值类型
export type PickServiceReturnType<T> = T extends (...args: any) => Promise<infer P> ? P : any;
