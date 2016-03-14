
import Immutable from 'immutable';

// define ProductState shape inside redux state
export const ProductState = Immutable.Record({
	productsById: Immutable.Map(),
	total: '0',
})

// define Product record shape
export const ProductRecord = Immutable.Record({
	id: null,
	image: "",
	inventory: 0,
	quantity: 0,
	price: 0,
	title: "",
	tid: null, // transaction id for optimistic update
})

// define CartState shape inside redux state
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
