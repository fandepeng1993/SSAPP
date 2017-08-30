angular.module('ssapp.controllers')

//生产台账
.controller('vprCtrl', function($scope, $state, $rootScope, $window, $timeout, $filter, commonService, localStorageService, vprService, $ionicSideMenuDelegate, hrEmpService) {
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
	  dropDown('dEnd', '<span class="show-icon">请选择薪资类型</span>', '请选择薪资类型');
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
		
		var detailHTML = "<tr class=\"detail\"><td colspan=\"6\"><div class=\"content-p\" style=\"line-height:20px;\">" + 
						  "<span style=\"font-weight:bold!important\">单价：</span>" + "￥" + message.producemPrice  +  " 　" +
						  "<span style=\"font-weight:bold!important\">总价：</span>" + "￥" + message.producemTotalprice  +  " 　" +
						  "<span style=\"font-weight:bold!important\">规格：</span>" + message.producemSpec  + "　 " + "<br />" +
						  "<span style=\"font-weight:bold!important\">日期：</span>" + message.dEnd 
						  "</div></td></tr>";
		$("#content tr:eq('"+index+"')").after(detailHTML);
		$(".content-p").animate({ 
		  width: "100%",
		  height: "45px", 
		  borderWidth: 10
		}, 300); 
	  };
	  var userId = localStorageService.get("User").userId;
	  //定义两个用于显示的下拉菜单Array
	  $scope.produceMSelect = [];
	  //$scope.userNameSelect = [];
	  var allData = [];
	  var curData;
	  //$scope.dEnd = "今日薪资";
	  $scope.hrEmps = [];

	  //初始加一个加载中的图标
	  //$("#tbody").append("<tr><td colspan=\"6\"><ion-spinner icon=\"bubbles\" class=\"spinner-balanced\"></ion-spinner></td></tr>");
	  hrEmpService.getHrEmps(userId).then(function (data) {
		$scope.hrEmps = data;
		setTimeout(function() {
		  var instance = $("#dUsername").mobiscroll().select({
			  theme: 'mobiscroll',
			  display: 'bottom',
			  label: 'City',
			  lang: 'zh',
			  placeholder: '请选择员工',
			  headerText: '<span class="show-icon">请选择员工</span>',
			  group: true,
			  groupLabel: 'Country',
			  width: [100, 170]
		  });
		}, 1000);
	  });
	  var index = 0;
	  $scope.getIndex = function () {
		index ++;
		return index;
	  };
	  //取全部数据
	  vprService.getVprs(userId).then(function (data) {
		allData = data;
		curData = allData;
		$scope.initSelect(allData);
		$scope.pro_Name = "所有";
		//$scope.user_Name = "所有";
		/*var timeout_return = $timeout(function() {
			  $scope.searchManager(false);
			} ,40);*/
		$timeout(function() {dropDown('pro_Name', '<span class="show-icon">请选择工序名称</span>', '请选择工序名称');},50);
	  });

	  var init = true;
	  $scope.getData = function (type) {
		if(curData != null) {
		  var data = curData.slice((vm.pagination.currentPage-1)*vm.pagination.perPage, vm.pagination.currentPage*vm.pagination.perPage);
		  vm.messages = vm.messages.concat(data);
		  //$("#loading").hide();
		  $("#rightLoading").hide();
		  $scope.loading = false;
		  commonService.hideLoading();
		  if(vm.messages.length === 0 && init) {
			$scope.hasDate = false;
			init = false;
		  }
		  vm.finishInit = true;
		  if (data.length === 0) {vm.moredata = true;}
		  //成功2秒后广播
		  $timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.pageNo ++;
		  }, 2000);
		} else {
		  if(type === 1) {
			vprService.getVprsByPageNoAndSize(userId, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
			  if(typeof(data) === "object") {
		  		vm.messages = vm.messages.concat(data);
		  	  }
			  $("#rightLoading").hide();
			  $scope.loading = false;
			  commonService.hideLoading();
			  if(vm.messages.length === 0 && init) {
				$scope.hasDate = false;
				init = false;
			  }
			  vm.finishInit = true;
			  $(".top_header_All").hide();
			  if (data.length === 0) {vm.moredata = true;}
			  //成功2秒后广播
			  $timeout(function() {
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.pageNo ++;
			  }, 2000);
			});
		  } else if(type === 2) {
			vprService.userVprsByPageNoAndSize($scope.dUsername, fromdate, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
			  alert("----" + data.length);
			  vm.messages = vm.messages.concat(data);
			  //$("#loading").hide();
			  $("#rightLoading").hide();
			  $scope.loading = false;
			  commonService.hideLoading();
			  if(vm.messages.length === 0 && init) {
				$scope.hasDate = false;
				init = false;
			  }
			  vm.finishInit = true;
			  if (data.length === 0) {vm.moredata = true;}
			  //成功2秒后广播
			  $timeout(function() {
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.pageNo ++;
			  }, 2000);
			});
		  }
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
		init: function (type) {
		  vm.finishInit = false;
		  vm.moredata = false;
		  vm.messages = [];
		  vm.pagination.currentPage = 1;
		  $scope.getData(type);
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
		  //$("#loading").show();
		  $scope.loading = true;
		  if(vm.finishInit) {
			vm.pagination.currentPage += 1;
			$scope.getData();
		  }
		},
	  };

	  vm.init(1);

	  $scope.initSelect = function(data) {
		$.each(data, function(index, item) {
		  //初始化工序select数组
		  if($scope.contains(item.producemName, $scope.produceMSelect) === 0) {
			$scope.produceMSelect.push(item.producemName);
		  }
		  //初始化员工select数组
		  /*if($scope.contains(item.dUsername, $scope.userNameSelect) === 0) {
			$scope.userNameSelect.push(item.dUsername);
		  }*/
		});
	  };

	  var fromdate = "";
	  $scope.dUsername = "";
	  $scope.dEnd = "今日薪资";
	  //当点击搜索时调用
	  $scope.searchManager = function(isInit) {
		$("#rightLoading").show();
		$("#loading").show();
		$("#container").hide();
		$scope.dUsername = $("#dUsername").val();
		if($scope.dUsername === "") {
			allData = null;
			curData = null;
			vprService.getVprs(userId).then(function (data) {
				allData = data;
				curData = allData;
				$scope.initSelect(allData);
				$scope.pro_Name = "所有";
				searchAndStat(true);
			});
			vm.init(1);
			return;
		}
		$scope.dEnd = $("#dEnd").val();
		if($scope.dEnd === "今日薪资") {
		  //今日新建
		  fromdate = $filter("date")(new Date(), "yyyy-MM-dd");
		} else if($scope.dEnd === "本周薪资") {
		  //本周新建
		  var currentDate = new Date();
		  //一天的毫秒数    
		  var millisecond = 1000 * 60 * 60 * 24;  
		  //减去的天数
		  var minusDay = currentDate.getDay() != 0 ? currentDate.getDay()-1 : 6;     
		  //本周 周一     
		  fromdate = $filter("date")(new Date(currentDate.getTime() - (minusDay * millisecond)), "yyyy-MM-dd");
		} else if($scope.dEnd === "本月薪资") {
		  var curMonth = $filter("date")(new Date(), "yyyy-MM");
		  fromdate = curMonth + "-01";
		}
		if($scope.dUsername == null) {
		  $("#rightLoading").hide();
		  $("#loading").hide();
		  return;
		}

		vprService.getVprsByUser_N($scope.dUsername, fromdate).then(function (data) {
		  allData = data;
		  curData = allData;
		  $scope.initSelect(allData);
		  $scope.pro_Name = "所有";
		  searchAndStat(isInit);
		  //$scope.user_Name = "所有";
		});
	  };

	  var searchAndStat = function (isInit) {
		$scope.producemName = $("#pro_Name").val();
		$scope.producemBillno = $("#producemBillno").val();
		$scope.totalWeight = 0;
		$scope.totalQuantity = 0;
		$scope.totalPrice = 0;
		curData = [];
		$.each(allData, function(index, item) {
		  //判断工序、框号、合同号和超期都为所选或所填项时，往curData里添加数据。
		  if(($scope.producemName === "所有" || item.producemName.indexOf($scope.producemName) != -1) && item.dUsername.indexOf($scope.dUsername) != -1 && item.producemBillno.indexOf($scope.producemBillno) != -1) {
			curData.push(item);
			$scope.totalWeight = $scope.totalWeight + item.avgweight;
			$scope.totalQuantity = $scope.totalQuantity + item.avgnumber;
			$scope.totalPrice = $scope.totalPrice + item.producemTotalprice;
		  }
		});
		$scope.totalWeight = parseFloat(($scope.totalWeight/1000).toFixed(2));
		//为统计信息显示而用。
		if($scope.dUsername === "") {$scope.dUsername = "所有";}
		if($scope.producemBillno === "") {$scope.producemBillno = "所有";}
		$("#dataStat").show();

		//初始化报表
		initChart($scope.totalWeight, parseFloat($scope.totalPrice.toFixed(2)));
		//重新初始化页码和数据
		if(isInit && curData != null) {
		  //alert(vm.messages.length);
		  vm.init(2);
		  /*if($ionicSideMenuDelegate.isOpen()) {
			$ionicSideMenuDelegate.toggleRight();
		  }*/
		}
	  }

	  $scope.contains =  function(str, arr) {
		for(var i=0;i<arr.length;i++) {
		  if(str === arr[i]) {
			return 1;
		  }
		}
		return 0;
	  };

	  var initChart = function (totalWeight, totalPrice) {
		$('#container').highcharts({
			chart: {},
			title: {
			  text: null,
			  style:{
				fontSize:40,
				fontFamily: '微软雅黑'
			  }
			},
			subtitle: {
				text: null
			},
			xAxis: [{
			  categories: ['',''],
			  labels: {
				format: '{value}',//格式化Y轴刻度
				style: {
					fontSize:'13px'
				}
			  } 
			}],
			yAxis: [{ // Primary yAxis
			  labels: {
				format: '{value} t',//格式化Y轴刻度
				style: {
					color: '#89A54E',
					fontSize: "15px",
				}
			  },
			  title: {
				text: '重量(t)', 
				style: {
					fontSize: "15px",
					color: '#89A54E'
				  }
				}
			  }, 
			  {
				title: {
				  text: '薪资(元)',
				  style: {
					fontSize: "15px",
					color: '#4572A7'
				  }
				},
				labels: {
				  format: '{value} 元',
				  style: {
					color: '#4572A7',
					fontSize: "15px",
				  }
				},
				opposite: true
			}],
			tooltip: {
				headerFormat: '',
				style: {                      // 文字内容相关样式
				  color: "#0099FF",
				  fontSize: "15px",
				  fontWeight: "blod",
				  fontFamily: "Courir new"
				}
			},
			//图例样式设置
			legend: {
				enabled:false
			},
			series: [{
			  name: '总薪资',
			  color: '#4572A7',
			  type: 'column',
			  yAxis: 1,
			  data: [' ', totalPrice],
			  tooltip: {
				valueSuffix: ' 元'
			  },
			  dataLabels: {
				formatter: function() {
				  return this.y + " 元";
				},
				enabled: true,
				style: {
				  fontSize: '15px',
				}
			  }
			}, 
			{
			  name: '总重量',
			  color: '#89A54E',
			  type: 'column',
			  data: [totalWeight, ''],
			  tooltip: {
				  valueSuffix: ' t'
			  },
			  dataLabels: {
				formatter: function() {
				  return this.y + " t";
				},
				enabled: true,
				style: {
				  fontSize: '15px',
				}
			  }
			}]
		});
		$("#rightLoading").hide();
		$("#container").show();
	  }
  });
})

