import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/server';
import * as reducers from './js/reducers';
import promiseMiddleware from './js/utils/PromiseMiddleware';
import fs from 'fs';
import express from 'express';
import path from 'path';
import * as ShopActions from './js/actions/ShopActions';

import {Router} from 'react-router';
import Location from 'react-router/lib/Location';
import routes from './js/routes/routing';

// 重要：切換是否要啟用 server-rendering
const $UNIVERSAL = true;

var app = express();

// serve static files like css and bundle.js
app.use('/build', express.static(path.join(__dirname, 'build')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

const index = fs.readFileSync('assets/index.html', {encoding: 'utf-8'});
const composedReducers = combineReducers(reducers);
const finalCreateStore = applyMiddleware( promiseMiddleware )(createStore);

// routing middleware where server-rendering magic happens
function handleRouting(req, res){

  let location = new Location(req.path, req.query);
  let store = finalCreateStore( composedReducers );
  let childRoutes = routes(store);

  Router.run( childRoutes, location, (error, initialState, transition) => {

      var markup = ReactDOM.renderToString(
        <Provider store={store}>
            <Router {...initialState} />
        </Provider>,
      );

      let state = JSON.stringify(store.getState());

      var str = index
                .replace('${markup}', markup)
                .replace('${state}', state);

      // 將組合好的 html 字串返還，request 處理至此完成
      res.send(str);
  });

};

if( $UNIVERSAL ){
    app.use( handleRouting );
}else{

    // 如果要關掉 server rendering 時，手法如下：
    // 手法就是同樣在 server 上模擬一個空白的字串返還，讓 client 端有東西可解開就好
    const str = index.replace('${markup}', '').replace('${state}', null);
    app.get('*', (req, res) => {
      // 將組合好的 html 字串返還，request 處理至此完成
      res.send(str);
    });
}



// 示範可以正確在 server 上處理 404 頁面
app.get('*', function(req, res) {
    res.send('404 - Page Not Found');
})




app.listen(3000, function(){
    console.log('Listening on port 3000');
});
