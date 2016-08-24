(function() {
    angular.module('Data', ['toaster'])
	.factory("Data", ['$http', 'toaster', '$rootScope', 
		function ($http, toaster, $rootScope) {
			
		    var serviceBase = 'API/';

			if(window.location.hostname == 'localhost' & window.location.port == '3000'){
				console.log("-- In DEV mode");
				serviceBase = "http://localhost/Shine_AngJS_Version/dev/API/";
			}
			
			var timestamp = new Date().getTime();
			timestamp = '?&i='+timestamp;
			
		    var obj = {};
		    obj.toast = function (data) {
		        toaster.pop(data.status, "", data.message, 5000, 'trustedHtml');
		        toaster.pop(data.status, "Get", JSON.stringify(data.server.get_params), 5000, 'trustedHtml');
		        toaster.pop(data.status, "Post", JSON.stringify(data.server.post_params), 5000, 'trustedHtml');
		    }
			obj.toastMsg = function (state,msg){
		        toaster.pop(state, "", msg, 2000, 'trustedHtml');
			}
		    obj.get = function (q) {
				progressBar.updateQueue(+1);
				
				return $http({
		            method: 'GET',
				    headers: {'Content-Type': 'application/json'},
					url: serviceBase + q + timestamp
				}).catch(function(e){
					progressBar.updateQueue(-1);
					
					console.log("GET failure",e);
					toaster.popSimple("error","Server Error","Task request failed!",5000);
				}).then(function (results) {
					progressBar.updateQueue(-1);

					//console.log("get: " + JSON.stringify(results.data));
					if(typeof results != "undefined" && typeof results.data != "undefined"){
			            return results.data;
					}
					else return results;
				});
		    };
			
		    obj.post = function (q, object) {	
				progressBar.updateQueue(+1);
						
				return $http({
		            method: 'POST',
				    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					url: serviceBase + q + timestamp,
					data: object 
				}).catch(function(e){
					progressBar.updateQueue(-1);
					
					console.log("POST failure",e);
					toaster.popSimple("error","Server Error","Task request failed!",5000);
				}).then(function (results) {
					progressBar.updateQueue(-1);
					
					if(results.data && results.data.status == "success"){					
						return results.data;
					}
					else
					{
						if(results.status != 200){
							toaster.popSimple("error",results.data.taskID+" error","Unexpected server error: "+results.status,5000);
							console.error("Unexpected server response HTTP"+results.status);
							
						}
						else{
							//debugger;
							if(results.data.code == 401){
								//toaster.popSimple("error","Authentication Error",results.data.message,5000);
								console.error("Task Request Failed: "+results.data.message);
							}
							else{
								toaster.popSimple("error",results.data.taskID+" task error",results.data.message,5000);
							}
							console.error("Response: "+JSON.stringify(results.data));
						}						
						return results.data;
					}
		        });
		    };
		    obj.put = function (q, object) {
		        return $http.put(serviceBase + q, object).then(function (results) {
					console.log("put: " + JSON.stringify(results.data));
					
		            return results.data;
		        });
		    };
		    obj.delete = function (q) {
		        return $http.delete(serviceBase + q).then(function (results) {
		            return results.data;
		        });
		    };

		    return obj;
		}
	])
	
})();