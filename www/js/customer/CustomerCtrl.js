angular.module('ssapp.controllers')

// 客户管理首页
.controller('cusDetailCtrl',function($scope, $state, $stateParams, localStorageService, commonService, cusService, busTripReportService, visitService, contactService, visitRecordService, $ionicHistory) {
  commonService.showLoading();
  $("ion-content").show();
  //$("tab-slide-box").hide();
  
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };
    var userId = localStorageService.get("User").userId;
    var customerId = $stateParams.customerId;
    cusService.getCusById(customerId).then(function (data) {
      $scope.cusDetail = data;
      commonService.hideLoading();
      //$("tab-slide-box").show();
    });

    contactService.getContactsByCusId(customerId).then(function (data) {
      $scope.contacts = data;
    });
    $scope.viewContactDetail = function (contactId) {
      $state.go("tab.manage-kh", {contactId:contactId});
    };

    var visitSearchDTO = {
      "userId" : userId,
      "customerId" : customerId
    };
    visitService.searchVisit(visitSearchDTO).then(function (data) {
      $scope.visits = data;
    });
    $scope.viewVisitDetail = function (visitId) {
      $state.go("tab.visit-looking", {visitId:visitId});
    };

    /*var visitRSearchDTO = {
      "creatorId" : userId,
      "customerId" : customerId
    };
    visitRecordService.searchVisitRecord(visitRSearchDTO).then(function (data) {
      $scope.visitRecords = data;
    });*/
    //获取对应该客户的出差报告
    busTripReportService.getReportsByCusId(customerId).then(function(data) {
      console.log(data);
      $scope.btReports = data;
    });

    $scope.viewBtReportDetail = function (id) {
      $state.go("ccbg-view", {id:id});
      //$state.go("tab.backvisit", {visitRecordId:visitRecordId});
    };
    $scope.addContact = function () {
      $state.go("tab.contacts-add", {customerId:customerId, customerName:$scope.cusDetail.customerName});
    };

    $scope.updateCustomer = function () {
      cusService.updateCustomer($scope.cusDetail).then(function (data) {
        if (data.status === 1) {
          alertService.showAlert($scope, "客户修改成功!", true, "success", 'tab.manage');
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
        }
      });
    };
  });
})

//联系人添加管理
.controller('addContactCtrl',function($scope, $state, $stateParams, $timeout, $ionicHistory, commonService, localStorageService, alertService, contactService, $ionicScrollDelegate) {
  //commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
    dropDown('sex', '<span class="show-icon">请选择性别</span>', '请选择性别');
    $scope.back = function(){
      $ionicHistory.goBack();
    };

    datePicker('startDateTime');
    $scope.open = function(){
      $ionicScrollDelegate.$getByHandle('mainScroll').resize();
      $("#expand").toggle(1500);
      if($("#open i").hasClass("ion-arrow-up-b")) {
        $("#open i").removeClass('ion-arrow-up-b');
        $("#open i").addClass('ion-arrow-down-b positive');
      } else {
        $("#open i").removeClass('ion-arrow-down-b positive');
        $("#open i").addClass('ion-arrow-up-b');
      }
    };
    var userId = localStorageService.get('User').userId;
    var customerId = $stateParams.customerId;
    $scope.customerName = $stateParams.customerName;

    $scope.contact = {
      'creator': { 'userId': userId },
      'deptName': "采购部",
      "customer": {"id" : customerId}
    };

    $scope.addContact = function() {
      $scope.contact.birthday = $("#startDateTime").val();
      $scope.contact.sex = $("#sex").val();
      //检查联系人是否填写了
      if(typeof($scope.contact.name) === "undefined" || $.trim($scope.contact.name) === "") {
        alertService.showAlert($scope, "请填写联系人姓名", true, "fail", null);
        return;
      }
      var telReg = /^1(3|4|7|5|8)([0-9]{9})$/;
      var officeTelReg = /(^400[0-9]{7}$)|(^800[0-9]{7}$)|(^0[0-9]{2,3}-[0-9]{7,8}$)/;
      //检查联系人办公电话或手机是否填写了，并确定符合格式
      if(!telReg.test($.trim($scope.contact.telephone)) && !officeTelReg.test($.trim($scope.contact.officeTel))) {
        alertService.showAlert($scope, "请正确填写联系人办公电话或手机", true, "fail", null);
        return;
      }
      //检查联系人职务是否填写
      if(typeof($scope.contact.position) === "undefined" || $.trim($scope.contact.position) === "") {
        alertService.showAlert($scope, "请填写联系人职务", true, "fail", null);
        return;
      }
      //检查联系人性别是否填写
      if(typeof($scope.contact.sex) === "undefined" || $.trim($scope.contact.sex) === "") {
        alertService.showAlert($scope, "请填写联系人性别", true, "fail", null);
        return;
      }
      contactService.postContact($scope.contact).then(function (data) {
        if (data.status === 1) {
          alertService.showAlert($scope, "联系人添加成功!", true, "success", null);
          setTimeout(function() {
            $state.go("tab.manage-index", {customerId:customerId});
          }, 1000);
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
        }
      });
    };
    //commonService.hideLoading();
  //});
})

