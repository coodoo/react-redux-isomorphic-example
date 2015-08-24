// client/server 共用的 routing table
import * as actions from './actions/ShopActions';

console.log( 'actions 有貨: ', actions );

// jx: 這裏改成直接調用 fn，不再是 string 了
module.exports = [
	{path:'/', handler: actions.readAll },
	{path:'/:id', handler: actions.readOne },
]
