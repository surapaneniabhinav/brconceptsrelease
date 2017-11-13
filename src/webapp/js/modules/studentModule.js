"use strict";

angular.module('myApp.studentModule',['ngTable','ui.bootstrap'])
    .controller("StudentsController",function ($scope,$rootScope,NgTableParams,$uibModal,$filter,studentManager,courseManager,UsersApi) {
        $scope.headline = "Students";
        $scope.loading = false;
        $scope.students = [];
        UsersApi.getLoginInfo(function (data) {
            $scope.user = data;
        });

        courseManager.getCourses(function (data) {
            $scope.courses = data;
        });

        $scope.loadAllStudents = function(){
            studentManager.getStudents(function (data) {
                $scope.students = data;
                angular.forEach(data, function (student) {
                    angular.forEach($scope.courses, function (course) {
                        if (student.course == course._id) {
                            student.course = course.name;
                        }
                    });
                })
                $scope.allStudentsTableParams = new NgTableParams({
                    count:30
                }, {
                    counts: [],
                    paginationMaxBlocks: 10,
                    paginationMinBlocks: 2,
                    dataset: $scope.students
                });
            })
        };

        $scope.dateChanged = function () {
            if($scope.regDate != null) {
                $scope.registrationDate = $scope.regDate.toISOString();
                studentManager.getStudentsByDate($scope.registrationDate,function (data) {
                    $scope.studentsByDate = data;
                    $scope.totalIncome = 0;
                    $scope.amountDue = 0;
                    angular.forEach($scope.studentsByDate, function (student) {
                        angular.forEach($scope.courses, function (course) {
                            if (student.course == course._id) {
                                student.course = course.name;
                            }
                        });
                        if (student.amount != 0) {
                            $scope.totalIncome = $scope.totalIncome + student.amount;
                            $scope.amountDue = $scope.amountDue + student.balance;
                        }
                        else if( student.balance != 0) {
                            $scope.amountDue = $scope.amountDue + student.balance;
                        }
                    })
                });
            }
            else {
                return
            }
        };

        $scope.getStudentsByRange = function () {
            if($scope.startDate != null || $scope.endDate != null) {
                $scope.startDate = $scope.startDate.toISOString();
                $scope.endDate = $scope.endDate.toISOString();
                studentManager.getStudentsByRange($scope.startDate,$scope.endDate,function (data) {
                    $scope.studentsByRange = data;
                    $scope.studentsByRange.totalIncome = 0;
                    $scope.studentsByRange.amountDue = 0;
                    angular.forEach($scope.studentsByRange, function (student) {
                        angular.forEach($scope.courses, function (course) {
                            if (student.course == course._id) {
                                student.course = course.name;
                            }
                        });
                        if (student.amount != 0) {
                            $scope.studentsByRange.totalIncome = $scope.studentsByRange.totalIncome + student.amount;
                            $scope.studentsByRange.amountDue = $scope.studentsByRange.amountDue + student.balance;
                        }
                        else if( student.balance != 0) {
                            $scope.studentsByRange.amountDue = $scope.studentsByRange.amountDue + student.balance;
                        }
                    })
                });
                $scope.startDate = null;
                $scope.endDate = null;
            }
            else {
                swal("Error!", "Please Check the Dates", "error");
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
    .controller("addStudentModalController",function ($scope,$rootScope,paymentsManager,courseManager,studentManager,attendanceManager) {
        $scope.student = {
            name: null,
            mobilenumber: null,
            course: null,
            registrationdate: null,
            description: null,
            email: null,
            amount: null,
            balance: null,
            amountpaid: false,
            active: true
        };
        courseManager.getCourses(function (data) {
            $scope.courses = data;
        });


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
                description: $scope.student.description,
                email: $scope.student.email,
                amount: $scope.student.amount,
                balance: $scope.student.balance,
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
            var studentAttendance = {
                studentName: $scope.student.name,
                course: $scope.student.course,
                actualDays: 0,
                presentDays: 0,
                absentDays: 0
            }
            studentManager.addStudent(obj,function (data) {
                $rootScope.modalInstance.close(data);
                $rootScope.$broadcast('studentsInitComplete');
                swal("Great", "Student has been successfully added", "success");
                attendanceManager.addStudentAttendance(studentAttendance,function (data) {
                })
                if(obj.amountpaid == true){
                    paymentsManager.addPayment(payment,function (data) {
                    })
                }
            })

        }

        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.student.name && $scope.student.course || '') !== '';
        };

    })
    .controller('updateStudentModalController', function ($scope, $rootScope, paymentsManager, studentManager,courseManager,attendanceManager,studentID) {
        $scope.student = {};
        $scope.courses = [];
        studentManager.getStudentById(studentID,function (data) {
            $scope.student = data;
            $scope.amountDue = $scope.student.amountpaid;
            $scope.balanceLeft = $scope.student.balance;
        });
        courseManager.getCourses(function (data) {
            $scope.courses = data;
        });
        $scope.updateStudent =function(){
            if($scope.studentUpdateForm.$dirty) {
                $scope.studentUpdateForm.submitted = true;
                if ($scope.studentUpdateForm.$invalid) {
                    swal("Error!", "Please fix the errors in the student form", "error");
                    return;
                }
            }
            if($scope.amountDue == false && $scope.balanceLeft != 0 && $scope.student.balance == 0 && $scope.student.amountpaid == true ){
                var payment = {
                    name: $scope.student.name + " " + $scope.student.course,
                    paymentdate: $scope.student.registrationdate,
                    description: "joining fee",
                    amount: $scope.student.amount,
                    paid: $scope.student.amountpaid,
                    pending: !$scope.student.amountpaid,
                    type: "income",
                    income: true,
                    expense: false
                }
                var studentAttendance = {
                    studentName: $scope.student.name,
                    course: $scope.student.course,
                    actualDays: 0,
                    presentDays: 0,
                    absentDays: 0
                }
                studentManager.updateStudent(studentID,$scope.student,function (data) {
                    $rootScope.modalInstance.close(data);
                    $rootScope.$broadcast('studentsInitComplete');
                    swal("Great", "Student has been successfully Updated", "success");
                    paymentsManager.addPayment(payment,function (data) {
                    })
                    attendanceManager.addStudentAttendance(studentAttendance,function (data) {
                    })
                })
            }else{
                var studentAttendance = {
                    studentName: $scope.student.name,
                    course: $scope.student.course,
                    actualDays: 0,
                    presentDays: 0,
                    absentDays: 0
                }
                studentManager.updateStudent(studentID,$scope.student,function (data) {
                    $rootScope.modalInstance.close(data);
                    $rootScope.$broadcast('studentsInitComplete');
                    swal("Great", "Student has been successfully Updated", "success");
                    attendanceManager.addStudentAttendance(studentAttendance,function (data) {
                    })
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
            getStudentsByRange: function (startDate,endDate,callback) {
                $http.get('/api/studentsByRange/'+startDate+'&'+endDate)
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving students");
                    });
            },
            getStudentsByCourse: function (courseId,callback) {
                $http.get('/api/students/studentsByCourse/'+courseId)
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving student");
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