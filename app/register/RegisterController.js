/**
 * Created by nina on 06/12/2016.
 */
'use strict';

angular
    .module('maintenancetrackerApp')
    .controller('RegisterController', RegisterController);

RegisterController.$inject = ['$scope','$location','$firebaseObject','$firebaseArray'];
function RegisterController ($scope,$location,$firebaseObject,$firebaseArray) {
    var ref = new Firebase("https://maintenancetracker-6bc70.firebaseio.com");
    var usersRef = firebase.database().ref().child('users');
    var fireObj = $firebaseObject(ref);

    $scope.title = "Maintenance tracker";
    $scope.LoginStatus = "";

    $scope.register = function () {
        $scope.dataLoading = true;
        if ($scope.user !== undefined) {
            var list = $firebaseArray(usersRef);
            list.$loaded()
                .then(function(data) {
                    if (data.$getRecord($scope.user.username) == null) {
                        var userData = {
                            username: $scope.user.username,
                            password: $scope.user.password,
                            role: "staff",
                            firstname: $scope.user.firstname,
                            lastname: $scope.user.lastname,
                            contact: "",
                            email: ""
                        };
                        usersRef.child($scope.user.username).set(userData).then(function (ref) {
                            $scope.LoginStatus = "Registration successful";
                            $location.path('/login')
                        }, function (error) {
                            $scope.LoginStatus = error;
                            $scope.dataLoading = false;
                        });
                    }
                })
                .catch(function(error) {
                    $scope.LoginStatus = error;
                    $scope.dataLoading = false;
                });
        } else {
            $scope.dataLoading = false;
        }
    }
}