// 员工/工序对应的统计表
.controller('peopleReportChartCtrl', function($scope, $state, $timeout, commonService, $ionicSideMenuDelegate, $ionicLoading, localStorageService, vprService, hrEmpService, alertService) {
  var tabletr = $('.table-center tr').width();
  if ( tabletr > 800) {
    $scope.firstName = 700;
  }else{
    $scope.firstName = 280;
  }
  //设置为横屏
  window.screen.lockOrientation('landscape');
  $scope.$on('$stateChangeStart', function(e, state) {
	//设置为竖屏
	window.screen.lockOrientation('portrait');
  });
  commonService.showLoading();
  dropDown('month', '<span class="show-icon">请选择月份</span>', '请选择月份');
  $scope.hasDate = true;

  $scope.$on($state.current.name + "-init", function() {
  	$scope.currentYear = new Date().getFullYear();
  	//$scope.years = [currentYear-1, currentYear, currentYear+1];
  	
  	$timeout(function() {
  		dropDown('year', '<span class="show-icon">请选择年份</span>', '请选择年份');
  		$("#year_dummy").val($scope.currentYear);
  		$("#year").val($scope.currentYear);
  	},30);
  	currentMonth = new Date().getMonth() + 1;

  	$("#month_dummy").val(currentMonth);
  	$("#month").val(currentMonth);
  	
  	var user = localStorageService.get("User");
  	var num = 0;
  	//取全部数据
	vprService.getVprs(user.userId).then(function (data) {
		allData = data;
		curData = allData;
		$scope.pro_Name = "所有";
		$scope.initSelect(allData);
		num ++;
		if(num === 2) {
			commonService.hideLoading();
			$(".top_header_All").hide();
		}
		//$scope.user_Name = "所有";
		/*var timeout_return = $timeout(function() {
			  $scope.searchManager(false);
			} ,40);*/
		$timeout(function() {
			dropDown('pro_Name', '<span class="show-icon">请选择工序名称</span>', '请选择工序名称');
			bindNum++;
			if(bindNum === 2) bindEvent();
		},50);
	});
	$scope.produceMSelect = [];
	$scope.initSelect = function(data) {
		$.each(data, function(index, item) {
			//初始化工序select数组
			if(!commonService.contains(item.producemName, $scope.produceMSelect)) {
				$scope.produceMSelect.push(item.producemName);
			}
		});
	};

	$scope.hrEmps = [];
	//初始加一个加载中的图标
	//$("#tbody").append("<tr><td colspan=\"6\"><ion-spinner icon=\"bubbles\" class=\"spinner-balanced\"></ion-spinner></td></tr>");
	hrEmpService.getHrEmps(user.userId).then(function (data) {
		$scope.hrEmps = data;
		num ++;
		if(num === 2) {
			commonService.hideLoading();
			$(".top_header_All").hide();
		}
		setTimeout(function() {
			var instance = $("#dUsername").mobiscroll().select({
				theme: 'mobiscroll',
				display: 'bottom',
				label: 'City',
				lang: 'zh',
				placeholder: '请选择员工',
				headerText: '<span class="show-icon">请选择员工</span>',
				group: true,
				groupLabel: 'Country',
				width: [100, 170]
			});
			bindNum++;
			if(bindNum === 2) bindEvent();
		}, 500);
	});
    
    //总重量数据数组
    var weightArray = [];
    //员工名称
    var userName;
    //工序名称
    var proName;
    //月份
    var month = currentMonth;
    //年份
    var year = $scope.currentYear;
    //日期数组
    var dayArray = [];

    var showUNameChart = function (dUserName) {
    	weightArray = [];
    	dayArray = [];
    	$("#rightLoading").show();
    	vprService.reportDatasByUName(dUserName, year, month).then(function (data){
    		userName = dUserName;
    		if(data.length === 0) $scope.hasDate = false;
    		else $scope.hasDate = true;
    		$.each(data, function (index, item) {
    			weightArray.push(item.total);
    			dayArray.push(item.day);
    		});
	    	initHighChart("uName");
	    }); 
    }
    var showProNameChart = function (pro_Name) {
    	weightArray = [];
    	dayArray = [];
    	$("#rightLoading").show();
    	vprService.reportDatasByProName(pro_Name, year, month).then(function (data){
    		proName = pro_Name;
    		if(data.length === 0) $scope.hasDate = false;
    		else $scope.hasDate = true;
    		$.each(data, function (index, item) {
    			weightArray.push(item.total);
    			dayArray.push(item.day);
    		});
	        initHighChart("proName");
	    }); 
    }

    //初始化查自己的报表
    showUNameChart(user.userName);

    var bindNum = 0;
    var bindEvent = function () {
    	$("#dUsername").on("change", function () {
			if($(this).val() != "") {
		    	$("#pro_Name").val("所有");
		    	$("#pro_Name_dummy").val("所有");
		    }
	    });
	    $("#pro_Name").on("change", function () {
	    	if($(this).val() != "所有") {
		    	$("#dUsername").val("");
		    	$("#dUsername_dummy").val("");
		    }
	    });
    }

    $scope.searchManager = function () {
    	month = $("#month_dummy").val();
    	year = $("#year").val();
    	var dUserName = $("#dUsername_dummy").val();
    	var pro_Name = $("#pro_Name").val();
    	if(isNaN(year)) {
    		alertService.showAlert($scope, "请填写年份！", true, "warning", null);
    		return;
    	}
    	if(dUserName === "" && pro_Name === "所有") {
    		alertService.showAlert($scope, "请填写员工名称或工序名称！", true, "warning", null);
    		return;
    	} else if(dUserName != "" && pro_Name === "所有") {
    		showUNameChart(dUserName);
    	} else if(dUserName === "" && pro_Name != "所有") {
    		showProNameChart(pro_Name);
    	} else {
    		showUNameChart(dUserName);
    	}
    	
    }

    //根据全局变量初始化报表
	var initHighChart = function (type) {
		var title = "";
		if(type === "uName") {
			title = year + '年' + month + '月' + userName + '的产量统计图';
		} else if(type === "proName") {
			title = year + '年' + month + '月' + proName + '工序的产量统计图';
		}
		var chart = new Highcharts.Chart('peopleReportChart', {
		    title: {
		        text: title,
		        x: -20
		    },
		    xAxis: {
		        categories: dayArray
		    },
		    yAxis: {
		        title: {
		            text: '产量 (kg)'
		        },
		        plotLines: [{
		            value: 0,
		            width: 1,
		            color: '#808080'
		        }]
		    },
		    tooltip: {
		        valueSuffix: 'kg'
		    },
		    legend: {
		        layout: 'vertical',
		        align: 'right',
		        verticalAlign: 'middle',
		        borderWidth: 0
		    },
		    series: [{
		        name: '实际产量',
		        data: weightArray
		    }]
		});
		$("#rightLoading").hide();
		if($ionicSideMenuDelegate.isOpen()) {
			$ionicSideMenuDelegate.toggleRight();
		}
	}
  });
})

