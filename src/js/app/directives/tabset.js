(function() {
	'use strict';

	angular.module('bootstrap.tabset', [])
	.directive('tabset', function () {
	  return {
		  restrict: 'E',
		  replace: true,
		  transclude: true,
		  scope: {
			  tabsType: '@'
		  },
		  link: function(scope, element, attrs, tabsetController) {
			  scope.tabsType = attrs.tabsType;
		  },
		  controller: function($scope, $location, $routeParams, Graphs) {
				$scope.templateUrl = '';
				var tabs = $scope.tabs = [];
				var controller = this;

				var currentTab = $location.search()[$scope.tabsType];

				this.selectTab = function (tab) {				
					angular.forEach(tabs, function (tab) {
					//	debugger;
						tab.selected = false;
					});
					tab.selected = true;
					tab.$parent.$parent.selectedTab = tab.title.toLowerCase();
					
				};

				this.setTabTemplate = function (templateUrl) {
					$scope.templateUrl = templateUrl;
				}

				this.addTab = function (tab) {
					if (tabs.length == 0) {
						controller.selectTab(tab);
					}
					tabs.push(tab);
					if(currentTab && tab.title.toLowerCase() === currentTab){
						controller.selectTab(tab);
					}
				};
				$scope.viewGraph=Graphs.viewGraph;
		  },
		  template:
			  '<div class="row-fluid">' +
				  '<div class="row-fluid">' +
				    '<div class="nav nav-tabs" ng-transclude></div>' +
				  '</div>' +
				  '<div class="row-fluid">' +
				    '<ng-include src="templateUrl">' +
				  '</ng-include></div>' +
			  '</div>'
	  };
	})
	.directive('tab', ['$location', function (location) {
	  return {
		  restrict: 'E',
		  replace: true,
		  require: '^tabset',
		  scope: {
			title: '@',
			templateUrl: '@'
		  },
		  link: function(scope, element, attrs, tabsetController) {
			  tabsetController.addTab(scope);
			
			  scope.select = function () {
				  // change URL param to fit current tab
				  if(scope.$parent.$parent.tabsType)
					  location.search(scope.$parent.$parent.tabsType, scope.title.toLowerCase());

				  tabsetController.selectTab(scope);
			  }

			  scope.$watch('selected', function () {
				  if (scope.selected) {
				    tabsetController.setTabTemplate(scope.templateUrl);
				  }
			  });
		  },
		  template:
			  '<li ng-class="{active: selected}">' +
				  '<a href="" ng-click="select()">{{ title }}</a>' +
			  '</li>'
		};
	}]);

})();