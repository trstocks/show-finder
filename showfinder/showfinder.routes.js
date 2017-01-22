angular.module('ShowFinder')
.config(function($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl : '/components/home/home.html',
                controller : homeController
            })
            .when('/about', {
                templateUrl : '/components/about/aboutView.html',
                controller : mainController
            })
            .when('/contact', {
                templateUrl : '/components/contact.html',
                controller : mainController
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    });
