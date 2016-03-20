'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'mo.resizer'
]).
config(['$stateProvider', function($stateProvider) {
  $stateProvider
      .state('index', {
        url: "",
        views: {
          "viewA": { templateUrl: "view1/index.viewA.html" },
          "viewB": { templateUrl: "view1/index.viewB.html" }
        }
      })
      .state('route1', {
        url: "/route1",
        views: {
          "viewA": { template: "route1.viewA" },
          "viewB": { template: "route1.viewB" }
        }
      })
      .state('route2', {
        url: "/route2",
        views: {
          "viewA": { template: "route2.viewA" },
          "viewB": { template: "route2.viewB" }
        }
      })
}]);
