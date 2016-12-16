(function() {
    angular.module('routes', ['ngRoute','dashboardCtrl','ordersCtrl','activationViewCtrl'])
	
	.config(function($routeProvider, $locationProvider) {		
        $routeProvider
			.when('/login', { title: 'Login', templateUrl: 'partials/pages/login.html', controller: 'authCtrl' })
            .when('/logout', { title: 'Logout', templateUrl: 'partials/pages/login.html', controller: 'authCtrl' })
            .when('/signup', { title: 'Signup', templateUrl: 'partials/pages/signup.html', controller: 'authCtrl' })
            .when('/dashboard', { title: 'Dashboard', templateUrl: 'partials/pages/dashboard.html', controller: 'dashboardCtrl' })
		
            .when('/versions', { title: 'Versions', templateUrl: 'partials/pages/versions.html', controller: 'versionsCtrl', reloadOnSearch: false })
		
			//todo these three are currently unused, not sure if I'll replace this one
            .when('/version/app/:ref?', { title: 'Versions', templateUrl: 'partials/pages/tables/sub/appVersionView.html', controller: 'appVersionViewCtrl', reloadOnSearch: false })
            .when('/version/game/:ref?', { title: 'Versions', templateUrl: 'partials/pages/tables/sub/gameVersionView.html', controller: 'gameVersionViewCtrl', reloadOnSearch: false })
            .when('/version/unkn/:ref?', { title: 'Versions', templateUrl: 'partials/pages/tables/sub/unknownVersionView.html', controller: 'unknownVersionViewCtrl', reloadOnSearch: false })
		
            .when('/reports/:category?', { title: 'Reporing & Graphs', templateUrl: 'partials/pages/reporting.html', controller: 'reportingCtrl', reloadOnSearch: false })
		
           	.when('/orders', { title: 'Orders', templateUrl: 'partials/pages/orders.html', controller: 'authCtrl', reloadOnSearch: false })
            .when('/order/:ref?', { title: 'View Order', templateUrl: 'partials/pages/tables/sub/orderView.html', controller: 'orderViewCtrl', reloadOnSearch: false })
		
            .when('/members', { title: 'Members', templateUrl: 'partials/pages/members.html', controller: 'authCtrl', reloadOnSearch: false })
            .when('/member/:ref?', { title: 'View Member', templateUrl: 'partials/pages/tables/sub/memberView.html', controller: 'memberViewCtrl', reloadOnSearch: false })
		
            .when('/activations', { title: 'Activations', templateUrl: 'partials/pages/activations.html', controller: 'authCtrl', reloadOnSearch: false })
            .when('/activation/:ref?', { title: 'View Activation', templateUrl: 'partials/pages/tables/sub/activationView.html', controller: 'activationViewCtrl', reloadOnSearch: false })

            //.when('/feedback/:view?/:fbid?/', { title: 'Feedback', templateUrl: 'partials/pages/feedback.html', controller: 'feedbackCtrl', reloadOnSearch: false })
			// ^ if($routeParams.view) openFeedback($routeParams.view.fbid) I think...
            .when('/logs', { title: 'Logs', templateUrl: 'partials/pages/logs.html', controller: 'logsCtrl', reloadOnSearch: false })
            .when('/log/system/:ref?', { title: 'View System Log', templateUrl: 'partials/pages/tables/sub/logs/systemLogView.html', controller: 'memberViewCtrl', reloadOnSearch: false })
            .when('/log/failed/:ref?', { title: 'View Failed Log', templateUrl: 'partials/pages/tables/sub/logs/failedLogView.html', controller: 'memberViewCtrl', reloadOnSearch: false })
            .when('/log/deactivated/:ref?', { title: 'View Deactivated Request Log', templateUrl: 'partials/pages/tables/sub/logs/deactivatedLogView.html', controller: 'memberViewCtrl', reloadOnSearch: false })
            .when('/log/computerID/:ref?', { title: 'View CompID Log', templateUrl: 'partials/pages/tables/sub/logs/computerIDLogView.html', controller: 'memberViewCtrl', reloadOnSearch: false })
            .when('/', { title: 'Loading', templateUrl: 'partials/pages/loading.html', controller: 'authCtrl', role: '0' })
			
            .otherwise({
                redirectTo: '/'
            });
	});
})();