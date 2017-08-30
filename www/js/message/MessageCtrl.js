angular.module('ssapp.controllers')

//消息
.controller('messageCtrl', function($scope, $state, $rootScope, IMChatService, jMessageService, commonService, $ionicLoading, msgService, $state, localStorageService, $ionicPopup, messageService, UserService) {

  //头部显示
  (function(){
    $('.rwgl-title .rwgl-title-left').click(function(){
      $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
      // $('.rwgl-recive').show().siblings().hide();
      $(".message_list").show();
      $(".message-content-top").hide();
      $(".bar-subheader").hide();
      $(".message-content").hide();
    });
    $('.rwgl-title .rwgl-title-right').click(function(){
      $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
      // $('.rwgl-send').show().siblings().hide();
      $(".message_list").hide();
      $(".bar-subheader").show();
      $(".message-content-top").show();
      $(".message-content").show();
    });
  })($);

  var user = localStorageService.get("User");
  var cusNameInChat = localStorageService.get("cusNameInChat");
  if(!cusNameInChat) cusNameInChat = {};
  //即时通讯部分
  //更新会话列表
  var updateCommunicateList = function () {
    IMChatService.selectCommunicateByUser("ss_" + user.userNo).then(function (data) {
      $scope.communicates = data;
      $scope.targetIds = [];
      $rootScope.msgNum = jpushNoReadMsgCount;//设置msgNum初始化为jpush的未读消息个数
      $.each($scope.communicates, function (index, item) {
        $scope.targetIds.push(item.targetId);
        if(item.targetId.indexOf("cus_") != -1) {
          var cusIdInChat = item.targetId;
          jMessageService.getUserInfo(cusIdInChat).then(function(cusData) {
            var nickname = cusData.nickname;
            eval("cusNameInChat." + cusIdInChat + " = nickname");
            localStorageService.set("cusNameInChat", cusNameInChat);
            $scope.$apply();
          });
        }

        //更新总的badge角标
        $rootScope.msgNum = $rootScope.msgNum + item.noReadMsgCount;
      });
      updateBadge();
    }, function() {
      //error
    });
  };

  updateCommunicateList();
  //监听是否有新消息产生
  var destroyMsgEvent = $rootScope.$on('hasNewMsg', function(event, data){
    updateCommunicateList();
  });

  //页面改变时广播监听销毁
  $scope.$on('$stateChangeStart', function(e, state) {
    destroyMsgEvent();
  });

  $scope.chatWith = function (communicate) {
    var targetId = communicate.targetId;
    var targetType = communicate.targetType;
    $state.go("messageDetail", {targetId: targetId, targetType: targetType});
  };
  $scope.chatWithGroup = function (group) {
    var targetId = group.gid;  //web sdk
    var targetType = "group";
    $state.go("messageDetail", {targetId: targetId, targetType: targetType});
  };

  //获取所有用户的基础信息，保存在本地
  $scope.imUsers = window.sessionStorage.getItem("imUsers");
  if($scope.imUsers === null) {
    UserService.getAllUsers().then(function (data) {
      var users = {};
      $.each(data, function (index, item) {
        var chatUser = {};
        chatUser.userId = item.userId;
        chatUser.userName = item.userName;
        chatUser.photoUrl = item.photoUrl;
        chatUser.status = item.status;
        eval("users.ss_" + item.userNo + " = chatUser");
      });
      $scope.imUsers = users;
      window.sessionStorage.setItem("imUsers", angular.toJson($scope.imUsers));
    });
  }

  //初始化获取组列表
  $scope.groups = localStorageService.get("groups");
  jMessageService.getGroupIds().then(function(groupIds) {
    var groups = {};
    var num = 0;
    //web sdk版本
    $.each(groupIds.group_list, function(index, item) {
      eval("groups[" + item.gid + "] = item");
    });
    $scope.groups = groups;
    localStorageService.set("groups", groups);
  });

  //commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
  
  //新建部分
  $scope.popupMessageOpthins = function(message) {
    $scope.popup.index = $scope.messages.indexOf(message);
    $scope.popup.optionsPopup = $ionicPopup.show({
        templateUrl: "templates/popup.html",
        scope: $scope,
    });
    $scope.popup.isPopup = true;
    $(".popup").addClass("message-list");
  };
  $scope.markMessage = function() {
    var index = $scope.popup.index;
    var message = $scope.messages[index];
    if (message.showHints) {
        message.showHints = false;
        message.noReadMessages = 0;
    } else {
        message.showHints = true;
        message.noReadMessages = 1;
    }
    $scope.popup.optionsPopup.close();
    $scope.popup.isPopup = false;
    messageService.updateMessage(message);
  };
  $scope.deleteMessage = function() {
    var index = $scope.popup.index;
    var message = $scope.messages[index];
    $scope.messages.splice(index, 1);
    $scope.popup.optionsPopup.close();
    $scope.popup.isPopup = false;
    messageService.deleteMessageId(message.id);
    messageService.clearMessage(message);
  };
  $scope.topMessage = function() {
    var index = $scope.popup.index;
    var message = $scope.messages[index];
    if (message.isTop) {
        message.isTop = 0;
    } else {
        message.isTop = new Date().getTime();
    }
    $scope.popup.optionsPopup.close();
    $scope.popup.isPopup = false;
    messageService.updateMessage(message);
  };
  $scope.messageDetils = function(message) {
    $state.go("messageDetail", {
        "messageId": message.id
    });
  };
  $scope.$on("$ionicView.beforeEnter", function(){
    $scope.messages = messageService.getAllMessages();
    $scope.popup = {
        isPopup: false,
        index: 0
    };
  });
  //更新badge的值
  var updateBadge = function() {
    if(device.platform != "Android") {
      window.plugins.jPushPlugin.setBadge($rootScope.msgNum);
      window.plugins.jPushPlugin.setApplicationIconBadgeNumber($rootScope.msgNum);
    }
    $rootScope.badges = {
     carts: $rootScope.msgNum,
     contact: $rootScope.msgNum
    };
  };

  // 历史
  var userId = user.userId;
  var allData = [];
  $scope.waitTodoMsgNum = "";
  $scope.noticeMsgNum = "";
  $scope.announceMsgNum = "";
  $rootScope.msgNum = 0;
  var jpushNoReadMsgCount = 0;
  msgService.unreadCountsByUId(userId).then(function (data) {
    allData = data;
    $.each(data, function (index, item) {
      alert(item.value + "---" + angular.toJson(item));
      jpushNoReadMsgCount = jpushNoReadMsgCount + item.value;
      $rootScope.msgNum = $rootScope.msgNum + item.value;
      if(item.key === "waitTodoMsg") {
         $('.message-content-top-left span:eq(0)').show();
      } else if(item.key === "noticeMsg") {
         $('.message-content-top-left span:eq(1)').show();
      } else if(item.key === "announceMsg") {
         $('.message-content-top-left span:eq(2)').show();
      } else if(item.key === "OA") {
         $('.message-content-top-left span:eq(3)').show();
      }
    });

    updateBadge();
    $ionicLoading.hide();
  });
  $scope.clickMsgs = function (category) {
    $state.go('system-message', {category: category});
  };

  $scope.readAll = function () {
    readCategory("waitTodoMsg");
    readCategory("noticeMsg");
    readCategory("announceMsg");
    readCategory("OA");
  };

  var readCategory = function (category) {
    //更新消息状态
    msgService.readByCategory(userId, category).then(function (data) {
      //更新未查看消息总数 
      $.each(allData, function (index, item) {
        if(item.key === category) {
          $rootScope.msgNum = $rootScope.msgNum - parseInt(item.value);
        }
      });
      updateBadge();
      if(category === "waitTodoMsg") {
         $('.message-content-top-left span:eq(0)').hide();
      } else if(category === "noticeMsg") {
         $('.message-content-top-left span:eq(1)').hide();
      } else if(category === "announceMsg") {
         $('.message-content-top-left span:eq(2)').hide();
      } else if(category === "OA") {
         $('.message-content-top-left span:eq(3)').hide();
      }
    });
  };
  //});
})

