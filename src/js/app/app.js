(function() {
    angular.module('serverCP', ['routes', 'Data', 'Graphs', 'graphsDirective', 'authCtrl', 'ordersCtrl','navbar','ordersTable','membersCtrl','membersTable','activationsCtrl','activationsTable','logsCtrl','versionsCtrl','graphViewCtrl','reportingCtrl'])

	.run(function($http, $httpParamSerializerJQLike) {
		$http.defaults.transformRequest.unshift($httpParamSerializerJQLike);	  
	})
	
	.config(function ($httpProvider) {
		// passthru auth
	    $httpProvider.defaults.withCredentials = true;
	})
	
	// check for session on start
    .run(function ($rootScope, $location, Data) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = false;
            Data.get('getSessionState').then(function (results) {
                if (results.uid) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;

					$rootScope.appList = JSON.parse(results.appList);
					$rootScope.appList.splice(0, 0, {
						id: '', title: ''
					});
					
					$rootScope.nums = {
						tweets: results.num_tweets,
						feedback: results.num_feedback,
						logs: results.num_logs
					};
								
					$rootScope.logout = function () {
						//debugger;
						console.log('logout');
				        Data.get('logout').then(function (results) {
				            //Data.toast(results);
				            $location.path('/login');
				        });
				    }
					
					// Redirect http://url/ to dashboard, unless not logged in
                    if (next.$$route && next.$$route.originalPath == "/") {
						$location.path('/dashboard');
                    }
                } else {					
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {
                    	
                    } else {
                        $location.path("/login");
                    }
                }
            });
        });
    });
})();