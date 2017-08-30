angular.module('ssapp.controllers')

// 地图
.controller('MapCtrl', function($scope, $state, $http, $timeout, $ionicScrollDelegate, $cordovaGeolocation, $ionicHistory, $interval, $ionicPopup, $ionicModal, $ionicSlideBoxDelegate, localStorageService, TimeService, attService, commonService, ConfigService, alertService, $filter, cusService) {
  //$scope.$on($state.current.name + "-init", function() {
  // ww();  
  $ionicModal.fromTemplateUrl('templates/attendance/modalMap.html', {
    scope: $scope}).then(function(modal) {
    $scope.modal1 = modal;
  });

  $scope.$on('$stateChangeStart', function(e, state) {
    $scope.modal1.remove();
  });

  var alreadyGetCus = false;
  var isSaleMan = false;
  $scope.showModel1 = function() {
    $scope.modal1.show();
    if(!alreadyGetCus) {
      getCustomers();
      //判断是否是外出
      var outFalse = $("#normal");
      var outTrue = $("#outWork");
      outTrue.on('click',function(){
        $("#client").show();
        isSaleMan = true;
      });

      outFalse.on('click',function(){
        $("#client").hide();
        $("#customerId_dummy").val("");
        $("#customerId").val("?");
        isSaleMan = false;
      });
    }
    dropDown('exPlan', '<span class="show-icon">请选择任务类别</span>', '请选择任务类别');
    
  };
  

  //图片头部动画
  $scope.controlModal = function(){
    if($(".photo-top-fixed").hasClass("showTitle")){
      $(".photo-top-fixed").animate({top:"0px"});
      $(".photo-top-fixed").removeClass("showTitle");
    }else{
      $(".photo-top-fixed").addClass("showTitle");
      $(".photo-top-fixed").animate({top:"-40px"});
    }
  };

      //监听滑动
      $scope.photoChanged = function (index) {
        $scope.currentPhoto = index + 1;
      };
      //图片展示
    
      $ionicModal.fromTemplateUrl('tab-photo.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function (index, photo) {
        $scope.showPhotos = [];
        $scope.showPhotos.push(photo);
        $ionicSlideBoxDelegate.slide(index);
        $scope.slidePhotoArray = $scope.showPhotos;
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
        $scope.showPhotos.splice(index, 1);
        $scope.attendanceImg = "";
        if(index === 0 && $scope.showPhotos.length === 0) {
          $scope.modal.hide();
        } else if(index === 0 && $scope.showPhotos.length != 0) {
          $scope.openModal(index, $scope.showPhotos);
        } else {
          $scope.openModal(index-1, $scope.showPhotos);
        }
      };
      var newDate = new Date();
      $scope.currentDate = $filter('date')(newDate,'yyyy-MM-dd') + " 00:00:00";
      $scope.currentDateStr = $filter('date')(newDate,'yyyy年MM月dd日');
      $scope.lunarDay = TimeService.getLunarDay(newDate.getFullYear(), newDate.getMonth()+1, newDate.getDate());

      //定义展示用的图片数组（只有一项）
      $scope.showPhotos = [];

      $scope.datas = [];

      var userId = localStorageService.get("User").userId;

      var getCustomers = function () {
        //客户选择
        var searchDTO = {
          "salesmanIds": [userId]
        };
        //客户列表初始化，获取单个用户的所属客户
        cusService.getCusesByDTO(searchDTO).then(function (data) {
          $scope.cusSelect = data;
          alreadyGetCus = true;
          $timeout(function() {dropDown('customerId', '<span class="show-icon">请选择客户名称</span>', '请选择客户名称');},50);
          //$scope.typemodel.unshift({id:1,typeName:'全部'});
        });
      }
      

      /*$scope.init = function() {
        //调用
        getLocation();
        if (device.platform != "Android") {
          initCompanyMap();
        }
        //getLocation();
      };*/

      var address = "";
      var addName = "";
      var alreadyAlert = false;

      //定义选中项对应的marker
      var selMarker = null;
      //设定当前所在位置标记
      var marker = null;
      var map = $scope.map;
      var infoWindow = null;
      var info = null;

      var addMaker = function(lnglatXY, content) {
          if(marker != null) {
            marker.setMap(map);  //在地图上添加点
            marker.setPosition(lnglatXY);
            infoWindow.setContent(content);
            infoWindow.open(map, lnglatXY);
          } else {
            marker = new AMap.Marker({  //加点
                map: map,
                position: lnglatXY,
                //icon: "http://webapi.amap.com/images/0.png"
                icon: new AMap.Icon({            
                    size: new AMap.Size(40, 50),  //图标大小
                    image: "img/map1.png"
                })
            });
            infoWindow = new AMap.InfoWindow({
              offset: new AMap.Pixel(10, -30)
            });
            infoWindow.setContent(content);
            infoWindow.open(map, lnglatXY);
          }
          
          //_map.setFitView();
          marker.content = content;
          marker.on('click', markerClick);
          marker.emit('click', {target: marker});
      };

      var markerClick = function(e) {
          infoWindow.setContent(e.target.content);
          infoWindow.open(map, e.target.getPosition());
      };

      /*$scope.$watch('datas', function(newValue) {
        $scope.datas = newValue;
      });*/

      $scope.formatName = function (name) {
        if(name.length < 17) {
          return name;
        }
        return name.substring(0,18) + "...";
      };

      $scope.formatAddress = function (name) {
        if(name.length < 24) {
          return name;
        }
        return name.substring(0,24) + "...";
      };  

      $scope.styleChange = function(index, data, map1, addressComponent) {
        //alert(index);
        map = map1;
        $("#check"+index).show();
        $("#oDiv"+index).hide();
        $("#mo"+index).hide();
        $("#xian"+index).show();
        $(document).find("i[id^='xian'][id!='xian"+index+"']").hide();
        $(document).find("div[id^='check'][id!='check"+index+"']").hide();
        $(document).find("div[id^='oDiv'][id!='oDiv"+index+"']").show();
        $(document).find("i[id^='mo'][id!='mo"+index+"']").show();
        // $("#checkingBottom").show();
        // $("#checkingBottom").animate({bottom:"0px"});
      //   if($("ion-content").scroll()){
      //   $("#checkingBottom").animate({bottom:"-150px"});
      // }
        
        //将前一个marker清除，并显示新的marker以及消息窗口。
        if(selMarker != null) {
          selMarker.setVisible(false);
        }
        var center = [data.location.lng, data.location.lat];
        $ionicScrollDelegate.scrollTop();
        map.setCenter(center);

        //var position = new qq.maps.LatLng(data.latLng.lat, data.latLng.lng);
        addMaker(center, data.name);
        //设定消息窗口
        /*infoWindow.open();//.open(_map, e.target.getPosition());
        infoWindow.setContent("<div style=\"color:black;\">" + data.name + "</div>");
        infoWindow.setPosition(center);*/
        /*if(data.pname === data.cityname) {
          address = data.pname + data.adname + data.address;
        } else {
          address = data.pname + data.cityname + data.adname + data.address;
        }*/
        addName = data.name;
        address = addressComponent.province + addressComponent.city + addressComponent.district + addressComponent.township + data.address;
      };

      var initAddress = true;
      //初始化选择第一个最近的地址
      $scope.initAddress = function (index, data, map1, addressComponent) {
        if(initAddress) {
          $timeout(function () {
            $scope.styleChange(index, data, map1, addressComponent);
            //$("#signDiv").show();
          }, 30);
          initAddress = false;
        }
      }
      //签到
      $scope.signIn = function () {
        var att = {
          "user": {"userId": userId},
          "customer": {}
        };
        //判断客户是否填写
        var customerId = $("#customerId").val().substring(7,$("#customerId").val().length);
        if(isSaleMan) {
          if(customerId != "" && !isNaN(customerId)) {
            att.customer.id = customerId;
          } else {
            alertService.showAlert($scope, "请选择客户名称！", true, "warning", null);
            return;
          }
        }

        if(address != "") {
          att.signInAddress = addName + "@" + address;
          var myJsDate = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
          att.signInTime = myJsDate;
          att.signInPhoto = $scope.attendanceImg;
          attService.postAtt(att).then(function (data) {
            if(data.status == 1) {
              alertService.showAlert($scope, "签到成功!", true, "success", null);
              $scope.modal1.hide();
            } else {
              alertService.showAlert($scope, data.msg, true, "fail", null);
            }
          });
        } else {
          alertService.showAlert($scope, "请选择某个地址！", true, "warning", null);
        }
      };

      //签退
      $scope.signOut = function () {
        var att = {
          "user": {"userId": userId}
        };
        if(address != "") {
          att.signOutAddress = addName + "@" + address;
          att.signOutPhoto = $scope.attendanceImg;
          var myJsDate = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
          att.signOutTime = myJsDate;
          attService.postAtt(att).then(function (data) {
            if(data.status == 1) {
              alertService.showAlert($scope, "签退成功!", true, "success", null);
            } else {
              alertService.showAlert($scope, data.msg, true, "fail", null);
            }
          });
        } else {
          alertService.showAlert($scope, "请选择某个地址！", true, "warning", null);
        }
      };

      //定义选择照片的函数
      $scope.choosePicMenu = function() {
          if(address === "") {
            alertService.showAlert($scope, "请选择某个地址！", true, "warning", null);
            return;
          }
          if($scope.attendanceImg != null && $scope.attendanceImg != "") {
            /*$scope.currentPhoto = $scope.attendanceImg;
            $('.photow').show();
            $('.photow-bg').show();*/
            $scope.openModal(0, $scope.attendanceImg);
            return;
          }
          // Retrieve image file location from specified source
          navigator.camera.getPicture(uploadPhoto,
                                    function(message) { 
                                      //alert('get picture failed'); 
                                    },
                                    { 
                                      sourceType: 1,
                                      quality: 55,
                                      correctOrientation: true,
                                      targetWidth: 1024,                                        //照片宽度
                                      targetHeight: 768                                       //照片高度
                                    });
          return true;
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
          var userName = localStorageService.get("User").userName;

          ft.upload(imageURI, encodeURI(ConfigService.getHost() + "/uploadServlet?action=attendance&userName=" + userName + "&address=" + address), win, fail, options);
      }

      $scope.attendanceImg = "";
      function win(r) {//上传成功回调方法
          var resInfo = JSON.parse(r.response);
          if (resInfo.status === 1) {
              $scope.attendanceImg = resInfo.msg;
              //$scope.reportPhotos.push(resInfo.msg);
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

// 地图
.controller('MapCtrl1', function($scope, $http, $timeout, $cordovaGeolocation, $ionicHistory, $interval, $ionicPopup, localStorageService, attService, commonService, ConfigService, alertService, $filter) {
    $scope.openphoto = function(photoUrl){
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
    $scope.datas = [];

    //声明方法
    var loadjs = function (src, func) {
      //判断这个js文件存在直接执行回调
      var scripts = document.getElementsByTagName('script');
      for (i in scripts)
        if (scripts[i].src == src)
          return func();
      if (typeof func != 'function') {
        console.log('param 2 is not a function!!');
        return false;
      }
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.charset = "utf-8";
      script.src = src;
      var head = document.getElementsByTagName('head').item(0);
      head.appendChild(script);
      var scripts = document.getElementsByTagName('script');
      script.onload = function () {
        func();
      }
    }

    $scope.init = function() {
      //调用
      loadjs("lib/utils/qqMap.js", getLocation);
      if (device.platform != "Android") {
        initCompanyMap();
      }
      //getLocation();
    };

    var address = "";
    // 腾讯地图
    var getLocation = function () {
        address = "";
        //判断是否支持 获取本地位置
        if (navigator.geolocation) {
          if(device.platform != "Android") {
            navigator.geolocation.getCurrentPosition(showPosition, locationError);
          } else {
            navigator.geolocation.getCurrentPosition(showPosition);
          }
        } else {
            alert("浏览器不支持定位.");
        }
    };
    var alreadyAlert = false;
        
    var locationError = function (error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
            //alert('Please allow geolocation access for this to work.您拒绝了使用位置共享服务，查询已取消');
            //  alert（警告） 对话框
            if(!alreadyAlert) {
                var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: "抱歉，应用未获得定位服务相关权限，请进入系统【设置】>【隐私】>【定位服务】中对应用权限进行设置，否则将无法正常使用签到服务！",
                    buttons:[{
                        text: '确定',
                        type: 'button-positive'
                    }],
                });
            }
            alreadyAlert = true;

            break;
        }
    }

    var mapTimeout = $interval(getLocation, 30000, false);
    $scope.$on('$stateChangeStart',function(){
       $interval.cancel(mapTimeout);
    });

    //定义选中项对应的marker
    var selMarker = null;
    //设定当前所在位置标记
    var marker = null;
    var map = null;
    var info = null;

    var initCompanyMap = function () {
        var companyCenter = new qq.maps.LatLng(31.36298, 121.24492);
        map = new qq.maps.Map(document.getElementById("mapContainer"), {
                center: companyCenter,
                zoom: 15,
        });
        //设置marker标记
        marker = new qq.maps.Marker({
                map: map,
                position: companyCenter
        });
        //设置Marker自定义图标的属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
        var size = new qq.maps.Size(20, 26),
        icon = new qq.maps.MarkerImage(
                "img/map.png",
                size
        );
        marker.setIcon(icon);
        //添加到提示窗
        info = new qq.maps.InfoWindow({
                map: map
        });
        
        info.open();
        info.setContent("<div style=\"color:red;\">上上德盛集团</div>");
        info.setPosition(companyCenter);
        //添加监听事件 当标记被点击了  设置图层
        qq.maps.event.addListener(marker, 'click', function() {
             info.open();
             info.setContent("<div style=\"color:red;\">上上德盛集团</div>");
             info.setPosition(result.detail.location);
        });
    };

    var showPosition = function (position) {
        var lat = position.coords.latitude; 
        var lng = position.coords.longitude;
        var geocoder, latlng;
        //调用地图命名空间中的转换接口   type的可选值为 1:gps经纬度，2:搜狗经纬度，3:百度经纬度，4:mapbar经纬度，5:google经纬度，6:搜狗墨卡托
        qq.maps.convertor.translate(new qq.maps.LatLng(lat,lng), 1, function(res) {
            //取出经纬度并且赋值
            latlng = res[0];
            $("#mapContainer").empty();
            map = new qq.maps.Map(document.getElementById("mapContainer"), {
                center: latlng,
                zoom: 15
            });

            //设置marker标记
            marker = new qq.maps.Marker({
                map: map,
                position: latlng
            });
            //设置Marker自定义图标的属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
            var size = new qq.maps.Size(20, 26),
                icon = new qq.maps.MarkerImage(
                    "img/map.png",
                    size
                );
            marker.setIcon(icon);
            //添加到提示窗
            info = new qq.maps.InfoWindow({
                map: map
            });

            geocoder = new qq.maps.Geocoder({
                complete : function(result){
                    $scope.$apply(function() {
                        $scope.datas = result.detail.nearPois;
                        //在第一个位置加入当前选定地点
                        /*$timeout(function () {
                          alert(angular.toJson(detail));
                            var json = {
                              "name":detail.address,
                              "latLng":detail.location,
                              "address":detail.address,
                              "dist":0
                            };
                            alert(angular.toJson(json));
                            $scope.datas.splice(0,0,json);
                        },5000);*/
                    });
                    map.setCenter(result.detail.location);
                    /*var marker = new qq.maps.Marker({
                        map:map,
                        position: result.detail.location
                    });*/
                    info.open();
                    info.setContent("<div style=\"color:red;\">" + result.detail.address + "</div>");
                    info.setPosition(result.detail.location);
                    //添加监听事件 当标记被点击了  设置图层
                    qq.maps.event.addListener(marker, 'click', function() {
                        info.open();
                        info.setContent("<div style=\"color:red;\">" + result.detail.address + "</div>");
                        info.setPosition(result.detail.location);
                    });
                }
            });
            geocoder.getAddress(latlng);
        });
    };

    //获取某个经纬度地址的详细信息。
    $scope.getDetailByPos = function(lat, lng) {
        //地址和经纬度之间进行转换服务
        var myGeocoder = new qq.maps.Geocoder();
        var latLng = new qq.maps.LatLng(lat, lng);
        //对指定经纬度进行解析
        myGeocoder.getAddress(latLng);
        //设置服务请求成功的回调函数
        myGeocoder.setComplete(function(result) {
          var detail = result.detail;
          return detail;
        });
    };

    $scope.$watch('datas', function(newValue) {
      $scope.datas = newValue;
    });

    var userId = localStorageService.get("User").userId;

    $scope.styleChange = function(index, data) {
      //alert(index);
      //alert(angular.toJson(data));
      $("#check"+index).show();
      $("#oDiv"+index).hide();
      $("#mo"+index).hide();
      $("#xian"+index).show();
      $(document).find("i[id^='xian'][id!='xian"+index+"']").hide();
      $(document).find("div[id^='check'][id!='check"+index+"']").hide();
      $(document).find("div[id^='oDiv'][id!='oDiv"+index+"']").show();
      $(document).find("i[id^='mo'][id!='mo"+index+"']").show();

      //将前一个marker清除，并显示新的marker以及消息窗口。
      if(selMarker != null) {
        selMarker.setVisible(false);
      }
      map.setCenter(data.latLng);
      //var position = new qq.maps.LatLng(data.latLng.lat, data.latLng.lng);
      selMarker = new qq.maps.Marker({
        map: map,
        position: data.latLng
      });
      //设定消息窗口
      info.open();
      info.setContent("<div style=\"color:black;\">" + data.name + "</div>");
      info.setPosition(data.latLng);
      address = data.address;
    };
    //签到
    $scope.signIn = function () {
      var att = {
        "user": {"userId": userId}
      };
      if(address != "") {
        att.signInAddress = address;
        var myJsDate = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        att.signInTime = myJsDate;
        att.signInPhoto = $scope.attendanceImg;
        attService.postAtt(att).then(function (data) {
          if(data.status == 1) {
            alertService.showAlert($scope, "签到成功!", true, "success", null);
          } else {
            alertService.showAlert($scope, data.msg, true, "fail", null);
          }
        });
      } else {
        alertService.showAlert($scope, "请选择某个地址！", true, "warning", null);
      }
    };
    //签退
    $scope.signOut = function () {
      var att = {
        "user": {"userId": userId}
      };
      if(address != "") {
        att.signOutAddress = address;
        att.signOutPhoto = $scope.attendanceImg;
        var myJsDate = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        att.signOutTime = myJsDate;
        attService.postAtt(att).then(function (data) {
          if(data.status == 1) {
            alertService.showAlert($scope, "签退成功!", true, "success", null);
          } else {
            alertService.showAlert($scope, data.msg, true, "fail", null);
          }
        });
      } else {
        alertService.showAlert($scope, "请选择某个地址！", true, "warning", null);
      }
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
      $scope.attendanceImg = "";
      $('.photow').hide();
      $('.photow-bg').hide();
    };

    //定义选择照片的函数
    $scope.choosePicMenu = function() {
        if(address === "") {
          alertService.showAlert($scope, "请选择某个地址！", true, "warning", null);
          return;
        }
        if($scope.attendanceImg != null && $scope.attendanceImg != "") {
          $scope.currentPhoto = $scope.attendanceImg;
          $('.photow').show();
          $('.photow-bg').show();
          return;
        }
        // Retrieve image file location from specified source
        navigator.camera.getPicture(uploadPhoto,
                                  function(message) { 
                                    //alert('get picture failed'); 
                                  },
                                  { 
                                    sourceType: 1,
                                    quality: 55,
                                    correctOrientation: true,
                                    targetWidth: 1024,                                        //照片宽度
                                    targetHeight: 768                                       //照片高度
                                  });
        return true;
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
        var userName = localStorageService.get("User").userName;

        ft.upload(imageURI, encodeURI(ConfigService.getHost() + "/uploadServlet?action=attendance&userName=" + userName + "&address=" + address), win, fail, options);
    }

    $scope.attendanceImg = "";
    function win(r) {//上传成功回调方法
        var resInfo = JSON.parse(r.response);
        if (resInfo.status === 1) {
            $scope.attendanceImg = resInfo.msg;
            //$scope.reportPhotos.push(resInfo.msg);
            $scope.$apply();
        } else {
            //上传失败
        }
    }

    function fail(error) {//上传失败回调方法
        //alert("An error has occurred: Code = " + error.code);
    }
})

//考勤记录
.controller('signRecordCtrl', function($scope, $state, $stateParams, $timeout, UserService, alertService, commonService, attService, $cordovaToast) {
  commonService.showLoading();
  $("ion-content").show();
  $scope.$on($state.current.name + "-init", function() {
    //var user = localStorageService.get("User");
    $scope.openphoto = function(photoUrl){
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
    //签到数据部分
    $("#signInLoading").hide();
    $scope.getSignInData = function () {
      attService.getSignInAtts(signInVM.pagination.currentPage, signInVM.pagination.perPage).then(function (data) {
        signInVM.messages = signInVM.messages.concat(data);
        $("#signInLoading").hide();
        commonService.hideLoading();
        signInVM.finishInit = true;
        if (data.length === 0) {
          $cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
            // success  
          }, function (error) {  
            // error  
          });
          signInVM.moredata = true;
        }
        //成功2秒后广播
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageNo ++;
        }, 2000);
      });
    };

    var signInVM = $scope.signInVM = commonService.getWaterFallVM($scope, $scope.getSignInData, "signInLoading");
    signInVM.init();

    //签退数据部分
    $("#signOutLoading").hide();
    $scope.getSignOutData = function () {
      attService.getSignOutAtts(signOutVM.pagination.currentPage, signOutVM.pagination.perPage).then(function (data) {
          signOutVM.messages = signOutVM.messages.concat(data);
          $("#signOutLoading").hide();
          signOutVM.finishInit = true;
          if (data.length === 0) {
          $cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
          // success  
        }, function (error) {  
          // error  
        });
          signOutVM.moredata = true;
        }
        //成功2秒后广播
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageNo ++;
        }, 2000);
      });
    };

    $scope.formatAddr = function (addr) {
      if(addr.indexOf("@") === -1) {
        return addr;
      } else {
        return addr.split("@")[0] + "(" + addr.split("@")[1] + ")";
      }
      
    }

    var signOutVM = $scope.signOutVM = commonService.getWaterFallVM($scope, $scope.getSignOutData, "signOutLoading");
    signOutVM.init();

    $scope.getPhotoJson = function (photoUrl) {
      var items = [];
      var photo = {src:photoUrl};
      items.push(photo);
      return items;
    }
  });
})

