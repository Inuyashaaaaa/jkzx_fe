
# 1.0.0
([65c07bab5c74f06b96a61c3766210643a419c9df](http://10.1.2.11/bct-helium/console/commit/65c07bab5c74f06b96a61c3766210643a419c9df))

## components 

SourceTable 组件产生了大量的 break changes，之前使用版本的小伙伴 @海洋 ，sorry，因为开发完毕才考虑写更新日志，但是太难统计了 =。=，所以这次版本迭代没有没有更新日志，但是在 test 页面下增加了 API 栏目，可以参考进行升级，如果只是浅度使用的话，应该改起来还是算快的，再次立一个 flag 之后的版本更新不会出现类似这样的问题！

### Breack Changes

- SourceTable
    - ...

## utils

### Bug Fixes

- extensibleProduce
    - 修复对数组引用的判断



# 0.2.0
([aa49ada6f0f1807081614d083fc371d9e4961fd3](http://10.1.2.11/bct-helium/console/commit/aa49ada6f0f1807081614d083fc371d9e4961fd3))


## components

### Features

- SourceTable
    - add `saveText` props
    - add `autoFetch` props
    - `onSave` support return config object (`AsyncResult`)

### Bug Fixes

- SourceTable
    - input pass function not invoke
    - utils.wrapType defaults not required

## utils

### Bug Fixes

- utils.wrapType defaults not required

## 0.1.0