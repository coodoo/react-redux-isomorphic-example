
import Immutable from 'immutable';

// 定義　redux state 內 ProductState 的 shape
export const ProductState = Immutable.Record({
	productsById: Immutable.Map(),
	total: '0',
})

// 定義　Product 的 object shape
export const ProductRecord = Immutable.Record({
	id: null,
	image: "",
	inventory: 0,
	quantity: 0,
	price: 0,
	title: ""
})

// 定義　redux state 內 CartState 的 shape
export const CartState = Immutable.Record({
	cartsById: Immutable.List()
})


export function convertToRecordMap( arr, Def ){
	return arr.reduce( (acc, item) => acc.set( item.id, new Def(item) ), Immutable.Map() );
}

export function convertMapToImmutable( map, Def ){
	return Object.keys(map)
				 .reduce( (acc, key) => {
				 	let item = map[key];
				 	return acc.set( item.id, new Def(item) );
				 }, Immutable.Map() );
}
