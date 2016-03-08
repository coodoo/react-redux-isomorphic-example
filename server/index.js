// 多一個 index.js 只是方便在 server 上也能寫 ES6 語法，
// 因為下面 babel-register 會在背景預先做 precompile
require('babel-register')
require('./server')
