angular.module('ssapp.controllers')

//密码锁屏
.controller('passwordCtrl', function($scope, $window, $state, $timeout, LoginService, localStorageService, UserService, alertService){
  $scope.user = localStorageService.get("User");
  var settingTime = 1;
  var settingPattern = '';
  //$scope.log_pattern = LoginService.getLoginPattern();
  $scope.log_pattern = $scope.user.keyboardLock;
  if ($scope.log_pattern === '') {
    $("#msg").text("请设置密码");
  }
  var lock = new PatternLock('#lockPattern', {
    radius:30,margin:15,
    // lineOnMove:false, //移动隐藏线条和框
    // patternVisible:false,
    // mapper: {1:3,2:1,3:4,4:2,5:9,6:7,7:8,8:5,9:6},//指定顺序
    mapper: function(idx){
          return (idx%9) + 1;
        },//函数自定义顺序
      onDraw:function(pattern){
          // 4
          if ($scope.log_pattern != '') {
              // 5
              // 先验证错误次数
              if(localStorageService.get("gesTime") >= 5) {
                $("#msg").text("密码错误超过5次，请10分钟后重试！");
                if(localStorageService.get("gesTimeoutStatus") === null) {
                  setTimeout(function() {
                    localStorageService.remove("gesTime");
                    localStorageService.remove("gesTimeoutStatus");
                  }, 600000);
                  localStorageService.set("gesTimeoutStatus", 1);
                }
                return;
              }
              LoginService.checkLoginPattern(pattern).success(function(data) {
                  setTimeout(function() {lock.reset();}, 500);

                  //验证密码正确，后更新
                  var obj = {
                    "userId" : $scope.user.userId
                  };
                  obj.keyboardLock = '';
                  UserService.updateUser(obj).then(function (data) {
                    if (data.status === 1) {
                      $scope.user.keyboardLock = '';
                      localStorageService.set("User", $scope.user);
                    }
                    $scope.log_pattern = '';
                    $("#msg").text("请设置密码");
                  });

                  //$state.go('tab.dash');
              }).error(function(data) {
                  lock.error();
                  setTimeout(function() {lock.reset();}, 500);
                  if(localStorageService.get("gesTime") === null) {
                    localStorageService.set("gesTime", 1);
                  } else {
                    localStorageService.set("gesTime", localStorageService.get("gesTime") + 1);
                  }
                  $("#msg").text("密码错误" + localStorageService.get("gesTime") + "次");
              });
          } else {
              // 6设置
              /*LoginService.setLoginPattern(pattern);
              var obj = {
                "userId" : $scope.user.userId,
                "keyboardLock" : pattern
              };
              UserService.updateUser(obj).then(function (data) {
                if (data.status === 1) {
                  //更新localStorageService
                  $scope.user.keyboardLock = pattern;
                  localStorageService.set("User", $scope.user);
                  alertService.showAlert($scope, "手势密码设置成功!", true, "success", 'tab.setting');
                } else {
                  alertService.showAlert($scope, "手势密码设置失败！", true, "fail", null);
                }
              });
              lock.reset();
              $scope.log_pattern = LoginService.getLoginPattern();
              $scope.$apply();*/
              if(settingTime === 2) {
                if(settingPattern == pattern) {
                  LoginService.setLoginPattern(pattern);
                  var obj = {
                    "userId" : $scope.user.userId,
                    "keyboardLock" : pattern
                  };
                  UserService.updateUser(obj).then(function (data) {
                    if (data.status === 1) {
                      //更新localStorageService
                      $scope.user.keyboardLock = pattern;
                      localStorageService.set("User", $scope.user);
                      alertService.showAlert($scope, "手势密码设置成功!", true, "success", 'tab.dash');
                    } else {
                      alertService.showAlert($scope, "手势密码设置失败！", true, "fail", null);
                    }
                  });
                  setTimeout(function() {lock.reset();}, 500);
                  $scope.log_pattern = LoginService.getLoginPattern();
                  $scope.$apply();
                  settingTime = 1;
                } else {
                  $("#msg").text("两次手势输入不同，请重新输入！");
                  settingTime = 1;
                  lock.error();
                  setTimeout(function() {lock.reset();}, 500);

                }
              } else {
                $("#msg").text("请确认手势密码！");
                settingPattern = pattern;
                settingTime++;
                setTimeout(function() {lock.reset();}, 500);
              }
          }
      }
  });
  $scope.forgetGes = function () {
    $state.go("sfyz", {isLogin: 0});
  };
})

