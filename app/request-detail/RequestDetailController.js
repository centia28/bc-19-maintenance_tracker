/**
 * Created by nina on 07/12/2016.
 */
'use strict';

angular
    .module('maintenancetrackerApp')
    .controller('RequestDetailController', RequestDetailController);
RequestDetailController.$inject = ['$scope','$firebaseObject','$routeParams'];

function RequestDetailController($scope,$firebaseObject,$routeParams) {
    var requestRef = firebase.database().ref().child('requests').child($routeParams.requestId);

    $scope.title = "Maintenance tracker";

    var requestList = $firebaseObject(requestRef);
    requestList.$loaded()
        .then(function (data) {
            $scope.request = data;
            if ($scope.request.username == $routeParams.username) {
                $scope.userStatus = "Yourself";
            } else {
                $scope.userStatus = $routeParams.username;
            }
        });
}