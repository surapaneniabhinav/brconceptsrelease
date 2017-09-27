"use strict";

angular.module('myApp.courseModule',[])
    .controller("CourseController",function ($scope,$rootScope,$uibModal,courseManager) {
        $scope.headline = "Courses";
        $scope.loading = false;
        $scope.coursesCount = 0;
        $scope.courses = {};

        $scope.init = function(){
            courseManager.getCourses(function (data) {
                $scope.courses = data;
            });
        };
        $scope.init();

        $scope.$on('coursesInitComplete', function (e, value) {
            $scope.init();
        });

        $scope.handleClickAddCourse = function (size) {
            $rootScope.modalInstance = $uibModal.open({
                templateUrl: 'add-Course-modal.html',
                controller: 'addCourseModalController',
                size: size
            })
        };

        $scope.handleClickUpdateCourse = function(courseID){
            $rootScope.modalInstance = $uibModal.open({
                templateUrl : 'update-course-modal.html',
                controller : 'updateCourseModalController',
                resolve : {
                    courseId : function(){
                        return courseID;
                    }
                }
            });
        };
        
        $scope.deleteCourseById = function (courseId) {
            swal({
                title: "Are you sure?",
                text: "Are you sure you want to delete this Course?",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes, delete it!",
                confirmButtonColor: "#ec6c62"},function() {
                courseManager.deleteCourse(courseId, function () {
                    swal("Great", "Course has been successfully Deleted", "success");
                    $scope.init();
                })
            })
        }
    })
    .controller("addCourseModalController",function ($scope,$rootScope,courseManager) {
        $scope.course = {
            name: null,
            instructor: null,
            description: null,
            active: false
        };

        $scope.addCourse = function(){
            if(!$scope.course.name  === '') return;
            var course = { name: $scope.course.name, instructor: $scope.course.instructor,description: $scope.course.description, active: $scope.course.active };
            courseManager.addCourse(course,function (data) {
                $rootScope.modalInstance.close(data);
                $rootScope.$broadcast('coursesInitComplete');
                swal("Great", "Course has been successfully added", "success");
            })
        }

        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.course.name && $scope.course.instructor || '') !== '';
        };

    })
    .controller('updateCourseModalController', function ($scope, $rootScope, courseManager, courseId) {
        $scope.course = {};

        courseManager.getCourseById(courseId,function (data) {
            $scope.course = data;
        });

        $scope.updateCourse =function(){
            courseManager.updateCourse(courseId,$scope.course,function (data) {
                $rootScope.modalInstance.close(data);
                $rootScope.$broadcast('coursesInitComplete');
                swal("Great", "Course has been successfully Updated", "success");
            })
        };
        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.course.name && $scope.course.instructor || '') !== '';
        };

        $scope.resetCourse = function(){
            $scope.course= {};
        };
    })
    .factory('courseManager',function ($http, $log) {
        return {
            getCourses: function (callback) {
                $http.get('/api/courses/')
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving courses");
                    });
            },
            getCourseById: function (courseId,callback) {
                $http.get('/api/courses/'+courseId)
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving course");
                    });
            },
            addCourse: function (course,callback) {
                $http.post('/api/courses/',course)
                    .then(function (response) {
                        callback(response);
                    },function (error) {
                        $log.debug("error posting Course");
                    })
            },
            updateCourse: function (courseId,course,callback) {
                $http.put('/api/courses/'+courseId,course)
                    .then(function (response) {
                        callback(response);
                    },function (error) {
                        $log.debug("error updating course");
                    })
            },
            deleteCourse: function (courseId,callback) {
                $http.delete('/api/courses/'+courseId)
                    .then(function (response) {
                        callback(response);
                    },function (error) {
                        $log.debug("error deleting course");
                    })
            }
        }
    })