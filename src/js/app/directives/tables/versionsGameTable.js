(function() {
    angular.module('versionsGameTable', ['timeMathFltr','ngTable','toaster','versionFuncs'])

    .directive('versionsGameTable', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/pages/tables/versionsGameTable.html',
			scope:{},
			controller: ['$scope','Data','NgTableParams','$filter', 'toaster','$location','$rootScope','versionFuncs', function($scope, Data, NgTableParams, $filter, toaster, $location, $rootScope, versionFuncs) {
				$scope.versions = {};
				$scope.total = {};
				
				var self = this;
				
				$scope.appList = function(){
					//debugger;
					return $rootScope.appList;
				};
				$scope.getAppName = function(appID){
					return $scope.appList()[appID].title;
				};
				
				$scope.viewVersion = function(game_id){
					versionFuncs.viewGameVersion(game_id, $scope.versions, $scope.appList())
					.then(function (results) {	
						$scope.tableParams.reload();
					});
				};
				
				$scope.filters = {
		            game_name: '',
					vers_string: '',
					vers_bytes: ''/*,
					is_supported: '',
					not_supported_text: '',
					should_update: '',
					should_update_text: '',
					should_redirect: '',
					should_update_URL: '',
					game_vers_comments: ''*/
	        	};
				
				$scope.prepareTooltips = function(){
					$('[data-toggle="tooltip"]').tooltip();
					//need to work on these TODO
				}
				
				var queryStrings = $location.search();

				// restore filters
		        for (var filter in $scope.filters) {					
		            if (filter in queryStrings) {
		                $scope.filters[filter] = queryStrings[filter];
		            }
		        };
				
				// restore URL
				$scope.pagination = {};
				$scope.pagination.currentPage = 1;
				$scope.pagination.perPage = 20;
				
				if(queryStrings.page){
					$scope.pagination.currentPage = queryStrings.page;
				}
				if(queryStrings.n){
					$scope.pagination.perPage = queryStrings.n;
				}
				
				$scope.updateParamsPage = function(params){
	                $location.search('page', params);
				};
				$scope.updateParamsCount = function(params){
	                $location.search('n', params);
				};
				
				// Update query string with new params
				$scope.updateParamsFilters = function(params){
					for(param in params){ 
						if(params.hasOwnProperty(param) && params[param]){
			                $location.search(param, params[param]);
						}
						else{
			                $location.search(param, null);
						}
					}
				};

				// load table
			    $scope.tableParams = new NgTableParams({
			        page: $scope.pagination.currentPage,            // show first page
			        count: $scope.pagination.perPage,           // count per page
			        sorting: {  
			            game_name: 'desc',
						vers_string: '',
						vers_bytes: '',
						is_supported: '',
						not_supported_text: '',
						should_update: '',
						should_update_text: '',
						should_redirect: '',
						should_update_URL: '',
						game_vers_comments: ''
					},
			        filter: $scope.filters,
			    }, 
				{
			        filterSwitch: true,
			        total: 0, // length of data
					filterOptions: {
						filterDelay: 200
					},
			        getData: function(params) {
						//toaster.popSimple("warning","","Sorting still doesn't work!",4000);

						var form = {
							offset: (params.page() - 1) * params.count(),
							limit: params.count(),
							filter:params.filter(),
							sorting:params.sorting()
						};
						
						$scope.updateParamsFilters(params.filter());
						$scope.updateParamsPage(params.page());
						$scope.updateParamsCount(params.count());
						
						return Data.post('getVersions', {
							form: form,
							versionType: 'game',
						}).then(function (results) {
							$scope.versions = results.message.game;
							
							if(results.total != $scope.total)
								toaster.popSimple("success","",""+results.total+" results",2000);
							
							$scope.total = results.total;
							$scope.isFiltered = results.filtered;
							
				            var filteredData = params.filter() ? $filter('filter')($scope.versions, params.filter()) : $scope.versions;

				            params.total($scope.total);
							return filteredData;
						});
			        }
			    });
			}]
        };
    });
})();