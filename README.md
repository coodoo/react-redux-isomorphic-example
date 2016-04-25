
Universal Example with React and Redux
======================================

## Introduction

This is an isomorphic/universal example built with react and [`Redux`](https://github.com/gaearon/redux) which utilizes the same codebase on server and browser to correctly handle multiple requests at the same time.

This example was previously built with [alt](https://github.com/coodoo/react-alt-isomorphic-example) and now fully migrated to `redux`, you might as well compare the two and see the differences.

Feel free to [ask questions](https://github.com/coodoo/react-redux-isomorphic-example/issues) or send over pull requests.

## How to run

```
$ npm i
$ npm start
```

Then visit `localhost:3000`.

### Upgrade Notes

- It is highly recommented to always __remove__ `node_modules` and reinstall everything to avoid any possible issues

## The case for redux

We love react and flux for that it provides a smooth workflow and much simpler mindset to develop applications.

On top of that, redux makes things like __10x__ easier by transforming `flux store` into pure functions, with no state stored inside, which solved a lot of `singleton` and `waiting` issues in other implementations, it also encourages a lot of best practices like `container component`, easy extension points and minimal API surface area.

Under the hood, redux is heavily based on various `functional programming` ideas to make those nice things happen, but don't let the functional aspect of redux scares you off, __`as a lib user, you don't really need to know about those inner workings to get started`__.

That being said, it's quite an enjoyable and amazing experience to read through the whole codebase line by line and fully comprehend how things were designed to work in a very different manner, it's truly an eye opener.

In short, if you could only pick up one new skill this summer (2015), `redux` should be on top of your list (and a bit of functional programming knowledge won't hurt too :)


## Feature Highlights

- React, Redux, universal/isomorphic, ES6/7, webpack, babel and _all those usual suspects!_


- Uses `Promise middleware` for redux to showcase async data fetching along with optimistic updating for each REST API calls

- Uses `createReducer` to greatly simplify `reducers` code by using `constant mapping`

- Showcase async data fetching solutions with `react-router` before displaying each view (hence no blank screen while waiting for data to be downloaded)

- Showcase how to easily implement `universal` application with `redux` and `react-router` on the server (and dehydrate the data on the client too)

## Goals of the example

- Reuse the same codebase on both the browser and server without any modification

- Must be able to handle multiple requests on the server at the same time without polluting each user's data

- The approach must be easily understandable and simple to develop and maintain so it's strongly fool-proof in a team environment

- The application can be used in either `universal` (a.k.a server-rendering) or `pure client` mode

## Why Universal App?

- Shorter time-to-first-page means better user experience

- Deep linking into the application for better usability (ie: bookmarks)

- SEO (of course!)

## Technical highlights

#### 1. Learn from mistakes

An early implementation of this example handles the data model wrong by mutating the state passed into each reducer hence causing a lot of strange issues like making `redux-devtools` acting funny.

[@gaearon](https://github.com/gaearon), author of both `redux` and `redux-devtools`, was kindly enough to [pointed out those mistakes](https://github.com/coodoo/react-redux-isomorphic-example/issues/9) and provided detailed instructions on how to make it right.

Later the example was migrated to use `immutablejs` but the `immutability` spirit stays the same.

#### 2. Key things to note about universal implementations

- We want to reuse all routing rules on both the client and server, no dupe works needed
- We need to make sure data for each view is fully fetched before rendering to string, this is tricky because most REST API calls are async
- With redux and react-router in place, all these can be done easily and gracefully with `Router.run`, checkout `server.js`.

#### 3. How immutable data model works

[`Immutable.js`](https://github.com/facebook/immutable-js/) was picked for the job for two main reasons:

1. Immutable source of truth (data model) is easy to reason about, it makes dirty diff fast and the overal app state less error-prone.

2. The data structure itself is fully fool-proof, meaning no one can accidentally modify the data model and causing bugs that are extremely hard to trace and fix, especially in a large team.

Pay special attention to the use of `Immutable.Record` data structure and `update()` method used to manipulate data.

#### 4. How container component works

In most redux applications `<Connector>` is the root container component that holds all child components, it's responsible for fetching application state from outside, stores it, monitor it's `change` event and triggers redraw.

There's a nice `select` function in `<Connector>` that you could use to cherry pick and monitor only those `reducers` you are interested, by doing so you avoided unnecessary redraw calls hence making the app more performant.


## Redux-devtools included

With [redux-devtools](https://github.com/gaearon/redux-devtools/) in place, you can undo/redo changes anytime, just like travelling back and forth in time, it's super neat being able to debug the application at different status.

Pro hint, it can be toggled off by setting `window.$REDUX_DEVTOOL = false;` in `boot.js`.

![redux-devtools inaction](https://raw.githubusercontent.com/coodoo/react-redux-isomorphic-example/master/client/assets/images/cap.png)

## Special thanks

Thanks [@gaearon](https://github.com/gaearon) for code review and pointing out misc. issues. [Lee Byron](https://github.com/leebyron) for bringing `immutable.js` to the world, it makes everything easier, you guys rock!
