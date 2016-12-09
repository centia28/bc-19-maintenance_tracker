/**
 * Created by nina on 06/12/2016.
 */
'use strict';

angular
    .module('maintenancetrackerApp')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$scope','$window','$mdDialog','$location','$firebaseArray'];
function LoginController ($scope,$window,$mdDialog,$location,$firebaseArray) {
    var usersRef = firebase.database().ref().child('users');
    var list = $firebaseArray(usersRef);

    if(window.sessionStorage.getItem("user") !== ""){
        list.$loaded()
            .then(function(data) {
                if (data.$getRecord($window.sessionStorage.getItem("user")) !== "") {
                    //The username exists
                    $location.path($window.sessionStorage.getItem("user")+'/requests/');
                }
            });

    }
    var LoginStatus;
    $scope.toolItemVisible = "visibility: hidden !important";

    $scope.loginUser = function () {
        $scope.dataLoading = true;
        if ($scope.username !== undefined && $scope.password !== undefined) {
            var list = $firebaseArray(usersRef);
            list.$loaded()
                .then(function(data) {
                    if (data.$getRecord($scope.username) !== null) {   //The username exists
                        if(data.$getRecord($scope.username).password == $scope.password){
                            $window.sessionStorage.setItem("user", $scope.username);
                            $location.path($scope.username+'/requests/');
                        } else {
                            LoginStatus = "Wrong password";
                            showAlert();
                        }
                    } else {
                        $location.path('/register');
                    }
                })
                .catch(function(error) {
                    LoginStatus = error;
                    showAlert();
                });
        }
    };

    function showAlert(ev){
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popopContainer')))
                .clickOutsideToClose(true)
                .title('Error')
                .textContent(LoginStatus)
                .ok('OK')
                .targetEvent(ev)
        );
    }
}
