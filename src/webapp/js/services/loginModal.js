angular.module('myApp.loginModal', [])
    .controller('LoginModalCtrl', function ($scope, UsersApi) {

        this.cancel = $scope.$dismiss;

        this.submit = function (email, password) {
            var user = {
                username:email,
                password: password
            }
            UsersApi.login(user, function (user) {
                $scope.$close(user);
            });
        };

    })
    .service('loginModalService', function ($uibModal, $rootScope) {
        function assignCurrentUser(user) {
            $rootScope.currentUser = user;
            return user;
        }

        return function() {
            var instance = $uibModal.open({
                templateUrl: 'partials/loginModalTemplate.html',
                controller: 'LoginModalCtrl',
                controllerAs: 'LoginModalCtrl'
            })

            return instance.result.then(assignCurrentUser);
        };

    })
    .factory("UsersApi",function($rootScope, $http, $log){
        var loginInfo;
        return{
        login: function (user, callback) {
            $http.post('/api/users/signin',user)
                .then(function (response) {
                    callback(response);
                    loginInfo = response.data;
                }, function (error) {
                    $log.debug("error signing in");
                });
            },
            getLoginInfo: function (callback) {
                callback(loginInfo);
            }
        }

    })
