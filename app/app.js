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
        .state('form.notes', {
            url: '/notes',
            templateUrl: 'view1/builder/form-notes.html'
        })
        .state('form.contact', {
            url: '/contact',
            templateUrl: 'view1/builder/form-contact.html'
        })
        .state('form.organisation', {
            url: '/organisation',
            templateUrl: 'view1/builder/form-organisation.html'
        })
        .state('form.attendees', {
            url: '/attendees',
            templateUrl: 'view1/builder/form-attendees.html'
        })
       
}]);


app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope) {
        $rootScope.$on("$stateChangeError", console.log.bind(console));
    }])


