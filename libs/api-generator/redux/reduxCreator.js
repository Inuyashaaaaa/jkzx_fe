"use strict";
exports.__esModule = true;
exports.createDataSelectorStr = exports.createBaseSelectorStr = exports.createUseRapStr = exports.createActionStr = void 0;
var tools_1 = require("../core/tools");
/** 定义 请求types */
function getRequestTypesStr(interfaces) {
    return "export const RequestTypes = {\n    " + interfaces
        .map(function (_a) {
        var modelName = _a.modelName;
        return "\n          '" + modelName + "': [\n              '" + modelName + "_REQUEST',\n              '" + modelName + "_SUCCESS',\n              '" + modelName + "_FAILURE',\n          ],\n        ";
    })
        .join('\n\n') + "\n  }";
}
/** 生成 Action 定义 */
function createActionStr(interfaces, extr) {
    return "\n    /** \u8BF7\u6C42types */\n    " + getRequestTypesStr(interfaces) + "\n  ";
}
exports.createActionStr = createActionStr;
/** 生成 useResponse，useAllResponse */
function createUseRapStr(interfaces, extr) {
    return "\n    /** store\u4E2D\u5B58\u50A8\u7684\u6570\u636E\u7ED3\u6784 */\n    interface IRapperStore {\n      " + interfaces
        .map(function (_a) {
        var modelName = _a.modelName;
        return "\n      '" + modelName + "': Array<reduxLib.IInterfaceInfo & {\n        request: IModels['" + modelName + "']['Req']\n        response: IResponseTypes['" + modelName + "']\n      }>";
    })
        .join(',\n\n') + "\n    }\n    export type TRapperStoreKey = keyof IRapperStore\n    \n    export const useResponse = {\n      " + interfaces
        .map(function (itf) { return "\n      " + tools_1.creatInterfaceHelpStr(extr.rapUrl, itf) + "\n      /* tslint:disable */\n      '" + itf.modelName + "': function useData(\n          filter?: { request?: IModels['" + itf.modelName + "']['Req'] } | { (\n              storeData: IRapperStore['" + itf.modelName + "'][0]\n          ): boolean }\n      ) {\n        type Req = IModels['" + itf.modelName + "']['Req']\n        type Item = IRapperStore['" + itf.modelName + "'][0]\n        type Res = IResponseTypes['" + itf.modelName + "']\n        return reduxLib.useResponseData<TRapperStoreKey, Req, Res, Item>(\n          '" + itf.modelName + "', filter)\n      }"; })
        .join(',\n\n') + "\n    }\n\n    export const useAPI = {\n      " + interfaces
        .map(function (itf) { return "\n      " + tools_1.creatInterfaceHelpStr(extr.rapUrl, itf) + "\n      /* tslint:disable */\n      '" + itf.modelName + "': function useData(\n        requestParams?: IModels['" + itf.modelName + "']['Req'],\n        extra?: reduxLib.IUseAPIExtra & { fetch?: ReturnType<typeof createFetch> }\n      ) {\n        type Req = IModels['" + itf.modelName + "']['Req']\n        type Res = IResponseTypes['" + itf.modelName + "']\n        const rapperFetch = (extra && extra.fetch) ? extra.fetch : fetch\n        type IFetcher = typeof rapperFetch['" + itf.modelName + "']\n        return reduxLib.useAPICommon<TRapperStoreKey, Req, Res, IFetcher>({\n          modelName: '" + itf.modelName + "',\n          fetcher: rapperFetch['" + itf.modelName + "'],\n          requestParams,\n          extra,\n        })\n      }"; })
        .join(',\n\n') + "\n    }\n    \n    export const useAllResponse = {\n      " + interfaces
        .map(function (itf) { return "\n      " + tools_1.creatInterfaceHelpStr(extr.rapUrl, itf) + "\n      /* tslint:disable */\n      '" + itf.modelName + "': function useData() {\n        return useSelector((state: reduxLib.IState) => {\n          const selectedState = (state['$$rapperResponseData'] && state['$$rapperResponseData']['" + itf.modelName + "']) || []\n          type TReturnItem = reduxLib.IInterfaceInfo & {\n            request?: IModels['" + itf.modelName + "']['Req'];\n            response?: IResponseTypes['" + itf.modelName + "'];\n          }\n          return selectedState as Array<TReturnItem>\n        })\n      }"; })
        .join(',\n\n') + "\n    }\n    \n    /** \u91CD\u7F6E\u63A5\u53E3\u6570\u636E */\n    export const clearResponseCache = {\n      " + interfaces
        .map(function (itf) { return "\n      " + tools_1.creatInterfaceHelpStr(extr.rapUrl, itf) + "\n      '" + itf.modelName + "': (): void => {\n        reduxLib.dispatchAction({\n          type: '$$RAPPER_CLEAR_STORE', \n          payload: { '" + itf.modelName + "': undefined }\n        })\n      }"; })
        .join(',\n\n') + "\n    }\n    ";
}
exports.createUseRapStr = createUseRapStr;
function createBaseSelectorStr(interfaces) {
    return "\n    export const rapperBaseSelector = {\n    " + interfaces
        .map(function (_a) {
        var modelName = _a.modelName;
        return "\n      '" + modelName + "': (state: reduxLib.IState, filter?: { request?: IModels['" + modelName + "']['Req'] } | { (storeData: IRapperStore['" + modelName + "'][0]): boolean }) => {\n        type Req = IModels['" + modelName + "']['Req'];\n        type Res = IResponseTypes['" + modelName + "'];\n        type Item = IRapperStore['" + modelName + "'][0];\n        return reduxLib.getResponseData<TRapperStoreKey, Req, Res, Item>(state, '" + modelName + "', filter);\n      }\n    ";
    })
        .join(',\n\n') + "\n    }\n  ";
}
exports.createBaseSelectorStr = createBaseSelectorStr;
function createDataSelectorStr(interfaces) {
    return "\n    export const rapperDataSelector = {\n    " + interfaces
        .map(function (_a) {
        var modelName = _a.modelName;
        return "\n      '" + modelName + "': (state: reduxLib.IState) => {\n        type Res = IResponseTypes['" + modelName + "'];\n        return reduxLib.getRapperDataSelector<TRapperStoreKey, Res>(state, '" + modelName + "');\n      }\n    ";
    })
        .join(',\n\n') + "\n    }\n  ";
}
exports.createDataSelectorStr = createDataSelectorStr;
