(function() {
    angular.module('routes', ['ngRoute','dashboardCtrl'])
	
	.config(function($routeProvider, $locationProvider) {		
        $routeProvider
			.when('/login', {
	            title: 'Login',
	            templateUrl: 'partials/pages/login.html',
	            controller: 'authCtrl'
	        })
            .when('/logout', { title: 'Logout', templateUrl: 'partials/pages/login.html', controller: 'authCtrl' })
            .when('/signup', { title: 'Signup', templateUrl: 'partials/pages/signup.html', controller: 'authCtrl' })
            .when('/dashboard', { title: 'Dashboard', templateUrl: 'partials/pages/dashboard.html', controller: 'dashboardCtrl' })
            .when('/versions', { title: 'Versions', templateUrl: 'partials/pages/versions.html', controller: 'versionsCtrl', reloadOnSearch: false })
            .when('/reports/:category?', { title: 'Reporing & Graphs', templateUrl: 'partials/pages/reporting.html', controller: 'reportingCtrl', reloadOnSearch: false })
            .when('/orders/', { title: 'Orders', templateUrl: 'partials/pages/orders.html', controller: 'ordersCtrl', reloadOnSearch: false })
            .when('/members', { title: 'Members', templateUrl: 'partials/pages/members.html', controller: 'membersCtrl', reloadOnSearch: false })
            .when('/activations', { title: 'Activations', templateUrl: 'partials/pages/activations.html', controller: 'activationsCtrl', reloadOnSearch: false })
            //.when('/feedback/:view?/:fbid?/', { title: 'Feedback', templateUrl: 'partials/pages/feedback.html', controller: 'feedbackCtrl', reloadOnSearch: false })
			// ^ if($routeParams.view) openFeedback($routeParams.view.fbid) I think...
            .when('/logs', { title: 'Logs', templateUrl: 'partials/pages/logs.html', controller: 'logsCtrl', reloadOnSearch: false })
            .when('/', { title: 'Loading', templateUrl: 'partials/pages/loading.html', controller: 'authCtrl', role: '0' })
			
            .otherwise({
                redirectTo: '/'
            });
	});
	
})();