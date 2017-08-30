angular.module('ssapp.directives', [])
    /*.directive('onFinishRender',['$timeout', '$parse', function ($timeout, $parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished'); //事件通知
                            var fun = $scope.$eval(attrs.onFinishRender);
                            if(fun && typeof(fun)=='function'){  
                                fun();  //回调函数
                            }  
                    });
                }
            }
        }
    }])*/
    .directive("appMap", function ($interval, gaodeMapService, commonService, _) {
        return {
            restrict: "E",
            replace: true,
            template: "<div id='container' style='height:250px;'></div>",
            scope: {
                center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
                /*markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
                width: "@",         // Map width in pixels.
                height: "@",        // Map height in pixels.
                zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
                zoomControl: "@",   // Whether to show a zoom control on the map.
                scaleControl: "@",   // Whether to show scale control on the map.
                address: "@",*/
                datas: "=",
                map: "=",
                addresscomponent: "="
            },
            link: function (scope, element, attrs) {
                scope.datas = [];
                
                /*var map = new AMap.Map("container", {
                    resizeEnable: true,
                    zoom: 18
                }); 
                var lnglatXY; //已知点坐标
                 
                element.ready(function() {
                    navigator.geolocation.getCurrentPosition(showPosition);
                    var showPosition = function (position) {
                      var lat = position.coords.latitude; 
                      var lng = position.coords.longitude;
                      alert(lat+"-"+lng);
                      lnglatXY = [lat, lng];
                      regeocoder(); //调用高德地图
                    };
                });

                // 高德地图
                var regeocoder = function() {  //逆地理编码
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });        
                    geocoder.getAddress(lnglatXY, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            geocoder_CallBack(result);
                        }
                    });        
                    var marker = new AMap.Marker({  //加点
                        map: map,
                        position: lnglatXY
                    });
                    map.setFitView();
                };
                var geocoder_CallBack = function (data) {
                    var address = data.regeocode.formattedAddress; //返回地址描述
                    console.log(address);
                    alert(address);
                };
*/
                commonService.showLoading();
                //$("ion-footer-bar").hide();
                var _map, geolocation, marker;
                var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(10, -30)});
                var initMap = function () {
                    scope.datas = [];
                    //加载地图，调用浏览器定位服务
                    _map = new AMap.Map('container', {
                        resizeEnable: true,
                         zoom: 15
                    });

                    scope.map = _map;
                    gaodeMapService.addToolBar(_map);

                    _map.plugin('AMap.Geolocation', function() {
                        geolocation = new AMap.Geolocation({
                            enableHighAccuracy: true,//是否使用高精度定位，默认:true
                            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                            showButton: true,        //显示定位按钮，默认：true
                            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                            buttonOffset: new AMap.Pixel(10, 30),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                            showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                            showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                            panToLocation: true,      //定位成功后将定位到的位置作为地图中心点，默认：true
                            zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                            useNative: true
                        });
                        _map.addControl(geolocation);
                        geolocation.getCurrentPosition();
                        AMap.event.addListener(geolocation, 'complete', complete_CallBack);//返回定位信息
                        AMap.event.addListener(geolocation, 'error', error_CallBack);//返回定位出错信息
                    });
                }
                element.ready(function() {
                    initMap();
                });

                var mapTimeout = $interval(initMap, 180000, false);
                scope.$on('$stateChangeStart',function(){
                   $interval.cancel(mapTimeout);
                });
                
                var lnglatXY;
                var complete_CallBack = function(data) {
                    //$("#test").append("sssssss");
                    var str=['定位成功'];
                    str.push('经度：' + data.position.getLng());
                    str.push('纬度：' + data.position.getLat());
                    str.push('精度：' + data.accuracy + ' 米');
                    str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
                    //document.getElementById('tip').innerHTML = str.join('<br>');
                    console.log("success data：" + angular.toJson(data));
                    lnglatXY = [];
                    lnglatXY.push(data.position.getLng());
                    lnglatXY.push(data.position.getLat());
                    scope.addresscomponent = data.addressComponent;

                    /*var pos = GPS.gcj_encrypt(data.position.getLat(), data.position.getLng());
                    lnglatXY = [pos.lon, pos.lat];*/
                    //lnglatXY = gpsXY;
                    //addMaker(lnglatXY, "This is a test demo.");
                    regeocoder(lnglatXY);
                    //searchNearBy(lnglatXY);
                }

                var error_CallBack = function(data) {
                    scope.datas = [];
                    alert('定位失败');
                    console.log("error data：" + angular.toJson(data));
                }

                //搜索周边企业信息的回调
                var searchCallBack = function (result) {
                    scope.datas = result.poiList.pois;
                    scope.$apply();
                    commonService.hideLoading();
                    $("#signDiv").show();
                    $("#signDiv").css("z-index", "5");
                }

                //根据中心点经纬度坐标搜索附近的企业信息
                var searchNearBy = function (cpoint) {
                    addMaker(cpoint, "我的位置");
                    gaodeMapService.placeSearch(cpoint, '公司企业', searchCallBack);
                }

                //逆地理编码的回调
                var regeocoderCallBack = function (result) {
                    //返回地址描述
                    //var address = result.regeocode.formattedAddress;
                    geocoder_CallBack(result);
                    
                    var poisData = _.sortBy(result.regeocode.pois, function(item){ return item.distance; });
                    //scope.datas = poisData.slice(0, 2);
                    scope.datas = poisData;
                    //result.regeocode.addressComponent
                    scope.$apply();
                    commonService.hideLoading();
                    $("#signDiv").show();
                    $("#signDiv").css("z-index", "5");
                    /*scope.$apply(function() {
                        scope.datas = result.regeocode.pois;
                        console.log("----" + angular.toJson(scope.datas));
                    });*/
                }

                //根据中心点经纬度坐标进行逆地理编码，并显示周围坐标点。
                var regeocoder = function(lnglatXY) {  //逆地理编码
                    //lnglatXY = [116.396574, 39.992706]; //已知点坐标
                    gaodeMapService.regeocoder(_map, lnglatXY, regeocoderCallBack); 
                };

                var geocoder_CallBack = function(data) {
                    var address = data.regeocode.formattedAddress; //返回地址描述
                    addMaker(lnglatXY, address);
                };

                var addMaker = function(lnglatXY, content) {
                    marker = new AMap.Marker({  //加点
                        map: _map,
                        position: lnglatXY,
                        //icon: "http://webapi.amap.com/images/0.png"
                        icon: new AMap.Icon({            
                            size: new AMap.Size(40, 50),  //图标大小
                            image: "img/map.png"
                        })
                    });
                    marker.setMap(_map);  //在地图上添加点
                    //_map.setFitView();
                    marker.content = content;
                    marker.on('click', markerClick);
                    marker.emit('click', {target: marker});
                };

                var markerClick = function(e) {
                    infoWindow.setContent(e.target.content);
                    infoWindow.open(_map, e.target.getPosition());
                };

                scope.$watch(function() {
                    return scope.datas;
                }, function(newValue, oldValue) {
                    console.log("datas: ", scope.datas, oldValue, newValue);
                    if (newValue === oldValue) return;
                    else return newValue;
                });




               /* scope.$watch('datas', function(newValue) {
                    console.log("datas: ", scope.datas, newValue);
                    scope.datas = newValue;
                });*/
            }
        };
    })
    /*.directive("ssAlert", function ($timeout) {
        return {
            restrict: "E",
            replace: true,
            template: "<div class=\"alert alert-danger alert-dismissable\" ng-init=\"show=false\" ng-show=\"show\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">" +
                            "&times;" +
                        "</button>" +
                        "<span ng-bind=\"info\"></span>" +
                    "</div>",
            scope: {
                info: "@forInfo",
                show: "@isShow"
            },
            link: function (scope, element, attrs) {
                $timeout(function(){
                    //element.css("display", "none");
                    scope.show = false;
                    //scope.info = "Hello World";
                }, 2000);
            }
        }
    })*/
    .directive("ssAlert", function ($timeout) {
        return {
            restrict: "E",
            replace: true,
            template: "<div class=\"success-input\"><div id=\"alert\" ng-init='show=false' ng-show='show' ng-class=\"{'success': 'alert alert-success alert-dismissible', 'warning': 'alert alert-warning alert-dismissible', 'fail': 'alert alert-danger alert-dismissable'}[type]\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">" +
                            "&times;" +
                        "</button>" +
                        "<span ng-bind=\"info\"></span>" +
                    "</div></div>",
            scope: {
                info: "@forInfo",
                show: "@forShow",
                type: "@forType" 
            },
            link: function (scope, element, attrs) {
                
            }
        };
    })
    .directive("autoForm", function ($timeout, FormService) {
        return {
            restrict: "AE",
            templateUrl: "templates/ProcessManagement/formtable.html",
            scope: {
                formObjs: "=",
                fillDatas: "=",
                curProcess: "="
            },
            link: function (scope, element, attrs) {
                scope.$watch("formObjs", function() {
                    //执行对各种type进行插件调用。
                    setTimeout(function() {
                        $.each(scope.formObjs, function(index, item) {
                            if(item.type === "datetime" || item.type === "date") {
                                datePicker(item.elementId);
                            }
                            if(item.element === "select") {
                                dropDown(item.elementId, '<span class="show-icon">请选择' + item.label + '</span>', '请选择' + item.label + '');
                            }

                            /*$("input[type='radio']").iCheck({
                                radioClass: 'iradio_square-green',
                                increaseArea: '20%'
                            });
                            $("input[type='radio']").click(function() {
                                alert(1);
                            });*/
                        });
                        FormService.initFormByProcess(scope.curProcess, scope.formObjs);
                        if(scope.fillDatas != null && scope.fillDatas != "") FormService.fillForm($("#formDiv"), scope.fillDatas);
                    });
                });
            }
        };
    })
    .directive("ssPagination", function($rootScope, wftoService, vofService, chkpService, pwoService, vdftService, vwfcService, vprService, vpeService, vsrService, widService) {
        return {
            restrict: "E",
            replace: true,
            template: "<div class=\"djl-width-in\">" + 
                        "<ul class=\"pagination\">" + 
                            "<li><a ng-click=\"topPage()\">首页</a></li>" + 
                            "<li><a ng-click=\"prevPage()\">前一页</a></li>" + 
                            "<li><a ng-click=\"nextPage()\">后一页</a></li>" + 
                            "<li><a ng-click=\"bottomPage()\">尾页</a></li>" + 
                            "<li><input type=\"hidden\" ng-model=\"name\"></li>" + 
                        "</ul>" + 
                    "</div>",
            scope: {
                /*topPage: "&",
                prevPage: "&",
                nextPage: "&",
                bottomPage: "&"*/
                name: "="

            },
            controller: function($scope, $element) {
                //分页代码
                $rootScope.dataNum = 0;  //获得数据总个数
                $rootScope.pageNum = [];                                //生成页码，在 html里 ng-repeat 出来
                for(var i=0;i<$rootScope.pages;i++){
                    $rootScope.pageNum.push(i);
                }
                $rootScope.currentPage = 1;                       //设置当前页是 0
                $rootScope.listsPerPage = 10;                      //设置每页显示个数
                $scope.topPage = function(){
                    $rootScope.currentPage = 1;
                };
                $scope.prevPage = function(){               //点击上一页执行的函数
                    if($rootScope.currentPage > 1){
                        $rootScope.currentPage--;
                    }
                };
                $scope.nextPage = function(){              //点击下一页执行的函数
                    if ($rootScope.currentPage < $rootScope.pages){
                        $rootScope.currentPage++;
                    }
                };
                $scope.bottomPage = function(){
                    $rootScope.currentPage = $rootScope.pages;
                };
                $rootScope.pageMgr = function(index){
                    if(index >= ($rootScope.currentPage-1)*$rootScope.listsPerPage && index < $rootScope.currentPage*$rootScope.listsPerPage) {
                    return true;
                    }
                    return false;
                };
                if($scope.name == "wftoService") {
                    wftoService.getWftos().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.wftos = data;
                    });
                } else if($scope.name == "vofService") {
                    vofService.getVofs().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.onePieceFlows = data;
                    });
                } else if($scope.name == "chkpService") {
                    chkpService.getChkps().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.chkps = data;
                    });
                } else if($scope.name == "pwoService") {
                    pwoService.getPwos().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.pwos = data;
                    });
                } else if($scope.name == "vdftService") {
                    vdftService.getVdfts().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.vdfts = data;
                    });
                } else if($scope.name == "vwfcService") {
                    vwfcService.getVwfcs().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.vwfcs = data;
                    });
                } else if($scope.name == "vofService") {
                    vofService.getVofs().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.vofs = data;
                    });
                } else if($scope.name == "vprService") {
                    vprService.getVprs().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.vprs = data;
                    });
                } else if($scope.name == "vpeService") {
                    vpeService.getVpes().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.vpes = data;
                    });
                } else if($scope.name == "vsrService") {
                    vsrService.getVsrs().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.vsrs = data;
                    });
                } else if($scope.name == "widService") {
                    widService.getWids().then(function (data) {
                        console.log("response info: " + angular.toJson(data));
                        $rootScope.dataNum = data.length; //设置数据总个数
                        $rootScope.pages = Math.floor($rootScope.dataNum/$rootScope.listsPerPage) + 1;         //按照每页显示数据个数，得到总页数
                        $rootScope.wids = data;
                    });
                }
                
            },
            link: function(scope, elements, attrs, controller) {
                //scope.name = "sinar";
            },
            compile: function(element, attributes) {

            }
        };
    });