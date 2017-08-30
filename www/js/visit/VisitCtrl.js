angular.module('ssapp.controllers')

//拜访信息查看
.controller('todayVisitCtrl', function($scope, $filter, $state, $timeout, commonService, localStorageService, visitService) {
  $scope.chararcterArr = new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
  if($state.current.name != "tab.visit") {
    commonService.showLoading();
  }
  //$scope.$on($state.current.name + "-init", function() {
    $scope.xianshi = function(){
      $('.bg-zuihou').show();
    };
    $scope.yincang = function(){
      $('.bg-zuihou').hide();
    };  
    var userId = localStorageService.get('User').userId;
    $('#calendar').mobiscroll().calendar({
      theme: 'mobiscroll',
      lang: 'zh',
      display: 'inline',
      layout: 'liquid',
      min: new Date(2012, 8, 15),
      max: new Date(2023, 8, 14),
      monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      onDayChange: function(event, inst) {
          var curDate = event.date;
          $scope.currentDay = $filter('date')(curDate,'yyyy-MM-dd');

          $scope.searchDTO = {
            'userId': userId,
            'fromdateEnd': $scope.currentDay,
            'enddateBegin': $scope.currentDay
          };
          //拜访列表初始化
          visitService.searchVisit($scope.searchDTO).then(function (data) {
            //$scope.customerLength = data.length;
            $scope.historyVisits = data;
            
            //$scope.typemodel.unshift({id:1,typeName:'全部'});
          });

          $scope.visitDetail = {};
          //添加显示任务详细信息的处理函数,向下一个页面传参visitId
          $scope.fillVisitDetail = function(data) {
            $scope.visitDetail = data;
            //跳转页面并传参
            $state.go('tab.visit-looking', {visitId: data.id});
          };
      }
    });
    var myDate = new Date();
    var myJsDate=$filter('date')(myDate,'yyyy-MM-dd');
    $scope.currentDay = myJsDate;
    //alert(myJsDate);
    $scope.searchDTO = {
      'userId': userId,
      'fromdate': myJsDate,
      'enddate': myJsDate
    };
    //点击今日拜访后根据有没有今日拜访信息来确定跳转页面
    $scope.lookTodayVisit = function() {
       setTimeout(function() {$('.bg-zuihou').hide();},500);
      visitService.searchVisit($scope.searchDTO).then(function (data) {
        $scope.todayVisits = data;
        $scope.visitLength = data.length;
        if(data.length === 0) {
          //今日没有拜访，跳转页面
          $state.go('tab.visit-today');
        } else {
          $state.go('tab.visit-today-success');
        }
        //$scope.typemodel.unshift({id:1,typeName:'全部'});
      });
    };

    //获取该用户今日拜访信息并填充
    visitService.searchVisit($scope.searchDTO).then(function (data) {
      $scope.historyVisits = data;
      $scope.visitLength = data.length;
      commonService.hideLoading();
      //$scope.typemodel.unshift({id:1,typeName:'全部'});
    });

    $scope.visitDetail = {};
    //添加显示任务详细信息的处理函数,向下一个页面传参visitId
    $scope.fillVisitDetail = function(data) {
      $scope.visitDetail = data;
      //跳转页面并传参
      $state.go('tab.visit-looking', {visitId: data.id});
    };

    // bootstrap右侧按钮
    $(function () { 
      $("[data-toggle='popover']").popover();
    });
  //});

})

// 回访记录添加
.controller('addVisitRCtrl', function($scope, $state,$ionicHistory, $stateParams, $timeout, localStorageService, visitRecordService, alertService) {
  $scope.back = function(){
    $ionicHistory.goBack();
  };
  dateTimePicker('startDate');
  var userId = localStorageService.get("User").userId;
  //取页面传过来的参数
  var customerId = $stateParams.customerId;
  var visitId = $stateParams.visitId;
  $scope.customerName = $stateParams.customerName;

  $scope.visitRecord = {
    "creator": {"userId": userId},
    "customer": {"id": customerId},
    "visit": {"visitId": visitId}
  };
  
  $scope.addVisitRecord = function() {
    $scope.visitRecord.specVisitTime = $("#startDate").val();//wpx
    visitRecordService.postVisitRecord($scope.visitRecord).then(function (data) {
      if (data.status === 1) {
        //alert("客户添加成功!");
        //$state.go('tab.manage');
        alertService.showAlert($scope, "回访记录添加成功!", true, "success", null);
        setTimeout(function() {
          $state.go('tab.visit-looking', {visitId: visitId});
        }, 1000);
      } else {
        alertService.showAlert($scope, data.msg, true, "fail", null);
      }
    });
  };
})

