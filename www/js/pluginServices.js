angular.module('ssapp.pluginServices', ['ngCordova'])
    .service('NetworkService', ['$q', '$cordovaNetwork', function ($q, $cordovaNetwork) {
        return {
            // 获取网络类型
            getNetworkType: function () {
                /*
                 Connection.UNKNOWN
                 Connection.ETHERNET //以太网
                 Connection.WIFI	WiFi
                 Connection.CELL_2G
                 Connection.CELL_3G
                 Connection.CELL_4G
                 Connection.CELL  //蜂窝网络
                 Connection.NONE
                 */
                var deferred = $q.defer();
                document.addEventListener("deviceready", function () {
                    deferred.resolve($cordovaNetwork.getNetwork());
                }, false);
                return deferred.promise;
            },
            // 是否启用网络
            isOnline: function () {
                var deferred = $q.defer();
                document.addEventListener("deviceready", function () {
                    deferred.resolve($cordovaNetwork.isOnline());
                }, false);
                return deferred.promise;
            }
        };
    }])
    .service('DeviceService', ['$q', '$cordovaDevice', function ($q, $cordovaDevice) {
        return {
            //获取用户设备信息
            getDeviceInfo: function () {
                var deferred = $q.defer();
                document.addEventListener("deviceready", function () {
                    deferred.resolve("设备名称:" + $cordovaDevice.getModel() + ";运行环境:" + $cordovaDevice.getPlatform() + " " + $cordovaDevice.getVersion());
                }, false);
                return deferred.promise;
            }
        };
    }])
    // Toast服务
    .service('ToastService', ['$cordovaToast', function ($cordovaToast) {
        return {
            showShortTop: function (message) {
                $cordovaToast.showShortTop(message);
            },
            showShortCenter: function (message) {
                $cordovaToast.showShortCenter(message);
            },
            showShortBottom: function (message) {
                $cordovaToast.showShortBottom(message);
            },
            showLongTop: function (message) {
                $cordovaToast.showLongTop(message);
            },
            showLongCenter: function (message) {
                $cordovaToast.showLongCenter(message);
            },
            showLongBottom: function (message) {
                $cordovaToast.showLongBottom(message);
            }
        };
    }])
    // 启动画面服务
    .service('SplashscreenService', ['$cordovaSplashscreen', function ($cordovaSplashscreen) {
        return {
            hide: function () {
                $cordovaSplashscreen.hide();
            },
            show: function () {
                $cordovaSplashscreen.show();
            }
        };
    }])
    // 统计服务
    .service('UmengService', ['$q', '$window', function ($q, $window) {
        return {
            init: function () {
                var deferred = $q.defer();
                $window.plugins.umengAnalyticsPlugin.init();
                deferred.resolve(null);
                return deferred.promise;
            }
        };
    }])
    // APP 版本服务
    .service('AppVersionService', ['$q', '$cordovaAppVersion', function ($q, $cordovaAppVersion) {
        return {
            getVersionNumber: function () {
                var deferred = $q.defer();
                $cordovaAppVersion.getVersionNumber().then(function (version) {
                    deferred.resolve(version);
                });
                return deferred.promise;
            },
            getVersionCode: function () {
                var deferred = $q.defer();
                $cordovaAppVersion.getVersionCode().then(function (build) {
                    deferred.resolve(build);
                });
                return deferred.promise;
            }
        };
    }])
    // 高德地图服务
    .service('MapService', ['$q', '$http', function ($q, $http) {
        return {
            getCurrentPostion: function (map, geolocation) {
                var deferred = $q.defer();
                //加载地图，调用浏览器定位服务
                map = new AMap.Map('container', {
                    resizeEnable: true,
                     zoom: 15
                });
                map.plugin('AMap.Geolocation', function() {
                    geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        //zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        buttonPosition:'RB'
                    });
                    map.addControl(geolocation);
                    //geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', function(data) {
                        var str=['定位成功'];
                        str.push('经度：' + data.position.getLng());
                        str.push('纬度：' + data.position.getLat());
                        str.push('精度：' + data.accuracy + ' 米');
                        str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
                        //document.getElementById('tip').innerHTML = str.join('<br>');
                        console.log("success data：" + angular.toJson(data));
                        deferred.resolve(data);
                    });//返回定位信息
                    AMap.event.addListener(geolocation, 'error', function(data) {
                        //document.getElementById('tip').innerHTML = '定位失败';
                        console.log("error data：" + angular.toJson(data));
                        deferred.resolve(data);
                    });      //返回定位出错信息
                });
                geolocation.getCurrentPosition();
                //解析定位结果
                /*var onComplete = function(data) {
                    var str=['定位成功'];
                    str.push('经度：' + data.position.getLng());
                    str.push('纬度：' + data.position.getLat());
                    str.push('精度：' + data.accuracy + ' 米');
                    str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
                    //document.getElementById('tip').innerHTML = str.join('<br>');
                    console.log("success data：" + angular.toJson(data));
                    deferred.resolve(data);
                };*/
                //解析定位错误信息
                /*var onError = function(data) {
                    //document.getElementById('tip').innerHTML = '定位失败';
                    console.log("error data：" + angular.toJson(data));
                    deferred.resolve(data);
                };*/
                return deferred.promise;
            },
            getNearby: function(point) {
                var deferred = $q.defer();
                var url = "http://yuntuapi.amap.com/nearby/around?key=c9fd473b5be48bb7be3e9d7327486cfe&center="+point+"&radius=200&callback=JSON_CALLBACK";
                $http.jsonp(url).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    }
                ).error(
                    function(data){
                        alert("error");
                    }
                );
                var JSON_CALLBACK = function(data) {
                    console.log(data);
                    deferred.resolve(data);
                };
                return deferred.promise;
            }
        };
    }])
    // 社交分享服务
    .service('ShareService', ['$q', '$cordovaSocialSharing', function ($q, $cordovaSocialSharing) {
        return {
            share: function (data) {
                $cordovaSocialSharing
                    .share(data.message, data.subject, null, data.link);
            }
        };
    }])
    .service('_', ['$window', function($window) {
        return $window._;
    }])
    .service('alertService', ['$timeout', '$state', function($timeout, $state) {
        return {
            showAlert: function(scope, alertInfo, isShow, alertType, route) {

                //设置弹出框位置
                $('.success-input').css('margin-top',('-25px'));

                scope.alertInfo = alertInfo;
                scope.isShow = isShow;
                $("#alert").show();
                scope.alertType = alertType; 
                $timeout(function() {
                    scope.alertInfo = "";
                    scope.isShow = false;
                    $("#alert").hide();
                    if(route !== null) {
                        $state.go(route);
                    }
                    //为防止影响textarea，设回弹出框原始位置
                    $('.success-input').css('margin-top',('-525px'));
                    //angular.element("ss-alert").hide();
                }, 1000);
            }
        };
    }])
    
	.factory('jpushService', ['$http', '$window', '$document', function($http, $window, $document) {
		var jpushServiceFactory = {};

		//var jpushapi = $window.plugins.jPushPlugin;

		//启动极光推送
		var _init = function(config) {
			$window.plugins.jPushPlugin.init();
			//设置tag和Alias触发事件处理
			document.addEventListener('jpush.setTagsWithAlias', config.stac, false);
			//打开推送消息事件处理
			$window.plugins.jPushPlugin.openNotificationInAndroidCallback = config.oniac;
			$window.plugins.jPushPlugin.setDebugMode(true);
		};
		
		//获取状态
		var _isPushStopped = function(fun) {
			$window.plugins.jPushPlugin.isPushStopped(fun);
		};
		
		//停止极光推送
		var _stopPush = function() {
			$window.plugins.jPushPlugin.stopPush();
		};

		//重启极光推送
		var _resumePush = function() {
			$window.plugins.jPushPlugin.resumePush();
		};

		//设置标签和别名
		var _setTagsWithAlias = function(tags,alias) {
			$window.plugins.jPushPlugin.setTagsWithAlias(tags,alias);
		};

		//设置标签
		var _setTags = function(tags) {
			$window.plugins.jPushPlugin.setTags(tags);
		};

		//设置别名
		var _setAlias = function(alias) {
			$window.plugins.jPushPlugin.setAlias(alias);
		};
		
		jpushServiceFactory.init = _init;
		jpushServiceFactory.isPushStopped = _isPushStopped;
		jpushServiceFactory.stopPush = _stopPush;
		jpushServiceFactory.resumePush = _resumePush;

		jpushServiceFactory.setTagsWithAlias = _setTagsWithAlias;
		jpushServiceFactory.setTags = _setTags;
		jpushServiceFactory.setAlias = _setAlias;

		return jpushServiceFactory;
	}]);