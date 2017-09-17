'use strict';

var myApp = angular.module('myApp',[
    'ui.router',
    'ngTable',
    'myApp.myMenu',
    'myApp.header',
    'myApp.courseModule'
])

myApp.config(['$stateProvider','$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home',{
                url:'/',
                templateUrl: 'partials/home.html'
            })
            .state('courses',{
                url:'/courses',
                templateUrl: 'partials/courses.tpl.html',
                controller: 'CourseController'
            });

        $urlRouterProvider.otherwise( '/');
}]);
