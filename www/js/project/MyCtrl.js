angular.module('ssapp.controllers')

//工程信息
.controller('MyCtrl',function($scope, $state, $stateParams, ProjectService, gaodeMapService, localStorageService){
  $scope.viewMyProject = function () {
    $state.go("my.gcxx", {projectId: 0, city: "null"});
  };
})

//工程信息
.controller('GcxxCtrl',function($scope, $state, $timeout, $stateParams, ProjectService, gaodeMapService, localStorageService, commonService){
  commonService.showLoading();
  $(".gcxx_title").hide();
  //$scope.$on($state.current.name + "-init", function() {
   /* $(".gcxx_title_left").click(function(){
      $(this).addClass("change");
      $(this).siblings().removeClass("change");  
      $("#search").show();
      $("#map").show();
      $(".djl-width").hide();
    });
    $(".gcxx_title_right").click(function(){
      $(this).addClass("change");
      $(this).siblings().removeClass("change"); 
      $("#search").hide();
      $("#map").hide();
      $(".djl-width").show();
    });*/

    (function(){
      $('.rwgl-title .rwgl-title-left').click(function(){
        $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
        // $('.rwgl-recive').show().siblings().hide();
        $("#search").show();
        $("#map").show();
        $(".djl-width").hide();
      });
      $('.rwgl-title .rwgl-title-right').click(function(){
        $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
        // $('.rwgl-send').show().siblings().hide();
        $("#search").hide();
        $("#map").hide();
        $(".djl-width").show();
      });
    })($);

    var userId = localStorageService.get("User").userId;
    $scope.search = function(){
      $state.go("gcxx-search");
    };

    $scope.close = function(){
      $("#container").css("height", "100%");
      $("#progress").hide();
    };
    var currentLnglatXY = localStorageService.get(currentLnglatXY);
    var projectId = $stateParams.projectId;
    var city = $stateParams.city;
    $scope.projectName = "";
    $scope.projectId = 0;

    var getProjectbyId = function (projectId) {
      ProjectService.getProjectById(projectId).then(function (data) {
        $scope.projectName = data.projectName;
        //显示项目对应的坐标点
        showProjectPoint(data.address, data);
        //显示map下属性框
        $scope.projectId = data.id;
        commonService.hideLoading();
        showProgress($scope.projectName, data.address, true);
      });
    }
    //若projectId不为null，则取对应的项目，展示项目地址
    if(projectId != null && projectId != 0) {

      getProjectbyId(projectId);
    }

    var map;
    if(currentLnglatXY != null) {
      map = new AMap.Map('container', {
          resizeEnable: true,
          center: currentLnglatXY,
          zoom: 15
      });
    } else {
      map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 15
      });
    }
    
    gaodeMapService.addToolBar(map);

    //用于计算两地距离的部分
    var gps = commonService.getGPSUtil();
    $scope.projects = [];

    //展示周围的项目
    $scope.showAroundPro = function () {
      $scope.close();
      console.log("showAroundPro---address=" + $scope.arroundAddr);
      var searchDTO = {
        "salesmanIds": [userId],
        "addresses": [$scope.arroundAddr]
      };
      ProjectService.getProjectsByDTO(searchDTO).then(function (data) {
        $scope.projects = [];
        if(data.length != 0) {
          $.each(data, function (index, item) {
            //显示项目对应的坐标点
            showProjectPoint(item.address, item);
          });
        } else {
          gaodeMapService.getLocation(city, cityCallBack, city);
        }
        commonService.hideLoading();
        $(".gcxx_title").show();
      });
    };

    if(city != "null") {
      $scope.city = city;
      $scope.arroundAddr = city;
      //$scope.showAroundPro();
    }
    
    var num = 0;
    var cityNum = 0;
    var cityCallBack = function (result, city) {
      map.setCenter([result.geocodes[0].location.lng, result.geocodes[0].location.lat]);
    }
    //定位完成回调
    var complete_CallBack = function(data) {
        var lnglatXY = [];
        lnglatXY.push(data.position.getLng());
        lnglatXY.push(data.position.getLat());
        var addresscomponent = data.addressComponent;
        if(typeof($scope.city) === "undefined") {
          $scope.city = addresscomponent.city != "" ? addresscomponent.city: addresscomponent.province;
          localStorageService.set("currentCity", $scope.city);
          if(projectId === "0") {
            $scope.arroundAddr = $scope.city;
            $scope.showAroundPro();
          }
        }
        $scope.$apply();
        var currentAddress = addresscomponent.province + addresscomponent.city + addresscomponent.district + 
                              addresscomponent.township + addresscomponent.street + addresscomponent.streetNumber;
        localStorageService.set("currentAddress", currentAddress);
        localStorageService.set("currentLnglatXY", lnglatXY);
        //getProjectbyId(projectId);
        if(typeof($scope.targetLnglatXY) != "undefined" && num === 0) {
          map.setCenter($scope.targetLnglatXY);
          num ++;
        }
        //若城市不为空，且是第一次展示(非点击定位按钮定位)，则转到该城市地图；否则转到当前定位位置。
        if(city != "null" && cityNum === 0 && projectId === "0") {
          $scope.showAroundPro();
          cityNum ++;
        } else if(projectId === "0") {
          map.setCenter(lnglatXY);
          commonService.hideLoading();
        }
    }

    var clickMarker = false;
    //点击Map回调
    var clickCallBack = function (result) {
      if(clickMarker) {
        clickMarker = false;
        return;
      }
      var addresscomponent = result.regeocode.addressComponent;
      var formattedAddress = addresscomponent.province + addresscomponent.city + addresscomponent.district + 
                              addresscomponent.township + addresscomponent.street + addresscomponent.streetNumber;
      //定义周围地址，用于查询周围项目用
      if(addresscomponent.province === addresscomponent.city) $scope.arroundAddr = addresscomponent.province;
      else $scope.arroundAddr = addresscomponent.province + addresscomponent.city;
      $scope.targetLnglatXY = [result.location.lng,result.location.lat];
      showProgress("选中位置", formattedAddress, false);
    }
    
    /*if(projectId != null && projectId != 0) {
      gaodeMapService.initMap(map, false, clickCallBack, complete_CallBack);
    } else {
      gaodeMapService.initMap(map, true, clickCallBack, complete_CallBack);
    }*/
    gaodeMapService.initMap(map, false, clickCallBack, complete_CallBack);
    //用于项目标记
    //var projectMarker;
    //项目位置展示的回调
    var getLocatCallBack = function (result, project) {
        //用于计算展示距离
        var position = result.geocodes[0].location;
        var currentLnglatXY = localStorageService.get("currentLnglatXY");
        var distance = gps.distance(currentLnglatXY[0], currentLnglatXY[1], position.lng, position.lat);
        if(distance > 1000) {
          project.proDistance = (distance/1000).toFixed(1) + "km";
          $scope.projects.push(project);
        } else {
          project.proDistance = distance.toFixed(1) + "m";
          $scope.projects.push(project);
        }
        $scope.$apply();

        var content = "<div class=\"map_tan\">" +
                  "<div class=\"map_tan_top\">" +
                      "<div class=\"map_tan_top_left\"><img src=\"img/xiangmu_map.png\"></div>" +
                      "<div class=\"padding map_tan_top_right\">" +
                          "<p>" + project.projectName + "</p>" +
                          "<p>" + project.address + "</p>" +
                          "<i class=\"ion-ios-arrow-right\"></i>" +
                      "</div>" +
                  "</div>" +
                  "<div class=\"map_tan_san\"><img src=\"img/map_sanjiao.png\"></div>" +
                  "<div class=\"map_tan_bottom\"><img src=\"img/shuijingqiu.png\"></div>" +
              "</div>";

        var projectMarker = new AMap.Marker({
                      map:map,
                      bubble:true,
                      offset: new AMap.Pixel(-100,-100),
                      content: content
                      /*icon: new AMap.Icon({
                              size: new AMap.Size(20, 20),  //图标大小
                              image: "img/projectPoint.png"
                          })*/
                  });
        //var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(10, -30)});
        projectMarker.setPosition(result.geocodes[0].location);
        $scope.targetLnglatXY = [projectMarker.getPosition().lng, projectMarker.getPosition().lat];
        projectMarker.projectId = project.id;
        projectMarker.projectName = project.projectName;
        projectMarker.address = result.geocodes[0].formattedAddress;
        //projectMarker.infoWindow = infoWindow;
        projectMarker.showIndex = 0;
        var addresscomponent = result.geocodes[0].addressComponent;
        //console.log(angular.toJson(addressComponent.province + ));
        if(addresscomponent.province === addresscomponent.city) $scope.arroundAddr = addresscomponent.province;
        else $scope.arroundAddr = addresscomponent.province + addresscomponent.city;
        map.setCenter(projectMarker.getPosition());
        projectMarker.on('click', markerClick);
        projectMarker.emit('click', {target: projectMarker});
    }
    //项目标记的点击事件
    var markerClick = function(e) {
        if(e.target.showIndex != 0) {
          clickMarker = true;
        }
        e.target.showIndex++;
        $scope.projectId = e.target.projectId;
        //$scope.projectName = e.target.project;
        $scope.targetLnglatXY = [e.target.getPosition().lng, e.target.getPosition().lat];

        //显示infoWindow
        //构建信息窗体中显示的内容
        var info = "<div style=\"padding:0px 0px 0px 4px;\"><b>" + e.target.projectName + "</b><br/>" +
                  "地址 : " + e.target.address + "<br/>" +
                  "<a href=\"#/gcxx-xmxq/" + e.target.projectId + "\" >查看详情</a></div>";
        //e.target.infoWindow.setContent(info);
        //e.target.infoWindow.open(map, e.target.getPosition());
        //showProgress(e.target.projectName, e.target.address, true);
        if(e.target.finishInit) $scope.showProjectDetail();
        e.target.finishInit = true;
        e.preventDefault();
    };
    //对map下的框的内容进行控制
    var showProgress = function (projectName, address, isShowProject) {
      $scope.close();
      $scope.showProject = isShowProject;
      $scope.projectName = projectName;
      $scope.address = address;
      //$scope.proAddress = result.regeocode.formattedAddress;
      var remove = $("#container").css("height");
      var current = parseInt(remove) - 100;
      var last = current + "px";
      $("#container").css("height", last);
      $("#progress").show();
      $scope.$apply();
    }

    //根据地址信息获取项目位置
    var showProjectPoint = function (address, project) {
      gaodeMapService.getLocation(address, getLocatCallBack, project);
    }

    //跳转至展示项目详情页面
    $scope.showProjectDetail = function () {
      $state.go("gcxx-xmxq", {projectId: $scope.projectId});
    };

    $scope.showProjectDetailById = function (id) {
      $state.go("gcxx-xmxq", {projectId: id});
    };

    //跳转至导航页面
    $scope.showRouteNav = function () {
      //var fromAddress = localStorageService.get("currentAddress");
      var fromPoint = localStorageService.get("currentLnglatXY");
      if(fromPoint == null) {
        alert("定位未完成，请稍后。。。");
      }
      var endAddress = $scope.address;
      var endPoint = $scope.targetLnglatXY;
      $state.go("gcxx-lxdh", {fromPoint: fromPoint, endPoint: endPoint, endAddress: endAddress});
    };
  //});
})

