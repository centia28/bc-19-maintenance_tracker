/**
 * Created by nina on 06/12/2016.
 */
'use strict';

angular
    .module('maintenancetrackerApp')
    .controller('RequestAddController', RequestAddController);

RequestAddController.$inject = ['$scope','$location','$firebaseArray','$routeParams','Upload'];
//var ref = new Firebase("https://maintenancetracker-6bc70.firebaseio.com");
var requestsRef = firebase.database().ref().child('requests');

function RequestAddController ($scope,$location,$firebaseArray,$routeParams,Upload) {
    $scope.title = "Maintenance tracker";
    
    //the add request function
    $scope.addNewRequest = function () {
        $scope.dataLoading = true;

        var requestList = $firebaseArray(requestsRef);
        requestList.$loaded()
            .then(function (data) {
                var reqData = {
                    type: $scope.request.reqType,
                    description: $scope.request.description,
                    status: "pending",
                    comments: "",
                    photoUrl: "",
                    username: $routeParams.username,
                    repairer: ""
                };
                //console.log($scope.file);
                data.$add(reqData).then(function (ref) {
                    var id = ref.key;
                    //$scope.status = data.$getRecord(id).status;
                    $scope.setImage(id);
                    //Redirect to list
                    $location.path($scope.username+'/requests/');
                }, function (error) {
                    $scope.status = error;
                    $scope.dataLoading = false;
                });
            })
            .catch(function(error) {
                $scope.status = error;
                $scope.dataLoading = false;
            });
    };
    
    //upload a photo
    $scope.setImage = function (reqId) {
        if ($scope.file !== undefined && $scope.file.size > 0) {
            //Store the image
            var imgRef = firebase.storage().ref('img/'+$scope.file.$ngfName);
            imgRef.put($scope.file).then(function () {
                //Update the request
                var requestList = $firebaseArray(requestsRef);
                requestList.$loaded()
                    .then(function (data) {
                        var reqIndex = data.$indexFor(reqId);
                        //console.log(data[reqIndex]);
                        data[reqIndex].photoUrl = $scope.file.$ngfName;
                        data.$save(reqIndex);
                    })
                    .catch(function(error) {
                        $scope.status = error;
                        $scope.dataLoading = false;
                    });
            });

            //Update the request
            /*var requestList = $firebaseArray(requestsRef);
            var reqIndex = requestList.$indexFor(reqid);
            requestList.$loaded()
                .then(function (data) {

                })
                .catch(function(error) {
                    $scope.status = error;
                    $scope.dataLoading = false;
                });
            /*Upload.upload({
                url: 'upload/url',
                data: {file: $scope.file, 'requestID': reqId}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });*/
        }
    }
}

