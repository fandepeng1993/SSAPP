angular.module('ssapp.controllers')

// 我的订单-统计图
.controller('ddcxSCtrl', function($scope, $state, $timeout, $ionicSideMenuDelegate, $ionicSideMenuDelegate, UserService, commonService, localStorageService, dSchedulesService, UserService){
  var tabletr = $('.table-center tr').width();
  if ( tabletr > 800) {
    $scope.firstName = 700;
  }else{
    $scope.firstName = 280;
  }

  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
	  //$scope.loading = true;
	  $scope.hasData = true;
	  $scope.showData = false;
	  
	  $scope.user = localStorageService.get("User");
	  var curYear = new Date().getFullYear();
	  $scope.years = [curYear-1, curYear, curYear + 1];
	  dropDown('year', '<span class="show-icon">请选择年份</span>');
	  $("#year").on("change", function () {
	  	$scope.changeYear();
	  });

	  var saleDatas = [];
	  var saleGoals = [];
	  var allData = [];

	  var initChart = function (userName, year) {
		dSchedulesService.getSellgoalByUName(userName, year).then(function (data) {
		  $scope.hasData = false;
		  $scope.showData = false;
		  console.log(angular.toJson(data));
		  $scope.monthPlan = 0;
		  $scope.yearPlan = 0;
		  saleGoals = [];
		  if(data.length != 0) {
			$scope.hasData = true;
			$scope.showData = true;
			saleGoals = [data[0].january, data[0].february, data[0].march, data[0].april, data[0].may, data[0].june, data[0].july, data[0].august, data[0].september, data[0].october, data[0].november, data[0].december];
			$scope.monthPlan = saleGoals[new Date().getMonth()];
			$scope.yearPlan = data[0].plangoal;
		  }
		  initChartByUserName(userName, year);
		});
	  };

	  var getData = function (year) {
		//$scope.loading = true;
		allData = [];
		dSchedulesService.getSaleStatistics($scope.user.userId, year).then(function (data) {
		  //console.log($scope.user.userId + "--" + year + "--" + angular.toJson(data));
		  //$scope.loading = false;
		  allData = data;
		  $scope.saleStats = data;
		  $timeout(function () {
			dropDown('userName', '<span class="show-icon">请选择员工姓名</span>');
			//$("#userName").val($scope.user.userName);
			//$scope.userName = $scope.user.userName;
		  },50);
		  initChart($scope.user.userName, year);
		});
	  };
	  //初始化
	  getData(curYear);
	  $timeout(function () {
		$("#year").val(curYear);
		$("#year_dummy").val(curYear);
	  },50);
	  

	  $scope.changeYear = function () {
		var selectedYear = $("#year").val();
		$("#userName").val("");
		getData(selectedYear);
	  };

	  $scope.searchManager = function () {
		var userName = $("#userName").val();
		console.log(userName);
		if(userName != "? undefined:undefined ?" && userName != "") { 
		  //initChartByUserName(userName);
		  initChart(userName, $("#year").val());
		}
		if($ionicSideMenuDelegate.isOpen()) {
		  $ionicSideMenuDelegate.toggleRight();
		}
	  };

	  /*var getUserByName = function (userName) {
		UserService.getUserByName(userName).then(function (data) {
		  $scope.user = data;
		});
	  };*/

	  var initChartByUserName = function (userName, year) {
	  	//获取用户对象，填充头像信息。
	  	UserService.getUserByName(userName).then(function (data) {
	  		$scope.curUser = data;
	  	});

		//getUserByName(userName);
		$scope.monthFinish = 0;
		$scope.yearFinish = 0;
		$.each(allData, function(index, item) {
		  if(item.userName === userName) {
			$scope.hasData = true;
			$scope.showData = true;
			var jan = parseFloat((item.jan/1000).toFixed(2));
			var feb = parseFloat((item.feb/1000).toFixed(2));
			var mar = parseFloat((item.mar/1000).toFixed(2));
			var apr = parseFloat((item.apr/1000).toFixed(2));
			var may = parseFloat((item.may/1000).toFixed(2));
			var jun = parseFloat((item.jun/1000).toFixed(2));
			var jul = parseFloat((item.jul/1000).toFixed(2));
			var aug = parseFloat((item.aug/1000).toFixed(2));
			var sep = parseFloat((item.sep/1000).toFixed(2));
			var oct = parseFloat((item.oct/1000).toFixed(2));
			var nov = parseFloat((item.nov/1000).toFixed(2));
			var dece = parseFloat((item.dece/1000).toFixed(2));
			$scope.yearFinish = jan + feb + mar + apr + may + jun + jul + aug + sep + oct + nov + dece;
			$scope.yearFinish = parseFloat($scope.yearFinish.toFixed(2));
			if(new Date().getMonth() === 0) {
			  $scope.monthFinish = jan;
			} else if(new Date().getMonth() === 1) {
			  $scope.monthFinish = feb;
			} else if(new Date().getMonth() === 2) {
			  $scope.monthFinish = mar;
			} else if(new Date().getMonth() === 3) {
			  $scope.monthFinish = apr;
			} else if(new Date().getMonth() === 4) {
			  $scope.monthFinish = may;
			} else if(new Date().getMonth() === 5) {
			  $scope.monthFinish = jun;
			} else if(new Date().getMonth() === 6) {
			  $scope.monthFinish = jul;
			} else if(new Date().getMonth() === 7) {
			  $scope.monthFinish = aug;
			} else if(new Date().getMonth() === 8) {
			  $scope.monthFinish = sep;
			} else if(new Date().getMonth() === 9) {
			  $scope.monthFinish = oct;
			} else if(new Date().getMonth() === 10) {
			  $scope.monthFinish = nov;
			} else if(new Date().getMonth() === 11) {
			  $scope.monthFinish = dece;
			}
			
			saleDatas = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dece];
		  }
		});

		$('#container').highcharts({
		  chart: {
			inverted: true
		  },
		  title: {
			text: year + '年销售量' + '(' + userName + ')'
		  },
		  subtitle: {
			text: '来源：上上RFID生产管理系统'
		  },
		  xAxis: {
			categories: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
		  },
		  yAxis: {
			title: {
			  text: '吨（t）'
			},
			labels: {
			  formatter: function () {
				return this.value;
			  }
			},
			min: 0
		  },
		  plotOptions: {
			line: {
			  dataLabels: {
				enabled: true,
				format: '{point.y:f} t'
			  }
			}
		  },
		  tooltip: {
			valueSuffix: ' t'
		  },
		  series: [{
			name: '实际销售量',
			data: saleDatas
		  }, {
			name: '计划销售量',
			data: saleGoals
		  }]
		});

		commonService.hideLoading();
		$(".top_header_All").hide();
	  };
  });
})