// 联系人管理首页
.controller('contactDetailCtrl', function($scope, $state, $stateParams, $ionicHistory, commonService, contactService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };
    //取页面传过来的contactId参数
    var contactId = $stateParams.contactId;
    contactService.getContactById(contactId).then(function (data) {
      $scope.contactDetail = data;
      commonService.hideLoading();
      //$scope.note = data.note;
    });
  });

  /*$scope.updateCustomer = function () {
    cusService.updateCustomer($scope.cusDetail).then(function (data) {
      if (data.status === 1) {
        //alert("客户添加成功!");
        //$state.go('tab.manage');
        alertService.showAlert($scope, "客户修改成功!", true, "success", 'tab.manage');
      } else {
        alertService.showAlert($scope, data.msg, true, "fail", null);
      }
    });
  }*/
})

//客户添加管理
.controller('cusAddCtrl', function($scope, $state, localStorageService, commonService, cusService, alertService, contactService, $ionicScrollDelegate) {
  //commonService.showLoading();
  $("ion-content").show();
  //$scope.$on($state.current.name + "-init", function() {
    //dropDown('source_dummy', '请选择客户来源', sourceData);  //从远程服务器加载数据
    dropDown('source', '<span class="show-icon">请选择客户来源</span>', '请选择客户来源'); 
    dropDown('industry', '<span class="show-icon">请选择所属行业</span>', '请选择所属行业');
    dropDown('type_t', '<span class="show-icon">请选择客户类型</span>', '请选择客户类型');
    dropDown('type_d', '<span class="show-icon">请选择客户身份</span>', '请选择客户身份');
    dropDown('grade', '<span class="show-icon">请选择客户级别</span>', '请选择客户级别');
    dropDown('sex', '<span class="show-icon">请选择性别</span>', '请选择性别');   
    datePicker('startDateTime');
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
    //area1.value=[1,13,3];//控制初始位置，注意：该方法并不会影响到input的value
      
    var userId = localStorageService.get('User').userId;
    $scope.customer = {
      'creator': { 'userId': userId },
      'salesman': {'userId' : userId},
      'assignPeople': {'userId' : userId}
    };
    $scope.contact = {
      'creator': { 'userId': userId },
      'deptName': "采购部"
    };

    $scope.addCustomer = function() {
      $scope.contact.birthday = $("#startDateTime").val();
      $scope.customer.source = $("#source").val();
      $scope.customer.industry = $("#industry").val();
      $scope.customer.grade = $("#grade").val();
      $scope.contact.sex = $("#sex").val();
      //检查联系人是否填写了
      if(typeof($scope.contact.name) === "undefined" || $.trim($scope.contact.name) === "") {
        alertService.showAlert($scope, "请填写联系人姓名", true, "fail", null);
        return;
      }
      //检查联系人职务是否填写了
      if(typeof($scope.contact.position) === "undefined" || $.trim($scope.contact.position) === "") {
        alertService.showAlert($scope, "请填写联系人职务", true, "fail", null);
        return;
      }
      //检查联系人性别是否填写了
      if(typeof($scope.contact.sex) === "undefined" || $.trim($scope.contact.sex) === "") {
        alertService.showAlert($scope, "请填写联系人性别", true, "fail", null);
        return;
      }
      var telReg = /^1(3|4|7|5|8)([0-9]{9})$/;
      var officeTelReg = /(^400[0-9]{7}$)|(^800[0-9]{7}$)|(^0[0-9]{2,3}-[0-9]{7,8}$)/;
      //检查联系人办公电话或手机是否填写了，并确定符合格式
      if(!telReg.test($.trim($scope.contact.telephone)) && !officeTelReg.test($.trim($scope.contact.officeTel))) {
        alertService.showAlert($scope, "请正确填写联系人办公电话或手机", true, "fail", null);
        return;
      }
      //检查客户类型和客户身份是否填写了
      if($("#type_t").val() === "" || $("#type_d").val() === "") {
        alertService.showAlert($scope, "请填写客户类型和客户身份", true, "fail", null);
        return;
      }
      $scope.customer.type = $("#type_t").val() + "|" + $("#type_d").val();
      cusService.postCustomer($scope.customer).then(function (data) {
        if (data.status === 1) {
          //alertService.showAlert($scope, "客户添加成功!", true, "success", 'tab.manage');
          
          //成功后，添加联系人
          var newCustomer = angular.fromJson(data.msg);

          $scope.contact.customer = newCustomer;

          contactService.postContact($scope.contact).then(function (data) {
            if (data.status === 1) {
              alertService.showAlert($scope, "客户添加成功!", true, "success", 'tab.manage');
            } else {
              alertService.showAlert($scope, data.msg, true, "fail", null);
            }
          });
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
        }
      });
    };
    $scope.open = function(){
      $ionicScrollDelegate.$getByHandle('mainScroll').resize();
      $("#expand").toggle(1500);
      if($("#open i").hasClass("ion-arrow-up-b")) {
        $("#open i").removeClass('ion-arrow-up-b');
        $("#open i").addClass('ion-arrow-down-b positive');
      } else {
        $("#open i").removeClass('ion-arrow-down-b positive');
        $("#open i").addClass('ion-arrow-up-b');
      }
    };

    //commonService.hideLoading();
  //});
  
})

