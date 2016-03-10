export default function fetchComponentData(dispatch, components, params) {

  const needs = components.reduce( (prev, current) => {

  	return Object.keys(current).reduce( (acc, key) => {
  		// console.log( '\n有 needs 嗎: ', current[key].hasOwnProperty('needs') )
  		// if(comp.hasOwnProperty('need')) return comp.needs.concat(acc)
  		return current[key].hasOwnProperty('needs') ? current[key].needs.concat(acc) : acc
  	}, prev)

    // return current ? (current.needs || []).concat(prev) : prev;

  }, []);

  // console.log( '\n多少 needs: \n', require('util').inspect( needs , false, 3, true) )

  const promises = needs.map(need => dispatch(need(params)));

  return Promise.all(promises);
}
