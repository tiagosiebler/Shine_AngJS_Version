(function() {
    angular.module('orderFuncs', ['Data','memberFuncs'])
	
	.factory("orderFuncs", ['Data', '$uibModal', 'memberFuncs', function(Data, $uibModal, memberFuncs){
			var obj = {};
			obj.get = function(params){	
				console.log("-- get function");
			};
			obj.resendConfirmationEmail = function(orderID,memberID){
				var viaIDtype 	= '';
				var viaID 		= '';
				
				if(orderID){
					console.log("via orderID");
					viaIDtype 	= 'orderID';
					viaID 		= orderID;
				}
				else if(memberID){
					console.log("via memberID");
					viaIDtype 	= 'memberID';
					viaID 		= memberID;
				}
//				console.log("send post request to send activation email "+viaID + " and type: " + viaIDtype);
				
				Data.toastMsg("info","Preparing request");
				
				Data.post('resendConfirmation', {
					viaID: 		viaID,
					viaIDType: 	viaIDtype
				})
				.then(function (results) {	
					Data.toastMsg(results.status,results.message);
				});
				
			};
			obj.regenerateKey = function(orderID,memberID){
				var viaIDtype 	= '';
				var viaID 		= '';
				
				if(orderID){
					console.log("via orderID");
					viaIDtype 	= 'orderID';
					viaID 		= orderID;
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
			obj.setDeactivated = function(orderID,memberID,value){
				var viaIDtype 	= '';
				var viaID 		= '';
				
				if(orderID){
					console.log("via orderID");
					viaIDtype 	= 'orderID';
					viaID 		= orderID;
				}
				else if(memberID){
					console.log("via memberID");
					viaIDtype 	= 'memberID';
					viaID 		= memberID;
				}
				
				return Data.post('setDeactivated', {
					viaID: 			viaID,
					viaIDType: 		viaIDtype,
					setDeactivated: value
				});
			};
			obj.viewOrder = function(orderID,orders){
				//console.log("view order function for ID: "+orderID);
				var columns = {};

				if(orders && orderID){
					for (var i = 0, len = orders.length; i < len; i++) {
					    if (orders[i].order_id === orderID) {
							var columns = orders[i];
					        break;
					    }
					}
					if(!columns.business){
						//debugger;
						//console.log("don't have data for orderID, won't pass on column data")
					}
				}
				else if(!orderID){
					// prepare for new orderID
					orderID = 0;
				}
				
				// open modal
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'partials/pages/tables/sub/orderView.html',
					controller: 'orderViewCtrl',
					size: 'lg',
					windowClass: 'app-modal-window',
					resolve: {
						order: function () {
							return columns;
						},
						orderID: function (){
							return orderID;
						}
					}
				});

				modalInstance.rendered.then(function (result) {
					// needed to set height to scroll inside modal pane, and increase relative height of pane
				    $('.modal .modal-body').css('overflow-y', 'auto'); 
				    $('.modal .modal-body').css('max-height', $(window).height() * 0.7);
				    $('.modal .modal-body').css('height', $(window).height() * 0.7);
				});

				modalInstance.result.then(function (result) {
					//$scope.selected = selectedItem;
					//console.log("Caught "+result.action+" action.");
					if(result.action === 'viewMember'){
						memberFuncs.viewMember(result.data,[]);
					}
				}, function () {
					console.log('Modal dismissed at: ' + new Date());	
				});
			};
			return obj;
		}
	])
	
})();