//历史拜访（根据权限获取拜访计划）
.controller('historyVisitCtrl', function($scope, $state, commonService, localStorageService, visitService, $ionicHistory, _) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.hasData = true;
    var userId = localStorageService.get('User').userId;
    $scope.searchDTO = {
        'userId': userId
      };
    //获取该用户历史拜访信息并填充
    visitService.searchVisitWithPri($scope.searchDTO).then(function (data) {
      $scope.historyArr = _.groupBy(data, function(item) {
        return item.fromdate;
      });
      $scope.hasData = false;
      for(var i in $scope.historyArr) {
        $scope.hasData = true;
      }
      commonService.hideLoading();
      //$scope.historyVisits = data;
      //$scope.typemodel.unshift({id:1,typeName:'全部'});
    });
    
    $scope.visitDetail = {};
    //添加显示任务详细信息的处理函数,向下一个页面传参visitId
    $scope.fillVisitDetail = function(data) {
      $scope.visitDetail = data;
      //跳转页面并传参
      $state.go('tab.visit-looking', {visitId: data.id});
    };

    $scope.searchInVisit = function() {
      var searchText = $scope.searchText;
      $scope.searchDTO = {
        'userId': userId,
        'customerName': searchText
      };
      //客户列表初始化
      visitService.searchVisitWithPri($scope.searchDTO).then(function (data) {
        //$scope.customerLength = data.length;
        //$scope.historyVisits = data;
        $scope.historyArr = _.groupBy(data, function(item) {
          return item.fromdate;
        });
        $scope.hasData = false;
        for(var i in $scope.historyArr) {
          $scope.hasData = true;
        }
        //$scope.typemodel.unshift({id:1,typeName:'全部'});
      });
    };
  });
})

//今日拜访信息查看
.controller('todayVisitLookingCtrl', function($scope, $filter, $state, commonService, localStorageService, visitService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    var userId = localStorageService.get('User').userId;
    var myDate = new Date();
    var myJsDate=$filter('date')(myDate,'yyyy-MM-dd');
    $scope.currentDay = myJsDate;
    //alert(myJsDate);
    $scope.searchDTO = {
      'userId': userId,
      'fromdate': myJsDate,
      'enddate': myJsDate
    };
    //获取该用户今日拜访信息并填充
    visitService.searchVisit($scope.searchDTO).then(function (data) {
      $scope.todayVisits = data;
      $scope.visitLength = data.length;
      commonService.hideLoading();
      //$scope.typemodel.unshift({id:1,typeName:'全部'});
    });

    $scope.visitDetail = {};
    //添加显示任务详细信息的处理函数,向下一个页面传参visitId
    $scope.fillVisitDetail = function(data) {
      $scope.visitDetail = data;
      //跳转页面并传参
      $state.go('tab.visit-looking', {visitId: data.id});
    };
  });
})

