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
exports.getRapperRequest = exports.defaultFetch = exports.Validator = void 0;
var jsonschema_1 = require("jsonschema");
exports.Validator = jsonschema_1.Validator;
/**
 * search 参数转换，比如 { a: 1, b: 2, c: undefined } 转换成 "a=1&b=2"
 * 会自动删除 undefined
 * fn，可以是用户自定义的转换函数，默认是 JSON.stringify
 */
function stringifyQueryString(obj, fn) {
    if (obj === void 0) { obj = {}; }
    if (fn === void 0) { fn = JSON.stringify; }
    return Object.entries(obj).reduce(function (str, _a) {
        var key = _a[0], value = _a[1];
        if (value === undefined) {
            return str;
        }
        str = str ? str + '&' : str;
        if (typeof value === 'object') {
            value = fn(value);
        }
        return str + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }, '');
}
/** 拼接组合request链接 */
function parseUrl(url, requestPrefix) {
    var urlReg = /^((https?:)?\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?/;
    /** 如果url含有host，就不再混入prefix */
    if (urlReg.test(url)) {
        return url;
    }
    if (!requestPrefix) {
        requestPrefix = '';
    }
    requestPrefix = requestPrefix.replace(/\/$/, '');
    url = url.replace(/^\//, '');
    return requestPrefix + '/' + url;
}
function processRestfulUrl(url, params) {
    var urlSplit = url.split('/');
    var newParams = __assign({}, params);
    for (var i = 0; i < urlSplit.length; ++i) {
        var part = urlSplit[i];
        if (part[0] === ':') {
            var key = part.slice(1);
            if (params.hasOwnProperty(key)) {
                urlSplit[i] = params[key];
                delete newParams[key];
            }
        }
    }
    return { url: urlSplit.join('/'), params: newParams };
}
/**
 * 包装请求函数，预处理 Restful API 的 url，把 params 塞到 url 里面
 */
function wrapPreProcessRestfulUrl(fetch) {
    return function (fetchParams) {
        return fetch(__assign(__assign({}, fetchParams), processRestfulUrl(fetchParams.url, fetchParams.params)));
    };
}
var defaultConfig = {
    prefix: '',
    fetchOption: {
        headers: {},
        credentials: 'same-origin'
    }
};
exports.defaultFetch = function (_a) {
    var url = _a.url, method = _a.method, params = _a.params, extra = _a.extra, schemas = _a.schemas, fetchOption = _a.fetchOption;
    return __awaiter(void 0, void 0, void 0, function () {
        var validator, urlWithParams, init, qs, formdata_1, qs, connectStr, res, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    validator = new jsonschema_1.Validator();
                    if (schemas) {
                        validator.validate(params, schemas.request, { throwError: true });
                    }
                    extra = extra || {};
                    urlWithParams = url;
                    init = __assign(__assign({}, fetchOption), { method: method });
                    if (method === 'GET') {
                        qs = stringifyQueryString(params, extra.queryStringFn);
                        urlWithParams = qs ? url + '?' + qs : url;
                    }
                    else if (['POST', 'DELETE', 'PUT'].includes(method) &&
                        extra.contentType === 'application/x-www-form-urlencoded') {
                        init.body = stringifyQueryString(params, extra.queryStringFn);
                    }
                    else if (['POST', 'DELETE', 'PUT'].includes(method) &&
                        extra.contentType === 'multipart/form-data') {
                        formdata_1 = new FormData();
                        params &&
                            Object.keys(params).forEach(function (key) {
                                formdata_1.append(key, params[key]);
                            });
                        init.body = formdata_1;
                    }
                    else {
                        init.body = typeof params === 'object' ? JSON.stringify(params) : params;
                    }
                    /** 请求 url，增加 query 参数 */
                    if (typeof extra.query === 'object') {
                        qs = stringifyQueryString(extra.query, extra.queryStringFn) || '';
                        connectStr = urlWithParams.indexOf('?') > -1 ? '&' : '?';
                        urlWithParams += connectStr + qs;
                    }
                    /** 用户自定义 Content-Type */
                    if (extra.contentType) {
                        if (extra.contentType !== 'multipart/form-data') {
                            init.headers = __assign(__assign({}, init.headers), { 'Content-Type': extra.contentType });
                        }
                    }
                    else {
                        init.headers = __assign(__assign({}, init.headers), { 'Content-Type': 'application/json' });
                    }
                    return [4 /*yield*/, fetch(urlWithParams, init)];
                case 1:
                    res = _b.sent();
                    result = res.json();
                    if (schemas) {
                        validator.validate(result, schemas.response, { throwError: true });
                    }
                    return [2 /*return*/, Promise.resolve(result)];
            }
        });
    });
};
exports.getRapperRequest = function (fetchConfig) {
    var rapperFetch;
    if (typeof fetchConfig === 'function') {
        rapperFetch = fetchConfig;
    }
    else {
        var prefix_1 = fetchConfig.prefix, fetchOption_1 = fetchConfig.fetchOption;
        var query = fetchConfig.query;
        prefix_1 = prefix_1 !== undefined ? prefix_1 : defaultConfig.prefix;
        fetchOption_1 =
            Object.prototype.toString.call(fetchOption_1) === '[object Object]'
                ? fetchOption_1
                : defaultConfig.fetchOption;
        /** 全局query参数处理 */
        var defaultQuery_1;
        if (typeof query === 'function') {
            defaultQuery_1 = query();
        }
        else if (query && typeof query === 'object') {
            defaultQuery_1 = query;
        }
        else {
            defaultQuery_1 = {};
        }
        rapperFetch = function (requestParams) {
            var url = requestParams.url, method = requestParams.method, params = requestParams.params, schemas = requestParams.schemas, extra = requestParams.extra;
            fetchOption_1 = fetchOption_1 || {};
            var newExtra = typeof extra === 'object' ? extra : {};
            var newQuery = typeof newExtra.query === 'object' ? __assign(__assign({}, defaultQuery_1), newExtra.query) : defaultQuery_1;
            newExtra = __assign(__assign({}, newExtra), { query: newQuery });
            return exports.defaultFetch({
                url: parseUrl(url, prefix_1),
                method: method,
                params: params,
                schemas: schemas,
                extra: newExtra,
                fetchOption: fetchOption_1
            });
        };
    }
    return wrapPreProcessRestfulUrl(rapperFetch);
};