//项目搜索结果列表展示
.controller('viewProjectsCtrl',function($scope, $state, $ionicHistory, localStorageService, searchDTOService, gaodeMapService, PContactService, commonService, ProjectService){
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };

    $scope.close = function(){
        $('.rwgl-bg').hide();
        $('.rwgl-tan').hide();
    };

    $scope.checkClass = function (index) {
      return (index+1)%4;
    };
    
    var searchDTO = searchDTOService.getProjectSearchDTO().get();

    //根据搜索条件，执行搜索
    ProjectService.getProjectsByDTO(searchDTO).then(function (data) {
      $scope.projects = data;
      commonService.hideLoading();
    });

    var map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 15
      });
    gaodeMapService.addToolBar(map);

    var map;
    $scope.showLocation = function (address) {
      map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 15
      });
      gaodeMapService.addToolBar(map);
      console.log(address);
      $('.rwgl-bg').show();
      $('.rwgl-tan').show();
      //gaodeMapService.getLocation(address, callBack, address);
      gaodeMapService.showLocationInMap(map, address);
    };

    //根据点击的联系人所对应的项目，查看该项目详情
    $scope.viewProjectDetail = function (projectId) {
      $state.go("gcxx-xmxq", {projectId: projectId});
    };
  });
})

//项目联系人搜索结果列表展示
.controller('viewPcontactsCtrl',function($scope, $state, $rootScope, $ionicHistory, commonService, gaodeMapService, localStorageService, searchDTOService, PContactService, commonService, ProjectService){
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };
    $scope.close = function(){
        $('.rwgl-bg').hide();
        $('.rwgl-tan').hide();
    };
    $scope.checkClass = function (index) {
      return (index+1)%4;
    };

    var searchDTO = searchDTOService.getPcontactSearchDTO().get();

    //根据搜索条件，执行搜索
    PContactService.getPContactsByDTO(searchDTO).then(function (data) {
      $scope.pcontacts = data;
      commonService.hideLoading();
    });

    //根据点击的联系人所对应的项目，查看该项目详情
    $scope.viewProjectDetail = function (projectId) {
      $state.go("gcxx-xmxq", {projectId: projectId});
    };

    var map;
    $scope.showLocation = function (address) {
      map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 15
      });
      gaodeMapService.addToolBar(map);
      console.log(address);
      $('.rwgl-bg').show();
      $('.rwgl-tan').show();
      //gaodeMapService.getLocation(address, callBack, address);
      gaodeMapService.showLocationInMap(map, address);
    };

    $scope.phoneTo = function (phone) {
      commonService.phoneTo(phone);
    };
  });
})

