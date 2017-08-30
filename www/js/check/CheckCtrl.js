angular.module('ssapp.controllers')

//员工考核
.controller('assessCtrl', function ($scope, $state, $timeout, $filter, commonService, instAndUScoreService, localStorageService, UserService, alertService) {
  commonService.showLoading();
  $("#loading").hide();
  $scope.$on($state.current.name + "-init", function() {
    $scope.chararcterArr = new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
    $('#close').click(function(){
        $('.rwgl-bg').hide();
        $('.rwgl-tan').hide();
    });
    /* $scope.shower=true;*/

      //下拉footer显示

    /*window.onscroll=function(){
      console.log(document.documentElement.scrollTop);
    };*/
    //下拉显示footer
    $scope.shower=false;
    var start=0;
    var end=0;
    $('body').on('touchstart',function(e){
      start= e.originalEvent.targetTouches[0].clientY;
    })
    $('body').on('touchend',function(e){
      end= e.originalEvent.changedTouches[0].clientY;
      var cha=end-start;
      if(cha!=0){
        var position=$('ion-content').scrollTop();//取滑动TOP值
        if(position>150)//小于等于40像素时隐藏标题
        {
          $('.footer_color').stop().fadeIn();
        }
        else{
          $('.footer_color').stop().fadeOut();
        }
      }

    });

    /*$('body').on('touchmove',function(){

    });*/

    $('.foot_closeed').click(function(){
      $('.footer_color').hide();
    });

    $scope.initListTop = function () {
      $('.ygkh_list_top').click(function(){
        $(this).next().slideToggle();
        /*$('.ygkh_list_top').next().not(this).slideUp();*/
        $(this).find('i').toggleClass('icon ion-chevron-up');
        /*$('.ygkh_list_top').not(this).find('i').addClass('icon ion-chevron-down');*/
      });
    }

    $scope.curYear = new Date().getFullYear();
    var curMonth = new Date().getMonth() + 1;

    $scope.years = [$scope.curYear - 1, $scope.curYear, $scope.curYear + 1];

    dropDown('ygkhyear', '<span class="show-icon">请选择年份</span>');
    dropDown('ygkhmonth', '<span class="show-icon">请选择月份</span>');
    //等$scope.years加载完成之后执行
    $timeout(function() {
      $("#ygkhyear").val($scope.curYear + "年");
      $("#ygkhyear_dummy").val($scope.curYear + "年");
      if(curMonth == 0) {
        $("#ygkhmonth").val(12 + "月");
        $("#ygkhmonth_dummy").val(12 + "月");
      } else {
        if(curMonth-1 < 10) {
          $("#ygkhmonth").val("0" + (curMonth-1) + "月");
          $("#ygkhmonth_dummy").val("0" + (curMonth-1) + "月");
        }
      }
    }, 50);
    $scope.photoUrl = "img/default.png";
    $scope.insts = [];
    $scope.empId = 0;
    $scope.score = 0;
    var showUserId;
    $scope.totalSalary = 0;
    $scope.baseTotalSalary = 0;
    var assessNameChange = function () {
      $scope.totalSalary = 0;
      $scope.baseTotalSalary = 0;
      $.each($scope.users, function (index, item) {
        if(item.userId === parseInt($("#assessName").val().substring(7))) {
          $scope.empId = item.userId;
          $("#positionName").text(item.positionName);
          instAndUScoreService.monthScoreByUId(item.userId).then(function (data) {
            if($.trim(data) != "null") {
              $scope.score = data;
            } else {
              $scope.score = 0;
            }
          });
          if(item.photoUrl === "") {
            $scope.photoUrl = "img/default.png";
          } else {
            $scope.photoUrl = item.photoUrl;
          }
          showUserId = item.userId;
          $scope.initSalary();
          
          instAndUScoreService.getInstsByCusId(item.positionId).then(function (data) {
            //alert(angular.toJson(data));
            $scope.insts = data;
            setTimeout(function() {
              $.each($scope.insts, function(index, item) {
                markscore('startScore' + item.id, item.score);
              });
            }, 50);
          });
        }
      });
    }
    $("#assessName").on("change", function() {
      assessNameChange();
    });

    $("#ygkhyear").on("change", function() {
      $scope.totalSalary = 0;
      $scope.baseTotalSalary = 0;
      $scope.initSalary();
    });
    $("#ygkhmonth").on("change", function() {
      $scope.totalSalary = 0;
      $scope.baseTotalSalary = 0;
      $scope.initSalary();
    });

    //更新考核项及薪资情况
    $scope.initSalary = function () {
      var date = $("#ygkhyear_dummy").val().split("年")[0] + "-" + $("#ygkhmonth_dummy").val().split("月")[0];
      instAndUScoreService.getUserCheckDatas(showUserId, date).then(function (data) {
        $scope.checkDatas = data;
        console.log(data);
        $.each($scope.checkDatas, function(index, item) {
          $scope.totalSalary = $scope.totalSalary + item.actualSalary;
          $scope.baseTotalSalary = $scope.baseTotalSalary + item.baseSalary;
        });
        $timeout(function () {
          $scope.initListTop();
          if($scope.baseTotalSalary != 0) {
            var outWidth = $(".out").width();
            var width = outWidth * $scope.totalSalary/$scope.baseTotalSalary;
            if(width > outWidth) width = outWidth;
            $(".star").attr("style", "width:" + width + "px;");
          } else {
            $(".star").attr("style", "width:0px;");
          }
        },50);
        commonService.hideLoading();
        $("#loading").hide();
      });
    }
    
    $scope.user = {};
    $scope.users = [];
    var userId = localStorageService.get("User").userId;
    $scope.userName = localStorageService.get("User").userName;
    //获取可查看的员工列表
    UserService.getUsersByMenuUrl(userId, "manage/checkData/checkData.html").then(function (data) {
      /*console.log(data);*/
      $scope.users = data;
      $timeout(function() {
        dropDown('assessName', '<span class="show-icon">请选择姓名</span>', '请选择姓名');
        $("#assessName_dummy").val(localStorageService.get("User").userName);
        $("#assessName").val("number:" + userId);
        assessNameChange();
      },50);
    });

    $scope.getColumnValue = function(checkData, column) {
      return eval("checkData." + column);
    };

    $scope.saveUserScore = function () {
      var status = true;
      $.each($scope.insts, function (index, item) {
        if($scope.empId != 0) {
          if(userId === $scope.empId) {
            alertService.showAlert($scope, "不能对自己进行考核！", true, "warning", null);
            status = false;
            return;
          }
          var score = $("#startScore" + item.id + "_dummy").val();
          if(score === "") {
            alertService.showAlert($scope, "请完整进行考核！", true, "warning", null);
            status = false;
            return;
          }
        } else {
           alertService.showAlert($scope, "请先选择员工", true, "warning", null);
        }
      });
      if(status) {
        $.each($scope.insts, function (index, item) {
          var score = $("#startScore" + item.id + "_dummy").val();
          save($scope.empId, item.id, score.substring(0,score.indexOf("分")));
        });
       }
    };

    var num = 0;
    var save = function (empId, instId, score) {
      var year = $filter('date')(new Date(),'yyyy');
      var month = $filter('date')(new Date(),'MM');
      var firstdate = year + '-' + month + '-01';  
      var day = new Date(year,month,0);   
      var enddate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期   
      var userScore = {
        'employee': {'userId' : empId},
        'creator': {'userId' : userId},
        'institution': {'id' : instId},
        'score' : score,
        'fromdate' : firstdate,
        'enddate' : enddate,
      };
      instAndUScoreService.postUserScore(userScore).then(function (data) {
        if(data.status == 1) {
          alertService.showAlert($scope, "考核成功!", true, "success", null);
          //重新查看当月总分值，赋分
          if(num == $scope.insts.length - 1) {
            instAndUScoreService.monthScoreByUId($scope.empId).then(function (data) {
              if($.trim(data) != "null") {
                $scope.score = data;
              } else {
                $scope.score = 0;
              }
            });
            num = 0;
          } else {
            num ++;
          }
          
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
        }
      });

    };
    $scope.instDetail = {};
    $scope.viewDetail = function (inst) {
      $scope.instDetail = inst;
      $('.rwgl-bg').show();
      $('.rwgl-tan').show();
    };
  });
})

