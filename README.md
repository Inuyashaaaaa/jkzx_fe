# 项目介绍

## 快速开始

启动本地 server

```sh
yarn run dev
```

修改本地代理，打开 `config/config.local.js` 修改 target 值


## 文件结构

### 路由结构和文件结构映射关系

- pages 下的文件夹结构，除模块定义外和页面路由一一对应

	- src/center/*

### 模块划分

- modules

	- components

		- 公共组件

	- hooks

		- 通用状态处理逻辑

	- utils

		- 工具方法

	- typings

		- 类型定义

	- services

		- 异步服务

	- constants

		- 常量定义

	- docs

		- 界面功能文档，代码设计文档

	- tests

		- 单元测试

	- e2es

		- 端到端测试

	- assets

		- 资源文件

	- locales

		- 语言本地化

	- configs

		- 静态配置

	- models

		- 数据中心

	- selectors

		- model 选择器

	- styles

		- 样式

	- fixtures

		- 指纹代码，比如以 json 结尾的数据文件

## 视图控制层

### 数据中心

- subscriptions

	- {[key in string]: (options: { dispatch, history } => void)}

- effects

	- call

		- 异步数据返回继续执行迭代器

	- put

		- 触发其他迭代器对象生成并执行，或者触发 reducer 函数执行

	- select

		- 从 store 中获取数据

	- generators

		- 迭代器生成器对象

			- 迭代器的启停可以和外部数据交换

- reducers

	- (state, action) => state

## 演示 Demo

### 启动

- 本地代理

### CRUD 页面

- 1. 定义 model

	- create-dva-model

		- model 类型推导工具

	- 调用服务

		- api-generator

			- 自动化静态类型请求代码生成工具
			- 公共接口文档平台

	- 定义 reducers 处理状态更新逻辑

- 2. 构建视图

	- themes components

		- 主题组件

	- 绑定 model

		- 编写交互

			- 函数式派发 action

		- connect 关联状态

## 开发约定

### 1. 模块代理导出

- 优先使用命名导出

	- 模块使用 index 入口导出

		- 框架约定除外，比如 models

### 2. 常量编写

- Cont
- 大驼峰
- 后缀定义

	- Cont
	- Maps
	- Enums
	- List
	- Services
	- Model

### 3. 方法名称

- 事件处理

	- handleXXXX

- 动词开头

### 4. 文件命名

- 小写中划线分割

## 注意事项

### 1. 依赖内网包，使用依赖邮件发送

## Todos

### 1. 替换 dva/fetch 为 umi-request

### 2. 合并 containers，components 和 tools，utils

### 3. 重构老页面结构

### 4. 编写代码设计文档，搭建可访问页面

*XMind - Trial Version*