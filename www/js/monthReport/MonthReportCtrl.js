angular.module('ssapp.controllers')

//工作月报
.controller('mReportCtrl', function($scope, $state, $filter, $ionicModal, $ionicSlideBoxDelegate, $ionicActionSheet, ConfigService, localStorageService, mReportService, alertService) {
  //$scope.$on($state.current.name + "-init", function() {
    //图片头部动画
    $scope.controlModal = function(){
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
      var index = $scope.currentPhoto - 1;
      $scope.reportPhotos.splice(index, 1);
      if(index === 0 && $scope.reportPhotos.length === 0) {
        $scope.modal.hide();
      } else if(index === 0 && $scope.reportPhotos.length != 0) {
        $scope.openModal(index, $scope.reportPhotos);
      } else {
        $scope.openModal(index-1, $scope.reportPhotos);
      }
    }
    //定义报告照片
    $scope.reportPhotos = [];

    datePicker('startDate');
    datePicker('endDate');

    var date_ = new Date();  
    if(date_.getDate() === 1) {
      date_ = new Date(date_.getTime() - 24*60*60*1000);
    }
    var year = date_.getFullYear();  
    var month = date_.getMonth() + 1;  
    //var fromdate = year + '-' + month + '-01'; 
    var day = new Date(year,month,0);
    //var enddate = year + '-' + month + '-' + day.getDate();
    var fromdate = $filter("date")(date_, "yyyy-MM");
    fromdate = fromdate + "-01";
    var enddate = $filter("date")(day, "yyyy-MM-dd");
    $("#startDate").val(fromdate);
    $("#endDate").val(enddate);

    $scope.username = localStorageService.get('User').userName;
    var userId = localStorageService.get('User').userId;
    $scope.report = {
      'user': { 'userId': userId }
    };
    $scope.addReport = function() {
      //填充图片字段
      $scope.report.photoUrls = "";
      for(var i=0; i<$scope.reportPhotos.length; i++) {
        $scope.report.photoUrls = $scope.report.photoUrls + $scope.reportPhotos[i] + "|";
      }
      if($scope.report.photoUrls != "") {
        $scope.report.photoUrls = $scope.report.photoUrls.substring(0, $scope.report.photoUrls.length - 1);
      }
      //填充其他字段
      $scope.report.fromdate = $("#startDate").val();
      $scope.report.enddate = $("#endDate").val();
      mReportService.postReport($scope.report).then(function (data) {
        if (data.status === 1) {
          //alert("月度总结发布成功!");
          //$state.go('tab.dash');
          alertService.showAlert($scope, "月度总结发布成功!", true, "success", 'tab.dash');
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
          $("#content").focus();
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
  //});
  
});