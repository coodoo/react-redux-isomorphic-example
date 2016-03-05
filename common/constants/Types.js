
import Immutable from 'immutable';

export const ProductState = Immutable.Record({
	productsById: Immutable.Map(),
	currentProductId: undefined,
	total: '0',
	$fetched: false,
})

export const ProductRecord = Immutable.Record({
	id: null,
	image: "",
	inventory: 0,
	quantity: 0,
	price: 0,
	title: ""
})

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
