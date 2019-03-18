存放复用组件，相对于 components 

1. container 可以带有一定的业务逻辑在内，比如发送请求，重点是其复用属性
2. container 存放抽象的不够彻底的组件，比如现有 components 组件的参数预设，可以理解为柯里化，本质是也是业务数据
3. container 在项目间一般是无法复用的