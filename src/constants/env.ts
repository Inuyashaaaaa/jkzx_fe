/**
 * 根据环境动态产生的 API 路径前缀
 * 注意前缀这里末尾没有 /，它是对需要追加的路径是一种增强
 */
const PathPrefixCont = process.env.NODE_ENV === 'development' ? '/api' : '';

export { PathPrefixCont };
