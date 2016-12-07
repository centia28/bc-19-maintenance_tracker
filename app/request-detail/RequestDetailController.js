/**
 * Created by nina on 07/12/2016.
 */
'use strict';

angular
    .module('maintenancetrackerApp')
    .controller('RequestDetailController', RequestDetailController);
RequestDetailController.$inject = ['$scope','$firebaseObject','$firebaseArray','$routeParams'];

function RequestDetailController($scope,$firebaseObject,$firebaseArray,$routeParams) {
    var requestRef = firebase.database().ref().child('requests').child($routeParams.requestId);

    $scope.title = "Maintenance tracker";

    var requestItem = $firebaseObject(requestRef);
    requestItem.$loaded()
        .then(function (data) {
            $scope.request = data;
            if ($scope.request.username == $routeParams.username) {
                $scope.userStatus = "Yourself";
            } else {
                $scope.userStatus = $routeParams.username;
            }
        });

    //repairerDisplayName

    //we show repairer assignment only for admin
    //we show done button to repairer assigned the request
    var usersRef = firebase.database().ref().child('users');
    var list = $firebaseArray(usersRef);
    $scope.displayRepairerAssign = "visibility: hidden";
    $scope.displayRequestDone = "visibility: hidden";
    list.$loaded()
        .then(function(data) {
            var user = data.$getRecord($routeParams.username);
            if (user !== null) {   //The username exists
                //gest the repairer display name
                $scope.repairerDisplayName = user.firstname + " " + user.lastname;

                if (user.role == "admin") {
                    $scope.displayRepairerAssign = "visibility: visible";
                }
                if($scope.request.repairer == $routeParams.username) {
                    $scope.displayRequestDone = "visibility: visible";
                    if($scope.request.status == "resolved") {
                        $scope.doneBtnDisplay = "Undo";
                    } else {
                        $scope.doneBtnDisplay = "Done";
                    }
                }
            }

            //populate select
            $scope.repairers = {selected: null,availableOptions: []};
            var opt = [];
            var obj = {};
            angular.forEach(data, function(user){
                if ($scope.request.repairer !== "") {
                    if (user.username !== $scope.request.repairer) {
                        obj.username = user.username;
                        obj.diplayName = user.firstname + " " + user.lastname;
                        opt.push(obj);
                    }
                } else {
                    obj.username = user.username;
                    obj.diplayName = user.firstname + " " + user.lastname;
                    opt.push(obj);
                }
            });
            //console.log(opt);
            $scope.repairers.availableOptions = opt;
        });
    
    //The assignment function
    $scope.assignRepairer = function () {
        var username = $scope.repairers.selected;
        //console.log(username);
        if(username == "" || username === undefined || username === null) {
            $scope.assignStatus = "Please select a repairer";
        } else {
            //Update the request and set repairer
            requestItem.repairer = username;
            requestItem.status = "assigned";
            requestItem.$save().then(function(){
                $scope.assignStatus = "Request assigned";
            }, function (error) {
                $scope.assignStatus = error;
            })
        }
    }

    //Update the request to resolved if done
    $scope.resolveRequest = function () {
        //Update the request and set status to resolved
        if($scope.request.status == "resolved") {
            requestItem.status = "assigned";
            $scope.doneBtnDisplay = "Done";
        } else {
            requestItem.status = "resolved";
            $scope.doneBtnDisplay = "Undo";
        }
        requestItem.$save().then(function(){
            $scope.assignStatus = "Request "+requestItem.status;
        }, function (error) {
            $scope.assignStatus = error;
        })
    }

}