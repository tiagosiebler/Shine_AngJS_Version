angular.module('unknownVersionViewCtrl', ['timeMathFltr','confirm'])
	.controller('unknownVersionViewCtrl', ['$scope', '$uibModalInstance', 'unknownVersion', 'id', '$timeout', function ($scope, $uibModalInstance, unknownVersion, id, $timeout) {
		$scope.unknownVersion_original = unknownVersion;
		$scope.unknownVersion = Object.create(unknownVersion);
		$scope.unknownVersion.id = id;
		$scope.newunknownVersion = "Viewing Unknown Version: "
		$scope.saveLabel = "Save"
		$scope.saveAction = "update";
		$scope.versionType = "unknown";
				
		$scope.unknownVersion_original = angular.copy($scope.unknownVersion);
		
		if($scope.unknownVersion.active == "0")
			$scope.toggleActLabel = "Activate";
				
		// functions
	    $scope.save = function () {
			var result = {
				action: $scope.saveAction,
				data: $scope.unknownVersion,
				versionType: $scope.versionType
			};
			$uibModalInstance.close(result);
	    };
		
		$scope.register = function () {
			alert('not yet done')
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
			$scope.unknownVersion = angular.copy($scope.unknownVersion_original);
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