// client/server 共用的 routing table
module.exports = [
	{path:'/', handler: 'todoReadAll'},
	{path:'/:id', handler: 'todoReadOne'},
]