//jpush消息
.controller('msgDetailCtrl', function($scope, $state, $rootScope, commonService, $ionicLoading, msgService, $stateParams, localStorageService, ToastService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    var userId = localStorageService.get("User").userId;
    var category = $stateParams.category;

    //确认下标栏中未读消息总数
    msgService.unreadCountsByUId(userId).then(function (data) {
      allData = data;
      $rootScope.msgNum = 0;
      $.each(data, function (index, item) {
        $rootScope.msgNum = $rootScope.msgNum + item.value;
      });

      //更新消息状态
      msgService.readByCategory(userId, category).then(function (data) {
        //更新未查看消息总数 
        $.each(allData, function (index, item) {
          if(item.key === category) {
            $rootScope.msgNum = $rootScope.msgNum - parseInt(item.value);
          }
        });
        if(device.platform != "Android") {
          window.plugins.jPushPlugin.setBadge($rootScope.msgNum);
          window.plugins.jPushPlugin.setApplicationIconBadgeNumber($rootScope.msgNum);
        }
        $rootScope.badges = {
         carts: $rootScope.msgNum,
         contact: $rootScope.msgNum
        };
      });
    });
    
    $scope.getPhotoUrl = function () {
      if(category === "waitTodoMsg") {
        return "img/images/xx_dbsx.png";
      } else if(category === "noticeMsg") {
        return "img/images/xx_xttz.png";
      } else if(category === "announceMsg") {
        return "img/images/xx_xtgg.png";
      } else if(category === "OA") {
        return "img/images/xx_oaxx.png";
      }
    };
    
    //取消息
    msgService.UMsgMarksByUIdAndCate(userId, category).then(function (data) {
      $scope.userMsgs = data;
      commonService.hideLoading();
    });
  });
})

