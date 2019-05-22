import { mapTree } from '@/utils';
import { formatMessage } from 'umi/locale';
import pageRouters from '../../config/router.config';
import { getLocaleId } from '@/tools';

export default {
  namespace: 'menu',

  state: {
    menuData: [],
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
        'routes'
      );

      yield put({
        type: 'save',
        payload: menuData.children || [],
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        menuData: action.payload,
      };
    },
  },
};
