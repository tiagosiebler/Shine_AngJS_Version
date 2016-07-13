(function() {
    angular.module('serverCP', ['routes', 'ngProgress', 'Data', 'Graphs', 'graphsDirective', 'authCtrl','navbar','ordersTable','membersTable','activationsTable','logsCtrl','versionsCtrl','graphViewCtrl','reportingCtrl'])

	.run(function($http, $httpParamSerializerJQLike) {
		$http.defaults.transformRequest.unshift($httpParamSerializerJQLike);	  
	})
	
	.config(function ($httpProvider) {
		// passthru auth
	    $httpProvider.defaults.withCredentials = true;
	})
	
	// check for session on start
    .run(function ($rootScope, $location, Data, ngProgressFactory) {
        $rootScope.authenticated = false;
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
	        Data.get('logout').then(function (results) {
	            //Data.toast(results);
				$rootScope.authenticated = false;
	            $location.path('/login');
	        });
	    }
		if(typeof window.progressBar == 'undefined'){
			window.progressBar = ngProgressFactory.createInstance();
		}
		window.progressBar.updateQueue = function(value){
			var startedNow = false;
			if(typeof progressBar.queue == 'undefined'){
				console.log("#### Creating queue");
				progressBar.queue = 0;
			}
			if(progressBar.queue == 0) startedNow = true;
			
			progressBar.queue = progressBar.queue + value;
			// first if is for when queue goes from 0 to 1. Don't want to trigger when queue goes from 2 to 1.
			if(startedNow) {
				console.log("-- Progress - starting - queue " + progressBar.queue);
				progressBar.start();
			}			
			else if(progressBar.queue > 0 && progressBar.queue != 1){
				//debugger;
				var newVal = (100 / progressBar.queue);
				progressBar.set(newVal);
				console.log("-- Progress - setting to value "+newVal + " queue " + progressBar.queue);
			}
			else if(progressBar.queue != 1){
				console.log("-- Progress - completing - queue " + progressBar.queue);
				progressBar.complete();
			}
		}
        $rootScope.$on("$locationChangeStart", function(event, next, current) { 
	        console.log("location changing to: " + next); 
			progressBar.updateQueue(+1);
		});
        $rootScope.$on("$locationChangeSuccess", function(event, next, current) { 
	        console.log("locationChangeSuccess: " + next); 
			progressBar.updateQueue(-1);
		});
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
			//console.log("Route started");
			//progressBar.updateQueue(+1);
			//todo server-side auth checks are there. Standard responses could provide this instead of proactively calling it
            Data.get('getSessionState').then(function (results) {
                if (typeof results.uid != 'undefined') {
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
        $rootScope.$on('$routeChangeSuccess', function(){
			//console.log("Route ended");
			//progressBar.updateQueue(-1);
			
		});
        $rootScope.$on('$routeChangeError', function(){
			//console.log("Route errored");
			//progressBar.updateQueue(-1);
			
		});
		
    });
})();