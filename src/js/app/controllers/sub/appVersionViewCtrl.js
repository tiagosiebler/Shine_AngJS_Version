angular.module('appVersionViewCtrl', ['timeMathFltr','confirm'])
	.controller('appVersionViewCtrl', ['$scope', '$uibModalInstance', 'appVersion', 'hash_id', '$timeout', 'app_list', '$rootScope', function ($scope, $uibModalInstance, appVersion, hash_id, $timeout, app_list, $rootScope) {
		$scope.appVersion_original = appVersion;
		$scope.appVersion = Object.create(appVersion);
		$scope.appVersion.id = hash_id;
		$scope.app_list = app_list;
		$scope.newappVersion = "Viewing App Version: "
		$scope.saveLabel = "Save"
		$scope.saveAction = "update";
		$scope.versionType = "app";
		
		$scope.toggleActLabel = "Deactivate";
		
		// init section
		if(!$scope.appVersion.id){
			// must be creating a new appVersion
			delete $scope.appVersion.id;

			$scope.saveLabel = "Publish";
			$scope.saveAction = "create";

			$scope.newappVersion = "New App Version";
			$scope.appVersion.added_by = $rootScope.uid;
		}
		$scope.appVersion_original = angular.copy($scope.appVersion);
		
		if($scope.appVersion.active == "0")
			$scope.toggleActLabel = "Activate";
				
		// functions
	    $scope.save = function () {
			var result = {
				action: $scope.saveAction,
				data: $scope.appVersion,
				versionType: $scope.versionType
			};
			$uibModalInstance.close(result);
	    };
		$scope.toggleAct = function() {
			if($scope.appVersion.active == "1"){
				$scope.appVersion.active = "0";
				$scope.toggleActLabel = "Activate";
			
			}
				else
			{
				$scope.appVersion.active = "1";
				$scope.toggleActLabel = "Deactivate";
			}
			$scope.save();
		}
		$scope.delete = function(){
			var result = {
				action: 'delete',
				data: $scope.appVersion,
				versionType: $scope.versionType
			};
			$uibModalInstance.close(result);
		}
		
		$scope.booleanActive = [
			{ id: '1', title: 'Yes'},
			{ id: '0', title: 'No'}
		];

	    $scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
	    };
		
		// catch modal close events and add confirmation with option to cancel event
		$scope.$on('modal.closing', function(event, reason, closed) {
			if(typeof reason === 'object' && reason.action === 'update'){
				message = "Save changes?";
			}
			else if(typeof reason === 'object' && reason.action === 'create'){
				message = "Publish new version?";
			}
			else if(typeof reason === 'object' && reason.action === 'delete'){
				message = "WARNING: This action cannot be undone! Are you sure you want to delete this entry?";
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
        $scope.revertForm = function() {
			$scope.appVersion = angular.copy($scope.appVersion_original);
            $scope.myForm.$setPristine();
        }
		
		$scope.onShow = function(){			
		    $timeout(resize, 0);
		}
		
		function resize(){
		    $scope.autoExpand('comments');
		}
	}
]);