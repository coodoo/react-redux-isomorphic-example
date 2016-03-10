export default function fetchComponentData(dispatch, components, params) {

  const needs = components.reduce( (prev, current) => {

  	return Object.keys(current).reduce( (acc, key) => {
  		return current[key].hasOwnProperty('needs') ? current[key].needs.concat(acc) : acc
  	}, prev)

  }, []);

  const promises = needs.map(need => dispatch(need(params)));

  return Promise.all(promises);
}

// 個別元件內部抓取所需資料
export function fetchNeeds( props, needs ){
	const { params, dispatch } = props;
	needs.map( need => dispatch(need(params)) )
}
