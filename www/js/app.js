// Ionic ssapp App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ssapp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ssapp.services' is found in services.js
// 'ssapp.controllers' is found in controllers.js
//
angular.module('ssapp', ['ionic', 'ssapp.controllers', 'ssapp.services', 'ssapp.pluginServices', 'ssapp.directives', 'ssapp.filters', 'AppUtils', 'LocalStorageModule', 'ngCordova', 'angularMoment', 'tabSlideBox', 'templates', 'templatestwo', 'ion-gallery'])

.run(function($cordovaStatusbar, $ionicPlatform, $timeout, $rootScope, $ionicLoading, commonService, amMoment, localStorageService, $state, $ionicPopup, $location, $ionicHistory, $cordovaToast, $cordovaKeyboard, Push, versionUpdateService, SQLite, IMChatService, jMessageService) {

  //哪些页面显示tab
  var NoShowPageArr = ['tab.dash','tab.personcenter','tab.visit','tab.message', 'tab.chats', 'my.gcxx', 'my.gslxr', 'my.gjss', 'my.grzx'];
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {
    if (commonService.contains(toState.name, NoShowPageArr)) {
      $rootScope.hideTabs = false;
    } else {
      // console.log(toState.name);
      $rootScope.hideTabs = true;
    }
  });
  /*$rootScope.$on('loading:show', function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  });
  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  });*/
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      // StatusBar.backgroundColorByHexString("#ffffff");
    }

    // set moment locale
    amMoment.changeLocale('zh-cn');

    //推送初始化
    var onDeviceReady = function() {
      Push.init();
      SQLite.init();
    };

    //文件读写操作
    // var datas=null;//datas need write
    // var directory="myConfig";//default directory
    // var fileName="displayPage.txt";//default file name
    // function write(curData,curDirectory,curFileName){
    //     datas=curData;
    //     directory=curDirectory;
    //     fileName=curFileName;
    //     window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemFail);
    // }

    // //获取mobovip目录，如果不存在则创建该目录
    // function onFileSystemSuccess(fileSystem) {
    //     newFile = fileSystem.root.getDirectory(directory, {
    //         create : true,
    //         exclusive : false
    //     }, onDirectorySuccess, onFileSystemFail);
    // }
    // //获取mobovip目录下面的stores.txt文件，如果不存在则创建此文件
    // function onDirectorySuccess(newFile) {
    //     newFile.getFile(fileName, {
    //         create : true,
    //         exclusive : false
    //     }, onFileSuccess, onFileSystemFail);
    // }
    // var curFileEntry;
    // /**
    //  * 获取FileWriter对象，用于写入数据
    //  * @param fileEntry
    //  */
    // function onFileSuccess(fileEntry) {
    //   curFileEntry = fileEntry;
    //   //读取指定目录的文件。
    //   readFile(curFileEntry);
    //     //fileEntry.createWriter(onFileWriterSuccess, onFileSystemFail);
    // }

    // /**
    //  * write datas
    //  * @param writer
    //  */
    // function onFileWriterSuccess(writer) {
    //   //alert("fileName="+writer.fileName+";fileLength="+writer.length+";position="+writer.position);
    //     writer.onwrite = function(evt) {//当写入成功完成后调用的回调函数
    //         console.log("write success");
    //     };
    //     writer.onerror = function(evt) {//写入失败后调用的回调函数
    //         console.log("write error");
    //     };
    //     writer.onabort = function(evt) {//写入被中止后调用的回调函数，例如通过调用abort()
    //         console.log("write abort");
    //     };
    //     // 快速将文件指针指向文件的尾部 ,可以append
    // //  writer.seek(writer.length);
    //     writer.write(datas);//向文件中写入数据
    // //  writer.truncate(11);//按照指定长度截断文件
    // //  writer.abort();//中止写入文件
    // }

    // function onFileSystemFail(error) {
    //     console.log("Failed to retrieve file:" + error.code);
    // }

    // //读取文件
    // function readFile(fileEntry) {
    //     fileEntry.file(function (file) {
    //         var reader = new FileReader();
    //         reader.onloadend = function() {
    //             console.log(this.result);
    //             //alert(new Date().getTime() - oldTime);
    //             //如果内容为1，则正常运行；否则，写入文件，跳转到引导页
    //             if(this.result === "1") {
    //               initFun();
    //             } else {
    //               fileEntry.createWriter(onFileWriterSuccess, onFileSystemFail);
    //               $state.go("show");
    //             }
    //             //fileEntry.createWriter(onFileWriterSuccess, onFileSystemFail);
    //         };
    //         reader.readAsText(file);
    //     }, onErrorReadFile);
    // }

    // //读取文件失败响应
    // function onErrorReadFile(){
    //   console.log("文件读取失败!");
    // }
    // var oldTime = new Date().getTime();
    // write("1","myConfig","displayPage.txt");

    document.addEventListener("jpush.setTagsWithAlias", Push.onTagsWithAlias, false);
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("jpush.openNotification", Push.onOpenNotification, false);
    document.addEventListener("jpush.receiveNotification", Push.onReceiveNotification, false);
    document.addEventListener("jpush.receiveMessage", Push.onReceiveMessage, false);

    /*document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", online, false);*/

    //versionUpdateService.checkAppUpdate(true);
    var initFun = function () {
      var timeoutTask = $timeout(function() {
        $state.go("login");
      }, 3000);
      commonService.appIdIsLegal(localStorageService.get("appId")).then(function (data) {
        if(!$timeout.cancel(timeoutTask)) {
          return;
        }
        if(data === "false") {
          $state.go("login");
        } else {
          localStorageService.remove("gesTime");
          localStorageService.remove("gesTimeoutStatus");
          if(localStorageService.get('User') != null && localStorageService.get('User').keyboardLock != '') {
            //同时登陆极光IM
            jMessageService.init();
            if(localStorageService.get('User') != null && localStorageService.get('lastLoginTime') != null && (new Date().getTime() - localStorageService.get('lastLoginTime') < 24 * 60 * 60 * 1000)) {
              //$state.go("tab.dash");
              $state.go("gesLogin");
            } else {
              $state.go("gesLogin");
              //$state.go("tab.dash");
            }
          } else {
              $state.go("login");
          }
        }
      });
    };
    initFun();
  });

  /*$rootScope.back = function() {//实现返回的函数
      $state.go($rootScope.previousState_name,$rootScope.previousState_params);
  };  */

  //物理返回按钮控制&双击退出应用
  $ionicPlatform.registerBackButtonAction(function (e) {
    function showConfirm() {
      var confirmPopup = $ionicPopup.confirm({
        title: '<strong>确定退出?</strong>',
        template: '你确定要退出吗?退出将舍弃未提交的数据！',
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
            $ionicHistory.goBack();
          }
        }]

      });
    }
    // 登陆页面不能返回
    // var loginArr = ['/login'];
    // if (commonService.contains($location.path(), loginArr)) {
    //   $cordovaKeyboard.close();
    // }
    //路径数组
    var pathArr = ['/tab/daily','/tab/weekly','/tab/officeweekly', '/tab/weeklyplan','/tab/monthly','/tab/rwgl-add','/tab/visit-today-add','/tab/contacts-add','/tab/manage-add','/tab/visitplan','/zlh','/rwzs-add','/zlyy','/my/grzx-add','/tab/ccbg','/myrwgl-add','/tab/saleChanceAdd','/tab/visitplan'];
    var quitPathArr = ['/tab/dash','/gesLogin','/tab/visit','/tab/chats','/tab/message','/login','/tab/personcenter'];

    //判断处于哪个页面时弹出确认菜单
    if (commonService.hasPathInArr($location.path(), pathArr)) {
      showConfirm();
    } else if (commonService.contains($location.path(), quitPathArr)) {
      //判断处于哪个页面时双击退出
      if ($rootScope.backButtonPressedOnceToExit) {
        jMessageService.logout();//先退出极光IM
        ionic.Platform.exitApp();
      } else {
        $rootScope.backButtonPressedOnceToExit = true;
        $cordovaToast.showShortBottom('再按一次退出系统');
        setTimeout(function () {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
    } else if ($ionicHistory.backView()) {
      if ($cordovaKeyboard.isVisible()) {
        $cordovaKeyboard.close();
      } else {
        $ionicHistory.goBack();
      }
    }
    e.preventDefault();
    return false;
  }, 101);
})

