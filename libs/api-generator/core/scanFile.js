"use strict";
exports.__esModule = true;
exports.findRapperVersion = exports.findChangeFiles = exports.findDeleteFiles = void 0;
/**
 * 扫描项目文件，排除是否存在 rap 接口已删除，但是项目仍然在使用的接口
 */
var fs = require("fs");
var path = require("path");
var chalk_1 = require("chalk");
var path_1 = require("path");
var utils_1 = require("../utils");
/**
 * 获取所有需要扫描的文件
 * @param parentPath
 */
function getFiles(parentPath) {
    var fileList = [];
    /* 不扫描无效路径 */
    if (parentPath.indexOf('/.') > -1 || parentPath.indexOf('node_modules') > -1) {
        return fileList;
    }
    var files = [];
    try {
        files = fs.readdirSync(parentPath);
    }
    catch (err) { }
    files.forEach(function (item) {
        item = path.join(parentPath, item);
        if (item.indexOf('src') < 0) {
            return;
        }
        var stat = fs.statSync(item);
        try {
            if (stat.isDirectory()) {
                fileList = fileList.concat(getFiles(item));
            }
            else if (stat.isFile()) {
                fileList.push(item);
            }
        }
        catch (error) {
            console.log(chalk_1["default"].red("rapper: Rap \u63A5\u53E3\u5F15\u7528\u626B\u63CF\u5931\u8D25, " + error));
        }
    });
    return fileList;
}
/** 校验文件 MD5，是否被改动 */
function isFileChange(contentArr) {
    var matchMD5 = contentArr[0].match(/\/\*\smd5:\s(\S*)\s\*\//) || [];
    var oldMD5 = matchMD5[1];
    /** 老版本没有写入md5，所以这里需要兼容 */
    if (!oldMD5) {
        return false;
    }
    return oldMD5 !== utils_1.getMd5(contentArr.slice(1).join('\n'));
}
function scanAllfiles(interfaces, fileList) {
    var strReg = /[\'\"]+(GET|POST|PUT|DELETE|OPTIONS|PATCH|HEAD)\/([^\'\"]*)[^(REQUEST)(SUCCESS)(FAILURE)]{1}[\'\"]+/g;
    var result = [];
    fileList.forEach(function (filePath) {
        /** 文件的扩展名 */
        var extName = path.extname(filePath);
        if (!['.ts', '.js', '.vue', '.es'].includes(extName)) {
            return;
        }
        /** 读取文件的内容 */
        var content = fs.readFileSync(filePath, 'utf-8') || '';
        /** 每一行比对 */
        content.split('\n').forEach(function (rowText, i) {
            var regResult = rowText.match(strReg);
            if (regResult && regResult.length > 0) {
                regResult.forEach(function (item) {
                    item = item.replace(/\'|\"/gi, '');
                    /** 在 interfaces 里面找不到，说明无效Rap引用了 */
                    var isExist = !!interfaces.find(function (_a) {
                        var modelName = _a.modelName;
                        return modelName === item;
                    });
                    if (!isExist) {
                        result.push({
                            key: item,
                            filePath: path_1.resolve(process.cwd(), filePath),
                            start: rowText.indexOf(item),
                            line: i + 1
                        });
                    }
                });
            }
        });
        return false;
    });
    return result;
}
/**
 * 扫描找出是否有被删除的接口
 * @param interfaces, Rap平台同步的接口
 * @param excludePath, 排除检测的文件 (已默认排除 node_modules，无需配置此项)
 */
function findDeleteFiles(interfaces, excludePaths) {
    var fileList = getFiles('./');
    fileList = fileList.filter(function (file) {
        file = path_1.resolve(process.cwd(), file);
        return !excludePaths.find(function (exclude) { return file.indexOf(path_1.resolve(process.cwd(), exclude)) > -1; });
    });
    return scanAllfiles(interfaces, fileList);
}
exports.findDeleteFiles = findDeleteFiles;
/**
 * 扫描找出生成的模板文件是否被手动修改过
 * @param rapperPath, 模板文件地址
 */
function findChangeFiles(rapperPath) {
    var fileList = getFiles(rapperPath);
    var changeList = [];
    fileList.forEach(function (filePath) {
        /** 读取文件的内容 */
        var content = fs.readFileSync(filePath, 'utf-8') || '';
        /** 校验文件 MD5，是否被改动 */
        if (isFileChange(content.split(/\r|\n|\r\n/))) {
            changeList.push(path_1.resolve(process.cwd(), filePath));
        }
    });
    return changeList;
}
exports.findChangeFiles = findChangeFiles;
/**
 * 从模板文件的前6行中扫描找出生成模板文件的 rapper 版本
 */
function findRapperVersion(rapperPath) {
    var version = '';
    try {
        var content = fs.readFileSync(rapperPath + "/index.ts", 'utf-8') || '';
        var contentArr = content.split(/\r|\n|\r\n/);
        if (contentArr.length) {
            var matchMD5 = contentArr
                .slice(0, 6)
                .join('\n')
                .match(/\/\*\sRapper版本:\s(\S*)\s\*\//) || [];
            version = matchMD5[1];
        }
    }
    catch (err) { }
    return version;
}
exports.findRapperVersion = findRapperVersion;