//工程信息-地区查询
.controller('GcxxAreaCtrl',function($scope, $state, UserService, $timeout, $ionicHistory, $compile, commonService, localStorageService, alertService){
  var windowHeight=$('ion-view').height();
  $scope.back = function(){
    $ionicHistory.goBack();
  };
  $scope.currentCity = localStorageService.get("currentCity");
  var provinces = provs_data;
  var citys = citys_data;
  var cityArray = [];
  $.each(provinces, function (index, item) {
    if(item.text.indexOf("市") != -1) {
      cityArray.push(item.text);
    } else {
      var pro_city = citys[item.value];
      $.each(pro_city, function (cityIndex, cityItem) {
        cityArray.push(cityItem.text);
      });
    }
  });
  var appendHtml = function (array) {
    var html = "";
    for(var i=0; i<array.length; i++) {
      html = html + "<div class=\"sort_list sort_list_right\" ng-click=\"selectCity('" + array[i] + "')\">" +
          "<div class=\"num_name\">" + array[i] + "</div>" +
        "</div>";
    }
    var mobileDialogElement = $compile(html)($scope);
    $('#sort_box').append(mobileDialogElement);
  }
  appendHtml(cityArray);

  //定位完成回调
  var complete_CallBack = function(data) {
    var addresscomponent = data.addressComponent;
    $scope.currentCity = addresscomponent.city != "" ? addresscomponent.city: addresscomponent.province;
    var currentAddress = addresscomponent.province + addresscomponent.city + addresscomponent.district + 
                            addresscomponent.township + addresscomponent.street + addresscomponent.streetNumber;
    localStorageService.set("currentAddress", currentAddress);
    localStorageService.set("currentCity", $scope.currentCity);
    alertService.showAlert($scope, "当前地址：" + currentAddress + "。", true, "success", null);
    $scope.$apply();
  }

  $scope.refreshGPS = function () {
    AMap.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({});
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', complete_CallBack);//返回定位信息
    });
  }

  $scope.selectCity = function (city) {
    $scope.selectCityArray = localStorageService.get("selectCityArray");
    if($scope.selectCityArray === null) {
      $scope.selectCityArray = [];
      $scope.selectCityArray.unshift(city);
    } else if(!commonService.contains(city, $scope.selectCityArray)) {
      $scope.selectCityArray.unshift(city);
      if($scope.selectCityArray.length > 4){
        $scope.selectCityArray.pop();
      }
    } else {
      var index = $scope.selectCityArray.indexOf(city);
      $scope.selectCityArray.splice(index, 1);
      $scope.selectCityArray.unshift(city);
    }
    
    localStorageService.set("selectCityArray", $scope.selectCityArray);
    console.log($scope.selectCityArray);
    $state.go("my.gcxx", {projectId: 0, city: city});
  };
  var characterReg = /[A-Za-z]{1}/;
  $scope.selectCityArray = localStorageService.get("selectCityArray");

  $("#cityKeyWords").on("change", function() {
    var keyWords = $("#cityKeyWords").val();
    if(characterReg.test(keyWords)) {
      var letter = keyWords.toUpperCase();
      if($('#'+letter).length>0){
          var LetterTop = document.getElementById(letter).offsetTop;
          $('ion-content').animate({scrollTop: LetterTop+'px'}, 100);
      }
    } else {
      $('#sort_box').html("");
      var array = [];
      for(var i=0; i<cityArray.length; i++) {
        if(cityArray[i].indexOf(keyWords) != -1) {
          array.push(cityArray[i]);
        }
      }
      appendHtml(array);
      init();
    }
  });

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
  }

  function initials() {//公众号排庿
      var SortList=$(".sort_list");
      var SortBox=$(".sort_box");
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
  }

  init();
})

