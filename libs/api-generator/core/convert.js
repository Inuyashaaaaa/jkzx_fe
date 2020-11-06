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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.interfaceToJSONSchema = void 0;
var json_schema_to_typescript_1 = require("json-schema-to-typescript");
var JSON5 = require("json5");
var _ = require("lodash");
function inferArraySchema(p, childProperties, common) {
    var rule = (p.rule && p.rule.trim()) || '';
    if (Object.keys(childProperties).length !== 0) {
        // 如果有子孙那么肯定是 object
        return [
            p.name,
            __assign({ type: 'array', items: {
                    type: 'object',
                    properties: childProperties,
                    required: common.required,
                    additionalProperties: false
                } }, common),
        ];
    }
    else if (['+1', '1'].includes(rule) && p.value) {
        // 当 rule 为 +1 时 mockjs 从属性值 array 中顺序选取 1 个元素，作为最终值。
        // 当 rule 为 1 时 mockjs 从属性值 array 中随机选取 1 个元素，作为最终值。
        // 这时候这个属性的类型并非 array，而是 array 子元素的类型
        // 子元素的类型可以从 value 中推断出来
        try {
            var arr = JSON5.parse(p.value);
            if (Array.isArray(arr) && arr.length) {
                var type = _.chain(arr)
                    .map(function (e) { return typeof e; })
                    .uniq()
                    .value();
                return [
                    p.name,
                    __assign({ type: type }, common),
                ];
            }
            else {
                // 解析失败，返回 any
                return [
                    p.name,
                    __assign({ type: ['string', 'number', 'boolean', 'object'] }, common),
                ];
            }
        }
        catch (error) {
            // 解析失败，返回 any
            return [
                p.name,
                __assign({ type: ['string', 'number', 'boolean', 'object'] }, common),
            ];
        }
    }
    else if (rule === '' && p.value) {
        // 当有无子孙、有值、且无生成规则时，默认做 hack 满足 rap2 无法表示 array<primitive> 的问题，
        // primitive 的具体类型通过 value 推断
        try {
            var v = JSON5.parse(p.value);
            if (Array.isArray(v)) {
                // 如果是空数组返回 any[]
                if (!v.length) {
                    return [
                        p.name,
                        __assign({ type: 'array' }, common),
                    ];
                }
                // 如果是数组使用数组元素类型
                var type = _.chain(v)
                    .map(function (e) { return typeof e; })
                    .uniq()
                    .value();
                return [
                    p.name,
                    __assign({ type: 'array', items: {
                            type: type
                        } }, common),
                ];
            }
            else {
                // 如果不是数组直接使用 value 类型
                var type = typeof v;
                return [
                    p.name,
                    __assign({ type: 'array', items: {
                            type: type
                        } }, common),
                ];
            }
        }
        catch (error) {
            // 解析失败 返回 any[]
            return [
                p.name,
                __assign({ type: 'array' }, common),
            ];
        }
    }
    else {
        // 无生成规则也无值，生成 any[]
        return [
            p.name,
            __assign({ type: 'array' }, common),
        ];
    }
}
var removeComment = function (str) { return str.replace(/\/\*|\*\//g, ''); };
function getRestfulPlaceHolders(itf) {
    var urlSplit = itf.url.split('/');
    var restfulPlaceHolders = [];
    for (var i = 0; i < urlSplit.length; ++i) {
        var part = urlSplit[i];
        if (part[0] === ':') {
            restfulPlaceHolders.push(part.slice(1));
        }
    }
    return restfulPlaceHolders;
}
function interfaceToJSONSchema(itf, scope) {
    var properties = itf.properties.filter(function (p) { return p.scope === scope; });
    properties = __spreadArrays(properties, [
        {
            name: 'dummyroot',
            parentId: -2,
            id: -1,
            scope: scope,
            type: 'object'
        },
    ]);
    if (scope === 'request') {
        var placeHolders = getRestfulPlaceHolders(itf);
        properties = __spreadArrays(properties, placeHolders.map(function (name, index) { return ({
            name: name,
            parentId: -1,
            id: index + 100,
            scope: scope,
            type: 'string'
        }); }));
    }
    function findChildProperties(parentId) {
        return _.chain(properties)
            .filter(function (p) { return p.parentId === parentId; })
            .map(function (p) {
            var type = p.type.toLowerCase().replace(/regexp|function/, 'string');
            var childProperties = findChildProperties(p.id);
            var childItfs = properties.filter(function (x) { return x.parentId === p.id; });
            var common = {
                // 这里默认所有的属性都有值
                additionalProperties: false,
                // request 的时候按照实际标注，response 全部默认存在
                required: childItfs.filter(function (e) { return e.required; }).map(function (e) { return e.name; })
            };
            if (p.description)
                common.description = removeComment(p.description);
            if (['string', 'number', 'integer', 'boolean', 'null'].includes(type)) {
                return [
                    p.name,
                    __assign({ type: type }, common),
                ];
            }
            else if (type === 'object') {
                return [
                    p.name,
                    __assign({ type: type, properties: childProperties }, common),
                ];
            }
            else if (type === 'array') {
                return inferArraySchema(p, childProperties, common);
            }
            else {
                // 解析失败，返回 any
                return [
                    p.name,
                    __assign({ type: ['string', 'number', 'boolean', 'object'] }, common),
                ];
                // throw `type: ${type}
                // parentID: ${parentId}
                // itf.url: ${itf.url}
                // ${JSON.stringify(childProperties)}`;
            }
        })
            .fromPairs()
            .value();
    }
    var propertyChildren = findChildProperties(-2);
    return propertyChildren['dummyroot'];
}
exports.interfaceToJSONSchema = interfaceToJSONSchema;
function convert(itf) {
    var reqJSONSchema = interfaceToJSONSchema(itf, 'request');
    var resJSONSchema = interfaceToJSONSchema(itf, 'response');
    var options = __assign(__assign({}, json_schema_to_typescript_1.DEFAULT_OPTIONS), { bannerComment: '' });
    return Promise.all([
        json_schema_to_typescript_1.compile(reqJSONSchema, 'Req', options),
        json_schema_to_typescript_1.compile(resJSONSchema, 'Res', options),
    ]);
}
exports["default"] = convert;
