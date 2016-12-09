/**
 * Created by nina on 08/12/2016.
 */
'use strict';
angular
    .module('maintenancetrackerApp')
    .controller('MainController', MainController);

MainController.$inject = ['$scope','$window','$routeParams','$location','$firebaseArray'];
function MainController ($scope,$window,$routeParams,$location,$firebaseArray) {
    var usersRef = firebase.database().ref().child('users');
    var list = $firebaseArray(usersRef);

    $scope.toolVisible = "visibility:hidden";

    if($routeParams.logout == "true"){
        $window.sessionStorage.setItem("user","");
        console.log($window.sessionStorage.getItem("user"));
        $location.path('/login');
    }

    if($window.sessionStorage.getItem("user") !== ""){
        list.$loaded()
            .then(function(data) {
                if (data.$getRecord($window.sessionStorage.getItem("user")) !== null) {
                    //The username exists
                    $location.path($window.sessionStorage.getItem("user")+'/requests/');
                } else{
                    $location.path('/login');
                }
            });
    }else{
        $location.path('/login');
    }
}