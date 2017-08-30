angular.module('ssapp.controllers')

//质量异议列表
.controller('qualityObjCtrl', function($scope, $state, $timeout, qualityObjService, localStorageService, commonService, $cordovaToast) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.loading = true;
    $scope.hasDate = true;
    var userId = localStorageService.get("User").userId;
    $scope.getQualityObjData = function () {
      qualityObjService.selectByPriLazy(userId, qualityObjVM.pagination.currentPage, qualityObjVM.pagination.perPage).then(function (data) {
        $scope.hasDate = true;
        qualityObjVM.messages = qualityObjVM.messages.concat(data);
        $scope.loading = false;
        commonService.hideLoading();
        if(qualityObjVM.messages.length === 0) {
          $scope.hasDate = false;
        }
        qualityObjVM.finishInit = true;
        if (data.length === 0) {
          $cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
            // success  
          }, function (error) {  
            // error  
          });
          qualityObjVM.moredata = true;
        }
        //成功2秒后广播
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageNo ++;
        }, 2000);
      });
    };

    var qualityObjVM = $scope.qualityObjVM = commonService.getWaterFallVM($scope, $scope.getQualityObjData, "loading");
    qualityObjVM.init();

    $scope.addQualityObj = function () {
      $state.go("zlyy", {qualityObjId:0});
    }

    $scope.viewQualityObj = function (id) {
      $state.go("zlyy", {qualityObjId:id});
    }
  });

})

