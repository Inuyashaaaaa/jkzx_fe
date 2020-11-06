import { IGeneratedCode } from './types';
export declare function withoutExt(p: string): string;
export declare function relativeImport(from: string, to: string): string;
export declare function mixGeneratedCode(codeArr: Array<IGeneratedCode>): string;
export declare function writeFile(filepath: string, contents: string): Promise<unknown>;
export declare function moveFile(from: string, to: string): Promise<unknown>;
/**
 * 命令是否在根目录执行
 */
export declare function isInRoot(): boolean;
/** 获取文件md5 */
export declare function getMd5(fileContent: string): string;
export declare function getOldProjectId(rappperPath: string): string | undefined;
/** 模板文件覆盖确认 */
export declare function templateFilesOverwriteConfirm(): Promise<any>;
/** 存在接口依赖被删确认 */
export declare function templateFilesRelyConfirm(): Promise<any>;
/** 获取当前包名 */
export declare function getPackageName(): any;
