angular.module('versionsCtrl', ['timeMathFltr','ui.bootstrap','versionsAppTable','versionsGameTable','versionsUnknownTable'])
	.controller('versionsCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, Graphs) {
		$scope.graphs = {};
		
		$scope.getGraphs = function(graphs){
			Graphs.get(graphs).then(function(results){
				$scope.graphs = results;
			});
		};
		
		// Method in Graph factory to pop up graph
		$scope.viewGraph=Graphs.viewGraph;
});