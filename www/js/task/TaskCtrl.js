angular.module('ssapp.controllers')

//任务管理
.controller('taskCtrl', function($scope, $state, $timeout, commonService, localStorageService, taskService, UserService) {
  commonService.showLoading();

  (function(){
    var mmflag=0;
    //加载
      $('.rwgl-recive').show().siblings().hide();
      $('.rwgl-recive .recive-nostart').show().siblings().hide();
   

    $('.rwgl-title .rwgl-title-left').click(function(){
       mmflag=0;
      $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
      $('.rwgl-recive').show().siblings().hide();
      $('.rwgl-recive .recive-nostart').show().siblings().hide();
      $('.workState ul li').eq(0).addClass('state_on').siblings().removeClass('state_on');
    });
    $('.rwgl-title .rwgl-title-right').click(function(){
      mmflag=1;
      $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
      $('.rwgl-send').show().prev().hide();
      $('.rwgl-send .send-nostart').show().siblings().hide();
      $('.workState ul li').eq(0).addClass('state_on').siblings().removeClass('state_on');
    });

    $('.workState ul li').click(function(){
      $(this).addClass('state_on').siblings().removeClass('state_on');
      var index=$(this).index();
      if(mmflag==0){
        $('.rwgl-recive .receive-div').eq(index).show().siblings().hide();
      }
      else{
        $('.rwgl-send .send-div').eq(index).show().siblings().hide();  
      }

    })

  })($);


  $scope.$on($state.current.name + "-init", function() {
    var userId = localStorageService.get('User').userId;
    var num = 0;
    taskService.getTasksByInitId(userId).then(function (data) {
      $scope.sendTasks = data;     
      num++;
      if(num === 2) commonService.hideLoading();
    });
    taskService.getTasksByExeId(userId).then(function (data) {
      $scope.receiveTasks = data;
      num++;
      if(num === 2) commonService.hideLoading();
    });

    //用于循环完成之后的重新添加事件
    /*$scope.addEvent = function() {
      
    };*/

    $scope.taskDetail = {};
    //添加显示任务详细信息的处理函数
    $scope.fillTaskDetail = function(data) {
      //$scope.taskDetail = data;
      $state.go("tab.rwgl-details", {taskId: data.taskId});
    };

     $scope.fillTaskDetails = function(data) {
      //$scope.taskDetail = data;
      $state.go("rwgl-detail", {taskId: data.taskId});
    };
    
  });
})
//任务查看
.controller('taskFindCtrl', function($scope, $state, $stateParams, $timeout, commonService, localStorageService, taskService, UserService) {
  var taskId = $stateParams.taskId;
  taskService.getTaskById(taskId).then(function (data) {
    // alert(angular.toJson(data));
    $scope.task = data;
  });
})
//任务管理
// .controller('RwglZCtrl', function($scope, $ionicPopup, $timeout) {
//   alert(1);
  
//   // $scope.showConfirm = function() {
//   //   var confirmPopup = $ionicPopup.confirm({
//   //    title: '您确定删除该任务吗？',
//   //    buttons: [
//   //    { text: '取消',type: 'button-positive' },{text: '确定',type: 'button-positive'}],
//   //   });
//   //   confirmPopup.then(function(res) {
//   //    if(res) {
//   //      console.log('You are sure');
//   //    } 
//   //    else {}
//   //   });
//   // };
// })

//任务管理-子页
.controller('RwglCtrl', function($scope, $ionicPopup, $timeout,$state) {
  //  $scope.showConfirm = function() {
  //   var confirmPopup = $ionicPopup.confirm({
  //    title: '您确定提交任务吗？',
  //    buttons: [
  //    { text: '取消',type: 'button-positive' },{text: '确定',type: 'button-positive'}],
  //    // template: '验证码将发送到这个手机号码：18516563651'
  //   });
  //   confirmPopup.then(function(res) {
  //    if(res) {
  //      // console.log('You are sure');
  //    } else {
  //       var confirmPopup = $ionicPopup.confirm({
  //       title: '恭喜！提交成功，请到工作管理中进行查看。',
  //       buttons: [
  //       { text: '取消',type: 'button-positive' },{text: '确定',type: 'button-positive'}],
  //       }); 
  //       confirmPopup.then(function(res) {
  //    if(res) {
  //      // console.log('You are sure');
  //    } else {$state.go('rwgl' ,null);
  //     }
  //   });
  //    }
  //   });
  // };
})

