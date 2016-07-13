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
					//console.log($scope.graphs);

					for(var key in results) { 
					    var attr = results[key]; 
						//console.log('Chart (' + key + ') performance ' + attr.debug.time_taken);
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
				
				$scope.colours = {
					Bar: [
					    { // light blue
				            fillColor: "rgba(102, 175, 249, 0.2)",
				            strokeColor: "rgba(102, 175, 249, 1)",
				            highlightFill: "rgba(102, 175, 249, 1)",
				            highlightStroke: "rgba(102, 175, 249, 1)"
					    },
					    { // yellow
					        fillColor: "rgba(253,180,92,0.2)",
					        strokeColor: "rgba(253,180,92,1)",
					        highlightFill: "rgba(253,180,92,1)",
					        highlightStroke: "rgba(253,180,92,0.8)"
					    },
					    { // purple
					        fillColor: "rgba(175, 101, 255,0.2)",
					        strokeColor: "rgba(175, 101, 255,1)",
					        highlightFill: "rgba(175, 101, 255,1)",
					        highlightStroke: "rgba(175, 101, 255,0.8)"
					    },
					    { // red
					        fillColor: "rgba(255, 40, 44, 0.2)",
					        strokeColor: "rgba(255, 40, 44, 1)",
					        highlightFill: "rgba(255, 40, 44, 1)",
					        highlightStroke: "rgba(255, 40, 44, 0.8)"
					    },
					    { // light green
					        fillColor: "rgba(96, 255, 173, 0.2)",
					        strokeColor: "rgba(96, 255, 173, 1)",
					        highlightFill: "rgba(96, 255, 173, 1)",
					        highlightStroke: "rgba(96, 255, 173,0.8)"
					    },
					    { // light grey
					        fillColor: "rgba(220,220,220,0.2)",
					        strokeColor: "rgba(220,220,220,1)",
					        pointColor: "rgba(220,220,220,1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        highlightFill: "rgba(220,220,220,1)",
					        highlightStroke: "rgba(220,220,220,0.8)",
					        pointHighlightStroke: "rgba(220,220,220,0.8)",
					    },
					    { // dark grey
					        fillColor: "rgba(77,83,96,0.2)",
					        strokeColor: "rgba(77,83,96,1)",
					        pointColor: "rgba(77,83,96,1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        highlightFill: "rgba(77,83,96,1)",
					        highlightStroke: "rgba(77,83,96,1)",
					        pointHighlightStroke: "rgba(77,83,96,0.8)",
					    }
					],
					Line: [
					    { // light blue
				            fillColor: "rgba(102, 175, 249, 0.2)",
				            strokeColor: "rgba(102, 175, 249, 1)",
				            pointColor: "rgba(102, 175, 249, 1)",
				            pointStrokeColor: "#fff",
				            pointHighlightFill: "#fff",
				            pointHighlightStroke: "rgba(151,187,205,1)"
					    },
					    { // yellow
					        fillColor: "rgba(253,180,92,0.2)",
					        strokeColor: "rgba(253,180,92,1)",
					        pointColor: "rgba(253,180,92,1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(253,180,92,0.8)"
					    },
					    { // purple
					        fillColor: "rgba(175, 101, 255,0.2)",
					        strokeColor: "rgba(175, 101, 255,1)",
					        pointColor: "rgba(175, 101, 255,1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(175, 101, 255,1)"
					    },
					    { // red
					        fillColor: "rgba(255, 40, 44, 0.2)",
					        strokeColor: "rgba(255, 40, 44, 1)",
					        pointColor: "rgba(255, 40, 44, 1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(255, 40, 44, 0.8)"
					    },
					    { // light green
					        fillColor: "rgba(96, 255, 173, 0.2)",
					        strokeColor: "rgba(96, 255, 173, 1)",
					        pointColor: "rgba(96, 255, 173, 1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(96, 255, 173,0.8)"
					    },
					    { // light grey
					        fillColor: "rgba(220,220,220,0.2)",
					        strokeColor: "rgba(220,220,220,1)",
					        pointColor: "rgba(220,220,220,1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(220,220,220,0.8)"
					    },
					    { // dark grey
					        fillColor: "rgba(77,83,96,0.2)",
					        strokeColor: "rgba(77,83,96,1)",
					        pointColor: "rgba(77,83,96,1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(77,83,96,1)"
					    }
					],
					Pie: [
					    { // light blue
				            highlightFill: "rgba(102, 175, 249, 0.2)",
				            strokeColor: "rgba(102, 175, 249, 1)",
				            pointColor: "rgba(102, 175, 249, 1)",
				            pointStrokeColor: "#fff",
				            pointHighlightFill: "#fff",
				            pointHighlightStroke: "rgba(151,187,205,0.5)"
					    },
					    { // yellow
					        highlightFill: "rgba(253,180,92,0.2)",
					        strokeColor: "rgba(253,180,92,1)",
					        pointColor: "rgba(253,180,92,1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(253,180,92,0.5)"
					    },
					    { // purple
					        highlightFill: "rgba(175, 101, 255,0.2)",
					        strokeColor: "rgba(175, 101, 255,1)",
					        pointColor: "rgba(175, 101, 255,1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(175, 101, 255,0.5)"
					    },
					    { // red
					        highlightFill: "rgba(255, 40, 44, 0.2)",
					        strokeColor: "rgba(255, 40, 44, 1)",
					        pointColor: "rgba(255, 40, 44, 1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(255, 40, 44, 0.5)"
					    },
					    { // light green
					        highlightFill: "rgba(96, 255, 173, 0.2)",
					        strokeColor: "rgba(96, 255, 173, 1)",
					        pointColor: "rgba(96, 255, 173, 1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(96, 255, 173,0.5)"
					    },
					    { // dark grey
					        highlightFill: "rgba(77,83,96,0.2)",
					        strokeColor: "rgba(77,83,96,1)",
					        pointColor: "rgba(77,83,96,1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(77,83,96,0.5)"
					    },
					    { // light grey
					        highlightFill: "rgba(220,220,220,0.2)",
					        strokeColor: "rgba(220,220,220,1)",
					        pointColor: "rgba(220,220,220,1)",
					        pointStrokeColor: "#fff",
					        pointHighlightFill: "#fff",
					        pointHighlightStroke: "rgba(220,220,220,0.5)"
					    },
					]
				}
				
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