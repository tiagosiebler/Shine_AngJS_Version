(function() {
    angular.module('memberFuncs', ['Data'])
	
	.factory("memberFuncs", ['Data', '$uibModal',
		function(Data, $uibModal){
			var obj = {};
			obj.get = function(params){	
				console.log("-- get function");
				
				
				
			};
			obj.viewMember = function(memberID,members){
				//console.log("view member function for ID: "+memberID);
				var columns = {};
				window.location.href = "#/member/"+memberID;
				//modals take too much valuable screenspace for this, full page display instead
				/*
				if(members && memberID){
					for (var i = 0, len = members.length; i < len; i++) {
					    if (members[i].member_id === memberID) {
							var columns = members[i];
					        break;
					    }
					}
					if(!columns.member_email){
						//debugger;
						//console.log("don't have data for memberID, won't pass on column data")
					}
				}
				else if(!memberID){
					// prepare for new memberID
					memberID = 0;
				}
				
				// open modal
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'partials/pages/tables/sub/memberView.html',
					controller: 'memberViewCtrl',
					size: 'lg',
					windowClass: 'app-modal-window',
					resolve: {
						member: function () {
							return columns;
						},
						memberID: function (){
							return memberID;
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
					if(result.action === 'openOrder'){
						debugger;
						$scope.openOrder(result.data);
					}
				}, function () {
					console.log('Modal dismissed at: ' + new Date());	
				});*/
			}
			return obj;
		}
	])
	
})();