// 地图展示
.controller('MapShowCtrl', function($scope, $filter, $compile, $ionicSideMenuDelegate, gaodeMapService, attService){
  $scope.showAll = function(){
    $(".common-bg").show();
    if(device.platform === "Android") {
      $(".checkingMap-top").animate({"top":"44px"});
    } else {
      $(".checkingMap-top").animate({"top":"60px"});
    }
  };
  $scope.hideAll = function(){
    $(".common-bg").hide();
    $(".checkingMap-top").animate({"top":"-200px"});
    $("#photo" + currentArrId).attr("src", "img/touxiang.png");
    $("#photo" + currentArrId).parent().removeClass("checking-face-in-change");
  };

  $scope.close = function(){
    $("#container").css("height", "100%");
    $("#progress").hide();
  };

  var map;
  //var currentLnglatXY = localStorageService.get(currentLnglatXY);
  map = new AMap.Map('container', {
    resizeEnable: true,
    //center: currentLnglatXY,
    zoom: 5
  });

  gaodeMapService.addToolBar(map);

  var currentIndex = 0;
  //定位完成回调
  var complete_CallBack = function(data) {
    var lnglatXY = [];
    lnglatXY.push(data.position.getLng());
    lnglatXY.push(data.position.getLat());
    var addresscomponent = data.addressComponent;
    var currentAddress = addresscomponent.province + addresscomponent.city + addresscomponent.district + 
                addresscomponent.township + addresscomponent.street + addresscomponent.streetNumber;
  };

  //点击Map回调
  var clickCallBack = function (result) {
    var addresscomponent = result.regeocode.addressComponent;
    var formattedAddress = addresscomponent.province + addresscomponent.city + addresscomponent.district + 
                addresscomponent.township + addresscomponent.street + addresscomponent.streetNumber;
    //showProgress("选中位置", formattedAddress, false);
  };
  //gaodeMapService.initMap(map, false, clickCallBack, complete_CallBack);
  map.plugin('AMap.Geolocation', function() {
                    geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                        showButton: true,        //显示定位按钮，默认：true
                        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                        buttonOffset: new AMap.Pixel(10, 30),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                        showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                        panToLocation: true,      //定位成功后将定位到的位置作为地图中心点，默认：true
                        zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        useNative: true
                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', complete_CallBack);//返回定位信息
                });

  //定义考勤不同的位置及其个数
  $scope.attPosJson = {};
  //用于考勤位置标记
  //考勤位置展示的回调
  var getLocatCallBack = function (result, attendance) {
    var content;
    if(attendance.user.photoUrl != null && attendance.user.photoUrl != "") {
      content = "<div class=\"checking-face-in\"><img id=\"photo" + attendance.attendanceId + "\" src=\"img/touxiang.png\"><img src='" + attendance.user.photoUrl + "'></div>";
    } else {
      content = "<div class=\"checking-face-in\"><img id=\"photo" + attendance.attendanceId + "\" src=\"img/touxiang.png\"><img src=\"img/default.png\"></div>";
    }
    
    var attMarker = new AMap.Marker({
            map:map,
            bubble:true,
            offset: new AMap.Pixel(-25,-58.2),
            content: content
          });
    //var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(10, -30)});
    attMarker.setPosition(result.geocodes[0].location);
    //$scope.targetLnglatXY = [attMarker.getPosition().lng, attMarker.getPosition().lat];
    attMarker.attendance = attendance;
    attMarker.address = result.geocodes[0].formattedAddress;
    attMarker.showIndex = 0;
    var addresscomponent = result.geocodes[0].addressComponent;

    //填充考勤不同的位置及其个数的数组
    var city;
    if(addresscomponent.province === addresscomponent.city) city = addresscomponent.province;
    else city = addresscomponent.province + addresscomponent.city;
    if(typeof($scope.attPosJson[city]) != "undefined") {
      eval("$scope.attPosJson." + city + "++");
    } else {
      eval("$scope.attPosJson." + city + "=1");
    }
    currentIndex++;
    if(currentIndex >= $scope.attLength-2) appendHtml($scope.attPosJson);

    map.setCenter(attMarker.getPosition());
    attMarker.on('click', markerClick);
    //attMarker.emit('click', {target: attMarker});
  };
  var currentArrId;
  //项目标记的点击事件
  var markerClick = function(e) {
    currentArrId = e.target.attendance.attendanceId;
    $("#photo" + currentArrId).attr("src", "img/touxiang1.png");
    $("#photo" + currentArrId).parent().addClass("checking-face-in-change");
    $scope.showAll();
    if(e.target.showIndex != 0) {
      clickMarker = true;
    }
    e.target.showIndex++;
    $scope.attendance = e.target.attendance;
    $scope.$apply();
    //showProgress(e.target.projectName, e.target.address, true);
    e.preventDefault();
  };

  //根据地址信息获取项目位置
  var showProjectPoint = function (address, attendance) {
    gaodeMapService.getLocation(address, getLocatCallBack, attendance);
  };

  $scope.attPeopleList = [];
  //获取今天的考勤记录
  var currentDate = $filter('date')(new Date(),'yyyy-MM-dd');
  attService.getAttsJsonbyDate(currentDate, currentDate).then(function (data) {
    $scope.attLength = data.length;
    $.each(data, function (index, item) {
	  //统计今天签到总人数
	  if($scope.attPeopleList.indexOf(item.user.userId) === -1) {
		  $scope.attPeopleList.push(item.user.userId);
	  }
	  
      if(item.signInAddress.indexOf("@") === -1) {
        item.signInAddress = item.signInAddress;
      } else {
        item.signInAddress = item.signInAddress.split("@")[0] + "(" + item.signInAddress.split("@")[1] + ")";
      }
      showProjectPoint(item.signInAddress, item);
    })
  });

  var moveToCityCallBack = function (result) {
    map.setCenter(result.geocodes[0].location);
    map.setZoom(10);
    if($ionicSideMenuDelegate.isOpen()) {
      $ionicSideMenuDelegate.toggleRight();
    }
  };

  //移动到指定城市
  $scope.moveToCity = function (city) {
    gaodeMapService.getLocation(city, moveToCityCallBack);
  };


  //侧滑栏内容
  var appendHtml = function (map) {
    $('#userHTML').html("");
    var html = "";
    for(var city in map) {
      html = html + "<div class=\"sort_list sort_list_right\">" +
          "<div class=\"num_name\" ng-click=\"moveToCity('" + city + "')\">" + city + "(签到：" + map[city] + "人)</div>" +
        "</div>";
    }
    var mobileDialogElement = $compile(html)($scope);
    $('#userHTML').append(mobileDialogElement);
    init();
  };

  var windowHeight=$('ion-view').height();
  var init = function () {
    var Initials=$('.initials');
    var LetterBox=$('#letter');
    Initials.children('ul').html("");
    Initials.find('ul').append('<li></li><li>A</li><li>B</li><li>C</li><li>D</li><li>E</li><li>F</li><li>G</li><li>H</li><li>I</li><li>J</li><li>K</li><li>L</li><li>M</li><li>N</li><li>O</li><li>P</li><li>Q</li><li>R</li><li>S</li><li>T</li><li>U</li><li>V</li><li>W</li><li>X</li><li>Y</li><li>Z</li><li>#</li>');
    
    initials();
    $(".initials ul li").click(function(){
        var _this=$(this);
        var LetterHtml=_this.html();
        LetterBox.html(LetterHtml).fadeIn();
        Initials.css('background','#ccc');  
        setTimeout(function(){
            Initials.css('background','#fff');
            LetterBox.fadeOut();
        },100);
        var _index = _this.index();
        if(_index===0){
            $('ion-content').animate({scrollTop: '0px'}, 100);//点击第一个滚到顶部
        }else{
            var letter = _this.text();
            if($('#'+letter).length>0){
                var LetterTop = document.getElementById(letter).offsetTop;
                $('ion-content').animate({scrollTop: LetterTop+'px'}, 100);
            }
        }
    });
    var InitHeight=windowHeight-45;
    Initials.height(InitHeight);
    var LiHeight=InitHeight/30;
    Initials.find('li').height(LiHeight);
  };

  function initials() {//公众号排庿
      var SortList=$(".sort_list");
      var SortBox=$(".sort_box");
      SortBox.html("");
      SortList.sort(asc_sort).appendTo('.sort_box');//按首字母排序
      function asc_sort(a, b) {
          return makePy($(b).find('.num_name').text().charAt(0))[0].toUpperCase() < makePy($(a).find('.num_name').text().charAt(0))[0].toUpperCase() ? 1 : -1;
      }

      var initials = [];
      var num=0;
      SortList.each(function(i) {
          var initial = makePy($(this).find('.num_name').text().charAt(0))[0].toUpperCase();
          if(initial>='A'&&initial<='Z'){
              if (initials.indexOf(initial) === -1)
                  initials.push(initial);
          }else{
              num++;
          }
      });

      $.each(initials, function(index, value) {//添加首字母标筿
          SortBox.append('<div class="sort_letter" id="'+ value +'">' + value + '</div>');
      });
      if(num!=0){SortBox.append('<div class="sort_letter" id="default">#</div>');}

      for (var i =0;i<SortList.length;i++) {//插入到对应的首字母后靿
          var letter=makePy(SortList.eq(i).find('.num_name').text().charAt(0))[0].toUpperCase();
          switch(letter){
              case "A":
                  $('#A').after(SortList.eq(i));
                  break;
              case "B":
                  $('#B').after(SortList.eq(i));
                  break;
              case "C":
                  $('#C').after(SortList.eq(i));
                  break;
              case "D":
                  $('#D').after(SortList.eq(i));
                  break;
              case "E":
                  $('#E').after(SortList.eq(i));
                  break;
              case "F":
                  $('#F').after(SortList.eq(i));
                  break;
              case "G":
                  $('#G').after(SortList.eq(i));
                  break;
              case "H":
                  $('#H').after(SortList.eq(i));
                  break;
              case "I":
                  $('#I').after(SortList.eq(i));
                  break;
              case "J":
                  $('#J').after(SortList.eq(i));
                  break;
              case "K":
                  $('#K').after(SortList.eq(i));
                  break;
              case "L":
                  $('#L').after(SortList.eq(i));
                  break;
              case "M":
                  $('#M').after(SortList.eq(i));
                  break;
              case "N":
                  $('#N').after(SortList.eq(i));
              case "O":
                  $('#O').after(SortList.eq(i));
                  break;
              case "P":
                  $('#P').after(SortList.eq(i));
                  break;
              case "Q":
                  $('#Q').after(SortList.eq(i));
                  break;
              case "R":
                  $('#R').after(SortList.eq(i));
                  break;
              case "S":
                  $('#S').after(SortList.eq(i));
                  break;
              case "T":
                  $('#T').after(SortList.eq(i));
                  break;
              case "U":
                  $('#U').after(SortList.eq(i));
                  break;
              case "V":
                  $('#V').after(SortList.eq(i));
                  break;
              case "W":
                  $('#W').after(SortList.eq(i));
                  break;
              case "X":
                  $('#X').after(SortList.eq(i));
                  break;
              case "Y":
                  $('#Y').after(SortList.eq(i));
                  break;
              case "Z":
                  $('#Z').after(SortList.eq(i));
                  break;
              default:
                  $('#default').after(SortList.eq(i));
                  break;
          }
      };
  };

});