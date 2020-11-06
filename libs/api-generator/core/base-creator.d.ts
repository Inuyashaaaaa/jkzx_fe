import { Intf, IGeneratedCode, ICreatorExtr } from '../types';
/** 生成 Models 文件 */
export declare function createModel(interfaces: Array<Intf>, extr: ICreatorExtr): Promise<string>;
/** 生成 IResponseTypes */
export declare function createResponseTypes(interfaces: Array<Intf>): string;
export declare const createSchema: (itf: Intf) => string;
export declare function createBaseRequestStr(interfaces: Array<Intf>, extr: ICreatorExtr): Promise<string>;
export declare function createBaseIndexCode(): IGeneratedCode;
