"use strict";

angular.module('myApp.paymentsModule',[])
    .controller("PaymentsController",function ($scope,$rootScope,$uibModal,paymentsManager,UsersApi) {
        $scope.headline = "Payments";

        UsersApi.getLoginInfo(function (data) {
          $scope.user = data;
        });

        $scope.dateChanged = function () {
            if($scope.paymentDate != null) {
                $scope.paymentDateChanged = $scope.paymentDate.toISOString();
                paymentsManager.getPaymentsByDate($scope.paymentDateChanged,function (data) {
                    $scope.paymentsByDate = data;
                    $scope.totalIncome = 0;
                    $scope.totalExpense = 0;
                    angular.forEach($scope.paymentsByDate, function (payment) {
                        if (payment.type === "income") {
                            $scope.totalIncome = $scope.totalIncome + payment.amount;
                        }
                        else if (payment.type === "expense") {
                            $scope.totalExpense = $scope.totalExpense + payment.amount;
                        }
                        else {
                            console.log('error')
                        }
                    })
                    $scope.balance = $scope.totalIncome - $scope.totalExpense;
                });
            }
            else {
                return
            }
        };

        $scope.init = function () {
            paymentsManager.getPayments(function (data) {
                $scope.payments = data;
            })
            $scope.dateChanged();
        }

        $scope.init();

        $scope.$on('paymentsInitComplete', function (e, value) {
            $scope.init();
        });

        $scope.handleClickAddPayment = function (size) {
            $rootScope.modalInstance = $uibModal.open({
                templateUrl: 'add-payment-modal.html',
                controller: 'addPaymentModalController',
                size: size
            })
        };

        $scope.handleClickUpdatePayment = function(paymentId){
            $rootScope.modalInstance = $uibModal.open({
                templateUrl : 'update-payment-modal.html',
                controller : 'updatePaymentModalController',
                resolve : {
                    paymentId : function(){
                        return paymentId;
                    }
                }
            });
        };

        $scope.deletePaymentById = function (paymentId) {
            swal({
                title: "Are you sure?",
                text: "Are you sure you want to delete this Payment?",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes, delete it!",
                confirmButtonColor: "#ec6c62"},function() {
                paymentsManager.deletePayment(paymentId,function (data) {
                    swal("Great", "Payment has been successfully Deleted", "success");
                    $scope.init();
                })
            })
        }

    })
    .controller("addPaymentModalController",function ($scope,$rootScope,paymentsManager) {
        $scope.payment = {
            name: null,
            paymentDate: null,
            description: null,
            amount: null,
            amountPaid: false,
            pending: false,
            type: "income",
            income: false,
            expense: false
        }

        $scope.addPayment = function(){
            if($scope.paymentForm.$dirty) {
                if ($scope.paymentForm.$invalid) {
                    swal("Error!", "Please fix the errors in the payment form", "error");
                    return;
                }
            }
            var regDate = $scope.payment.paymentDate;
            var paymentObj = {
                name: $scope.payment.name,
                paymentdate: regDate.toISOString(),
                description: $scope.payment.description,
                amount: $scope.payment.amount,
                paid: $scope.payment.amountPaid,
                pending: !$scope.payment.amountPaid,
                type: "income",
                income: true,
                expense: false
            }
            paymentsManager.addPayment(paymentObj,function (data) {
                $rootScope.modalInstance.close(data);
                $rootScope.$broadcast('paymentsInitComplete');
                swal("Great", "Payment has been successfully added", "success");
            })

        }

        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.payment.name && $scope.payment.amount && $scope.payment.paymentDate || '') !== '';
        };

    })
    .controller('updatePaymentModalController', function ($scope, $rootScope,paymentsManager,paymentId) {
        $scope.payment = {};
        paymentsManager.getPaymentById(paymentId,function (data) {
            $scope.payment = data;
        });

        $scope.updatePayment =function(){
            if($scope.paymentUpdateForm.$dirty) {
                $scope.paymentUpdateForm.submitted = true;
                if ($scope.paymentUpdateForm.$invalid) {
                    swal("Error!", "Please fix the errors in the payment form", "error");
                    return;
                }
            }
            $scope.payment.updated_at = (new Date()).toISOString();
            paymentsManager.updatePayment(paymentId,$scope.payment,function (data) {
                $rootScope.modalInstance.close(data);
                $rootScope.$broadcast('paymentsInitComplete');
                swal("Great", "Payment has been successfully Updated", "success");
            })
        };
        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.payment.name && $scope.payment.amount || '') !== '';
        };
    })
    .factory('paymentsManager',function ($http,$log) {
        return {
            getPayments: function (callback) {
                $http.get('/api/payments/')
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving payments");
                    });
            },
            getPaymentById: function (paymentId,callback) {
                $http.get('/api/payments/'+paymentId)
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving payment");
                    });
            },
            getPaymentsByDate: function (date,callback) {
                $http.get('/api/paymentsByDate/'+date)
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving students");
                    });
            },
            addPayment: function (payment,callback) {
                $http.post('/api/payments/',payment)
                    .then(function (response) {
                        callback(response);
                    },function (error) {
                        $log.debug("error posting payment");
                    })
            },
            updatePayment: function (paymentId,payment,callback) {
                $http.put('/api/payments/'+paymentId,payment)
                    .then(function (response) {
                        callback(response);
                    },function (error) {
                        $log.debug("error updating payment");
                    })
            },
            deletePayment: function (paymentId,callback) {
                $http.delete('/api/payments/'+paymentId)
                    .then(function (response) {
                        callback(response);
                    },function (error) {
                        $log.debug("error deleting payment");
                    })
            },
            getAllExpenses: function (callback) {
                $http.get('/api/paymentsByType/')
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving payments");
                    });
            },
            getExpensesByDate: function (date,callback) {
                $http.get('/api/paymentsByType/'+date)
                    .then(function (response) {
                        callback(response.data);
                    },function (error) {
                        $log.debug("error retrieving students");
                    });
            }

        }
    })
