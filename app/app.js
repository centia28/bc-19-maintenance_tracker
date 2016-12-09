/**
 * Created by nina on 06/12/2016.
 */
'use strict';

var app = angular
    .module('maintenancetrackerApp',[
        'ngMaterial',
        'ngMessages',
        'ngRoute',
        'firebase',
        'ngResource',
        'ngFileUpload'])
    .config(config);

config.$inject = ['$routeProvider'];
function config ($routeProvider){
    $routeProvider.
    when('/', {
        controller: 'MainController',
        templateUrl: 'main/main.html'
    })
    .when('/logout/:logout', {
        controller: 'MainController',
        templateUrl: 'main/main.html'
    })
    .when('/login',{
        controller: 'LoginController',
        templateUrl: 'login/login.template.html'
    })
    .when('/register',{
        controller: 'RegisterController',
        templateUrl: 'register/register.template.html'
    })
    .when('/:username/requestadd',{
        controller: 'RequestAddController',
        templateUrl: 'request-add/request-add.template.html'
    })
    .when('/:username/requests',{
        //controller: 'AppCtrl',
        //templateUrl: 'request/request.template.html'
        controller: 'RequestListController',
        //templateUrl: 'request/request.template.html'
        templateUrl: 'request-list/request-list.template.html'
    })
    .when('/:username/requests/:requestId',{
        controller: 'RequestDetailController',
        templateUrl: 'request-detail/request-detail.template.html'
    })
    .when('/:username/requests/:requestId/edit',{
        controller: 'RequestUpdateController',
        templateUrl: 'request-detail/request-update.template.html'
    })
    .when('/:username/profile',{
        controller: 'UserListController',
        templateUrl: 'user/user-list.template.html'
    })
    .when('/:username/notification',{
        controller: 'NotificationController',
        templateUrl: 'user/notification.template.html'
    })
    .otherwise({
        redirectTo: '/'
    });
}
var fireConfig = {
    apiKey: "AIzaSyC1pOoN_Z8ob6syOCGhwWJ8Wk4hV9GgTBY",
    authDomain: "maintenancetracker-6bc70.firebaseapp.com",
    databaseURL: "https://maintenancetracker-6bc70.firebaseio.com",
    storageBucket: "maintenancetracker-6bc70.appspot.com",
    messagingSenderId: "210109565348"
};
firebase.initializeApp(fireConfig);

/*app.controller('appCtrl',['$scope','$routeParams','$location'],function ($scope,$routeParams,$location) {
    $scope.seeProfile = function () {
        $location.path($routeParams.username/profile);
    }
});*/
function seeProfile(){
    $location.path($routeParams.username/profile);
}

app.config(function($mdIconProvider) {
    $mdIconProvider
    // linking to https://github.com/google/material-design-icons/tree/master/sprites/svg-sprite
    //
        .iconSet('action', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-action.svg', 24)
        .iconSet('alert', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-alert.svg', 24)
        .iconSet('av', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-av.svg', 24)
        .iconSet('communication', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-communication.svg', 24)
        .iconSet('content', 'assets/img/svg-sprite-content.svg', 24)
        .iconSet('device', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-device.svg', 24)
        .iconSet('editor', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-editor.svg', 24)
        .iconSet('file', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-file.svg', 24)
        .iconSet('hardware', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-hardware.svg', 24)
        .iconSet('image', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-image.svg', 24)
        .iconSet('maps', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-maps.svg', 24)
        .iconSet('navigation', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-navigation.svg', 24)
        .iconSet('notification', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-notification.svg', 24)
        .iconSet('social', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-social.svg', 24)
        .iconSet('toggle', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-toggle.svg', 24)

        // Illustrated user icons used in the docs https://material.angularjs.org/latest/#/demo/material.components.gridList
        .iconSet('avatars', 'https://raw.githubusercontent.com/angular/material/master/docs/app/icons/avatar-icons.svg', 24)
        .defaultIconSet('https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-action.svg', 24);
});
app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
});
