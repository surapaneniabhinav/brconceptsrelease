"use strict";

angular.module('myApp.studentsAttendanceModule',['ngTable','ui.bootstrap'])
    .controller("StudentsAttendanceController",function ($scope,$rootScope,NgTableParams,$uibModal,$filter,attendanceManager,courseManager,UsersApi) {
        $scope.headline = "Students Attendance";
        $scope.loading = false;
        $scope.students = [];
        $scope.course = null;
        UsersApi.getLoginInfo(function (data) {
            $scope.user = data;
        });
        courseManager.getCourses(function (data) {
            $scope.courses = data;
        });

        $scope.getStudentsByCourse = function () {
            attendanceManager.getStudentsAttendance($scope.course,function (data) {
                $scope.students = data;
                angular.forEach($scope.students, function (student) {
                    console.log(student)
                    console.log($scope.courses)
                      angular.forEach($scope.courses,function (course) {
                          console.log(course._id)
                          if(student.course == course._id){
                              student.course = course.name;
                          }
                      })
                })
            })
        }
        $scope.$on('studentsAttendanceInitComplete', function (e, value) {
            $scope.getStudentsByCourse();
        });
        $scope.handleClickUpdateStudentAttendance = function(studentID){
            console.log(studentID);
            $rootScope.modalInstance = $uibModal.open({
                templateUrl : 'update-student-attendance-modal.html',
                controller : 'updateStudentAttendanceController',
                resolve : {
                    studentID : function(){
                        return studentID;
                    }
                }
            });
        };
    })
    .controller('updateStudentAttendanceController', function ($scope, $rootScope,attendanceManager, paymentsManager, studentManager,courseManager,studentID) {
        $scope.student = {};
        $scope.courses = [];
        attendanceManager.getStudentAttendanceById(studentID,function (data) {
            $scope.student = data;
        });
        courseManager.getCourses(function (data) {
            $scope.courses = data;
        });
        $scope.updateStudentAttendance =function(){
            if($scope.studentAttendanceUpdateForm.$invalid) {
                $scope.studentAttendanceUpdateForm.submitted = true;
                if ($scope.studentAttendanceUpdateForm.$invalid) {
                    swal("Error!", "Please fix the errors in the form", "error");
                    return;
                }
            }
            else{
                attendanceManager.updateStudentAttendance(studentID,$scope.student,function (data) {
                    $rootScope.modalInstance.close();
                    $rootScope.$broadcast('studentsAttendanceInitComplete');
                    swal("Great", "Student has been successfully Updated", "success");
                })
            }
        };
        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.student.studentName && $scope.student.course || '') !== '';
        };
    })
    .factory('attendanceManager', function ($http, $log) {
    return {
        getStudentsAttendance: function (courseId,callback) {
            $http.get('/api/attendance/getStudentsByCourse/'+courseId)
                .then(function (response) {
                    callback(response.data);
                },function (error) {
                    $log.debug("error retrieving students");
                });
        },
        getStudentAttendanceById: function (studentId,callback) {
            $http.get('/api/attendance/'+studentId)
                .then(function (response) {
                    callback(response.data);
                },function (error) {
                    $log.debug("error retrieving student");
                });
        },
        addStudentAttendance: function (student,callback) {
            $http.post('/api/attendance/',student)
                .then(function (response) {
                    callback(response);
                },function (error) {
                    $log.debug("error posting student");
                })
        },
        updateStudentAttendance: function (studentId,student,callback) {
            $http.put('/api/attendance/'+studentId,student)
                .then(function (response) {
                    callback(response);
                },function (error) {
                    $log.debug("error updating student");
                })
        },
    }
})