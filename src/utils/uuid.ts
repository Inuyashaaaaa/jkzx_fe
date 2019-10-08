export interface UuidParams {
  /* 基础因子 */
  base?: string;
}

export const uuid: (params: UuidParams) => string = (params = {}) => {
  const { base = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' } = params;
  return base.replace(/[xy]/g, c => {
    // eslint-disable-next-line
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const params: UuidParams = (() => {}) as any;
