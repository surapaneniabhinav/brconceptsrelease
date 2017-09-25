"use strict";

angular.module('myApp.header', ['ngTable','ui.bootstrap'])

    //
    // ============================= List All ===================================
    //
    .controller('headerNavBarhomeCtrl', function($scope,$state) {
        $scope.branchOffice = {};
        $scope.user = {};
        $scope.currentDate = function(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd;
            }
            if(mm<10){
                mm='0'+mm;
            }
            var today = dd+'/'+mm+'/'+yyyy;
            return today;
        };

        $scope.logout = function () {
            swal({
                title: "Are you sure?",
                text: "Are you sure you want to Log Out",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes, Log Out!",
                confirmButtonColor: "#ec6c62"},function() {
                $state.go('home');
                location.reload();
            })
            }

        /*$scope.userName = function() {
            $scope.user= userManager.getUser();
            if($scope.user != null) {
                return $scope.user.firstName+" ,"+ $scope.user.lastName;
            } else {
                return null;
            }
        }

        $scope.isAdmin = function() {
            var user = userManager.getUser();
            if(user != null) {
                return user.admin;
            } else {
                return false;
            }
        }
        $scope.updateHeader = function(){

            if($scope.user && $scope.user.branchOfficeId) {
                /!*branchOfficeManager.load($scope.user.branchOfficeId, function(data){
                    $scope.branchOffice = data;
                });*!/
                console.log('updating header');
                userManager.getCurrentUser(null, true);
            }
        };
        $scope.$on('UpdateHeader', function(){
            $scope.updateHeader();
        });*/
    });