// 即时通讯交流子页面
.controller('messageDetailCtrl', function($scope, $state, $stateParams, $compile, $rootScope, $ionicActionSheet, IMChatService, jMessageService, messageService, $ionicScrollDelegate, $timeout, localStorageService, ToastService) {
  var pWidth = screen.width - 100;
  $scope.pStyle = {
    "max-width" : pWidth + "px"
  };

  var curMessage;
  var curIndex;
  var mess_rightHtml = $(".mess_right").eq(0).prop('outerHTML');

  var initWriteCss = function() {
    $("#write").css("top","10px");
    $("#write").height(22);
    $("ion-footer-bar").height(34);
  };
  $scope.updateHeight = function() {
    var textareaObj = $("#write").get(0);
    
    setTimeout(function() {
      initWriteCss();
      var height = textareaObj.scrollHeight;
      if(height > 100) height = 100;
      $(textareaObj).height(height-4);
      $("ion-footer-bar").height(height+7);
    },30);
  };

  $scope.$watch('send_content',  function(newValue, oldValue) {
    $scope.updateHeight();
  });

  //消息修改
  $scope.showChange = function(index, message, $event){
    $event.stopPropagation();
    var mess_right = $compile(mess_rightHtml)($scope);
    $(".mess_right").remove();
    curIndex = index;
    curMessage = message;
    //样式部分
    var _this = $event.target;
    var leftDis = 50;
    if($(_this).hasClass("rj-message")) leftDis = 50;
    else leftDis = 20;
    $($event.target).parent().append(mess_right);
    if(leftDis > 30){
      $(".mess_right .mess_right_san").css({'left': leftDis - 20});
      $(".mess_right").css({'left': leftDis + 10});
    }else{
      var screenWidth = $(".rj-message-wrap").width();
      $(".mess_right .mess_right_san").css({'left': 100});
      $(".mess_right").css({'left': screenWidth - 180});
    }
    $(".mess_right").show();
  };

  $scope.hideChange = function() {
    $(".mess_right").hide();
  };

  /*逻辑部分*/
  var targetId = $stateParams.targetId;
  $scope.targetType = $stateParams.targetType;
  $scope.targetName = targetId;

  $scope.back = function () {
    window.history.go(-1);
  };

  $scope.sendMsg = function () {
    jMessageService.sendTextMessage(targetId, $scope.targetType, $scope.send_content, function (result) {
      $scope.send_content = "";

      initWriteCss();
    });
  };
  
  var user = localStorageService.get("User");
  $scope.myUserId = "ss_" + user.userNo;

  //设置会话未读消息个数为0
  IMChatService.readCommunicate($scope.myUserId, targetId, $scope.targetType);

  var size = 10;
  if($scope.targetType === "user") {
    //获取聊天数据
    IMChatService.selectMsgsWithUserLazy(null, null, $scope.myUserId, targetId, size).then(function (data) {
      $scope.messages = data;
      
      $timeout(function () {
        $scope.moveToBottom();
      },10);
    });
  } else if($scope.targetType === "group") {
    //获取群组名称
    jMessageService.getGroupInfo(targetId).then(function(group) {
      $scope.group = group.group_info;  //web sdk
    });
    //获取聊天数据
    IMChatService.selectMsgsWithGroupLazy(null, null, targetId, size).then(function (data) {
      $scope.messages = data;
      $timeout(function () {
        $scope.moveToBottom();
      },10);
    });
  }

  $scope.moveToBottom = function () {
    document.getElementById("maodian").scrollIntoView(false);
  };

  //删除消息
  $scope.deleteMessage = function () {
    $scope.messages.splice(curIndex, 1);
    IMChatService.deleteMsgById(curMessage.id).then(function () {
      //删除完成后更新交流列表
      IMChatService.updateCommunicateByHistory($scope.myUserId, targetId, $scope.targetType);
    });
    //上冒隐藏
  };

  //复制消息
  $scope.copyMessage = function() {
    var msgContent = $(".mess_right").eq(0).parent().children("p[name='msgContent']").html();
    cordova.plugins.clipboard.copy(msgContent);
  };

  //管理与该用户的聊天
  $scope.userManage = function() {
    if($scope.targetType === "user") {
      $state.go("useRmanage", {targetId: targetId});
    } else if($scope.targetType === "group") {
      $state.go("groupManage", {targetId: targetId});
    }
  };
  
  //监听是否有新消息产生
  var destroyEvent = $rootScope.$on('hasNewMsg', function(event, data){
    var messageObj = {};
    if(data.receiveOrSend === "receive") {
      messageObj = jMessageService.formatJson(data, data.receiveOrSend);
    } else {
      messageObj = data;
    }
    
    if(messageObj.targetType === $scope.targetType && (messageObj.targetId+"" === targetId || messageObj.fromUserId === targetId)) {
      $scope.messages.push(messageObj);
      $timeout(function () {
        $scope.moveToBottom();
      },100);
    }
  });

  //页面改变时广播监听销毁
  $scope.$on('$stateChangeStart', function(e, state) {
    destroyEvent();
  });


  /*样式部分*/
  // 位置分享功能
  $scope.location = function(){
    $state.go("locationplace");
  };

  // 收藏
  $scope.shouCang = function(){
    $state.go("shoucang");
  };

  $scope.deleteMy = function($event){
    // $($event.target).parent().hide();
  };

  //加载历史信息时，获取信息后的处理函数
  var handleLoadHistoryMsg = function(data) {
    $scope.messages = data.concat($scope.messages);
    if(data.length === 0) ToastService.showShortBottom("亲，已经没有更多消息了！");
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.doRefresh = function() {
    var curEarliestMsg = $scope.messages[0];
    var lasttime = curEarliestMsg.createdate;
    var lastId = curEarliestMsg.id;
    
    if($scope.targetType === "user") {
      IMChatService.selectMsgsWithUserLazy(lasttime, lastId, $scope.myUserId, targetId, size).then(function (data) {
        handleLoadHistoryMsg(data);
      });
    } else if($scope.targetType === "group") {
      IMChatService.selectMsgsWithGroupLazy(lasttime, lastId, targetId, size).then(function (data) {
        handleLoadHistoryMsg(data);
      });
    }
  };

  window.addEventListener("native.keyboardshow", function(e){
    $scope.moveToBottom();
  });

  // android版表情控制
  if(device.platform === "Android") {
    $("#showfive").click(function(event){
      $("ion-footer-bar").css("bottom","200px");
      $("ion-content").css("bottom","244px");
      $(".message_chat_bottom").show(300);
    });
    $(".rj-footer-input textarea").click(function(){
      $(".message_chat_bottom").hide(300);
      $("ion-footer-bar").animate({bottom: "0px"}, 200);
      $("ion-content").animate({bottom: "44px"}, 200);
    });
  } else {
    // ios版表情控制 
    $("#write").focus(function(){
      $(".bar-footer").animate({bottom:"290px"},200);
      $(".message_chat_bottom").hide(300);
    });

    $("#write").blur(function(){
      setTimeout(function() {
        $(".bar-footer").css("bottom", "0px");
      },200);
    });
    $("#showfive").click(function(event){
      setTimeout(function() {
        $(".bar-footer").css("bottom","200px");
        $(".message_chat_bottom").show(300);
      });
    });
  }

  $scope.waitToDevelop = function() {
    ToastService.showShortBottom("该功能暂未添加，敬请期待！");
  };

  //定义选择照片的函数
  $scope.choosePicMenu = function() {
      $ionicActionSheet.show({
          buttons: [
              { text: '从相册选择' },
              { text: '拍照' }
          ],
          titleText: '选择照片',
          cancelText: '取消',
          cancel: function() {
          },
          buttonClicked: function(index) {
              // Retrieve image file location from specified source
              navigator.camera.getPicture(uploadPhoto,
                                        function(message) { 
                                          //alert('get picture failed'); 
                                        },
                                        { 
                                          sourceType: index,
                                          quality: 55,
                                          correctOrientation: true,
                                          targetWidth: 1024,                                        //照片宽度
                                          targetHeight: 768                                       //照片高度
                                        });
              return true;
          }
      });
  };

  function uploadPhoto(imageURI) {
      //alert(imageURI);
      /*jMessageService.sendImageMessage(targetId, $scope.targetType, imageURI, function (result) {
        alert("success: " + angular.toJson(result));
      });*/
  };

})

//用户管理
.controller('useRmangerCtrl', function($scope, $state, $filter, $stateParams, $ionicPopup, jMessageService, UserService, commonService, $ionicHistory, IMChatService, localStorageService, alertService) {
  $scope.targetId = $stateParams.targetId;
  $scope.userName = $filter("getIMUserByField")($scope.targetId, "userName");
  var userId = $filter("getIMUserByField")($scope.targetId, "userId");

  var myUser = localStorageService.get("User");
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
  //查看聊天记录
  $scope.viewChatRecord = function () {
    $state.go("findtalkrecord", {targetId: $scope.targetId, targetType: "user"});
  };

  //确认清空聊天记录
  $scope.confirmClearRecord = function () {
    var confirmPopup = $ionicPopup.confirm({
      title: '确定清空聊天记录么？',
      template: '确定清空与' + $scope.userName + '的聊天记录？', //从服务端获取更新的内容
      cancelText: '取消',
      okText: '确定'
    });
    confirmPopup.then(function (res) {
      if (res) {
        //确定okText
        IMChatService.deleteMsgsWithUser("ss_" + myUser.userNo, $scope.targetId).then(function(result) {
          //直接删除与该用户的交流会话
          IMChatService.deleteCommunicate("ss_" + myUser.userNo, $scope.targetId, "user").then(function(result) {
            alertService.showAlert($scope, "删除成功!", true, "success", "tab.message");
          }, function(result) {
            alertService.showAlert($scope, "删除失败!", true, "fail", null);
          });
        });
      } else {
        // 取消cancelText
      }
    });
  };

  //获取该会话是否置顶
  IMChatService.selectByUserAndTarget("ss_" + myUser.userNo, $scope.targetId, "user").then(function (data) {
    if(data.length != 0 && data[0].position === 1) {
      //置顶
      $("#putToTop").attr("checked", true);
    } else {
      //未置顶
      $("#putToTop").attr("checked", false);
    }
  });

  //交流会话（置顶/取消置顶）
  $scope.putCommunicateToTop = function(event) {
    var putToTop = event.target.checked;
    if(putToTop) {
      //置顶
      IMChatService.updateCommunicateIndex("ss_" + myUser.userNo, $scope.targetId, "user", 1).then(function(result) {
        alertService.showAlert($scope, "置顶成功!", true, "success", null);
      }, function(result) {
        alertService.showAlert($scope, "置顶失败!", true, "fail", null);
      });
    } else {
      //取消置顶
      IMChatService.updateCommunicateIndex("ss_" + myUser.userNo, $scope.targetId, "user", 0).then(function(result) {
        alertService.showAlert($scope, "取消置顶成功!", true, "success", null);
      }, function(result) {
        alertService.showAlert($scope, "取消置顶失败!", true, "fail", null);
      });
    }
  };

  //获取免打扰状态
  jMessageService.getNoDisturb($scope.targetId, "user").then(function(result) {
    if(result === 1) {
      //免打扰
      $("#noDisturb").attr("checked", true);
    } else {
      //取消免打扰
      $("#noDisturb").attr("checked", false);
    }
  });

  //设置免打扰状态
  $scope.setNoDisturb = function(event) {
    var noDisturb = event.target.checked;
    if(noDisturb) {
      //免打扰
      jMessageService.setNoDisturb($scope.targetId, "user", 1).then(function(result) {
        alertService.showAlert($scope, "设置免打扰成功!", true, "success", null);
      }, function(result) {
        alertService.showAlert($scope, "设置免打扰失败!", true, "fail", null);
      });
    } else {
      //取消免打扰
      jMessageService.setNoDisturb($scope.targetId, "user", 0).then(function(result) {
        alertService.showAlert($scope, "取消免打扰成功!", true, "success", null);
      }, function(result) {
        alertService.showAlert($scope, "取消免打扰失败!", true, "fail", null);
      });
    }
  };
})

//聊天记录
.controller('viewChatRecordCtrl', function($scope, $state, $stateParams, localStorageService, IMChatService, jMessageService) {
  $scope.back = function () {
    window.history.go(-1);
  };

  var h1=$(window).height();
  var h2=$('.bar-header').innerHeight();
  var h3=$('.addfriend_list').outerHeight()+20;
  var h4=$('.talkrecord').innerHeight();
  var hcha=h1-h2-h3-h4;
  $scope.heis={'height':hcha+'px'};

  var targetId = $stateParams.targetId;
  $scope.targetType = $stateParams.targetType;
  var user = localStorageService.get("User");
  $scope.myUserId = "ss_" + user.userNo;

  if($scope.targetType === "user") {
    IMChatService.selectMsgsWithUser($scope.myUserId, targetId).then(function (data) {
      $scope.messages = data;
    });
  } else if($scope.targetType === "group") {
    //获取群组名称
    jMessageService.getGroupInfo(targetId).then(function(group) {
      $scope.group = group.group_info;  //web sdk
    });
    //获取聊天数据
    IMChatService.selectMsgsWithGroup(targetId).then(function (data) {
      $scope.messages = data;
    });
  }
})

//新建群组
.controller('addGroCtrl', function($scope, $filter, $state, commonService, UserService, IMChatService, jMessageService, alertService, localStorageService){
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    var userNo = localStorageService.get("User").userNo;
    //创建群组
    $scope.createGroup = function() {
      var groupName = $("#groupName").val();
      var groupDesc = $("#groupDesc").val();
      
      if(groupName === "") {
        alertService.showAlert($scope, "请输入群组名称!", true, "warning", null);
        return;
      }
      //构建选中成员列表
      var usernameStr = "";
      for(var key in $scope.userObjs) {
        for(var i=0; i<$scope.userObjs[key].length; i++) {
          if($scope.userObjs[key][i].checked && $scope.userObjs[key][i].userNo != userNo) usernameStr = usernameStr + "ss_" + $scope.userObjs[key][i].userNo + ",";
        }
      }
      
      if(usernameStr != "") usernameStr = usernameStr.substring(0,usernameStr.length-1);
      jMessageService.createGroup(groupName, groupDesc, usernameStr).then(function (groupId) {
        var msgObj = {
          "targetType": "group",
          "content": null,
          "msgType": null,
          "createdate": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
        };
        //交流列表中添加与群组的交流
        IMChatService.insertCommunicate("ss_" + userNo, null, groupId, msgObj).then(function(data) {
          alertService.showAlert($scope, "添加成功!", true, "success", "tab.message");
        });
      });
    };

    var wH=$(window).height();
    var bH=$('.bar-header').innerHeight();
    var sH=$('.addGroupc_list').innerHeight();
    var cha=wH-bH-sH;
    $('.slide_list ul li').css({'height':cha/26+'px'});
    var hei=cha+'px';
    $scope.myObj1 = {
      "height" : hei,
      "overflow-y":"scroll"
    };
    var english=[];
    var datax;  
    var userObjs={};
    var imgs={};
    $scope.tops={"top":sH+'px'};

    var imUsers = angular.fromJson(window.sessionStorage.getItem("imUsers"));
    var users = [];

    var handleUserDatas = function (data) {
      for(var i=0;i<data.length;i++){
        //若有自己，过滤掉
        if(data[i].userNo === userNo) continue;
        var userObj = {
          "userId": data[i].userId,
          "userNo": data[i].userNo,
          "userName": data[i].userName,
          "photoUrl": data[i].photoUrl,
          "checked": false
        };
        var pd=english.indexOf(pinyin.getCamelChars(data[i].userName).slice(0,1));
        if(pd==-1) {
          english.push(pinyin.getCamelChars(data[i].userName).slice(0,1));
          userObjs[pinyin.getCamelChars(data[i].userName).slice(0,1)]=[userObj];
          english.sort();
        } else {
          userObjs[pinyin.getCamelChars(data[i].userName).slice(0,1)].push(userObj);
        }
      }
      $scope.lister=english;
      $scope.userObjs=userObjs;
      commonService.hideLoading();
      setTimeout(function() {
        $(".addGroupc_list").show();
      });
    };

    if(imUsers === null) {
      //如果本地还没有，就去取
      UserService.getUsers().then(function (data) {
        handleUserDatas(data);
      });
    } else {
      //如果本地已经取的有imUsers，就不去取了
      for(var key in imUsers) {
        var user = eval("imUsers." + key);
        if(user.status === "在职") {
          user.userNo = key.substring(3, key.length);
          users.push(user);
        }
      }
      handleUserDatas(users);
    }
       
    $('.slide_list ul li').click(function(){
      var ll=english.indexOf($(this).text());
      var heightall=$('.list_txl_person').height();
      var heightcount=0;
        $('.fixed-con').text($(this).text()).stop().fadeIn(300,function(){
        $('.fixed-con').fadeOut();
      });
      if(ll!=-1){
        if(ll==0){
          $('.out_selcet').scrollTop(0);
        }else{
          for(var j=0;j<ll;j++){
            heightcount=heightcount-1+$('.list_english').eq(j).height();
            }
            if(heightall-heightcount-cha>0){
              $('.out_selcet').animate({scrollTop: heightcount+'px'}, 200);
            }
            else{
              $('.out_selcet').animate({scrollTop: heightall-cha+'px'}, 200);
            }
        }
      }else{
        return;
      }   
    });
  });
})

