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
    $scope.displayComments = "visibility: hidden";
    list.$loaded()
        .then(function(data) {
            var repairerUser = data.$getRecord($scope.request.repairer);
            var connectedUser = data.$getRecord($routeParams.username);
            if (repairerUser !== null) {   //The username exists
                //gest the repairer display name
                $scope.repairerDisplayName = repairerUser.firstname + " " + repairerUser.lastname;
            }
            if(connectedUser !== null){

                if (connectedUser.role == "admin") {
                    $scope.displayRepairerAssign = "visibility: visible";
                    if($scope.request.status == "resolved") {
                        $scope.displayComments = "visibility: hidden";
                    } else if($scope.request.status == "rejected" || $scope.request.status == "approved"){
                        $scope.displayComments = "visibility: visible";
                        $scope.displayRepairerAssign = "visibility: hidden";
                    } else{
                        $scope.displayComments = "visibility: hidden";
                    }
                }
                if($scope.request.repairer == $routeParams.username) {
                    $scope.displayRequestDone = "visibility: visible";
                    if($scope.request.status == "resolved") {
                        $scope.doneBtnDisplay = "Undo";
                    } else if($scope.request.status == "rejected" || $scope.request.status == "approved"){
                        $scope.displayRequestDone = "visibility: hidden";
                    } else {
                        $scope.doneBtnDisplay = "Done";
                    }
                }
            }

            //populate select
            populateRepairerSelect(data);
        });
    function populateRepairerSelect(data) {
        $scope.repairers = {selected: null,availableOptions: []};
        var opt = [];
        var obj = {};
        //console.log(data);
        angular.forEach(data, function(user){
            if(user.username !== null && user.username !== undefined){
                if ($scope.request.repairer !== "" ) {
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
            }
        });
        //console.log(opt);
        $scope.repairers.availableOptions = opt;
    }
    
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

                var repairerUser = list.$getRecord($scope.request.repairer);
                if (repairerUser !== null) {   //The username exists
                    //gest the repairer display name
                    $scope.repairerDisplayName = repairerUser.firstname + " " + repairerUser.lastname;
                }

                populateRepairerSelect(list);

                if(requestItem.repairer !== $routeParams.username){
                    $scope.displayRequestDone = "visibility: hidden";
                } else {
                    $scope.displayRequestDone = "visibility: visible";
                    $scope.doneBtnDisplay = "Done";
                }
            }, function (error) {
                $scope.assignStatus = error;
            })
        }
    };

    //Update the request to resolved if done
    $scope.resolveRequest = function () {
        //Update the request and set status to resolved
        if($scope.request.status == "resolved") {
            requestItem.status = "assigned";
            $scope.doneBtnDisplay = "Done";
            $scope.displayComments = "visibility: hidden";
        } else {
            requestItem.status = "resolved";
            $scope.doneBtnDisplay = "Undo";
            $scope.displayComments = "visibility: visible";
        }
        requestItem.$save().then(function(){
            $scope.assignStatus = "Request "+requestItem.status;
        }, function (error) {
            $scope.assignStatus = error;
        })
    };
    $scope.approveRequest = function () {
        processApproval("approved")
    };
    $scope.rejectRequest = function () {
        processApproval("rejected")
    };
    //If rejected, comment is required
    //If decision made, can't assign or update to done
    function processApproval(decision){
        if(decision == "rejected" && $scope.request.comments == "" ){
            $scope.assignStatus = "Add comments";
        } else {
            requestItem.status = decision;
            requestItem.$save().then(function(){
                $scope.assignStatus = "Request "+requestItem.status;
            }, function (error) {
                $scope.assignStatus = error;
            });

            $scope.displayRepairerAssign = "visibility: hidden";
            $scope.displayRequestDone = "visibility: hidden";
        }
    }
}