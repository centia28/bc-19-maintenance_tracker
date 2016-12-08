/**
 * Created by nina on 06/12/2016.
 */
'use strict';

angular
    .module('maintenancetrackerApp')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$scope','$mdDialog','$location','$firebaseArray'];
function LoginController ($scope,$mdDialog,$location,$firebaseArray) {
    var usersRef = firebase.database().ref().child('users');
    var LoginStatus;

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
                            LoginStatus = "Wrong password"
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
    }

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
