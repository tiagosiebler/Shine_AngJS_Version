(function() {
    angular.module('Graphs', ['Data'])
	
	.factory("Graphs", ['Data', '$uibModal',
		function(Data, $uibModal){
			var obj = {};
			obj.get = function(graphs){			
				return Data.post('getGraphs', {
					form: {
						graph_ids:graphs
					},
				}).then(function (results) {
						return JSON.parse(results.message);
				});
			};
			obj.getSingle = function(graph){
				return Data.post('getGraphs', {
					form: {
						graph_ids:graph.name
					},
					graph_desc: graph.desc
				}).then(function (results) {
					var msg = JSON.parse(results.message);
					
					msg[results.server.post_params.form.graph_ids].desc = results.server.post_params.graph_desc;
					return msg;
				});
			};
			obj.viewGraph = function(graphURL,graphLabel){
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'partials/pages/tables/sub/graphView.html',
					controller: 'graphViewCtrl',
					size: 'lg',
					resolve: {
						graphURL: function (){
							return graphURL;
						},
						graphLabel: function (){
							return graphLabel;
						}
					}
				});
			};
			return obj;
		}
	])
	
})();