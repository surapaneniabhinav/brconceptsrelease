"use strict";

angular.module('myApp.expensesModule',['ngTable'])
    .controller("ExpensesController",function ($scope,$rootScope,NgTableParams,$uibModal,paymentsManager,UsersApi) {
        $scope.headline = "Expenses";

        UsersApi.getLoginInfo(function (data) {
            $scope.user = data;
        });

        $scope.dateChanged = function () {
            if($scope.expenseDate != null) {
                $scope.expenseDateChanged = $scope.expenseDate.toISOString();
                paymentsManager.getExpensesByDate($scope.expenseDateChanged,function (data) {
                    $scope.expensesByDate = data;
                    $scope.totalExpense = 0;
                    angular.forEach($scope.expensesByDate, function (payment) {
                        if (payment.type === "expense") {
                            $scope.totalExpense = $scope.totalExpense + payment.amount;
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
            paymentsManager.getAllExpenses(function (data) {
                $scope.expenses = data;
            })
            $scope.dateChanged();
        }

        $scope.init();

        $scope.$on('expensesInitComplete', function (e, value) {
            $scope.init();
        });

        $scope.handleClickAddExpense = function (size) {
            $rootScope.modalInstance = $uibModal.open({
                templateUrl: 'add-expense-modal.html',
                controller: 'addExpenseModalController',
                size: size
            })
        };

        $scope.handleClickUpdateExpense = function(paymentId){
            $rootScope.modalInstance = $uibModal.open({
                templateUrl : 'update-expense-modal.html',
                controller : 'updateExpenseModalController',
                resolve : {
                    paymentId : function(){
                        return paymentId;
                    }
                }
            });
        };

        $scope.deleteExpenseById = function (paymentId) {
            swal({
                title: "Are you sure?",
                text: "Are you sure you want to delete this Expense?",
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
    .controller("addExpenseModalController",function ($scope,$rootScope,paymentsManager) {
        $scope.payment = {
            name: null,
            paymentDate: null,
            description: null,
            amount: null,
            amountPaid: false,
            pending: false,
            type: "expense",
            income: false,
            expense: false
        }

        $scope.addExpense = function(){
            if($scope.expenseForm.$dirty) {
                if ($scope.expenseForm.$invalid) {
                    swal("Error!", "Please fix the errors in the Expense form", "error");
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
                type: "expense",
                income: false,
                expense: true
            }
            paymentsManager.addPayment(paymentObj,function (data) {
                $rootScope.modalInstance.close(data);
                $rootScope.$broadcast('expensesInitComplete');
                swal("Great", "Expense has been successfully added", "success");
            })

        }

        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.payment.name && $scope.payment.amount && $scope.payment.paymentDate || '') !== '';
        };
    })
    .controller('updateExpenseModalController', function ($scope, $rootScope,paymentsManager,paymentId) {
        $scope.payment = {};
        paymentsManager.getPaymentById(paymentId,function (data) {
            $scope.payment = data;
        });

        $scope.updateExpense =function(){
            if($scope.expenseUpdateForm.$dirty) {
                if ($scope.expenseUpdateForm.$invalid) {
                    swal("Error!", "Please fix the errors in the payment form", "error");
                    return;
                }
            }
            $scope.payment.updated_at = (new Date()).toISOString();
            paymentsManager.updatePayment(paymentId,$scope.payment,function (data) {
                $rootScope.modalInstance.close(data);
                $rootScope.$broadcast('expensesInitComplete');
                swal("Great", "Expense has been successfully Updated", "success");
            })
        };
        $scope.cancel = function () {
            $rootScope.modalInstance.dismiss('cancel');
        };

        $scope.isInputValid = function () {
            return ($scope.payment.name && $scope.payment.amount || '') !== '';
        };
    })