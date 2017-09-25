"use strict";

angular.module('myApp.studentModule',['ngResource'])
    .controller("StudentsController",function ($scope,$rootScope,$uibModal,studentManager,courseManager) {
        $scope.headline = "Students";
        $scope.loading = false;
        $scope.studentsCount = 0;
        $scope.students = {};

        $scope.init = function(){
            $scope.students = studentManager.query();
        };
        $scope.init();

        $scope.$on('studentsInitComplete', function (e, value) {
            $scope.init();
        });

        $scope.handleClickAddStudent = function (size) {
            $rootScope.modalInstance = $uibModal.open({
                templateUrl: 'add-Student-modal.html',
                controller: 'addStudentModalController',
                size: size
            })
        };

        $scope.handleClickUpdateStudent = function(studentID){
            $rootScope.modalInstance = $uibModal.open({
                templateUrl : 'update-student-modal.html',
                controller : 'updateStudentModalController',
                resolve : {
                    studentID : function(){
                        return studentID;
                    }
                }
            });
        };

        $scope.deleteStudentById = function (studentId) {
            swal({
                title: "Are you sure?",
                text: "Are you sure you want to delete this Student?",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes, delete it!",
                confirmButtonColor: "#ec6c62"},function() {
                studentManager.remove({id: studentId}, function () {
                    swal("Great", "Student has been successfully Deleted", "success");
                    $scope.init();
                })
            })
        }
    })
    .controller("addStudentModalController",function ($scope,$rootScope,studentManager,courseManager) {
        $scope.student = {
            name: null,
            mobilenumber: null,
            course: null,
            registrationdate: null,
            email: null,
            amount: null,
            amountpaid: false,
            active: true
        };

        $scope.students = studentManager.query();

        $scope.addStudent = function(){
            if($scope.studentForm.$dirty) {
                $scope.studentForm.submitted = true;
                if ($scope.studentForm.$invalid) {
                    swal("Error!", "Please fix the errors in the student form", "error");
                    return;
                }
            }
            else {
                var regDate = $scope.student.registrationdate;
                var obj = {
                    name: $scope.student.name,
                    course: $scope.student.course,
                    mobilenumber: $scope.student.mobilenumber,
                    registrationdate: regDate.toISOString(),
                    email: $scope.student.email,
                    amount: $scope.student.amount,
                    amountpaid: $scope.student.amountpaid,
                    active: $scope.student.active
                };
                var student = new studentManager(obj);
                student.$save(function(){
                    $scope.students.push(student);
                    $rootScope.modalInstance.close();
                    $rootScope.$broadcast('studentsInitComplete');
                    swal("Great", "Student has been successfully added", "success");
                });
            }
        }

        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.student.name && $scope.student.course || '') !== '';
        };

    })
    .controller('updateStudentModalController', function ($scope, $rootScope, studentManager, studentID) {
        $scope.student = {};

        $scope.student = studentManager.get({id: studentID });


        $scope.updateStudent =function(){
            if($scope.studentUpdateForm.$dirty) {
                $scope.studentUpdateForm.submitted = true;
                if ($scope.studentUpdateForm.$invalid) {
                    swal("Error!", "Please fix the errors in the student form", "error");
                    return;
                }
            }
            else {
                studentManager.update({id: studentID}, $scope.student, function () {
                    $rootScope.modalInstance.close();
                    $rootScope.$broadcast('studentsInitComplete');
                    swal("Great", "Student has been successfully Updated", "success");
                })
            }
        };
        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.student.name && $scope.student.course || '') !== '';
        };

        $scope.resetCourse = function(){
            $scope.student= {};
        };
    })
    .factory('studentManager', ['$resource', function($resource){
        return $resource('/api/students/:id', null, {
            'update': { method:'PUT' }
        });
    }]);