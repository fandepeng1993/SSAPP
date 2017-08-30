angular.module('ssapp.controllers')

// 平台信息
.controller('dataController',function($scope, $state, dataService, $ionicHistory, commonService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };
    //初始化下拉框
    dataService.getDepts().then(function (data) {
      $scope.addarr={9:'Finance',12:'Sales',21:'Marketing',22:'Operation',25:'Purchase',29:'Research',32:'E-commerce',52:'Personnel'};
      /*angular.forEach(data, function(data,index,array){
          data['eng']=addarr[index];
      });*/
      $scope.depts = data;
      commonService.hideLoading();
    });

    //查看对应部门人员添加的平台信息
    $scope.deptPlatformData = function(deptId, deptName) {
      //跳转页面并传参
      $state.go('tab.sjsj-dept', {deptId: deptId, deptName: deptName});
    };
  });
})

// 平台信息详情
.controller('dataDetailCtrl',function($scope, $state, $timeout, $ionicHistory, $stateParams, $cordovaToast, dataService, ConfigService, commonService, localStorageService, alertService, ShareService, $location, _) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };

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


    //取页面传过来的dataId参数
    $scope.dataId = $stateParams.dataId;

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

    $('#close').click(function(){
        $('.blogwrite-tan-bg').hide();
        $('.blogwrite-tan').hide();
    });

    var num = 0;
    $scope.dataReplyArr;
    var arrId;
    $scope.getArr = function (id) {
      return $scope.dataReplyArr[id];
    };

    //查看对应的平台信息详情
    dataService.getDataById($scope.dataId).then(function (data) {
      $scope.data = data;
      $scope.content = data.content.replace(/<img src=\"\/SSAPP/g, "<img src=\"" + ConfigService.getHost());
      num++;
      if(num === 3) commonService.hideLoading();
    });

    dataService.getReplysByDataId($scope.dataId).then(function (data) {
      $scope.replys = data;
      $scope.replyLength = data.length;
      if(data.length === 0) $("#qiangshafa").show();
      $scope.dataReplyArr = _.groupBy(data, function(item){ 
        if(item.parentReply === null || item.parentReply.id === 0) {
          return 0;
        } else {
          return item.parentReply.id; 
        }
      });
      num++;
      if(num === 3) commonService.hideLoading();
    });

    var userId = localStorageService.get("User").userId;
    $scope.reply = {
      "user": {"userId": userId},
      "parentReply": {"id": 0},
      "dataId": $scope.dataId
    };

    $scope.setReplyId = function (reply, platformId) {
      if(reply != 0) {
        $("#saytext").val("@" + reply.user.userName + ": ");
        $scope.replyId = reply.id;
      } else {
        $("#saytext").val("");
        $scope.replyId = 0;
      }
      
      $(".communy-fix").show();
      $(".common-bg").show();
      $(".communy-fix textarea").focus();
      $(".wsq-bottom-all").hide();
      
      //当前要回复的Blog
      $scope.currentReply = reply;
      arrId = platformId;
    };

    $scope.addReply = function (pid) {
      var str = $("#saytext").val();
      //$("#show").html(replace_em(str));
      //提交时去除@字符串
      if(str.charAt(0) === "@" && str.indexOf(":") != -1) {
        var replyUserName = $.trim(str.split(":")[0]);
        if(replyUserName === "@"+$scope.currentReply.user.userName) {
          $scope.reply.content = $.trim(str.substring(str.indexOf(":")+1, str.length));
        }
      } else {
        $scope.reply.content = str;
      }
      $scope.reply.content = replace_em($scope.reply.content);
      $scope.reply.parentReply.id = pid;
      if(typeof($scope.reply.content) == "undefined" || $scope.reply.content === "") {
        $scope.removeHeight();
        alertService.showAlert($scope, "请填写内容！", true, "fail", null);
      } else {
        dataService.postDataReply($scope.reply).then(function (data) {
          if(data.status == 1) {
            alertService.showAlert($scope, "回复成功!", true, "success", null);
            $("#qiangshafa").hide();
            //将更新的数据显示在最前面
            //$scope.replys.unshift(angular.fromJson(data.msg));
            
            //若是对话题添加评论，则将更新的数据显示在最前面;若是对评论进行评论，则添加在对应的评论list中。
            //alert(angular.toJson(data.msg.content));
            var json = eval("(" + eval("(" + angular.toJson(data.msg) + ")") + ")");
            if(json.parentReply === null || json.parentReply.id === 0) {
              $scope.dataReplyArr[arrId].unshift(json);
            } else {
              if(typeof($scope.dataReplyArr[arrId]) != "undefined") {
                $scope.dataReplyArr[arrId].push(json);
              } else {
                $scope.dataReplyArr[arrId] = [];
                $scope.dataReplyArr[arrId].push(json);
                //eval("$scope.allReplys.reply" + key + "=("
              }
            }

            $scope.replyLength ++;
            $scope.hideComment();
            //$state.go("tab.community-find", {topicId: $scope.topicId});
          } else {
            alertService.showAlert($scope, data.msg, true, "fail", null);
          }
        });
      }
    };

    $scope.addVote = function (replyId) {
      if($("#heart" + replyId).hasClass("icon-zan-")) {
        $("#heart" + replyId).removeClass("icon-zan-");
        $("#heart" + replyId).addClass("icon-zan-1").css("color","#314c83");
        $("#heart" + replyId).children("div").removeClass("wsq_jia_none");
        $("#heart" + replyId).children("div").addClass("wsq_jia");
        $cordovaToast.showLongBottom('点赞成功！', 'long', 'center').then(function(success) {}, function (error) {});
      } else {
        $("#heart" + replyId).removeClass("icon-zan-1");
        $("#heart" + replyId).addClass("icon-zan-").css("color","#999");
        $("#heart" + replyId).children("div").removeClass("wsq_jia");
        $("#heart" + replyId).children("div").addClass("wsq_jia_none");
        $cordovaToast.showLongBottom('取消赞！', 'long', 'center').then(function(success) {}, function (error) {});
      }

      var vote = {
        "userId": userId,
        "dataReplyId": replyId
      };
      dataService.postDataVote(vote).then(function (data) {
        if(data.status == 1) {
          console.log("点赞成功！");
        } else {
          console.log("点赞失败！");
        }
      });
    };
    //用户的点赞集
    var userVotes = [];

    dataService.getDataVoteByUId(userId).then(function (data){
      $.each(data, function (index, item) {
        if(item.state == 1) {
          userVotes.push(item.dataReplyId);
        }
      });
      num++;
      if(num === 3) commonService.hideLoading();
    });

    $scope.checkVote = function (dataReplyId) {
      var index = _.indexOf(userVotes, dataReplyId.toString());
      return index != -1 ? true : false;
    };

    // 分享
    $scope.share = function () {
      $scope.shareData = {};
      $scope.shareData.message = $scope.data.title;
      $scope.shareData.subject = $scope.data.content;
      $scope.shareData.link = ConfigService.getAppURL() + $location.path();
      ShareService.share($scope.shareData);
    };
  });
})

// 部门平台信息
.controller('deptDataCtrl',function($scope, $state, $stateParams, commonService, dataService) {
  //取页面传过来的deptId参数
  var deptId = $stateParams.deptId;
  $scope.deptName = $stateParams.deptName + "信息";
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    var allData;
    //查看对应部门人员添加的平台信息
    dataService.getDatasByDeptId(deptId).then(function (data) {
      $scope.datas = data;
      allData = data;
      if($scope.datas.length != 0) {
        $("#dept-sj").show();
      } else {
        $("#nonedept-sj").show();
      }
      $("#showPage").show();
      $("#loading").hide();
      commonService.hideLoading();
    });

    $scope.dataDetail = function(dataId) {
      //跳转页面并传参
      $state.go('tab.sjsj-in', {dataId: dataId});
    };

    $scope.searchData = function () {
      var userName = $scope.searchText;
      $scope.datas = [];
      $.each(allData, function(index, item) {
        //判断工序、框号、合同号和超期都为所选或所填项时，往curData里添加数据。
        if(item.user.userName.indexOf(userName) != -1) {
          $scope.datas.push(item);
        }
      });
    };
  });
});