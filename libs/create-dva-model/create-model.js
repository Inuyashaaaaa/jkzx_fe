"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModel = void 0;
function createModel(options) {
    const { reducers, effects, namespace } = options;
    const getActions = (actionsFuncMaps = {}) => {
        const obj = {};
        return Object.keys(actionsFuncMaps).reduce((actionsCreatorMaps, actionType) => {
            // eslint-disable-next-line no-param-reassign
            actionsCreatorMaps[actionType] = (payload) => {
                return {
                    type: `${namespace}/${actionType}`,
                    payload,
                };
            };
            return actionsCreatorMaps;
        }, obj);
    };
    return Object.assign(Object.create({
        namespace,
        actions: getActions(reducers),
        asyncActions: getActions(effects),
    }), options);
}
exports.createModel = createModel;
