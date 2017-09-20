"use strict";

angular.module('myApp.courseModule',['ngResource'])
    .controller("CourseController",function ($scope,$rootScope,$uibModal,courseManager) {
        $scope.headline = "Courses";
        $scope.loading = false;
        $scope.coursesCount = 0;
        $scope.courses = {};

        $scope.init = function(){
        $scope.courses = courseManager.query();
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
                courseManager.remove({id: courseId}, function () {
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

        $scope.courses = courseManager.query();

        $scope.addCourse = function(){
            if(!$scope.course.name  === '') return;
            var course = new courseManager({ name: $scope.course.name, instructor: $scope.course.instructor,description: $scope.course.description, active: $scope.course.active });
            course.$save(function(){
                $scope.courses.push(course);
                $rootScope.modalInstance.close();
                $rootScope.$broadcast('coursesInitComplete');
                swal("Great", "Course has been successfully added", "success");
            });
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

        $scope.course = courseManager.get({id: courseId });


        $scope.updateCourse =function(){
            courseManager.update({id: courseId}, $scope.course, function(){
            $rootScope.modalInstance.close();
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
    .factory('courseManager', ['$resource', function($resource){
        return $resource('/courses/:id', null, {
            'update': { method:'PUT' }
        });
    }]);