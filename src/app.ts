// 运行时修改路由
// export function patchRoutes(routes) {
//   const permissions = getPermissions();
//   const roles = getRoles();

//   const findIndex = routes.findIndex(item => item.appRoute);

//   routes.splice(
//     findIndex,
//     1,
//     mapTree(
//       routes[findIndex],
//       item => {
//         if (
//           permissions[item.name] ||
//           (item.routes && item.routes.some(route => permissions[route.name]))
//         ) {
//           return { ...item, authority: roles };
//         }
//         return { ...item, authority: ['never'] };
//       },
//       'routes'
//     )
//   );
// }
