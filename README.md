
isomorphic-react-with-redux
=========================

## Introduction

This is an isomorphic example built with react and [`Redux`](https://github.com/gaearon/redux) which utilizes the same codebase on both server and browser to correctly handle multiple requests at one time.

This example was previously built with [alt](https://github.com/coodoo/react-alt-isomorphic-example) and now fully migrated to `redux`, you might as well compare the two and see the differences.

Feel free to [ask questions](https://github.com/coodoo/react-redux-isomorphic-example/issues) or send over pull requests.


## The case for redux

We love react and flux for it's smooth workflow and simpler mindset which makes app development a lot easier.

Redux further makes everything __10x__ easier by transforming `flux store` into pure functions, with no state stored inside, which solved a lot of `singleton` and `waiting` issues in other implementations, it also encourages a lot of best practices like `container component`, easy extension points and minimal API surface area.

Under the hood, redux is heavily based on `functional programming` principals to make those nice things happen, but don't let the functional aspect of redux scares you off, __`as a lib user, you don't really need to know about any of those and get started real quick`__.real

That being said, it's quite an enjoyable and amazing experience to read through the codebase line by line and fully understand how things worked with a very different approach, it's truly an eye opener.

In short, if you could only pick up one new skill this summer (2015), redux should be on the top of your list, highly recommended.


## Feature Highlights

There are already a bunch of isomorphic examples out there, what's special about this one?

- it showcased an different __client-side routing__ approach using normal flux `store` (see `routr.js`)

- it reuses all routing rules, callbacks and data-fetching logics on both client and server, no need to dupe them on the server and trying to keep both in sync in the future

- it's implementation is extremely simple and easy to understand

- it's based on [`redux v1.0.0-rc`](https://github.com/gaearon/redux/tree/breaking-changes-1.0)'s latest API

- Using latest `ES6 and ES7` syntaxes



## Goals for this example

- reuse same codebase on both browser and server without any modification

- must be able to handle multiple requests on the server at the same time without polluting each other's data stores

- the approach must be easily understandable and simple to develop and maintain

- applicable to both isomorphic or browser-only applications

## Why Isomorphic

- shorter time-to-first-page for better user experience

- deep linking for better usability (ie: bookmarks)

- SEO

## Pay attention to these

#### How client-side routing works

- __The whole routing implementation is cleanly separated from the view, wrapping everything in a `flux store` (as named `reducer` in redux), this offers an alternative option beside `react-router`__

- Have a look at `routr.js`, see how it shares the same routing rules and hanlders on both client and server.

- See `server.js` how it invoke `routr` callbacks from outside and hook into the redux dispatching process, and also how it knows when data fetching from async sources is done

- Trace how `http://localhost/2` works on both server and client, how parameters are processed, passed into the app and triggers data fetching

#### How container component works

In most redux applications `<Connector>` is the root container component that holds all child components, it's responsible for fetching application state from outside, stores it, monitor it's `change` event and triggers redraw.

There's a nice `select` function in `<Connector>` that you could use to cherry pick and monitor only those `reducers` you are interested, by doing so you avoided unnecessary redraw calls hence making the app more performant.

See how it works in `AppWrap.js`.

## How to run the example

```
$ npm install --global babel
$ npm install
$ npm start
```

Of course it's necessary that you have fully understood how `redux` works in general, having a look at [these examples](https://github.com/gaearon/redux/tree/breaking-changes-1.0/examples) would be a good start.