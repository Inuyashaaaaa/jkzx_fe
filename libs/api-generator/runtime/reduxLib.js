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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.dispatchAction = exports.rapperEnhancer = exports.rapperReducers = exports.useAPICommon = exports.getRapperDataSelector = exports.getResponseData = exports.useResponseData = exports.RAPPER_STATE_KEY = exports.RAPPER_UPDATE_STORE = exports.RAPPER_CLEAR_STORE = exports.RAPPER_REQUEST = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
/** 常量定义 */
exports.RAPPER_REQUEST = '$$RAPPER_REQUEST';
exports.RAPPER_CLEAR_STORE = '$$RAPPER_CLEAR_STORE';
exports.RAPPER_UPDATE_STORE = '$$RAPPER_UPDATE_STORE';
exports.RAPPER_STATE_KEY = '$$rapperResponseData';
/** 深比较 */
function looseEqual(newData, oldData) {
    var newType = Object.prototype.toString.call(newData);
    var oldType = Object.prototype.toString.call(oldData);
    if (newType !== oldType) {
        return false;
    }
    if (newType === '[object Object]' || newType === '[object Array]') {
        for (var key in newData) {
            if (!looseEqual(newData[key], oldData[key])) {
                return false;
            }
        }
        for (var key in oldData) {
            if (!looseEqual(newData[key], oldData[key])) {
                return false;
            }
        }
    }
    else if (newData !== oldData) {
        return false;
    }
    return true;
}
/** 根据请求参数筛选，暂时只支持 request */
function paramsFilter(item, filter) {
    if (filter && filter.request) {
        var filterRequest_1 = filter.request; // 这一行是解决 ts2532 报错
        if (Object.prototype.toString.call(filter.request) === '[object Object]') {
            var reqResult = Object.keys(filter.request).every(function (key) {
                return item.request[key] === filterRequest_1[key];
            });
            if (!reqResult) {
                return false;
            }
        }
        else {
            return false;
        }
    }
    return true;
}
function getFilteredData(reduxData, filter) {
    var resultArr = [];
    if (filter) {
        if (typeof filter === 'function') {
            resultArr = reduxData.filter(function (item) { return filter(item); });
        }
        else {
            resultArr = reduxData.filter(function (item) {
                return paramsFilter(item, filter);
            });
        }
    }
    else {
        resultArr = reduxData;
    }
    return resultArr.length ? resultArr.slice(-1)[0] : {};
}
/** 以Hooks方式获取response数据 */
function useResponseData(modelName, filter) {
    var reduxData = react_redux_1.useSelector(function (state) {
        return (state.$$rapperResponseData && state.$$rapperResponseData[modelName]) || [];
    });
    var initData = getFilteredData(reduxData, filter);
    var _a = react_1.useState(initData.id || undefined), id = _a[0], setId = _a[1];
    var _b = react_1.useState(initData.response || undefined), filteredData = _b[0], setFilteredData = _b[1];
    var _c = react_1.useState(initData.isPending || false), isPending = _c[0], setIsPending = _c[1];
    var _d = react_1.useState(initData.errorMessage || undefined), errorMessage = _d[0], setErrorMessage = _d[1];
    react_1.useEffect(function () {
        /** 过滤出一条最新的符合条件的数据 */
        var result = getFilteredData(reduxData, filter);
        !looseEqual(result.response, filteredData) && setFilteredData(result.response || undefined);
        setId(result.id);
        setIsPending(result.isPending || false);
        setErrorMessage(result.errorMessage);
    }, [reduxData, filter, filteredData]);
    return [filteredData, { id: id, isPending: isPending, errorMessage: errorMessage }];
}
exports.useResponseData = useResponseData;
/** class component获取response数据 */
function getResponseData(state, modelName, filter) {
    var reduxData = (state.$$rapperResponseData && state.$$rapperResponseData[modelName]) || [];
    var result = getFilteredData(reduxData, filter);
    return [
        result.response || undefined,
        { id: result.id, isPending: result.isPending || false, errorMessage: result.errorMessage },
    ];
}
exports.getResponseData = getResponseData;
/** class component获取response数据 */
function getRapperDataSelector(state, modelName) {
    var reduxData = (state.$$rapperResponseData && state.$$rapperResponseData[modelName]) || [];
    var result = reduxData.length ? reduxData.slice(-1)[0] : {};
    return result.response;
}
exports.getRapperDataSelector = getRapperDataSelector;
/** useAPI */
function useAPICommon(_a) {
    var modelName = _a.modelName, fetcher = _a.fetcher, requestParams = _a.requestParams, extra = _a.extra;
    var _b = extra || {}, _c = _b.mode, mode = _c === void 0 ? 'paramsMatch' : _c, otherExtra = __rest(_b, ["mode"]);
    var reduxData = react_redux_1.useSelector(function (state) {
        return (state.$$rapperResponseData && state.$$rapperResponseData[modelName]) || [];
    });
    var initData = getFilteredData(reduxData, mode === 'notMatch' ? undefined : { request: requestParams });
    var _d = react_1.useState(initData.response || undefined), filteredData = _d[0], setFilteredData = _d[1];
    var _e = react_1.useState(initData.isPending || false), isPending = _e[0], setIsPending = _e[1];
    var _f = react_1.useState(initData.errorMessage || undefined), errorMessage = _f[0], setErrorMessage = _f[1];
    react_1.useEffect(function () {
        /** 过滤出一条最新的符合条件的数据 */
        var result = getFilteredData(reduxData, mode === 'notMatch' ? undefined : { request: requestParams });
        !looseEqual(result.response, filteredData) && setFilteredData(result.response || undefined);
        setIsPending(result.isPending || false);
        setErrorMessage(result.errorMessage);
    }, [reduxData, filteredData]);
    react_1.useEffect(function () {
        if (mode !== 'manual' && !initData.id) {
            fetcher(requestParams, otherExtra);
        }
    }, [initData.id]);
    return [filteredData, { isPending: isPending, errorMessage: errorMessage, request: fetcher }];
}
exports.useAPICommon = useAPICommon;
var dispatch;
var fetchFunc;
function assignData(_a) {
    var oldState = _a.oldState, _b = _a.payload, interfaceKey = _b.interfaceKey, id = _b.id, requestTime = _b.requestTime, reponseTime = _b.reponseTime, _c = _b.request, request = _c === void 0 ? {} : _c, response = _b.response, isPending = _b.isPending, errorMessage = _b.errorMessage, maxCacheLength = _a.maxCacheLength;
    var newState = __assign({}, oldState);
    var data = newState[interfaceKey] || [];
    if (isPending === true) {
        /** 只存最近 maxCacheLength 个数据 */
        if (maxCacheLength !== Infinity && data.length >= maxCacheLength) {
            data = newState[interfaceKey].slice(data.length - maxCacheLength + 1);
        }
        newState[interfaceKey] = __spreadArrays(data, [{ id: id, requestTime: requestTime, request: request, isPending: isPending }]);
    }
    else {
        newState[interfaceKey] = data.map(function (item) {
            return item.id === id ? __assign(__assign({}, item), { reponseTime: reponseTime, response: response, isPending: isPending, errorMessage: errorMessage }) : item;
        });
    }
    return newState;
}
exports.rapperReducers = {
    $$rapperResponseData: function (state) {
        if (state === void 0) { state = {}; }
        return state;
    }
};
/** store enhancer */
function rapperEnhancer(config) {
    var _this = this;
    config = config || {};
    var maxCacheLength = config.maxCacheLength;
    if (typeof maxCacheLength !== 'number' || maxCacheLength < 1) {
        maxCacheLength = 6;
    }
    return function (next) { return function (reducers) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var store = next.apply(void 0, __spreadArrays([reducers], args));
        /** 重新定义 reducers */
        var newReducers = function (state, action) {
            if (state && !state.$$rapperResponseData) {
                throw Error('rapper初始化配置失败，rootReducer应该加入rapperReducers，具体请查看demo配置: https://www.yuque.com/rap/rapper/react-install#rYm5X');
            }
            if (!action.hasOwnProperty('type')) {
                return reducers(state, action);
            }
            switch (action.type) {
                /** 请求成功，更新 store */
                case exports.RAPPER_UPDATE_STORE:
                    return __assign(__assign({}, state), { $$rapperResponseData: assignData({
                            oldState: state.$$rapperResponseData,
                            maxCacheLength: maxCacheLength,
                            payload: action.payload
                        }) });
                /** 用户手动清空 */
                case exports.RAPPER_CLEAR_STORE:
                    return __assign(__assign({}, state), { $$rapperResponseData: __assign(__assign({}, state.$$rapperResponseData), action.payload) });
                default:
                    return reducers(state, action);
            }
        };
        store.replaceReducer(newReducers);
        /** 重新定义 dispatch */
        dispatch = function (action) { return __awaiter(_this, void 0, void 0, function () {
            var _a, modelName, url, method, params, extra, _b, REQUEST, SUCCESS, FAILURE, state, cacheData, cacheDataPending, errorMessage, requestTime, responseData, reponseTime, err_1, errorMessage;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (action.type !== exports.RAPPER_REQUEST) {
                            return [2 /*return*/, store.dispatch(action)];
                        }
                        _a = action.payload, modelName = _a.modelName, url = _a.url, method = _a.method, params = _a.params, extra = _a.extra, _b = _a.types, REQUEST = _b[0], SUCCESS = _b[1], FAILURE = _b[2];
                        state = store.getState();
                        cacheData = (state === null || state === void 0 ? void 0 : state.$$rapperResponseData[modelName]) || [];
                        cacheDataPending = cacheData.filter(function (item) { return item.isPending; }) || [];
                        if (cacheDataPending.length >= maxCacheLength) {
                            errorMessage = "\u5F53\u524D\u914D\u7F6E\u7684\u7F13\u5B58\u533A\u6700\u591A\u652F\u6301" + maxCacheLength + "\u4E2A\u5E76\u53D1\u8BF7\u6C42\uFF0C\u5982\u9700\u8981\u66F4\u5927\u7684\u7F13\u5B58\u533A\uFF0C\u8BF7\u4FEE\u6539 maxCacheLength \u53C2\u6570";
                            store.dispatch({
                                type: FAILURE,
                                payload: errorMessage
                            });
                            return [2 /*return*/, Promise.reject(errorMessage)];
                        }
                        requestTime = new Date().getTime();
                        store.dispatch({ type: REQUEST });
                        store.dispatch({
                            type: exports.RAPPER_UPDATE_STORE,
                            payload: {
                                interfaceKey: modelName,
                                id: requestTime,
                                requestTime: requestTime,
                                request: params,
                                isPending: true
                            }
                        });
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetchFunc({ url: url, method: method, params: params, extra: extra })];
                    case 2:
                        responseData = _c.sent();
                        reponseTime = new Date().getTime();
                        store.dispatch({ type: SUCCESS, payload: responseData });
                        /** 请求成功，更新store */
                        store.dispatch({
                            type: exports.RAPPER_UPDATE_STORE,
                            payload: {
                                interfaceKey: modelName,
                                id: requestTime,
                                requestTime: requestTime,
                                reponseTime: reponseTime,
                                request: params,
                                response: responseData,
                                isPending: false
                            }
                        });
                        return [2 /*return*/, Promise.resolve(responseData)];
                    case 3:
                        err_1 = _c.sent();
                        errorMessage = typeof err_1 === 'object' ? err_1.message : JSON.stringify(err_1);
                        store.dispatch({ type: FAILURE, payload: errorMessage });
                        store.dispatch({
                            type: exports.RAPPER_UPDATE_STORE,
                            payload: {
                                interfaceKey: modelName,
                                id: requestTime,
                                requestTime: requestTime,
                                isPending: false,
                                errorMessage: errorMessage
                            }
                        });
                        return [2 /*return*/, Promise.reject(err_1)];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        return __assign(__assign({}, store), { dispatch: dispatch });
    }; };
}
exports.rapperEnhancer = rapperEnhancer;
/** 发送请求 */
function dispatchAction(action, fetch) {
    fetch && (fetchFunc = fetch);
    return dispatch(action);
}
exports.dispatchAction = dispatchAction;
