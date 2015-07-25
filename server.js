import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import React, { Component } from 'react';
import AppWrap from './js/components/AppWrap.jsx';
import * as reducers from './js/reducers';
import promiseMiddleware from './js/utils/PromiseMiddleware';
import fs from 'fs';
import express from 'express';
import path from 'path';
import * as ShopActions from './js/actions/ShopActions';
import Routr from './js/utils/routr';

// create the server app
var app = express();

// Static directories to make css and js work
app.use('/build', express.static(path.join(__dirname, 'build')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

// 讀入 index.html 將來好填入 react string
const index = fs.readFileSync('assets/index.html', {encoding: 'utf-8'});

// 這兩支可共用，因為是 side-effect free pure functions
const composedReducers = combineReducers(reducers);
const finalCreateStore = applyMiddleware( promiseMiddleware )(createStore);

// 讀取 routing table
const routines = require('./js/routing.js');

// 逐條建立 routing rule 與其相應的 routing handler
routines.forEach( function(item){

    app.get(item.path, function(req, res){

        console.log( '\nserver routing rule hit: ', req.url, ' >item: ', item );

        // 每次新的 request 進來時，都建立新的 store 與 routr 物件，
        // 以避免資料在不同 request 間共享
        let store = finalCreateStore(composedReducers);
        let routr = new Routr(store);

        // 實驗：也可手動執行: redux.dispatch(...) 觸發 actions.addTodo()
        // store.dispatch( ShopActions.readAll() )
        // 但實務上我希望共用一份 routr 與其內部的 routing rule，因此採下列手法
        routr[item.handler](req)

        // 當 then 觸發時，代表 redux 內部已取完資料，並且 state 準備好了
        // 即可開始組合 react 字串
        .then( result => {

            let markup = React.renderToString( <AppWrap store={store} /> );
            // var markup = React.renderToString( React.createElement(AppWrap, {store: store})); // 另種寫法

            // 將 store 內 state tree 序列化塞入網頁內，將來到 client 端再取出
            let state = JSON.stringify(store.getState());

            var str = index
                      .replace('${markup}', markup)
                      .replace('${state}', state);

            // 將組合好的 html 字串返還，request 處理至此完成
            res.send(str);
        });
    });
})

// 示範可以正確在 server 上處理 404 頁面
app.get('*', function(req, res) {
    res.send('404 - Page Not Found');
})

/*
// 示範如果要關掉 isomorphic 功能時該怎麼做
// 手法就是同樣在 server 上模擬一個空白的字串返還，讓 client 端有東西可解開就好
app.get('*', (req, res) => {
  var str = index.replace('${markup}', '').replace('${state}', null);
  // 將組合好的 html 字串返還，request 處理至此完成
  res.send(str);

});
*/

app.listen(3000, function(){
    console.log('Listening on port 3000');
});
