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
    .config(config)

config.$inject = ['$routeProvider'];
function config ($routeProvider){
    $routeProvider.
    when('/', {
        controller: 'LoginController',
        templateUrl: 'login/login.template.html'
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
    .otherwise({
        redirectTo: '/login'
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
