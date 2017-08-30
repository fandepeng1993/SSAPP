angular.module('ssapp.controllers')
.controller('useRmangerCtrl', function($scope, $stateParams,UserService,commonService,$ionicHistory) {
  var userId = $stateParams.userId;
  $scope.user = {};
  UserService.getUserById(userId).then(function (data) {
    $scope.user = data;
  });

  $scope.phoneTo = function (phoneNum) {
    commonService.phoneTo(phoneNum);
  };

  $scope.back = function () {
    $ionicHistory.goBack();
  };

  $scope.mailTo = function (email) {
    window.location.href = "mailto:" + email;
  };
            
  $scope.smsTo = function (sms) {
    window.location.href = "sms:" + sms;
  };
});