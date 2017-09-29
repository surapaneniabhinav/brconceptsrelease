"use strict";

angular.module('myApp.staffModule',[])
    .controller("StaffController",function ($scope,$rootScope,$uibModal,staffManager,UsersApi) {
        $scope.headline = "Staff";

        UsersApi.getLoginInfo(function (data) {
            $scope.user = data;
        });
        $scope.init = function () {
            staffManager.getStaff(function (data) {
                $scope.staffs = data;
            })
        }
        $scope.init();

        $scope.$on('staffsInitComplete', function (e, value) {
            $scope.init();
        });

        $scope.handleClickAddStaff = function (size) {
            $rootScope.modalInstance = $uibModal.open({
                templateUrl: 'add-staff-modal.html',
                controller: 'addStaffModalController',
                size: size
            })
        };

        $scope.handleClickUpdateStaff = function(staffId){
            $rootScope.modalInstance = $uibModal.open({
                templateUrl : 'update-staff-modal.html',
                controller : 'updateStaffModalController',
                resolve : {
                    staffId : function(){
                        return staffId;
                    }
                }
            });
        };

        $scope.deleteStaffById = function (staffId) {
            swal({
                title: "Are you sure?",
                text: "Are you sure you want to delete this Course?",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes, delete it!",
                confirmButtonColor: "#ec6c62"},function() {
                staffManager.deleteStaff(staffId, function () {
                    swal("Great", "Staff has been successfully Deleted", "success");
                    $scope.init();
                })
            })
        }
    })
    .controller('addStaffModalController',function ($scope,$rootScope,staffManager) {
        $scope.staff = {
            name: null,
            designation: null,
            course: null,
            address: null,
            mobilenumber: null,
            salary: null
        };

        $scope.addStaff = function(){
            if(!$scope.staff.name  === '') return;
            var staff = { name: $scope.staff.name,
                designation: $scope.staff.designation,
                course: $scope.staff.course,
                address: $scope.staff.address,
                mobilenumber: $scope.staff.mobilenumber,
                salary: $scope.staff.salary,
            };
            staffManager.addStaff(staff,function (data) {
                $rootScope.modalInstance.close(data);
                $rootScope.$broadcast('staffsInitComplete');
                swal("Great", "Staff has been successfully added", "success");
            })
        }

        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.staff.name && $scope.staff.designation || '') !== '';
        };


    })
    .controller('updateStaffModalController',function ($scope, $rootScope, staffManager, staffId) {
        $scope.satff = {};

        staffManager.getStaffById(staffId,function (data) {
            $scope.staff = data;
        });

        $scope.updateStaff =function(){
            staffManager.updateStaff(staffId,$scope.staff,function (data) {
                $rootScope.modalInstance.close(data);
                $rootScope.$broadcast('staffsInitComplete');
                swal("Great", "Staff has been successfully Updated", "success");
            })
        };
        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.staff.name && $scope.staff.designation || '') !== '';
        };

        $scope.resetCourse = function(){
            $scope.staff= {};
        };
    })
    .factory('staffManager',function ($http, $log) {
    return {
        getStaff: function (callback) {
            $http.get('/api/staffs/')
                .then(function (response) {
                    callback(response.data);
                },function (error) {
                    $log.debug("error retrieving staff");
                });
        },
        getStaffById: function (staffId,callback) {
            $http.get('/api/staffs/'+staffId)
                .then(function (response) {
                    callback(response.data);
                },function (error) {
                    $log.debug("error retrieving staff");
                });
        },
        addStaff: function (staff,callback) {
            $http.post('/api/staffs/',staff)
                .then(function (response) {
                    callback(response);
                },function (error) {
                    $log.debug("error posting staff");
                })
        },
        updateStaff: function (staffId,staff,callback) {
            $http.put('/api/staffs/'+staffId,staff)
                .then(function (response) {
                    callback(response);
                },function (error) {
                    $log.debug("error updating staff");
                })
        },
        deleteStaff: function (staffId,callback) {
            $http.delete('/api/staffs/'+staffId)
                .then(function (response) {
                    callback(response);
                },function (error) {
                    $log.debug("error deleting staff");
                })
        }
        }
    })