//拜访添加
.controller('visitAddCtrl', function($scope, $state, $ionicHistory, $filter, $timeout, localStorageService, visitService, cusService, contactService, alertService) {
  $scope.open = function(){
    // $ionicScrollDelegate.$getByHandle('mainScroll').resize();
    $("#expand").toggle(1500);
    if($("#open i").hasClass("ion-arrow-up-b")) {
      $("#open i").removeClass('ion-arrow-up-b');
      $("#open i").addClass('ion-arrow-down-b positive');
    } else {
      $("#open i").removeClass('ion-arrow-down-b positive');
      $("#open i").addClass('ion-arrow-up-b');
    }
  };

  $scope.back = function(){
    $ionicHistory.goBack();
  };

  var area1 = new LArea();
  area1.init({
      'trigger': '#demo1', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
      'valueTo': '#value1', //选择完毕后id属性输出到该位置
      'keys': {
          id: 'value',
          name: 'text'
      }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
      'type': 2, //数据源类型
      'data': [provs_data, citys_data, dists_data] //数据源
  }); 
  
  dropDown('traffic','<span class="show-icon">请选择交通工具</span>','请选择交通工具');
  dropDown('reason','<span class="show-icon">请选择出差事由</span>','请选择出差事由');

  datePicker('startdate');
  datePicker('enddate');

  $scope.arryst=[""];
  
  $scope.add=function(){
    $scope.arryst.push("");
    var i=$scope.arryst.length;
    setTimeout(function() {
      $("textarea[name='tripPlan']").eq(i-1).focus();
    });
  };

  $scope.removesbtn=function(index){
    $scope.arryst.splice(index,1);
  };

  var userId = localStorageService.get('User').userId;
  var searchDTO = {
    "salesmanIds": [userId]
  };
  //客户列表初始化，获取单个用户的所属客户
  cusService.getCusesByDTO(searchDTO).then(function (data) {
    $scope.cusSelect = data;
    $timeout(function() {dropDown('customerId', '<span class="show-icon">请选择客户名称</span>', '请选择客户名称');},50);
  });

  //根据客户获取联系人列表
  $("#customerId").change(function() {
    var customerId = $("#customerId").val().substring(7);
    contactService.getContactsByCusId(customerId).then(function(data) {
      $scope.contacts = data;
      $timeout(function() {dropDown('contactId','<span class="show-icon">请选择联系人姓名</span>', '请选择联系人姓名');},50);
      console.log("联系人列表", data);
    });
  });

  //根据联系人的相关信息自动填充职务和手机号
  $("#contactId").change(function() {
    var contactId = $("#contactId").val();
    contactId = contactId.substring(7);
    $.each($scope.contacts, function(index, item) {
      if(item.id === parseInt(contactId)) {
        $scope.visitPlan.contactPosition = item.position;
        $scope.visitPlan.contactTel = item.telephone === "" ? item.officeTel : item.telephone;
        $scope.$apply();
      }
    });
  });

  //事由完成后的天数标准确定
  $("#reason").change(function() {
    var reason = $("#reason_dummy").val();
    switch(reason) {
    case "对账":case "收款":case "回访":
      $scope.minDays = 1;
      $scope.maxDays = 2;
      break;
    case "拜访":case "来访":case "入网":case "会议":case "签单":case "跟货":case "催款":case "质量处理":case "展会（国内）":
      $scope.minDays = 2;
      $scope.maxDays = 3;
      break;
    case "投标":
      $scope.minDays = 3;
      $scope.maxDays = 5;
      break;
    case "展会（国外）":
      $scope.minDays = 5;
      $scope.maxDays = 7;
      break;
    }
    $scope.$apply();
  });
  //初始赋值
  $scope.minDays = 2;
  $scope.maxDays = 3;

  $scope.getSumCount = function(visitPlan) {
    var trafficExpense = parseFloat(visitPlan.trafficExpense) ? parseFloat(visitPlan.trafficExpense): 0;
    var hotelExpense = parseFloat(visitPlan.hotelExpense) ? parseFloat(visitPlan.hotelExpense): 0;
    var receptionExpense = parseFloat(visitPlan.receptionExpense) ? parseFloat(visitPlan.receptionExpense): 0;
    var otherExpense = parseFloat(visitPlan.otherExpense) ? parseFloat(visitPlan.otherExpense): 0;
    var result = trafficExpense + hotelExpense + receptionExpense + otherExpense;
    return result.toFixed(2);
  };

  $scope.dateDeffer = 0;
  $("#startdate").change(function() {
    $scope.dateDeffer = $filter("dateDefference")($("#startdate").val(), $("#enddate").val());
    $scope.dateDeffer = $scope.dateDeffer ? $scope.dateDeffer : 0;
    $scope.$apply();
  });
  $("#enddate").change(function() {
    $scope.dateDeffer = $filter("dateDefference")($("#startdate").val(), $("#enddate").val());
    $scope.dateDeffer = $scope.dateDeffer ? $scope.dateDeffer : 0;
    $scope.$apply();
  });
  
  $scope.visitPlan = {
      'user': { 'userId': userId },
      'customer': { 'id': 0},
      'contact': {'id': 0}
    };
  
  $scope.addVisit = function() {
    $scope.visitPlan.reason = $("#reason_dummy").val();
    $scope.visitPlan.traffic = $("#traffic_dummy").val();
    $scope.visitPlan.fromdate = $("#startdate").val();
    $scope.visitPlan.enddate = $("#enddate").val();
    $scope.visitPlan.customer.id = $("#customerId").val().substring(7);
    $scope.visitPlan.contact.id = $("#contactId").val().substring(7);
    var tripPlanArr = $("textarea[name='tripPlan']");
    var tripPlanStr = "";
    for(var i=0; i<tripPlanArr.length; i++) {
      if(tripPlanArr.eq(i).val() != "")
        tripPlanStr = tripPlanStr + (i+1) + "." + tripPlanArr.eq(i).val() + "<br>";
    }
    $scope.visitPlan.tripPlan = tripPlanStr;

    if(checkData($scope.visitPlan)) {
      visitService.postVisit($scope.visitPlan).then(function (data) {
        if (data.status === 1) {
          alertService.showAlert($scope, "拜访添加成功!", true, "success", null);
          setTimeout(function() {$state.go('tab.visit-history');}, 1000);
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
        }
      });
    };
  };

  //数据验证
  var checkData = function(obj) {
    var telReg = /^1(3|4|7|5|8)([0-9]{9})$/;
    var officeTelReg = /(^400[0-9]{7}$)|(^800[0-9]{7}$)|(^0[0-9]{2,3}-[0-9]{7,8}$)/;
    if(!obj.customer.id){
      alertService.showAlert($scope, "请选择客户名称!", true, "warning", null);
      return false;
    } else if(!obj.contact.id){
      alertService.showAlert($scope, "请选择联系人!", true, "warning", null);
      return false;
    } else if(!obj.contactPosition){
      alertService.showAlert($scope, "请输入联系人职务!", true, "warning", null);
      return false;
    } else if(!telReg.test($.trim(obj.contactTel)) && !officeTelReg.test($.trim(obj.contactTel))) {
      alertService.showAlert($scope, "请正确输入联系人电话!", true, "warning", null);
      return false;
    } else if(!obj.reason){
      alertService.showAlert($scope, "请输入出差事由!", true, "warning", null);
      return false;
    } else if(!obj.address){
      alertService.showAlert($scope, "请输入拜访地址!", true, "warning", null);
      return false;
    } else if(!obj.target || obj.target.length < 30){
      alertService.showAlert($scope, "出差目的长度不得少于30字!", true, "warning", null);
      return false;
    } else if(!obj.traffic){
      alertService.showAlert($scope, "请输入交通工具!", true, "warning", null);
      return false;
    } else if(!obj.tripPlan){
      alertService.showAlert($scope, "请输入行程规划!", true, "warning", null);
      return false;
    } else if(!obj.fromdate){
      alertService.showAlert($scope, "请输入开始时间!", true, "warning", null);
      return false;
    } else if(!obj.enddate){
      alertService.showAlert($scope, "请输入结束时间!", true, "warning", null);
      return false;
    } else if(!obj.trafficExpense || isNaN(obj.trafficExpense)){
      alertService.showAlert($scope, "请正确输入交通费!", true, "warning", null);
      return false;
    } else if(!obj.hotelExpense || isNaN(obj.hotelExpense)){
      alertService.showAlert($scope, "请正确输入住宿费!", true, "warning", null);
      return false;
    } else if(!obj.receptionExpense || isNaN(obj.receptionExpense)){
      alertService.showAlert($scope, "请正确输入招待费!", true, "warning", null);
      return false;
    } else {
      if($scope.dateDeffer > $scope.maxDays) {
        alertService.showAlert($scope, "抱歉，出差天数超标，请重新选择开始、结束时间!", true, "warning", null);
        return false;
      }
    }
    return true;
  };
})

