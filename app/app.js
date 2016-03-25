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
                    // controller: "formController"
                },
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
            controller: 'formController'
        })
        .state('form.profile', {
            url: '/profile',
            templateUrl: 'view1/builder/form-profile.html'
        })

        // url will be /form/interests
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
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.asd = 'asd';
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on("$stateChangeError", console.log.bind(console));
    }])

app.controller('formController', function($scope,messages) {
    var self = this;
    self.messages = messages.list;
    
    console.log("formController")
    // we will store all of our form data in this object
    $scope.builderData = {};
    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');
    };
});


app.factory('messages', function(){
    var messages = {};
    messages.list = ['asd','asdasd'];
    messages.add = function(message){
        messages.list.push({id: messages.list.length, text: message});
    };
    return messages;
});