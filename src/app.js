import { getPermissions, getAuthority } from '@/lib/utils/authority';
import { mapTree } from '@/lib/utils';

// 运行时修改路由
export function patchRoutes(routes) {
  const permissions = getPermissions();
  const roles = getAuthority();

  const findIndex = routes.findIndex(item => item.appRoute);

  routes.splice(
    findIndex,
    1,
    mapTree(
      routes[findIndex],
      item => {
        if (
          permissions[item.name] ||
          (item.routes && item.routes.some(route => permissions[route.name]))
        ) {
          return { ...item, authority: roles };
        }
        return { ...item, authority: ['never'] };
      },
      'routes'
    )
  );
}
