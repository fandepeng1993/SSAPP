angular.module('ssapp.controllers')

//工作简报
.controller('BriefingCtrl', function($scope, $state, $filter, commonService, TimeService, localStorageService, UserService, briefingService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.sellBriefloading = true;
    $scope.workBriefloading = true;
    $scope.visitBriefloading = true;
    dropDown('DateS', '<span class="show-icon">时间</span>', '请选择日期');
    dropDown('DateK', '<span class="show-icon">时间</span>', '请选择日期');
    dropDown('DateC', '<span class="show-icon">时间</span>', '请选择日期');
    //今日
    var beginDay = TimeService.beginDay();
    var endDay = TimeService.endDay();
    //本周
    var currentDate = new Date(); 
    var millisecond = 1000 * 60 * 60 * 24;  
    var beginWeek = TimeService.beginWeek();
    var endWeek = TimeService.endWeek();

    var cur7day = $filter("date")(new Date(currentDate.getTime() - (7 * millisecond)), "yyyy-MM-dd")+" 00:00:00"; 
    var cur15day = $filter("date")(new Date(currentDate.getTime() - (15 * millisecond)), "yyyy-MM-dd")+" 00:00:00"; 
    var cur30day = $filter("date")(new Date(currentDate.getTime() - (30 * millisecond)), "yyyy-MM-dd")+" 00:00:00";

    //上周
    var beginLastWeek = TimeService.beginLastWeek();
    var endLastWeek = TimeService.endLastWeek();

    //本月
    var beginMonth = TimeService.beginMonth();
    var endMonth = TimeService.endMonth();

    //上月
    var beginLastMonth = TimeService.beginLastMonth();
    var endLastMonth = TimeService.endLastMonth();

    var getCurrentUser = function (userId) {
      UserService.getUserById(userId).then(function (data) {
        $scope.user = data;
      });
    }

    var curUserId = localStorageService.get("User").userId;
    var curUserName = localStorageService.get("User").userName;
    var selectUserId = curUserId;
    getCurrentUser(selectUserId);
    UserService.getUsersByMenuUrl(curUserId, "manage/briefingMgr/briefingMgr.html").then(function (data) {
      $scope.users = data;
      dropDown('PersonS', '<span class="show-icon">切换</span>', '请选择人员');
      $("#PersonS_dummy").val(curUserName);
    });

    var num = 0;
    var initWorkBrief = function (userId, fromdate, enddate) {
      $scope.workBriefloading = true;
      briefingService.workBriefingByPri(userId, fromdate, enddate).then(function (data) {
        $scope.workBriefing = data;
        $scope.workBriefloading = false;
        num++;
        if(num >= 3) commonService.hideLoading();
      });
    }

    var initSellBrief = function (userId, fromdate) {
      $scope.sellBriefloading = true;
      briefingService.sellBriefingByPri(userId, fromdate).then(function (data) {
        $scope.sellBriefing = data;
        $scope.sellBriefloading = false;
        num++;
        if(num >= 3) commonService.hideLoading();
      });
    }

    var initVisitBrief = function (userId, fromdate) {
      briefingService.visitBriefingByPri(userId, fromdate).then(function (data) {

      });
    }

    var initVisitCus = function (userId, fromdate) {
      $scope.visitBriefloading = true;
      briefingService.noVisitCusByPri(userId, fromdate).then(function (data) {
        $scope.noVisitCus = data;
        $scope.visitBriefloading = false;
        num++;
        if(num >= 3) commonService.hideLoading();
      });
    }

    initSellBrief(curUserId, beginWeek);
    initWorkBrief(curUserId, beginWeek, endWeek);
    initVisitCus(curUserId, cur7day);

    //判断是否改变了员工
    $("#PersonS").on("change", function() {
      selectUserId = $("#PersonS").val();
      getCurrentUser(selectUserId);
      initSellBrief(selectUserId, beginWeek);
      initWorkBrief(selectUserId, beginWeek, endWeek);
      initVisitCus(selectUserId, cur7day);
    });
    //判断是否改变了客户概况
    $("#DateK").on("change", function() {
      if($("#DateK").val() === "本周") {
        initSellBrief(selectUserId, beginWeek);
      } else if($("#DateK").val() === "本月") {
        initSellBrief(selectUserId, beginMonth);
      }
    });

    //判断是否改变了工作简报
    $("#DateS").on("change", function() {
      if($("#DateS").val() === "本周") {
        initWorkBrief(selectUserId, beginWeek, endWeek);
      } else if($("#DateS").val() === "本月") {
        initWorkBrief(selectUserId, beginMonth, endMonth);
      } else if($("#DateS").val() === "上周") {
        initWorkBrief(selectUserId, beginLastWeek, endLastWeek);
      } else if($("#DateS").val() === "上月") {
        initWorkBrief(selectUserId, beginLastMonth, endLastMonth);
      }
    });

    //判断是否改变了待拜访客户
    $("#DateC").on("change", function() {
      if($("#DateC").val() === "最近7天") {
        initVisitCus(selectUserId, cur7day);
      } else if($("#DateC").val() === "最近15天") {
        initVisitCus(selectUserId, cur15day);
      } else if($("#DateC").val() === "最近30天") {
        initVisitCus(selectUserId, cur30day);
      }
    });

    $scope.dayNumFromNow = function (date) {
      var visitDate = TimeService.strToDate(date);
      var now = new Date();
      return Math.floor((now.getTime() - visitDate.getTime())/millisecond);
    };
    $scope.showCustomer = function (id) {
      $state.go("tab.manage-index", {customerId:id});
    };
  });
});