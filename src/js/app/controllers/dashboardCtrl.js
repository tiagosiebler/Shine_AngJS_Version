angular.module('dashboardCtrl', ['timeMathFltr','appsTable','orderViewCtrl','memberFuncs','orderFuncs'])
	.controller('dashboardCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, Graphs, $uibModal, memberFuncs, orderFuncs) {
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
		
		$scope.appList = function(){
			return $rootScope.appList;
		}
		$scope.getAppName = function(orderID){
			if($scope.appList())
				return $scope.appList()[orderID].title;
			
			else 
				return "";
		};
		
		$scope.graphs = {};
		
		$scope.getGraphs = function(graphs){
			Graphs.get(graphs).then(function(results){
				$scope.graphs = results;
			});
		};
		// Method in Graph factory to pop up graph
		$scope.viewGraph=Graphs.viewGraph;
		//$scope.openOrder=OrdersFuncs.openOrder;
		
		$scope.openOrder = function(orderID){
			orderFuncs.viewOrder(orderID,$scope.orders);
		};
});