/**
 * Created by nina on 08/12/2016.
 */

'use strict';

angular
    .module('maintenancetrackerApp')
    .controller('RequestUpdateController', RequestUpdateController);
RequestUpdateController.$inject = ['$scope','$mdDialog','$location','$firebaseObject','$routeParams'];

function RequestUpdateController($scope,$mdDialog,$location,$firebaseObject,$routeParams) {
    var requestRef = firebase.database().ref().child('requests').child($routeParams.requestId);
    $scope.requestTypes = {selected:null, availableOptions:[
        { reqType: "Repair"},
        { reqType: "Maintenance"}
    ]};

    var requestItem = $firebaseObject(requestRef);
    requestItem.$loaded()
        .then(function (data) {
            $scope.requestTypes.selected = data.type;
            $scope.description = data.description;
        });

    $scope.updateRequest = function () {
        requestItem.$loaded()
            .then(function (data) {
                data.type = $scope.requestTypes.selected ;
                data.description = $scope.description;

                data.$save().then(function () {
                    //Redirect to the request details
                    $scope.goToRequestDetail();
                }, function (error) {
                    // Show message
                });
            });
    };
    $scope.goToRequestDetail = function () {
        $location.path($routeParams.username+'/requests/'+$routeParams.requestId);
    };
}
