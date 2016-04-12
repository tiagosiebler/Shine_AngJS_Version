(function() {
    angular.module('appsTable', ['ui.bootstrap','timeMathFltr','appViewCtrl','twoButtonBar'])//'ngAnimate', 

    .directive('appsTable', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/pages/tables/appsTable.html',
			scope:{},
			controller: ['$scope','Data','$uibModal', '$rootScope', function($scope, Data, $uibModal, $rootScope) {
				$scope.getApplications = function(){
					Data.post('getApplications', {})
					.then(function (results) {					
						$scope.apps = JSON.parse(results.message);
						$scope.totalApps = results.total;
						$scope.available_engines = results.available_engines;
					});
				};

				$scope.temp = 1;
				$scope.openApp = function(appID){
					if(appID)
						var columns = $scope.apps[appID].columns;
					else{
						var columns = {};
						appID = 0;
					}
						
					var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: 'partials/pages/tables/sub/appView.html',
						controller: 'appViewCtrl',
						size: 'lg',
            			windowClass: 'app-modal-window',
						resolve: {
							app: function () {
								return columns;
							},
							appID: function (){
								return appID;
							},
							available_engines: function (){
								return $scope.available_engines;
							}
						}
					});

					modalInstance.result.then(function (result) {
						//$scope.selected = selectedItem;
						//console.log("Caught "+result.action+" action.");
						if(result.action === 'save'){
							var resultData = result.data;
							var originalData = $scope.apps[resultData.id].columns;
						
							// Loop to create new object, which'll be sent to server as an update request. Only want to send changed columns to server, not unchanged data.
							var updateObject = {
							
							};
					        for (var item in originalData) {
								// Find mismatching data that needs to be sent to server
								if(originalData[item] !== result.data[item]){
									//console.log(item+" was changed from "+originalData[item]+ " to " +result.data[item]);
									updateObject[item] = result.data[item];
								}
					        };
						
							// Send post request to server, to update all objects in "updateObject" on the DB
							Data.post('application', {
								updateObject: updateObject,
								updateID: resultData.id,
								action: 'update'
							})
							.then(function (results) {	
								//debugger;				
								var message = JSON.parse(results.message);
							
								// update local reference of object to update view
								$scope.apps[message.id].columns = message.columns;
								Data.toastMsg("success","App Updated");
							});
						}
						
						else if(result.action === 'saveNew'){
							// Send post request to server, to update all objects in "updateObject" on the DB
							Data.post('application', {
								newAppDetails: result.data,
								action: 'new'
							})
							.then(function (results) {	
								var message = JSON.parse(results.message);
							
								// update local reference of object to update view
								$scope.apps[message.id] = message
								$scope.apps[message.id].columns = message.columns;
								Data.toastMsg("success","New App Created");
							});
						}
					}, function () {
						console.log('Modal dismissed at: ' + new Date());
						}
					);
				};
				
				
			}],
			controllerAs: 'appsTable'
        };
    });
})();