"use strict";

angular.module('myApp.registerModule',[])
//         .controller("RegisterController",function ($scope,userApi) {
//             $scope.headline = "Register";
//             $scope.email = null;
//             $scope.password = null;
//             $scope.admin = false;
//
//             $scope.registerUser = function () {
//                 if($scope.registerForm.$dirty) {
//                     if ($scope.registerForm.$invalid) {
//                         swal("Error!", "Please fix the errors in the registration form", "error");
//                         return;
//                     }
//                 }
//                 var user = {
//                     username: $scope.email,
//                     password: $scope.password,
//                     admin: $scope.admin
//                 };
//                 userApi.signUp(user,function (data) {
//                     if(data.msg === "Username already exists."){
//                         swal("Error!", data.msg, "error");
//                     }
//                     else {
//                     swal("Great", data.msg, "success");
//                     }
//                 })
//
//             }
//
//
//         })
//         .factory('userApi',function ($http,$log) {
//             return{
//                 signUp: function (user, callback) {
//                     $http.post('/api/users/signup',user)
//                         .then(function (response) {
//                             callback(response.data);
//                         }, function (error) {
//                             $log.debug("error signing up");
//                         });
//                 }
//             }
//         })