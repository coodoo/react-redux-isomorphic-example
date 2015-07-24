
+ 裝 babel-node












isomorphic-react-with-alt
=========================

[![Join the chat at https://gitter.im/coodoo/react-alt-isomorphic-example](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/coodoo/react-alt-isomorphic-example?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Preface

This is an example showcasing how to build isomorphic react application with [`Alt`](https://github.com/goatslacker/alt) which utilizes the same codebase on both server and browser and able to correctly handle multiple requests at one time.

Feel free to [ask questions](https://github.com/coodoo/react-alt-isomorphic-example/issues), [chat](https://gitter.im/coodoo/react-alt-isomorphic-example?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) or send over pull requests.

## Features Highlights

There are already a bunch of isomorphic examples out there, what's special about this one?

- it showcased __client-side routing__ using normal flux `store` (see `RouteStore.js`)

- it reuses data-fetching logics, no need to dupe them on the server and trying to keep both in sync in the future

- it uses `Alt` in a multiple-instance way instead of singleton, which is easier to maintain in the long run

- it's implementation is extremely simple and easy to understand

## Why Isomorphic

- shorter time-to-first page for better user experience

- deep linking for better usability (ie: bookmarking)

- SEO


## Goals

- reuse same codebase on both browser and server without any modification

- must be able to handle multiple requests on the server at the same time without polluting each other's data stores

- the approach must be easily understandable and simple to develop and maintain

- applicable to both isomorphic or browser-only applications

## Key problems solved with this approach

- how to handle multiple requests at the same time since
	- flux store is singleton
	- data-fetching is async

- reuse router and routing table on both ends

- passing same data between browser and server to save a round trip



## Why Alt

- it adheres to original flux implementation

- it adds just enough abstractions to avoid boilerplate code (ie: constants)

- it has nice auto-mappings between `actionCreators` and `stores` which saves time

- it supports isomorphic out of the box, with both `singleton` and `multi-instance` stores

- it provides `Iso` util to help with data marshalling

- in short, it provides a nice balance between __simplicity and efficiency__, which helps developer to do more and faster

## How to run the sample

```
$ npm install --global babel
$ npm install
$ npm start
```

## 5000ft overview

Here's a 5000ft view of how a web application works on the server.

When a request hits the server, we figure out what data it needs, fetch those, feed them to react app, let the app populates all stores and renders the views, when it's all done we invoke `React.renderToString` to get a html string which can be returned to the client request.

One key goal here is we want to use the same codebase on both server and browser, without any modification.


## Server

- see `./server.js`

- although we are using `Express` here, you are free to use `koa` or any other stacks, as long as it supports javascript

- index.html

	- notice there's no physical `index` file

	- index page is concatenated on the fly from `template strings` because there are variables needed to be replaced

- routing

	- in order to avoid writing routing rules twice on both server and browser, we share the routing table (a file with plain old javascript inside) on both ends

	- when `server.js` first run, it reads in the routing table and create routing rules using `express router`

	- one added benefit of doing it this way is we get to handle `404` pages on the server, instead of delegating everything blindly to the client's router using a `catch all` rule

- handling requests

	- when a request hits the server, it will trigger one of the routing rule defined earlier

	- then our app will create a new instance of `flux` which contains standalone `actionCreators` and `stores`

	- each request is handled by a standalone `flux` hence no two requests can interfere with each other

	- then it passes in the requesting url to `RouteStore` and let it fetch the data needed and do the following job inside, by doing so we just need to write data fetching logic once and use it on both sides

	- one thing to note is `RouteStore` returns a `promise` so that we know when react app finishes it's work inside and it's safe for us to invoke `React.renderToString` to generate the final html strings

	- once we get the rendered html string, we augments it with special tags and serialize fetched data with the help from `Iso` (an utility provided by `Alt` which serialize and de-serialize data on both ends)

	- eventually we return the rendered string to the client, completes the request and respond cycle

## Client

- `flux` instance on the client side

	- see `flux.js`

	- as mentioned  earlier in [Server](#server) section, we create a new `flux` instance for every incoming request to handle `actionCreators` and `stores`, we do the same on the client side by creating one `flux` instance to hold data and boot the app

	- inside each `flux` object it contains a standalone set of `actionCreators` and `stores` needed by the react app

	- this way we make sure data won't be mixed between different `stores`, hence ensuring user's privacy and security

	- `flux.js` handles all the heavy lifting for us, we just need to add in all needed `actionCreators` and `stores` there

	- one important thing to note though, we need to add `actionCreators` first so that it can be accessed later by `stores`

- Booting the app

	- all boot scripts lives inside `boot.js`, it's the entry point to our app

	- just like on the server, we create a new instance of `flux` first

	- then restore the app states with `Iso.bootstrap()` which de-serialize data passed from server and populate the client app's `stores`


	- once `stores` are populated and ready, we kick start the react app by rendering it's root component along with the `flux` instance created earlier

		```js
		React.render( React.createElement(App, {flux: flux}), container);
		```

	- the benefit of doing so is we get to reuse data fetched by the server in the browser, hence saving an extra API call from client to the server to fetch those data again

- About the `Store`

	- each `store` module exposes a `class` definition by

		```js
		module.exports = ProductStore;
		```

	- Unlike non-isomorphic alt implementation, which exposes a `store` instance by

		```js
		module.exports = alt.createStore(ProductStore, 'ProductStore');`
		```

	- if you need to access `actionCreators` inside the stores, you can do that by:

		```js
		ActionCreators = this.alt.getActions('ActionCreators');
		```

		normally we do that once inside the `store`'s constructor and keep the reference for later use

	- `this.alt` is the `flux` instance we created earlier inside `flux.js`, remember that?

- About the view

	- remember when kicking start the react app, we passed in the `flux` instance which contains all `actionCreators` and `stores` needed through out the entire app?

	- We need to pass that `flux` instance down to all react components so that they can access `actionCreators` and `stores`

	- we use an undocumented react feature called `context` to help passing down the object (just be rest assured that `context` will [stick around](https://goo.gl/W5yJbd) and it's safe to use)

	- in order to utilize `context`, we need to declare some variables in our root view, see `js/app.js`

		```js

		childContextTypes: {
	         flux: React.PropTypes.object.isRequired
	    },

	    getChildContext: function() {
	         return { flux: this.props.flux || new Error('flux not found!') };
	    },

		```

	- then in child components, we access that piece of information from the root view like this:

		```js
		componentWillMount() {
			// retrieve the flux instance passed down from root view and keep the reference
			flux = this.context.flux;

			// then we get hold of actionCreators and stores needed in this child component
			ActionCreators = flux.getActions('ActionCreators');

			ProductStore = flux.getStore('ProductStore');
		}
		```

	- we demonstrated writing react components in both `ES5` (`ProductItemContainer.js) and `ES6` (`ProductsContainer.js`), there are minor syntax and code structure differences you need to pay attention to

- About the router

	- We showcased a complete client-side routing solution too

		- the design goal here is to treat routing just like any other `Stores`, and make sure it's cleanly decoupled from the view

		- `RouteStore` provides client-side routing capabilities

		- it encapsulate `page.js` as the inner router (which can be swap out anytime)

		- provides a set of APIs (public methods) which can be invoked on both server and browser

		- drives the app via routing rules and handlers


	- Notice client-side routing rules are initialized inside a `setTimeout` call and it only gets run when in a browser environment

	- In short, we don't intend to directly reuse the same router on both server and browser, instead we share the routing table to avoid duped work


## FAQ

- why not use react-router?

	IMHO __router should not be tightly coupled with the view in any regard__, wrapping it in a `RouteStore` is more flexible and decoupled, also we get to switch out different routers in the future (we used `page.js` in this example, but we tried a bunch of other routers which all worked pretty well)

- is this battle-tested?

	Yes, it's currently in production for some of the sites we are running

- need help?

	- First try the `github issue` section

	- Second, ask in the [chat room](https://gitter.im/coodoo/react-alt-isomorphic-example)

	- Lastly, shoot me an [email](jeremy@pubulous.com)

## Notice

- currently we are depending on a custom-built `flux dispatcher` using `npm-shrinkwrap.json` due to the version available on npm is outdated, once that's updated to the latest one we will remove the dependency.