//忘记密码锁屏
.controller('resetGestureCtrl', function($scope, $window, $state, $stateParams, LoginService, localStorageService, alertService, UserService, commonService){
  var isLogin = $stateParams.isLogin;
  var user = localStorageService.get("User");
  $scope.resetGesture = function () {
    if($("#password").val() === user.password || commonService.getPswMD5Str($("#password").val()) === user.password) {
      var obj = {
        "userId" : user.userId
      };
      obj.keyboardLock = '';
      UserService.updateUser(obj).then(function (data) {
        if (data.status === 1) {
          user.keyboardLock = '';
          localStorageService.set("User", user);

          $("#password").val("");
          if(isLogin == "1") {
            alertService.showAlert($scope, "验证密码正确", true, "success", null);
            $state.go("gesLogin");
          } else {
            alertService.showAlert($scope, "验证密码正确", true, "success", null);
            $state.go("gesture");
          }
        }
      });
    } else {
      alertService.showAlert($scope, "密码错误", true, "fail", null);
    }
  };

})

//个人资料
.controller('SaveCtrl', function($scope, $state, $rootScope, $ionicPopup, $timeout, $ionicActionSheet, ConfigService, localStorageService, UserService, alertService) {
  /*var options = {
                                                                 //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
        quality: 100,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
        allowEdit: false,                                        //在选择之前允许修改截图
        encodingType:Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        targetWidth: 200,                                        //照片宽度
        targetHeight: 200,                                       //照片高度
        mediaType:0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        cameraDirection:0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true                                   //保存进手机相册
    };
*/
  $scope.back = function () {
    $scope.user = localStorageService.get("User");
    $state.go("tab.personcenter");
  };
  //定义选择照片的函数
  $scope.choosePicMenu = function() {
      var type = 'gallery';
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
              quality: 50,
              correctOrientation: true,
              targetWidth: 200,                                        //照片宽度
              targetHeight: 200                                       //照片高度
              //destinationType: navigator.camera.DestinationType.FILE_URI,
              //sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
            return true;
          }
      });
  };

  function uploadPhoto(imageURI) {
      $scope.img = imageURI;
      $scope.$apply();

      var options = new FileUploadOptions();
      options.fileKey="file";
      options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
      options.mimeType="image/jpeg";

      var params = {};
      params.value1 = "test";
      params.value2 = "param";
      options.params = params;
      //alert(angular.toJson(options));

      var ft = new FileTransfer();
      ft.upload(imageURI, encodeURI(ConfigService.getHost() + "/uploadServlet"), win, fail, options);
  }

  function win(r) {//上传成功回调方法
      //var res = angular.toJson(r);//上传接口返回的数据
      var resInfo = JSON.parse(r.response);
      if (resInfo.status === 1) {
          //$scope.img = "http://139.196.242.202:8080" + resInfo.msg;
          //$scope.user.photoUrl = "http://139.196.242.202:8080" + resInfo.msg;
          $scope.img = resInfo.msg;
          $scope.user.photoUrl = resInfo.msg;
          $scope.$apply();
      } else {
          //上传失败
      }
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      console.log("Sent = " + r.bytesSent);
  }

  function fail(error) {//上传失败回调方法
      //alert("An error has occurred: Code = " + error.code);
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
  }

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
     title: '您真的确定保存资料？',
     buttons: [
     { text: '取消',type: 'button-positive' },{text: '确定',type: 'button-positive'}],
     // template: '验证码将发送到这个手机号码：18516563651'
    });
    confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
       $state.go("confirm", null);
     }
    });
  };

  //填充用户资料
  var userId = localStorageService.get('User').userId;
  $scope.user = {
    'userId': userId
  };
  $scope.user.userNo = localStorageService.get('User').userNo;
  $scope.user.userName = localStorageService.get('User').userName;
  $scope.user.telephone = localStorageService.get('User').telephone;
  $scope.user.email = localStorageService.get('User').email;
  $scope.user.officeTel = localStorageService.get('User').officeTel;
  $scope.user.signature = localStorageService.get('User').signature;
  $scope.deptName = localStorageService.get('User').deptName;
  $scope.positionName = localStorageService.get('User').positionName;
  if(localStorageService.get('User').photoUrl != "") {
    $scope.user.photoUrl = localStorageService.get('User').photoUrl;
    $scope.img = localStorageService.get('User').photoUrl;
  } else {
    $scope.img = "img/default.png";
  }

  //更新用户资料
  $scope.updateUser = function() {
    //$scope.user.photoUrl = "";
    UserService.updateUser($scope.user).then(function(data) {
      if (data.status === 1) {
        //重新获取更改后的user并更改localStorageService中的User
        UserService.getUserById(userId).then(function (data) {
          var u = localStorageService.get('User');
          u.userName = $scope.user.userName;
          u.telephone = $scope.user.telephone;
          u.email = $scope.user.email;
          u.officeTel = $scope.user.officeTel;
          u.photoUrl = $scope.user.photoUrl;
          u.signature = $scope.user.signature;
          localStorageService.set('User', u);
        });
        alertService.showAlert($scope, "用户资料修改成功!", true, "success", 'tab.personcenter');
        //$window.alert("用户资料修改成功!");
        //$state.go('tab.personcenter');
      } else {
        alertService.showAlert($scope, data.msg, true, "success", null);
      }
    });
  };

  //监听话题添加的广播事件
  $rootScope.$on('phonenumber', function(event, data){
    $scope.user.telephone = data;
  });
  //监听话题添加的广播事件
  $rootScope.$on('officephonenumberjt', function(event, data){
    $scope.user.officeTel = data;
  });
  //监听话题添加的广播事件
  $rootScope.$on('userEmail', function(event, data){
    $scope.user.email = data;
  });
  //监听话题添加的广播事件
  $rootScope.$on('userSignature', function(event, data){
    $scope.user.signature = data;
  });
})

