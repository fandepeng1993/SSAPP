angular.module('ssapp.controllers')

//出差报告列表
.controller('CcbgFindCtrl', function($scope, $state, $timeout, busTripReportService, localStorageService, commonService, $cordovaToast) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.loading = true;
    $scope.hasDate = true;
    var userId = localStorageService.get("User").userId;
    $scope.getData = function () {
      busTripReportService.getReportsByPriLazy(userId, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
        $scope.hasDate = true;
        vm.messages = vm.messages.concat(data);
        $scope.loading = false;
        commonService.hideLoading();
        if(vm.messages.length === 0) {
          $scope.hasDate = false;
        }
        vm.finishInit = true;
        if (data.length === 0) vm.moredata = true;
        if (data.length === 0 && data.length > 13) {
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
      });
    };

    var vm = $scope.vm = commonService.getWaterFallVM($scope, $scope.getData, "loading");
    vm.init();

    /*$scope.addCcbg = function () {
      $state.go("ccbg");
    }*/

    $scope.viewCcbg = function (id) {
      $state.go("ccbg-view", {id:id});
    };

  });
})

//出差报告查看
.controller('CcbgViewCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicSlideBoxDelegate, busTripReportService, localStorageService, commonService, $cordovaToast) {
  $scope.back = function() {
  	window.history.go(-1);
  };

  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
  	var id = $stateParams.id;

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
    };
	$scope.reportPhotos = [];
  	busTripReportService.getReportById(id).then(function(data) {
  		$scope.report = data;
		if(data.photoUrls) $scope.reportPhotos = data.photoUrls.split("|");
  		commonService.hideLoading();
  	});
  });
})

//出差报告
.controller('CcbgCtrl',function($scope, $state, $stateParams, $timeout, $ionicModal, $ionicSlideBoxDelegate, localStorageService, ConfigService, commonService, busTripReportService, cusService, contactService, visitService, alertService, $ionicActionSheet){
  var visitId = $stateParams.visitId;

  $scope.back = function() {
  	window.history.go(-1);
  };
  //commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
	  datePicker('startDate');
	  datePicker('endDate');
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
	    };

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
	    };

	  var disable = false; //定义不可用状态
	  $scope.addReport = function () {
	  	for(var i=0; i<$scope.reportPhotos.length; i++) {
	      $scope.report.photoUrls = $scope.report.photoUrls + $scope.reportPhotos[i] + "|";
	    }
	    if($scope.report.photoUrls != "") {
	      $scope.report.photoUrls = $scope.report.photoUrls.substring(0, $scope.report.photoUrls.length - 1);
	    }
	    /*$scope.report.customer.id = $("#customerId").val().split(":")[1];
	  	$scope.report.contact.id = $("#contactId").val().split(":")[1];*/
	  	$scope.report.fromdate = $("#startDate").val();
		$scope.report.enddate = $("#endDate").val();

		var isOnline = true;
	    //若断网或不可用
	    if(!isOnline || disable) return;
		disable = true; //定义不可用状态
	    busTripReportService.postReport($scope.report).then(function (data) {
	      disable = false;
	      if (data.status === 1) {
	        alertService.showAlert($scope, "出差报告发布成功!", true, "success", 'tab.visit');
	      } else {
	        alertService.showAlert($scope, data.msg, true, "fail", null);
	        $("#content").focus();
	      }
	    });
	  };

	  //定义报告照片
	  $scope.reportPhotos = [];

	  $scope.user = localStorageService.get("User");
	  var userId = $scope.user.userId;
	  var searchDTO = {
	    "salesmanIds": [$scope.user.userId]
	  };
	  //客户列表初始化，获取单个用户的所属客户
	  /*cusService.getCusesByDTO(searchDTO).then(function (data) {
	    $scope.cusSelect = data;
	    $timeout(function() {dropDown('customerId', '<span class="show-icon">请选择客户名称</span>', '请选择客户名称');},50);
	  	commonService.hideLoading();
	  });
	  $scope.contactSelect = [];
	  $("#customerId").on("change", function () {
	  	var customerId = $("#customerId").val().split(":")[1];
	  	if(typeof(customerId) != "undefined") {
	  		contactService.getContactsByCusId(customerId).then(function (data) {
			  $scope.contactSelect = data;
			  $timeout(function() {dropDown('contactId', '<span class="show-icon">请选择拜访人名称</span>', '请选择拜访人名称');},50);
			});
	  	} else {
	  		$scope.contactSelect = [];
	  		$("#contactId_dummy").val("");
	  		$scope.$apply();
	  	}
	  });

	  $("#contactId").on("change", function () {
	  	var contactId = $("#contactId").val().split(":")[1];
	  	$.each($scope.contactSelect, function (index, item) {
	  		if(item.id === parseInt(contactId)) {
	  			$scope.report.contactTel = item.telephone;
	  			$scope.$apply();
	  		}
	  	});
	  });*/
	  visitService.getVisitById(visitId).then(function (data) {
	    $scope.visitDetail = data;
	    $scope.report.customer.id = $scope.visitDetail.customer.id;
	    $scope.report.contact.id = $scope.visitDetail.contact.id;
	    $scope.report.contactTel = $scope.visitDetail.contactTel;
	    commonService.hideLoading();
	  });
	 
	  $scope.report = {
	  	"user": {"userId": $scope.user.userId},
	  	"photoUrls": "",
	  	"customer": {"id": 0},
	  	"contact": {"id": 0},
	  	"contactTel": "",
	  	"visitPlan": {"id": visitId}
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
	      ft.upload(imageURI, encodeURI(ConfigService.getHost() + "/uploadServlet?action=busTripReports"), win, fail, options);
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