
import React from 'react';

// @todo: 為何要有 static displayName 這屬性？
export default function fetchData( fn ) {
  return DecoratedComponent => class ConnectorDecorator extends React.Component {
    static DecoratedComponent = DecoratedComponent;

    static onEnter = store => {

        // 給 react-router 調用的 onEnter function
        return (state, transition, callback) => {

            var promise = fn(store, state) || Promise.resolve(true)
            promise.then( result => callback(), err => callback(err) );

            // 一律先觸發 callback 讓 react-router transition 順利進行下去
            if ('undefined' !== typeof window && window.$RESTORED == true ) callback();
        }
    }

    render() {
      return <DecoratedComponent {...this.props} />
    }
  };
};
