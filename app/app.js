'use strict';

// Declare app level module which depends on views, and components


var app = angular.module('myApp', [
    'ui.router',
    'mo.resizer',
    'ui.bootstrap',

    'ViewStates',
    'preview',
    'angularMoment',
    'appOptions'
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
            templateUrl: 'view1/builder/form-01-meta.html'
        })
        .state('form.availability', {
            url: '/availability',
            templateUrl: 'view1/builder/form-02-availability.html'
        })
        .state('form.notes', {
            url: '/notes',
            templateUrl: 'view1/builder/form-03-notes.html'
        })
        .state('form.header', {
            url: '/header',
            templateUrl: 'view1/builder/form-04-header.html'
        })
        .state('form.offerings', {
            url: '/offerings',
            templateUrl: 'view1/builder/form-05-offerings.html'
        })
        .state('form.organisation', {
            url: '/organisation',
            templateUrl: 'view1/builder/form-06-organisation.html'
        })
        .state('form.contact', {
            url: '/contact',
            templateUrl: 'view1/builder/form-07-contact.html'
        })
        .state('form.attendees', {
            url: '/attendees',
            templateUrl: 'view1/builder/form-08-attendees.html'
        })
        .state('form.submission', {
            url: '/submission',
            templateUrl: 'view1/builder/form-09-submission.html'
        })
       
}]);


app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope) {
        $rootScope.$on("$stateChangeError", console.log.bind(console));
    }])