//客户查看
.controller('cusCtrl', ['$scope', '$state', 'localStorageService', 'cusService', '$filter', 'commonService', function($scope, $state, localStorageService, cusService, $filter, commonService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    var userId = localStorageService.get('User').userId;
    $scope.searchDTO = {
      "salesmanIds": [userId]
    };
    cusService.getCusesByDTO($scope.searchDTO).then(function (data) {
      $scope.customerLength = data.length;
      $scope.customers = data;
      commonService.hideLoading();
    });
    
    $scope.cusDetail = {};
    $scope.fillCusDetail = function(data) {
      $scope.cusDetail = data;
      $state.go('tab.history-client', {customerId: data.customerId});
    };

    var searchCustomer = function () {
      cusService.getCusesByDTO($scope.searchDTO).then(function (data) {
        $scope.customerLength = data.length;
        $scope.customers = data;

        closeSearchArea();
      });
    };

    $scope.searchCusName = function ($event) {
      if($event.keyCode===13){
        searchCustomer();
      }
    };

    $scope.searchWebsite = function ($event) {
      if($event.keyCode===13){
        searchCustomer();
      }
    };

    $scope.selectGrade = function (grade) {
      $scope.searchDTO.grade = grade;
      searchCustomer();
    };

    $scope.selectIndustry = function (industry) {
      $scope.searchDTO.industry = industry;
      searchCustomer();
    };

    $scope.selectSource = function (source) {
      $scope.searchDTO.source = source;
      searchCustomer();
    };

    $scope.selectType = function (index, type) {
      var arr = document.getElementById("Sort-Sort").getElementsByTagName("li");
      for (var i = 0; i < arr.length; i++){
          var a = arr[i];
          a.style.background = "";
      }
      $("#Sort-Sort").children("li:eq(" + index + ")").css("background","#eee");
      $(".khxl_dui").css('color','#fff');
      var right = $("#Sort-Sort").children("li:eq(" + index + ")");
      right.children(".khxl_dui").css("color","#3cb9f3");
      $scope.searchDTO.type = type;
      searchCustomer();
    };

    $scope.selectTime = function (index) {
      var arr = document.getElementById("Categorytw").getElementsByTagName("li");
      for (var i = 0; i < arr.length; i++){
          var a = arr[i];
          a.style.background = "";
      }
      $("#Categorytw").children("li:eq(" + index + ")").css("background","#eee");
       var right = $("#Categorytw").children("li:eq(" + index + ")");
      $(".khxl_duit").css('color','#fff');
       right.children(".khxl_duit").css("color","#3cb9f3");
      //a[index].style.borderBottom = "solid 1px #ff7c08";
      if(index === 0) {
        //所有
        $scope.searchDTO.fromdate = "";
        $scope.searchDTO.enddate = "";
      } else if(index === 1) {
        //今日新建
        var fromdate = $filter("date")(new Date(), "yyyy-MM-dd");
        $scope.searchDTO.fromdate = fromdate;
        $scope.searchDTO.enddate = "";
      } else if(index === 2) {
        //本周新建
        var currentDate = new Date();
        //一天的毫秒数    
        var millisecond = 1000 * 60 * 60 * 24;  
        //减去的天数
        var minusDay = currentDate.getDay() != 0 ? currentDate.getDay()-1 : 6;     
        //本周 周一    
        var monday = new Date(currentDate.getTime() - (minusDay * millisecond));  

        var fromdate = $filter("date")(monday, "yyyy-MM-dd");
        $scope.searchDTO.fromdate = fromdate;
        $scope.searchDTO.enddate = "";
      } else if(index === 3) {
        var fromdate = $filter("date")(new Date(), "yyyy-MM");
        $scope.searchDTO.fromdate = fromdate + "-01";
        $scope.searchDTO.enddate = "";
      }

      searchCustomer();
    };

    var closeSearchArea = function () {
      $('.grade-eject').removeClass('grade-w-roll');
      $(".Regional").removeClass('current');
      $('.screening').attr('style',' ');
      $('.Category-eject').removeClass('grade-w-roll');
      $(this).removeClass('current');
      $('.screening').attr('style',' ');
      $('.Sort-eject').removeClass('grade-w-roll');
      $(this).removeClass('current');
      $('.screening').attr('style',' ');
    };

    $scope.viewCusDetail = function (customerId) {
      $state.go("tab.manage-index", {customerId : customerId});
    };
    $(document).ready(function(){
        $(".Regional").click(function(){
          if ($('.grade-eject').hasClass('grade-w-roll')) {
            $('.grade-eject').removeClass('grade-w-roll');
            $(this).removeClass('current');
            $('.screening').attr('style',' ');
          } else {
            $('.grade-eject').addClass('grade-w-roll');
            $(this).addClass('current');
            $(".meishi").removeClass('current');
            $(".Brand").removeClass('current');
            $(".Sort").removeClass('current');
            $('.screening').attr('style','position: fixed;top:0px;');
          }
        });
    });
    $(document).ready(function(){
        $(".grade-w>li:eq(0)").click(function(){
            $(".grade-t").css("left","50%");
            $(".grade-w").css("width","50%");
            $(".grade-t .khxl-one").css("display","block");
            $(".grade-t .khxl-two").css("display","none");
            $(".grade-t .khxl-three").css("display","none");
            $(".grade-t .khxl-four").css("display","none");
            $(".grade-t .khxl-five").css("display","none");
        });
        $(".grade-w>li:eq(1)").click(function(){
            $(".grade-t").css("left","50%");
            $(".grade-t .khxl-one").css("display","none");
            $(".grade-t .khxl-two").css("display","block");
            $(".grade-t .khxl-three").css("display","none");
            $(".grade-t .khxl-four").css("display","none");
            $(".grade-t .khxl-five").css("display","none");
        });
        $(".grade-w>li:eq(2)").click(function(){
            $(".grade-t").css("left","50%");
            $(".grade-t .khxl-one").css("display","none");
            $(".grade-t .khxl-two").css("display","none");
            $(".grade-t .khxl-three").css("display","block");
            $(".grade-t .khxl-four").css("display","none");
            $(".grade-t .khxl-five").css("display","none");
        });
        $(".grade-w>li:eq(3)").click(function(){
            $(".grade-t").css("left","50%");
            $(".grade-t .khxl-one").css("display","none");
            $(".grade-t .khxl-two").css("display","none");
            $(".grade-t .khxl-three").css("display","none");
            $(".grade-t .khxl-four").css("display","block");
            $(".grade-t .khxl-five").css("display","none");
        });
        $(".grade-w>li:eq(4)").click(function(){
            $(".grade-t").css("left","50%");
            $(".grade-t .khxl-one").css("display","none");
            $(".grade-t .khxl-two").css("display","none");
            $(".grade-t .khxl-three").css("display","none");
            $(".grade-t .khxl-four").css("display","none");
            $(".grade-t .khxl-five").css("display","block");
        });
    });
    $(document).ready(function(){
        $(".grade-t>li").click(function(){
            $(".grade-s").css("left","50%");

        });
    });
    $(document).ready(function(){
        $(".Brand").click(function(){
            if ($('.Category-eject').hasClass('grade-w-roll')) {
              $('.Category-eject').removeClass('grade-w-roll');
              $(this).removeClass('current');
              $('.screening').attr('style',' ');
            } else {
              $('.Category-eject').addClass('grade-w-roll');
              $(this).addClass('current');
              $(".meishi").removeClass('current');
              $(".Regional").removeClass('current');
              $(".Sort").removeClass('current');
              $('.screening').attr('style','position: fixed;top:0px;');
            }
        });
    });
    $(document).ready(function(){
        $(".Sort").click(function(){
            if ($('.Sort-eject').hasClass('grade-w-roll')) {
              $('.Sort-eject').removeClass('grade-w-roll');
              $(this).removeClass('current');
              $('.screening').attr('style',' ');
            } else {
              $('.Sort-eject').addClass('grade-w-roll');
              $(this).addClass('current');
              $(".meishi").removeClass('current');
              $(".Regional").removeClass('current');
              $(".Brand").removeClass('current');
              $('.screening').attr('style','position: fixed;top:0px;');
            }
        });
    });
    $(document).ready(function(){
        $(".Regional").click(function(){
            if ($('.Category-eject').hasClass('grade-w-roll')){
                $('.Category-eject').removeClass('grade-w-roll');
            }
        });
    });
    $(document).ready(function(){
        $(".Regional").click(function(){
            if ($('.Sort-eject').hasClass('grade-w-roll')){
                $('.Sort-eject').removeClass('grade-w-roll');
            }
        });
    });
    $(document).ready(function(){
        $(".Regional").click(function(){
            if ($('.meishi22').hasClass('grade-w-roll')){
                $('.meishi22').removeClass('grade-w-roll');
            }

        });
    });
    $(document).ready(function(){
        $(".Brand").click(function(){
            if ($('.Sort-eject').hasClass('grade-w-roll')){
                $('.Sort-eject').removeClass('grade-w-roll');
            }
        });
    });
    $(document).ready(function(){
        $(".Brand").click(function(){
            if ($('.grade-eject').hasClass('grade-w-roll')){
                $('.grade-eject').removeClass('grade-w-roll');
            }
        });
    });
    $(document).ready(function(){
        $(".Brand").click(function(){
            if ($('.meishi22').hasClass('grade-w-roll')){
                $('.meishi22').removeClass('grade-w-roll');
            }
        });
    });
    $(document).ready(function(){
        $(".Sort").click(function(){
            if ($('.Category-eject').hasClass('grade-w-roll')){
                $('.Category-eject').removeClass('grade-w-roll');
            }
        });
    });
    $(document).ready(function(){
        $(".Sort").click(function(){
            if ($('.grade-eject').hasClass('grade-w-roll')){
                $('.grade-eject').removeClass('grade-w-roll');
            }

        });
    });
    $(document).ready(function(){
        $(".Sort").click(function(){
            if ($('.meishi22').hasClass('grade-w-roll')){
                $('.meishi22').removeClass('grade-w-roll');
            }

        });
    });
  });
}]);