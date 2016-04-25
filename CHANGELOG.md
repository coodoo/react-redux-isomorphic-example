
- Apr 25, 2016

	history                            ^2.0.1  →   ^2.1.0
	immutable                          ^3.7.5  →   ^3.8.1
	react                        ^15.0.0-rc.2  →  ^15.0.1
	react-dom                    ^15.0.0-rc.2  →  ^15.0.1
	react-redux                        ^4.0.0  →   ^4.4.5
	react-router                       ^2.0.0  →   ^2.3.0
	redux                              ^3.0.4  →   ^3.5.2
	babel-core                         ^6.6.4  →   ^6.7.7
	redbox-react                       ^1.1.1  →   ^1.2.3
	redux-devtools                     ^3.1.1  →   ^3.2.0
	redux-devtools-dock-monitor        ^1.1.0  →   ^1.1.1
	redux-devtools-log-monitor         ^1.0.5  →  ^1.0.11
	style-loader                      ^0.13.0  →  ^0.13.1
	webpack                           ^1.12.3  →  ^1.13.0
	webpack-dev-middleware             ^1.2.0  →   ^1.6.1

- Mar. 22, 2016

	- upgrade everything to latest, including  react v15-rc2
    - simplified the universal approach a bit
    - re-enabled `redux-devtools`, could toggle it on/off [here](https://github.com/coodoo/react-redux-isomorphic-example/blob/master/common/utils/configureStore.js#L8), be advised if you toggle `redux-devtools` on it will break universal rendering (you will see warnings in browser console saying react failed to reuse markup generated on server...etc), but `redux-devtools` was meant for use only in development anyway so just remember to turn it off before deploy.<wink />