// 群管理
.controller('groupManageCtrl', function($scope, $state, $stateParams, $rootScope, $ionicHistory, $ionicPopup, commonService, jMessageService, IMChatService, alertService, localStorageService) {
  $scope.targetId = $stateParams.targetId;
  var myUser = localStorageService.get("User");
  //定义是否为群管理员的变量值
  $scope.isAdmin = false;
  $scope.back = function () {
    $ionicHistory.goBack();
  };
  //获取群组详情
  jMessageService.getGroupInfo($scope.targetId).then(function(group) {
    $scope.group = group.group_info;
    $scope.groupName = group.group_info.name;
  });

  //获取群组成员
  jMessageService.getGroupMembers($scope.targetId).then(function(result) {
    $scope.members = result.member_list;
    $.each($scope.members, function(index, item) {
      if("ss_"+myUser.userNo === item.username && item.flag === 1) {
        $scope.isAdmin = true;
      }
    });
  });

  $scope.manageGroupMembers = function (type) {
    if(type === "remove" && !$scope.isAdmin) return;
    $state.go("mgrGroupMembers", {groupId: $scope.targetId, type: type});
  };

  $scope.userManage = function(targetId) {
      $state.go("tab.txl-find", {userId: targetId});
  };

  //更新群名称跳转
  $scope.updateGroupName = function () {
    if(!$scope.isAdmin) return;
    $state.go("qmc", {groupName: $scope.groupName, groupId: $scope.targetId});
  };

  //更新群公告跳转
  $scope.updateGroupDesc = function () {
    if(!$scope.isAdmin) return;
    $state.go("groupDesc", {groupDesc: $scope.group.desc, groupId: $scope.targetId});
  };

  //查看聊天记录
  $scope.viewChatRecord = function () {
    $state.go("findtalkrecord", {targetId: $scope.targetId, targetType: "group"});
  };

  //确认清空聊天记录
  $scope.confirmClearRecord = function () {
    var confirmPopup = $ionicPopup.confirm({
      title: '确定清空聊天记录么？',
      template: '确定清空群组（' + $scope.groupName + '）中的所有聊天记录？',
      cancelText: '取消',
      okText: '确定'
    });
    confirmPopup.then(function (res) {
      if (res) {
        //确定okText
        IMChatService.deleteMsgsWithGroup($scope.targetId).then(function(result) {
          //直接删除与该群组的交流会话
          IMChatService.deleteCommunicate("ss_" + myUser.userNo, $scope.targetId, "group").then(function(result) {
            alertService.showAlert($scope, "删除成功!", true, "success", "tab.message");
          }, function(result) {
            alertService.showAlert($scope, "删除失败!", true, "fail", null);
          });
        });
      } else {
        // 取消cancelText
      }
    });
  };

  //获取该会话是否置顶
  IMChatService.selectByUserAndTarget("ss_" + myUser.userNo, $scope.targetId, "group").then(function (data) {
    if(data.length != 0 && data[0].position === 1) {
      //置顶
      $("#putToTop").attr("checked", true);
    } else {
      //未置顶
      $("#putToTop").attr("checked", false);
    }
  });

  //交流会话（置顶/取消置顶）
  $scope.putCommunicateToTop = function(event) {
    var putToTop = event.target.checked;
    if(putToTop) {
      //置顶
      IMChatService.updateCommunicateIndex("ss_" + myUser.userNo, $scope.targetId, "group", 1).then(function(result) {
        alertService.showAlert($scope, "置顶成功!", true, "success", null);
      }, function(result) {
        alertService.showAlert($scope, "置顶失败!", true, "fail", null);
      });
    } else {
      //取消置顶
      IMChatService.updateCommunicateIndex("ss_" + myUser.userNo, $scope.targetId, "group", 0).then(function(result) {
        alertService.showAlert($scope, "取消置顶成功!", true, "success", null);
      }, function(result) {
        alertService.showAlert($scope, "取消置顶失败!", true, "fail", null);
      });
    }
  };

  //获取免打扰状态
  jMessageService.getNoDisturb($scope.targetId, "group").then(function(result) {
    if(result === 1) {
      //免打扰
      $("#noDisturb").attr("checked", true);
    } else {
      //取消免打扰
      $("#noDisturb").attr("checked", false);
    }
  });

  //设置免打扰状态
  $scope.setNoDisturb = function(event) {
    var noDisturb = event.target.checked;
    if(noDisturb) {
      //免打扰
      jMessageService.setNoDisturb($scope.targetId, "group", 1).then(function(result) {
        alertService.showAlert($scope, "设置免打扰成功!", true, "success", null);
      }, function(result) {
        alertService.showAlert($scope, "设置免打扰失败!", true, "fail", null);
      });
    } else {
      //取消免打扰
      jMessageService.setNoDisturb($scope.targetId, "group", 0).then(function(result) {
        alertService.showAlert($scope, "取消免打扰成功!", true, "success", null);
      }, function(result) {
        alertService.showAlert($scope, "取消免打扰失败!", true, "fail", null);
      });
    }
  };

  //确认退出该群
  $scope.exitGroup = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '确定退出该群么？',
      template: '确定退出群组“' + $scope.groupName + '”么？',
      cancelText: '取消',
      okText: '确定'
    });
    confirmPopup.then(function (res) {
      if (res) {
        //确定okText
        jMessageService.exitGroup($scope.targetId).then(function(result) {
          //退出后删除与该群的消息及会话
          IMChatService.deleteMsgsWithGroup($scope.targetId).then(function(result) {
            //直接删除与该群组的交流会话
            IMChatService.deleteCommunicate("ss_" + myUser.userNo, $scope.targetId, "group").then(function(result) {
              alertService.showAlert($scope, "退出该群成功!", true, "success", "tab.message");
            }, function(result) {
              
            });
          });
        });
      } else {
        // 取消cancelText
      }
    });
  };
})