//用户积分记录
.controller('scoreRecordsCtrl', function($scope, $state, $stateParams, $timeout, UserService, localStorageService, alertService, commonService, instAndUScoreService, $cordovaToast) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.hasDate = true;
    $scope.loading = true;
    var user = localStorageService.get("User");
    // 表格
    $scope.expandDetail = function(index, message) {
      $("#content tr:eq('"+index+"')").siblings().each(function() {
        $(this).children("td:eq(0)").children("i").removeClass('ion-chevron-down');
        $(this).children("td:eq(0)").children("i").addClass('ion-chevron-right');
        $(this).css('background','#fff');//选中其他背景还原
        $(this).css('border','0px');
        $(this).children("td:eq(0)").children("#leftsj").hide();
      });
      $("#content tr[class='detail']").remove();
      $("#content tr:eq('"+index+"') td:eq(0) i").removeClass('ion-chevron-right');
      $("#content tr:eq('"+index+"')").css('background','#f2f2f2');//选中当前背景改变
      $("#content tr:eq('"+index+"') td:eq(0) i").addClass('ion-chevron-down');
      $("#content tr:eq('"+index+"')").css('border-left','5px solid #F7931E');
      $("#content tr:eq('"+index+"') td:eq(0) #leftsj").show();
      var detailHTML = "<tr class=\"detail\"><td colspan=\"5\"><div class=\"content-p\" style=\"line-height:30px;\">" + 
                        "<span style=\"font-weight:bold!important\">开始时间：</span>" + message.fromdate + " 　" +
                        "<span style=\"font-weight:bold!important\">结束时间：</span>" + message.enddate + "　 "+
                        //"<span style=\"font-weight:bold!important\">制度内容：</span>" + message.institution.content +
                        "</div></td></tr>";
      $("#content tr:eq('"+index+"')").after(detailHTML);
      $(".content-p").animate({ 
        width: "100%",
        height: "30px", 
        borderWidth: 10
      }, 300); 
    };

    $("#loading").hide();
    $scope.getData = function () {
      instAndUScoreService.getUScoresByEmpIdLazy(user.userId, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
        vm.messages = vm.messages.concat(data);
        $("#loading").hide();
        commonService.hideLoading();
        $scope.loading = false;
        if(vm.messages.length === 0) {
          $scope.hasDate = false;
        }
        vm.finishInit = true;
        if (data.length === 0) vm.moredata = true;
        if (data.length === 0 && data.length >= 8) {
          $cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
          // success  
          }, function (error) {  
            // error  
          });
        }
        //成功2秒后广播
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageNo ++;
        }, 2000);
      });
    };

    var vm = $scope.vm = commonService.getWaterFallVM($scope, $scope.getData, "loading");
    vm.init();
  });
});