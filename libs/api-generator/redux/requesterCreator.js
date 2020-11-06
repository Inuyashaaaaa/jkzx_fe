"use strict";
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
exports.createBaseRequestStr = void 0;
var base_creator_1 = require("../core/base-creator");
var tools_1 = require("../core/tools");
var utils_1 = require("../utils");
var packageName = utils_1.getPackageName();
function createBaseRequestStr(interfaces, extr) {
    return __awaiter(this, void 0, void 0, function () {
        var modelStr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, base_creator_1.createModel(interfaces, extr)];
                case 1:
                    modelStr = _a.sent();
                    return [2 /*return*/, "\n    import * as commonLib from '" + packageName + "/runtime/commonLib'\n    import * as reduxLib from '" + packageName + "/runtime/reduxLib'\n    import { RequestTypes } from './redux'\n\n    " + modelStr + "\n\n    " + extr.resSelector + "\n  \n    " + base_creator_1.createResponseTypes(interfaces) + "\n\n    export function createFetch(fetchConfig: commonLib.RequesterOption) {\n      const rapperFetch = commonLib.getRapperRequest(fetchConfig);\n      const sendRapperFetch = (modelName: keyof typeof RequestTypes, requestParams: commonLib.IUserFetchParams) => {\n        const { extra } = requestParams;\n        if (extra && extra.type === 'normal') {\n          return rapperFetch(requestParams);\n        } else {\n          const action = {\n            type: '$$RAPPER_REQUEST',\n            payload: { ...requestParams, modelName, types: RequestTypes[modelName] },\n          };\n          return reduxLib.dispatchAction(action, rapperFetch);\n        }\n      };\n\n      return {\n      " + interfaces
                            .map(function (itf) {
                            var modelName = itf.modelName, url = itf.url, method = itf.method;
                            var extrText = "* @param req \u8BF7\u6C42\u53C2\u6570\n          * @param extra \u8BF7\u6C42\u914D\u7F6E\u9879";
                            return "\n          " + tools_1.creatInterfaceHelpStr(extr.rapUrl, itf, extrText) + "\n          '" + modelName + "': (req?: IModels['" + modelName + "']['Req'], extra?: commonLib.IExtra) => {\n            return sendRapperFetch('" + modelName + "', {\n              url: '" + url + "',\n              method: '" + method.toUpperCase() + "',\n              params: req, \n              extra\n            }) as Promise<IResponseTypes['" + modelName + "']>\n          }";
                        })
                            .join(',\n\n') + "\n      };\n    }\n  "];
            }
        });
    });
}
exports.createBaseRequestStr = createBaseRequestStr;
