/**
 * Created by nina on 09/12/2016.
 */
angular
    .module('maintenancetrackerApp')
    .controller('NotificationController', NotificationController);
NotificationController.$inject = ['$scope','$firebaseObject','$firebaseArray','$routeParams'];

function NotificationController($scope,$firebaseObject,$firebaseArray,$routeParams) {
    var notifRef = firebase.database().ref().child('notifications').child($routeParams.username);
    var list = $firebaseArray(notifRef);
    var notifs = [];
    
    list.$loaded().then(function (notifList) {
        var notif = {};
        angular.forEach(notifList,function (myNotif) {
            var reqRef = firebase.database().ref().child('requests').child(myNotif.requestId);
            var request = $firebaseObject(reqRef);
            request.$loaded().then(function (data) {
                notif.reqType = data.type;
                notif.decision=myNotif.requestStatus;
                notif.description = data.description;
                notif.requestId = myNotif.requestId;
                if(myNotif.status == ""){
                    notif.statusColor = "background-color: #00acc1";        //for unread notification the background color is green
                }
            });

            notifs.push(notif);
        })
    });

    $scope.notifications = notifs;
    
    $scope.updateStatus = function (reqId) {
        list.$loaded().then(function (notifList) {
            angular.forEach(notifList,function (myNotif) {
               if(myNotif.requestId=reqId && myNotif.status == ""){
                    //console.log(myNotif);
                   var updateRef = firebase.database().ref().child('notifications').child($routeParams.username).child(myNotif.$id);
                   var updateObj = $firebaseObject(updateRef);
                   updateObj.$loaded().then(function (data) {
                       data.status = "Read";
                       //console.log(updateObj);
                       data.$save().then(function () {
                        //I should update the color of the nofitication
                        }, function (error) {

                        });
                   })
               } 
            });
        });
    }
}