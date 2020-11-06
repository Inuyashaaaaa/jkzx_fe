import { Intf, IGeneratedCode, ICreatorExtr } from '../types';
import { createBaseRequestStr } from './requesterCreator';
/** 生成 index.ts */
declare function createIndexStr(): IGeneratedCode;
/** 生成 redux.ts */
declare function createDynamicStr(interfaces: Array<Intf>, extr: ICreatorExtr): string;
declare const _default: {
    createIndexStr: typeof createIndexStr;
    createDynamicStr: typeof createDynamicStr;
    createBaseRequestStr: typeof createBaseRequestStr;
};
export default _default;
