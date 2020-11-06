import { Intf, ICreatorExtr } from '../types';
/** 生成 Action 定义 */
export declare function createActionStr(interfaces: Array<Intf>, extr: ICreatorExtr): string;
/** 生成 useResponse，useAllResponse */
export declare function createUseRapStr(interfaces: Array<Intf>, extr: ICreatorExtr): string;
export declare function createBaseSelectorStr(interfaces: Array<Intf>): string;
export declare function createDataSelectorStr(interfaces: Array<Intf>): string;
