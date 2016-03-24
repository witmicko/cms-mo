'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ui.router',
    'mo.resizer',
    'ui.bootstrap',
    'ViewStates',
    'preview',
    'builder'
]);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index");
    $stateProvider
        .state('index', {
            url: "/index",
            views: {
                "builder": {
                    templateUrl: "view1/builder/builder.html",
                    controller: "builderCtrl"
                },
                "preview": {
                    templateUrl: "view1/preview/preview.html",
                    controller: "EventsCtrl"
                }
            }
        })
        .state('route1', {
            url: "/route1",
            views: {
                "viewA": {template: "route1.viewA"},
                "viewB": {template: "route1.viewB"}
            }
        })
        .state('route2', {
            url: "/route2",
            views: {
                "viewA": {template: "route2.viewA"},
                "viewB": {template: "route2.viewB"}
            }
        })
}]);



app.run(function ($rootScope) {
    $rootScope.$on("$stateChangeError", console.log.bind(console));
});


