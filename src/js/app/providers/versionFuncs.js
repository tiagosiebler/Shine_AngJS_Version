(function() {
    angular.module('versionFuncs', ['Data', 'appVersionViewCtrl','gameVersionViewCtrl','unknownVersionViewCtrl'])
	
	.factory("versionFuncs", ['Data', '$uibModal', function(Data, $uibModal){
			var obj = {};
			obj.get = function(params){	
				console.log("-- get function");
			};
			obj.regenerateKey = function(hash_id,memberID){
				var viaIDtype 	= '';
				var viaID 		= '';
				
				if(hash_id){
					console.log("via hash_id");
					viaIDtype 	= 'hash_id';
					viaID 		= hash_id;
				}
				else if(memberID){
					console.log("via memberID");
					viaIDtype 	= 'memberID';
					viaID 		= memberID;
				}
				
				return Data.post('regenerateKey', {
					viaID: 		viaID,
					viaIDType: 	viaIDtype
				});
			};
			obj.viewAppVersion = function(hash_id,type,versions,app_list){
				var columns = {};

				if(versions && hash_id){
					for (var i = 0, len = versions.length; i < len; i++) {
					    if (versions[i].hash_id === hash_id) {
							var columns = versions[i];
					        break;
					    }
					}
					if(!columns.hash_string){
						//debugger;
						//console.log("don't have data for hash_id, won't pass on column data")
					}
				}
				else if(!hash_id){
					// prepare for new hash_id
					hash_id = 0;
				}
				
				// open modal
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'partials/pages/tables/sub/appVersionView.html',
					controller: 'appVersionViewCtrl',
					size: 'lg',
					windowClass: 'app-modal-window',
					resolve: {
						appVersion: function () {
							return columns;
						},
						hash_id: function (){
							return hash_id;
						},
						app_list: function (){
							return app_list;
						}
					}
				});

				modalInstance.rendered.then(function (result) {
					// needed to set height to scroll inside modal pane, and increase relative height of pane
				    $('.modal .modal-body').css('overflow-y', 'auto'); 
				    $('.modal .modal-body').css('max-height', $(window).height() * 0.7);
				    $('.modal .modal-body').css('height', $(window).height() * 0.7);
				});

				return modalInstance.result.then(function (result) {
					//$scope.selected = selectedItem;
					//console.log("Caught "+result.action+" action.");
					if(result.action === 'update' || result.action === 'create' || result.action === 'delete'){						
						Data.toastMsg("info","Sending "+result.action+" request...");
													
						// return object so it can be accessed in caller
						return Data.post('version', {
							updateObject: 	result.data,
							updateID: 		result.data.id,
							versionType: 	result.versionType,
							action: 		result.action
						})
						.then(function (results) {
							//return results, so server data is accessible in promise
							Data.toastMsg("success","App Version Saved");
							
							return results;
						});
					}						
					else
						Data.toastMsg("error","Unhandled result!");
						
				}, function () {
					console.log('Modal dismissed at: ' + new Date());	
				});
			};
			obj.viewGameVersion = function(game_id,versions,app_list){
				var columns = {};

				if(versions && game_id){
					for (var i = 0, len = versions.length; i < len; i++) {
					    if (versions[i].game_id === game_id) {
							var columns = versions[i];
					        break;
					    }
					}
					if(!columns.vers_bytes){
						//debugger;
						//console.log("don't have data for game_id, won't pass on column data")
					}
				}
				else if(!game_id){
					// prepare for new game_id
					game_id = 0;
				}
				
				// open modal
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'partials/pages/tables/sub/gameVersionView.html',
					controller: 'gameVersionViewCtrl',
					size: 'lg',
					windowClass: 'app-modal-window',
					resolve: {
						gameVersion: function () {
							return columns;
						},
						game_id: function (){
							return game_id;
						},
						app_list: function (){
							return app_list;
						}
					}
				});

				modalInstance.rendered.then(function (result) {
					// needed to set height to scroll inside modal pane, and increase relative height of pane
				    $('.modal .modal-body').css('overflow-y', 'auto'); 
				    $('.modal .modal-body').css('max-height', $(window).height() * 0.7);
				    $('.modal .modal-body').css('height', $(window).height() * 0.7);
				});

				return modalInstance.result.then(function (result) {
					//$scope.selected = selectedItem;
					//console.log("Caught "+result.action+" action.");
					if(result.action === 'update' || result.action === 'create' || result.action === 'delete'){						
						Data.toastMsg("info","Sending "+result.action+" request...");
													
						// return object so it can be accessed in caller
						return Data.post('version', {
							updateObject: 	result.data,
							updateID: 		result.data.id,
							versionType: 	result.versionType,
							action: 		result.action
						})
						.then(function (results) {
							//return results, so server data is accessible in promise
							Data.toastMsg("success","Game Version Saved");
							
							return results;
						});
					}						
					else
						Data.toastMsg("error","Unhandled result!");
						
				}, function () {
					console.log('Modal dismissed at: ' + new Date());	
				});
			};
			obj.viewUnknownVersion = function(id,versions){
				var columns = {};

				if(versions && id){
					for (var i = 0, len = versions.length; i < len; i++) {
					    if (versions[i].id === id) {
							var columns = versions[i];
					        break;
					    }
					}
					if(!columns.vers_bytes){
						//debugger;
						//console.log("don't have data for id, won't pass on column data")
					}
				}
				else if(!id){
					// prepare for new id
					id = 0;
				}
				
				// open modal
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'partials/pages/tables/sub/unknownVersionView.html',
					controller: 'unknownVersionViewCtrl',
					size: 'lg',
					windowClass: 'app-modal-window',
					resolve: {
						unknownVersion: function () {
							return columns;
						},
						id: function (){
							return id;
						}
					}
				});

				modalInstance.rendered.then(function (result) {
					// needed to set height to scroll inside modal pane, and increase relative height of pane
				    $('.modal .modal-body').css('overflow-y', 'auto'); 
				    $('.modal .modal-body').css('max-height', $(window).height() * 0.7);
				    $('.modal .modal-body').css('height', $(window).height() * 0.7);
				});

				return modalInstance.result.then(function (result) {
					//$scope.selected = selectedItem;
					//console.log("Caught "+result.action+" action.");
					if(result.action === 'update'){						
						Data.toastMsg("info","Sending "+result.action+" request...");
													
						// return object so it can be accessed in caller
						return Data.post('version', {
							updateObject: 	result.data,
							updateID: 		result.data.id,
							versionType: 	result.versionType,
							action: 		result.action
						})
						.then(function (results) {
							//return results, so server data is accessible in promise
							Data.toastMsg("success","Unknown Version Saved");
							
							return results;
						});
					}						
					else
						Data.toastMsg("error","Unhandled result!");
						
				}, function () {
					console.log('Modal dismissed at: ' + new Date());	
				});
			};
			return obj;
		}
	])
	
})();