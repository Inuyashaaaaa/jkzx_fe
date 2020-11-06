#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var index_1 = require("./index");
var path_1 = require("path");
var chalk_1 = require("chalk");
var program = require("commander");
var loadCfg = require("@ty-fee-tools/rc-load");
// Todo: 增加 checkUpdate
(function () {
    program
        .option('--type <typeName>', '设置类型')
        .option('--apiUrl <apiUrl>', '设置Rap平台后端地址')
        .option('--apiOrigin <apiOrigin>', '设置Rap平台 url origin')
        .option('--rapUrl <rapUrl>', '设置Rap平台前端地址')
        .option('--rapperPath <rapperPath>', '设置生成代码所在目录')
        .option('--resSelector <resSelector>', '响应数据类型转换配置')
        .option('--typeRef <typeRef>', '数据转换依赖的类型导入');
    program.parse(process.argv);
    var rapperConfig;
    if (program.type && program.apiUrl && program.rapUrl) {
        /** 通过 scripts 配置 */
        rapperConfig = {
            type: program.type,
            apiOrigin: program.apiOrigin || new URL(program.apiUrl).origin,
            apiUrl: program.apiUrl,
            rapUrl: program.rapUrl,
            typeRef: program.typeRef,
            rapperPath: path_1.resolve(process.cwd(), program.rapperPath || './src/models/rapper/')
        };
        if (program.resSelector) {
            rapperConfig = __assign(__assign({}, rapperConfig), { resSelector: program.resSelector });
        }
    }
    else {
        /** 通过 package.json 的 rapper 字段配置 */
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        var packageConfig = loadCfg({
            name: 'servicegen',
            cwd: process.cwd()
        });
        if (!packageConfig) {
            console.log(chalk_1["default"].yellow('尚未在 package.json 中配置 rapper，请参考配置手册'));
            process.exit(1);
        }
        var type = packageConfig.type, rapUrl = packageConfig.rapUrl, apiUrl = packageConfig.apiUrl, apiOrigin = packageConfig.apiOrigin, rapperPath = packageConfig.rapperPath, resSelector = packageConfig.resSelector, typeRef = packageConfig.typeRef;
        rapperConfig = {
            type: type || 'redux',
            apiOrigin: apiOrigin || new URL(apiUrl).origin,
            apiUrl: apiUrl,
            rapUrl: rapUrl,
            typeRef: typeRef,
            rapperPath: path_1.resolve(process.cwd(), rapperPath || './src/models/rapper/')
        };
        if (resSelector) {
            rapperConfig = __assign(__assign({}, rapperConfig), { resSelector: resSelector });
        }
    }
    index_1.rapper(rapperConfig);
})();
