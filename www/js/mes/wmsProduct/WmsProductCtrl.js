angular.module('ssapp.controllers')

//库存查询
.controller('wmsProductCtrl', function($scope, $state, $stateParams, $rootScope, $window, $timeout, commonService, localStorageService, viewWmsProService, $ionicSideMenuDelegate) {
  var tabletr = $('.table-center tr').width();
  if ( tabletr > 800) {
    $scope.firstName = 700;
  }else{
    $scope.firstName = 280;
  }
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
	  var code = $stateParams.code;
	  $scope.codeName = $stateParams.codeName;
	  // 表格
	  $scope.expandDetail = function(index, message) {
		$("#content tr:eq('"+index+"')").siblings().each(function() {
		  $(this).children("td:eq(0)").children("i").removeClass('ion-chevron-down');
		  $(this).children("td:eq(0)").children("i").addClass('ion-chevron-right');
		  $(this).css('background','#fff');//选中其他背景还原
		  $(this).css('border','0px');
		  $(this).children("td:eq(0)").children("#leftsj").hide();
		});
		$("#content tr[class='detail']").remove();
		$("#content tr:eq('"+index+"') td:eq(0) i").removeClass('ion-chevron-right');
		$("#content tr:eq('"+index+"')").css('background','#f2f2f2');//选中当前背景改变
		$("#content tr:eq('"+index+"') td:eq(0) i").addClass('ion-chevron-down');
		$("#content tr:eq('"+index+"')").css('border-left','5px solid #F7931E');
		$("#content tr:eq('"+index+"') td:eq(0) #leftsj").show();
		
		var detailHTML = "<tr class=\"detail\"><td colspan=\"6\"><div class=\"content-p\" style=\"line-height:30px;\">" + 
						  "<span style=\"font-weight:bold!important\">库存数量：</span>" + message.dQuantity  + "支" + " 　" +
						  "<span style=\"font-weight:bold!important\">库存重量：</span>" + message.dWeight  + "kg" + " 　" +
						  "<span style=\"font-weight:bold!important\">库位编号：</span>" + message.bin  + "　 " + 
						  "</div></td></tr>";
		$("#content tr:eq('"+index+"')").after(detailHTML);
		$(".content-p").animate({ 
		  width: "100%",
		  height: "30px", 
		  borderWidth: 10
		}, 300); 
	  };
	  //定义三个用于显示的下拉菜单Array
	  //定义钢种select选择菜单的数组
	  $scope.steelSelect = [];
	  //定义规格select选择菜单的数组
	  $scope.specSelect = [];
	  //定义库位编号select选择菜单的数组
	  $scope.binSelect = [];

	  var allData = {};
	  //产品库存列表初始化
	  //$scope.serviceName = "wmsProductService";
	  var curData;
	  //取全部数据
	  viewWmsProService.getVWPsByCode(code).then(function (data) {
		allData = data;
		curData = allData;

		$scope.initSelect(allData);
		$scope.steel_Name = "所有";
		$scope.spec_Name = "所有";
		$scope.bin_Name = "所有";
		var timeout_return = $timeout(function() {
			  $scope.searchManager(false);
			} ,40);
	  });

	  $scope.getData = function () {
		if(curData != null) {
		  var data = curData.slice((vm.pagination.currentPage-1)*vm.pagination.perPage, vm.pagination.currentPage*vm.pagination.perPage);
		  vm.messages = vm.messages.concat(data);
		  $("#loading").hide();
		  vm.finishInit = true;
		  commonService.hideLoading();
		  if (data.length === 0) {vm.moredata = true;}
		  //成功2秒后广播
		  $timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.pageNo ++;
		  }, 2000);
		} else {
		  viewWmsProService.getVWPsByCodeLazy(code, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
			if(typeof(data) === "object") {
		  		vm.messages = vm.messages.concat(data);
		  	}
			$("#loading").hide();
			vm.finishInit = true;
			commonService.hideLoading();
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
			//alert(1);
			/*$cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
			  // success  
			}, function (error) {  
			  // error  
			});*/ 
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

	  $scope.initSelect = function(data) {
		  $.each(data, function(index, item) {
		  //初始化钢种select数组
		  if($scope.contains(item.dSteel, $scope.steelSelect) === 0) {
			$scope.steelSelect.push(item.dSteel);
		  }
		  //初始化规格select数组
		  if($scope.contains(item.dSpec, $scope.specSelect) === 0) {
			$scope.specSelect.push(item.dSpec);
		  }
		  //初始化库位编号select数组
		  if($scope.contains(item.bin, $scope.binSelect) === 0) {
			$scope.binSelect.push(item.bin);
		  }
		});
	  };

	  //当点击搜索时调用
	  $scope.searchManager = function(isInit) {
		$scope.dSteel = $("#dSteel").val();
		$scope.dSpec = $("#dSpec").val();
		$scope.bin = $("#bin").val();
		$scope.totalWeight = 0;
		$scope.totalQuantity = 0;
		curData = [];
		$.each(allData, function(index, item) {
		  //判断工序、框号、合同号和超期都为所选或所填项时，往curData里添加数据。
		  if(item.dSteel.indexOf($scope.dSteel) != -1 && item.dSpec.indexOf($scope.dSpec) != -1 && item.bin.indexOf($scope.bin) != -1) {
			curData.push(item);
			$scope.totalWeight = $scope.totalWeight + item.dWeight;
			$scope.totalQuantity = $scope.totalQuantity + item.dQuantity;
		  }
		});
		$scope.totalWeight = parseFloat(($scope.totalWeight/1000).toFixed(2));
		//为统计信息显示而用。
		if($scope.dSteel === "") {$scope.dSteel = "所有";}
		if($scope.dSpec === "") {$scope.dSpec = "所有";}
		if($scope.bin === "") {$scope.bin = "所有";}
		$("#dataStat").show();

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
  });
})

