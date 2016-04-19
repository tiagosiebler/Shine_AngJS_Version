(function() {
    angular.module('graphsDirective', ['chart.js'])

    .directive('renderGraphs', function() {
        return {
            restrict: 'E',
	        scope: {
				graphKeys: '=?',
				type: '=?',//can later be used to determine between chartJS and D3
				wrap: '=?',
			},
           // templateUrl: 'partials/subelements/graphs.html',
			template: '<div ng-include="contentUrl"></div>',
	        link: function(scope, element, attrs) {
				// sorting within bootstrap row/cols, only for certain pages
				if(scope.wrap)
		            scope.contentUrl = 'partials/subelements/graphs_wrapped.html';
					
				else
	            	scope.contentUrl = 'partials/subelements/graphs.html';
			},
			controller: ['$scope', '$location', 'Graphs', function($scope, $location, Graphs) {	
				console.log("Getting graphs("+$scope.graphKeys+")");
				
				Graphs.get($scope.graphKeys).then(function(results){
					$scope.graphs = results;
					console.log($scope.graphs);

					for(var key in results) { 
					    var attr = results[key]; 
						console.log('Chart (' + key + ') performance ' + attr.debug.time_taken);
					}				
				});
				
				$scope.shouldWrap = function(){
					if(!$scope.wrap)
						return false;
					
					return $scope.wrap;
				}
				

				$scope.fullscreen = function (e) {
			        e.preventDefault();

			        var $this = e.currentTarget;

					var i = $this.getElementsByTagName('i')[0].classList;
			
					//if panel, this should be .panel. Add if logic here so this is automated.
					var thumb = $this.closest('.thumbnail');
			
					// setting to fullscreen
					if (i.contains('glyphicon-resize-full')){
						i.remove('glyphicon-resize-full');
			            i.add('glyphicon-resize-small');
				
						thumb.classList.add('panel-fullscreen');

						$scope.chart.legend = true;
						//debugger;
				
						//debugger;
					}
					// setting to small again
					else if(i.contains('glyphicon-resize-small')){
			            i.remove('glyphicon-resize-small');
						i.add('glyphicon-resize-full');
				
						thumb.classList.remove('panel-fullscreen');

						$scope.chart.legend = false;
				
				
					}
				    $scope.$emit('fullscreen_toggle', []);
				};
				$scope.chart = {};
				$scope.chart.options = {};

				$scope.$on('create', function (event, chart) {
			        $scope.chart = chart;
					$scope.chart.options.pointDotRadius = 0;
					$scope.chart.legend = false;
					$scope.chart.options.scaleBeginAtZero = false;
					//console.log($scope.chart);
					//$scope.chart.options.showTooltips = false;
			    });
				
				$scope.$on('fullscreen_toggle', function (e, d) {
					window.dispatchEvent(new Event('resize'));
			    });
				
				$scope.onClick = function (points, evt) {
				    console.log(points, evt);
				};				
			}],
			controllerAs: 'graphsCtrl'
        };
    });		
	

})();