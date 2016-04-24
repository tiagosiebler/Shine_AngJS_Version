(function() {
    angular.module('navbar', [])

    .directive('renderNavbar', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/header/navbar.html',
			controller: ['$scope', '$location', function($scope, $location) {
				$scope.isActive = function (viewLocation) {
					//console.log("$location.path: ("+$location.path()+") and viewLocation: ("+viewLocation+") and URL: ("+$location.url()+")");
					return $location.path().indexOf(viewLocation) == 0;
				};
			}],
			controllerAs: 'navbarCtrl'
        };
    });		
})();