//个人资料之手机
.controller('finishCtrl',function($scope,$ionicPopup,localStorageService,$rootScope){
  // var u = localStorageService.get('User');
  $scope.dbphonenumber = '';
  //聚焦
  $('.grzl-sj input').focus(function(){
    $(this).next().show();
  });

  //清空
  $scope.deletephoneNumber=function(){
    $('.grzl-sj input').val("").blur().next().hide();
  };
  $scope.Judge=function () {
    var JuedepH=$('.grzl-sj input').val();
    /*console.log(JuedeDHs.length);*/
    if( JuedepH.length>11){
      $('.grzl-sj input').val(JuedepH.substr(0,11));
    }
  }
  //完成
  $scope.finishdate=function(){
    var cc=$('.grzl-sj input').val();
    if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(cc))){
      var confirmPopup=$ionicPopup.confirm({
        title:'手机号码错误！',
        buttons:[ { text: '取消' },{ text: '确认',type: 'button-positive'}],
        template:'您输入的手机号码有误，是否重新填写？'
      });
      confirmPopup.then(function(res){
        if (res) {
          $('.grzl-sj input').val("").focus();
        }else{}
      });
    }
    else{
      $rootScope.$broadcast('phonenumber', cc);//$rootscope可以在所有controller中使用
      window.history.back();
    }
  };
})

//个人资料之集团短号
.controller('jtdhCtrl',function($scope,$ionicPopup,localStorageService,$rootScope){
  var u = localStorageService.get('User');
  $scope.officephonenumber = '';

  //聚焦
  $('.grzl-sj input').focus(function(){
    $(this).next().show();
  });

  $scope.JuedeDH=function () {
    var JuedeDHs=$('.grzl-sj input').val();

    /*console.log(JuedeDHs.length);*/
    if( JuedeDHs.length>4){
      $('.grzl-sj input').val(JuedeDHs.substr(0,4));
    }
  }

  //清空
  $scope.deletephoneNumber = function(){
    $('.grzl-sj input').val("").blur().next().hide();
  };
  //完成
  $scope.jtfinishdate=function(){
    var cc=$('.grzl-sj input').val();
    if(!/^\d{4}$/.test(cc)){
      var confirmPopup=$ionicPopup.confirm({
        title:'集团短号错误！',
        buttons:[{ text: '取消' },{ text: '确认',type: 'button-positive'}],
        template:'您输入的集团短号有误，是否重新填写？'
      });
      confirmPopup.then(function(res){
        if (res) {
          $('.grzl-sj input').val("").focus();
        }else{}
      });
    }
    else{
    $rootScope.$broadcast('officephonenumberjt',cc);
    window.history.back();
    }
  };
})

