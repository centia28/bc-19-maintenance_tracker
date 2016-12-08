/**
 * Created by nina on 07/12/2016.
 */
'use strict';

angular
    .module('maintenancetrackerApp')
    .controller('RequestDetailController', RequestDetailController);
RequestDetailController.$inject = ['$scope','$mdDialog','$location','$firebaseObject','$firebaseArray','$routeParams'];

function RequestDetailController($scope,$mdDialog,$location,$firebaseObject,$firebaseArray,$routeParams) {
    var requestRef = firebase.database().ref().child('requests').child($routeParams.requestId);
    var usersRef = firebase.database().ref().child('users');
    var list = $firebaseArray(usersRef);

    $scope.userConnected = $routeParams.username;

    var requestItem = $firebaseObject(requestRef);
    requestItem.$loaded()
        .then(function (data) {
            $scope.request = data;
            if (data.username == $routeParams.username) {
                $scope.userStatus = "Yourself";
            } else {
                list.$loaded()
                    .then(function(userdata) {
                        var user = userdata.$getRecord(data.username);
                        $scope.userStatus = user.firstname + " " + user.lastname;
                    });
            }
        });

    //we show repairer assignment only for admin
    //we show done button to repairer assigned the request

    $scope.displayRepairerAssign = "visibility: hidden";
    $scope.displayRequestDone = "visibility: hidden";
    $scope.displayComments = "visibility: hidden";
    $scope.displayEdit = "visibility: hidden";
    list.$loaded()
        .then(function(data) {
            var repairerUser = data.$getRecord(requestItem.repairer);
            var connectedUser = data.$getRecord($routeParams.username);
            if (repairerUser !== null) {   //The username exists
                //gest the repairer display name
                $scope.repairerDisplayName = repairerUser.firstname + " " + repairerUser.lastname;
            }
            if(connectedUser !== null){

                if (connectedUser.role == "admin") {
                    $scope.displayRepairerAssign = "visibility: visible";
                    //console.log($scope.request);
                    if(requestItem.status == "resolved") {
                        $scope.displayRepairerAssign = "visibility: hidden";
                        $scope.displayComments = "visibility: visible";
                    } else if(requestItem.status == "rejected" || requestItem.status == "approved"){
                        $scope.displayComments = "visibility: visible";
                        $scope.displayRepairerAssign = "visibility: hidden";
                    } else{
                        $scope.displayComments = "visibility: hidden";
                    }
                    //populate select
                    //console.log(data);
                    populateRepairerSelect(data);
                }
                //Only the user who added the request can edit it, and only pending request can be edited
                if(connectedUser.username == requestItem.username) {
                    if(requestItem.status == "pending") {
                        $scope.displayEdit = "visibility: visible";
                    }
                } else {
                    $scope.displayEdit = "visibility: hidden";
                }
                if(requestItem.repairer == $routeParams.username) {
                    $scope.displayRequestDone = "visibility: visible";
                    if(requestItem.status == "resolved") {
                        $scope.doneBtnDisplay = "Undo";
                    } else if(requestItem.status == "rejected" || requestItem.status == "approved"){
                        $scope.displayRequestDone = "visibility: hidden";
                    } else {
                        $scope.doneBtnDisplay = "Done";
                    }
                }
            }


        });
    function populateRepairerSelect(userList) {
        $scope.repairers = {selected: null,availableOptions: []};
        var opt = [];
        angular.forEach(userList, function(user){
            if(user.username !== null && user.username !== undefined){
                if (requestItem.repairer !== "" && requestItem.repairer !== null && requestItem.repairer !== undefined) {
                    if (user.username !== requestItem.repairer) {
                        var obj = {};
                        obj.username = user.username;
                        obj.diplayName = user.firstname + " " + user.lastname;
                        opt.push(obj);
                    }
                } else {
                    var obj = {};
                    obj.username = user.username;
                    obj.diplayName = user.firstname + " " + user.lastname;
                    opt.push(obj);
                }
            }
        });
        //console.log($scope.repairers);
        $scope.repairers.availableOptions = opt;
        //console.log(opt,$scope.repairers);
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
        var connectedUser = list.$getRecord($routeParams.username);
        if($scope.request.status == "resolved") {
            requestItem.status = "assigned";
            $scope.doneBtnDisplay = "Done";
            if (connectedUser.role == "admin") {
                $scope.displayComments = "visibility: hidden";
            }
        } else {
            requestItem.status = "resolved";
            $scope.doneBtnDisplay = "Undo";
            if (connectedUser.role == "admin") {
                $scope.displayComments = "visibility: visible";
            }
        }
        requestItem.$save().then(function(){
            $scope.assignStatus = "Request "+requestItem.status;
        }, function (error) {
            $scope.assignStatus = error;
        })
    };

    $scope.approveRequest = function () {
        processApproval("approved","")
    };

    $scope.showAdd = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'request-detail/addComment.template.html',
            targetEvent: ev,
        })
            .then(function(answer) {
                processApproval("rejected",answer);
            }, function() {
                $scope.alert = 'You cancelled the dialog.';
            });
    };

    $scope.goToRequests = function () {
        $location.path($scope.userConnected+'/requests');
    };

    $scope.goToUpdateRequest = function () {
        $location.path($scope.userConnected+'/requests/'+$routeParams.requestId+"/edit");
    };

    //If rejected, comment is required
    //If decision made, can't assign or update to done
    function processApproval(decision,comment){
        console.log(comment);
        if(decision == "rejected" && comment == "" ){
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
    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    };
}