//路线导航
.controller('showRouteNavCtrl',function($scope, $state, $stateParams, $ionicHistory, ProjectService, gaodeMapService, localStorageService){
  $scope.back = function(){
    $ionicHistory.goBack();
  };
  var fromPoint = $stateParams.fromPoint;
  var endPoint = $stateParams.endPoint;
  var fromCity,endCity;
  var type = $stateParams.type;
  /*var fromPoint = [];
  fromPoint.push(parseFloat(fromPoint_t.spilt(",")[0]));
  fromPoint.push(parseFloat(fromPoint_t.spilt(",")[1]));
  var endPoint = [];
  endPoint.push(parseFloat(endPoint_t.spilt(",")[0]));
  endPoint.push(parseFloat(endPoint_t.spilt(",")[1]));
  console.log(fromPoint + "--" + endPoint + "---" + type);*/
  var map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 15
  });
  gaodeMapService.addToolBar(map);
  var num = 0;

  var initRoute = function () {
    if(type === "1") {
      gaodeMapService.transfer(map, fromCity, endCity, fromPoint.split(","), endPoint.split(","), callBack);
    } else if(type === "2") {
      gaodeMapService.walk(map, fromCity, endCity, fromPoint.split(","), endPoint.split(","), callBack);
    } else if(type === "3") {
      gaodeMapService.drive(map, fromCity, endCity, fromPoint.split(","), endPoint.split(","), callBack);
    }
  }

  var getAddress = function (result, obj) {
    var province = result.regeocode.addressComponent.province;
    var city = result.regeocode.addressComponent.city;
    if(obj === "fromPoint") {
      if(city === "") fromCity = province; 
      else fromCity = city;
    } else if(obj === "endPoint") {
      if(city === "") endCity = province; 
      else endCity = city;
    }
    num ++;
    if(num === 2) {
      //console.log(fromCity + endCity);
      initRoute();
    }
  }

  gaodeMapService.getAddress(fromPoint.split(","), getAddress, "fromPoint");
  gaodeMapService.getAddress(endPoint.split(","), getAddress, "endPoint");

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
                });
  var callBack = function (result) {
    //console.log(angular.toJson(result));
  }
})