//个人资料之个人邮箱
.controller('grzlyxCtrl',function($scope,$ionicPopup,localStorageService,$rootScope){
  var u = localStorageService.get('User');
  $scope.psionemail='';

  //聚焦
  $('.grzl-sj input').focus(function(){
    $(this).next().show();
  });

 //清空
  $scope.deletephoneNumber=function(){
    $('.grzl-sj input').val("").blur().next().hide();
  }
  //完成
  $scope.jtfinishdate=function(){
   var cc=$('.grzl-sj input').val();
   if(!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(cc)){
    var confirmPopup=$ionicPopup.confirm({
      title:'邮箱地址错误！',
      template:'您输入的邮箱地址有误，是否重新填写？'
    });
    confirmPopup.then(function(res){
      if (res) {
         $('.grzl-sj input').val("").focus();

      }else{

      }
    })
   }
   else{
    $rootScope.$broadcast('userEmail',cc);
    window.history.back();
   }
 }
})

//个人资料之个人签名
.controller('grqmCtrl',function($scope,$ionicPopup,localStorageService,$rootScope){
  var u = localStorageService.get('User');
  $scope.signature='';
  //完成
  $scope.jtfinishdate=function () {
    var cc = $('.grzl-sj textarea').val();
    var confirmPopup=$ionicPopup.confirm({
      title:'确认！',
      template:'确认提交个人签名？',
      buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
        text: '取消',
        type: 'btn btn-default',
        onTap: function(e) {
          // 当点击时，e.preventDefault() 会阻止弹窗关闭。
        }
      }, {
        text: '确定',
        type: 'btn btn-primary',
        onTap: function(e) {
          // 返回的值会导致处理给定的值。
          if (e) {
          $rootScope.$broadcast('userSignature',cc);
          window.history.back();}
        }
      }]
    });
  //   confirmPopup.then(function (res) {
  //     if (res) {
  //       $rootScope.$broadcast('userSignature',cc);
  //       window.history.back();
  //     } else {
  //     }
  //   })
  };
})

//账号与安全，修改密码和手势密码
.controller('securityCtrl', function($scope, $window, $state, $timeout, localStorageService, UserService, alertService){
  $scope.pushNotification = { checked: true };
  $scope.emailNotification = 'Subscribed';
  var user = localStorageService.get("User");
  $scope.userNo = user.userNo;
  var obj = {
    "userId" : user.userId,
    "useGesture" : user.useGesture
  };
  if(user.useGesture === 0) {
    $("#editGes").hide();
    $scope.pushNotification.checked = false;
  }
  $scope.useGesture = function () {
    if($scope.pushNotification.checked === true) {
      obj.useGesture = 1;
      UserService.updateUser(obj).then(function (data) {
        if (data.status === 1) {
          $("#editGes").show();
          //更新localStorageService
          user.useGesture = 1;
          localStorageService.set("User", user);
        }
      });
    } else {
      obj.useGesture = 0;
      obj.keyboardLock = '';
      localStorageService.remove("gesTime");
      localStorageService.remove("gesTimeoutStatus");
      UserService.updateUser(obj).then(function (data) {
        if (data.status === 1) {
          $("#editGes").hide();
          //更新localStorageService
          user.useGesture = 0;
          user.keyboardLock = '';
          localStorageService.set("User", user);
        }
      });
    }
  };
})

