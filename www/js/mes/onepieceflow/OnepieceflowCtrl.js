angular.module('ssapp.controllers')

.controller('BtCtrl', function($scope, $state, $stateParams, commonService, $ionicLoading, vofService) {
  $("#loading").show();
  commonService.showLoading();
  $("ion-content").show();
  $("#chartPage").hide();
  $scope.$on($state.current.name + "-init", function() {
  //$(function () {  
    //var userId = localStorageService.get('User').userId;
    //取页面传过来的producemBillno参数
    var producemBillno = $stateParams.producemBillno;
    //获取单件流详情
    //$scope.vofData = {};
    vofService.getVofData(producemBillno).then(function (vofData) {
      //道次数
      $scope.processCount = vofData.processCount;
      //总生产耗时
      $scope.totalRealTime = parseFloat((vofData.totalRealTime/60).toFixed(1));

      //总转工序耗时
      $scope.totalTimeOut = parseFloat((vofData.totalTimeOut/60).toFixed(1));
  	  //总耗时
  	  $scope.totalTime = parseFloat(($scope.totalRealTime + $scope.totalTimeOut).toFixed(1));
      //构建HighChart
      var colors = Highcharts.getOptions().colors,
      categories = ['生产耗时:' + $scope.totalRealTime + '小时', '转料耗时:' + $scope.totalTimeOut + '小时'],
      name = 'Browser brands',
      data = [{
              y: $scope.totalRealTime,
              color: colors[9],
              drilldown: {
                  name: 'MSIE versions',
                  categories: ['总共耗时'],
                  data: [$scope.totalTime],
                  color: colors[9]
              }
          },{
              y: $scope.totalTimeOut,
              color: colors[2],
              drilldown: {
                  name: 'Opera versions',
                  categories: [],
                  data: [],
                  color: colors[2]
              }
          }];
      var browserData = [];
      var versionsData = [];
      for (var i = 0; i < data.length; i++) {
          browserData.push({
              name: categories[i],
              y: data[i].y,
              color: data[i].color
          });
          for (var j = 0; j < data[i].drilldown.data.length; j++) {
              var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
              versionsData.push({
                  name: data[i].drilldown.categories[j],
                  y: data[i].drilldown.data[j],
                  color: Highcharts.Color(data[i].color).brighten(brightness).get()
              });
          }
      }
      var textStr = "";
      if(device.platform != "Android") {
        var proBStrArray = producemBillno.split("-");
        for(var i=0; i<proBStrArray.length; i++) {
            textStr = textStr + proBStrArray[i] + "一";
        }
        textStr = textStr.substring(0, textStr.length-1);
      } else {
        textStr = producemBillno;
      }
      $('#container').highcharts({
          chart: {
              type: 'pie'
          },
          title: {
              text: '生产框号：' + textStr
          },
          plotOptions: {
              pie: {
                  shadow: false,
                  center: ['50%', '50%']
              }
          },
          tooltip: {
              valueSuffix: '小时'
          },
          series: [{
              name: '时间',
              data: browserData,
              size: '80%',
              dataLabels: {
                  formatter: function() {
                      return this.y > 5 ? this.point.name : null;
                  },
                  color: 'black',
                  distance: -80
              }
          }, {
              name: '时间',
              data: versionsData,
              size: '90%',
              innerSize: '80%',
              dataLabels: {
                  formatter: function() {
                      // display only if larger than 1
                      return this.y > 1 ? '<b>'+ this.point.name +':</b> '+ this.y +'小时'  : null;
                  }
              }
          }]
      });
      //$("#chartPage").show();
      $("#loading").hide();
      $("#chartPage").show();
      commonService.hideLoading();
    });
  });        
})

//单件流详情
.controller('vofDetailCtrl', function($scope, $state, $window, $state, $stateParams, commonService, $ionicLoading, localStorageService, vofService) {
  $("#loading").show();
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
		//加载远程数据
		//var userId = localStorageService.get('User').userId;
	  //取页面传过来的producemBillno参数
	  var producemBillno = $stateParams.producemBillno;
	  //获取单件流详情
	  $scope.vofDetails = {};

	  vofService.getVofDetail(producemBillno).then(function (data) {
		//$scope.customerLength = data.length;
		$scope.vofDetails = data;
		$("#loading").hide();
		commonService.hideLoading();
		//$scope.typemodel.unshift({id:1,typeName:'全部'});
	  });

	  $scope.getState = function(data) {
		var date = data.producemEnddate + " 23:59:59";
		if(data.producemStarttime === null || data.producemStarttime === "") {
		  return 1;
		} else if(data.producemEndtime === null || data.producemEndtime === "") {
		  return 2;
		} else if(data.producemEndtime <= date) {
		  return 3;
		} 
		// else if(data.producemEndtime > date) {
		//   return 4;
		// } 
		else {
		  return 5;
		}
	  };
	  //根据分钟数获得处理得到的时间字符串（*时*分）
	  $scope.getTimeFromMins = function(mins) {
		var hour = Math.floor(mins/60);
		var min = mins-hour*60;
		var timeStr = hour + "时" + min + "分";
		return timeStr;
	  };
	  //循环轮数
	  var num = 0;
	  $scope.initCircle = function(index,state) {
		if(num != 0) {
		  if(state === 1) {
			init('bg' + (index+1),"img/scz.png");
		  } else if(state === 2) {
			init('bg' + (index+1),"img/scz.png");
		  } else if(state === 3) {
			init('bg' + (index+1),"img/ywc.png");
		  } else if(state === 4) {
			init('bg' + (index+1),"img/ywc.png");
		  }
		}
		if(index === $scope.vofDetails.length-1) {
		  //alert(num + "-" + index);
		  num++;
		}
		return false;
	  };

	  $scope.viewChart = function() {
		//跳转页面并传参
		$state.go('tab.djl-sjtj', {producemBillno: producemBillno});
	  };

	  var  paper =  null;
	  function init(b, imgUrl){
		  //初始化Raphael画布 
		  this.paper = Raphael(b, 44, 44);  
		  //把底图先画上去 
		  this.paper.image(imgUrl, 0, 0, 44, 44);  
	  }
  });
  
  //commonService.loading();
  
 
})

