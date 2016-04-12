angular.module('reportingCtrl', ['timeMathFltr','ui.bootstrap','bootstrap.tabset'])
	.controller('reportingCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, Graphs) {
		$scope.graphs = [];
		
		if (!String.prototype.splice) {
		    /**
		     * {JSDoc}
		     *
		     * The splice() method changes the content of a string by removing a range of
		     * characters and/or adding new characters.
		     *
		     * @this {String}
		     * @param {number} start Index at which to start changing the string.
		     * @param {number} delCount An integer indicating the number of old chars to remove.
		     * @param {string} newSubStr The String that is spliced in.
		     * @return {string} A new string with the spliced substring.
		     */
		    String.prototype.splice = function(start, delCount, newSubStr) {
		        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
		    };
		}
		
		//var graphs = new Object();
		var graphs = {
			orders: [
				{
					name: 'opw',
					desc: 'Orders per Week (all time)'
				},
				{
					name: 'opm',
					desc: 'Orders per Month (all time)'
				},
				{
					name: 'opma',
					desc: 'Orders per Month (by app, all time)'
				},
				{
					name: 'opma_limited',
					desc: 'Orders per Month (1-month vs subscription, all time)'
				}
			],
			activations: [
				{
					name: 'apw',
					desc: 'Activations per Week (all time)'
				},
				{
					name: 'fapw',
					desc: 'Failed Activations per Week (all time)'
				},
				{
					name: 'apm',
					desc: 'Activations per Month (all time)'
				}
			],
			versions: [
				{
					name: 'opma',
					desc: 'Orders per Month (by app)'
				},
				{
					name: 'vers_dist_pie',
					desc: 'Version Distribution (all time)'
				},
				{
					name: 'vers_dist_bar',
					desc: 'Version Distribution (all time)'
				}
			]
		};
		
		$scope.prepareGraphs = function(selectedTab){
			//debugger;
			
			if($scope.selectedTab)
				selectedTab = $scope.selectedTab;
			
			$scope.graphs = [];
			angular.forEach(graphs[selectedTab], function (graph) {
				$scope.getGraphs(graph);
			});
		}
		// right now, this loads all graphs when the view is changed to active. Even if they have been loaded from the server before.
		$scope.getGraphs = function(graph){	
					
			Graphs.getSingle(graph).then(function(results){				
				// https://developers.google.com/chart/infographics/docs/overview#optimizations
				var key = Object.keys(results)[0]
				var graph = results[key];
				
				if($scope.graphs.length < 10)
					var req = $scope.graphs.length;
				else
					var req = ($scope.graphs.length - ($scope.graphs.length - 10));

				graph.sm = graph.sm.splice(7, 0, req + '.');
				graph.lg = graph.lg.splice(7, 0, req + '.');
				//$scope.graphs[key] = graph;
				$scope.graphs.push(graph);
			});
		};
		
		// Method in Graph factory to pop up graph
		$scope.viewGraph=Graphs.viewGraph;
});