angular.module('reportingCtrl', ['timeMathFltr','ui.bootstrap','bootstrap.tabset','chart.js'])
	.controller('reportingCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, Graphs, $timeout) {
		//$scope.graphs = [];
		
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
		
		/*

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
			    },
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
		//*/
});