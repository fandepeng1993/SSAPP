angular.module('ssapp.controllers')

.controller('showIconCtrl', function($scope, $state, commonService, UserService, localStorageService) {
  commonService.showLoading();

  UserService.showMenuIconByPri().then(function (data) {
    commonService.hideLoading();
  });
})

.controller('DashCtrl', function($scope, $state, $cordovaGeolocation, commonService, UserService, localStorageService, $ionicPopup, NetworkService) {
  // 波纹
  Waves.init();
  commonService.showLoading();
  var userId = localStorageService.get("User").userId;
  //var userPri = localStorageService.get("userPri");
  $scope.weekMeetingPri = false;

  UserService.showMenuIconByPri().then(function (data) {
    commonService.hideLoading();
  });
  //UserService.getUserPri(userId).then(function (data) {
    
    /*$.each(userPri, function (index, item) {
      if(item.menuUrl === "manage/weekMeetingMgr/weekMeetingMgr.html") {
        $scope.weekMeetingPri = true;
      }
    });*/
  //});

  $scope.openURL = function() {
    cordova.ThemeableBrowser.open('http://www.xizhi.com/', '_blank', {
      toolbar: {
          height: 44,
          color: '#ffffff'
      },
      title: {
          color: '#000000',
          showPageTitle: true
      },
      closeButton: {
          wwwImage: 'img/back_pressed.png',
          wwwImagePressed:'img/back_pressed.png',
          wwwImageDensity: 2,
          align: 'left',
          event: 'closePressed'
      },
      backButtonCanClose: true
    })
  };

  if (device.platform != "Android") {
    cordova.plugins.diagnostic.getLocationAuthorizationStatus(function(status){
      switch(status){
          case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
          //$scope.requestAuth();
          break;
          case cordova.plugins.diagnostic.permissionStatus.DENIED:
          $scope.requestAuth();
          break;
          case cordova.plugins.diagnostic.permissionStatus.GRANTED:
          break;
          case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
          break;
      }
    }, function(error){
      //console.error("The following error occurred: "+error);
    });
  };

  $scope.requestAuth = function () {
    cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
        switch(status){
            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
            break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED:
            break;
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
            break;
            case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
            break;
        }
    }, function(error){
        //console.error(error);
    }, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);
            
  }
  
  //填充用户资料
  $scope.userName = localStorageService.get('User').userName;
  $scope.signature = localStorageService.get('User').signature;
  if($scope.signature === null || $scope.signature === "") {
    $scope.signature = "您还没有个性签名！";
  }
  if(localStorageService.get('User').photoUrl != "") {
    $scope.img = localStorageService.get('User').photoUrl;
  } else {
    $scope.img = "img/default.png";
  }

  $scope.checkGPS = function() {
      cordova.plugins.diagnostic.isLocationEnabled(function(data) {
          if (data) {
            //alert("GPS已开启");
            $state.go("checking");
          } else {
            $("#background").show();
            $("#check").show();
          }
      },//成功的回调
          function(error) {
              alert(error);
          }//失败的回调);
      );
  };

  $scope.cancel = function () {
    $("#background").hide();
    $("#check").hide();
  };

  $scope.setGPS = function () {
    if (device.platform == "Android") {
      cordova.plugins.diagnostic.switchToLocationSettings();
    } else {
      cordova.plugins.diagnostic.switchToSettings(function(data) {
          //alert("success");
      },//成功的回调
          function(error) {
              //  alert（警告） 对话框
              var alertPopup = $ionicPopup.alert({
                  title: '提示',
                  template: error,
                  buttons:[{
                           text: '确定',
                           type: 'button-positive'
                           }],
              });
              //alert(error);
          }//失败的回调);
      );
    }
    
    $("#background").hide();
    $("#check").hide();
  };

  $scope.viewMyProject = function () {
    $state.go("my.gcxx", {projectId: 0, city: "null"});
  };
});