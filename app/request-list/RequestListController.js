/**
 * Created by nina on 06/12/2016.
 */
'use strict';
angular
    .module('maintenancetrackerApp')
    .controller('RequestListController', RequestListController);
RequestListController.$inject = ['$scope','$location','$firebaseObject','$firebaseArray','$routeParams','$log'];

function RequestListController ($scope,$location,$firebaseObject,$firebaseArray,$routeParams,$log) {
    var query,query2;
    $scope.username = $routeParams.username;
    //console.log($routeParams.scope);

    //Load the user and filter the request on the username
    var usersRef = firebase.database().ref().child('users').child($routeParams.username);
    var requestRef = firebase.database().ref().child('requests');
    var user = $firebaseObject(usersRef);
    var list = $firebaseArray(requestRef);

    user.$loaded()
        .then(function(data) {
            //Load the requests
            list.$loaded().then(function (reqData) {
                if(data.role !== "admin"){
                    var opt = [];
                    angular.forEach(reqData,function (item) {
                        if(item.username == $routeParams.username || item.repairer == $routeParams.username){
                            //console.log(item);
                            opt.push(item);
                        }
                    })
                    $scope.requests = opt;
                } else{
                    //console.log(reqData);
                    $scope.requests = reqData;
                }
            });
        });



    $scope.goToRequest = function(reqId){
        $location.path($scope.username+'/requests/'+reqId);
    };

    $scope.showAdd = function(){
        $location.path($scope.username+'/requestadd');
    }

}