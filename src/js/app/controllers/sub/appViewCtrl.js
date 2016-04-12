angular.module('appViewCtrl', ['timeMathFltr','confirm'])
	.controller('appViewCtrl', ['$scope', '$uibModalInstance', 'app', 'appID', 'available_engines', '$timeout', function ($scope, $uibModalInstance, app, appID, available_engines, $timeout) {
		
		// clone object, don't want to affect orginal. Use this later to send only changes to server, and not whole cluster. Smaller requests, more efficient.
		$scope.app = Object.create(app);
		$scope.app.id = appID;
		$scope.available_engines = available_engines;
		
		$scope.saveLabel = "Save Application"
		$scope.saveAction = "save";
	    $scope.save = function () {
			var result = {
				action: $scope.saveAction,
				data: $scope.app
			};
			$uibModalInstance.close(result);
	    };
		

	    $scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
	    };
		
		// catch modal close actions and add warning with possibility to cancel
		$scope.$on('modal.closing', function(event, reason, closed) {
			var message = "You are about to leave the edit view. Uncaught reason. Are you sure?";

			if(typeof reason === 'object' && reason.action === 'save'){
				message = "Save changes?";
			}
			else switch (reason){
				// clicked outside
				case "backdrop click":
					message = "Any changes will be lost, are you sure?";
					break;
				
				// cancel button
				case "cancel":
					message = "Any changes will be lost, are you sure?";
					break;
				
				// escape key
				case "escape key press":
					message = "Any changes will be lost, are you sure?";
					break;
					
				default:
					console.log('modal.closing: ' + (closed ? 'close' : 'dismiss') + '(' + reason + ')');
					break;
			}
			if (!confirm(message)) {
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
			
			if(!$scope.app.id){
				// must be creating a new app
				delete $scope.app.id;

				$scope.saveLabel = "Create Application";
				$scope.saveAction = "saveNew";

				$scope.newApp = "New Application";
			}
		}
		
		function resize(){
		    $scope.autoExpand('email_body');
		}
	}
]);