//拜访详细信息查看
.controller('visitLookingCtrl', function($scope, $state, $filter, $ionicHistory, $stateParams, commonService, localStorageService, visitService, alertService) {
  commonService.showLoading();
  $scope.back = function() {
    window.history.go(-1);
  };
  var userId = localStorageService.get("User").userId;
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };
    //取页面传过来的visitId参数
    var visitId = $stateParams.visitId;

    visitService.getVisitById(visitId).then(function (data) {
      $scope.visitDetail = data;
      $scope.dateDeffer = $filter("dateDefference")($scope.visitDetail.fromdate, $scope.visitDetail.enddate);
      var reason = $scope.visitDetail.reason;
      switch(reason) {
      case "对账":case "收款":case "回访":
        $scope.minDays = 1;
        $scope.maxDays = 2;
        break;
      case "拜访":case "来访":case "入网":case "会议":case "签单":case "跟货":case "催款":case "质量处理":case "展会（国内）":
        $scope.minDays = 2;
        $scope.maxDays = 3;
        break;
      case "投标":
        $scope.minDays = 3;
        $scope.maxDays = 5;
        break;
      case "展会（国外）":
        $scope.minDays = 5;
        $scope.maxDays = 7;
        break;
      }

      commonService.hideLoading();
    });

    $scope.addBtReport = function () {
      if(userId === $scope.visitDetail.user.userId) {
        $state.go("tab.ccbg", {visitId:visitId});
      } else {
        alertService.showAlert($scope, "抱歉！您不是该拜访计划的填写人，无法添加出差报告！", true, "warning", null);
      }
    };
  });

})