//搜索项目
.controller('searchProjectCtrl',function($scope, $state, $rootScope, localStorageService, searchDTOService, PContactService, ProjectService){
  var userId = localStorageService.get("User").userId;
  dropDown('projectStage', '<span class="show-icon">请选择项目阶段</span>', '请选择项目阶段');
  dropDown('type', '<span class="show-icon">请选择项目类别</span>', '请选择项目类别');
  $scope.searchDTO = {
    "salesmanIds": [userId]
    /*"projectName":,
    "areas": [],
    "addresses": [],
    "creatorIds": [],
    "projectStage": ,
    "fromdate": ,
    "enddate": ,
    "type":*/
  };

  $scope.reset = function () {
    $scope.searchDTO = {"salesmanIds": [userId]};
    $scope.projectAddress = "";
    $("#projectStage_dummy").val("");
    $("#projectStage").val("");
    $("#type_dummy").val("");
    $("#type").val("");
  }

  //执行搜索，跳转至项目查询结果页面
  $scope.searchByDTO = function () {
    $scope.searchDTO.projectStage = $("#projectStage_dummy").val();
    $scope.searchDTO.type = $("#type_dummy").val();
    searchDTOService.getProjectSearchDTO().set($scope.searchDTO);
    $state.go("my.gjss-xmlb");
  };

  $scope.selectAddress = function (type) {
    $state.go("my.gjss-place", {type: type});
  };

  //监听话题添加的广播事件
  $rootScope.$on('getProjectAddrInPro', function(event, addresses){
    console.log("getProjectAddrInPro--" + angular.toJson(addresses));
    //根据接收到的地址信息，填充input
    $scope.projectAddress = addresses;
    $scope.searchDTO.addresses = addresses;
    if(addresses.length === 0) $scope.searchDTO.addresses.push("");
  });

})

//搜索项目联系人
.controller('searchPcontactCtrl',function($scope, $state, $rootScope, localStorageService, searchDTOService, PContactService, ProjectService){
  var userId = localStorageService.get("User").userId;
  dropDown('functionType', '<span class="show-icon">请选择联系人职能</span>', '请选择联系人职能');
  $scope.searchDTO = {
    //"projectIds": [],
    "salesmanIds": [userId]
    /*"creatorIds": [],
    "functionType": ,
    "companyName": ,
    "resName": ,
    "phone": ,
    "addresses": [],
    "projectAddresses": [],
    "projectName": */
  };

  $scope.reset = function () {
    $scope.searchDTO = {"salesmanIds": [userId]};
    $scope.projectAddress = "";
    $scope.pcontactAddress = "";
    $("#functionType_dummy").val("");
    $("#functionType").val("");
  }

  //执行搜索，跳转至项目联系人查询结果页面
  $scope.searchByDTO = function () {
    $scope.searchDTO.functionType = $("#functionType_dummy").val();
    searchDTOService.getPcontactSearchDTO().set($scope.searchDTO);
    $state.go("my.gslxr-lxrlb");
  };

  $scope.selectAddress = function (type) {
    $state.go("my.gslxr-place", {type: type});
  };

  //监听话题添加的广播事件
  $rootScope.$on('getPContactAddress', function(event, addresses){
    console.log("getPContactAddress--" + angular.toJson(addresses));
    //根据接收到的地址信息，填充input
    $scope.pcontactAddress = addresses;
    $scope.searchDTO.addresses = addresses;
    if(addresses.length === 0) $scope.searchDTO.addresses.push("");
  });
  $rootScope.$on('getProjectAddrInPcon', function(event, addresses){
    console.log("getProjectAddrInPcon--" + angular.toJson(addresses));
    //根据接收到的地址信息，填充input
    $scope.projectAddress = addresses;
    $scope.searchDTO.projectAddresses = addresses;
    if(addresses.length === 0) $scope.searchDTO.projectAddresses.push("");
  });
})

