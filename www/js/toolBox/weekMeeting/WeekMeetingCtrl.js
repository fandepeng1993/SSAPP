angular.module('ssapp.controllers')

//周例会
.controller('ZlhCtrl', function($scope, $state, $stateParams, $compile, commonService, TimeService, weekMeetingService, localStorageService, alertService){
  var uid = $stateParams.uid;
  var week = $stateParams.week;
  if(uid != 0) { commonService.showLoading(); }
  //$scope.$on($state.current.name + "-init", function() {
    var userId = localStorageService.get("User").userId;
    $scope.year = "";
    $scope.month = "";
    $scope.isAdd = true;
    $scope.titles = [];

    //若不是为了添加而登进来，则根据用户Id和周数取数据，填充数据
    if(uid != 0) {
      //先限制添加时要填的输入框为readonly
      $scope.isAdd = false;
      weekMeetingService.selByUIdAndWeek(userId, week).then(function (data) {
        $scope.weekMeetingObjs = data;
        var arr = data[0].monthWeek.split("|");
        $scope.year = arr[0];
        $scope.month = arr[1];
        $("#week_dummy").val(arr[2]);
        for(var i=0; i<$scope.weekMeetingObjs.length; i++) {
          $scope.titles.push($scope.weekMeetingObjs[i].title + "<span style=\"color:#e1f3ff!important;font-size:12px;\">（提议者：" + $scope.weekMeetingObjs[i].creator.userName + "，提议日期：" + 
                              $scope.weekMeetingObjs[i].createdate.substring(0, 10) + "）</span>");
        }
        commonService.hideLoading();
      });
    } else {
      $scope.titles.push("");
      var currentDate = new Date();
      var millisecond = 1000 * 60 * 60 * 24;
      var minusDay = currentDate.getDay() != 0 ? currentDate.getDay()-1 : 6;
      var monday = new Date(currentDate.getTime() - (minusDay * millisecond));

      $scope.year = monday.getFullYear();
      $scope.month = monday.getMonth() + 1;
      dropDown('week', '<span class="show-icon">第几周</span>', ' ');
      $("#week_dummy").val(TimeService.monthWeek(monday));
      $("#week").val(TimeService.monthWeek(monday));
    }

    $scope.addWeekMeeting = function () {
      var weekMeetings = [];
      if($("#week").val() === "") {
        alertService.showAlert($scope, "请选择第几周！", true, "warning", null);
        return;
      }
      
      for(var i=0; i<$scope.titles.length; i++) {
        //构建对象填充对象数组，以便进行批量提交。
        var weekMeetingObj = {
          'creator': {'userId': userId},
          'status' : 0
        };
        weekMeetingObj.monthWeek = $scope.year + "|" + $scope.month + "|" + $("#week").val();
        weekMeetingObj.title = $scope.titles[i];
        weekMeetings.push(weekMeetingObj);
      }
      
      weekMeetingService.postWeekMeeting(weekMeetings).then(function (data) {
        if (data.status === 1) {
          alertService.showAlert($scope, "周例会议题提交成功!", true, "success", 'zlh-find');
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
        }
      });
    }

    $scope.remove = function (index) {
      $scope.titles.splice(index, 1);
    }

    $scope.add = function () {
      $scope.titles.push("");
    }
  //});
})

//周例会列表查看
.controller('ZlhFindCtrl', function($scope, $state, $timeout, weekMeetingService, localStorageService, commonService, $cordovaToast) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.loading = true;
    $scope.hasDate = true;
    var userId = localStorageService.get("User").userId;
    $scope.getData = function () {
      weekMeetingService.selectByPriLazy(userId, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
        $scope.hasDate = true;
        vm.messages = vm.messages.concat(data);
        $scope.loading = false;
        commonService.hideLoading();
        if(vm.messages.length === 0) {
          $scope.hasDate = false;
        }
        vm.finishInit = true;
        if (data.length === 0) vm.moredata = true;
        if (data.length === 0 && data.length > 13) {
          $cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
            // success  
          }, function (error) {  
            // error  
          });
          vm.moredata = true;
        }
        //成功2秒后广播
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageNo ++;
        }, 2000);
      });
    };

    var vm = $scope.vm = commonService.getWaterFallVM($scope, $scope.getData, "loading");
    vm.init();

    $scope.addWeekMeeting = function () {
      $state.go("zlh", {uid:0,week:''});
    }

    $scope.viewWeekMeeting = function (uid, week) {
      $state.go("zlh", {uid:uid,week:week});
    }

    $scope.formatTime = function (datetime) {
      var arr = datetime.split("|");
      return arr[0] + "年" + arr[1] + "月 第" + arr[2] + "周";
    }
  });
});