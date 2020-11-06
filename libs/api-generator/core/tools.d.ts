import { Interface, Intf, IUrlMapper } from '../types';
/** 从rap查询所有接口数据 */
export declare function getInterfaces(rapApiUrl: string): Promise<Intf[]>;
/**
 * 转换rap接口名称
 */
export declare function rap2name(itf: Interface.IRoot, urlMapper?: IUrlMapper): string;
/** 给接口增加 modelName */
export declare function getIntfWithModelName(intfs: Array<Interface.IRoot>, urlMapper?: IUrlMapper): Array<Intf>;
/** 接口去重 */
export declare function uniqueItfs(itfs: Array<Intf>): Intf[];
/** 生成提示文案 */
export declare function creatHeadHelpStr(rapUrl: string, projectId: number, rapperVersion: string): string;
/**
 * 生成接口提示文案
 * @param rapUrl Rap平台地址
 * @param itf 接口信息
 * @param extra 额外信息
 */
export declare function creatInterfaceHelpStr(rapUrl: string, itf: Intf, extra?: string): string;