// 群名称
.controller('qmcCtrl', function($scope, $stateParams, $timeout, $state, $rootScope, $ionicHistory, $ionicPopup, jMessageService, alertService) {
  $scope.back = function () {
    window.history.go(-1);
  };

  //聚焦显示
  $('.grzl-sj input').focus(function(){
    $(this).next().show();
  });

  //清空隐藏
  $scope.deleteText = function(){
    $('.grzl-sj input').val("").blur().next().hide();
  };

  var oldGroupName = $stateParams.groupName;
  $('.grzl-sj input').val(oldGroupName);
  var groupId = $stateParams.groupId;

  //确认更改群名称
  $scope.finishText = function(){
    var newGroupName = $.trim($('.grzl-sj input').val());
    if(newGroupName === "") {
      alertService.showAlert($scope, "群名称不能为空!", true, "warning", null);
      return;
    }
    var confirmPopup = $ionicPopup.confirm({
      title: '确定修改群名称么？',
      template: '确定修改群名称为“' + newGroupName + '”么？',
      cancelText: '取消',
      okText: '确定'
    });
    confirmPopup.then(function (res) {
      if (res) {
        jMessageService.updateGroupName(groupId, newGroupName).then(function () {
          alertService.showAlert($scope, "修改成功!", true, "success", null);
          $timeout(function() {
            window.history.go(-1);
          },1000);
        });
      } else {
        // 取消cancelText
      }
    });
  };

})