//订单查询
.controller('dSchedulesCtrl', function($scope, $state, $window, $timeout, localStorageService, UserService, dSchedulesService, $ionicSideMenuDelegate, commonService) {
  var tabletr = $('.table-center tr').width();
  if ( tabletr > 800) {
    $scope.firstName = 700;
  }else{
    $scope.firstName = 280;
  }
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
	  $scope.hasDate = true;
	  $scope.loading = true;
  
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
		
		dSchedulesService.dSchedulesDetailByContractNo(message.dContractno).then(function (data) {
		  var detailHTML = ""
		  //品名、钢种、执行标准、规格、支数、米数、重量、来源类型、订货日期
		  $.each(data, function(index, item) {
			detailHTML = detailHTML + "<tr class=\"detail\"><td colspan=\"6\"><div class=\"content-p\" style=\"line-height:20px;\">" + 
							"<span style=\"font-weight:bold!important\">品名：</span>" + item.dName  + "　 " +
							"<span style=\"font-weight:bold!important\">钢种：</span>" + item.dSteel  + "　 " +
							/*"<span style=\"font-weight:bold!important\">执行标准：</span>" + item.dStandards + */
							"<span style=\"font-weight:bold!important\">规格：</span>" + item.dSpec + "<br />" + 
							"<span style=\"font-weight:bold!important\">支数：</span>" + item.dNumber + "支" + "　 " +
							"<span style=\"font-weight:bold!important\">米数：</span>" + item.dNumbers  + "米" + "　 " +
							"<span style=\"font-weight:bold!important\">重量：</span>" + item.dWeight  + "kg" + "<br />";
			if(item.dSource === "1") {
			  //库存
			  detailHTML = detailHTML + "<span style=\"font-weight:bold!important\">来源类型：</span>A";
			} else if(item.dSource === "2") {
			  //自制
			  detailHTML = detailHTML + "<span style=\"font-weight:bold!important\">来源类型：</span>B";
			} else if(item.dSource === "3") {
			  //外协
			  detailHTML = detailHTML + "<span style=\"font-weight:bold!important\">来源类型：</span>C";
			} else if(item.dSource === "4") {
			  //外购
			  detailHTML = detailHTML + "<span style=\"font-weight:bold!important\">来源类型：</span>D";
			}
			detailHTML = detailHTML + "<span style=\"font-weight:bold!important\">　 订货日期：</span>" + item.orderDate  + 
							"</div></td></tr>";
		  });
		  $("#content tr:eq('"+index+"')").after(detailHTML);
		  $(".content-p").animate({ 
			width: "100%",
			height: "65px", 
			borderWidth: 10
		  }, 300); 
		});
	  };

	  var userName = localStorageService.get("User").userName;
	  var curUserName = userName;
	  var userId = localStorageService.get("User").userId;
	  //按销售量统计的权限获取的用户列表
	  UserService.getUsersByMenuUrl(userId, "manage/saleStatMgr/saleStatMgr.html").then(function (data) {
	    $scope.users = data;
	    dropDown('userName', '<span class="show-icon">切换</span>', '请选择人员');
	    //$("#userName_dummy").val(curUserName);
	  });
	  $("#userName").on("change", function () {
	  	curUserName = $("#userName").val();
	  	curData = null;
	  	vm.init();
	  	getAllData();
	  	if($ionicSideMenuDelegate.isOpen()) {
			$ionicSideMenuDelegate.toggleRight();
	  	}
	  })
	  
	  //成品管理列表初始化
	  //$scope.serviceName = "vwfcService";
	  var allData;
	  var curData;
	  //取全部数据
	  var getAllData = function () {
	  	dSchedulesService.dSchedulesByUName(curUserName).then(function (data) {
			allData = data;
			curData = allData;
			//$scope.initSelect(allData);
			var timeout_return = $timeout(function() {
				  //$scope.searchManager(false);
			} ,40);
		});
	  }

	  $scope.getData = function () {
		if(curData != null) {
			var data = curData.slice((vm.pagination.currentPage-1)*vm.pagination.perPage, vm.pagination.currentPage*vm.pagination.perPage);
			vm.messages = vm.messages.concat(data);
			//$("#loading").hide();
			$scope.loading = false;
			commonService.hideLoading();
			if(vm.messages.length === 0) $scope.hasDate = false;
			else $scope.hasDate = true;
			vm.finishInit = true;
			if (data.length === 0) {vm.moredata = true;}
			//成功2秒后广播
			$timeout(function() {
			  $scope.$broadcast('scroll.infiniteScrollComplete');
			  $scope.pageNo ++;
			}, 2000);
		  } else {
			dSchedulesService.dSchedulesByUNameLazy(curUserName, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
			  if(typeof(data) === "object") {
		  		vm.messages = vm.messages.concat(data);
		  	  }
			  //$("#loading").hide();
			  $scope.loading = false;
			  commonService.hideLoading();
			  $(".top_header_All").hide();
			  if(vm.messages.length === 0) $scope.hasDate = false;
			  else $scope.hasDate = true;
			  vm.finishInit = true;
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
			}, function (error) {  
			});*/ 
			return false;
		  } return true;
		},
		loadMore: function () {
		  //$("#loading").show();
		  $scope.loading = true;
		  if(vm.finishInit) {
			vm.pagination.currentPage += 1;
			$scope.getData();
		  }
		},
	  };

	  vm.init();

	  //当点击搜索时调用
	  $scope.searchManager = function(isInit) {
		$scope.contractno = $("#contractno").val();
		curData = [];
		$.each(allData, function(index, item) {
		  //判断工序、框号、合同号和超期都为所选或所填项时，往curData里添加数据。
		  if(item.dContractno.indexOf($scope.contractno) != -1) {
			curData.push(item);
		  }
		});

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
});