angular.module('dashboardCtrl', ['timeMathFltr','appsTable','orderViewCtrl','memberFuncs','orderFuncs'])
	.controller('dashboardCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, $uibModal, memberFuncs, orderFuncs) {
		var controller = this;
		
		// Set a few vars to avoid undefined errors, just in case.
		$scope.orders = {};
		$scope.total = {};

		$scope.getRecentOrders = function(orderID){
			Data.post('getRecentOrders', {
				orderID: orderID,
			}).then(function (results) {
				$scope.orders = JSON.parse(results.message);
				$scope.totalOrders = results.total;
			});
		};
		// this is used by orders simply displayed onclick, and by the recent-orders section of the dashboard
		$scope.getRecentOrders();
		
		$scope.appList = function(){
			return $rootScope.appList;
		}
		$scope.getAppName = function(appID){
			if($scope.appList())
				return $scope.appList()[appID].title;
			
			else 
				return "";
		};
		
		$scope.openOrder = function(orderID){
			orderFuncs.viewOrder(orderID,$scope.orders);
		};
});