//库存简报
.controller('wmsBriefingCtrl', function($scope, $state, $filter, $timeout, commonService, TimeService, localStorageService, UserService, viewWmsProService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
	  $scope.sellBriefloading = true;
	  $scope.workBriefloading = true;
	  $scope.visitBriefloading = true;
	  dropDown('DateS', '<span class="show-icon">时间</span>', '请选择日期');
	  dropDown('DateK', '<span class="show-icon">时间</span>', '请选择日期');
	  dropDown('DateC', '<span class="show-icon">时间</span>', '请选择日期');
	  //今日
	  var beginDay = TimeService.beginDay();
	  var endDay = TimeService.endDay();
	  //本周
	  var beginWeek = TimeService.beginWeek();
	  var endWeek = TimeService.endWeek();

	  //上周
	  var beginLastWeek = TimeService.beginLastWeek();
	  var endLastWeek = TimeService.endLastWeek();

	  //本月
	  var beginMonth = TimeService.beginMonth();
	  var endMonth = TimeService.endMonth();

	  //上月
	  var beginLastMonth = TimeService.beginLastMonth();
	  var endLastMonth = TimeService.endLastMonth();

	  var curUserId = localStorageService.get("User").userId;
	  var curUserName = localStorageService.get("User").userName;

	  var initBriefing = function (fromdate, enddate) {
		$scope.workBriefloading = true;
		viewWmsProService.statisticWMSProduct(fromdate, enddate).then(function (data) {
		  $scope.wmsBriefings = data;

		  $timeout(function () {
			$.each(data, function(index, item) {
			  eval("$scope." + item.warehouseCode + "Loading = false;");
			  dropDown('Date' + item.warehouseCode, '<span class="show-icon">时间</span>', '请选择日期');
			  bindingDateEvent(item.warehouseCode);
			});
		  }, 50);
		  commonService.hideLoading();
		});
	  }

	  var changeOneBriefing = function (code, fromdate, enddate, dateVal) {
		eval("$scope." + code + "Loading = true;");
		$.each($scope.wmsBriefings, function(index, item) {
		  if(item.warehouseCode === code) {
			viewWmsProService.statisticWMSProByCode(code, fromdate, enddate).then(function (data) {
			  $scope.wmsBriefings.splice(index, 1, data);
			  $timeout(function () {
				eval("$scope." + item.warehouseCode + "Loading = false;");
				dropDown('Date' + item.warehouseCode, '<span class="show-icon">时间</span>', '请选择日期');
				$("#Date" + code + "_dummy").val(dateVal);
				$("#Date" + code).val(dateVal);
				bindingDateEvent(item.warehouseCode);
			  }, 50);
			  return;
			});
		  }
		});
	  }

	  initBriefing(beginDay, endDay);

	  $scope.formatValue = function (value) {
	    if(typeof(value) != "undefined") {
	      if(value > 1000) {
	        return (value/1000).toFixed(2) + "t";
	      }
	      return value + "kg";
	    } else {
	      return "";
	    }
	  }
	  //对时间下拉菜单绑定事件
	  var bindingDateEvent = function (code) {
		$("#Date" + code).on("change", function() {
		  if($("#Date" + code).val() === "今日") {
			changeOneBriefing(code, beginDay, endDay, "今日");
		  } else if($("#Date" + code).val() === "本周") {
			changeOneBriefing(code, beginWeek, endWeek, "本周");
		  } else if($("#Date" + code).val() === "本月") {
			changeOneBriefing(code, beginMonth, endMonth, "本月");
		  }
		});
	  }

	  $scope.viewDetail = function (code, codeName) {
		$state.go("cpkc", {code:code, codeName:codeName});
	  };
  });
});