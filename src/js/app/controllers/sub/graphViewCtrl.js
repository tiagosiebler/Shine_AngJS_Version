angular.module('graphViewCtrl', [])
	.controller('graphViewCtrl', ['$scope', '$uibModalInstance', 'graphURL', 'graphLabel', function ($scope, $uibModalInstance, graphURL, graphLabel) {
		
		$scope.graphURL = graphURL;
		$scope.graphLabel = graphLabel;

	    $scope.close = function () {
			$uibModalInstance.dismiss('close');
	    };
	}
]);