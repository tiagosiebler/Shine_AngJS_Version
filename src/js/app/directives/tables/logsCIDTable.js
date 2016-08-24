(function() {
    angular.module('logsCIDTable', ['timeMathFltr','ngTable','toaster'])

    .directive('logsCidTable', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/pages/tables/logsCIDTable.html',
			scope:{},
			controller: ['$scope','Data','NgTableParams','$filter', 'toaster','$location', function($scope, Data, NgTableParams, $filter, toaster, $location) {
				$scope.logs = {};
				$scope.total = {};
				$scope.tableAlias = "logs_CID";
				
				var self = this;
				
				$scope.actionTypes = {};
					
				$scope.filters = {
		            email: '',
					syskey: '',
					IP: '',
					dt: ''
				};
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
			            email: '',
						syskey: '',
						IP: '',
						dt: 'desc'
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
						
						return Data.post('getCIDLogs', {
							form: form,
						}).then(function (results) {
							$scope.logs = JSON.parse(results.message);
							
							if(results.total != $scope.total)
								toaster.popSimple("success","",""+results.total+" results",2000);
							
							$scope.total = results.total;
							$scope.isFiltered = results.filtered;
							
				            var filteredData = params.filter() ? $filter('filter')($scope.logs, params.filter()) : $scope.logs;

				            params.total($scope.total);
							
							return filteredData;
						});
			        }
			    });
			}]
        };
    });

})();