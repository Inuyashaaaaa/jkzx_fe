import { formatMessage } from 'umi/locale';
import { mapTree, getLocaleId } from '@/tools';
import pageRouters from '../../config/router.config';

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    centerMenuData: [],
  },

  effects: {
    *initMenu({ payload }, { put }) {
      const appRoute = pageRouters.find(item => item.appRoute);
      const { permissions } = payload;
      if (!appRoute) {
        throw new Error('appRoute is not defiend!');
      }

      const menuData = mapTree(
        appRoute,
        (item, parent) => {
          const getNoPermission = () => {
            if (
              item.routes &&
              item.routes.some(route => permissions[route.name] || route.noAccess === false)
            ) {
              return false;
            }
            return (
              !permissions[item.name] ||
              (item.routes && item.routes.every(route => !permissions[route.name]))
            );
          };

          return {
            noPermission: getNoPermission(),
            ...item,
            label:
              item &&
              item.name &&
              formatMessage({ id: getLocaleId(parent, item), defaultMessage: item.name }),
            children: item.routes,
          };
        },
        'routes',
      );

      yield put({
        type: 'save',
        payload: {
          name: 'menuData',
          data: menuData.children || [],
        },
      });
    },
    *initCenterMenu({ payload }, { put }) {
      const centerRoute = pageRouters.find(item => item.centerRoute);
      const { permissions } = payload;
      if (!centerRoute) {
        throw new Error('centerRoute is not defiend!');
      }
      const menuData = mapTree(
        centerRoute,
        (item, parent) => {
          const getNoPermission = () => {
            if (
              item.routes &&
              item.routes.some(route => permissions[route.name] || route.noAccess === false)
            ) {
              return false;
            }
            return (
              !permissions[item.name] ||
              (item.routes && item.routes.every(route => !permissions[route.name]))
            );
          };

          return {
            noPermission: getNoPermission(),
            ...item,
            label:
              item &&
              item.name &&
              formatMessage({ id: getLocaleId(parent, item), defaultMessage: item.name }),
            children: item.routes,
          };
        },
        'routes',
      );

      yield put({
        type: 'save',
        payload: {
          name: 'centerMenuData',
          data: menuData.children || [],
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      const { name, data } = action.payload;
      return {
        ...state,
        [name]: data,
      };
    },
  },
};
