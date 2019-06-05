import { initPagePermissions } from '@/services/role';

function setPagePermissions(user, roles, rolePagesPermission, pagePermissionTree) {
  function setPermission(pageTree, pageIds) {
    if (!pageTree || typeof pageTree !== 'object') {
      return;
    }
    const { id, children, pageName } = pageTree;
    if (pageIds.includes(id)) {
      user.permissions[pageName] = true;
    }
    if (children && children.length > 0) {
      children.forEach(child => setPermission(child, pageIds));
    }
  }
  let pageIds = [];
  rolePagesPermission.forEach(page => {
    const role = roles.find(r => r.id === page.roleId);
    page.roleName = (role && role.roleName) || '';
  });
  user.roles.forEach(role => {
    const hint = rolePagesPermission.find(rolePage => rolePage.roleName === role);
    if (hint) {
      pageIds = pageIds.concat(hint.pageComponentId);
    }
  });
  setPermission(pagePermissionTree, pageIds);
}

export const updatePermission = async userInfo => {
  const permissionRsps = await initPagePermissions(userInfo.token);

  const allRolePermissions = permissionRsps[0].data;
  const allPagePermissions = permissionRsps[1].data;
  const roles = permissionRsps[2].data;

  userInfo.permissions = userInfo.permissions || {};

  setPagePermissions(userInfo, roles || [], allRolePermissions || [], allPagePermissions);

  return userInfo;
};