// 群公告
.controller('groupDescCtrl', function($scope, $stateParams, $timeout, $state, $rootScope, $ionicHistory, $ionicPopup, jMessageService, alertService) {
  $scope.back = function () {
    window.history.go(-1);
  };

  //聚焦显示
  $('.grzl-sj textarea').focus(function(){
    $(this).next().show();
  });

  //清空隐藏
  $scope.deleteText = function(){
    $('.grzl-sj textarea').val("").blur().next().hide();
  };

  var oldGroupDesc = $stateParams.groupDesc;
  $('.grzl-sj textarea').val(oldGroupDesc);
  var groupId = $stateParams.groupId;

  //确认更改群公告
  $scope.finishText = function(){
    var newGroupDesc = $.trim($('.grzl-sj textarea').val());
    var confirmPopup = $ionicPopup.confirm({
      title: '确定修改么？',
      template: '确定修改群公告么？',
      cancelText: '取消',
      okText: '确定'
    });
    confirmPopup.then(function (res) {
      if (res) {
        jMessageService.updateGroupDescription(groupId, newGroupDesc).then(function () {
          alertService.showAlert($scope, "修改成功!", true, "success", null);
          $timeout(function() {
            window.history.go(-1);
          },1000);
        });
      } else {
        // 取消cancelText
      }
    });
  };

})

