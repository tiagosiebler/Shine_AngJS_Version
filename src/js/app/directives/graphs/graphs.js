(function() {
    angular.module('graphsDirective', ['chart.js'])
	.config(['ChartJsProvider', function (ChartJsProvider) {
		// Configure all charts
		/*
		ChartJsProvider.setOptions({
			chartColors: ['#FF5252', '#FF8A80'],
			responsive: false
		});
		
		// Configure all line charts
		ChartJsProvider.setOptions('line', {
			showLines: false
		});//*/
	}])
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
					/*
					for(var key in results) { 
					    var attr = results[key]; 
						//console.log('Chart (' + key + ') performance ' + attr.debug.time_taken);
					}	//*/			
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

					    $scope.chart.options = { 
							legend: { display: true },
								scales: {
									yAxes: [{
										ticks: {
											suggestedMin: 0
										}
									}]
								}
						};
						
					}
					// setting to small again
					else if(i.contains('glyphicon-resize-small')){
			            i.remove('glyphicon-resize-small');
						i.add('glyphicon-resize-full');
				
						thumb.classList.remove('panel-fullscreen');

					    $scope.chart.options = { 
							legend: { display: false },
								scales: {
									yAxes: [{
										ticks: {
											suggestedMin: 0
										}
									}]
								}
						};				
				
					}
				    $scope.$emit('fullscreen_toggle', []);
				};
				
				$scope.colours = {
					bar: [
					    { // light blue
				            backgroundColor: "rgba(102, 175, 249, 0.2)",
				            borderColor: "rgba(102, 175, 249, 1)",
				            hoverBackgroundColor: "rgba(102, 175, 249, 1)",
				            hoverBorderColor: "rgba(102, 175, 249, 1)"
					    },
					    { // yellow
					        backgroundColor: "rgba(253,180,92,0.2)",
					        borderColor: "rgba(253,180,92,1)",
					        hoverBackgroundColor: "rgba(253,180,92,1)",
					        hoverBorderColor: "rgba(253,180,92,0.8)"
					    },
					    { // purple
					        backgroundColor: "rgba(175, 101, 255,0.2)",
					        borderColor: "rgba(175, 101, 255,1)",
					        hoverBackgroundColor: "rgba(175, 101, 255,1)",
					        hoverBorderColor: "rgba(175, 101, 255,0.8)"
					    },
					    { // red
					        backgroundColor: "rgba(255, 40, 44, 0.2)",
					        borderColor: "rgba(255, 40, 44, 1)",
					        hoverBackgroundColor: "rgba(255, 40, 44, 1)",
					        hoverBorderColor: "rgba(255, 40, 44, 0.8)"
					    },
					    { // light green
					        backgroundColor: "rgba(96, 255, 173, 0.2)",
					        borderColor: "rgba(96, 255, 173, 1)",
					        hoverBackgroundColor: "rgba(96, 255, 173, 1)",
					        hoverBorderColor: "rgba(96, 255, 173,0.8)"
					    },
					    { // light grey
					        backgroundColor: "rgba(220,220,220,0.2)",
					        borderColor: "rgba(220,220,220,1)",
					        hoverBackgroundColor: "rgba(220,220,220,1)",
					        hoverBorderColor: "rgba(220,220,220,0.8)",
					    },
					    { // dark grey
					        backgroundColor: "rgba(77,83,96,0.2)",
					        borderColor: "rgba(77,83,96,1)",
					        hoverBackgroundColor: "rgba(77,83,96,1)",
					        hoverBorderColor: "rgba(77,83,96,1)",
					    }
					],
					line: [
					    { // light blue
				            backgroundColor: "rgba(102, 175, 249, 0.2)",
				            borderColor: "rgba(102, 175, 249, 1)",
				            pointBackgroundColor: "rgba(102, 175, 249, 1)",
				            pointBorderColor: "#fff",
				            pointHoverBackgroundColor: "#fff",
				            pointHoverBorderColor: "rgba(151,187,205,1)"
					    },
					    { // yellow
					        backgroundColor: "rgba(253,180,92,0.2)",
					        borderColor: "rgba(253,180,92,1)",
					        pointBackgroundColor: "rgba(253,180,92,1)",
					        pointBorderColor: "#fff",
					        pointHoverBackgroundColor: "#fff",
					        pointHoverBorderColor: "rgba(253,180,92,0.8)"
					    },
					    { // purple
					        backgroundColor: "rgba(175, 101, 255,0.2)",
					        borderColor: "rgba(175, 101, 255,1)",
					        pointBackgroundColor: "rgba(175, 101, 255,1)",
					        pointBorderColor: "#fff",
					        pointHoverBackgroundColor: "#fff",
					        pointHoverBorderColor: "rgba(175, 101, 255,1)"
					    },
					    { // red
					        backgroundColor: "rgba(255, 40, 44, 0.2)",
					        borderColor: "rgba(255, 40, 44, 1)",
					        pointBackgroundColor: "rgba(255, 40, 44, 1)",
					        pointBorderColor: "#fff",
					        pointHoverBackgroundColor: "#fff",
					        pointHoverBorderColor: "rgba(255, 40, 44, 0.8)"
					    },
					    { // light green
					        backgroundColor: "rgba(96, 255, 173, 0.2)",
					        borderColor: "rgba(96, 255, 173, 1)",
					        pointBackgroundColor: "rgba(96, 255, 173, 1)",
					        pointBorderColor: "#fff",
					        pointHoverBackgroundColor: "#fff",
					        pointHoverBorderColor: "rgba(96, 255, 173,0.8)"
					    },
					    { // light grey
					        backgroundColor: "rgba(220,220,220,0.2)",
					        borderColor: "rgba(220,220,220,1)",
					        pointBackgroundColor: "rgba(220,220,220,1)",
					        pointBorderColor: "#fff",
					        pointHoverBackgroundColor: "#fff",
					        pointHoverBorderColor: "rgba(220,220,220,0.8)"
					    },
					    { // dark grey
					        backgroundColor: "rgba(77,83,96,0.2)",
					        borderColor: "rgba(77,83,96,1)",
					        pointBackgroundColor: "rgba(77,83,96,1)",
					        pointBorderColor: "#fff",
					        pointHoverBackgroundColor: "#fff",
					        pointHoverBorderColor: "rgba(77,83,96,1)"
					    }
					],
					pie:["#4D5360","#FDB45C","#AF65FF","#FF282C","#60FFAD","#DCDCDC"],
					doughnut:["#4D5360","#FDB45C","#AF65FF","#FF282C","#60FFAD","#DCDCDC"],
					pie4:["#9FCC00","#FA6D21","#9a9a9a","#E9B145","#62A073","#FA605D"],
					pie3:["rgba(77,83,96,0.2)","rgba(253,180,92,0.2)","rgba(175, 101, 255,0.2)","rgba(255, 40, 44, 0.2)",
						"rgba(96, 255, 173, 0.2)","rgba(220,220,220,0.2)"],
					pie2:[
						{
						    backgroundColor:[
						    	"rgba(77,83,96,0.2)",
								"rgba(253,180,92,0.2)",
								"rgba(175, 101, 255,0.2)",
								"rgba(255, 40, 44, 0.2)",
								"rgba(96, 255, 173, 0.2)",
								"rgba(220,220,220,0.2)"
						    ],
							borderColor:[
						    	"rgba(77,83,96,0.5)",
								"rgba(253,180,92,0.5)",
								"rgba(175, 101, 255,0.5)",
								"rgba(255, 40, 44, 0.5)",
								"rgba(96, 255, 173, 0.5)",
								"rgba(220,220,220,0.5)"
						    ],
							hoverBackgroundColor:[
						    	"rgba(77,83,96,0.5)",
								"rgba(253,180,92,0.5)",
								"rgba(175, 101, 255,0.5)",
								"rgba(255, 40, 44, 0.5)",
								"rgba(96, 255, 173, 0.5)",
								"rgba(220,220,220,0.5)"
						    ],
						}
					],
					test:[
						"rgba(77,83,96,1)",
						"rgba(253,180,92,1)",
						"rgba(175, 101, 255,1)",
						"rgba(255, 40, 44, 1)",
						"rgba(96, 255, 173, 1)",
						"rgba(77,83,96,1)",
						"rgba(220,220,220,1)"
					],
					originalpie: [
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
					    }
					],
					doughnut2: [
					    { // light blue
					        backgroundColor: "rgba(77,83,96,0.2)",
				            borderColor: "rgba(102, 175, 249, 1)",
				            hoverBackgroundColor: "rgba(151,187,205,0.5)"
					    },
					    { // yellow
					        backgroundColor: "rgba(253,180,92,0.2)",
					        borderColor: "rgba(253,180,92,1)",
					        hoverBackgroundColor: "rgba(253,180,92,0.5)"
					    },
					    { // purple
					        backgroundColor: "rgba(175, 101, 255,0.2)",
					        borderColor: "rgba(175, 101, 255,1)",
					        hoverBackgroundColor: "rgba(175, 101, 255,0.5)"
					    },
					    { // red
					        backgroundColor: "rgba(255, 40, 44, 0.2)",
					        borderColor: "rgba(255, 40, 44, 1)",
					        hoverBackgroundColor: "rgba(255, 40, 44, 0.5)"
					    },
					    { // light green
					        backgroundColor: "rgba(96, 255, 173, 0.2)",
					        borderColor: "rgba(96, 255, 173, 1)",
					        hoverBackgroundColor: "rgba(96, 255, 173,0.5)"
					    },
					    { // dark grey
					        backgroundColor: "rgba(77,83,96,0.2)",
					        borderColor: "rgba(77,83,96,1)",
					        hoverBackgroundColor: "rgba(77,83,96,0.5)"
					    },
					    { // light grey
					        backgroundColor: "rgba(220,220,220,0.2)",
					        borderColor: "rgba(220,220,220,1)",
					        hoverBackgroundColor: "rgba(220,220,220,0.5)"
					    },
					]
				}
				
				$scope.chart = {};
				$scope.chart.options = {};
			    $scope.chart.options = { 
					legend: { 
						display: false 
					},
					scales: {
						yAxes: [{
							ticks: {
								suggestedMin: 0
							}
						}]
					}
				};
				
				$scope.colours1 = ['#fff', '#3498DB', '#717984', '#F1C40F'];
				

				$scope.$on('create', function (event, chart) {
					console.log("create graphs.js");
			        $scope.chart = chart;
					
					$scope.chart.options.pointDotRadius = 0;
					console.log($scope.colours[$scope.graph.type]);
					//window.dispatchEvent(new Event('resize'));
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