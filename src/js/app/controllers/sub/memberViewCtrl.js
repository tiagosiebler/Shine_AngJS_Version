angular.module('memberViewCtrl', ['timeMathFltr','confirm'])
	.controller('memberViewCtrl', ['$scope', '$uibModalInstance', 'member', 'memberID', '$timeout', 'Data','orderFuncs', function ($scope, $uibModalInstance, member, memberID, $timeout, Data, orderFuncs) {

		// clone object, don't want to affect orginal. Use this later to send only changes to server, and not whole cluster. Smaller requests, more efficient.
		$scope.member = member;
		$scope.member.id = memberID;
		
		$scope.saveLabel = "Save Member"
		$scope.saveAction = "save";
		$scope.newLabel = "Member #";
		
		$scope.activatedAction = "Deactivate";
		$scope.blacklistedAction = "Lift Blacklist";
		$scope.deactivatedMsg = '';
		$scope.blacklistedMsg = '';
		$scope.deactivated = false;
		$scope.blacklisted = false;
		
	    $scope.save = function () {
			var result = {
				action: $scope.saveAction,
				data: $scope.member
			};
			$uibModalInstance.close(result);
	    };
		$scope.resendConfirmation = function(){
			orderFuncs.resendConfirmationEmail(null,$scope.member.id);
		}
		$scope.regenerateKey = function(){
			orderFuncs.regenerateKey(null,$scope.member.id)
			.then(function (results) {
				$scope.member.member_act_key 	= results.new_key;
				
				Data.toastMsg(results.status,results.message);
			})
			
		}
		$scope.getUserDetails = function(){
			if($scope.member.id){
				if(!$scope.member.expiry_date){
					//console.log("getting member details");
					Data.post('getMemberDetails', {
						memberID: 	$scope.member.id,
						action: 'get'
					})
					.then(function (results) {	
						var message = JSON.parse(results.message);
					
						var id = $scope.member.id;
						$scope.member = message.columns;
						$scope.member.id = id;
						
						getAccountDetails();
					});
				}
				else
					getAccountDetails();
			}	
		}
		$scope.isDeactivated = function(){
			if($scope.member.deactivated == 1){
				$scope.activatedAction = "Reactivate";
				$scope.deactivatedMsg = '<span class="glyphicon glyphicon-warning-sign"></span> deactivated <span class="glyphicon glyphicon-warning-sign"></span>';
				return true;
			}
			else{
				$scope.activatedAction = "Deactivate";
				return false;
			}
		}
		$scope.setDeactivated = function(value){
			if(value)
				Data.toastMsg("info","Deactivating...");
			else
				Data.toastMsg("info","Reactivating...");
			
			orderFuncs.setDeactivated(null,$scope.member.id,value)
			.then(function (results){
				if(results.status == 'success'){
					$scope.deactivated = value;
					if(value)
						$scope.member.deactivated = 1;
					else
						$scope.member.deactivated = 0;
					
					$scope.isDeactivated();
					Data.toastMsg("success","Saved");
				}
			});
		}
		$scope.isBlacklisted = function(){
			if($scope.member.blacklisted == 1){
				$scope.blacklistedAction = "Lift Blacklist";
				$scope.blacklistedMsg = '<span class="glyphicon glyphicon-alert"></span> BLACKLISTED <span class="glyphicon glyphicon-alert"></span>';
				return true;
			}
			else{
				$scope.blacklistedAction = "Blacklisted";
				return false;
			}
		}
		$scope.toggleActivation = function(){
			if($scope.deactivated)
				var setDeactivated = false;
			else
				var setDeactivated = true;
			
			Data.post('account', {
				email: 			$scope.member.member_email,
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
				email: 		$scope.member.member_email,
				orderID: 	'0',
				action: 'get'
			})
			.then(function (results) {	
				var message = JSON.parse(results.message);

				$scope.relatedOrders 	= message.relatedOrders;
				
				$scope.count 			= {};
				$scope.count.act 		= message.count.act;
				$scope.count.CID 		= message.count.CID;
				$scope.expiryDt			= message.member_details.expiry;
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
				member_email: 	$scope.member.member_email,
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
			var result = {
				action: 'openingOrder',
				data: orderID
			};
			orderFuncs.viewOrder(orderID,$scope.orders);
			$uibModalInstance.close(result);
		}

	    $scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
	    };
		
		// catch modal close actions and add warning with possibility to cancel
		$scope.$on('modal.closing', function(event, reason, closed) {
			var message = "You are about to leave the edit view. Uncaught reason. Are you sure?";
			var shouldConfirm = true;
			
			if(typeof reason === 'object' && reason.action === 'save'){
				message = "Save changes?";
			}
			else if (typeof reason === 'object'){
				shouldConfirm = false;
			}
			else switch (reason){
				// clicked outside
				case "backdrop click":
					message = "Any changes will be lost, are you sure?";
					shouldConfirm = false;
					break;
				
				// cancel button
				case "cancel":
					message = "Any changes will be lost, are you sure?";
					shouldConfirm = false;
					break;
					
				// cancel button
				case "navOut":
					message = "Any changes will be lost, are you sure?";
					shouldConfirm = false;
					break;
				
				// escape key
				case "escape key press":
					message = "Any changes will be lost, are you sure?";
					shouldConfirm = false;
					break;
					
				default:
					message = "Uncaught reason";
					console.log('modal.closing: ' + (closed ? 'close' : 'dismiss') + '(' + reason + ')');
					break;
			}
			if (shouldConfirm && !confirm(message)) {
				event.preventDefault();
			}
		});
			  
		$scope.autoExpand = function(e) {
			var element = typeof e === 'object' ? e.target : document.getElementById(e);
	        //element.style.height = 'auto';
	        element.style.height = element.scrollHeight + 2 +'px';
	    };
		
		
		// init stuff here
		$scope.onShow = function(){
		    $timeout(resize, 0);
			
			if(!$scope.member.id){
				// must be creating a new order
				delete $scope.member.id;

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