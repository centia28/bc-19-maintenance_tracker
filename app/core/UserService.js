/**
 * Created by nina on 07/12/2016.
 */

'use strict';

angular
    .module('core')
    .factory('UserFactory', function ($firebaseObject) {
        return $firebaseObject.$extend({
           getUserByUsername: function (key) {
               return firebase.database().ref().child('users').child(key);
           }
        });
    });
