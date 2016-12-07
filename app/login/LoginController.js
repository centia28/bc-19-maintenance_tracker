/**
 * Created by nina on 06/12/2016.
 */
'use strict';

angular
    .module('maintenancetrackerApp')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$scope','$location','$firebaseArray'];
function LoginController ($scope,$location,$firebaseArray) {
    //var ref = new Firebase("https://maintenancetracker-6bc70.firebaseio.com");
    var usersRef = firebase.database().ref().child('users');

    $scope.title = "Maintenance tracker";
    $scope.LoginStatus = "";

    $scope.loginUser = function () {
        $scope.dataLoading = true;
        if ($scope.username !== undefined && $scope.password !== undefined) {
            var list = $firebaseArray(usersRef);
            list.$loaded()
                .then(function(data) {
                    if (data.$getRecord($scope.username) !== null) {   //The username exists
                        if(data.$getRecord($scope.username).password == $scope.password){
                            $location.path($scope.username+'/requests/');
                        } else {
                            $scope.LoginStatus = "Wrong password";
                            $scope.dataLoading = false;
                        }
                    } else {
                        $location.path('/register');
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