//单件流
.controller('vofCtrl', function($scope, $state, $window, $timeout, $state, commonService, localStorageService, vofService, $ionicSideMenuDelegate) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
	  //加载远程数据
	  //单件流列表初始化
	  var allData;
	  var curData;
	  
	  //取全部数据
	  vofService.getVofs().then(function (data) {
		  allData = data;
		  curData = allData;
	  });

	  $scope.getData = function () {
		if(curData != null) {
		  var data = curData.slice((vm.pagination.currentPage-1)*vm.pagination.perPage, vm.pagination.currentPage*vm.pagination.perPage);
		  vm.messages = vm.messages.concat(data);
		  $("#loading").hide();
		  commonService.hideLoading();
		  $(".top_header_All").hide();
		  vm.finishInit = true;
		  if (data.length === 0) {vm.moredata = true;}
		  //成功2秒后广播
		  $timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.pageNo ++;
		  }, 2000);
		} else {
		  vofService.getVofsByPageNoAndSize(vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
		  	if(typeof(data) === "object") {
		  		vm.messages = vm.messages.concat(data);
		  	}
			
			$("#loading").hide();
			commonService.hideLoading();
			vm.finishInit = true;
			$(".top_header_All").hide();
			if (data.length === 0) {vm.moredata = true;}
			//成功2秒后广播
			$timeout(function() {
			  $scope.$broadcast('scroll.infiniteScrollComplete');
			  $scope.pageNo ++;
			}, 2000);
		  });
		}
	  };

	  var vm = $scope.vm = {
		moredata: false,
		messages: [],
		finishInit: false,
		pagination: {
		  currentPage: 1,
		  perPage: 20
		},
		init: function () {
		  vm.finishInit = false;
		  vm.moredata = false;
		  vm.messages = [];
		  vm.pagination.currentPage = 1;
		  $scope.getData();
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
			$scope.$broadcast('scroll.refreshComplete');
		  }, 1000);
		},
		hasMoreDate: function () {
		  if(vm.moredata) {
			return false;
		  } return true;
		},
		loadMore: function () {
		  $("#loading").show();
		  if(vm.finishInit) {
			vm.pagination.currentPage += 1;
			$scope.getData();
		  }
		},
	  };
	  vm.init();

	  //当点击搜索时调用
	  $scope.searchManager = function(isInit) {
		$scope.producemBillno = $("#producemBillno").val();
		$scope.contractno = $("#contractno").val();
		$scope.totalWeight = 0;
		$scope.totalQuantity = 0;
		curData = [];
		$.each(allData, function(index, item) {
		  //判断工序、框号、合同号和超期都为所选或所填项时，往curData里添加数据。
		  if(item.producemBillno.indexOf($scope.producemBillno) != -1 && item.contractno.indexOf($scope.contractno) != -1) {
			curData.push(item);
			$scope.totalWeight = $scope.totalWeight + item.producemWeight;
			$scope.totalQuantity = $scope.totalQuantity + item.producemNumber;
		  }
		});
		$scope.totalWeight = parseFloat(($scope.totalWeight/1000).toFixed(2));

		//重新初始化页码和数据
		if(isInit && curData != null) {
		  //alert(vm.messages.length);
		  vm.init();
		  if($ionicSideMenuDelegate.isOpen()) {
			$ionicSideMenuDelegate.toggleRight();
		  }
		}
	  };

	  $scope.contains =  function(str, arr) {
		for(var i=0;i<arr.length;i++) {
		  if(str === arr[i]) {
			return 1;
		  }
		}
		return 0;
	  };

	  //添加显示单件流详细信息的处理函数,向下一个页面传参producemBillno
	  $scope.searchDetail = function(data) {
		//$scope.visitDetail = data;
		//跳转页面并传参
		$state.go('tab.djl-xq', {producemBillno: data});
	  };
  });
  
  var tabletr = $('.table-center tr').width();
  if ( tabletr > 800) {
    $scope.firstName = 700;
  }else{
    $scope.firstName = 280;
  }
  
});