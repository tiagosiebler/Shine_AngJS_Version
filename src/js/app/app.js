(function() {
    angular.module('serverCP', ['routes', 'Data', 'Graphs', 'graphsDirective', 'authCtrl','navbar','ordersTable','membersTable','activationsTable','logsCtrl','versionsCtrl','graphViewCtrl','reportingCtrl'])

	.run(function($http, $httpParamSerializerJQLike) {
		$http.defaults.transformRequest.unshift($httpParamSerializerJQLike);	  
	})
	
	.config(function ($httpProvider) {
		// passthru auth
	    $httpProvider.defaults.withCredentials = true;
	})
	
	// check for session on start
    .run(function ($rootScope, $location, Data) {
        $rootScope.authenticated = false;

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
			$rootScope.getLocation = function(){
				var loc = $location.path();
			
				// remove first forward slash
		        if (loc.indexOf('/') === 0){
					loc = loc.replace('/','');
				}
				// last forward slash
		        if (loc.indexOf('/') === (loc.length - 1)){
					loc = loc.replace('/','');
				}
				else{
					// replace remaining slashes with separator
					loc = loc.replace('/',' - ');
				}
			
				return 'CP - ' + loc.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
			}
			$rootScope.logout = function () {
				console.log('logout');
		        Data.get('logout').then(function (results) {
		            //Data.toast(results);
					$rootScope.authenticated = false;
		            $location.path('/login');
		        });
		    }
			//todo server-side auth checks are there. Standard responses could provide this instead of proactively calling it
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