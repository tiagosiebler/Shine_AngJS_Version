    angular.module('authCtrl', [])
	.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (form) {
		
        Data.post('login', {
            form: form,
        }).then(function (results) {
            //Data.toast(results);
            $location.path('dashboard');
        });
    };
    $scope.signup = {email:'',password:'',name:'',phone:'',address:''};
    $scope.signUp = function (customer) {
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            //Data.toast(results);
            if (results.status == "success") {
                $location.path('home');
            }
			else
				toaster.popSimple("error","Error",""+results.message+" results",5000);
        });
    };
});