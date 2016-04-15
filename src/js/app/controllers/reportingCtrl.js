angular.module('reportingCtrl', ['timeMathFltr','ui.bootstrap','bootstrap.tabset','chart.js'])
	.controller('reportingCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, Graphs, $timeout) {
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
					name: 'opw_6month',
					desc: 'Weekly (<6 Month)'
				},
				{
					name: 'opw_1year',
					desc: 'Weekly (<Year)'
				},
				{
					name: 'opm',
					desc: 'Monthly (Past 2 Years)'
				},
				{
					name: 'opma',
					desc: 'Monthly (by app, Past 2 Years)'
				},
				{
					name: 'opma_limited_1',
					desc: 'Monthly (1-month vs Subs, 1 year)'
				},
				{
					name: 'opma_limited_2',
					desc: 'Monthly (1-month vs Subs, 2 years)'
				},
				{
					name: 'opma_limited_comparison',
					desc: 'Monthly (1-month vs Subs, 2 year comparison)'
				}
			],
			activations: [
				{
					name: 'apw',
					desc: 'Activations per Week'
				},
				{
					name: 'fapw',
					desc: 'Failed Activations per Week'
				},
				{
					name: 'apm',
					desc: 'Activations per Month'
				}
			],
			versions: [
				{
					name: 'opma',
					desc: 'Orders per Month (by app)'
				},
				{
					name: 'vers_dist_pie',
					desc: 'Version Distribution'
				},
				{
					name: 'vers_dist_bar',
					desc: 'Version Distribution'
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
				if(graph.data){
					//console.log('Adding graph ('+graph.desc+') with ' + graph.data.length + ' elements');
					
					// json is wrapped in quotes for some reason. Need to fix server-side
					//debugger;
					/*
					graph.data = JSON.parse(graph.data);
					graph.labels = JSON.parse(graph.labels);
					graph.series = JSON.parse(graph.series);
					//*/
					/*
					console.log('-- '+graph.desc);
					console.log(graph.data);
					console.log(graph.labels);
					console.log(graph.series);//*/
				}
				$scope.graphs.push(graph);
				//debugger;
			});
		};
		$scope.test = function(){
			debugger;
		}
		
		// Method in Graph factory to pop up graph - google graph API
		$scope.viewGraph=Graphs.viewGraph;
		
		//Chart.defaults.global.responsive = true;
		Chart.defaults.global.scaleBeginAtZero = false;
		Chart.defaults.global.legendTemplate = "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>";

		// need reference to chart
		$scope.chart = {};
		$scope.chart.options = {};
		$scope.chart.legend = false;

		$scope.$on('create', function (event, chart) {
	        $scope.chart = chart;
			$scope.chart.options.pointDotRadius = 0;
			//$scope.chart.options.showTooltips = false;
	    });
		$scope.$on('fullscreen_toggle', function (e, d) {
			window.dispatchEvent(new Event('resize'));
	    });
		$scope.fullscreen = function (e) {
	        e.preventDefault();

	        var $this = e.currentTarget;

			var i = $this.getElementsByTagName('i')[0].classList;
			
			//if panel, this should be .panel
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
		}
		
		//Chart.defaults.global.colours = [
		$scope.colours = {
			bar: [
				{
					fillColor : "rgba(0, 215, 219, 0.9)",
					strokeColor : "rgba(220,220,220,0.8)",
					highlightFill: "rgba(0, 215, 219, 0.4)",
					highlightStroke: "rgba(220,220,220,1)"
				},
				{
			        fillColor: "rgba(70,191,189,0.9)",
			        strokeColor: "rgba(70,191,189,0.8)",
			        highlightFill: "rgba(70,191,189,0.4)",
			        highlightStroke: "rgba(70,191,189,1)"
				}
			],
			line: [
			    { // neon blue
		            fillColor: "rgba(0, 215, 219,0.2)",
		            strokeColor: "rgba(0, 215, 219,1)",
		            pointColor: "rgba(0, 215, 219,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
			    },/*
			    { // light grey
			        fillColor: "rgba(220,220,220,0.2)",
			        strokeColor: "rgba(220,220,220,1)",
			        pointColor: "rgba(220,220,220,1)",
			        pointStrokeColor: "#fff",
			        pointHighlightFill: "#fff",
			        pointHighlightStroke: "rgba(220,220,220,0.8)"
			    },
			    { // red
			        fillColor: "rgba(247,70,74,0.2)",
			        strokeColor: "rgba(247,70,74,1)",
			        pointColor: "rgba(247,70,74,1)",
			        pointStrokeColor: "#fff",
			        pointHighlightFill: "#fff",
			        pointHighlightStroke: "rgba(247,70,74,0.8)"
			    },
			    { // green
			        fillColor: "rgba(70,191,189,0.2)",
			        strokeColor: "rgba(70,191,189,1)",
			        pointColor: "rgba(70,191,189,1)",
			        pointStrokeColor: "#fff",
			        pointHighlightFill: "#fff",
			        pointHighlightStroke: "rgba(70,191,189,0.8)"
			    },//*/
			    { // yellow
			        fillColor: "rgba(253,180,92,0.2)",
			        strokeColor: "rgba(253,180,92,1)",
			        pointColor: "rgba(253,180,92,1)",
			        pointStrokeColor: "#fff",
			        pointHighlightFill: "#fff",
			        pointHighlightStroke: "rgba(253,180,92,0.8)"
			    },
			    { // grey
			        fillColor: "rgba(148,159,177,0.2)",
			        strokeColor: "rgba(148,159,177,1)",
			        pointColor: "rgba(148,159,177,1)",
			        pointStrokeColor: "#fff",
			        pointHighlightFill: "#fff",
			        pointHighlightStroke: "rgba(148,159,177,0.8)"
			    },
			    { // dark grey
			        fillColor: "rgba(77,83,96,0.2)",
			        strokeColor: "rgba(77,83,96,1)",
			        pointColor: "rgba(77,83,96,1)",
			        pointStrokeColor: "#fff",
			        pointHighlightFill: "#fff",
			        pointHighlightStroke: "rgba(77,83,96,1)"
			    }
			]
		}
		
		$scope.onClick = function (points, evt) {
		    console.log(points, evt);
		  };
});