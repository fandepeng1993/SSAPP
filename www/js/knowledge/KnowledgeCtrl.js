angular.module('ssapp.controllers')

// 类别知识库
.controller('categoryKnowledgeCtrl',function($scope, $state, knowLedgeService, ConfigService, localStorageService, commonService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    knowLedgeService.categoryKnowledgesCount().then(function (data) {
      $scope.categoryKnowLedges = data;
      if(data.length === 0 || (data.length === 1 && data[0].key === "")) {
        $(".bsmb").show();
      }
      commonService.hideLoading();
    });

    $scope.viewDetail = function (category) {
      $state.go("tab.xszy", {category: category});
    };
  });
})

// 部门知识库
.controller('deptKnowledgeCtrl',function($scope, $state, knowLedgeService, ConfigService, localStorageService, commonService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    knowLedgeService.deptKnowledgesCount().then(function (data) {
      $scope.deptKnowLedges = data;
      if(data.length === 0 || (data.length === 1 && data[0].key === "")) {
        $(".bsmb").show();
      }
      commonService.hideLoading();
    });

    $scope.viewDetail = function (deptName) {
      $state.go("tab.xszy", {deptName: deptName});
    };
  });
})

// 知识库详情列表
.controller('deptKnowLDetailCtrl',function($scope, $state, $stateParams, commonService, knowLedgeService, ConfigService, localStorageService, $ionicPopup, $cordovaFileTransfer, $ionicLoading, $cordovaFileOpener2) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    var deptName = $stateParams.deptName;
    var category = $stateParams.category;
    $scope.knowLedges = [];
    if(deptName != "") {
      knowLedgeService.knowledgesByDept(deptName).then(function (data) {
        $scope.knowLedges = data;
        commonService.hideLoading();
      });
    } else if(category != "") {
      knowLedgeService.knowledgesByCategory(category).then(function (data) {
        $scope.knowLedges = data;
        commonService.hideLoading();
      });
    }
    
    $scope.selectClass = function (suffix) {
      if(suffix == ".doc" || suffix == ".docx" || suffix == ".html") {
        return "doc";
      } else if(suffix == ".xls" || suffix == ".js" || suffix == ".xml" || suffix == ".sql") {
        return "xls";
      } else {
        return "pdf";
      }
    };

    $scope.downloadFile = function (filePath, fileName) {
      var url = ConfigService.getHost() + filePath.substring(filePath.indexOf("SSAPP") + 5);
      showUpdateConfirm(url, fileName);
    };

    // 显示是否更新对话框
    function showUpdateConfirm(pathUrl, name) {
      var confirmPopup = $ionicPopup.confirm({
        title: '文件下载',
        template: '确认要下载文件' + name + '么？', //从服务端获取更新的内容
        cancelText: '取消',
        okText: '下载'
      });
      confirmPopup.then(function (res) {
        if (res) {
          $ionicLoading.show({
            template: "已经下载：0%"
          });
          //var url = "http://192.168.1.50/1.apk "; //可以从服务端获取更新APP的路径
          //var targetPath = "file:///storage/sdcard0/Download/1.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
          //var url = "http://139.196.242.202:8080/SSAPP/app/android-debug.apk"; 
          var url = ConfigService.getHost() + pathUrl.substring(pathUrl.indexOf("SSAPP") + 5);
          url = url.replace(/\\/g,"/");
          var trustHosts = true;
          var targetPath;
          var options = {};

          if(device.platform == "Android") {
            targetPath = cordova.file.externalApplicationStorageDirectory + "files/" + name;
          } else {
            targetPath = cordova.file.documentsDirectory + new Date().getTime() + "." + name.split(".")[1];
          }
          $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
            $ionicLoading.hide();
            alert("下载完成");
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
          /*targetPath = "file:///mnt/sdcard/Download/" + name;
          var fileTransfer = new FileTransfer();
          fileTransfer.download(
              url,
              targetPath,
              function(entry) {
                  $ionicLoading.hide();
                  alert("下载完成");
              },
              function(error) {
                  alert('下载失败');
                  $ionicLoading.hide();
              },
              true,
              options
          );*/
        } else {
          // 取消更新
        }
      });
    }
  });
});