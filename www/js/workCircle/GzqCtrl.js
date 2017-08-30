angular.module('ssapp.controllers')

//工作圈
.controller('GzqCtrl', function($scope) {
 $(function () {
    P_login = {};
    P_login.openLogin = function(){
        $('.chakan').click(function(){
            $('.rwgl-bg').show();
            $('.rwgl-tan').show();
        });
    };
    P_login.closeLogin = function(){
        $('#close').click(function(){
            $('.rwgl-bg').hide();
            $('.rwgl-tan').hide();
        });
    };
    P_login.run = function () {
        this.closeLogin();
        this.openLogin();
    };
    P_login.run();

    });
})

//工作圈
.controller('workCircleCtrl', function($scope, $ionicLoading, $rootScope, $window, $timeout, $state, localStorageService, dReportService, wReportService, mReportService, dwReportService, wPlanService, $ionicSlideBoxDelegate, commonService, $cordovaToast) {
  $scope.currentTabIndex = 2;
  if($rootScope.currentGzqIndex != null && $rootScope.currentGzqIndex != -1) {
    $scope.currentTabIndex = $rootScope.currentGzqIndex;
    //$ionicSlideBoxDelegate.slide($rootScope.currentGzqIndex);
    $rootScope.currentGzqIndex = -1;
  } else {
    $rootScope.currentGzqIndex = -1;
  }

  //commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
    var userId = localStorageService.get('User').userId;
    $scope.deptName = localStorageService.get('User').deptName;

    var arr = new Array(false, false, false, false, false);
    var num = 0;
    var addMessages = function (vm, loadingId, data, index) {
    if(vm.messages === null) vm.messages = [];
      vm.messages = vm.messages.concat(data);
      $("#" + loadingId).hide();
      vm.finishInit = true;
      num++;
      if(num === 5) commonService.hideLoading();
      if(data.length === 0) {
        vm.moredata = true;
      }
      if (data.length === 0 && vm.messages.length > 6) {
        $cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
          // success  
        }, function (error) {  
          // error  
        });
      } else if(data.length > 5) {
        //console.log(index + "---" + data.length);
        arr[index] = true;
      }
      //成功2秒后广播
      $timeout(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.pageNo ++;
      }, 2000);
    };

    $("#dReportLoading").hide();
    $scope.getDReportData = function () {
      dReportService.getReportsInWorkCirLazy(userId, dReportVM.pagination.currentPage, dReportVM.pagination.perPage).then(function (data) {
        addMessages(dReportVM, "dReportLoading", data, 0);
      });
    };

    var dReportVM = $scope.dReportVM = commonService.getWaterFallVM($scope, $scope.getDReportData, "dReportLoading", 10);
    dReportVM.init(); 
    dReportVM.messages = null;

    $("#wReportLoading").hide();
    $scope.getWReportData = function () {
      wReportService.getReportsInWorkCirLazy(userId, wReportVM.pagination.currentPage, wReportVM.pagination.perPage).then(function (data) {
        addMessages(wReportVM, "wReportLoading", data, 1);
      });
    };

    var wReportVM = $scope.wReportVM = commonService.getWaterFallVM($scope, $scope.getWReportData, "wReportLoading", 10);
    wReportVM.init();
    wReportVM.messages = null;
    $("#mReportLoading").hide();
    $scope.getMReportData = function () {
      mReportService.getReportsInWorkCirLazy(userId, mReportVM.pagination.currentPage, mReportVM.pagination.perPage).then(function (data) {
        addMessages(mReportVM, "mReportLoading", data, 2);
      });
    };

    var mReportVM = $scope.mReportVM = commonService.getWaterFallVM($scope, $scope.getMReportData, "mReportLoading", 10);
    mReportVM.init();
    mReportVM.messages = null;
    $("#dwReportLoading").hide();
    $scope.getDWReportData = function () {
      dwReportService.getReportsInWorkCirLazy(userId, dwReportVM.pagination.currentPage, dwReportVM.pagination.perPage).then(function (data) {
        addMessages(dwReportVM, "dwReportLoading", data, 3);
      });
    };

    var dwReportVM = $scope.dwReportVM = commonService.getWaterFallVM($scope, $scope.getDWReportData, "dwReportLoading", 10);
    dwReportVM.init();
    dwReportVM.messages = null;
    $("#wPlanLoading").hide();
    $scope.getWPlanData = function () {
      wPlanService.getPlansInWorkCirLazy(userId, wPlanVM.pagination.currentPage, wPlanVM.pagination.perPage).then(function (data) {
        addMessages(wPlanVM, "wPlanLoading", data, 4);
      });
    };

    var wPlanVM = $scope.wPlanVM = commonService.getWaterFallVM($scope, $scope.getWPlanData, "wPlanLoading", 10);
    wPlanVM.init();
    wPlanVM.messages = null;      
    $scope.currentPhotos = [];
    //添加显示任务详细信息的处理函数
    $scope.fillReportDetail = function(data, type) {
      $('.rwgl-tan').hide();
      $rootScope.currentGzqIndex = $ionicSlideBoxDelegate.currentIndex();
      if(type === 3) 
        $state.go("reportReply", {reportId:data.planId, reportType: type});
      else 
        $state.go("reportReply", {reportId:data.reportId, reportType: type});
      //console.log(dReportVM.messages);
    };

    $scope.searchInGzq = function() {
      var searchText = $scope.searchText;
      if(searchText === "") {
        $('.part').show();
      } else if(searchText == "工作日报") {
        $('.part').hide();
        $('#dReportPart').show();
      } else if(searchText == "工作周报") {
        $('.part').hide();
        $('#wReportPart').show();
      } else if(searchText == "月度总结") {
        $('.part').hide();
        $('#mReportPart').show();
      } else if(searchText == "周计划") {
        $('.part').hide();
        $('#wPlanPart').show();
      } else if(searchText == "部门周报") {
        $('.part').hide();
        $('#dwReportPart').show();
      }
    };
  //});
})

