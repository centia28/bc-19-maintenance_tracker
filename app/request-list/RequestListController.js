/**
 * Created by nina on 06/12/2016.
 */
'use strict';
angular
    .module('maintenancetrackerApp')
    .controller('RequestListController', RequestListController);
RequestListController.$inject = ['$scope','$location','$firebaseArray','$routeParams'];

function RequestListController ($scope,$location,$firebaseArray,$routeParams) {
    var query;
    $scope.username = $routeParams.username;

    //Load the user and filter the request on the username
    var usersRef = firebase.database().ref().child('users');
    var list = $firebaseArray(usersRef);
    list.$loaded()
        .then(function(data) {
            if (data.$getRecord($routeParams.username) !== null) {   //The username exists
                if (data.$getRecord($routeParams.username).role !== "admin") {
                    query = firebase.database().ref().child('requests').orderByChild("username").equalTo($routeParams.username);
                        //console.log(data.val());
                } else {
                    query = firebase.database().ref().child('requests');
                }
            }

            var requestList = $firebaseArray(query);
            requestList.$loaded()
                .then(function (data) {
                    $scope.requests = data;
                });
        });

    $scope.goToRequest = function(reqId){
        $location.path($scope.username+'/requests/'+reqId);
    };

    $scope.showAdd = function(){
        $location.path($scope.username+'/requestadd');
    }

}