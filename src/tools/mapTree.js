// 不要修改文件后缀，router.config.js 在使用它
function mapTree(node, cb, fieldName = 'children', parent = null, parents = []) {
  return cb(
    {
      ...node,
      [fieldName]: node[fieldName]
        ? node[fieldName]
            .map(item => mapTree(item, cb, fieldName, node, node ? parents.concat(node) : parents))
            .filter(it => !!it)
        : undefined,
    },
    parent,
    parents,
  );
}

module.exports = mapTree;
