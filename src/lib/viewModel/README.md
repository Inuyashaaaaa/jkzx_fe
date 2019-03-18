
# 彻底分离渲染逻辑和状态管理

1. 保持封装性
2. 彻底解耦
3. 关注点分离，方便独立测试，容易维护


# 分层概述

## container 

不建议有自己的 state，它充当的角色是传统 MVC 模式中的 controller，container 是构成 raect-tree 的基本单位

## components 

建议是纯函数组件，目标是只存在渲染逻辑，组件之间在功能上保证独立

## model 

使用 class 定义，调用 services，复杂情况继续划分 domain 

## service 

使用纯函数定义，可以相互组合

# 当 viewModel 挪到了外部

好处：

1. 上下级组件通信无需层层传递数据
2. viewModel 可以随意继承组合复用

原先作为组件内部 state 的属性需要继承，看看是哪些属性：

1. 和组件一样具有生命周期
2. 和组件一样具有影响范围，react 组件系统是单向数据流向下级层层传递的

# 面临的问题

Q： 类似 redux 序列化结构的外部 store 无法做到 model 间的组合继承怎么办？
    
A： 使用 mobx 构建 model 层

Q： viewModel 的持久化存储怎么办？

A： 初始化的时候使用缓存数据就行了，原来怎么办现在就怎么办；另外就是将 viewModel 的所属组件上提，那么子组件都可以享用了

Q： 父子组件超时空通信，需要借助绑定工具用什么？

A： redux-react 中的 connect 或者 mobx-react 中的 inject

Q： 外部 store 都是程序级的，如何继承组件生命周期

A： 利用高阶组件对原有组件的生命周期进行简单包装即可

# 具体方案

使用本库=。=