//路线导航--选择
.controller('routeNavCtrl',function($scope, $state, $stateParams, $ionicHistory, ProjectService, gaodeMapService, localStorageService){
  $scope.back = function(){
    $ionicHistory.goBack();
  };

  dropDown('type', '<span class="show-icon">请选择出行方式</span>', '请选择出行方式');
  $scope.fromPoint = $stateParams.fromPoint;
  $scope.endPoint = $stateParams.endPoint;
  $scope.endAddress = $stateParams.endAddress;
  //console.log($scope.fromAddress + "--" + $scope.endAddress);

  $scope.beginRouteNav = function () {
    //type---1:transfer;2:walk;3:drive;
    if($("#type_dummy").val() === "公共交通") {
      $state.go("gcxx-lxdh-ck", {fromPoint: $scope.fromPoint, endPoint: $scope.endPoint, type: 1});
    } else if($("#type_dummy").val() === "步行") {
      $state.go("gcxx-lxdh-ck", {fromPoint: $scope.fromPoint, endPoint: $scope.endPoint, type: 2});
    } else if($("#type_dummy").val() === "驾车") {
      $state.go("gcxx-lxdh-ck", {fromPoint: $scope.fromPoint, endPoint: $scope.endPoint, type: 3});
    }
    //$state.go("gcxx-lxdh-ck", {fromPoint: $scope.fromPoint, endPoint: $scope.endPoint, type: 1});
  }
})

//项目详情
.controller('projectDetailCtrl',function($scope, $state, $stateParams, $ionicHistory, localStorageService, PContactService, commonService, ProjectService, gaodeMapService, _){
  //commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };

    $scope.close = function(){
        $('.rwgl-bg').hide();
        $('.rwgl-tan').hide();
    };
    var userId = localStorageService.get("User").userId;
    var projectId = $stateParams.projectId;
    if(projectId != null && projectId != 0) {
      ProjectService.getProjectById(projectId).then(function (data) {
        $scope.project = data;
      });
      PContactService.getPcontactsByProId(projectId).then(function (data) {

        var result = _.groupBy(data, function(contract){ return contract.functionType; });
        $scope.pcontacts = result;
        //commonService.hideLoading();
        $scope.$apply();
        $("#open0").css("margin-top","1px!important");
      });
    }

    $scope.phoneTo = function (phoneNum) {
      if (device.platform != "Android") {
        phonedialer.dial(
          phoneNum,
          function(err) {
            if (err == "empty") alert("Unknown phone number");
            //else alert("Dialer Error:" + err);
          },
          function(success) {
            //alert('Dialing succeeded');
          }
        );
      } else {
        window.location.href = "tel:" + phoneNum;
      }
    }

    $scope.open = function(id){
      $("#expand" + id).toggle(500);
      if($("#open" + id + " i").hasClass("ion-ios-arrow-up")) {
        $("#open" + id + " i").removeClass('ion-ios-arrow-up');
        $("#open" + id + " i").addClass('ion-ios-arrow-down positive');
      } else {
        $("#open" + id + " i").removeClass('ion-ios-arrow-down positive');
        $("#open" + id + " i").addClass('ion-ios-arrow-up');
      }
    };

    var map;

    $scope.showLocation = function (address) {
      map = new AMap.Map('container1', {
          resizeEnable: true,
          zoom: 15
      });
      gaodeMapService.addToolBar(map);
      console.log(address);
      $('.rwgl-bg').show();
      $('.rwgl-tan').show();
      gaodeMapService.showLocationInMap(map, address);
    };
  //});
})

