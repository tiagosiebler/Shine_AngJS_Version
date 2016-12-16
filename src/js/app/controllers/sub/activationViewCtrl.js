angular.module('activationViewCtrl', ['timeMathFltr','confirm'])
	.controller('activationViewCtrl', ['$scope', '$timeout', 'Data', '$routeParams', '$uibModal', 'orderFuncs', 'memberFuncs', function ($scope, $timeout, Data, $routeParams, $uibModal, orderFuncs, memberFuncs) {

		$scope.act = {};
		
		$scope.act.id = "";
		
		$scope.act.id = $routeParams.ref;
		if(!$scope.act.id)//will later use blank ID to go to new order page
			window.history.back();
		
		$scope.saveLabel = "Save Activation"
		$scope.saveAction = "save";
		$scope.newLabel = "Viewing Activation ID #";
		
		$scope.activatedAction = "Deactivate";
		$scope.deactivatedMsg = '';
		$scope.deactivated = false;
		
	    $scope.save = function () {
			var result = {
				action: $scope.saveAction,
				data: $scope.act
			};
			$uibModalInstance.close(result);
	    };
		$scope.resendConfirmation = function(){
			orderFuncs.resendConfirmationEmail($scope.act.id,null);
		}
		$scope.regenerateKey = function(){
			orderFuncs.regenerateKey($scope.act.id,null)
			.then(function (results) {
				// update vars on page
				$scope.act.license 			= results.new_key;
				
				Data.toastMsg(results.status,results.message);
			});
		}
		$scope.setDeactivated = function(value){
			if(value)
				Data.toastMsg("info","Deactivating...");
			else
				Data.toastMsg("info","Reactivating...");
			
			orderFuncs.setDeactivated($scope.act.id,null,value)
			.then(function (results){
				if(results.status == 'success'){
					$scope.deactivated = value;
					if(value)
						$scope.act.deactivated = 1;
					else
						$scope.act.deactivated = 0;
					
					$scope.isDeactivated();
					Data.toastMsg("success","Saved");
				}
			});
		}
		$scope.getActivationDetails = function(){
			//todo, need to make server-side GET handler for this
			if($scope.act.id){
				//console.log("getting order details");
				Data.post('getActivationDetails', {
					activationID: 	$scope.act.id,
					action: 'get'
				})
				.then(function (results) {	
					var message = JSON.parse(results.message);

					var id = $scope.act.id;
					$scope.act = message.columns;
					$scope.act.id = id;
					
		            $scope.myComments 		= angular.copy($scope.act.comments);
		            $scope.myForm.$setPristine();
					
					getAccountDetails();
				});
			}
			else
				getAccountDetails();
				
			
		}
		$scope.getUserDetails = function(){	
			return false;
					
			if($scope.act.id){
				if(!$scope.act.business){
					//console.log("getting order details");
					Data.post('getOrderDetails', {
						orderID: 	$scope.act.id,
						action: 'get'
					})
					.then(function (results) {	
						var message = JSON.parse(results.message);
					
						var id = $scope.act.id;
						$scope.act = message.columns;
						$scope.act.id = id;
						getAccountDetails();
					});
				}
				else
					getAccountDetails();
			}	
		}
		
		$scope.viewMember = function(){
			// close, let parent call the function below
			var result = {
				action: 'viewMember',
				data: $scope.member_id
			};
			//$uibModalInstance.close(result);
			memberFuncs.viewMember($scope.member_id,[]);
		}
		
		$scope.isDeactivated = function(){
			if($scope.deactivated){
				$scope.activatedAction = "Reactivate";
				$scope.deactivatedMsg = '<span class="glyphicon glyphicon-warning-sign"></span> account deactivated!';
				return true;
			}
			else{
				$scope.activatedAction = "Deactivate";
				return false;
			}
			
		}
		$scope.toggleActivation = function(){
			if($scope.deactivated)
				var setDeactivated = false;
			else
				var setDeactivated = true;
			
			Data.post('account', {
				email: 			$scope.act.payer_email,
				deactivated: 	setDeactivated,
				action: 'updateActive'
			})
			.then(function (results) {	
				var message = JSON.parse(results.message);

				if($scope.deactivated){
					$scope.deactivated 	= true;
				}
				else
					$scope.deactivated = false;
				//Data.toastMsg("success","Account details retrieved");
			});
		};
		$scope.showRequest = function() {
	        console.log('showing request');
			var modalContents = this.act.activation_array;
			
			var modalInstance = $uibModal.open({
				animation: true,
				template: modalContents,
				size: 'lg',
				windowClass: 'app-modal-window',
				resolve: {
					app: function () {
						return modalContents;
					}
				}
			});

			modalInstance.result.then(function (result) {
				//$scope.selected = selectedItem;
				//console.log("Caught "+result.action+" action.");
				if(result.action === 'save'){
					var resultData = result.data;
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
				}
			);
	    };
		$scope.showResponse = function() {
	        console.log('showing response');
			var modalContents = this.act.json_array;
			
			var modalInstance = $uibModal.open({
				animation: true,
				template: modalContents,
				size: 'lg',
				windowClass: 'app-modal-window',
				resolve: {
					app: function () {
						return modalContents;
					}
				}
			});

			modalInstance.result.then(function (result) {
				//$scope.selected = selectedItem;
				//console.log("Caught "+result.action+" action.");
				if(result.action === 'save'){
					var resultData = result.data;
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
				}
			);			
	    };
		function getAccountDetails(){
			Data.post('getAccountDetails', {
				email: 		$scope.act.email,
				orderID: 	0,
				action: 'get'
			})
			.then(function (results) {	
				var message = JSON.parse(results.message);
				$scope.relatedOrders 	= message.relatedOrders;
				$scope.count 			= {};
				$scope.count.act 		= message.count.act;
				$scope.count.CID 		= message.count.CID;
				$scope.expiryDt			= message.member_details.expiry;
				$scope.member_since		= message.member_details.member_since;
				$scope.member_id		= message.member_details.member_id;
				console.log("getAccountDetails: ",message.member_details);
				$scope.isDeactivated();
				
			    $timeout(resize, 0);
				
				//Data.toastMsg("success","Account details retrieved");
			});
		}
		
        $scope.revertNotes = function() {
            $scope.myComments = angular.copy($scope.comments);
            $scope.myForm.$setPristine();
        }
		$scope.saveNotes = function(){
			console.log("Saving notes: "+$scope.myComments);
			
			Data.post('updateComments', {
				member_email: 	$scope.act.payer_email,
				member_comments: $scope.myComments,
				target: 'member',
				action: 'update'
			})
			.then(function (results) {	
				var message = JSON.parse(results.message);
				
				$scope.comments = $scope.myComments;
				$scope.revertNotes();
				Data.toastMsg("success","Notes Updated");
			});
		}
		$scope.openOrder = function(orderID){
			orderFuncs.viewOrder(orderID,$scope.acts);
		}

		// catch moving away from page when changes need to be saved
		$scope.$on('$locationChangeStart', function(event, reason, closed) {
			console.log("location change caught");

			var message = "You are about to leave the edit view, any unsaved changes will be lost. Are you sure?";
			var shouldConfirm = false;
			
			if($scope.myForm.myComments.$dirty){
				shouldConfirm = true;
			}
			
			if (shouldConfirm && !confirm(message)) {
				event.preventDefault();
			}
		});
			  
		$scope.autoExpand = function(e) {
			var element = typeof e === 'object' ? e.target : document.getElementById(e);
	        //element.style.height = 'auto';
			if(element)
		        element.style.height = element.scrollHeight + 2 +'px';
	    };
		
		
		// init stuff here
		$scope.onShow = function(){
		    $timeout(resize, 0);
			
			if(!$scope.act.id){
				// must be creating a new order
				delete $scope.act.id;

				$scope.saveLabel = "Create Order";
				$scope.saveAction = "saveNew";

				$scope.newLabel = "New Manual Order";
			}	
		}
		
		function resize(){
		    $scope.autoExpand('myComments');
		}
	}
]);