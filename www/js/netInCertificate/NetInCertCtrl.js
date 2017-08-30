angular.module('ssapp.controllers')

//入网证书--添加
.controller('netInAddCtrl', function($scope, $window, $state, $filter, $timeout, $ionicActionSheet, $ionicModal, $ionicSlideBoxDelegate, $ionicPopup, ConfigService, localStorageService, netInService, alertService) {
  //commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
    datePicker('netindate');
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
      $scope.netInPhotos.splice(index, 1);
      if(index === 0 && $scope.netInPhotos.length === 0) {
        $scope.modal.hide();
      } else if(index === 0 && $scope.netInPhotos.length != 0) {
        $scope.openModal(index, $scope.netInPhotos);
      } else {
        $scope.openModal(index-1, $scope.netInPhotos);
      }
    }

    //光标定位
    //$("#content").focus();
    var createdate = new Date();
    //定义报告照片
    $scope.netInPhotos = [];
    $scope.myDate=$filter('date')(createdate,'yyyy-MM-dd');
    $scope.username = localStorageService.get('User').userName;
    var userId = localStorageService.get('User').userId;
    $scope.netIn = {
      'user': { 'userId': userId },
      'content': $scope.content
    };

    $scope.addNetIn = function () {
      $scope.netIn.photoUrls = "";
      for(var i=0; i<$scope.netInPhotos.length; i++) {
        $scope.netIn.photoUrls = $scope.netIn.photoUrls + $scope.netInPhotos[i] + "|";
      }
      if($scope.netIn.photoUrls != "") {
        $scope.netIn.photoUrls = $scope.netIn.photoUrls.substring(0, $scope.netIn.photoUrls.length - 1);
      }
      $scope.netIn.netindate = $("#netindate").val();
      netInService.postNetIn($scope.netIn).then(function (data) {
        if (data.status === 1) {
          alertService.showAlert($scope, "入网证书发布成功!", true, "success", 'rwzs');
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
          $("#content").focus();
        }
      });
    };
    
    $scope.remove = function () {
      var index = $scope.netInPhotos.indexOf($scope.currentPhoto);
      if (index > -1) {
          $scope.netInPhotos.splice(index, 1);
      }
      $('.photow').hide();
      $('.photow-bg').hide();
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
                                            quality: 55,
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
        ft.upload(imageURI, encodeURI(ConfigService.getHost() + "/uploadServlet?action=enterCertificate"), win, fail, options);
    }

    function win(r) {//上传成功回调方法
        var resInfo = JSON.parse(r.response);
        if (resInfo.status === 1) {
            $scope.img = resInfo.msg;
            $scope.netInPhotos.push(resInfo.msg);
            $scope.$apply();
        } else {
            //上传失败
        }
    }

    function fail(error) {//上传失败回调方法
        //alert("An error has occurred: Code = " + error.code);
    }
  //});

})

// 入网证书
.controller('RyzsCtrl', function($scope, $state, netInService, commonService, $timeout, $ionicModal, $cordovaToast, $ionicSlideBoxDelegate){
  /*$scope.openphoto = function(photoUrl){
      $scope.bigPhoto = photoUrl;
      $('.photow').show();
      $('.photow-bg').show();
  };
          
  $scope.closephoto = function(){
      $('.photow').hide();
      $('.photow-bg').hide();
  };
  $scope.twoclick = function(){
      $('#scrollbig').animate({
          width:'130%',
          height:'130%'
      },300);
  };
          
  $scope.oneclick = function(){
      $('#scrollbig').animate({
          width:'100%',
          height:'100%'
      },300);
  };*/
  //commonService.showLoading();
  $("#loading").hide();
  //$scope.$on($state.current.name + "-init", function() {
    $ionicModal.fromTemplateUrl('tab-photo.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $('#close').click(function(){
        $('.rwgl-bg').hide();
        $('.rwgl-tan').hide();
        $('.photow-bg').hide();
    });

    $scope.items = [];
    $scope.fillDetail = function(data) {
      var newArr = [];
      $scope.detail = data;

      $("#photoP").show();
      $scope.currentPhotos = [];
      $scope.currentPhotos = data.photoUrls.split("|");
      if($scope.currentPhotos.length != 0 && $scope.currentPhotos[0] === "") {
        $("#photoP").hide();
        $scope.currentPhotos = [];
      }
      for(var i=0; i<$scope.currentPhotos.length; i++) {
        var photo = {"src":$scope.currentPhotos[i]};
        newArr.push(photo);
        $scope.items = newArr;
      }

      $('.gzq-bottom-left').hide();
      $('.bottomDetail').hide();
      $('#netinTop').show();
      $('#netinBottom').show();
      $('.rwgl-bg').show();
      $('.rwgl-tan').show();
      $('.photow-bg').show();
    };

    $scope.getFirstPhoto = function (photoUrls) {
      return photoUrls.split("|")[0];
    }

    var addMessages = function (vm, loadingId, data) {
      vm.messages = vm.messages.concat(data);
      $("#" + loadingId).hide();
      commonService.hideLoading();
      vm.finishInit = true;
      if (data.length === 0) vm.moredata = true;
      if (data.length === 0 && data.length >= 6) {
        $cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
          // success  
        }, function (error) {  
          // error  
        });
        vm.moredata = true;
      }
      //成功2秒后广播
      $timeout(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.pageNo ++;
      }, 2000);
    };
    
    $scope.getData = function () {
      netInService.getNetIns(vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
        addMessages(vm, "loading", data);
      });
    };

    var keyWords = "";
    $scope.getDataByKey = function () {
      netInService.getNetInsByKey(keyWords, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
        addMessages(vm, "loading", data);
      });
    };

    $scope.searchNetIns = function () {
      keyWords = $("#keyWords").val();
      vm = $scope.vm = commonService.getWaterFallVM($scope, $scope.getDataByKey, "loading");
      vm.init();
    }

    var vm = $scope.vm = commonService.getWaterFallVM($scope, $scope.getData, "loading");
    vm.init();
  //});
});