//公司/联系人-所在地
.controller('GslxrPlaceCtrl',function($scope, $rootScope, $timeout, $ionicHistory, $compile, $stateParams){
  var type = $stateParams.type;
  if(type === "1") $scope.title = "联系人所在地";
  else $scope.title = "项目所在地";
  $scope.back = function(){
    $ionicHistory.goBack();
  };
  $scope.checkClass = function (index) {
    if(index === 0) return true;
    else return false; 
  };
  var initCSS = function () {
    var PlaceTab = $(".my_gslxr_place").children("div");
    var PlaceIn = $("#right").children("div");
    for(var i = 0;i < PlaceTab.length;i++){
      PlaceTab[i].index = i;
      PlaceTab[i].onclick = function(){
      PlaceTab.removeClass("activeF");
      $(this).addClass("activeF");
      }
    }
    var First = $(".my_gslxr_place").children(".my_gslxr_place_left").eq(0);
    First.css("margin-top","-1px");
    $("#left .my_gslxr_place_input").click(function () {
      var index = $(".my_gslxr_place_input").index(this);
      var rightObj = $("#right .my_gslxr_right").eq(index).children(".my_gslxr_place_right").children(".my_gslxr_place_right_input");
      if($(this).hasClass("active")) {
        $(this).parent().removeClass("active");
        $(this).removeClass("active");
        rightObj.removeClass("active");
      } else {
        $(this).parent().addClass("active");
        $(this).addClass("active");
        rightObj.addClass("active");
      }
    });
    $("#left .my_gslxr_place_left").click(function () {
      var index = $(".my_gslxr_place_left").index(this);
      $("#right .my_gslxr_right").hide();
      $("#right .my_gslxr_right").eq(index).show();
    });
    $(".my_gslxr_place_right_input").click(function () {
      if($(this).hasClass("active")) {
        $(this).removeClass("active");
      } else {
        $(this).addClass("active");
      }
      var rightFatherObj = $(this).parent().parent();
      var index = $(".my_gslxr_right").index(rightFatherObj);
      var allRemoveClass = true;
      var allAddClass = true;
      var rightObj = rightFatherObj.find(".my_gslxr_place_right_input");
      for(var i=0; i<rightObj.length; i++) {
        if(rightObj.eq(i).hasClass("active")) {
          allRemoveClass = false;
          break;
        }
      }
      for(var i=0; i<rightObj.length; i++) {
        if(!rightObj.eq(i).hasClass("active")) {
          allAddClass = false;
          break;
        }
      }

      if(allRemoveClass) {
        $("#left .my_gslxr_place_left").eq(index).removeClass("active");
        $("#left .my_gslxr_place_left").eq(index).children(".my_gslxr_place_input").removeClass("active");
      }
      if(allAddClass) {
        $("#left .my_gslxr_place_left").eq(index).addClass("active");
        $("#left .my_gslxr_place_left").eq(index).children(".my_gslxr_place_input").addClass("active");
      }
    });
  }

  //以上是样式部分，以下为逻辑部分
  $scope.provinces = provs_data;
  var citys = citys_data;
  var proCityArray = [];
  $.each($scope.provinces, function (index, item) {
    var pro_city = citys[item.value];
    proCityArray.push(pro_city);
  });

  var appendHtml = function (array) {
    var html = "";
    $.each(array, function (proIndex, proItem) {
      html = html + "<div class=\"my_gslxr_right\" >";
      $.each(proItem, function (cityIndex, cityItem) {
        html = html + "<div class=\"my_gslxr_place_right\">" +
                        "<div class=\"my_gslxr_place_right_in\">" + cityItem.text + "</div>" +
                        "<div class=\"my_gslxr_place_right_input\">" +
                          "<i class=\"ion-checkmark-round\"></i>" +
                        "</div>" +
                      "</div>";
      });
      html = html + "</div>";
    });
    var mobileDialogElement = $compile(html)($scope);
    $('#right').append(mobileDialogElement);
  }
  appendHtml(proCityArray);

  $(".my_gslxr_right").hide();
  $(".my_gslxr_right").eq(0).show();

  $timeout(initCSS, 50);

  var getProvince = function (obj) {
    var rightFatherObj = obj.parent().parent();
    var index = $(".my_gslxr_right").index(rightFatherObj);
    return $(".my_gslxr_place_left_in").eq(index).text();
  }

  $scope.submit = function(){
    var cityArray = [];
    var rightObj = $(".my_gslxr_place_right_input.active");
    for(var i=0; i<rightObj.length; i++) {
      var province = getProvince(rightObj.eq(i));
      var cityAddress = province + rightObj.eq(i).prev().text();
      cityArray.push(cityAddress);
    }
    //平级广播，通知话题展示页面添加新的话题
    if(type === "1") $rootScope.$broadcast('getPContactAddress', cityArray);
    else if(type === "2") $rootScope.$broadcast('getProjectAddrInPcon', cityArray);
    else if(type === "3") $rootScope.$broadcast('getProjectAddrInPro', cityArray);
    $scope.back();
  };
})

//联系人-选择职能
.controller('GslxrFunctionCtrl',function($scope, $state){
  var PlaceTab = $("#place").children("label");
  var PlaceIn = $("#PlaceIn").children("div");
  var RightChild = $(".my_gslxr_place_right").children("label");
  for(var i = 0;i < PlaceTab.length;i++){
    PlaceTab[i].index = i;
    PlaceTab[i].onclick = function(){
      PlaceTab.removeClass("active");
      $(this).addClass("active");
      PlaceIn.css("display","none");
      PlaceIn.eq(this.index).css("display","block");
    }
  }
  for(var j = 0;j < RightChild.length;j++){
    RightChild[j].onclick = function(){
      if($(this).hasClass("active")){
        $(this).removeClass("active");
      }else{
        $(this).addClass("active");
      }
    }
  }
})

