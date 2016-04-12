(function() {
    angular.module('threeButtonBar', [])

    .directive('threeButtonBar', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/pages/tables/buttons/threeButtonBar.html',//make a 2 button version for other ones
            replace: true,
			scope: {
				showFilter: '=',
				tableParams: '=',
				tableAlias: '='
			},
			controller: ['$scope','Data', function($scope, Data) {
				$scope.markAsRead = function(myTableAlias){
					//console.log("child: Submit task to mark all as read.");
					var form = {
						params: myTableAlias
					};
					Data.post('markAllAsRead', {
						form: form,
					}).then(function (results) {
						if(results.message){
							//console.log("Successfully marked all as read, need to reload data:");
							$scope.$parent.tableParams.reload();
						}else{
							toaster.popSimple("error","markAllAsRead error","server error",2000);
						}
					});
				}
			}],
			controllerAs: 'threeButtonCtrl'
        };
    });

})();