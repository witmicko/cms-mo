'use strict';

// Declare app level module which depends on views, and components


var app = angular.module('myApp', [
    'ui.router',
    'mo.resizer',
    'ui.bootstrap',
    'ViewStates',
    'preview',
    'angularMoment'
]);




app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index/form/meta");
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
        .state('form.meta', {
            url: '/meta',
            templateUrl: 'view1/builder/form-meta.html'
        })
        .state('form.availability', {
            url: '/availability',
            templateUrl: 'view1/builder/form-availability.html'
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