// 回访记录查看
.controller('visitRecordCtrl', function($scope, $state, $stateParams, commonService, visitRecordService, $ionicHistory) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };
    //取页面传过来的visitRecordId参数
    $scope.visitRecord = {};
    var visitRecordId = $stateParams.visitRecordId;
    visitRecordService.getVisitRecordById(visitRecordId).then(function (data) {
      $scope.visitRecord = data;
      commonService.hideLoading();
    });
  });
})

// 销售机会查看
.controller('saleChanceCtrl', function($scope, $state, $stateParams, commonService, saleChanceService, localStorageService, $ionicHistory) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };

    var userId = localStorageService.get("User").userId;
    
    saleChanceService.getSaleChancesByUid(userId).then(function (data) {
      $scope.saleChances = data;
      commonService.hideLoading();
    });

    $scope.showDetail = function (id) {
      $state.go("tab.saleChanceDetail",{id: id});
    }
  });
})

// 销售机会添加
.controller('saleChanceAddCtrl', function($scope, $state, $stateParams, commonService, cusService, saleChanceService, localStorageService, $ionicHistory, alertService) {
  //commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };

    datePicker('startDate');
    dropDown('salesProgress', '<span class="show-icon">请选择销售进度</span>', '请选择销售进度');
    dropDown('customer', '<span class="show-icon">请选择客户名称</span>', '请选择客户名称');
    dropDown('chanceGrade', '<span class="show-icon">请选择机会级别</span>', '请选择机会级别');
    
    var userId = localStorageService.get("User").userId;

    $scope.saleChance = {
      "user":{"userId":userId},
      "customer": {}
    };
    $scope.searchDTO = {
      "salesmanIds": [userId]
    };
    cusService.getCusesByDTO($scope.searchDTO).then(function (data) {
      $scope.customers = data;
    });

    $scope.addSaleChance = function () {
      $scope.saleChance.customer.id = $("#customer").val();
      $scope.saleChance.exceptedtime = $("#startDate").val();
      $scope.saleChance.salesProgress = $("#salesProgress_dummy").val();
      $scope.saleChance.chanceGrade = $("#chanceGrade_dummy").val();
      
      //数据验证
      var result = checkDate();
      if(result != "success") {
        alertService.showAlert($scope, result, true, "warning", null);
        return;
      }

      saleChanceService.postSaleChance($scope.saleChance).then(function (data) {
        if (data.status === 1) {
          alertService.showAlert($scope, "销售机会添加成功!", true, "success", null);
          setTimeout(function() { $state.go('tab.saleChance'); }, 1000);
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
        }
      });
    }

    var checkDate = function () {
      if($scope.saleChance.customer.id === "") return "请填写客户名称!";
      else if(typeof($scope.saleChance.chanceName) === "undefined" || $scope.saleChance.chanceName === "") return "请填写机会名称!";
      else if($scope.saleChance.exceptedtime === "") return "请填写预计日期!";
      else if($scope.saleChance.salesProgress === "") return "请填写销售进度!";
      else if($scope.saleChance.chanceGrade === "") return "请填写机会级别!";
      return "success";
    }
  });
})

