'use strict';

// Declare app level module which depends on views, and components


var app = angular.module('myApp', [
    'ui.router',
    'mo.resizer',
    'ui.bootstrap',
    'ViewStates',
    'preview',
]);




app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index");
    $stateProvider
        .state('index', {
            url: "/index",
            views: {
                "preview": {
                    templateUrl: "view1/preview/preview.html",
                    controller: "EventsCtrl"
                }
            }
        })
        .state('form', {
            parent: 'index',
            url: '/form',
            templateUrl: 'view1/builder/form.html',
            controller: 'EventsCtrl'
        })
        .state('form.profile', {
            url: '/profile',
            templateUrl: 'view1/builder/form-profile.html'
        })
        .state('form.interests', {
            url: '/interests',
            templateUrl: 'view1/builder/form-interests.html'
        })

        // url will be /form/payment
        .state('form.payment', {
            url: '/payment',
            templateUrl: 'view1/builder/form-payment.html'
        })
}]);


app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope) {
        $rootScope.$on("$stateChangeError", console.log.bind(console));
    }])