//质量异议-提交
.controller('ZlyyCtrl', function($scope, $stateParams, $ionicActionSheet, $ionicModal, $ionicSlideBoxDelegate, ConfigService, qualityObjService, cusService, localStorageService, alertService) {
  /*datePicker('startDate');
  dropDown('proName', '<span class="show-icon">请选择品名</span>', '请选择品名');
  dropDown('customerId', '<span class="show-icon">客户名称</span>', '请选择客户名称');*/

  /*$scope.openphoto = function(photoUrl){
      $scope.currentPhoto = photoUrl;
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
  };

  $scope.remove = function () {
    var index = $scope.qualityPhotos.indexOf($scope.currentPhoto);
    if (index > -1) {
        $scope.qualityPhotos.splice(index, 1);
    }
    $('.photow').hide();
    $('.photow-bg').hide();
  };*/
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
    $scope.qualityPhotos.splice(index, 1);
    if(index === 0 && $scope.qualityPhotos.length === 0) {
      $scope.modal.hide();
    } else if(index === 0 && $scope.qualityPhotos.length != 0) {
      $scope.openModal(index, $scope.qualityPhotos);
    } else {
      $scope.openModal(index-1, $scope.qualityPhotos);
    }
  }

  //定义报告照片
  $scope.qualityPhotos = [];

  var userId = localStorageService.get("User").userId;
  $scope.role = -1;
  var qualityObjId = $stateParams.qualityObjId;
  $scope.isAdd = true;
  $scope.qualityObject = {
    'creator': {'userId': userId},
    'customer' : {},
    'status' : 1
  };
  var searchDTO = {
    "salesmanIds": [userId]
  };
  if(qualityObjId != 0) {
    $("#zyllDiv .item-select").removeClass("item-select");
    //$('head').append("<style>.item-select:after{color:white!important;}</style>");
    cusService.getCusesByDTO(searchDTO).then(function (data) {
      $scope.customers = data;
    });
  }

  //获取用户的角色:0--业务员；1--品质部副总；2--生产部副总；3--销售部副总
  qualityObjService.getUserRoleInQua(userId).then(function (data) {
    $scope.role = parseInt(data);
    //若不是为了添加而登进来，则根据id取数据，填充数据
    if(qualityObjId != 0) {
      //先限制添加时要填的输入框为readonly
      $scope.isAdd = false;
      qualityObjService.selectById(qualityObjId).then(function (data) {
        $scope.qualityObject = data;
        $("#customerId_dummy").val($scope.qualityObject.customer.customerName);
        $("#proName_dummy").val($scope.qualityObject.proName);
        $("#startDate").val($scope.qualityObject.deliveryTime);
        $scope.qualityPhotos = $scope.qualityObject.appendix.split("|");
      });
    } else {
      datePicker('startDate');
      dropDown('proName', '<span class="show-icon">请选择品名</span>', '请选择品名');
      dropDown('customerId', '<span class="show-icon">客户名称</span>', '请选择客户名称');
    }
  });

  $scope.addQualityObj = function () {
    $scope.qualityObject.appendix = "";
    for(var i=0; i<$scope.qualityPhotos.length; i++) {
      $scope.qualityObject.appendix = $scope.qualityObject.appendix + $scope.qualityPhotos[i] + "|";
    }
    if($scope.qualityObject.appendix != "") {
      $scope.qualityObject.appendix = $scope.qualityObject.appendix.substring(0, $scope.qualityObject.appendix.length - 1);
    }

    switch($scope.role) {
      case -1:
        alertService.showAlert($scope, "请先登陆！", true, "warning", null);
        break;
      case 0:case 4:
        //业务员
        if(qualityObjId != 0) {
          alertService.showAlert($scope, "抱歉，您已提交本申诉，不能进行修改！", true, "fail", null);
          return;
        }
        $scope.qualityObject.customer.id = $("#customerId").val();
        $scope.qualityObject.proName = $("#proName").val();
        $scope.qualityObject.deliveryTime = $("#startDate").val();
        qualityObjService.postQualityObj($scope.qualityObject).then(function (data) {
          if (data.status === 1) {
            alertService.showAlert($scope, "质量异议提交成功!", true, "success", 'zlyy-find');
          } else {
            alertService.showAlert($scope, data.msg, true, "fail", null);
          }
        });
        break;
      case 1:
        //品质部副总
        if($("#defectReason").val() === "" || $("#correctAction").val() === "" || $("#qualityDeptView").val() === "") {
          alertService.showAlert($scope, "请填写质量缺陷原因，纠正预防措施以及品质部意见！", true, "warning", null);
          return;
        }
        /*if($scope.qualityObject.status != 1) {
          alertService.showAlert($scope, "亲，当前流程不在品质部副总，您不能修改相关信息！", true, "warning", null);
          return;
        }*/
        var updateQualityObj = {
          'id': qualityObjId,
          'qualityMgr': {'userId': userId},
          'defectReason': $("#defectReason").val(),
          'correctAction': $("#correctAction").val(),
          'qualityDeptView': $("#qualityDeptView").val(),
          'status' : 2
        };
        qualityObjService.updateQualityObj(updateQualityObj).then(function (data) {
          if (data.status === 1) {
            alertService.showAlert($scope, "提交成功!", true, "success", 'zlyy-find');
          } else {
            alertService.showAlert($scope, data.msg, true, "fail", null);
          }
        });
        break;
      case 2:
        //生产部副总
        if($("#proMgrView").val() === "") {
          alertService.showAlert($scope, "请填写生产副总意见！", true, "warning", null);
          return;
        }
        /*if($scope.qualityObject.status != 2) {
          alertService.showAlert($scope, "亲，当前流程不在生产部副总，您不能修改相关信息！", true, "warning", null);
          return;
        }*/
        var updateQualityObj = {
          'id': qualityObjId,
          'proMgr': {'userId': userId},
          'proMgrView': $("#proMgrView").val(),
          'status' : 3
        };

        qualityObjService.updateQualityObj(updateQualityObj).then(function (data) {
          if (data.status === 1) {
            alertService.showAlert($scope, "提交成功!", true, "success", 'zlyy-find');
          } else {
            alertService.showAlert($scope, data.msg, true, "fail", null);
          }
        });
        break;
      case 3:
        //销售部副总
        if($("#saleMgrView").val() === "") {
          alertService.showAlert($scope, "请填写销售副总意见！", true, "warning", null);
          return;
        }
        /*if($scope.qualityObject.status != 3) {
          alertService.showAlert($scope, "亲，当前流程不在销售部副总，您不能修改相关信息！", true, "warning", null);
          return;
        }*/
        var updateQualityObj = {
          'id': qualityObjId,
          'saleMgr': {'userId': userId},
          'saleMgrView': $("#saleMgrView").val(),
          'status' : 4
        };

        qualityObjService.updateQualityObj(updateQualityObj).then(function (data) {
          if (data.status === 1) {
            alertService.showAlert($scope, "提交成功!", true, "success", 'zlyy-find');
          } else {
            alertService.showAlert($scope, data.msg, true, "fail", null);
          }
        });
        break;
      default:
        alertService.showAlert($scope, "抱歉，您没有权限，无法提交！", true, "warning", null);
        break;
    }
  }

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
      ft.upload(imageURI, encodeURI(ConfigService.getHost() + "/uploadServlet?action=qualityObjection"), win, fail, options);
  }

  function win(r) {//上传成功回调方法
      var resInfo = JSON.parse(r.response);
      if (resInfo.status === 1) {
          $scope.img = resInfo.msg;
          $scope.qualityPhotos.push(resInfo.msg);
          $scope.$apply();
      } else {
          //上传失败
      }
  }

  function fail(error) {//上传失败回调方法
      //alert("An error has occurred: Code = " + error.code);
  }
  
});