// 优秀员工
.controller('goodUserCtrl', function($scope, $state, commonService, $ionicLoading, vprService) {
  //$("#loading").show();
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
  //$(function () {
    //工序数组
    var categories = [];
    //总重量数据数组
    var weightArray = [];
    //员工数据数组
    $scope.userArray = [];
    vprService.getGoodUsers().then(function (data){
      var colors = Highcharts.getOptions().colors;
      colors.splice(1,1);
      colors.push('#052095');
      colors.push('#0f9505');
      colors.push('#ec4bc0');
      colors.push('#2a5fd8');
      
      $.each(data, function(index, item) {
        categories.push("<span style=\"fontsize:26\">" + item.produceM_Name + "</span><span style=\"color:#ef9920\">★</span>" + item.userName);
        var weight = parseFloat((item.totalWeight/1000).toFixed(2));
        var jsonObject = {
            y:weight,
            color:colors[index]
        };
        weightArray.push(jsonObject);
        $scope.userArray.push(item.userName);
        //userPhotoArray.push(item.uid);
      });
      $('#goodUserChart').highcharts({
          chart: {
              type: 'bar'
          },
          title: {
              text: null
          },
          subtitle: {
              text: '各工序产量最高员工'
          },
          xAxis: {
              categories: categories,
              title: {
                  text: null
              } 
          },
          yAxis: {
              min: 0,
              title: {
                  text: '重量 (t)',
                  align: 'high'
              },
              labels: {
                  overflow: 'justify'
              }
          },
          tooltip: {
              valueSuffix: ' t'
          },
          plotOptions: {
              bar: {
                  dataLabels: {
                      enabled: true
                  }
              },
              series: {
                  borderWidth: 0,
                  dataLabels: {
                      enabled: true,
                      format: '{point.y:.1f}t'
                  }
              }
          },
          legend: {
              enabled: false
          },
          credits: {
              enabled: false
          },
          series: [{
              name: '重量',
              data: weightArray
          }]
      });
      //$("#chartPage").show();
      //$("#loading").hide();
      commonService.hideLoading();
    }); 
  });
});