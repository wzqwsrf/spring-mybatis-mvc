var DataSourceTree = function(options) {
	this._data 	= options.data;
	this._delay = options.delay;
};
DataSourceTree.prototype.data = function(options, callback) {
	var self = this;
	var $data = null;
	if(!("name" in options) && !("type" in options)){
		$data = this._data;
		callback({ data: $data });
		return;
	}
	else if("type" in options && options.type == "folder") {
		if("additionalParameters" in options && "children" in options.additionalParameters)
			$data = options.additionalParameters.children;
		else $data = {}
	}
	
	if($data != null)
		setTimeout(function(){callback({ data: $data });} , this._delay);
};

//var tree_data = {
//	'for-sale' : {name: 'For Sale', type: 'folder'}	,
//	'vehicles' : {name: 'Vehicles', type: 'folder'}	,
//	'rentals' : {name: 'Rentals', type: 'folder'}	,
//	'real-estate' : {name: 'Real Estate', type: 'folder'}	,
//	'pets' : {name: 'Pets', type: 'folder'}	,
//	'tickets' : {name: 'Tickets', type: 'item'}	,
//	'services' : {name: 'Services', type: 'item'}	,
//	'personals' : {name: 'Personals', type: 'item'}
//}
//tree_data['for-sale']['additionalParameters'] = {
//	'children' : {
//		'appliances' : {name: 'Appliances', type: 'item'},
//		'arts-crafts' : {name: 'Arts & Crafts', type: 'item'},
//		'clothing' : {name: 'Clothing', type: 'item'},
//		'computers' : {name: 'Computers', type: 'item'},
//		'jewelry' : {name: 'Jewelry', type: 'item'},
//		'office-business' : {name: 'Office & Business', type: 'item'},
//		'sports-fitness' : {name: 'Sports & Fitness', type: 'item'}
//	}
//}
//
//var treeDataSource = new DataSourceTree({data: tree_data});
