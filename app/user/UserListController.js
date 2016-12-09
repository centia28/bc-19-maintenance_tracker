/**
 * Created by nina on 08/12/2016.
 */
'use strict';
angular
    .module('maintenancetrackerApp')
    .controller('UserListController', UserListController);
UserListController.$inject = ['$scope','$firebaseArray','$firebaseObject','$routeParams'];

function UserListController ($scope,$firebaseArray,$firebaseObject,$routeParams) {
    //console.log($routeParams.username);

    //Load all the users
    var usersRef = firebase.database().ref().child('users');
    var list = $firebaseArray(usersRef);
    list.$loaded()
        .then(function(data) {
            if (data.$getRecord($routeParams.username) !== null) {   //The username exists
                if (data.$getRecord($routeParams.username).role == "admin") {
                    $scope.title = "Manage users profile";
                    $scope.roleVisibility = "visibility:visible";
                    $scope.users = data;
                    //console.log(data);
                } else {
                    $scope.title = "Profile";
                    $scope.roleVisibility = "visibility:hidden";
                    //console.log(data.$getRecord($routeParams.username));
                    $scope.users = [data.$getRecord($routeParams.username)];
                }
            }
        });

    $scope.setRole = function (username) {
        var objRef = firebase.database().ref().child('users').child(username);
        var objItem = $firebaseObject(objRef);
        var myrole;
        objItem.$loaded()
            .then(function (data) {
                //console.log("loaded",data);
                if(data.role == "admin") {
                    //Say admin can't be repairer
                    myrole = "admin";
                } else {
                    if (data.role == "repairer") {
                        myrole = "staff";
                    } else {
                        myrole = "repairer";
                    }
                }
                objItem.role=myrole;
                objItem.$save().then(function () {
                    console.log("Updated");
                }, function(error){
                    console.log(error);
                })
            });
    }
}