// 日报评论
.controller('dReportReplyCtrl', function($scope, $state, $filter, $stateParams, $ionicHistory, $timeout, $window, $cordovaToast, commonService, dReportService, wReportService, mReportService, dwReportService, wPlanService, reportReplyService, localStorageService, alertService, _, ShareService, $location, ConfigService, RewardService){
  $scope.back = function(){
    $ionicHistory.goBack();
  };
  $scope.dashang = function(){
    $(".common-bg-shang").show();
    $(".communy-fix-shang").show();
  };
  $scope.closeS = function(){
    $(".common-bg-shang").hide();
    $(".communy-fix-shang").hide();
  };
  //commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
  //评论时隐藏填写
  $scope.hideComment = function(){
    $(".common-bg").hide();
    $(".communy-fix").hide();
    $(".wsq-bottom-all").show();
    $scope.removeHeight();
    $(".wsq-content_content").show();
  };
  // 提高表情高度
  $scope.changeHeight = function(){
    $(".communy-fix").css("bottom","127px");
    $timeout(function () {
      $("#facebox td").click(function () {
        $scope.removeHeight();
      });
    },50);
  };
  $scope.removeHeight = function(){
    $(".communy-fix").css("bottom","0px");
  };

  // 表情
  $(function(){
    $('.emotion').qqFace({
      id : 'facebox', 
      assign:'saytext', 
      path:'img/' //表情存放的路径
    });
  });
  //查看结果
  function replace_em(str){
    str = str.replace(/\</g,'&lt;');
    str = str.replace(/\>/g,'&gt;');
    str = str.replace(/\n/g,'<br/>');
    //str = str.replace(/\[em_([0-9]*)\]/g,'<img src="arclist/$1.gif" border="0" />');
    str = str.replace(/\[em_([0-9]*)\]/g,'<img src="img/$1.gif" border="0" />');
    //alert(str);
    return str;
  }
  $scope.reportId = $stateParams.reportId;
  $scope.reportType = $stateParams.reportType;
  //alert($scope.reportId + "-" + $scope.reportType);
  var userVotes = [];
  userVotes.push($scope.reportId);
  $scope.items = [];
  var handleReportData = function (data) {
    var newArr = [];
    $scope.dReport = data;
    commonService.hideLoading();
    // 显示打赏
    $(".communy-shang").show();
    $scope.currentPhotos = [];
    $scope.currentPhotos = data.photoUrls.split("|");
    if($scope.currentPhotos.length != 0 && $scope.currentPhotos[0] === "") {
      $scope.currentPhotos = [];
    }
    for(var i=0; i<$scope.currentPhotos.length; i++) {
      var photo = {"src":$scope.currentPhotos[i]};
      newArr.push(photo);
      $scope.items = newArr;
    }
  };

  $scope.replyLength = 0;
  if($scope.reportType === "1") {
    $scope.title = "工作日报";
    $scope.tableName = "ss_dailyreport";
    dReportService.getReportById($scope.reportId).then(function (data) {
      handleReportData(data);
    });
  } else if($scope.reportType === "2") {
    $scope.title = "工作周报";
    $scope.tableName = "ss_weeklyreport";
    wReportService.getReportById($scope.reportId).then(function (data) {
      handleReportData(data);
    });
  } else if($scope.reportType === "3") {
    $scope.title = "周工作计划";
    $scope.tableName = "ss_weekplan";
    wPlanService.getPlanById($scope.reportId).then(function (data) {
      handleReportData(data);
    });
  } else if($scope.reportType === "4") {
    $scope.title = "月度总结";
    $scope.tableName = "ss_monthlyreport";
    mReportService.getReportById($scope.reportId).then(function (data) {
      handleReportData(data);
    });
  } else if($scope.reportType === "5") {
    $scope.title = "部门周报";
    $scope.tableName = "ss_deptweekreport";
    dwReportService.getReportById($scope.reportId).then(function (data) {
      handleReportData(data);
    });
  }
  
  reportReplyService.selByReportIdAndCate($scope.reportId, $scope.reportType).then(function (data) {
    $scope.replys = data;
    if(data.length === 0) $("#qiangshafa").show();
    $scope.replyLength = data.length;
  });

  reportReplyService.selReadRecByReportIdAndCate($scope.reportId, $scope.reportType).then(function (data) {
    $scope.readRecords = data;
    $scope.readLength = data.length;
  });

  var userId = localStorageService.get("User").userId;
  $scope.reply = {
    "user": {"userId": userId},
    "reportId": $scope.reportId,
    "category": $scope.reportType
  };

  $scope.setReplyId = function (reportId) {
    $("#saytext").val("");
    $(".communy-fix").show();
    $(".common-bg").show();
    $(".communy-fix textarea").focus();
    $(".wsq-bottom-all").hide();
  };

  $scope.addReply = function (pid) {
    var str = $("#saytext").val();
    //$("#show").html(replace_em(str));
    $scope.reply.content = replace_em(str);
    if(typeof($scope.reply.content) == "undefined" || $scope.reply.content === "") {
      $scope.removeHeight();
      alertService.showAlert($scope, "请填写内容！", true, "fail", null);
    } else {
      reportReplyService.postReportReply($scope.reply).then(function (data) {
        if(data.status == 1) {
          alertService.showAlert($scope, "回复成功!", true, "success", null);
          //将更新的数据显示在最前面
          $scope.replys.unshift(angular.fromJson(data.msg));
          $scope.replyLength ++;
          $scope.hideComment();
          $("#qiangshafa").hide();
          //$state.go("tab.community-find", {topicId: $scope.topicId});
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
        }
      });
    }
  };
  var voteNum = 0;

  $scope.addVote = function (reportId) {
    if($("#heart" + reportId).hasClass("icon-zan-")) {
      $("#heart" + reportId).removeClass("icon-zan-");
      $("#heart" + reportId).addClass("icon-zan-1").css("color","#314c83");
      $("#heart" + reportId).children("div").removeClass("wsq_jia_none");
      $("#heart" + reportId).children("div").addClass("wsq_jia");
      voteNum ++;
      $cordovaToast.showLongBottom('点赞成功！', 'long', 'center').then(function(success) {}, function (error) {});

    } else {
      $("#heart" + reportId).removeClass("icon-zan-1");
      $("#heart" + reportId).addClass("icon-zan-").css("color","#999");
      $("#heart" + reportId).children("div").removeClass("wsq_jia");
      $("#heart" + reportId).children("div").addClass("wsq_jia_none");
      voteNum --;
      $cordovaToast.showLongBottom('取消赞！', 'long', 'center').then(function(success) {}, function (error) {});
    }

    var vote = {
      "user": {"userId": userId},
      "reportId": reportId,
      "category": $scope.reportType
    };
    reportReplyService.postReportVote(vote).then(function (data) {
      if(data.status == 1) {
        console.log("点赞成功！");
      } else {
        console.log("点赞失败！");
      }
    });
  };

  reportReplyService.selVoteByReportIdAndCate($scope.reportId, $scope.reportType).then(function (data){
    console.log(angular.toJson(data));
    $.each(data, function (index, item) {
      if(item.state === 1) {
        voteNum ++;
      }
    });
  });

  //添加阅读记录
  var addReadRecord = function () {
    var record = {
      "user": {"userId": userId},
      "reportId": $scope.reportId,
      "category": $scope.reportType
    };
    reportReplyService.postReadRec(record).then(function (data) {
      if(data.status === 1) console.log("阅读成功！");
    });
  }
  addReadRecord();

  $scope.checkVote = function (reportId) {
    if(voteNum > 0) {
      return true;
    } else {
      return false;
    }
  };

  // 分享
  $scope.share = function () {
    $scope.shareData = {};
    $scope.shareData.message = $scope.topic.title;
    $scope.shareData.subject = $scope.topic.content;
    $scope.shareData.link = ConfigService.getAppURL() + $location.path();
    ShareService.share($scope.shareData);
  };

  $scope.reward = {
    'payFrom': {"userId": userId},
    'payTo': {},
    "payNum": 1.00,
    'modelName': $scope.title,
    'table': $scope.tableName
  };

  //添加打赏
  $scope.addReward = function () {
    $scope.reward.payTo.userId = $scope.dReport.user.userId;
    $scope.reward.rid = $scope.dReport.reportId;
    if($scope.reward.payFrom.userId === $scope.reward.payTo.userId) {
      alertService.showAlert($scope, "抱歉，不能打赏给自己！", true, "warning", null);
      return;
    }
    if(parseFloat($scope.reward.payNum) === 0) {
      alertService.showAlert($scope, "抱歉，打赏金额不能为0！", true, "warning", null);
      return;
    }
    if(isNaN($scope.reward.payNum)) {
      alertService.showAlert($scope, "请填写数字！", true, "warning", null);
      return;
    }
    RewardService.postReward($scope.reward).then(function (data) {
      if(data.status == 1) {
        alertService.showAlert($scope, "打赏成功!", true, "success", null);
        $scope.closeS();
      } else {
        alertService.showAlert($scope, data.msg, true, "fail", null);
      }
    });
  };

  //确定只能填写两位小数
  $scope.clearNoNum = function (event) {
    var obj = event.target;
    var index = commonService.getCursortPosition(obj);
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数  
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
        obj.value= parseFloat(obj.value); 
    }
    $scope.reward.payNum = obj.value;
    obj.selectionStart = index;
    obj.selectionEnd = index;
  };

});