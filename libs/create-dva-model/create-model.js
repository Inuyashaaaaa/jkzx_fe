"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModel = void 0;
const constants_1 = require("./constants");
const getActions = (namespace, caseObjects) => {
    if (caseObjects == null)
        return {};
    const getPrefix = () => {
        if (namespace) {
            return `${namespace}/`;
        }
        return '';
    };
    return Object.keys(caseObjects).reduce((caseActions, actionType) => {
        // eslint-disable-next-line no-param-reassign
        caseActions[actionType] = (payload) => {
            return {
                type: `${getPrefix()}${actionType}`,
                payload,
            };
        };
        return caseActions;
        // @todo 去除 any
    }, {});
};
function createModel(options, effects, subscriptions) {
    const { reducers, namespace } = options;
    const inlineActions = getActions(null, reducers);
    const inlineAsyncActions = getActions(null, effects);
    const actions = getActions(namespace, reducers);
    const asyncActions = getActions(namespace, effects);
    // eslint-disable-next-line no-shadow
    const wrapEffects = (effects) => {
        if (effects == null)
            return effects;
        const newEffects = Object.keys(effects).reduce((dist, name) => {
            const effect = effects[name];
            if (Object.prototype.hasOwnProperty.call(effect, constants_1.WrappedEffectFnTagTagCont) === true) {
                return dist;
            }
            // eslint-disable-next-line func-names
            const newEffect = function (action, sagas) {
                // eslint-disable-next-line prefer-rest-params
                return effect.call(this, action, Object.assign(Object.assign({}, sagas), { actions: inlineActions, asyncActions: inlineAsyncActions }));
            };
            newEffect[constants_1.WrappedEffectFnTagTagCont] = true;
            return Object.assign(Object.assign({}, dist), { [name]: newEffect });
        }, effects);
        return newEffects;
    };
    // eslint-disable-next-line no-shadow
    const wrapSubscriptions = (subscriptions) => {
        if (subscriptions == null)
            return subscriptions;
        const newSubscriptions = Object.keys(subscriptions).reduce((dist, name) => {
            const subscription = subscriptions[name];
            if (Object.prototype.hasOwnProperty.call(subscription, constants_1.WrappedEffectFnTagTagCont) === true) {
                return dist;
            }
            // eslint-disable-next-line func-names
            const newSubs = function (apis, done) {
                // eslint-disable-next-line prefer-rest-params
                return subscription.call(this, Object.assign(Object.assign({}, apis), { actions: inlineActions, asyncActions: inlineAsyncActions }), done);
            };
            newSubs[constants_1.WrappedEffectFnTagTagCont] = true;
            return Object.assign(Object.assign({}, dist), { [name]: newSubs });
        }, subscriptions);
        return newSubscriptions;
    };
    return Object.assign(Object.create({
        actions,
        asyncActions,
    }), Object.assign(Object.assign({}, options), { effects: wrapEffects(effects), subscriptions: wrapSubscriptions(subscriptions) }));
}
exports.createModel = createModel;
