/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services', [])

    //定义一个全局Service
    .service('AppService', ["AppConstant", '$state', function (AppConstant, $state) {
    }])
    //定义一个全局常量 使用时先注入到要使用的模块
    .constant("AppConstant", {
        version: 2.0
    })

	.service('ConfigService', [function () {
        //服务器
        //var hostURL = "http://139.196.242.202:80/SSAPP";
        //var hostURL = "http://139.196.242.202:80/SSAPP";
        //var hostURL = "http://shangshang.tunnel.qydev.com/SSAPP";
        var appURL = "http://139.196.242.202:8100/#";
        //var hostURL = "http://localhost:80/SSAPP";
        //var hostURL = "http://sss118.ngrok.cc/SSAPP";
        var hostURL = "http://sss118.tunnel.qydev.com/SSAPP";
        var service = {
            getHost: function () {
                return hostURL;
            },
            getAppURL: function () {
                return appURL;
            }
        };
        return service;
    }])
     //公用服务
    .service('commonService', ['$http', '$q', 'ConfigService', '$ionicLoading', 'localStorageService', '$timeout', '$cordovaNetwork', 'ToastService', '$cordovaFileTransfer', '$cordovaFileOpener2', function ($http, $q, ConfigService, $ionicLoading, localStorageService, $timeout, $cordovaNetwork, ToastService, $cordovaFileTransfer, $cordovaFileOpener2) {
        var lastTimeStamp = 0;
        var reqParamStr = "";
        var obj = {
            // 获取当前用户手机号
            getCurUserTel: function (data) {
                var user = localStorageService.get("User");
                var tel = "";
                if(user) {
                    tel = user.telephone;
                }
                return tel;
            },
            // 页面加载
            showLoading: function (data) {
                var deferred = $q.defer();
                /*$ionicLoading.show({
                    content: 'Loading
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,',
                    showDelay: 0
                });*/
                $ionicLoading.show({
                    template: '<ion-spinner id="loadingSpinner" icon="dots" class="spinner-calm spring-center"></ion-spinner>',
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: false,
                    maxWidth: 200,
                    showDelay: 0
                });
                $("ion-content").hide();
                return deferred.promise;
            },
            // 获取光标位置
            getCursortPosition: function (textDom) {
                var cursorPos = 0;
                if (document.selection) {
                    // IE Support
                    textDom.focus ();
                    var selectRange = document.selection.createRange();
                    selectRange.moveStart ('character', -textDom.value.length);
                    cursorPos = selectRange.text.length;
                }else if (textDom.selectionStart || textDom.selectionStart == '0') {
                    // Firefox support
                    cursorPos = textDom.selectionStart;
                }
                return cursorPos;
            },
            hideLoading: function () {
                var deferred = $q.defer();
                $ionicLoading.hide();
                $("ion-content").show();
                return deferred.promise;
            },
            // 数组包含
            contains: function (elem, array) {
                var deferred = $q.defer();
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == elem) {
                       return true;
                    }
                }
                return false;
            },
            hasPathInArr: function (elem, array) {
                var deferred = $q.defer();
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === elem) {
                       return true;
                    } else {
                        if(elem.indexOf(array[i]+"/") === 0) {
                            return true;
                        }
                    }
                }
                return false;
            },
            // 获取MD5加密后获得的请求参数字符串
            getReqParamStr: function () {
                var tel = obj.getCurUserTel();
                //与服务端约定好的appId
                var appId = localStorageService.get("appId");

                var timeStamp = new Date().getTime();
                if((timeStamp - lastTimeStamp > 2*60*60*1000) && appId) {
                    lastTimeStamp = timeStamp;
                    var signature = hex_md5(timeStamp + appId).toUpperCase();
                    if(tel && tel != "") {
                        reqParamStr = "?timeStamp=" + timeStamp + "&signature=" + signature + "&userTel=" + tel;
                    } else {
                        reqParamStr = "?timeStamp=" + timeStamp + "&signature=" + signature;
                    }

                }
                //与服务端约定好的appId
                /*var appId = localStorageService.get("appId");
                var timeStamp = new Date().getTime();
                if(timeStamp - lastTimeStamp > 2*60*60*1000) {
                    lastTimeStamp = timeStamp;
                    var signature = hex_md5(timeStamp + appId).toUpperCase();
                    reqParamStr = "?timeStamp=" + timeStamp + "&signature=" + signature;
                }*/
                return reqParamStr;
            },
            // 获取密码经MD5加密后的字符串
            getPswMD5Str: function (password) {
                //与服务端约定好的pswSecret
                var pswSecret = "cefi35694fefe13sad";
                var passwordMD5 = hex_md5(pswSecret + password).toUpperCase();
                return passwordMD5;
            },
            // 获取此时的appId是否与服务器的相同
            appIdIsLegal: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/loginAdmin/appIdIsLegal/" + localStorageService.get("appId");
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            onOnline: function () {
                //console.log($cordovaNetwork.isOnline());
                var networkState = navigator.connection.type;
                if (networkState === Connection.NONE) {
                    ToastService.showShortBottom("当前网络未连接，请检查网络后再试！");
                    return false;
                }
                return true;
            },
            phoneTo: function (tel) {
                if (device.platform != "Android") {
                  phonedialer.dial(
                    tel,
                    function(err) {
                      if (err == "empty") alert("Unknown phone number");
                      //else alert("Dialer Error:" + err);
                    },
                    function(success) {
                      //alert('Dialing succeeded');
                    }
                  );
                } else {
                  window.location.href = "tel:" + tel;
                }
            },
            getWaterFallVM: function (scope, getDate, loadingId, pageSize) {
                var vmPageSize = 20;
                if(pageSize != null) vmPageSize = pageSize;
                var vm = {
                    moredata: false,
                    messages: [],
                    finishInit: false,
                    pagination: {
                      currentPage: 1,
                      perPage: vmPageSize
                    },
                    init: function () {
                      this.finishInit = false;
                      this.moredata = false;
                      this.messages = [];
                      this.pagination.currentPage = 1;
                      getDate();
                    },
                    show: function (message) {
                      if (message.static) {
                        message.static = false;
                      } else {
                        message.static = true;
                      }
                    },
                    doRefresh: function () {
                      $timeout(function () {
                        vm.init();
                        scope.$broadcast('scroll.refreshComplete');
                        //$window.location.reload();
                      }, 1000);
                    },
                    hasMoreDate: function () {
                      if(this.moredata) {
                        return false;
                      } return true;
                    },
                    loadMore: function () {
                      if(!this.moredata) {
                        eval("scope." + loadingId + " = true");
                        $("#" + loadingId).show();
                        if(this.finishInit) {
                          this.pagination.currentPage += 1;
                          getDate();
                        }
                      }
                    },
                };
                return vm;
            },
            uploadFile: function (uploadFun) {
                /*navigator.camera.getPicture(uploadFun,
                                          function(message) {
                                            alert(angular.toJson(message));
                                          },
                                          {
                                            sourceType: 2
                                          });*/
                var externalRootDirectory = cordova.file.externalRootDirectory;
                alert(externalRootDirectory);
                function onFileSystemFail(error) {
                    alert("Failed to retrieve file:" + error.code);
                }
                var newFile;
                //获取mobovip目录，如果不存在则创建该目录
                function onFileSystemSuccess(fileSystem) {
                    newFile = fileSystem.root.getDirectory(directory, {
                        create : true,
                        exclusive : false
                    }, onDirectorySuccess, onFileSystemFail);
                }
                //获取mobovip目录下面的stores.txt文件，如果不存在则创建此文件
                function onDirectorySuccess(newFile) {
                    newFile.getFile(fileName, {
                        create : true,
                        exclusive : false
                    }, onFileSuccess, onFileSystemFail);
                }
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemFail);
            },
            getLocationFilePath: function(fileName) {
                var path = "";
                if (device.platform == "Android") {
                    var ios = cordova && cordova.file.cacheDirectory;
                    var ext = cordova && cordova.file.externalCacheDirectory;
                    var dirc = (ext) ? ext : (ios ? ios : "");
                    device = dirc + fileName;
                }else{
                    device = "cdvfile://localhost/temporary/"+fileName;
                };
                return device;
            },
            downloadFile: function (fileUrl, fileName) {
                var url = fileUrl;
                url = url.replace(/\\/g,"/");
                var trustHosts = true;
                var targetPath;
                var options = {};

                if(device.platform == "Android") {
                    targetPath = cordova.file.externalApplicationStorageDirectory + "files/" + fileName;
                } else {
                    targetPath = cordova.file.documentsDirectory + new Date().getTime() + "." + name.split(".")[1];
                }
                $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                    alert("下载完成");
                    $ionicLoading.hide();
                    // 打开下载下来的文件
                    $cordovaFileOpener2.open(
                      targetPath,
                      'application/pdf'
                    ).then(function() {
                        // file opened successfully
                    }, function(err) {
                        // An error occurred. Show a message to the user
                    });
                }, function (err) {
                    alert('下载失败');
                    $ionicLoading.hide();
                }, function (progress) {
                    //进度，这里使用文字显示下载百分比
                    $timeout(function () {
                        var downloadProgress = (progress.loaded / progress.total) * 100;
                        $ionicLoading.show({
                            template: "已经下载：" + Math.floor(downloadProgress) + "%"
                        });
                        if (downloadProgress > 99) {
                            $ionicLoading.hide();
                        }
                    });
                });
            },
            openFile: function (filePath) {
                $cordovaFileOpener2.open(
                      filePath,
                      'application/pdf'
                    ).then(function() {
                        // file opened successfully
                    }, function(err) {
                        // An error occurred. Show a message to the user
                    });
            },
            getGPSUtil: function () {
                var GPS = {
                    PI : 3.14159265358979324,
                    x_pi : 3.14159265358979324 * 3000.0 / 180.0,
                    delta : function (lat, lon) {
                        // Krasovsky 1940
                        //
                        // a = 6378245.0, 1/f = 298.3
                        // b = a * (1 - f)
                        // ee = (a^2 - b^2) / a^2;
                        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
                        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
                        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
                        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
                        var radLat = lat / 180.0 * this.PI;
                        var magic = Math.sin(radLat);
                        magic = 1 - ee * magic * magic;
                        var sqrtMagic = Math.sqrt(magic);
                        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
                        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
                        return {'lat': dLat, 'lon': dLon};
                    },

                    //WGS-84 to GCJ-02
                    gcj_encrypt : function (wgsLat, wgsLon) {
                        if (this.outOfChina(wgsLat, wgsLon))
                            return {'lat': wgsLat, 'lon': wgsLon};

                        var d = this.delta(wgsLat, wgsLon);
                        return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
                    },
                    //GCJ-02 to WGS-84
                    gcj_decrypt : function (gcjLat, gcjLon) {
                        if (this.outOfChina(gcjLat, gcjLon))
                            return {'lat': gcjLat, 'lon': gcjLon};

                        var d = this.delta(gcjLat, gcjLon);
                        return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
                    },
                    //GCJ-02 to WGS-84 exactly
                    gcj_decrypt_exact : function (gcjLat, gcjLon) {
                        var initDelta = 0.01;
                        var threshold = 0.000000001;
                        var dLat = initDelta, dLon = initDelta;
                        var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
                        var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
                        var wgsLat, wgsLon, i = 0;
                        while (1) {
                            wgsLat = (mLat + pLat) / 2;
                            wgsLon = (mLon + pLon) / 2;
                            var tmp = this.gcj_encrypt(wgsLat, wgsLon)
                            dLat = tmp.lat - gcjLat;
                            dLon = tmp.lon - gcjLon;
                            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                                break;

                            if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
                            if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;

                            if (++i > 10000) break;
                        }
                        //console.log(i);
                        return {'lat': wgsLat, 'lon': wgsLon};
                    },
                    //GCJ-02 to BD-09
                    bd_encrypt : function (gcjLat, gcjLon) {
                        var x = gcjLon, y = gcjLat;
                        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
                        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
                        bdLon = z * Math.cos(theta) + 0.0065;
                        bdLat = z * Math.sin(theta) + 0.006;
                        return {'lat' : bdLat,'lon' : bdLon};
                    },
                    //BD-09 to GCJ-02
                    bd_decrypt : function (bdLat, bdLon) {
                        var x = bdLon - 0.0065, y = bdLat - 0.006;
                        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
                        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
                        var gcjLon = z * Math.cos(theta);
                        var gcjLat = z * Math.sin(theta);
                        return {'lat' : gcjLat, 'lon' : gcjLon};
                    },
                    //WGS-84 to Web mercator
                    //mercatorLat -> y mercatorLon -> x
                    mercator_encrypt : function(wgsLat, wgsLon) {
                        var x = wgsLon * 20037508.34 / 180.;
                        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
                        y = y * 20037508.34 / 180.;
                        return {'lat' : y, 'lon' : x};
                        /*
                        if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
                            return null;
                        var x = 6378137.0 * wgsLon * 0.017453292519943295;
                        var a = wgsLat * 0.017453292519943295;
                        var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
                        return {'lat' : y, 'lon' : x};
                        //*/
                    },
                    // Web mercator to WGS-84
                    // mercatorLat -> y mercatorLon -> x
                    mercator_decrypt : function(mercatorLat, mercatorLon) {
                        var x = mercatorLon / 20037508.34 * 180.;
                        var y = mercatorLat / 20037508.34 * 180.;
                        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
                        return {'lat' : y, 'lon' : x};
                        /*
                        if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
                            return null;
                        if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
                            return null;
                        var a = mercatorLon / 6378137.0 * 57.295779513082323;
                        var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
                        var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
                        return {'lat' : y, 'lon' : x};
                        //*/
                    },
                    // two point's distance
                    distance : function (latA, lonA, latB, lonB) {
                        var earthR = 6371000.;
                        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
                        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
                        var s = x + y;
                        if (s > 1) s = 1;
                        if (s < -1) s = -1;
                        var alpha = Math.acos(s);
                        var distance = alpha * earthR;
                        return distance;
                    },
                    outOfChina : function (lat, lon) {
                        if (lon < 72.004 || lon > 137.8347)
                            return true;
                        if (lat < 0.8293 || lat > 55.8271)
                            return true;
                        return false;
                    },
                    transformLat : function (x, y) {
                        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
                        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
                        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
                        return ret;
                    },
                    transformLon : function (x, y) {
                        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
                        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
                        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
                        return ret;
                    }
                };
                return GPS;
            },
        };
        return obj;
    }])
    .service('TimeService', ['$filter', function ($filter) {
        return {
            beginDay: function () {
                var beginDay = $filter("date")(new Date(), "yyyy-MM-dd")+" 00:00:00";
                return beginDay;
            },
            endDay: function () {
                var endDay = $filter("date")(new Date(), "yyyy-MM-dd")+" 23:59:59";
                return endDay;
            },
            beginWeek: function () {
                var currentDate = new Date();
                var millisecond = 1000 * 60 * 60 * 24;
                var minusDay = currentDate.getDay() != 0 ? currentDate.getDay()-1 : 6;
                var beginWeek = $filter("date")(new Date(currentDate.getTime() - (minusDay * millisecond)), "yyyy-MM-dd")+" 00:00:00";
                return beginWeek;
            },
            endWeek: function () {
                var currentDate = new Date();
                var millisecond = 1000 * 60 * 60 * 24;
                var plusDay = currentDate.getDay() != 0 ? 7-currentDate.getDay() : 0;
                var endWeek = $filter("date")(new Date(currentDate.getTime() + (plusDay * millisecond)), "yyyy-MM-dd")+" 23:59:59";
                return endWeek;
            },
            beginLastWeek: function () {
                var currentDate = new Date();
                var millisecond = 1000 * 60 * 60 * 24;
                var minusDay = currentDate.getDay() != 0 ? currentDate.getDay()-1 : 6;
                var beginLastWeek = $filter("date")(new Date(currentDate.getTime() - (minusDay * millisecond) - (7 * millisecond)), "yyyy-MM-dd")+" 00:00:00";
                return beginLastWeek;
            },
            endLastWeek: function () {
                var currentDate = new Date();
                var millisecond = 1000 * 60 * 60 * 24;
                var plusDay = currentDate.getDay() != 0 ? 7-currentDate.getDay() : 0;
                var endLastWeek = $filter("date")(new Date(currentDate.getTime() + (plusDay * millisecond) - (7 * millisecond)), "yyyy-MM-dd")+" 23:59:59";
                return endLastWeek;
            },
            beginMonth: function () {
                var date_ = new Date();
                var year = date_.getFullYear();
                var month = date_.getMonth() + 1;
                if(month < 10) {
                    month = "0" + month;
                }
                var beginMonth = year + '-' + month + '-01' + " 00:00:00";
                return beginMonth;
            },
            endMonth: function () {
                var date_ = new Date();
                var year = date_.getFullYear();
                var month = date_.getMonth() + 1;
                var day = new Date(year,month,0);
                if(month < 10) {
                    month = "0" + month;
                }
                var endMonth = year + '-' + month + '-' + day.getDate() + " 23:59:59";
                return endMonth;
            },
            beginLastMonth: function () {
                var lastMonthDate = new Date(); //上月日期
                lastMonthDate.setDate(1);
                lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
                var beginLastMonth = $filter("date")(lastMonthDate, "yyyy-MM-dd")+" 00:00:00";
                return beginLastMonth;
            },
            endLastMonth: function () {
                var date_ = new Date();
                var year = date_.getFullYear();
                var month = date_.getMonth();
                var day = new Date(year,month,0);
				if((day.getMonth()+1) < 10) {
                    month = "0" + (day.getMonth()+1);
                }
                var endLastMonth = day.getFullYear() + '-' + month + '-' + day.getDate() + " 23:59:59";
                return endLastMonth;
            },
            //获取传入日期所在周是一月中的第几周（按周一算）
            monthWeek: function (date_) {
                var firstMonday = new Date(date_.getFullYear(), date_.getMonth(), 1);
                if(firstMonday.getDay() === 0) {
                    firstMonday.setDate(2);
                } else if(firstMonday.getDay() === 1) {
                    firstMonday.setDate(1);
                } else {
                    firstMonday.setDate(9 - firstMonday.getDay());
                }
                var num = Math.floor((date_.getDate()-firstMonday.getDate())/7);
                return num+1;
            },
            //根据字符串yyyy-MM-dd HH:mm:ss 转换为Date类型日期
            strToDate: function (s) {
                var d = new Date();
                d.setYear(parseInt(s.substring(0,4),10));
                d.setMonth(parseInt(s.substring(5,7)-1,10));
                d.setDate(parseInt(s.substring(8,10),10));
                d.setHours(parseInt(s.substring(11,13),10));
                d.setMinutes(parseInt(s.substring(14,16),10));
                d.setSeconds(parseInt(s.substring(17,19),10));
                return d;
            },
            getLunarDay: function (year, month, day) {
                var CalendarData=new Array(100);var madd=new Array(12);var tgString="甲乙丙丁戊己庚辛壬癸";var dzString="子丑寅卯辰巳午未申酉戌亥";var numString="一二三四五六七八九十";var monString="正二三四五六七八九十冬腊";var weekString="日一二三四五六";var sx="鼠牛虎兔龙蛇马羊猴鸡狗猪";var cYear,cMonth,cDay,TheDate;
                CalendarData = new Array(        0xA4B,0x5164B,0x6A5,0x6D4,0x415B5,0x2B6,0x957,0x2092F,0x497,0x60C96,           0xD4A,0xEA5,0x50DA9,0x5AD,0x2B6,0x3126E, 0x92E,0x7192D,0xC95,0xD4A,            0x61B4A,0xB55,0x56A,0x4155B, 0x25D,0x92D,0x2192B,0xA95,0x71695,0x6CA,          0xB55,0x50AB5,0x4DA,0xA5B,0x30A57,0x52B,0x8152A,0xE95,0x6AA,0x615AA,           0xAB5,0x4B6,0x414AE,0xA57,0x526,0x31D26,0xD95,0x70B55,0x56A,0x96D,          0x5095D,0x4AD,0xA4D,0x41A4D,0xD25,0x81AA5, 0xB54,0xB6A,0x612DA,0x95B,
                0x49B,0x41497,0xA4B,0xA164B, 0x6A5,0x6D4,0x615B4,0xAB6,0x957,0x5092F,
                0x497,0x64B, 0x30D4A,0xEA5,0x80D65,0x5AC,0xAB6,0x5126D,0x92E,0xC96,          0x41A95,0xD4A,0xDA5,0x20B55,0x56A,0x7155B,0x25D,0x92D,0x5192B,0xA95,          0xB4A,0x416AA,0xAD5,0x90AB5,0x4BA,0xA5B, 0x60A57,0x52B,0xA93,0x40E95);
                madd[0]=0;madd[1]=31;madd[2]=59;madd[3]=90;
                madd[4]=120;madd[5]=151;madd[6]=181;madd[7]=212;
                madd[8]=243;madd[9]=273;madd[10]=304;madd[11]=334;
                function GetBit(m,n) {
                    return (m>>n)&1;
                }
                function GetcDateString(){
                    var tmp=""; tmp+=tgString.charAt((cYear-4)%10);
                    tmp+=dzString.charAt((cYear-4)%12);
                    tmp+="年 ";
                    if(cMonth<1) {
                        tmp+="(闰)"; tmp+=monString.charAt(-cMonth-1);
                    } else {
                        tmp+=monString.charAt(cMonth-1);
                    }
                    tmp+="月"; tmp+=(cDay<11)?"初":((cDay<20)?"十":((cDay<30)?"廿":"三十"));
                    if (cDay%10!=0||cDay==10) {
                        tmp+=numString.charAt((cDay-1)%10);
                    }
                    return tmp;
                }
                function e2c() {
                    TheDate= (arguments.length!=3) ? new Date() : new Date(arguments[0],arguments[1],arguments[2]);
                    var total,m,n,k;
                    var isEnd=false;
                    var tmp=TheDate.getFullYear();
                    total=(tmp-1921)*365+Math.floor((tmp-1921)/4)+madd[TheDate.getMonth()]+TheDate.getDate()-38;
                    if (TheDate.getYear()%4==0&&TheDate.getMonth()>1) { total++;}
                    for(m=0;;m++) {
                        k=(CalendarData[m]<0xfff)?11:12;
                        for(n=k;n>=0;n--)  {
                            if(total<=29+GetBit(CalendarData[m],n)) {
                                isEnd=true; break;
                            }
                            total=total-29-GetBit(CalendarData[m],n);
                        }
                        if(isEnd) break;
                    }
                    cYear=1921 + m; cMonth=k-n+1; cDay=total;
                    if(k==12)  {
                        if(cMonth==Math.floor(CalendarData[m]/0x10000)+1) {
                            cMonth=1-cMonth;
                        }
                        if(cMonth>Math.floor(CalendarData[m]/0x10000)+1) {
                            cMonth--;
                        }
                    }
                }
                function GetLunarDay(solarYear,solarMonth,solarDay) {
                    solarMonth = (parseInt(solarMonth)>0) ? (solarMonth-1) : 11;
                    e2c(solarYear,solarMonth,solarDay);
                    return GetcDateString();
                }
                return GetLunarDay(year, month, day);
            }
        };
    }])
    //打赏服务
    .service('RewardService', ['$q', '$http', '$filter', 'ConfigService', 'commonService', function ($q, $http, $filter, ConfigService, commonService) {
        return {
            // 新建打赏
            postReward: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/rewardAdmin/reward" + commonService.getReqParamStr();
                $http({
                    method: 'POST',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: data
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 获取某个员工（得赏人）的所有打赏记录
            getRewardsByPayTo: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/rewardAdmin/rewardsByPayTo/" + uid + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 获取某个员工（打赏人）的所有打赏记录
            getRewardsByPayFrom: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/rewardAdmin/rewardsByPayFrom/" + uid + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 获取某个员工的所有打赏记录(包括打赏和被打赏)
            getRewardsForUser: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/rewardAdmin/rewardsForUser/" + uid + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //获取该用户的钱包金额
            getWalletByUser: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/rewardAdmin/getWalletByUser/" + uid + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            selFromTableAndId: function (table, id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/rewardAdmin/selFromTableAndId/" + table + "," + id + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            }
        };
    }])
    .service('gaodeMapService', ['$filter', '$ionicPopup', function ($filter, $ionicPopup) {
        return {
            //初始化可点击的地图
            initMap: function (map, panToLocation, clickCallBack, complete_CallBack) {
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
                        panToLocation: panToLocation,      //定位成功后将定位到的位置作为地图中心点，默认：true
                        zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        useNative: true
                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', complete_CallBack);//返回定位信息
                });

                AMap.plugin('AMap.Geocoder',function(){
                    var geocoder = new AMap.Geocoder({
                    });
                    var marker = new AMap.Marker({
                        map:map,
                        bubble:true
                    })
                    //var input = document.getElementById('input');
                    //var message = document.getElementById('message');
                    map.on('click',function(e){
                        marker.setPosition(e.lnglat);
                        geocoder.getAddress(e.lnglat,function(status,result){
                          if(status=='complete'){
                            result.location = e.lnglat;
                            clickCallBack(result);
                            //alert(result.regeocode.formattedAddress);
                            //message.innerHTML = ''
                          }else{
                            //message.innerHTML = '无法获取地址'
                          }
                        })
                    })

                });
            },
            //在地图map上显示地址定位，并标注marker(1个)和infoWindow(1个)
            showLocationInMap: function (map, address) {
                //addToolBar(map);
                var marker;
                var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(10, -30)});
                var callBack = function (result, address) {
                    map.setCenter([result.geocodes[0].location.lng, result.geocodes[0].location.lat]);
                    marker = new AMap.Marker({
                                    map:map,
                                    bubble:true,
                                    icon: new AMap.Icon({
                                            size: new AMap.Size(20, 30),  //图标大小
                                            image: "img/map.png"
                                        })
                                });
                    marker.setPosition(result.geocodes[0].location);
                    marker.address = address;
                    marker.on('click', markerClick);
                    marker.emit('click', {target: marker});
                }

                var markerClick = function(e) {
                  infoWindow.setContent(e.target.address);
                  infoWindow.open(map, e.target.getPosition());
                };

                this.getLocation(address, callBack, address);
            },
            addToolBar: function (map) {
                map.plugin('AMap.ToolBar', function() {
                    var toolBar = new AMap.ToolBar({
                        visible: true,
                        ruler: false,
                        direction: false,
                        locate: false,
                        //locationMarker: marker//自定义定位图标，值为Marker对象
                        position: "RB"
                    });
                    map.addControl(toolBar);
                    /*toolBar.hideDirection();
                    toolBar.showRuler();
                    toolBar.hideLocation();*/
                });
                $(".amap-logo").children("img").attr("src", "img/gaodeMap.png");
                $(".amap-logo").removeAttr("href");
            },
            //调用公交换乘路线规划服务
            transfer: function (map, fromCity, endCity, from, end, callBackFun) {
                /*
                * 调用公交换乘服务
                */
                //加载公交换乘插件
                AMap.service(["AMap.Transfer"], function() {
                    var transOptions = {
                        map: map,
                        city: fromCity,
                        cityd: endCity,
                        //panel: "panel",
                        policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
                    };
                    //构造公交换乘类
                    var trans = new AMap.Transfer(transOptions);
                    //根据起、终点坐标查询公交换乘路线
                    //console.log(from + "--" + end);
                    trans.search(from, end, function(status, result){
                        if (status === 'complete' && result.info === 'OK') {
                            callBackFun(result);
                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: '提示',
                                template: "抱歉，查询不到公交换乘路线规划，请选择别的路线规划方式！",
                                buttons:[{
                                    text: '确定',
                                    type: 'button-positive'
                                }],
                            });
                        }
                    });
                });
            },
            //调用步行路线规划服务
            walk: function (map, fromCity, endCity, from, end, callBackFun) {
                //步行导航
                AMap.service(["AMap.Walking"], function() {
                    var MWalk = new AMap.Walking({
                        map: map,
                        city: fromCity,
                        cityd: endCity
                    }); //构造路线导航类
                    //根据起终点坐标规划步行路线
                    MWalk.search(from, end, function(status, result){
                    //MWalk.search([{keyword: end},{keyword: from}], function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            callBackFun(result);
                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: '提示',
                                template: "抱歉，查询不到步行路线规划，请选择别的路线规划方式！",
                                buttons:[{
                                    text: '确定',
                                    type: 'button-positive'
                                }],
                            });
                        }
                    });
                });
            },
            //调用驾车路线规划服务
            drive: function (map, fromCity, endCity, from, end, callBackFun) {
                //步行导航
                AMap.service(["AMap.Driving"], function() {
                    var driving = new AMap.Driving({
                        map: map,
                        city: fromCity,
                        cityd: endCity
                    }); //构造路线导航类
                    // 根据起终点坐标规划步行路线
                    driving.search(from, end, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            callBackFun(result);
                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: '提示',
                                template: "抱歉，查询不到驾车路线规划，请选择别的路线规划方式！",
                                buttons:[{
                                    text: '确定',
                                    type: 'button-positive'
                                }],
                            });
                        }
                    });
                });
            },
            //调用搜索附近的type类型的商家的服务
            placeSearch: function (cpoint, type, callBackFun) {
                //搜索周边公司企业
                AMap.service(["AMap.PlaceSearch"], function() {
                    var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                        type: type
                    });

                    //var cpoint = [121.24532, 31.36288]; //中心点坐标
                    placeSearch.searchNearBy('', cpoint, 1000, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            callBackFun(result);
                        }
                    });
                });
            },
            //调用逆地理编码服务
            regeocoder: function (map, center, callBackFun) {
                //搜索周边
                map.plugin('AMap.Geolocation', function() {
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });
                    geocoder.getAddress(center, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            callBackFun(result);
                        }
                    });
                });
            },
            //调用逆地理编码服务
            getAddress: function (center, callBackFun, obj) {
                //搜索周边公司企业
                AMap.plugin('AMap.Geocoder', function() {
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });
                    geocoder.getAddress(center, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            callBackFun(result, obj);
                        }
                    });
                });
            },
            //调用地理编码服务
            getLocation: function (address, callBackFun, obj) {
                AMap.plugin('AMap.Geocoder',function(){
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });
                    geocoder.getLocation(address, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            callBackFun(result, obj);
                        }
                    });
                });
            },
        };
    }])

    .service('FormService', ['$http', '$q', '$filter','ConfigService', 'commonService', 'alertService', 'localStorageService', function ($http, $q, $filter, ConfigService, commonService, alertService, localStorageService) {
        return {
            // 获取指定menuCode的表单元素
            getFormsByMenuCode: function (menuCode) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/formAdmin/formsByMenuCode/" + menuCode + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //校验数据
            checkForm: function (formObj, scope) {
                /**
                 * 循环不同类的输入元素,tagName：要检查的标签名
                 * 返回值：若为true,表示表单都填写完成了。false,则表示有输入框未填写
                 */
                var circleArray = function(tagName) {
                    for(var i=0; i<formObj.find(tagName).length; i++) {
                        var obj = formObj.find(tagName + ":eq(" + i + ")");
                        if(tagName == "select") {
                            if(obj.attr("type") != "hidden" && (obj.val() == -1 || obj.val() == null) && obj.attr("isEmpty") != "true") {
                                showPopup(obj);
                                return false;
                            }
                        }
                        if(obj.attr("type") != "hidden" && obj.attr("type") != "button" && obj.val() == "" && obj.attr("isEmpty") != "true") {
                            showPopup(obj);
                            return false;
                        }
                        if(obj.attr("type") == "tel" && obj.val()!="") {
                            if(!isTelephone(obj.val())) {
                                showPopup(obj);
                                return false;
                            }
                        }
                        if(obj.attr("type") == "email" && obj.val()!="") {
                            if(!isEmail(obj.val()) && obj.val() != "") {
                                showPopup(obj);
                                return false;
                            }
                        }
                        //if(inputArray[i].value == )
                    }
                    return true;
                }
                /**
                 * 对单个元素对象执行弹出框弹出
                 */
                var showPopup = function(obj) {
                    var errorMsg = obj.attr("label") + obj.attr("errorMsg");
                    alertService.showAlert(scope, errorMsg, true, "warning", null);
                }

                if(circleArray("input") == true) {
                    if(circleArray("textarea") == true) {
                        if(circleArray("radio") == true) {
                            if(circleArray("select") == true) {
                                return circleArray("script");
                            }
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            /**
             * 功能：序列化form表单元素
             * 1.同名的name属性，值会被序列化为数组，例如checkbox等控件
             * 2.可以嵌套对象，name和value会被序列化为嵌套的json对象格式
             * 3.可以嵌套对象列表，name和value会被序列化成嵌套的json数组对象
             */
            serializeFormObject: function (element) {
                     var formObj = element;

                     /**
                      * 功能：判断key在Json结构中是否存在
                      * 存在，返回true; 否则，返回false.
                      */
                     var existKeyInJSON = function(key, json){
                           if(key == null || key == '' || $.isEmptyObject(json)){
                                return false;
                           }
                           var exist = false;
                           for(var k in json){
                             if(key === k){
                                 exist = true;
                             }
                           }
                           return exist;
                     }

                    var trim = function(str){ //删除左右两端的空格
                        return str.replace(/(^\s*)|(\s*$)/g, "");
                    }

                     /**
                      * 根据自定义表单自动生成json提交字符串
                      */
                     var getFormValuesByCustomForm = function() {
                         var arr = {};
                         var inputs = formObj.find("input");
                         var selects = formObj.find("select");
                         var textareas = formObj.find("textarea");
                         //input类型
                         $.each(inputs, function(index, item) {
                             var type = $(item).attr("type");
                             var name = $(item).attr("name");
                             var value = "";
                             switch(type) {
                             case "datetime":
                                 //对应日期时间类型生成json对应属性
                                 $.each($("input[type='" + type + "'][name='" + name + "']"), function(datetimeIndex, datetimeItem) {
                                     if(datetimeIndex == 0) {
                                         value = $(datetimeItem).val();
                                     } else {
                                         value = value + " " + $(datetimeItem).val();
                                     }
                                 })
                                 arr[name] = value;
                                 break;
                             case "radio":
                                 //对应radio类型生成json对应属性
                                 arr[name] = $("input[type='radio'][name='" + name + "']:checked").val();
                                 break;
                             case "checkbox":
                                 //对应checkbox类型生成json对应属性
                                 var checkboxArr = [];
                                 $.each($("input[type='checkbox'][name='" + name + "']:checked"), function(checkboxIndex, checkboxItem) {
                                     checkboxArr.push($(checkboxItem).val());
                                 });
                                 arr[name] = checkboxArr;
                                 break;
                             default :
                                 //默认生成json对应属性
                                 arr[name] = $("input[type='" + type + "'][name='" + name + "']").val();
                                 break;
                             }
                         });
                         //select类型
                         $.each(selects, function(index, item) {
                             var type = $(item).attr("type");
                             var name = $(item).attr("name");
                             var value = "";
                             switch(type) {
                             default :
                                 //默认select生成json对应属性
                                 if(typeof(type) != "undefined" && type != null && type != "")
                                     arr[name] = $("select[type='" + type + "'][name='" + name + "']").val();
                                 else
                                     arr[name] = $("select[name='" + name + "']").val();
                                 break;
                             }
                         });
                         //textarea类型
                         $.each(textareas, function(index, item) {
                             var type = $(item).attr("type");
                             var name = $(item).attr("name");
                             var value = "";
                             switch(type) {
                             default :
                                 //默认textarea生成json对应属性
                                 if(typeof(type) != "undefined" && type != null && type != "")
                                     arr[name] = $("textarea[type='" + type + "'][name='" + name + "']").val();
                                 else
                                     arr[name] = $("textarea[name='" + name + "']").val();
                                 break;
                             }
                         });


                         var resultObj = {};
                         //统一过滤一遍嵌套属性
                         for(var key in arr) {
                            // 有嵌套的属性，用'.'分隔的
                            if (key.indexOf('.') > -1) {
                                var pos = key.indexOf('.');
                                var objKey =  key.substring(0, pos);
                                // 判断此key是否已存在resultObj数据中，不存在则新建一个对象出来
                                if(!existKeyInJSON(objKey, resultObj)){
                                    resultObj[objKey] = {};
                                }
                                var subKey = key.substring(pos + 1);
                                if(typeof(arr[key]) == "string") {
                                    resultObj[objKey][subKey] = trim(arr[key]) || '';
                                } else {
                                    resultObj[objKey][subKey] = '';
                                }
                            }
                            // 普通属性
                            else{
                                if(typeof(arr[key]) == "string") {
                                    resultObj[key] = trim(arr[key]) || '';
                                } else {
                                    resultObj[key] = '';
                                }
                            }
                         }

                         return resultObj;
                     }

                     return getFormValuesByCustomForm();
            },
            //根据不同的流程，执行不同的填充方法。
            initFormByProcess: function (curProcess, formObjs) {
                var user = localStorageService.get("User");
                var formatDefaultValue = function(tt){
                    var ss;
                    var reg = new RegExp("^{{.*}}$","g");
                    if(reg.test(tt)){
                        ss = tt.substr(2, tt.length - 4);
                    }else{
                        ss=null;
                    }
                    return ss;
                };

                var fillEleDefaultValue = function(defaultValue, elementId) {
                    //处理defaultValue获取defaultValueType，若为空，则默认赋值defaultValue
                    var defaultValueType = formatDefaultValue(defaultValue);
                    switch(defaultValueType) {
                    case "userId":
                        //默认当前用户Id
                        $("#" + elementId).val(user.userId);
                        break;
                    case "userName":
                        //默认当前用户名字
                        $("#" + elementId).val(user.userName);
                        break;
                    case "userNo":
                        //默认当前用户工号
                        $("#" + elementId).val(user.userNo);
                        break;
                    case "deptId":
                        //默认当前用户部门Id
                        $("#" + elementId).val(user.deptId);
                        break;
                    case "deptName":
                        //默认当前用户部门名称
                        $("#" + elementId).val(user.deptName);
                        break;
                    case "positionId":
                        //默认当前用户岗位Id
                        $("#" + elementId).val(user.positionId);
                        break;
                    case "positionName":
                        //默认当前用户岗位I名称
                        $("#" + elementId).val(user.positionName);
                        break;
                    case "curDatetime":
                        //默认当前时间字符串
                        $("#" + elementId).val($filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"));
                        break;
                    case "curDate":
                        //默认当前日期字符串
                        $("#" + elementId).val($filter("date")(new Date(), "yyyy-MM-dd"));
                        break;
                    case "selectUser_3":
                        //默认选择用户，所有下属权限
                        break;
                    case "selectCus_4":
                        //默认选择客户，自己客户权限
                        break;
                    case "selectDept_1":
                        //默认选择部门，所有部门
                        break;
                    default :
                        //默认无实现
                        break;
                    }
                };

                $.each(formObjs, function(index, item) {
                    fillEleDefaultValue(item.defaultValue, item.elementId);
                });

            },
            /**
             * 根据单个对象填充表单form
             * @param formId 表单form的Id
             * @param item 单个对象json数据
             */
            fillForm: function (element, item) {
                /**
                 * 循环不同类的输入元素,tagName：要检查的标签名
                 * 返回值：若为true,表示表单都填写完成了。false,则表示有输入框未填写
                 */
                var circleArray = function(tagName) {
                    $.each(element.find(tagName), function (index,obj){
                        if(typeof($(obj).attr("name")) != "undefined" && $(obj).attr("name") != "" && eval("item." + $(obj).attr("name").split(".")[0]) != null) {
                            if($(obj).attr("type") == "datetime") {
                                /* datetime日期类型  */
                                var datetimes = $("input[type='datetime'][name='" + $(obj).attr("name") + "']");
                                if(datetimes.length == 1) $(obj).val(eval("item." + $(obj).attr("name")).substring(0, 19));
                                if(datetimes.length == 2) {
                                    //说明是自动化表单的组件
                                    var index = datetimes.index($(obj));
                                    if(index == 0) $(obj).val(eval("item." + $(obj).attr("name")).substring(0, 10));
                                    else if(index == 1) $(obj).val(eval("item." + $(obj).attr("name")).substring(11, 19));
                                }
                            } else if($(obj).attr("type") == "date") {
                                /* date类型  */
                                $(obj).val(eval("item." + $(obj).attr("name")).substring(0,10));
                            } else if($(obj).attr("type") == "text") {
                                /* 普通文本类型  */
                                $(obj).val(eval("item." + $(obj).attr("name")));
                            } else if($(obj).attr("type") == "radio") {
                                /* radio类型  */
                                var radioName = $(obj).attr("name");
                                if(eval("item." + $(obj).attr("name")) == $(obj).attr("value")) {
                                    //$(obj).prop("checked",true);
                                    $(obj).iCheck('check');
                                } else {
                                    //$(obj).prop("checked",false);
                                    $(obj).iCheck('uncheck');
                                }
                                //$(obj).attr("checked",checked);
                                //$("#input[name='" + radioName + "'][value=\"" + eval("item." + $(obj).attr("name")) + "\"]").get(0).checked=true;
                            } else if($(obj).attr("type") == "checkbox") {
                                /* checkbox类型  */
                                //var str = "1,2,3";//模拟数据库中存储的信息
                                //var checkboxArray = str.split(",");
                                var checkboxArray = eval("item." + $(obj).attr("name")).split(",");
                                if($.inArray($(obj).attr("value"), checkboxArray) != -1) {
                                    //$(obj).prop("checked",true);
                                    $(obj).iCheck('check');
                                } else {
                                    //$(obj).prop("checked",false);
                                    $(obj).iCheck('uncheck');
                                }
                            } else if($(obj).attr("type") == "ueditor") {
                                /* 编辑器ueditor类型  */
                                UE.getEditor("'" + $(obj).attr("id") + "'").execCommand("cleardoc");
                                UE.getEditor("'" + $(obj).attr("id") + "'").execCommand('insertHtml', eval("item." + $(obj).attr("name")));
                            } else {
                                $(obj).val(eval("item." + $(obj).attr("name")));
                                if(tagName == "select") {
                                    $("#" + $(obj).attr("id") + "_dummy").val(eval("item." + $(obj).attr("name")));
                                }
                            }
                            //判断只读
                            if($(obj).attr("isReadonly") == "true") {
                                $(obj).attr({ readonly: 'true' });
                            }
                            //判断是否可编辑
                            if($(obj).attr("isEditable") == "false") {
                                $(obj).attr({ readonly: 'true' });
                            }
                        }
                    });
                }

                circleArray("input");
                circleArray("textarea");
                circleArray("select");
                circleArray("script");

            }
        };
    }])

    .service('UserService', ['$http', '$q', 'ConfigService', 'commonService', 'localStorageService', function ($http, $q, ConfigService, commonService, localStorageService) {
        var obj = {
            // 用户登录
            login: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/loginAdmin/login";
                $http({
                    method: 'GET',
                    url: url,
                    params: data,
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 获取用户详情
            getUserById: function (userId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/userAdmin/userDetail/" + userId + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    params: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            getUsersByMenuUrl: function (userId, menuUrl) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/userAdmin/getUsersByMenuUrl/" + userId + commonService.getReqParamStr();
                $http({
                    method: 'POST',
                    url: url,
                    params: {'menuUrl':menuUrl}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //获取在职所有用户
            getUsers: function () {
               var deferred = $q.defer();
                var url = ConfigService.getHost() + "/userAdmin/users" + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //获取在职离职所有用户
            getAllUsers: function () {
               var deferred = $q.defer();
                var url = ConfigService.getHost() + "/userAdmin/allUsers" + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //根据权限获取用户
            getUsersByPri: function (userId, selPri) {
               var deferred = $q.defer();
                var url = ConfigService.getHost() + "/userAdmin/getUsersByPri/" + userId + "," + selPri + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //根据权限展示功能模块
            showMenuIconByPri: function () {
                var deferred = $q.defer();
                var userId = localStorageService.get("User").userId;
                //根据用户ID取权限数据
                this.getViewPriByUserId(userId).then(function(data) {
                    $.each(commonMenuConfig, function(index, item) {
                      if(data[item.menuCode]) {
                        var menuName = item.menuName;
                        var iconId = item.iconId;
                        var tableId = item.tableId;
                        var viewPri = data[item.menuCode].viewPri;
                        $("#" + iconId).show();
                      }
                    });
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            //根据用户id获取权限列表
            getViewPriByUserId: function (userId) {
               var deferred = $q.defer();
                var url = ConfigService.getHost() + "/sessionAdmin/getViewPriByUserId/" + userId + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //获取按中文拼音首字母排序后的所有用户
            getSortUsers: function () {
               var deferred = $q.defer();
                var url = ConfigService.getHost() + "/userAdmin/sortUsers" + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //更新用户
            updateUser: function (data) {
               var deferred = $q.defer();
                var url = ConfigService.getHost() + "/userAdmin/updateUser" + commonService.getReqParamStr();
                $http({
                    method: 'POST',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: data
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 获取用户详情
            getUserByName: function (userName) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/userAdmin/userByName/" + userName + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    params: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 获取用户权限
            getUserPri: function (userId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/priAdmin/getUserPri/" + userId + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    params: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
        };
        return obj;
    }])


    //App版本更新服务
    .factory('versionUpdateService', ['$http', '$q', 'ConfigService', 'commonService', '$ionicPopup', 'appVersionService', '$cordovaAppVersion','ConfigService', '$ionicLoading', '$cordovaFileTransfer', '$cordovaFileOpener2', '$timeout', function ($http, $q, ConfigService, commonService, $ionicPopup, appVersionService, $cordovaAppVersion, ConfigService, $ionicLoading, $cordovaFileTransfer, $cordovaFileOpener2, $timeout) {
        return {
            checkAppUpdate: function (isBeginOpen) {
                // 检查更新
                var currentVersion = "";
                $cordovaAppVersion.getVersionNumber().then(function (version) {
                    currentVersion = version;
                });
                var system = "";
                if (device.platform === "Android") {
                    system = "android";
                } else {
                    system = "ios";
                }

                appVersionService.getAppVersionByType(system).then(function (data){
                    var serverAppVersion = data.version;//服务器 版本
                    var content = data.content;
                    //console.log("====>>服务器"+serverAppVersion);
                    //alert("服务器版本号：" + serverAppVersion);
                    //获取版本
                    //如果本地与服务端的APP版本不符合
                    //alert("APP版本号：" + version);
                    if (typeof(serverAppVersion) != "undefined" && currentVersion != serverAppVersion) {
                        var confirmPopup = $ionicPopup.confirm({
                            title: '版本升级，最新版本：V' + serverAppVersion,
                            template: content, //从服务端获取更新的内容
                            cancelText: '取消',
                            okText: '升级'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                if(system === "ios") {
                                    window.open(data.iosAppStoreUrl);
                                } else {
                                    $ionicLoading.show({
                                      template: "已经下载：0%"
                                    });

                                    var url = ConfigService.getHost() + "/app/ssapp.apk";
                                    var targetPath = cordova.file.externalApplicationStorageDirectory + "android-debug.apk";
                                    var trustHosts = true;
                                    var options = {};
                                    $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                                      // 打开下载下来的APP
                                      $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive').then(function () {
                                        // 成功
                                      }, function (err) {
                                        // 错误
                                      });
                                      $ionicLoading.hide();
                                    }, function (err) {
                                      alert('下载失败');
                                      $ionicLoading.hide();
                                    }, function (progress) {
                                      //进度，这里使用文字显示下载百分比
                                      $timeout(function () {
                                        var downloadProgress = (progress.loaded / progress.total) * 100;
                                        $ionicLoading.show({
                                          template: "已经下载：" + Math.floor(downloadProgress) + "%"
                                        });
                                        if (downloadProgress > 99) {
                                          $ionicLoading.hide();
                                        }
                                      });
                                    });
                                }
                            } else {
                                // 取消更新
                            }
                        });
                    }
                    else {
                        if(!isBeginOpen) {
                            $ionicLoading.show({
                                template: "您当前已是最新版本！"
                            });
                            $timeout(function () {
                                $ionicLoading.hide();
                                $ionicActionSheet.hide();
                            }, 2000);
                        }
                    }
                });
            }
        };
    }])

    .service('searchDTOService', function() {
        var projectSearchDTO = {};
        var projectService = {
            set: function (obj) {
                projectSearchDTO =  obj;
            },
            get: function () {
                return projectSearchDTO;
            }
        };
        var pcontactSearchDTO = {};
        var pcontactService = {
            set: function (obj) {
                pcontactSearchDTO =  obj;
            },
            get: function () {
                return pcontactSearchDTO;
            }
        };
        return {
            // 获取项目搜索DTO
            getProjectSearchDTO: function () {
                return projectService;
            },
            // 获取联系人搜索DTO
            getPcontactSearchDTO: function () {
                return pcontactService;
            }
        };
    })

    //IM聊天记录相关持久化服务
    .service('IMChatService', ['$http', '$q', 'SQLite', 'commonService', '$state', function ($http, $q, SQLite, commonService, $state) {
        var operate = {
            //创建交流记录表单
            'createCommunicateTable' : function() {
                var deferred = $q.defer();
                var query = "CREATE TABLE IF NOT EXISTS ss_communicate (" +
                            "id integer primary key," + //主键
                            "userId text," + //对应用户的交流会话记录
                            "targetId text," + //交流会话的目标id
                            "targetType text," + //交流会话的目标类型
                            "fromUserId text," + //最后一条消息的发送人
                            "content text," + //最后一条消息的文本信息
                            "msgType text," + //最后一条消息的类型
                            "createdate text," + //最后一条消息的时间
                            "position integer," + //会话的位置
                            "noReadMsgCount integer)";//会话未查看消息数

                var params = [];

                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                }, function(result) {
                    //alert(angular.toJson(result));
                });
                return deferred.promise;
            },
            //选择用户当前的交流会话列表。
            'selectCommunicateByUser' : function(userId) {
                var deferred = $q.defer();
                var query = "select * from ss_communicate where userId = ?" +
                            "order by position desc, datetime(createdate) desc";
                var params = [userId];
                // SQLite.select(query, params).then(function(result) {
                //     deferred.resolve(result);
                // }, function (error) {
                //     deferred.reject(error);
                // });
                return deferred.promise;
            },
            //选择用户与目标的交流会话。
            'selectByUserAndTarget' : function(userId, targetId, targetType) {
                var deferred = $q.defer();
                var query = "select * from ss_communicate " +
                            "where userId=? and targetId=? and targetType=?";
                var params = [userId, targetId, targetType];
                SQLite.select(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            //新增交流记录
            'insertCommunicate' : function(curUserId, fromUserId, targetId, msgObj) {
                var deferred = $q.defer();
                var query = "insert into ss_communicate (userId, targetId, targetType, fromUserId, content, msgType, createdate, position, noReadMsgCount) " +
                            "values (?,?,?,?,?,?,?,?,?)";
                var params;
                //若是发送的消息，或者是正处于消息展示聊天页面。则无需更新角标数据。
                if(curUserId === fromUserId ||
                    ($state.current.name === "messageDetail" && $state.params.targetId === targetId+"" && $state.params.targetType === msgObj.targetType)) {
                    params = [curUserId, targetId, msgObj.targetType, fromUserId, msgObj.content, msgObj.msgType, msgObj.createdate, 0, 0];
                } else {
                    params = [curUserId, targetId, msgObj.targetType, fromUserId, msgObj.content, msgObj.msgType, msgObj.createdate, 0, 1];
                }

                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //置顶或取消置顶交流记录
            'updateCommunicateIndex' : function(curUserId, targetId, targetType, position) {
                var deferred = $q.defer();
                var query = "update ss_communicate set position=? " +
                            "where userId=? and targetId=? and targetType=?";
                var params = [position, curUserId, targetId, targetType];
                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //更新交流记录
            'updateCommunicate' : function(curUserId, fromUserId, targetId, msgObj, noNeedUpdateRead) {
                var deferred = $q.defer();
                var query = "";
                //若是发送的消息，或者是无需更新角标的数据，或者是正处于消息展示聊天页面。则无需更新角标数据。
                if(curUserId === fromUserId || noNeedUpdateRead ||
                    ($state.current.name === "messageDetail" && $state.params.targetId === targetId+"" && $state.params.targetType === msgObj.targetType)) {
                    query = "update ss_communicate set content=?, msgType=?, createdate=?, fromUserId=? " +
                            "where userId=? and targetId=? and targetType=?";
                } else {
                    query = "update ss_communicate set content=?, msgType=?, createdate=?, fromUserId=?, noReadMsgCount=noReadMsgCount+1 " +
                            "where userId=? and targetId=? and targetType=?";
                }
                var params = [msgObj.content, msgObj.msgType, msgObj.createdate, fromUserId, curUserId, targetId, msgObj.targetType];
                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //更新交流记录，设置未读个数为0
            'readCommunicate' : function(curUserId, targetId, targetType) {
                var deferred = $q.defer();
                var query = "update ss_communicate set noReadMsgCount=0 " +
                            "where userId=? and targetId=? and targetType=?";
                var params = [curUserId, targetId, targetType];
                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //删除交流记录
            'deleteCommunicate' : function(userId, targetId, targetType) {
                var deferred = $q.defer();
                var query = "delete from ss_communicate where userId=? and targetId=? and targetType=?";
                var params = [userId, targetId, targetType];
                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                }, function(result) {
                    deferred.reject(result);
                });
                return deferred.promise;
            },
            //根据历史消息记录更新与targetId, targetType的交流列表
            updateCommunicateByHistory : function(curUserId, targetId, targetType) {
                var deferred = $q.defer();
                 var query, params;
                if(targetType === "user") {
                    query = "select * from ss_message where (fromUserId=? and targetId=? and targetType=?) or (fromUserId=? and targetId=? and targetType=?)" +
                            "order by datetime(createdate) desc limit 0,1";
                    params = [curUserId, targetId, targetType, targetId, curUserId, targetType];
                } else if(targetType === "group") {
                    query = "select * from ss_message where targetId=? and targetType=?" +
                            "order by datetime(createdate) desc limit 0,1";
                    params = [targetId, targetType];
                }

                SQLite.select(query, params).then(function(result) {
                    if(result.length === 0) {
                        //若没有数据，则执行删除交流
                        operate.deleteCommunicate(curUserId, targetId, targetType);
                    } else {
                        //若有数据，则执行更新交流
                        operate.updateCommunicate(curUserId, result[0].fromUserId, targetId, result[0], true);
                    }
                    deferred.resolve(result);
                });
                return deferred.promise;
            },

            'createMsgTable' : function() {
                var deferred = $q.defer();
                /*SQLite.execute('DROP TABLE IF EXISTS ss_message',[]).then(function (result) {
                    alert("drop " + angular.toJson(result));
                });*/
                var query = "CREATE TABLE IF NOT EXISTS ss_message (" +
                            "id integer primary key," +
                            "fromUserId text," + //消息发起人
                            "targetId text," + //消息目标对象的ID，用户ID/群组ID
                            "targetType text," + //消息目标的类型，用户/群组
                            "content text," + //消息内容
                            "msgType text," + //消息类型
                            "resourceUrl text," + //静态资源url
                            "localResourcePath text," + //本地资源url
                            "state integer," + //状态值
                            "createdate text)";//消息创建时间
                var params = [];

                // SQLite.execute(query, params).then(function(result) {
                //     deferred.resolve(result);
                // });
                return deferred.promise;
            },
            //选择（与用户）
            'selectMsgsWithUserLazy' : function(lasttime, lastId, myUserId, withUserId, size) {
                var deferred = $q.defer();
                var query = "";
                if(lasttime === null && lastId === null) {
                    query = "select t.* from " +
                                "(select * from ss_message where ((fromUserId=? and targetId=? and targetType=?) or (fromUserId=? and targetId=? and targetType=?))" +
                                " order by datetime(createdate) desc, id desc" +
                                " limit " + size + ") t" +
                            " order by datetime(t.createdate) asc, t.id asc";
                } else {
                    query = "select t.* from " +
                                "(select * from ss_message where ((fromUserId=? and targetId=? and targetType=?) or (fromUserId=? and targetId=? and targetType=?))" +
                                " and datetime(createdate) <= datetime('" + lasttime + "') and id < " + lastId +
                                " order by datetime(createdate) desc, id desc" +
                                " limit " + size + ") t" +
                            " order by datetime(t.createdate) asc, t.id asc";
                }

                var params = [myUserId, withUserId, "user", withUserId, myUserId, "user"];
                SQLite.select(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            //选择（与群组）
            'selectMsgsWithGroupLazy' : function(lasttime, lastId, withGroupId, size) {
                var deferred = $q.defer();
                var query = "";
                if(lasttime === null && lastId === null) {
                    query = "select t.* from " +
                                "(select * from ss_message where targetId=? and targetType=?" +
                                " order by datetime(createdate) desc, id desc" +
                                " limit " + size + ") t" +
                            " order by datetime(t.createdate) asc, t.id asc";
                } else {
                    query = "select t.* from " +
                                "(select * from ss_message where targetId=? and targetType=?" +
                                " and datetime(createdate) <= datetime('" + lasttime + "') and id < " + lastId +
                                " order by datetime(createdate) desc, id desc" +
                                " limit " + size + ") t" +
                            " order by datetime(t.createdate) asc, t.id asc";
                }

                var params = [withGroupId, "group"];
                SQLite.select(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            //选择（与用户）
            'selectMsgsWithUser' : function(myUserId, withUserId) {
                var deferred = $q.defer();
                var query = "select * from ss_message where (fromUserId=? and targetId=? and targetType=?) or (fromUserId=? and targetId=? and targetType=?)" +
                            "order by datetime(createdate) asc";
                var params = [myUserId, withUserId, "user", withUserId, myUserId, "user"];
                SQLite.select(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            //选择（与群组）
            'selectMsgsWithGroup' : function(withGroupId) {
                var deferred = $q.defer();
                var query = "select * from ss_message where targetId=? and targetType=?" +
                            "order by datetime(createdate) asc";
                var params = [withGroupId, "group"];
                SQLite.select(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            //新增（与用户或群组）
            'insertMsg' : function(msgObj) {
                var deferred = $q.defer();
                var query = "insert into ss_message (id, fromUserId, targetId, targetType, content, msgType, resourceUrl, localResourcePath, state, createdate) " +
                            "values (?,?,?,?,?,?,?,?,?,?)";
                var params = [msgObj.msgId, msgObj.fromUserId, msgObj.targetId, msgObj.targetType, msgObj.content, msgObj.msgType, msgObj.resourceUrl, msgObj.localResourcePath, 0, msgObj.createdate];
                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            //更新（与用户）
            'updateMsgsWithUser' : function(myUserId, withUserId) {
                var deferred = $q.defer();
                var query = "update ss_message set state=1 where (fromUserId=? and targetId=? and targetType=?) or (fromUserId=? and targetId=? and targetType=?)";
                var params = [myUserId, withUserId, "user", withUserId, myUserId, "user"];
                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            //更新（与群组）
            'updateMsgsWithGroup' : function(withGroupId) {
                var deferred = $q.defer();
                var query = "update ss_message set state=1 where targetId=? and targetType=?";
                var params = [withGroupId, "group"];
                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            //删除（与用户）
            'deleteMsgsWithUser' : function(myUserId, withUserId) {
                var deferred = $q.defer();
                var query = "delete from ss_message where (fromUserId=? and targetId=? and targetType=?) or (fromUserId=? and targetId=? and targetType=?)";
                var params = [myUserId, withUserId, "user", withUserId, myUserId, "user"];
                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            //删除（与群组）
            'deleteMsgsWithGroup' : function(withGroupId) {
                var deferred = $q.defer();
                var query = "delete from ss_message where targetId=? and targetType=?";
                var params = [withGroupId, "group"];
                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            //删除对应id的某一条消息
            'deleteMsgById' : function(id) {
                var deferred = $q.defer();
                var query = "delete from ss_message where id=?";
                var params = [id];
                SQLite.execute(query, params).then(function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },

            // 根据userId和lastFileCreatedate获取当前是否需要同步：返回true或false，以及该用户的最后一个fileCreatedate的值。
            needSynchro: function (uid, lastFileCreatedate) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/jMsgSynchroAdmin/needSynchro/" + uid + "," + lastFileCreatedate + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 客户端提交需要增量同步的数据data，对消息表进行批量增加，
            // 同时在同步记录表中增加一条同步信息（fileCreatedate是同步数据中的最后一个createdate）。
            addJMessages: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/jMessageAdmin/addJMessages" + commonService.getReqParamStr();
                $http({
                    method: 'POST',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: data
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 从服务器获取需要更新的数据，加入本地数据库sqlite中。
            getNeedSynchroData: function (uid, lastFileCreatedate) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/jMessageAdmin/getNeedSynchroData/" + uid + "," + lastFileCreatedate + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
        };
        return operate;
    }])

    .factory('httpInterceptor', ['$q', 'ToastService', '$rootScope', function($q, ToastService, $rootScope) {
        //var pathArr = ["templates/tabs.html","templates/workCircle/tab-gzq.html"];
        var requestInterceptor = {
            'response' : function(response) {
                /*if(response.config.headers.Accept === "text/html" && pathArr.indexOf(response.config.url) != -1) {
                    $rootScope.$broadcast('loading:hide');
                }*/
                return response;
            },
            'request' : function(config) {
                var networkState = navigator.connection.type;
                if (networkState === Connection.NONE) {
                    ToastService.showShortBottom("当前网络未连接，请检查网络后再试！");
                    //return $q.reject(config);
                    //return config;
                }
                /*if(config.headers.Accept === "text/html" && pathArr.indexOf(config.url) != -1) {
                    $rootScope.$broadcast('loading:show');
                }*/

                return config;
            }
        };
        return requestInterceptor;
    }])


    .factory('SQLite', ['$q', function($q) {
        //var pathArr = ["templates/tabs.html","templates/workCircle/tab-gzq.html"];
        var db = null;

        var operate = {
            'init' : function() {
                //db = window.sqlitePlugin.openDatabase({name: 'ssapp.db', location: 'default'});
            },
            'close' : function() {
                // db.close(function () {
                //     alert("DB closed!");
                // }, function (error) {
                //     alert("Error closing DB:" + error.message);
                // });
            },
            'select' : function(query, params) {
                var deferred = $q.defer();
                //db.executeSql(query, params, function(result) {
                //     var results = [];
                //     for(var i = 0; i < result.rows.length; i++) {
                //         //alert("result-> " + angular.toJson(result.rows.item(i)));
                //         results.push(result.rows.item(i));
                //     }
                //     deferred.resolve(results);
                // }, function(error) {
                //     deferred.reject(error);
                // });
                // return deferred.promise;
            },
            'execute' : function(query, params) {
                var deferred = $q.defer();
                // db.executeSql(query, params, function(result) {
                //     deferred.resolve(result);
                // }, function(error) {
                //     deferred.reject(error);
                // });
                // return deferred.promise;
            },
        };
        return operate;
    }])

    /*.config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptor');
    }])*/

    .factory('Push', function($state,localStorageService) {
      var push;
      return {
        setBadge: function(badge) {
          if (push) {
            plugins.jPushPlugin.setBadge(badge);
          }
        },
        setAlias: function(alias) {
          if (push) {
            plugins.jPushPlugin.setAlias(alias);
          }
        },
        check: function() {
          if (window.jpush && push) {
            plugins.jPushPlugin.receiveNotificationIniOSCallback(window.jpush);
            window.jpush = null;
          }
        },
        init: function(notificationCallback) {
          push = window.plugins && window.plugins.jPushPlugin;
          if (push) {
            try {
              //启动极光推送服务
              window.plugins.jPushPlugin.init();
              window.plugins.jPushPlugin.getRegistrationID(function(data) {
                if(data.length === 0) {
                    $timeout(function () {
                        window.plugins.jPushPlugin.getRegistrationID(function(data) {
                            localStorageService.set('registrationId', data);
                        });
                    }, 1000);
                }
                try {
                  localStorageService.set('registrationId', data);
                } catch (exception) {
                  console.log(exception);
                }
              });
              if (device.platform != "Android") {
                window.plugins.jPushPlugin.setDebugModeFromIos();
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
              } else {
                //设置调试模式
                window.plugins.jPushPlugin.setDebugMode(true);
                window.plugins.jPushPlugin.setStatisticsOpen(true);
              }
            } catch (exception) {
              console.log(exception);
            }
          }
        },
        onTagsWithAlias: function(event) {
          try {
            var result = "result code:" + event.resultCode + " ";
            result += "tags:" + event.tags + " ";
            result += "alias:" + event.alias + " ";
            $("#tagAliasResult").html(result);
          } catch (exception) {
            console.log(exception);
          }
        },
        onOpenNotification: function(event) {
          try {
            var alertContent;
            if (device.platform === "Android") {
              alertContent = event.alert;
            } else {
              alertContent = event.aps.alert;
            }

            //判断是否是即时通讯的本地通知
            if(typeof(event.extras.targetId) != "undefined" && typeof(event.extras.targetType) != "undefined") {
                $state.go("messageDetail", {targetId: event.extras.targetId, targetType: event.extras.targetType});
                return;
            }

            if(event.extras.category === "dReportMsg") {
              $state.go('tab.daily');
            } else if (event.extras.category === "wReportMsg") {
              $state.go('tab.weekly');
            } else if (event.extras.category === "mReportMsg") {
              $state.go('tab.monthly');
            } else {
              $state.go('system-message', {category: event.extras.category});
            }
          } catch (exception) {
            console.log("JPushPlugin:onOpenNotification" + exception);
          }
        },
        onReceiveNotification: function(event) {
          try {
            var alertContent;
            if (device.platform === "Android") {
              alertContent = event.alert;
            } else {
              alertContent = event.aps.alert;
            }
            $("#notificationResult").html(alertContent);
          } catch (exception) {
            console.log(exception);
          }
        },
        onReceiveMessage: function(event) {
          try {
            var message;
            if (device.platform === "Android") {
              message = event.message;
            } else {
              message = event.content;
            }

            var speakoutStr = "";
            if(event.extras.category === "dReportMsg") {
              speakoutStr = "亲，您今天还没有填写日报！请按时填写！";
            } else if (event.extras.category === "wReportMsg") {
              speakoutStr = "亲，您本周还没有填写周报！请按时填写！";
            } else if (event.extras.category === "mReportMsg") {
              speakoutStr = "亲，您本月还没有填写月报！请按时填写！";
            } else {
              speakoutStr = "亲，您有新消息了！";
            }
            /*if (window.plugins.BdVoice) {
              window.plugins.BdVoice.speakout(speakoutStr, function (success) {

              }, function (fail) {

              });
            }*/
            $("#messageResult").html(message);
          } catch (exception) {
            console.log("JPushPlugin:onReceiveMessage-->" + exception);
          }
        }
      };
    })

    // 消息

.factory('localStorageServiceB', [function() {
        return {
            get: function localStorageServiceGet(key, defaultValue) {
                var stored = localStorage.getItem(key);
                try {
                    stored = angular.fromJson(stored);
                } catch (error) {
                    stored = null;
                }
                if (defaultValue && stored === null) {
                    stored = defaultValue;
                }
                return stored;
            },
            update: function localStorageServiceUpdate(key, value) {
                if (value) {
                    localStorage.setItem(key, angular.toJson(value));
                }
            },
            clear: function localStorageServiceClear(key) {
                localStorage.removeItem(key);
            }
        };
    }])
    .factory('dateService', [function() {
        return {
            handleMessageDate: function(messages) {
                var i = 0,
                    length = 0,
                    messageDate = {},
                    nowDate = {},
                    weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                    diffWeekValue = 0;
                if (messages) {
                    nowDate = this.getNowDate();
                    length = messages.length;
                    for (i = 0; i < length; i++) {
                        messageDate = this.getMessageDate(messages[i]);
                        if(!messageDate){
                            return null;
                        }
                        if (nowDate.year - messageDate.year > 0) {
                            messages[i].lastMessage.time = messageDate.year + "";
                            continue;
                        }
                        if (nowDate.month - messageDate.month >= 0 ||
                            nowDate.day - messageDate.day > nowDate.week) {
                            messages[i].lastMessage.time = messageDate.month +
                                "月" + messageDate.day + "日";
                            continue;
                        }
                        if (nowDate.day - messageDate.day <= nowDate.week &&
                            nowDate.day - messageDate.day > 1) {
                            diffWeekValue = nowDate.week - (nowDate.day - messageDate.day);
                            messages[i].lastMessage.time = weekArray[diffWeekValue];
                            continue;
                        }
                        if (nowDate.day - messageDate.day === 1) {
                            messages[i].lastMessage.time = "昨天";
                            continue;
                        }
                        if (nowDate.day - messageDate.day === 0) {
                            messages[i].lastMessage.time = messageDate.hour + ":" + messageDate.minute;
                            continue;
                        }
                    }
                    // console.log(messages);
                    // return messages;
                } else {
                    console.log("messages is null");
                    return null;
                }

            },
            getNowDate: function() {
                var nowDate = {};
                var date = new Date();
                nowDate.year = date.getFullYear();
                nowDate.month = date.getMonth();
                nowDate.day = date.getDate();
                nowDate.week = date.getDay();
                nowDate.hour = date.getHours();
                nowDate.minute = date.getMinutes();
                nowDate.second = date.getSeconds();
                return nowDate;
            },
            getMessageDate: function(message) {
                var messageDate = {};
                var messageTime = "";
                //2015-10-12 15:34:55
                var reg = /(^\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/g;
                var result = new Array();
                if (message) {
                    messageTime = message.lastMessage.originalTime;
                    result = reg.exec(messageTime);
                    if (!result) {
                        console.log("result is null");
                        return null;
                    }
                    messageDate.year = parseInt(result[1]);
                    messageDate.month = parseInt(result[2]);
                    messageDate.day = parseInt(result[3]);
                    messageDate.hour = parseInt(result[4]);
                    messageDate.minute = parseInt(result[5]);
                    messageDate.second = parseInt(result[6]);
                    // console.log(messageDate);
                    return messageDate;
                } else {
                    console.log("message is null");
                    return null;
                }
            }
        };
    }])
    .factory('messageService', ['localStorageServiceB', 'dateService',
        function(localStorageServiceB, dateService) {
            return {
                init: function(messages) {
                    var i = 0;
                    var length = 0;
                    var messageID = new Array();
                    var date = null;
                    var messageDate = null;
                    if (messages) {
                        length = messages.length;
                        for (; i < length; i++) {
                            messageDate = dateService.getMessageDate(messages[i]);
                            if(!messageDate){
                                return null;
                            }
                            date = new Date(messageDate.year, messageDate.month,
                                messageDate.day, messageDate.hour, messageDate.minute,
                                messageDate.second);
                            messages[i].lastMessage.timeFrome1970 = date.getTime();
                            messageID[i] = {
                                id: messages[i].id
                            };

                        }
                        localStorageServiceB.update("messageID", messageID);
                        for (i = 0; i < length; i++) {
                            localStorageServiceB.update("message_" + messages[i].id, messages[i]);
                        }
                    }
                },
                getAllMessages: function() {
                    var messages = new Array();
                    var i = 0;
                    var messageID = localStorageServiceB.get("messageID");
                    var length = 0;
                    var message = null;
                    if (messageID) {
                        length = messageID.length;

                        for (; i < length; i++) {
                            message = localStorageServiceB.get("message_" + messageID[i].id);
                            if(message){
                                messages.push(message);
                            }
                        }
                        dateService.handleMessageDate(messages);
                        return messages;
                    }
                    return null;

                },
                getMessageById: function(id){
                    return localStorageServiceB.get("message_" + id);
                },
                getAmountMessageById: function(num, id){
                    var messages = [];
                    var message = localStorageServiceB.get("message_" + id).message;
                    var length = 0;
                    if(num < 0 || !message) return;
                    length = message.length;
                    if(num < length){
                        messages = message.splice(length - num, length);
                        return messages;
                    }else{
                        return message;
                    }
                },
                updateMessage: function(message) {
                    var id = 0;
                    if (message) {
                        id = message.id;
                        localStorageServiceB.update("message_" + id, message);
                    }
                },
                deleteMessageId: function(id){
                    var messageId = localStorageServiceB.get("messageID");
                    var length = 0;
                    var i = 0;
                    if(!messageId){
                        return null;
                    }
                    length = messageId.length;
                    for(; i < length; i++){
                        if(messageId[i].id === id){
                            messageId.splice(i, 1);
                            break;
                        }
                    }
                    localStorageServiceB.update("messageID", messageId);
                },
                clearMessage: function(message) {
                    var id = 0;
                    if (message) {
                        id = message.id;
                        localStorageServiceB.clear("message_" + id);
                    }
                }
            };
        }
    ]);