//任务管理
.controller('RwglZCtrl', function($scope, $ionicPopup, $timeout) {




  
  // $(function () {
  //   W_login = {};
  //   W_login.openLogin = function(){
  //       $('#start').click(function(){
  //           $('#one').show();
  //           $('.rwgl-show').css('border-bottom','3px solid #7fcef5');
  //           $('#two').hide();
  //           $('.rwgl-hidden').css('border-bottom','0px');
  //       });
  //   };
  //   W_login.closeLogin = function(){
  //       $('#finish').click(function(){
  //           $('#one').hide();
  //           $('.rwgl-show').css('border-bottom','0px');
  //           $('#two').show();
  //           $('.rwgl-hidden').css('border-bottom','3px solid #7fcef5');
  //       });
  //   };
  //   W_login.run = function () {
  //       this.closeLogin();
  //       this.openLogin();
  //   };
  //   W_login.run();

  //   P_login = {};
  //   P_login.openLogin = function(){
  //       $('.chakan').click(function(){
  //           $('.rwgl-bg').show();
  //           $('.rwgl-tan').show();
  //       });
  //   };
  //   P_login.closeLogin = function(){
  //       $('#close').click(function(){
  //           $('.rwgl-bg').hide();
  //           $('.rwgl-tan').hide();
  //       });
  //   };
  //   P_login.run = function () {
  //       this.closeLogin();
  //       this.openLogin();
  //   };
  //   P_login.run();
  // });
  // 
  // 
  // 
  // 
  // 


  // $scope.showConfirm = function() {
  //   var confirmPopup = $ionicPopup.confirm({
  //    title: '您确定删除该任务吗？',
  //    buttons: [
  //    { text: '取消',type: 'button-positive' },{text: '确定',type: 'button-positive'}],
  //    // template: '验证码将发送到这个手机号码：18516563651'
  //   });
  //   confirmPopup.then(function(res) {
  //    if(res) {
  //      console.log('You are sure');
  //    } 
  //    else {}
  //   });
  // };
})

//任务管理(新增任务1)
.controller('taskAddCtrl', function($scope, $state, localStorageService, $timeout, taskService, UserService, alertService) {
  datePicker('stDate');
  datePicker('edDate');
  dropDown('exPlan', '<span class="show-icon">请选择任务类别</span>', '请选择任务类别');
  var userId = localStorageService.get('User').userId;
  //初始化下拉框
  UserService.getUsersByPri(userId, 2).then(function (data) {
    $scope.userSelect = data;
    $scope.executorId = userId;
    $timeout(function() {dropDown('exPerson', '<span class="show-icon">请选择执行人</span>', '请选择姓名');},50);
  });
  $scope.task = {
      'initiator': { 'userId': userId },
      'executor': { 'userId': 0}
    };
  
  $scope.addTask = function() {
    $scope.task.fromdate = $("#stDate").val();
    $scope.task.enddate = $("#edDate").val();
    $scope.task.executor.userId = $("#exPerson").val().substring(7);
    $scope.task.category = $("#exPlan_dummy").val();
    //$scope.visit.customer.id = $("#exPerson").val();
    // alert($("#exPerson").val());
    taskService.postTask($scope.task).then(function (data) {
      if (data.status === 1) {
        //alert("任务添加成功!");
        //$state.go('tab.rwgl');
        alertService.showAlert($scope, "任务添加成功!", true, "success", 'tab.rwgl');
      } else {
        alertService.showAlert($scope, data.msg, true, "fail", null);
      }
    });
  };
  
})


//任务管理(新增任务2)
.controller('taskAddCtrlt', function($scope, $state, localStorageService, $timeout, taskService, UserService, alertService) {
  datePicker('stDate');
  datePicker('edDate');
  dropDown('exPlan', '<span class="show-icon">请选择任务类别</span>', '请选择任务类别');
  var userId = localStorageService.get('User').userId;
  //初始化下拉框
  UserService.getUsersByPri(userId, 2).then(function (data) {
    $scope.userSelect = data;
    $scope.executorId = userId;
    $timeout(function() {dropDown('exPerson', '<span class="show-icon">请选择执行人</span>', '请选择姓名');},50);
  });
  $scope.task = {
      'initiator': { 'userId': userId },
      'executor': { 'userId': 0}
    };
  
  $scope.addTask = function() {
    $scope.task.fromdate = $("#stDate").val();
    $scope.task.enddate = $("#edDate").val();
    $scope.task.executor.userId = $("#exPerson").val().substring(7);
    $scope.task.category = $("#exPlan_dummy").val();
    //$scope.visit.customer.id = $("#exPerson").val();
    // alert($("#exPerson").val());
    taskService.postTask($scope.task).then(function (data) {
      if (data.status === 1) {
        //alert("任务添加成功!");
        //$state.go('tab.rwgl');
        alertService.showAlert($scope, "任务添加成功!", true, "success", 'myrwgl');
      } else {
        alertService.showAlert($scope, data.msg, true, "fail", null);
      }
    });
  };
  
});