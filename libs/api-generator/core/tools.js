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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.creatInterfaceHelpStr = exports.creatHeadHelpStr = exports.uniqueItfs = exports.getIntfWithModelName = exports.rap2name = exports.getInterfaces = void 0;
var chalk_1 = require("chalk");
var axios_1 = require("axios");
var _ = require("lodash");
function updateURLParameter(url, param, paramVal) {
    var newAdditionalURL = '';
    var tempArray = url.split('?');
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = '';
    if (additionalURL) {
        tempArray = additionalURL.split('&');
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = '&';
            }
        }
    }
    var rowsTxt = temp + '' + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rowsTxt;
}
/** 从rap查询所有接口数据 */
function getInterfaces(rapApiUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, modules, collaborators, interfaces, collaboratorsInterfaces;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get(rapApiUrl, { timeout: 1000 * 20 })];
                case 1:
                    response = _a.sent();
                    data = response.data.data;
                    modules = data.modules;
                    collaborators = data.collaborators;
                    interfaces = _(modules)
                        .map(function (m) { return m.interfaces; })
                        .flatten()
                        .value();
                    if (!collaborators.length) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all(collaborators.map(function (e) {
                            return getInterfaces(updateURLParameter(updateURLParameter(rapApiUrl, 'id', e.id.toString()), 'token', e.token));
                        }))];
                case 2:
                    collaboratorsInterfaces = _a.sent();
                    // 协作仓库有重复接口，将被主仓库覆盖
                    interfaces = _.unionBy(interfaces, _.flatten(collaboratorsInterfaces), function (item) {
                        // 描述中如果存在唯一标示定义，优先使用
                        var matches = item.description.match(/\${union:\s?(.*)}/);
                        if (matches) {
                            var __ = matches[0], unionID = matches[1];
                            return unionID;
                        }
                        // 使用 method-url 作为 key
                        return item.method + "-" + item.url;
                    });
                    _a.label = 3;
                case 3: return [2 /*return*/, interfaces];
            }
        });
    });
}
exports.getInterfaces = getInterfaces;
/**
 * 转换rap接口名称
 */
function rap2name(itf, urlMapper) {
    if (urlMapper === void 0) { urlMapper = function (t) { return t; }; }
    var method = itf.method, url = itf.url, projectId = itf.repositoryId, id = itf.id;
    var apiUrl = urlMapper(url);
    var regExp = /^(?:https?:\/\/[^\/]+)?(\/?.+?\/?)(?:\.[^./]+)?$/;
    var regExpExec = regExp.exec(apiUrl);
    if (!regExpExec) {
        console.log(chalk_1["default"].red("\n  \u2718 \u60A8\u7684rap\u63A5\u53E3url\u8BBE\u7F6E\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u53C2\u8003\u683C\u5F0F\uFF1A/api/test.json (\u63A5\u53E3url:" + apiUrl + ", \u9879\u76EEid:" + projectId + ", \u63A5\u53E3id:" + id + ")\n"));
        return;
    }
    var urlSplit = apiUrl.split('/');
    //只去除第一个为空的值，最后一个为空保留
    //有可能情况是接口 /api/login 以及 /api/login/ 需要同时存在
    if (urlSplit[0].trim() === '') {
        urlSplit.shift();
    }
    urlSplit.unshift(method.toLocaleUpperCase());
    return urlSplit.join('/');
}
exports.rap2name = rap2name;
/** 给接口增加 modelName */
function getIntfWithModelName(intfs, urlMapper) {
    if (urlMapper === void 0) { urlMapper = function (t) { return t; }; }
    return intfs.map(function (itf) { return (__assign(__assign({}, itf), { modelName: rap2name(itf, urlMapper) })); });
}
exports.getIntfWithModelName = getIntfWithModelName;
/** 接口去重 */
function uniqueItfs(itfs) {
    var itfMap = new Map();
    itfs.forEach(function (itf) {
        var name = itf.modelName;
        if (itfMap.has(name)) {
            itfMap.get(name).push(itf);
        }
        else {
            itfMap.set(name, [itf]);
        }
    });
    var newItfs = [];
    var hasDuplicate = false;
    itfMap.forEach(function (dupItfs) {
        // 后更改的在前面
        dupItfs.sort(function (a, b) { return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(); });
        newItfs.push(dupItfs[0]);
        if (!hasDuplicate && dupItfs.length > 1) {
            hasDuplicate = true;
        }
    });
    hasDuplicate && console.log(chalk_1["default"].yellow('    发现重复接口，修改时间最晚的被采纳：'));
    return newItfs;
}
exports.uniqueItfs = uniqueItfs;
/** 生成提示文案 */
function creatHeadHelpStr(rapUrl, projectId, rapperVersion) {
    return "\n  /* Rap\u4ED3\u5E93id: " + projectId + " */\n  /* Rapper\u7248\u672C: " + rapperVersion + " */\n  /* eslint-disable */\n  /* tslint:disable */\n  \n  /**\n   * \u672C\u6587\u4EF6\u7531 Rapper \u540C\u6B65 Rap \u5E73\u53F0\u63A5\u53E3\uFF0C\u81EA\u52A8\u751F\u6210\uFF0C\u8BF7\u52FF\u4FEE\u6539\n   * Rap\u4ED3\u5E93 \u5730\u5740: " + rapUrl + "/repository/editor?id=" + projectId + "\n   */\n  ";
}
exports.creatHeadHelpStr = creatHeadHelpStr;
/**
 * 生成接口提示文案
 * @param rapUrl Rap平台地址
 * @param itf 接口信息
 * @param extra 额外信息
 */
function creatInterfaceHelpStr(rapUrl, itf, extra) {
    var name = itf.name, repositoryId = itf.repositoryId, moduleId = itf.moduleId, id = itf.id;
    if (extra) {
        return "\n    /**\n     * \u63A5\u53E3\u540D\uFF1A" + name + "\n     * Rap \u5730\u5740: " + rapUrl + "/repository/editor?id=" + repositoryId + "&mod=" + moduleId + "&itf=" + id + "\n     " + extra + "\n     */";
    }
    return "\n    /**\n     * \u63A5\u53E3\u540D\uFF1A" + name + "\n     * Rap \u5730\u5740: " + rapUrl + "/repository/editor?id=" + repositoryId + "&mod=" + moduleId + "&itf=" + id + "\n     */";
}
exports.creatInterfaceHelpStr = creatInterfaceHelpStr;
