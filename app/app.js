'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ui.router',
    'mo.resizer',
    'ui.bootstrap'
]);
app.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise("/index");
    $stateProvider
        .state('index', {
            url: "/index",
            views: {
                "builder": {
                    templateUrl: "view1/index.viewA.html",
                    controller: "builderCtrl"
                },
                "preview": {
                    templateUrl: "view1/index.viewB.html",
                    controller: "builderCtrl"
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
});

app.controller('builderCtrl', function($scope) {

    // we will store all of our form data in this object
    $scope.hello = "hellooooo";

    // function to process the form
    // $scope.processForm = function() {
    //     alert('awesome!');
    // };

});


app.run(function($rootScope) {
    $rootScope.$on("$stateChangeError", console.log.bind(console));
});