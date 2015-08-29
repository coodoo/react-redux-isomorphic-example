import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import promiseMiddleware from './utils/PromiseMiddleware';
import { Provider } from 'react-redux';
import * as reducers from './reducers';
import {Router} from 'react-router';
import Location from 'react-router/lib/Location';
import routes from './routes/routing';


// const index = fs.readFileSync( path.resolve('../assets/index.html'), {encoding: 'utf-8'});
const index = fs.readFileSync( './assets/index.html', {encoding: 'utf-8'});
const composedReducers = combineReducers(reducers);
const finalCreateStore = applyMiddleware( promiseMiddleware )(createStore);

// routing middleware where server-rendering magic happens
// @TODO: we shall check whether this request will be handled by react-router (matching one of it's rules) or not,
// if not, call next() and let server.js shows 404 page,
// for now there's no reliable way to do this, `Router.match()` just got scraped on the main branch.
function handleRouting(req, res, next){

  let location = new Location(req.path, req.query);
  let store = finalCreateStore( composedReducers );
  let childRoutes = routes(store);

  Router.run( childRoutes, location, (error, initialState, transition) => {

      // 如果找不到 match 的 route，也可噴錯，丟出去給外層處理
      // return next('err msg: route not found');

      // 找不到 match 的 routing，就丟出去給外層處理
      /*if(transition.isCancelled){
        return next();
      }*/

      var markup = ReactDOM.renderToString(
        <Provider store={store}>
            <Router {...initialState} />
        </Provider>,
      );


      let state = JSON.stringify(store.getState());

      var str = index
                .replace('${markup}', markup)
                .replace('${state}', state);

      // console.log( '\n生成 markup:\n', str );

      // 將組合好的 html 字串返還，request 處理至此完成
      res.send(str);
  });


};

module.exports = function(app){
	app.use(handleRouting);
}
