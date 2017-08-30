angular.module('ssapp.controllers')

//工作日报
.controller('dReportCtrl', function($scope, $window, $state, $filter, $timeout, $ionicActionSheet, $ionicSlideBoxDelegate, $ionicPopup, $ionicModal, commonService, ConfigService, localStorageService, dReportService, alertService) {
  //commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
    //图片头部动画
    $scope.controlModal = function() {
      if($(".photo-top-fixed").hasClass("showTitle")){
        $(".photo-top-fixed").animate({top:"0px"});
        $(".photo-top-fixed").removeClass("showTitle");
      }else{
        $(".photo-top-fixed").addClass("showTitle");
        $(".photo-top-fixed").animate({top:"-40px"});
      };
    };

    //监听滑动
    $scope.photoChanged = function (index) {
      $scope.currentPhoto = index + 1;
    }
    //图片展示
    $ionicModal.fromTemplateUrl('tab-photo.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function (index, photoArray) {
      $ionicSlideBoxDelegate.slide(index);
      $scope.slidePhotoArray = photoArray;
      $scope.currentPhoto = index + 1;
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    $scope.totalRecords = function (length) {
      return length === 0 ? 1 : length;
    }

    $scope.removePhoto = function () {
      /*var confirmPopup = $ionicPopup.confirm({
        title: '删除',
        template: '确定删除此图片么？', //从服务端获取更新的内容
        cancelText: '取消',
        okText: '确定'
      });
      confirmPopup.then(function (res) {
        if (res) {*/
          var index = $scope.currentPhoto - 1;
          $scope.reportPhotos.splice(index, 1);
          if(index === 0 && $scope.reportPhotos.length === 0) {
            $scope.modal.hide();
          } else if(index === 0 && $scope.reportPhotos.length != 0) {
            $scope.openModal(index, $scope.reportPhotos);
          } else {
            $scope.openModal(index-1, $scope.reportPhotos);
          }
          //$scope.modal.hide();
        /*} else {
          // 取消cancelText
        }
      });*/
    }

    //补填按钮打开判断
    var isOpen = false;
    $scope.writeDaily = function(){
      if(isOpen){
        $("#fillReportDate").unbind();
        isOpen = false;
        $(".daily-item-i-dw img").attr("src","img/rilihui.png");
        $(".gzrb-buqian span").hide();
  	    $("#fillReportDate").val($scope.myDate);
      }else{
        datePickerDaily("fillReportDate");
        isOpen = true;
        $(".daily-item-i-dw img").attr("src","img/rili.png");
        $(".gzrb-buqian span").show();
      }
    };
    
    //光标定位
    //$("#content").focus();
    //定义报告照片
    $scope.reportPhotos = [];
    $scope.username = localStorageService.get('User').userName;
    var userId = localStorageService.get('User').userId;
    //下午17:30
    var homeTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 30, 0);
    $scope.report = {
      'user': { 'userId': userId },
      'content': $scope.content
    };
    $scope.addReport = function() {
    	if(isOpen === true) {
    		$scope.fillReport();
    		return;
    	}
      
      /*var confirmFillDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 30, 0);
      var lunchTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
      var homeTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
      if(new Date().getTime() < confirmFillDate.getTime()) {
        confirmFillReport();
        return;
      }
      if(new Date().getTime() > lunchTime.getTime() && new Date().getTime() < homeTime.getTime()) {
        confirmAddReport();
        return;
      }*/
      //下午17:30之前，提示确认提交昨天的工作日报么？
      if(new Date().getTime() < homeTime.getTime()) {
        confirmAddLastReport();
        return;
      } else {
      //下午17:30之后，提示确认提交今天的工作日报么？
        confirmAddTodayReport();
        return;
      }
    };

    var disable = false;
    //用于正常提交工作日报
    var addDReport = function () {
      $scope.report.isFill = 0;
      $scope.report.photoUrls = "";
      for(var i=0; i<$scope.reportPhotos.length; i++) {
        $scope.report.photoUrls = $scope.report.photoUrls + $scope.reportPhotos[i] + "|";
      }
      if($scope.report.photoUrls != "") {
        $scope.report.photoUrls = $scope.report.photoUrls.substring(0, $scope.report.photoUrls.length - 1);
      }
  	  $scope.report.reportDate = $("#fillReportDate").val();

      var isOnline = commonService.onOnline();
      //若断网或不可用
      if(!isOnline || disable) return;
      disable = true;
      dReportService.postReport($scope.report).then(function (data) {
        disable = false;
        if (data.status === 1) {
          alertService.showAlert($scope, "工作日报发布成功!", true, "success", 'tab.dash');
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
          $("#content").focus();
        }
      });
    };
              
    //用于补填日报
    //var myFillReportDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    $scope.myDate=$filter('date')(new Date(),'yyyy/MM/dd');
    if(new Date().getTime() < homeTime.getTime()) {
      $scope.myDate=$filter('date')(new Date().getTime()-24*60*60*1000,'yyyy/MM/dd');
    } else {
      $scope.myDate=$filter('date')(new Date(),'yyyy/MM/dd');
    }
    $("#fillReportDate").val($scope.myDate);
      //$scope.report.fillReportDate = $scope.myDate;
    dReportService.getFillCount(userId).then(function (data) {
      //该员工当月已补填日报次数
      $scope.fillCount = data;
    });

    //用于补填工作日报
    $scope.fillReport = function() {
      $scope.report.isFill = 1;
      $scope.report.photoUrls = "";
      $scope.report.reportDate = $("#fillReportDate").val();
      for(var i=0; i<$scope.reportPhotos.length; i++) {
        $scope.report.photoUrls = $scope.report.photoUrls + $scope.reportPhotos[i] + "|";
      }
      if($scope.report.photoUrls != "") {
        $scope.report.photoUrls = $scope.report.photoUrls.substring(0, $scope.report.photoUrls.length - 1);
      }

      var isOnline = commonService.onOnline();
      //若断网或不可用
      if(!isOnline || disable) return;
      disable = true;
      dReportService.fillReport($scope.report).then(function (data) {
        disable = false;
        if (data.status === 1) {
          alertService.showAlert($scope, "工作日报补填成功!", true, "success", 'tab.dash');
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
          $("#content").focus();
        }
      });
    };

    var confirmAddLastReport = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: '确定提交工作日报么？',
        template: '亲，您是否确定提交昨天的工作日报？', //从服务端获取更新的内容
        cancelText: '取消',
        okText: '确定'
      });
      confirmPopup.then(function (res) {
        if (res) {
          //确定okText
          addDReport();
        } else {
          // 取消cancelText
        }
      });
    };

    var confirmAddTodayReport = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: '选择提交工作日报么？',
        template: '亲，您是否确定提交今天的工作日报？', //从服务端获取更新的内容
        cancelText: '取消',
        okText: '确定'
      });
      confirmPopup.then(function (res) {
        if (res) {
          //确定okText
          addDReport();
        } else {
          // 取消cancelText
        }
      });
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
                                            quality: 68,
                                            correctOrientation: true,
                                            targetWidth: 1024,                                        //照片宽度
                                            targetHeight: 768                                       //照片高度
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
        ft.upload(imageURI, encodeURI(ConfigService.getHost() + "/uploadServlet?action=reportPhoto"), win, fail, options);
    }

    function win(r) {//上传成功回调方法
        var resInfo = JSON.parse(r.response);
        if (resInfo.status === 1) {
            $scope.img = resInfo.msg;
            $scope.reportPhotos.push(resInfo.msg);
            $scope.$apply();
        } else {
            //上传失败
        }
    }

    function fail(error) {//上传失败回调方法
        //alert("An error has occurred: Code = " + error.code);
    }

    //commonService.hideLoading();
  //});

});