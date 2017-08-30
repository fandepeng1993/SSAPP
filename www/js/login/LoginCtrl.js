angular.module('ssapp.controllers')

.controller('showCtrl', function($scope, $state, localStorageService) {
  // $scope.change = function(index){
  //   if(index === 3) {
  //     $('.slider-pager').hide();
  //   } else {
  //     $('.slider-pager').show();
  //   }
  //   //$('.slider-pager').show();
  //   //$ionicSlideBoxDelegate.previous();
  // };
  $scope.login = function(){
    var user = localStorageService.get("User");
    if(user === null) {
      $state.go('login');
    } else {
      $state.go('tab.dash');
    }
    
  };



})

.controller('loginCtrl', function($scope, $timeout, $stateParams, $state, $ionicLoading, $ionicModal, $ionicPopup, $ionicHistory, $cordovaBarcodeScanner, localStorageService, UserService, ShareService, jMessageService, _, ToastService) {

  $scope.register = function(){
      $state.go('register');
    
  };
  /*var time = new Date().getTime();
  $scope.topOne = function(){
    time = new Date().getTime();
    $(".scroll-content").css("top","-150px");
  };
  $scope.topTwo = function(){
    time = new Date().getTime();
    $(".scroll-content").css("top","-200px");
  };

  $("#userNo").on("blur", function () {
    if(new Date().getTime() - time < 20) {
      return;
    }
    $(".scroll-content").css("top","0px");
  })
  $("#password").on("blur", function () {
    if(new Date().getTime() - time < 20) {
      return;
    }
    $(".scroll-content").css("top","0px");
  })*/

  Waves.init();
  $scope.user = {};
  //根据是否记住密码进行初始化
  $scope.rememberPw = localStorageService.get("rememberPw");
  if($scope.rememberPw) {
    $("#rememberPwCB").parent().addClass("active");
  }
  if($scope.rememberPw) {
    $scope.user.userNo = localStorageService.get("account");
    $scope.user.password = localStorageService.get("password");
  }
  $scope.rememberPwFun = function () {
    if($("#rememberPwCB").parent().hasClass('active')){
      $("#rememberPwCB").parent().removeClass("active");
      localStorageService.set("rememberPw", false);
      localStorageService.remove("account");
      localStorageService.remove("password");
    }else{
      $("#rememberPwCB").parent().addClass("active");
      localStorageService.set("rememberPw", true);
    }
  //   if($("#rememberPwCB").is(':checked')) {
  //     localStorageService.set("rememberPw", true);
  //   } else {
  //     localStorageService.set("rememberPw", false);
  //     localStorageService.remove("account");
  //     localStorageService.remove("password");
  //   }
  };

  if($scope.rememberPw === null) $scope.rememberPw = false;
  $scope.login = function() {
    if (!$scope.user.userNo) {
      angular.element(document.querySelector('#status'))
          .removeClass('ng-hide')
          .addClass('ng-show');
      angular.element(document.querySelector('#status'))
          .text(" 用户名不能为空！");
      return;
    }
    if (!$scope.user.password) {
      angular.element(document.querySelector('#status'))
          .removeClass('ng-hide')
          .addClass('ng-show');

      angular.element(document.querySelector('#status'))
          .text(" 密码不能为空！");
      return;
    }      
    var User = localStorageService.get('User');
    //如果选择了记住密码，则保存账号密码
    if(localStorageService.get("rememberPw")) {
      localStorageService.set("account", $scope.user.userNo);
      localStorageService.set("password", $scope.user.password);
    }
    UserService.login($scope.user).then(function (data) {
      if (data != "null") {
        //localStorageService.set('User', JSON.stringify($scope.user));
        //判断是否一致
        localStorageService.set('appId', data.appId);
        if(data.user.phoneId != localStorageService.get("registrationId")) {
          data.user.phoneId = localStorageService.get("registrationId");
          var userJson = {
            "userId": data.user.userId,
            "phoneId": localStorageService.get("registrationId")
          };
          //更新用户的phoneId
          UserService.updateUser(userJson).then(function (result) {
            if(result.status == 1) {
              localStorageService.set('User', data.user);
              localStorageService.set('lastLoginTime', new Date().getTime());
              //登陆成功跳转
              $state.go("tab.dash");
              //同时登陆极光IM
              jMessageService.login(data.user.userNo);
              $('#status').css("display","none");  
            }
          });
          //极光推送设置别名
          //window.plugins.jPushPlugin.setAlias(data.userId);
          localStorageService.set('User', data.user);
          UserService.getUserPri(data.user.userId).then(function (data) {
            localStorageService.set('userPri', data);
          });
        } else {
          localStorageService.set('User', data.user);
          localStorageService.set('lastLoginTime', new Date().getTime());
          UserService.getUserPri(data.user.userId).then(function (data) {
            localStorageService.set('userPri', data);
          }); 
        }
        //登陆成功跳转
        $state.go("tab.dash");
        //同时登陆极光IM
        jMessageService.init();
        $('#status').css("display","none");  
      } 
      else {
       angular.element(document.querySelector('#status'))
        .removeClass('ng-hide')
        .addClass('ng-show');

      angular.element(document.querySelector('#status'))
        .text(" 用户名或密码错误！");
      return;
      }
    });
  };
  // 分享
  $scope.share = function () {
    ToastService.showShortBottom("该功能尚未开放，敬请期待！");
  };

})

//密码锁屏登陆
.controller('gesLoginCtrl', function($scope, $window, $state, $timeout, LoginService, localStorageService, UserService, alertService){
  $scope.user = localStorageService.get("User");
  if($scope.user.photoUrl === "") {
    $scope.user.photoUrl = "img/default.png";
  }
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
                  $state.go('tab.dash');
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
                  alertService.showAlert($scope, "手势密码设置成功!", true, "success", 'tab.dash');
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
    $state.go("sfyz", {isLogin: 1});
  };
});