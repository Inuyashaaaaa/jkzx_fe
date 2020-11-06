"use strict";
exports.__esModule = true;
var reduxCreator_1 = require("./reduxCreator");
var requesterCreator_1 = require("./requesterCreator");
var utils_1 = require("../utils");
var packageName = utils_1.getPackageName();
/** 生成 index.ts */
function createIndexStr() {
    return {
        "import": "\n      import { useResponse, useAPI, useAllResponse, clearResponseCache, rapperActions, rapperBaseSelector, rapperDataSelector } from './redux'\n      import { IResponseTypes } from './request'\n      import * as reduxLib from '" + packageName + "/runtime/reduxLib'\n    ",
        body: "\n      const { rapperReducers, rapperEnhancer } = reduxLib\n    ",
        "export": "\n      export {\n        /** \u4EE5Hooks\u7684\u65B9\u5F0F\u4F7F\u7528\u8BF7\u6C42\u54CD\u5E94\u6570\u636E */\n        useResponse,\n        useAPI,\n        /** \u4F7F\u7528\u8BF7\u6C42\u54CD\u5E94\u6570\u636E\uFF08\u5305\u542B\u7F13\u5B58\uFF09 */\n        useAllResponse,\n        /** \u6E05\u9664\u6B64\u63A5\u53E3\u7684\u7F13\u5B58 */\n        clearResponseCache,\n        rapperBaseSelector,\n        rapperDataSelector,\n        rapperActions,\n        rapperReducers,\n        rapperEnhancer,\n      };\n\n      /** \u54CD\u5E94\u7C7B\u578B */\n      export type ResponseTypes = IResponseTypes\n    "
    };
}
/** 生成 redux.ts */
function createDynamicStr(interfaces, extr) {
    return "\n    import { useSelector } from 'react-redux'\n    import { IModels, IResponseTypes, createFetch } from './request'\n    import * as reduxLib from '" + packageName + "/runtime/reduxLib'\n    import { fetch } from './index'\n\n    " + reduxCreator_1.createActionStr(interfaces, extr) + "\n    " + reduxCreator_1.createUseRapStr(interfaces, extr) + "\n    " + reduxCreator_1.createBaseSelectorStr(interfaces) + "\n    " + reduxCreator_1.createDataSelectorStr(interfaces) + "\n\n    export const rapperActions = RequestTypes || []\n  ";
}
exports["default"] = { createIndexStr: createIndexStr, createDynamicStr: createDynamicStr, createBaseRequestStr: requesterCreator_1.createBaseRequestStr };
