(function() {
    angular.module('membersTable', ['timeMathFltr','ngTable','toaster','memberViewCtrl'])

    .directive('membersTable', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/pages/tables/membersTable.html',
			scope:{},
			controller: ['$scope','Data','NgTableParams','$filter', 'toaster','$location', '$uibModal', 'memberFuncs', function($scope, Data, NgTableParams, $filter, toaster, $location, $uibModal, memberFuncs) {
				$scope.members = {};
				$scope.total = {};
				
				var self = this;

				$scope.filters = {
		            member_name: '',
					member_email: '',
					last_purchase: '',
					expiry_date: '',
					deactivated: '',
					blacklisted: ''
	        	};
				
				$scope.filterDeactivated = function(){
					if(!$scope.filters.deactivated)
						$scope.filters.deactivated = '1';
					else
						$scope.filters.deactivated = '';
					
					if($scope.filters.blacklisted)
						$scope.filters.blacklisted = '';
					
					$scope.tableParams.reload();
				};
				
				$scope.filterBlacklisted = function(){
					if(!$scope.filters.blacklisted)
						$scope.filters.blacklisted = '1';
					else
						$scope.filters.blacklisted = '';
					
					if($scope.filters.deactivated)
						$scope.filters.deactivated = '';

					$scope.tableParams.reload();
				};
				
				$scope.filterReset = function(){
					$scope.filters.member_name = '';
					$scope.filters.member_email = '';
					$scope.filters.last_purchase = '';
					$scope.filters.expiry_date = '';
					$scope.filters.deactivated = '';
					$scope.filters.blacklisted = '';
					$scope.tableParams.reload();
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

				$scope.isExpired = function(member){
					var expDate = new Date(Date.parse(member.expiry_date));
					var todayDate = new Date();
					
			        if(expDate <= todayDate)
						return true;
					
					return false;
			    };
					
				// load table
				var tableParams = {
			        page: $scope.pagination.currentPage,            // show first page
			        count: $scope.pagination.perPage,           // count per page
			        sorting: {  
			            member_name: '',
						member_email: '',
						last_purchase: '',
						expiry_date: '',
						activation_count: '',
						extension_count: 'desc'
					},
			        filter: $scope.filters,
			    };
					
			    $scope.tableParams = new NgTableParams(tableParams, 
					{
				        filterSwitch: true,
				        total: 0, // length of data
						filterOptions: {
							filterDelay: 200
						},
				        getData: function(params) {
							//toaster.popSimple("warning","","Sorting still doesn't work!",4000);
							//console.log("membersTable params: ",params);
							var form = {
								offset: (params.page() - 1) * params.count(),
								limit: params.count(),
								filter:params.filter(),
								sorting:params.sorting()
							};
							
							$scope.updateParamsFilters(params.filter());
							//$scope.updateParamsSorting(params.sorting());
							$scope.updateParamsPage(params.page());
							$scope.updateParamsCount(params.count());
							
							
							return Data.post('getMembers', {
								form: form,
							}).then(function (results) {
								$scope.members = JSON.parse(results.message);
								if(results.total != $scope.total)
									toaster.popSimple("success","",""+results.total+" results",2000);
							
								$scope.total = results.total;
								$scope.isFiltered = results.filtered;
								
								
					            var filteredData = params.filter() ? $filter('filter')($scope.members, params.filter()) : $scope.members;

								// for number of pages to work on total, not number of filtered results
					            params.total($scope.total);
								
								//debugger;
								return filteredData;
							});
				        }
				    }
				);
				
				// function to open member in modal
				$scope.openMember = function(memberID){
					memberFuncs.viewMember(memberID,$scope.members);
				};
				
				// function to open order in modal
				$scope.openOrder = function(orderID){
					ordesadfrFuncs.viewOrder(orderID,$scope.orders);
				};
				// end function to open order in modal
			}]
        };
    });
})();