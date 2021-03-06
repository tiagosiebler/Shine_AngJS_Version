angular.module('orderViewCtrl', ['timeMathFltr','confirm','orderFuncs','memberFuncs'])
	.controller('orderViewCtrl', ['$scope', '$timeout', 'Data', 'orderFuncs', '$routeParams','memberFuncs', function ($scope, $timeout, Data, orderFuncs, $routeParams, memberFuncs) {

		$scope.order = {};
		
		$scope.order.id = "";
		$scope.order.payer_email = "";
		
		$scope.order.id = $routeParams.ref;
		if(!$scope.order.id)//will later use blank ID to go to new order page
			window.history.back();
		
		$scope.saveLabel = "Save Order"
		$scope.saveAction = "save";
		$scope.newLabel = "Viewing Order #";
		
		$scope.activatedAction = "Deactivate";
		$scope.deactivatedMsg = '';
		$scope.deactivated = false;
		
	    $scope.save = function () {
			var result = {
				action: $scope.saveAction,
				data: $scope.order
			};
			$uibModalInstance.close(result);
	    };
		$scope.resendConfirmation = function(){
			orderFuncs.resendConfirmationEmail($scope.order.id,null);
		}
		$scope.regenerateKey = function(){
			orderFuncs.regenerateKey($scope.order.id,null)
			.then(function (results) {
				// update vars on page
				$scope.order.license 			= results.new_key;
				
				Data.toastMsg(results.status,results.message);
			});
		}
		$scope.setDeactivated = function(value){
			if(value)
				Data.toastMsg("info","Deactivating...");
			else
				Data.toastMsg("info","Reactivating...");
			
			orderFuncs.setDeactivated($scope.order.id,null,value)
			.then(function (results){
				if(results.status == 'success'){
					$scope.deactivated = value;
					if(value)
						$scope.order.deactivated = 1;
					else
						$scope.order.deactivated = 0;
					
					$scope.isDeactivated();
					Data.toastMsg("success","Saved");
				}
			});
		}
		$scope.getUserDetails = function(){			
			if($scope.order.id){
				if(!$scope.order.business){
					//console.log("getting order details");
					Data.post('getOrderDetails', {
						orderID: 	$scope.order.id,
						action: 'get'
					})
					.then(function (results) {	
						var message = JSON.parse(results.message);
					
						var id = $scope.order.id;
						$scope.order = message.columns;
						$scope.order.id = id;
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
				email: 			$scope.order.payer_email,
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
		}
		function getAccountDetails(){
			Data.post('getAccountDetails', {
				email: 		$scope.order.payer_email,
				orderID: 	$scope.order.id,
				action: 'get'
			})
			.then(function (results) {	
				var message = JSON.parse(results.message);
				$scope.relatedOrders 	= message.relatedOrders;
				$scope.count 			= {};
				$scope.count.act 		= message.count.act;
				$scope.count.CID 		= message.count.CID;
				$scope.expiryDt			= message.member_details.expiry;
				$scope.member_id		= message.member_details.member_id;

				if(message.member_details.deactivated)
					$scope.deactivated = true;
				else
					$scope.deactivated = false;
				
				if(message.member_details.blacklisted)
					$scope.blacklisted = true;
				else
					$scope.blacklisted = false;
				
				$scope.comments			=	message.member_details.comments;
	            $scope.myComments 		= angular.copy($scope.comments);
	            $scope.myForm.$setPristine();
				
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
				member_email: 	$scope.order.payer_email,
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
			orderFuncs.viewOrder(orderID,$scope.orders);
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
			
			if(!$scope.order.id){
				// must be creating a new order
				delete $scope.order.id;

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