angular.module('logsCtrl', ['ui.bootstrap','logsSystemTable','logsFailureTable','logsDeactTable','logsCIDTable','threeButtonBar'])
	.controller('logsCtrl', function ($scope, Graphs) {
		$scope.graphs = {};
		
		$scope.getGraphs = function(graphs){
			Graphs.get(graphs).then(function(results){
				$scope.graphs = results;
			});
		};
		
		$scope.viewGraph=Graphs.viewGraph;
});