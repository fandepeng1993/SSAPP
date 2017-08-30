angular.module('ssapp.controllers')

//公告
.controller('noticeCtrl', function($scope, $state, $window, localStorageService, noticeService, commonService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    var userId = localStorageService.get('User').userId;
    var deptId = localStorageService.get('User').deptId;
    $scope.notices = [];
    noticeService.getNoticeByRootDId(deptId).then(function (data) {
      $scope.notices = data;
      if(data.length === 0) {
        $("#noneMsg").show();
      }
      commonService.hideLoading();
    });

    $scope.viewDetail = function (noticeId) {
      $state.go("tab.notice-find", {noticeId : noticeId});
    };
  });
})

//公告详情
.controller('noticeDetailCtrl', function($scope, $state, $stateParams, $window, localStorageService, noticeService, $ionicHistory, commonService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };
    var noticeId = $stateParams.noticeId;
    $scope.notice = {};
    noticeService.getNoticeById(noticeId).then(function (data) {
      $scope.notice = data;
      commonService.hideLoading();
    });
  });
});