//个人中心
.controller('grzxMyctrl', function($scope, $state, localStorageService, $ionicHistory, $timeout, $ionicPopup, UserService, ProjectService, PContactService, PFollowService, _, alertService){
  //commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
    $scope.back = function(){
      $ionicHistory.goBack();
    };
    
    dropDown('choosecontact', '<span class="show-icon">请选择联系人</span>', '请选择联系人');
    dropDown('linkWay', '<span class="show-icon">请选择联系方式</span>', '请选择联系方式');
    dropDown('chooseproject', '<span class="show-icon">请选择项目</span>', '请选择项目');
    dropDown('choosecompany', '<span class="show-icon">请选择公司名称</span>', '请选择公司名称');
    datePicker('startDateone');
    $scope.user = localStorageService.get("User");
    $scope.pfollow = {
      "project": {},
      "pcontact": {},
      "salesman": {}
    };
    //获取项目列表
    var getProjects = function () {
      var searchDTO = {
        "salesmanIds": [$scope.user.userId]
      };
      ProjectService.getProjectsByDTO(searchDTO).then(function (data) {
        $scope.projects = data;
        $timeout(function () {
          getCompanyName();
        },50);
      });
    }
    //获取公司名称
    var getCompanyName = function () {
      var projectId = $("#chooseproject").val();
      //填充跟进人员
      $.each($scope.projects, function(index, item) {
        if(parseInt(projectId) === item.id) {
          $scope.currentProject = item;
        }
      });
      PContactService.getPcontactsByProId(projectId).then(function (data) {
        $scope.pcontacts = data;
        $scope.companyArr = _.groupBy($scope.pcontacts, function(item) {
          return item.companyName;
        });
        $timeout(function () {
          var companyName = $("#choosecompany").val();
          $scope.pcontactArr = $scope.companyArr[companyName];
        },50);
      });
    };

    getProjects();

    UserService.getUsersByPri($scope.user.userId, 3).then(function (data) {
      $scope.users = data;
    });

    $scope.companyArr;

    $("#chooseproject").on("change", function () {
      $("#choosecompany_dummy").val("");
      $("#choosecontact_dummy").val("");
      getCompanyName();
    });
    $("#choosecompany").on("change", function () {
      var companyName = $("#choosecompany").val();
      $("#choosecontact_dummy").val("");
      $scope.pcontactArr = $scope.companyArr[companyName];
      $scope.$apply();
    });


    //确认框
    $scope.addPfollow = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: '任务确认',
        template: '亲，您确认现在提交跟进任务么？', //从服务端获取更新的内容
        cancelText: '取消',
        okText: '确定'
      });
      confirmPopup.then(function (res) {
        if (res) {
          if($scope.currentProject === null || typeof($scope.currentProject) === "undefined") {
            alertService.showAlert($scope, "请填写项目名", true, "warning", null);
            return;
          }
          $scope.pfollow.project.id = $scope.currentProject.id;
          $scope.pfollow.pcontact.id = $("#choosecontact").val();
          $scope.pfollow.salesman.userId = $scope.currentProject.salesman.userId;
          $scope.pfollow.linkWay = $("#linkWay_dummy").val();
          $scope.pfollow.followDate = $("#startDateone").val();
          //确定okText
          PFollowService.postPfollow($scope.pfollow).then(function (data) {
            if (data.status === 1) {
              alertService.showAlert($scope, "跟进任务提交成功!", true, "success", 'tab.dash');
            } else {
              alertService.showAlert($scope, data.msg, true, "fail", null);
              $("#content").focus();
            }
          });
        } else {
          // 取消cancelText
        }
      });
    };
  //});

})

//工程信息搜索
.controller('GcxxSearchCtrl',function($scope, $state, localStorageService, $ionicHistory, cusService, commonService, ProjectService, gaodeMapService){
  $scope.back = function(){
    $ionicHistory.goBack();
  };
  var userId = localStorageService.get("User").userId;
  var currentLnglatXY = localStorageService.get("currentLnglatXY");
  var gps = commonService.getGPSUtil();
  $scope.proDistances = [];
  var callBack = function (result, index) {
    var position = result.geocodes[0].location;
    var distance = gps.distance(currentLnglatXY[0], currentLnglatXY[1], position.lng, position.lat);
    if(distance > 1000) {
      $scope.proDistances.splice(index,1,(distance/1000).toFixed(1) + "km");
    } else {
      $scope.proDistances.splice(index,1,distance.toFixed(1) + "m");
    }
    $scope.$apply();
  };
  //$scope.projects = [];
  $("#keyWords").on("change", function() {
    $scope.searchByKey();
  });

  $scope.searchByKey = function(){
    var keyWords = $("#keyWords").val();
    ProjectService.getProjectsByKey(userId, keyWords).then(function (data) {
      $scope.projects = data;
      $.each(data, function (index, item) {
        $scope.proDistances.push("");
        gaodeMapService.getLocation(item.address, callBack, index);
      });
    });
    $("#introduce").hide();
    $(".gcxx_search_content").show();
  };

  $scope.showProjectInMap = function (project) {
    $state.go("my.gcxx", {projectId:project.id, city: "null"});
  }

  /*$scope.searchProName = function ($event) {
    alert(1);
    if($event.keyCode===13){
      searchByKey();
    }
  }*/

})

//跟进任务列表
.controller('grzxctrl',function($scope, $state, ProjectService, PFollowService, gaodeMapService, localStorageService){
  $scope.user = localStorageService.get("User");
  PFollowService.getPfollowsByUserPri($scope.user.userId).then(function (data) {
    $scope.pfollows = data;
  });
  $scope.showDetail = function (id) {
    $state.go("my.grzx-find", {id:id});
  }
})

//查看跟进任务
.controller('viewGrzxCtrl',function($scope, $state, $stateParams, ProjectService, PFollowService, gaodeMapService, localStorageService){
  var id = $stateParams.id;
  PFollowService.getPfollowById(id).then(function (data) {
    $scope.pfollow = data;
  });
});