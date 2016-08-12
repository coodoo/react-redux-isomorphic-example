// for use on server to guarantee data was fetched before rendering pages for user
export default function fetchComponentData(dispatch, components, params) {

  const needs = components.reduce( (prev, current) => {

  	return Object.keys(current).reduce( (acc, key) => {
  		if (!!current[key] && current[key].hasOwnProperty('needs')) {
                return current[key].needs.concat(acc)
            }
        return acc
  	}, prev)

  }, []);

  const promises = needs.map(need => dispatch(need(params)));

  return Promise.all(promises);
}

// for client side use, let each component trigger it's fetching data logics
// might as well to add in dupe check to avoid fetching when data is already there
export function fetchNeeds( needs, props ){
	const { params, dispatch } = props;
	needs.map( need => dispatch(need(params)) )
}
