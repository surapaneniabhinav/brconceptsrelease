'use strict';

var myApp = angular.module('myApp',[
    'ui.router',
    'ngTable',
    'myApp.loginModal',
    'myApp.myMenu',
    'myApp.header',
    'myApp.courseModule',
    'myApp.studentModule',
    'myApp.staffModule',
    'myApp.registerModule',
    'myApp.paymentsModule',
    'myApp.expensesModule'
])

myApp.config(['$stateProvider','$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home',{
                url:'/',
                templateUrl: 'partials/home.html',
                    data: {
                requireLogin: true
              }
            })
            .state('courses',{
                url:'/courses.html',
                templateUrl: 'partials/courses.tpl.html',
                controller: 'CourseController',
                data: {
                    requireLogin: true
                }
            })
            .state('expenses',{
                url:'/expenses.html',
                templateUrl: 'partials/expenses.tpl.html',
                controller: 'ExpensesController',
                data: {
                    requireLogin: true
                }
            })
            .state('payments',{
                url:'/payments.html',
                templateUrl: 'partials/payments.tpl.html',
                controller: 'PaymentsController',
                data: {
                    requireLogin: true
                }
            })
            .state('register',{
                url:'/register.html',
                templateUrl: 'partials/register.tpl.html',
                controller: 'RegisterController',
                data: {
                    requireLogin: false
                }
            })
            .state('staff',{
                url:'/staff.html',
                templateUrl: 'partials/staff.tpl.html',
                controller: 'StaffController',
                data: {
                    requireLogin: true
                }
            })
            .state('students',{
                url:'/students.html',
                templateUrl: 'partials/students.tpl.html',
                controller: 'StudentsController',
                data: {
                    requireLogin: true
                }
            })

        $urlRouterProvider.otherwise( '/');
}]);

myApp.run(['$rootScope','$transitions','$state','loginModalService',function ($rootScope,$transitions,$state,loginModalService) {
    $transitions.onStart( {},function ($transitions) { 
        var newToState = $transitions.$to();
    var requireLogin = newToState.data.requireLogin;
    if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
        $transitions.onEnter({},function($transition$){
          return $q.reject()
        })
        loginModalService()
        .then(function () {
          return $state.go(newToState.name);
        })
        .catch(function () {
          return $state.go('home');
        });
    }
  });

}]);

myApp.config(function ($httpProvider) {

  $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
    var loginModal, $http, $state;
    $timeout(function () {
      loginModal = $injector.get('loginModalService');
      $http = $injector.get('$http');
      $state = $injector.get('$state');
    });
      
    return {
      responseError: function (rejection) {
       if (rejection.status !== 401) {
        return $q.reject(rejection);
        }

        var deferred = $q.defer();

        loginModal()
          .then(function () {
            deferred.resolve( $http(rejection.config) );
          })
          .catch(function () {
            $state.go('home');
            deferred.reject(rejection);
          });

        return deferred.promise;
      }
    };
  });

});