//设置
.controller('settingCtrl', function($scope, $state, $stateParams, $timeout, $http, jMessageService, versionUpdateService, ConfigService, appVersionService, localStorageService, $ionicActionSheet, $ionicPopup, $cordovaAppVersion, $cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2, $ionicLoading) {
  $scope.currentVersion = "";
  $cordovaAppVersion.getVersionNumber().then(function (version) {
    $scope.currentVersion = version;
  });
  $scope.isAndroid = false;
  if (device.platform === "Android") {
    $scope.isAndroid = true;
  }
  var hideSheet;
  // 菜单键
  $scope.onHardwareMenuKeyDown = function() {
    hideSheet = $ionicActionSheet.show({
      titleText: '检查更新',
      /*buttons: [
        { text: '关于' }
      ],*/
      destructiveText: '检查更新',
      cancelText: '取消',
      cancel: function () {
        // add cancel code..
      },
      destructiveButtonClicked: function () {
        //检查更新
        checkUpdate();
      },
      buttonClicked: function (index) {

      }
    });
  };

  // 检查更新
  function checkUpdate() {
    setTimeout(function() {
      hideSheet();
    },100);
    versionUpdateService.checkAppUpdate(false);
  }

  $scope.quit = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: '退出登录提示',
       template: '您确定需要退出登录吗？',
       cancelText: '取消',
       okText: '确定'
     });
     confirmPopup.then(function(res) {
       if(res) {
          localStorageService.remove("User");
          localStorageService.remove("gesTime");
          localStorageService.remove("gesTimeoutStatus");
          localStorageService.remove("processJson");
          jMessageService.logout();
          $state.go('login');
       } else {
         return;
       }
     });
  };

})

//更新密码
.controller('editPasswordCtrl', function($scope, $stateParams,UserService,localStorageService, alertService, commonService) {
  var user = localStorageService.get("User");
  //保存
  $scope.save = function () {
    if(user.password === $("#oldPassword").val() || user.password === commonService.getPswMD5Str($("#oldPassword").val())) {
      if($("#newPassword").val() === $("#confirmPassword").val() && $.trim($("#newPassword").val()) != '') {
        //验证密码正确，后更新
        var obj = {
          "userId" : user.userId
        };
        obj.password = $("#newPassword").val();
        UserService.updateUser(obj).then(function (data) {
          if (data.status === 1) {
            user.password = commonService.getPswMD5Str($("#newPassword").val());
            localStorageService.set("User", user);
            alertService.showAlert($scope, "密码设置成功!", true, "success", 'tab.setting');
            $("#oldPassword").val("");
            $("#newPassword").val("");
            $("#confirmPassword").val("");
          }
        });
      } else {
        alertService.showAlert($scope, "新密码与确认密码应相同且密码不能为空!", true, "fail", null);
      }
    } else{
      alertService.showAlert($scope, "原密码错误!", true, "fail", null);
    }
  }

})

.controller('walletCtrl', function($scope, $state, $cordovaGeolocation, RewardService, localStorageService, $ionicPopup, NetworkService, ToastService) {
    var userId = localStorageService.get("User").userId;
    //获取钱包总金额
    RewardService.getWalletByUser(userId).then(function (data) {
      $scope.walletCount = data;
    });

    $scope.checkRe=function(event){
      //自己配置
      $state.go('transactionRecord');
    };

    $scope.takeOutMoney = function () {
      ToastService.showShortBottom("提现仅限于年末凭交易记录至公司财务部兑换现金");
    }
})

// 交易记录
.controller('jyjlRCtrl', function($scope, $state, $timeout, RewardService, localStorageService){

  $scope.userId = localStorageService.get("User").userId;

  //获取每条记录对应的来源
  var getResource = function (recordIndex, table, id) {
    RewardService.selFromTableAndId(table, id).then(function (data) {
      $scope.rewards[recordIndex].resource = data;
    });
  }

  RewardService.getRewardsForUser($scope.userId).then(function (data) {
    $scope.rewards = data;
    //获取每条记录的对应的来源的具体信息
    $.each($scope.rewards, function (index, item) {
      getResource(index, item.table, item.rid);
    });
    $timeout(function () {
      $(".jyjl-top").click(function(){
        $(this).next().slideToggle().parent().siblings().children('.jyjl-in').slideUp();
        $(this).children('i:last').toggleClass('ion-ios-arrow-up');
        $(this).parent().siblings('.jyjl').find('.jyj1_right').removeClass('ion-ios-arrow-up').addClass('ion-ios-arrow-down');
        // $(this).parent().siblings('.padding').children('.jyjl-top').children('i:last').css('color','red');
      });
    },50);
  });

  $scope.viewResource = function (reward) {
    console.log(reward);
    switch(reward.modelName) {
    case "工作日报":
      $state.go("reportReply", {reportId:reward.rid, reportType: 1});
      break;
    case "微社区":
      $state.go("tab.community-find", {topicId: reward.rid});
      break;
    }
  }

});
