angular.module('gameVersionViewCtrl', ['timeMathFltr','confirm'])
	.controller('gameVersionViewCtrl', ['$scope', '$uibModalInstance', 'gameVersion', 'game_id', '$timeout', 'app_list', '$rootScope', function ($scope, $uibModalInstance, gameVersion, game_id, $timeout, app_list, $rootScope) {
		$scope.gameVersion_original = gameVersion;
		$scope.gameVersion = Object.create(gameVersion);
		$scope.gameVersion.id = game_id;
		$scope.app_list = app_list;
		$scope.newgameVersion = "Viewing Game Version: "
		$scope.saveLabel = "Save"
		$scope.saveAction = "update";
		$scope.versionType = "game";
				
		// init section
		if(!$scope.gameVersion.id){
			// must be creating a new gameVersion
			delete $scope.gameVersion.id;

			$scope.saveLabel = "Publish";
			$scope.saveAction = "create";

			$scope.newgameVersion = "New Game Version";
			$scope.gameVersion.added_by = $rootScope.uid;
			$scope.gameVersion.is_supported = '1';
			$scope.gameVersion.should_update = '0';
			$scope.gameVersion.should_redirect = '0';
		}
		$scope.gameVersion_original = angular.copy($scope.gameVersion);
		
		if($scope.gameVersion.active == "0")
			$scope.toggleActLabel = "Activate";
				
		// functions
	    $scope.save = function () {
			var result = {
				action: $scope.saveAction,
				data: $scope.gameVersion,
				versionType: $scope.versionType
			};
			$uibModalInstance.close(result);
	    };
		$scope.delete = function(){
			var result = {
				action: 'delete',
				data: $scope.gameVersion,
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
			$scope.gameVersion = angular.copy($scope.gameVersion_original);
            $scope.myForm.$setPristine();
        }
		
		$scope.onShow = function(){			
		    $timeout(resize, 0);
		}
		
		function resize(){
		    $scope.autoExpand('game_vers_comments');
		}
	}
]);