//管理群组成员
.controller('mgrGroupMembersCtrl', function($scope, $state, $stateParams, $filter, commonService, UserService, IMChatService, jMessageService, alertService, localStorageService){
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function () {
      window.history.go(-1);
    };

    var userNo = localStorageService.get("User").userNo;
    var groupId = $stateParams.groupId;
    $scope.type = $stateParams.type;
    if($scope.type === "add") $scope.title = "添加群组成员";
    else if($scope.type === "remove") $scope.title = "移除群组成员";

    
    //管理群组成员(add--添加;remove--移除)
    $scope.mgrGroupMembers = function() {
      //构建选中成员列表
      var usernameStr = "";
      for(var key in $scope.userObjs) {
        for(var i=0; i<$scope.userObjs[key].length; i++) {
          if($scope.userObjs[key][i].checked && $scope.userObjs[key][i].userNo != userNo) usernameStr = usernameStr + "ss_" + $scope.userObjs[key][i].userNo + ",";
        }
      }
      if(usernameStr === "") {
        alertService.showAlert($scope, "请选择成员!", true, "warning", null);
        return;
      }
      if(usernameStr != "") usernameStr = usernameStr.substring(0,usernameStr.length-1);
      if($scope.type === "add") {
        jMessageService.addGroupMembers(groupId, usernameStr).then(function (data) {
          alertService.showAlert($scope, "添加成员成功!", true, "success", null);
          setTimeout(function() {
            $scope.back();
          }, 1000);
        });
      } else if($scope.type === "remove") {
        jMessageService.removeGroupMembers(groupId, usernameStr).then(function (data) {
          alertService.showAlert($scope, "移除成员成功!", true, "success", null);
          setTimeout(function() {
            $scope.back();
          }, 1000);
        });
      }
      
    };

    var wH=$(window).height();
    var bH=$('.bar-header').innerHeight();
    var sH=$('.addGroupc_list').innerHeight();
    var cha=wH-bH-sH;
    $('.slide_list ul li').css({'height':cha/26+'px'});
    var hei=cha+'px';
    $scope.myObj1 = {
      "height" : hei,
      "overflow-y":"scroll"
    };
    var english=[];
    var datax;  
    var userObjs={};
    var imgs={};
    $scope.tops={"top":sH+'px'};

    var imUsers = angular.fromJson(window.sessionStorage.getItem("imUsers"));
    var users = [];

    var handleUserDatas = function (data) {
      for(var i=0;i<data.length;i++){
        //若有自己，过滤掉
        if(data[i].userNo === userNo) continue;
        //若是添加，过滤掉群组成员
        if($scope.type === "add" && memberIds.indexOf("ss_" + data[i].userNo) != -1) continue;
        var userObj = {
          "userId": data[i].userId,
          "userNo": data[i].userNo,
          "userName": data[i].userName,
          "photoUrl": data[i].photoUrl,
          "checked": false
        };
        var pd=english.indexOf(pinyin.getCamelChars(data[i].userName).slice(0,1));
        if(pd==-1) {
          english.push(pinyin.getCamelChars(data[i].userName).slice(0,1));
          userObjs[pinyin.getCamelChars(data[i].userName).slice(0,1)]=[userObj];
          english.sort();
        } else {
          userObjs[pinyin.getCamelChars(data[i].userName).slice(0,1)].push(userObj);
        }
      }
      $scope.lister=english;
      $scope.userObjs=userObjs;
      commonService.hideLoading();
      //setTimeout(function() {
        $(".slide_list").css("z-index", 9999999);
        $(".slide_list").show();
      //});
    };

    var memberArr = []; //群组成员呈现用对象数组
    var memberIds = [];
    //获取群组成员
    jMessageService.getGroupMembers(groupId).then(function(result) {
      var members = result.member_list;
      $.each(members, function(index, item) {
        var imUserId = item.username;
        var user = {};
        user.userNo = imUserId.substring(3, imUserId.length);
        user.userId = eval("imUsers." + imUserId + ".userId");
        user.userName = eval("imUsers." + imUserId + ".userName");
        var photoUrl = eval("imUsers." + imUserId + ".photoUrl");
        user.photoUrl = photoUrl != "" ? photoUrl: "img/default.png";
        memberArr.push(user);
        memberIds.push(imUserId);
      });

      chooseShowUser();
    });

    //根据是添加还是删除确定要操作的对象是全体员工还是群组成员
    var chooseShowUser = function () {
      if($scope.type === "add") {
        //列表为所有员工
        if(imUsers === null) {
          //如果本地还没有，就去取
          UserService.getUsers().then(function (data) {
            handleUserDatas(data);
          });
        } else {
          //如果本地已经取的有imUsers，就不去取了
          for(var key in imUsers) {
            var user = eval("imUsers." + key);
            if(user.status === "在职") {
              user.userNo = key.substring(3, key.length);
              users.push(user);  
            }
          }
          handleUserDatas(users);
        }
      } else if($scope.type === "remove") {
        //列表为群组成员
        handleUserDatas(memberArr);
      }
    };
       
    $('.slide_list ul li').click(function(){
      var ll=english.indexOf($(this).text());
      var heightall=$('.list_txl_person').height();
      var heightcount=0;
        $('.fixed-con').text($(this).text()).stop().fadeIn(300,function(){
        $('.fixed-con').fadeOut();
      });
      if(ll!=-1){
        if(ll==0){
          $('.out_selcet').scrollTop(0);
        }else{
          for(var j=0;j<ll;j++){
            heightcount=heightcount-1+$('.list_english').eq(j).height();
            }
            if(heightall-heightcount-cha>0){
              $('.out_selcet').animate({scrollTop: heightcount+'px'}, 200);
            }
            else{
              $('.out_selcet').animate({scrollTop: heightall-cha+'px'}, 200);
            }
        }
      }else{
        return;
      }   
    });
  });
});