.config(function($stateProvider, $httpProvider, $urlRouterProvider, $ionicConfigProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $stateProvider

  // setup an abstract state for the tabs directive
  //第一次展示
  .state('show', {
    url: '/show',
    cache:'false',
    templateUrl: 'templates/login/show.html',
    controller: 'showCtrl'
  })

  //登录
  .state('login', {
    url: '/login',
    cache:'false',
    templateUrl: 'templates/login/login.html',
    controller: 'loginCtrl'
  })
  //注册

  .state('register',{
    url:'/register',
    cache:'false',
    templateUrl:'templates/register/register.html',
    controller:'registerCtrl'
  })
  // 设置密码
  .state('setPwd',{
    url:'/setPwd',
    cache:'false',
    templateUrl:'templates/register/setPwd.html',
    controller:'setPwdCtrl'
  })
  // 获取验证码
  .state('securityCode',{
    url:'/securityCode/:telephone',
    cache:'false',
    templateUrl:'templates/register/getsecurityCode.html',
    controller:'securityCodeCtrl'
  })
  //找回密码
  .state('findPwdCtrl',{
    url:'/findPwdCtrl',
    cache:'false',
    templateUrl:'templates/register/findPwd.html',
    controller:'findPwdCtrl'
  })
  //手势密码登录
  .state('gesLogin', {
    url: '/gesLogin',
    cache:'false',
    templateUrl: 'templates/login/gesLogin.html',
    controller: 'gesLoginCtrl'
  })

  //注册
  /*.state('register', {
    url: '/register',
    templateUrl: 'register.html',
    controller: 'PopupCtrl'
  })*/

  //选择国家
  /*.state('country', {
    url: '/country',
    templateUrl: 'country.html'
  })*/

  //确认密码
  /*.state('confirm', {
    url: '/confirm',
    templateUrl: 'confirm.html'
  })*/

  //社区
  .state('community', {
    url: '/community',
    cache:'true',
    templateUrl: 'templates/community/tab-community.html',
    controller: 'CommunityCtrl'
  })

  //社区
  .state('tab.community-find', {
    url: '/community-find/:topicId',
    cache:'true',
    views: {
      'tab-dash': {
        templateUrl: 'templates/community/tab-community-find.html',
        controller: 'CommunityFindCtrl'
      }
    }
  })

  //社区-发表
  .state('tab.community-write', {
    url: '/community-write',
    cache:'false',
     views: {
      'tab-dash': {
        templateUrl: 'templates/community/tab-community-write.html',
        controller: 'addTopicCtrl'
      }
    }
  })

  //考勤记录
  .state('checkingfind', {
    url: '/checkingfind',
    cache:'false',
    templateUrl: 'templates/attendance/tab-checkingfind.html',
    controller: 'signRecordCtrl'
  })

  //考勤查看
  .state('checkingMap', {
    url: '/checkingMap',
    cache:'false',
    templateUrl: 'templates/attendance/tab-checkingMap.html',
    controller: 'MapShowCtrl'
  })


  //忘记密码
  /*.state('forgetpw', {
    url: '/forgetpw',
    templateUrl: 'forgetpw.html',
    controller:'ForgetCtrl'
  })*/

  //重置密码
  /*.state('resetpw', {
    url: '/resetpw',
    templateUrl: 'resetpw.html',
    controller:'ForgetCtrl'
  })*/

  .state('tab', {
    url: '/tab',
    cache:'false',
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.dash', {
    url: '/dash',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  //个人中心
  .state('tab.personcenter', {
    url: '/personcenter',
    cache:'false',
    views: {
      'tab-personcenter': {
        templateUrl: 'templates/personalCenter/tab-personcenter.html',
        controller: 'DashCtrl'
      }
    }
  })

  //交易记录
  .state('transactionRecord', {
    url: '/transactionRecord',
    cache:'false',
    templateUrl: 'templates/personalCenter/tab-transactionRecord.html',
    controller: 'jyjlRCtrl'
  })



  //个人资料-手机号
  .state('tab.tabgrzl',{
    url:'/tabgrzl',
    cache:'false',
    views:{
      'tab-personcenter':{
        templateUrl:'templates/personalCenter/tab-grzl.html',
        controller: 'finishCtrl'
      }
    }
  })

  //个人资料-集团短号
  .state('tab.tabjtdh',{
    url:'/tabjtdh',
    cache:'false',
    views:{
      'tab-personcenter':{
        templateUrl:'templates/personalCenter/tab-jtdh.html',
        controller: 'jtdhCtrl'
      }
    }
  })

  //个人资料-个人邮箱
  .state('tab.grzlyx',{
    url:'/grzlyx',
    cache:'false',
    views:{
      'tab-personcenter':{
        templateUrl:'templates/personalCenter/tab-grzlyx.html',
        controller: 'grzlyxCtrl'
      }
    }
  })

  //个人资料-个人签名
  .state('tab.grqm',{
    url:'/grqm',
    cache:'false',
    views:{
      'tab-personcenter':{
        templateUrl:'templates/personalCenter/tab-grqm.html',
        controller: 'grqmCtrl'
      }
    }
  })

  //龙虎榜
  .state('lhb', {
    url: '/lhb',
    cache:'false',
    templateUrl: 'templates/salesBillboard/tab-lhb.html',
    controller: 'netInCtrl'
  })

  //龙虎榜
  /*.state('lhb-in', {
    url: '/lhb-in/:fromdate/:enddate',
    cache:'false',
    templateUrl: 'templates/salesBillboard/tab-lhb-in.html',
    controller: 'netInDetailCtrl'
  })*/

  //工具箱
  .state('gjx', {
    url: '/gjx',
    cache:'false',
    templateUrl: 'templates/toolBox/tab-gjx.html',
    controller: 'DashCtrl'
  })

  //不锈钢管
  .state('bxggJsq', {
    url: '/bxggJsq',
    cache:'false',
    templateUrl: 'templates/toolBox/calculator/StainlessSteel.html'
  })

  //不锈钢管
  .state('bxgg', {
    url: '/bxgg/:id',
    cache:'false',
    templateUrl: 'templates/toolBox/calculator/Stainless.html',
    controller:'bxggJsqCtrl'
  })

  //投票系统
  .state('tpxt',{
    url:'/tpxt',
    cache: false,
    templateUrl:'templates/toolBox/toupiaostysem/list_toupiao.html',
    controller:'listTpCtrl',
    resolve:{
      gettplist:function($http,ConfigService,commonService,localStorageService){
         return $http.get(ConfigService.getHost() + "/ssVoteAdmin/votesByUserId/" + localStorageService.get('User').userId + commonService.getReqParamStr());
      }
    }
  })

 .state('tpxt_xq',{
    url:'/tpxt_xq/:voteID/:voteEnd/:voteStart/:VoteTitle',
    // params:{'voteID':null},
    cache:false,
    templateUrl:'templates/toolBox/toupiaostysem/toupiaostysem.html',
    controller:'voteCtrl',
    resolve:{
      getallquestionrs:function($http,ConfigService,commonService,localStorageService,$stateParams){
      return $http.get(ConfigService.getHost() + "/ssVoteAdmin/getAllDatasByVoteId/" + $stateParams.voteID + commonService.getReqParamStr());
      }
    }
  })

 .state('watchtable',{
  url:'/watchtable',
  params:{VoteTitles:null,voteID:null},
  cache:false,
  templateUrl:'templates/toolBox/toupiaostysem/watchTbale.html',
  controller:'watchTCtrl',
  resolve:{
    getAllDatas:function($http,ConfigService,commonService,localStorageService,$stateParams){
       //commonService.showLoading();
       return $http.get(ConfigService.getHost() + "/ssVoteAdmin/getResultsByVoteId/" + $stateParams.voteID + commonService.getReqParamStr());
    }
  }
 })

  //入网证书
  .state('rwzs', {
    url: '/rwzs',
    cache:'false',
    templateUrl: 'templates/netInCertificate/tab-rwzs.html',
    controller: 'RyzsCtrl'
  })

  //入网证书添加
  .state('rwzs-add', {
    url: '/rwzs-add',
    cache:'false',
    templateUrl: 'templates/netInCertificate/tab-rwzs-add.html' ,
    controller: 'netInAddCtrl'
  })

  //订单发货统计信息
  .state('ddfh-sjtj', {
    url: '/ddfh-sjtj',
    cache:'false',
    templateUrl: 'templates/toolBox/orderDelivery/tab-ddfh-sjtj.html',
    controller: 'DdfhCtrl'
  })

  //工作简报
  .state('gzjb', {
    url: '/gzjb',
    cache:'false',
    templateUrl: 'templates/workBriefing/tab-gzjb.html',
    controller: 'BriefingCtrl'
  })

  //个人资料
  .state('tab.persondata', {
    url: '/persondata',
    cache:'true',
    views: {
      'tab-personcenter': {
        templateUrl: 'templates/personalCenter/tab-persondata.html',
        controller: 'SaveCtrl'
      }
    }
  })

  //设置
  .state('tab.setting', {
    url: '/setting',
    cache:'false',
    views: {
      'tab-personcenter': {
        templateUrl: 'templates/personalCenter/tab-setting.html',
        controller: 'DashCtrl'
      }
    }
  })

  //我的钱包
  .state('mywallet',{
    url:'/mywallet',
    cache:'false',
    templateUrl:'templates/personalCenter/tab-myWallet.html',
    controller:'walletCtrl'
  })

  //账号与安全
  .state('tab.securityaccount', {
    url: '/securityaccount',
    cache:'false',
    views: {
      'tab-personcenter': {
        templateUrl: 'templates/personalCenter/tab-securityaccount.html',
        controller: 'editPasswordCtrl'
      }
    }
  })

  //账号与安全
  .state('tab.securitypw', {
    url: '/securitypw',
    cache:'false',
    views: {
      'tab-personcenter': {
        templateUrl: 'templates/personalCenter/tab-securitypw.html',
        controller: 'securityCtrl'
      }
    }
  })

  //手势
  .state('gesture', {
    url: '/gesture',
    cache:'false',
    templateUrl: 'templates/personalCenter/tab-gesture.html',
    controller: 'passwordCtrl'
  })

  //身份验证
  .state('sfyz', {
    url: '/sfyz/:isLogin',
    cache:'false',
    templateUrl: 'templates/personalCenter/tab-sfyz.html',
    controller: 'resetGestureCtrl'

  })

  //账号与安全-修改密码
  .state('tab.securitypassword', {
    url: '/securitypassword',
    cache:'false',
    views: {
      'tab-personcenter': {
        templateUrl: 'templates/personalCenter/tab-securitypassword.html',
        controller: 'DashCtrl'
      }
    }
  })

  // 工作日报
  .state('tab.daily', {
    url: '/daily',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/dailyReport/tab-daily.html',
        controller: 'dReportCtrl'
      }
    }
  })

  // 补填工作日报
  .state('tab.fillDaily', {
    url: '/fillDaily',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/dailyReport/tab-fillDaily.html',
        controller: 'dReportCtrl'
      }
    }
  })

  // 工作周报
  .state('tab.weekly', {
    url: '/weekly',
  cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/weekReport/tab-weekly.html',
        controller: 'wReportCtrl'
      }
    }
  })

  // 部门周报
  .state('tab.officeweekly', {
    url: '/officeweekly',
  cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/dwReport/tab-officeweekly.html',
        controller: 'dwReportCtrl'
      }
    }
  })

  // 周工作计划
  .state('tab.weeklyplan', {
    url: '/weeklyplan',
  cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/weekPlan/tab-weeklyplan.html',
        controller: 'wPlanCtrl'
      }
    }
  })

  // 月度总结
  .state('tab.monthly', {
    url: '/monthly',
  cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/monthReport/tab-monthly.html',
        controller: 'mReportCtrl'
      }
    }
  })

  // 任务管理
  .state('tab.rwgl', {
    url: '/rwgl',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/task/tab-rwgl.html',
        controller: 'taskCtrl'
      }
    }
  })

 .state('myrwgl',{
    url:'/myrwgl',
    cache:'false',
      templateUrl: 'templates/task/tab-myrwgl.html',
      controller: 'taskCtrl'
  })

  // 任务管理-任务详情
  .state('tab.rwgl-details', {
    url: '/rwgl-details/:taskId',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/task/tab-rwgl-details.html',
        controller: 'taskFindCtrl'
      }
    }
  })
  .state('rwgl-detail', {
    url: '/rwgl-detail/:taskId',
    cache:'false',
    templateUrl: 'templates/task/tab-rwgl-detail.html',
    controller: 'taskFindCtrl'
  })

  // 任务管理-新增任务
  .state('tab.rwgl-add', {
    url: '/rwgl-add',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/task/tab-rwgl-add.html',
        controller: 'RwglCtrl'
      }
    }
  })
  .state('myrwgl-add', {
    url: '/myrwgl-add',
    cache:'false',
    templateUrl: 'templates/task/myrwgl-add.html',
    controller: 'RwglCtrl'

  })

  // 工作圈
  .state('gzq', {
    url: '/gzq',
    cache:'true',
      templateUrl: 'templates/workCircle/tab-gzq.html',
      controller: 'GzqCtrl'
  })

  // 质量异议-查看
  .state('zlyy-find', {
    url: '/zlyy-find',
    cache:'false',
    templateUrl: 'templates/toolBox/qualityObjection/tab-zlyy-find.html',
    controller: 'qualityObjCtrl'
  })

  // 质量异议-提交
  .state('zlyy', {
    url: '/zlyy/:qualityObjId',
    cache:'false',
    templateUrl: 'templates/toolBox/qualityObjection/tab-zlyy.html',
    controller: 'ZlyyCtrl'
  })

  // 周例会-详情-新增
  .state('zlh', {
    url: '/zlh/:uid/:week',
    cache:'false',
    templateUrl: 'templates/toolBox/weekMeeting/tab-zlh.html',
    controller: 'ZlhCtrl'
  })

  // 周例会
  .state('zlh-find', {
    url: '/zlh-find',
    cache:'false',
    templateUrl: 'templates/toolBox/weekMeeting/tab-zlh-find.html',
    controller: 'ZlhFindCtrl'
  })

  // 日报评论
   .state('reportReply', {
    url: '/dReportReply/:reportId/:reportType',
    cache:'false',
    templateUrl: 'templates/workCircle/tab-dReportReply.html',
    controller: 'dReportReplyCtrl'
  })

  // 平台数据
  .state('tab.sjsj', {
    url: '/sjsj',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/platformData/tab-sjsj.html',
        controller: 'dataController'
      }
    }
  })

  // 平台数据-部门
  .state('tab.sjsj-dept', {
    url: '/sjsj-dept/:deptId/:deptName',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/platformData/tab-sjsj-dept.html',
        controller: 'deptDataCtrl'
      }
    }
  })

  // 平台数据-部门-详细信息
  .state('tab.sjsj-in', {
    url: '/sjsj-in/:dataId',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/platformData/tab-sjsj-in.html',
        controller: 'dataDetailCtrl'
      }
    }
  })

  // 考勤管理
  .state('checking', {
    url: '/checking',
    cache:'false',
    templateUrl: 'templates/attendance/tab-checking.html',
    controller: 'MapCtrl'
  })

  //公告
  .state('tab.notice', {
    url: '/notice',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/deptNotice/tab-notice.html',
        controller: 'noticeCtrl'
      }
    }
  })

  //公告-查看
  .state('tab.notice-find', {
    url: '/notice-find/:noticeId',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/deptNotice/tab-notice-find.html',
        controller: 'noticeDetailCtrl'
      }
    }
  })

  //工作总结
  /*.state('tab.summary', {
    url: '/summary',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'tab-summary.html',
        controller: 'DashCtrl'
      }
    }
  })*/

  //员工考核
  .state('tab.assess', {
    url: '/assess',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/check/tab-assess.html',
        controller:'assessCtrl'
      }
    }
  })

  //员工积分记录查看
  .state('tab.scoreRecords', {
    url: '/scoreRecords',
    cache:'false',
    views: {
      'tab-personcenter': {
        templateUrl: 'templates/check/tab-scoreRecords.html',
        controller:'scoreRecordsCtrl'
      }
    }
  })

  //工作总结-查看
  /*.state('tab.summary-looking', {
    url: '/summary-looking',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'tab-summary-looking.html'
      }
    }
  })*/

  //关于我们
  /*.state('tab.aboutus', {
    url: '/aboutus',
    views: {
      'tab-dash': {
        templateUrl: 'tab-aboutus.html',
        controller: 'DashCtrl'
      }
    }
  })*/

  //用户反馈
  /*.state('tab.feedback', {
    url: '/feedback',
    views: {
      'tab-dash': {
        templateUrl: 'tab-feedback.html',
        controller: 'DashCtrl'
      }
    }
  })*/

  //服务条款
  /*.state('tab.servicelist', {
    url: '/servicelist',
    views: {
      'tab-dash': {
        templateUrl: 'tab-servicelist.html',
        controller: 'DashCtrl'
      }
    }
  })*/

  // 出差报告列表
  .state('ccbg-find', {
    url: '/ccbg-find',
    cache:'false',
    templateUrl: 'templates/busTripReport/tab-ccbg-find.html',
    controller: 'CcbgFindCtrl'
  })

  // IT权限录入申请
  .state('itPermissions',{
    url: '/itPermissions',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/itPermissions.html',
    controller: 'itPerCtrl'
  })

  // 流程管理
  .state('processMg',{
    url: '/processMg',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/processManagelist.html',
    controller: 'processCtrl'
  })

  // 流程管理处理
  .state('processManage',{
    url: '/processManage',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/processManage.html',
    controller: 'processManageCtrl'
  })

  // 待处理流程详情查看
  .state('processWaitTodoDetail',{
    url: '/processWaitTodoDetail/:taskId/:processDefinitionKey',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/processWaitTodoDetail.html',
    controller: 'processWaitTodoDetailCtrl'
  })

  //流程管理详情查看
  .state('viewProcessDetail',{
    url: '/viewProcessDetail/:proId/:processDefinitionKey/:type',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/viewProcessDetail.html',
    controller: 'viewProcessDetailCtrl'
  })

  // 流程取回
  .state('ProcessRecovery',{
    url: '/ProcessRecovery',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/ProcessRecovery.html',
    controller: 'ProcessRecoveryCtrl'
  })

  // 发起流程
  .state('sendProcess',{
    url: '/sendProcess',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/sendProcess.html',
    controller: 'sendProcessCtrl'
  })

  // 待处理流程
  .state('ProcessToTreated',{
    url: '/ProcessToTreated',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/ProcessToTreated.html',
    controller: 'ProcessToTreatedCtrl'
  })

  // 查看通知
  .state('ViewNotification',{
    url: '/ViewNotification',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/ViewNotification.html',
    controller: 'ViewNotificationCtrl'
  })

  // 补卡单
  /*.state('cardReplacement', {
    url: '/cardReplacement',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/tab-cardReplacement.html',
    controller: 'cardRCtrl'
  })

  // 加班单
  .state('overtime', {
    url: '/overtime',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/tab-overtime.html',
    controller: 'overTimeCtrl'
  })

  // 请假单
  .state('leave', {
    url: '/leave',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/tab-leave.html',
    controller: 'overTimeCtrl'
  })*/

  // 发起流程
  .state('addProcessForm', {
    url: '/addProcessForm/:processDefinitionKey',
    cache:'false',
    templateUrl: 'templates/ProcessManagement/tab-addProcessForm.html',
    controller: 'addProcessCtrl'
  })

  // 发起流程列表页
  .state('sendProcessListDetails',{
    url:'/sendProcessListDetails/:managename',
    cache:'false',
    templateUrl:'templates/ProcessManagement/sendProcessListDetails.html',
    controller:'sendProcessListDetailsCtrl'
  })

  // 财务管理
  .state('finacial',{
    url:'/finacial',
    cache:'false',
    templateUrl:'templates/financial/financial.html',
    controller:'finacialCtrl'
  })

  // 销售管理
  .state('salectrl',{
    url:'/salectrl',
    cache:'false',
    templateUrl:'templates/salectrl/salemanage.html',
    controller:'salemanagectrl'
  })

  // 添加出差报告
  .state('tab.ccbg', {
    url: '/ccbg/:visitId',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/busTripReport/tab-ccbg.html',
        controller: 'CcbgCtrl'
      }
    }

  })

  // 查看出差报告
  .state('ccbg-view', {
    url: '/ccbg-view/:id',
    cache:'false',
    templateUrl: 'templates/busTripReport/tab-ccbg-view.html',
    controller: 'CcbgViewCtrl'
  })

  // 通讯文件
  /*.state('tab.bbbb', {
    url: '/bbbb',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/communication/filesdata.html',
        controller:'txfilectrl'
      }
    }
  })*/

  // // 通讯文件
  // .state('tab.bbbb', {
  //   url: '/bbbb',
  //   cache:'false',
  //   views: {
  //     'tab-dash': {
  //       templateUrl: 'templates/message/shoucang.html',
  //       controller:'shoucangCtrl'
  //     }
  //   }
  // })

  //拜访
  .state('tab.visit', {
    url: '/visit',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-visit.html',
        controller: 'todayVisitCtrl'
      }
    }
  })

  //今日拜访
  .state('tab.visit-today', {
    url: '/visit-today',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-visit-today.html'
      }
    }
  })

  //历史拜访
  .state('tab.visit-history', {
    url: '/visit-history',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-visit-history.html',
        controller: 'historyVisitCtrl'
      }
    }
  })

  //销售机会
  .state('tab.saleChance', {
    url: '/saleChance',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-saleChance.html',
        controller: 'saleChanceCtrl'
      }
    }
  })

  //销售机会添加
  .state('tab.saleChanceAdd', {
    url: '/saleChanceAdd',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-saleChanceAdd.html',
        controller: 'saleChanceAddCtrl'
      }
    }
  })

  //销售机会详情
  .state('tab.saleChanceDetail', {
    url: '/saleChanceDetail/:id',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-saleChanceDetail.html',
        controller: 'saleChanceDetailCtrl'
      }
    }
  })

  //客户资料
  /*.state('tab.history-client', {
    url: '/history-client/:customerId',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'tab-history-client.html',
        controller: 'cusDetailCtrl'
      }
    }
  })*/

  //添加拜访
  .state('tab.visit-today-add', {
    url: '/visit-today-add',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-visit-today-add.html',
        controller: 'visitAddCtrl'
      }
    }
  })

  //添加拜访成功
  .state('tab.visit-today-success', {
    url: '/visit-today-success',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-visit-today-success.html',
        controller: 'todayVisitLookingCtrl'
      }
    }
  })

  //联系人添加
  .state('tab.contacts-add', {
    url: '/contacts-add/:customerId/:customerName',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/customer/tab-contacts-add.html',
        controller: 'addContactCtrl'
      }
    }
  })

  //添加拜访查看
  .state('tab.visit-looking', {
    url: '/visit-looking/:visitId',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-visit-watch.html',
        controller: 'visitLookingCtrl'
      }
    }
  })

  //客户管理
  .state('tab.manage', {
    url: '/manage',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/customer/tab-manage.html',
        controller: 'cusCtrl'
      }
    }
  })

  //客户管理-首页
  .state('tab.manage-index', {
    url: '/manage-index/:customerId',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/customer/tab-manage-index.html',
        controller: 'cusDetailCtrl'
      }
    }
  })

  //客户管理联系人
  .state('tab.manage-kh', {
    url: '/manage-kh/:contactId',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/customer/tab-manage-kh.html',
        controller: 'contactDetailCtrl'
      }
    }
  })

  //客户管理-搜索
  /*.state('tab.manage-search', {
    url: '/manage-search',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'tab-manage-search.html',
        controller: 'cusCtrl'
      }
    }
  })*/

  //客户管理-添加
  .state('tab.manage-add', {
    url: '/manage-add',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/customer/tab-manage-add.html',
        controller: 'cusAddCtrl'
      }
    }
  })

  //添加回访记录
  .state('tab.visitplan', {
    url: '/visitplan/:customerId/:customerName/:visitId',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-visitplan.html',
        controller: 'addVisitRCtrl'
      }
    }
  })

  //回访记录
  .state('tab.backvisit', {
    url: '/backvisit/:visitRecordId',
    cache:'false',
    views: {
      'tab-account': {
        templateUrl: 'templates/visit/tab-backvisit.html',
        controller: "visitRecordCtrl"
      }
    }
  })

  //RFID首页
  .state('tab.chats', {
    url: '/chats',
    cache: 'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'showIconCtrl'
      }
    }
  })

  //单件流
  .state('tab.djl', {
    url: '/djl',
    cache:'true',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/onepieceflow/tab-djl.html',
        controller: "vofCtrl"
      }
    }
  })

  //单件流详情
  .state('tab.djl-xq', {
    url: '/djl-xq/:producemBillno',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/onepieceflow/tab-djl-xq.html',
        controller: "vofDetailCtrl"
      }
    }
  })

  //单件流数据统计
  .state('tab.djl-sjtj', {
    url: '/djl-sjtj/:producemBillno',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/onepieceflow/tab-djl-sjtj.html',
        controller: 'BtCtrl'
      }
    }
  })

  //生产台账
  .state('tab.sctz', {
    url: '/sctz',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/peopleReport/tab-sctz.html',
        controller: 'vprCtrl'
      }
    }
  })

  //生产台账-数据统计
  .state('tab.sctz-sjtj', {
    url: '/sctz-sjtj',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/peopleReport/tab-sctz-sjtj.html',
        controller: 'peopleReportChartCtrl'
      }
    }
  })

  //生产台账-优秀员工
  .state('tab.sctz-yxyg', {
    url: '/sctz-yxyg',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/peopleReport/tab-sctz-yxyg.html',
        controller: 'goodUserCtrl'
      }
    }
  })

  //生产工单查询
  .state('tab.scgd', {
    url: '/scgd',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/proMWorkOrder/tab-scgd.html',
        controller: 'pwoCtrl'
      }
    }
  })

  //超排程
  .state('tab.cpc', {
    url: '/cpc',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/workflowTimeout/tab-cpc.html',
        controller: 'wftoCtrl'
      }
    }
  })

  //超排程-统计表
  .state('tab.cpc-tjb', {
    url: '/cpc-tjb',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/workflowTimeout/tab-cpc-tjb.html',
        controller: 'CpcCtrl'
      }
    }
  })

  //生产报废
  .state('tab.scbf', {
    url: '/scbf',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/scrapReport/tab-scbf.html',
        controller: 'vsrCtrl'
      }
    }
  })

  //生产报废-数据统计
  .state('tab.scbf-sjtj', {
    url: '/scbf-sjtj',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/scrapReport/tab-scbf-sjtj.html',
        controller: 'ScbfCtrl'
      }
    }
  })

  //生产异常
  .state('tab.scyc', {
    url: '/scyc',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/proException/tab-scyc.html',
        controller: 'vpeCtrl'
      }
    }
  })

  //生产异常-图表
  .state('tab.scyc-tb', {
    url: '/scyc-tb',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/proException/tab-scyc-tb.html',
        controller: 'ScycCtrl'
      }
    }
  })

  //荒管投料
  .state('tab.hgtl', {
    url: '/hgtl',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/dailyfeedingtube/tab-hgtl.html',
        controller: 'vdftCtrl'
      }
    }
  })

  //成品查询
  .state('tab.cpcx', {
    url: '/cpcx',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/workflowComplete/tab-cpcx.html',
        controller: 'vwfcCtrl'
      }
    }
  })

  //成品查询-数据统计
  .state('tab.cpcx-sjtj', {
    url: '/cpcx-sjtj',
    cache:'false',
    views: {
      'tab-chats': {
        templateUrl: 'templates/mes/workflowComplete/tab-cpcx-sjtj.html',
        controller: 'CpcxCtrl'
      }
    }
  })

  //打包查询
  .state('dbcx', {
    url: '/dbcx',
    cache:'false',
    templateUrl: 'templates/mes/chkPackage/tab-dbcx.html',
    controller: 'chkpCtrl'
  })

  //打包查询-数据统计
  .state('dbcx-sjtj', {
    url: '/dbcx-sjtj',
    cache:'false',
    templateUrl: 'templates/mes/chkPackage/tab-dbcx-sjtj.html',
    controller: 'DbcxCtrl'
  })

  //产品库存简报
  .state('ccjb', {
    url: '/ccjb',
    cache:'false',
    templateUrl: 'templates/mes/wmsProduct/tab-ccjb.html',
    controller: 'wmsBriefingCtrl'
  })

  //产品库存
  .state('cpkc', {
    url: '/cpkc/:code/:codeName',
    cache:'false',
    templateUrl: 'templates/mes/wmsProduct/tab-cpkc.html',
    controller: 'wmsProductCtrl'
  })

  //我的订单
  .state('ddcx', {
    url: '/ddcx',
    cache:'false',
    templateUrl: 'templates/mes/deliverySchedule/tab-ddcx.html',
    controller: 'dSchedulesCtrl'
  })

  //我的订单-数据统计
  .state('ddcx-sjtj', {
    url: '/ddcx-sjtj',
    cache:'false',
    templateUrl: 'templates/mes/deliverySchedule/tab-ddcx-sjtj.html',
    controller: 'ddcxSCtrl'
  })

  //出货记录查询
  .state('fhjl', {
    url: '/fhjl',
    cache:'false',
    templateUrl: 'templates/mes/lSenderBillLog/tab-fhjl.html',
    controller: 'lsblCtrl'
  })

  // 知识库
  .state('tab.zsk', {
    url: '/zsk',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/knowledge/tab-zsk.html'
        // templateUrl: 'templates/knowledge/tab-gszsk.html',
        // controller: 'deptKnowledgeCtrl'
      }
    }
  })

  // 部门知识库
  .state('tab.gszsk', {
    url: '/gszsk',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/knowledge/tab-gszsk.html',
        controller: 'deptKnowledgeCtrl'
      }
    }
  })

  // 类别知识库
  .state('tab.lbzsk', {
    url: '/lbzsk',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/knowledge/tab-lbzsk.html',
        controller: 'categoryKnowledgeCtrl'
      }
    }
  })

  // 部门知识库知识列表
  .state('tab.xszy', {
    url: '/xszy/:deptName/:category',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/knowledge/tab-xszy.html',
        controller: 'deptKnowLDetailCtrl'
      }
    }
  })

  // 知识库-暂无文件
  /*.state('tab.zsk-zwwj', {
    url: '/zsk-zwwj',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'tab-zsk-zwwj.html'
      }
    }
  })*/

  // 通讯录
  .state('tab.txl', {
    url: '/txl',
    cache:'true',
    views: {
      'tab-dash': {
        templateUrl: 'templates/phoneList/tab-txl.html',
        controller: 'TxlCtrl'

         // templateUrl: 'templates/phoneList/tab-txl-find.html',
         // controller: 'txlDetailCtrl'

      }
    }
  })

  // 通讯录
  .state('tab.txl-find', {
    url: '/txl-find/:userId',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'templates/phoneList/tab-txl-find.html',
        controller: 'txlDetailCtrl'
      }
    }
  })

  // 部门知识库
  /*.state('tab.bmzsk', {
    url: '/bmzsk',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'tab-bmzsk.html'
      }
    }
  })*/

  // 我的知识库
  /*.state('tab.wdzsk', {
    url: '/wdzsk',
    cache:'false',
    views: {
      'tab-dash': {
        templateUrl: 'tab-wdzsk.html'
      }
    }
  })*/

  // 消息
  .state('tab.message', {
    url: '/message',
    cache:'false',
    views: {
      'tab-message': {
        templateUrl: 'templates/message/tab-message.html',
        controller: 'messageCtrl'
      }
    }
  })

  // 位置
  .state('locationplace', {
    url: '/locationplace',
    cache:'false',
    templateUrl: 'templates/message/locationplace.html',
    controller: 'localctrl'
  })

  // 收藏
  .state('shoucang', {
    url: '/shoucang',
    cache:'false',
    templateUrl: 'templates/message/shoucang.html',
    controller: 'shoucangCtrl'
  })

  // 文件
  .state('sousou', {
    url: '/sousou',
    cache:'false',
    templateUrl: 'templates/message/sousou.html',
    controller: 'shoucangCtrl'
  })

  .state('messageDetail', {
    url: '/messageDetail/:targetId/:targetType',
    cache:'false',
    templateUrl: "templates/message/message-detail.html",
    controller: "messageDetailCtrl"
  })

  // 群管理
  .state('groupManage', {
    url: '/groupManage/:targetId',
    cache: 'false',
    templateUrl: "templates/message/tab-groupManage.html",
    controller: "groupManageCtrl"
  })

  // 用户管理
  .state('useRmanage', {
    url: '/useRmanage/:targetId',
    cache: 'false',
    templateUrl: "templates/message/useRmanage.html",
    controller: "useRmangerCtrl"
  })

  //添加群聊
  .state('addGroupc', {
    url: '/addGroupc',
    cache: 'false',
    templateUrl: "templates/message/addGroupc.html",
    controller: "addGroCtrl"
  })

  //查找聊天记录
  .state('findtalkrecord', {
    url: '/findtalkrecord/:targetId/:targetType',
    cache: 'false',
    templateUrl: "templates/message/findtalkrecord.html",
    controller: 'viewChatRecordCtrl'
  })

  //消息
  .state('system-message', {
    url: '/system-message/:category',
    cache:'false',
    templateUrl: 'templates/message/tab-system-message.html',
    controller: 'msgDetailCtrl'
  })

  //群名称
  .state('qmc', {
    url: '/qmc/:groupId/:groupName',
    cache:'false',
    templateUrl: 'templates/message/tab-qmc.html',
    controller: 'qmcCtrl'
  })

  //群公告
  .state('groupDesc', {
    url: '/groupDesc/:groupId/:groupDesc',
    cache:'false',
    templateUrl: 'templates/message/tab-groupDesc.html',
    controller: 'groupDescCtrl'
  })

  //群成员管理
  .state('mgrGroupMembers', {
    url: '/mgrGroupMembers/:groupId/:type',
    cache:'false',
    templateUrl: 'templates/message/mgrGroupMembers.html',
    controller: 'mgrGroupMembersCtrl'
  })

  /*.state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })*/

  //我的项目
  .state('my', {
    url: '/my',
    cache:'false',
    templateUrl: 'templates/project/my.html',
    controller: 'MyCtrl'

  })

  //工程信息
  .state('my.gcxx', {
    url: '/gcxx/:projectId/:city',
    cache:'false',
    views: {
      'my-gcxx': {
        templateUrl: 'templates/project/my-gcxx.html',
        controller: 'GcxxCtrl'
      }
    }
  })

  //工程信息搜索
  .state('gcxx-search', {
    url: '/gcxx-search',
    cache:'false',
    templateUrl: 'templates/project/my-gcxx-search.html',
    controller: 'GcxxSearchCtrl'
  })

  //工程信息-地区
  .state('gcxx-area', {
    url: '/gcxx-area',
    cache:'false',
    templateUrl: 'templates/project/my-gcxx-area.html',
    controller: 'GcxxAreaCtrl'
  })

  //工程信息-项目详情
  .state('gcxx-xmxq', {
    url: '/gcxx-xmxq/:projectId',
    cache:'false',
    templateUrl: 'templates/project/my-gcxx-xmxq.html',
    controller: 'projectDetailCtrl'
  })

  //工程信息-路线导航-选择
  .state('gcxx-lxdh', {
    url: '/gcxx-lxdh/:fromPoint/:endPoint/:endAddress',
    cache:'false',
    templateUrl: 'templates/project/my-gcxx-lxdh.html',
    controller: 'routeNavCtrl'
  })

  //工程信息-路线导航-确定
  .state('gcxx-lxdh-ck', {
    url: '/gcxx-lxdh-ck/:fromPoint/:endPoint/:type',
    cache:'false',
    templateUrl: 'templates/project/my-gcxx-lxdh-ck.html',
    controller: 'showRouteNavCtrl'
  })

  //公司联系人搜索
  .state('my.gslxr', {
    url: '/gslxr',
    views: {
      'my-gslxr': {
        templateUrl: 'templates/project/my-gslxr.html',
        controller: 'searchPcontactCtrl'
      }
    }
  })

  //联系人搜索-联系人列表
  .state('my.gslxr-lxrlb', {
    url: '/gslxr-lxrlb',
    cache: 'false',
    views: {
      'my-gslxr': {
        templateUrl: 'templates/project/my-gslxr-lxrlb.html',
        controller: 'viewPcontactsCtrl'
      }
    }
  })

  //联系人搜索-所在地
  .state('my.gslxr-place', {
    url: '/gslxr-place/:type',
    cache: 'false',
    views: {
      'my-gslxr': {
        templateUrl: 'templates/project/my-gslxr-place.html',
        controller: 'GslxrPlaceCtrl'
      }
    }
  })

  //项目搜索-所在地
  .state('my.gjss-place', {
    url: '/gjss-place/:type',
    cache: 'false',
    views: {
      'my-gjss': {
        templateUrl: 'templates/project/my-gjss-place.html',
        controller: 'GslxrPlaceCtrl'
      }
    }
  })

  //高级搜索
  .state('my.gjss', {
    url: '/gjss',
    views: {
      'my-gjss': {
        templateUrl: 'templates/project/my-gjss.html',
        controller: 'searchProjectCtrl'
      }
    }
  })

  //my’s跟进任务
  .state('my.grzx', {
    url: '/grzx',
    views: {
      'my-grzx': {
        templateUrl: 'templates/project/my-grzx.html',
        controller:'grzxctrl'
      }
    }
  })

  //跟进任务添加
  .state('my.grzx-add', {
    url: '/grzx-add',
    cache:'false',
    views: {
      'my-grzx': {
        templateUrl: 'templates/project/my-grzx-add.html',
        controller:'grzxMyctrl'
      }
    }
  })

  //跟进任务查看
  .state('my.grzx-find', {
    url: '/grzx-find/:id',
    cache:'false',
    views: {
      'my-grzx': {
        templateUrl: 'templates/project/my-grzx-find.html',
        controller:'viewGrzxCtrl'
      }
    }
  })

  //高级搜索-项目列表
  .state('my.gjss-xmlb', {
    url: '/gjss-xmlb',
    cache: 'false',
    views: {
      'my-gjss': {
        templateUrl: 'templates/project/my-gjss-xmlb.html',
        controller: 'viewProjectsCtrl'
      }
    }
  })

  //公司、联系人-选择职能
  .state('gslxr-function', {
    url: '/gslxr-function',
    templateUrl: 'templates/project/my-gslxr-function.html',
    controller: 'GslxrFunctionCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  //第一次展示
  //$urlRouterProvider.otherwise('/show');
  //登录页面
  //$urlRouterProvider.otherwise('/login');
  //知识库
  //$urlRouterProvider.otherwise('/tab/zsk');
  //公司知识库
  //$urlRouterProvider.otherwise('/tab/gszsk');
  //销售资源
  //$urlRouterProvider.otherwise('/tab/xszy');
  //销售资源-暂无文件
  //$urlRouterProvider.otherwise('/tab/zsk-zwwj');
  //销售资源-文件
  //$urlRouterProvider.otherwise('/tab/zsk-wj');
  //部门知识库
  //$urlRouterProvider.otherwise('/tab/bmzsk');
  //我的知识库
  //$urlRouterProvider.otherwise('/tab/wdzsk');
  //通讯录
  //$urlRouterProvider.otherwise('/tab/txl');
  //通讯录查看
  //$urlRouterProvider.otherwise('/tab/txl-find');
  //注册上上
  //$urlRouterProvider.otherwise('/register');
  //选择国家
  //$urlRouterProvider.otherwise('/country');
  //注册上上确认密码
  //$urlRouterProvider.otherwise('/confirm');
  //忘记密码
  //$urlRouterProvider.otherwise('/forgetpw');
  //重置密码
  //$urlRouterProvider.otherwise('/resetpw');
  //工作
  //$urlRouterProvider.otherwise('/tab/dash');
  //工作日报
  //$urlRouterProvider.otherwise('/tab/daily');
  //工作周报
  //$urlRouterProvider.otherwise('/tab/weekly');
  //部门周报
  //$urlRouterProvider.otherwise('/tab/officeweekly');
  //周工作计划
  //$urlRouterProvider.otherwise('/tab/weeklyplan');
  //月度总结
  //$urlRouterProvider.otherwise('/tab/monthly');
  //任务管理
  //$urlRouterProvider.otherwise('/tab/rwgl');
  //任务管理-新增任务
  //$urlRouterProvider.otherwise('/tab/rwgl-add');
  //工作圈
  //$urlRouterProvider.otherwise('/tab/gzq');
  //平台数据
  //$urlRouterProvider.otherwise('/tab/sjsj');
  //平台数据-销售部
  //$urlRouterProvider.otherwise('/tab/sjsj-xsb');
  //平台数据-详细信息
  //$urlRouterProvider.otherwise('/tab/sjsj-in');
  //考勤管理
  //$urlRouterProvider.otherwise('/tab/checking');
  //公告
  //$urlRouterProvider.otherwise('/tab/notice');
  //公告查看
  //$urlRouterProvider.otherwise('/tab/notice-find');
  //工作总结
  //$urlRouterProvider.otherwise('/tab/summary');
  //工作总结-拜访信息
  //$urlRouterProvider.otherwise('/tab/summary-looking');
  //个人中心
  //$urlRouterProvider.otherwise('/tab/personcenter');
  //个人资料
  //$urlRouterProvider.otherwise('/tab/persondata');
  //设置
  //$urlRouterProvider.otherwise('/tab/setting');
  //账号与安全
  //$urlRouterProvider.otherwise('/tab/securitypw');
  //手势
  //$urlRouterProvider.otherwise('/gesture');
  //账号与安全
  //$urlRouterProvider.otherwise('/tab/securityaccount');
  //账号与安全-修改密码
  //$urlRouterProvider.otherwise('/tab/securitypassword');
  //关于我们
  //$urlRouterProvider.otherwise('/tab/aboutus');
  //意见反馈
  //$urlRouterProvider.otherwise('/tab/feedback');
  //服务条款
  //$urlRouterProvider.otherwise('/tab/servicelist');
  //拜访
  //$urlRouterProvider.otherwise('/tab/visit');
  //今日拜访
  //$urlRouterProvider.otherwise('/tab/visit-today');
  //历史拜访
  //$urlRouterProvider.otherwise('/tab/visit-history');
  //客户管理
  //$urlRouterProvider.otherwise('/tab/manage');
  //客户管理-搜索
  //$urlRouterProvider.otherwise('/tab/manage-search');
  //客户管理-添加
  //$urlRouterProvider.otherwise('/tab/manage-add');
  //客户资料
  //$urlRouterProvider.otherwise('/tab/history-client');
  //添加拜访
  //$urlRouterProvider.otherwise('/tab/visit-today-add');
  //添加拜访成功
  //$urlRouterProvider.otherwise('/tab/visit-today-success');
  //添加拜访成功查看
  //$urlRouterProvider.otherwise('/tab/visit-looking');
  //RFID首页
  //$urlRouterProvider.otherwise('/tab/chats');
  //单件流
  //$urlRouterProvider.otherwise('/tab/djl');
  //单件流详情
  //$urlRouterProvider.otherwise('/tab/djl-xq');
  //单件流-数据统计图
  //$urlRouterProvider.otherwise('/tab/djl-sjtj');
  //生产台账查询
  //$urlRouterProvider.otherwise('/tab/sctz');
  //生产台账查询-优秀员工
  //$urlRouterProvider.otherwise('/tab/sctz-yxyg');
  //生产工单查询
  //$urlRouterProvider.otherwise('/tab/scgd');
  //超排程
  //$urlRouterProvider.otherwise('/tab/cpc');
  //超排程-统计表
  //$urlRouterProvider.otherwise('/tab/cpc-tjb');
  //生产报废
  //$urlRouterProvider.otherwise('/tab/scbf');
  //生产报废-数据统计
  //$urlRouterProvider.otherwise('/tab/scbf-sjtj');
  //生产异常
  //$urlRouterProvider.otherwise('/tab/scyc');
  //生产异常-图表
  //$urlRouterProvider.otherwise('/tab/scyc-tb');
  //荒管投料
  //$urlRouterProvider.otherwise('/tab/hgtl');
  //成品查询
  //$urlRouterProvider.otherwise('/tab/cpcx');
  //成品查询-数据统计
  //$urlRouterProvider.otherwise('/tab/cpcx-sjtj');
  //打包查询
  //$urlRouterProvider.otherwise('/tab/dbcx');
  //打包查询-数据统计
  //$urlRouterProvider.otherwise('/tab/dbcx-sjtj');
  //库存查询
  //$urlRouterProvider.otherwise('/tab/cpkc');
  //消息
  //$urlRouterProvider.otherwise('/tab/message');
  //客户管理-首页
  //$urlRouterProvider.otherwise('/tab/manage-index');
  //客户管理-首页
  //$urlRouterProvider.otherwise('/tab/manage-kh');
  //联系人添加
  //$urlRouterProvider.otherwise('/tab/manage-add');

  //$httpProvider.interceptors.push('httpInterceptor');
});
