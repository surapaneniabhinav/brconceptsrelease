"use strict";

angular.module('myApp.studentModule',['ngTable'])
    .controller("StudentsController",function ($scope,$rootScope,NgTableParams,$uibModal,studentManager,UsersApi) {
        $scope.headline = "Students";
        $scope.loading = false;
        $scope.studentsCount = 0;
        $scope.students = {};
        UsersApi.getLoginInfo(function (data) {
            $scope.user = data;
        });

        $scope.loadAllStudents = function(){
            studentManager.getStudents(function (data) {
                $scope.students = data;
            });
        };

        $scope.dateChanged = function () {
            if($scope.regDate != null) {
                $scope.registrationDate = $scope.regDate.toISOString();
                studentManager.getStudentsByDate($scope.registrationDate,function (data) {
                    $scope.studentsByDate = data;
                    $scope.totalIncome = 0;
                    angular.forEach($scope.studentsByDate, function (student) {
                        if (student.amount) {
                            $scope.totalIncome = $scope.totalIncome + student.amount;
                        }
                        else {
                            console.log('error')
                        }
                    })
                });
            }
            else {
                return
            }
        };

        $scope.init = function () {
            $scope.loadAllStudents();
            $scope.dateChanged();
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
                studentManager.deleteStudent(studentId,function (data) {
                    swal("Great", "Student has been successfully Deleted", "success");
                    $scope.init();
                })
            })
        }
    })
    .controller("addStudentModalController",function ($scope,$rootScope,paymentsManager,studentManager) {
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

        $scope.addStudent = function(){
            if($scope.studentForm.$dirty) {
                if ($scope.studentForm.$invalid) {
                    swal("Error!", "Please fix the errors in the student form", "error");
                    return;
                }
            }
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
            var payment = {
                name: $scope.student.name + " " + $scope.student.course,
                paymentdate: regDate.toISOString(),
                description: "joining fee",
                amount: $scope.student.amount,
                paid: $scope.student.amountpaid,
                pending: !$scope.student.amountpaid,
                type: "income",
                income: true,
                expense: false
            }
            studentManager.addStudent(obj,function (data) {
                $rootScope.modalInstance.close(data);
                    $rootScope.$broadcast('studentsInitComplete');
                    swal("Great", "Student has been successfully added", "success");
                paymentsManager.addPayment(payment,function (data) {
                })
            })

        }

        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.student.name && $scope.student.course || '') !== '';
        };

    })
    .controller('updateStudentModalController', function ($scope, $rootScope, studentManager,studentID) {
        $scope.student = {};
        studentManager.getStudentById(studentID,function (data) {
            $scope.student = data;
        });

        $scope.updateStudent =function(){
            if($scope.studentUpdateForm.$dirty) {
                $scope.studentUpdateForm.submitted = true;
                if ($scope.studentUpdateForm.$invalid) {
                    swal("Error!", "Please fix the errors in the student form", "error");
                    return;
                }
            }
            studentManager.updateStudent(studentID,$scope.student,function (data) {
                $rootScope.modalInstance.close(data);
                $rootScope.$broadcast('studentsInitComplete');
                swal("Great", "Student has been successfully Updated", "success");
            })
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
    .factory('studentManager', function ($http, $log) {
        return {
            getStudents: function (callback) {
                $http.get('/api/students/')
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving students");
                    });
            },
            getStudentById: function (studentId,callback) {
                $http.get('/api/students/'+studentId)
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving student");
                    });
            },
            getStudentsByDate: function (date,callback) {
                $http.get('/api/studentsByDate/'+date)
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving students");
                    });
            },
            addStudent: function (student,callback) {
                $http.post('/api/students/',student)
                    .then(function (response) {
                        callback(response);
                    },function (error) {
                        $log.debug("error posting student");
                    })
            },
            updateStudent: function (studentId,student,callback) {
              $http.put('/api/students/'+studentId,student)
                  .then(function (response) {
                      callback(response);
                  },function (error) {
                      $log.debug("error updating student");
              })
            },
            deleteStudent: function (studentId,callback) {
                $http.delete('/api/students/'+studentId)
                    .then(function (response) {
                        callback(response);
                    },function (error) {
                        $log.debug("error deleting student");
                    })
            }
        }
    })