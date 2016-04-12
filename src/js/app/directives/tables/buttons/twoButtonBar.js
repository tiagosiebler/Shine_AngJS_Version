(function() {
    angular.module('twoButtonBar', [])

    .directive('twoButtonBar', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/pages/tables/buttons/twoButtonBar.html',
            replace: true,
			scope: {
				showFilter: '=',
				tableParams: '='
			},
			controller: function(){},
			controllerAs: 'twoButtonCtlr'
        };
    });

})();