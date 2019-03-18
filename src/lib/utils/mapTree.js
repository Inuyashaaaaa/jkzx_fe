function mapTree(node, cb, fieldName = 'children') {
  return cb({
    ...node,
    [fieldName]: node[fieldName]
      ? node[fieldName].map(item => mapTree(item, cb, fieldName))
      : undefined,
  });
}

module.exports = mapTree;
