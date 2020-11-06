"use strict";
exports.__esModule = true;
var index_1 = require("../index");
index_1.rapper({
    type: 'normal',
    apiUrl: 'https://rap2api.alibaba-inc.com/repository/get?id=3601',
    /** rap 前端地址，默认是 http://rap2.taobao.org */
    rapUrl: 'https://rap2.alibaba-inc.com',
    /** 输出文件的目录，默认是 ./src/rapper */
    rapperPath: './test/src/models/rapper',
    codeStyle: {
        semi: true,
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 100,
        tabWidth: 2
    }
});
// .then(() => {
//     console.log('rapper:generate model success')
// })
// .catch(err => {
//     console.log('rapper:generate model failed', err)
// })
