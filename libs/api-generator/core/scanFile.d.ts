import { Intf } from '../types';
declare type TScanResult = Array<{
    /** 被删除的接口 modelName */
    key: string;
    /** 被删除的接口所在文件 */
    filePath: string;
    /** 所在文件的行数 */
    line: number;
    /** 所在文件的列数 */
    start: number;
}>;
/**
 * 扫描找出是否有被删除的接口
 * @param interfaces, Rap平台同步的接口
 * @param excludePath, 排除检测的文件 (已默认排除 node_modules，无需配置此项)
 */
export declare function findDeleteFiles(interfaces: Array<Intf>, excludePaths: string[]): TScanResult;
/**
 * 扫描找出生成的模板文件是否被手动修改过
 * @param rapperPath, 模板文件地址
 */
export declare function findChangeFiles(rapperPath: string): string[];
/**
 * 从模板文件的前6行中扫描找出生成模板文件的 rapper 版本
 */
export declare function findRapperVersion(rapperPath: string): string;
export {};