// 销售机会查看
.controller('saleChanceDetailCtrl', function($scope, $state, $stateParams, $ionicHistory, $timeout, commonService, saleChanceService, localStorageService, alertService, _) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };

    var initShowQiangshafa = true;
    var initStyle = function () {
      commonService.hideLoading();
      $(".wsq-content").children("div").show();
      $(".wsq-content_font_all").show();
      if(initShowQiangshafa) $("#qiangshafa").hide();
    }
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

    var id = $stateParams.id;
    var num = 0;
    var userId = localStorageService.get("User").userId;
    //取机会
    saleChanceService.getSaleChanceByid(id).then(function (data) {
      $scope.chance = data;
      num++;
      if(num === 2) commonService.hideLoading();
    });

    $scope.getArr = function (id) {
      return $scope.recordArr[id];
    }
    //取记录及评论
    $scope.recordArr;
    $scope.replyNum = 0;
    saleChanceService.selRecordsByUIdAndChance(userId, id).then(function (data) {
      $scope.replyNum = data.length;
      if(data.length === 0) $("#qiangshafa").show();
      //取评论
      var tempArr = _.sortBy(data, function(item){ return item.id; });
      $scope.recordArr = _.groupBy(tempArr, function(item){ return item.rootId });
      //取记录
      $scope.chanRecos = _.sortBy($scope.recordArr[1], function(item){ return -item.id; });
      num++;
      if(num === 2) commonService.hideLoading();
    });

    var arrId;
    $scope.reply = {
      "saleChance": {"id": id},
      "user": {"userId": userId},
      "parentRecord": {"id": 0}
    };

    $scope.setReplyId = function (reply, recordId) {
      if(reply != 1) {
        $("#saytext").val("@" + reply.user.userName + ": ");
        $scope.replyId = reply.id;
      } else {
        $("#saytext").val("");
        $scope.replyId = 1;
      }
      
      $(".communy-fix").show();
      $(".common-bg").show();
      $(".communy-fix textarea").focus();
      $(".wsq-bottom-all").hide();
      
      //当前要回复的Blog
      $scope.currentReply = reply;
      arrId = recordId;
      $scope.reply.rootId = recordId;
    };


    $scope.addReply = function (pid) {
      var str = $("#saytext").val();
      //$("#show").html(replace_em(str));
      //提交时去除@字符串
      if(str.charAt(0) === "@" && str.indexOf(":") != -1) {
        var replyUserName = $.trim(str.split(":")[0]);
        if(replyUserName === "@"+$scope.currentReply.user.userName) {
          $scope.reply.progressContent = $.trim(str.substring(str.indexOf(":")+1, str.length));
        }
      } else {
        $scope.reply.progressContent = str;
      }
      $scope.reply.progressContent = replace_em($scope.reply.progressContent);
      $scope.reply.parentRecord.id = pid;

      if(typeof($scope.reply.progressContent) === "undefined" || $scope.reply.progressContent === "") {
        $scope.removeHeight();
        alertService.showAlert($scope, "请填写内容！", true, "fail", null);
      } else {
        saleChanceService.postSaleChanceReco($scope.reply).then(function (data) {
          if(data.status == 1) {
            alertService.showAlert($scope, "回复成功!", true, "success", null);
            $("#qiangshafa").hide();
            //若是对话题添加评论，则将更新的数据显示在最前面;若是对评论进行评论，则添加在对应的评论list中。
            //alert(angular.toJson(data.msg.progressContent));
            var json = eval("(" + eval("(" + angular.toJson(data.msg) + ")") + ")");
            if(json.parentRecord.id === 1) {
              //$scope.recordArr[arrId].unshift(json);
              $scope.chanRecos.unshift(json);
            } else {
              if(typeof($scope.recordArr[arrId]) != "undefined") {
                $scope.recordArr[arrId].push(json);
              } else {
                $scope.recordArr[arrId] = [];
                $scope.recordArr[arrId].push(json);
              }
            }
            $scope.replyNum ++;
            $scope.hideComment();
            //$state.go("tab.community-find", {topicId: $scope.topicId});
          } else {
            alertService.showAlert($scope, data.msg, true, "fail", null);
          }
        });
      }
    };

  });
});