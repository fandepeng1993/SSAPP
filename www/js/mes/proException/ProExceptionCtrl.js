angular.module('ssapp.controllers')

//生产异常-图表
.controller('ScycCtrl', function($scope, $state, commonService, $ionicLoading, vpeService) {
  //commonService.loading();
  //$("#loading").show();
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
  //$(function () {
    var totalWeight;
    //设置异常发生工序类别的数组和异常类别的数组
    var p_categories = [];
    var t_categories = [];
    //设置数据的Json数组(两个分别用于两张表的显示)
    var dataJson_p = [];
    var dataJson_t = [];
    //第一个
    vpeService.getProduceMWeight().then(function (data){
      var colors = Highcharts.getOptions().colors;
      totalWeight = 0;
      $.each(data, function(index, item) {
        p_categories.push(item.key);
        totalWeight = totalWeight + item.value;
        var JSONObject = {
                "y" : item.value,
                "color" : colors[index]
            };
        dataJson_p.push(JSONObject);
      });

      $('#container').highcharts({
          chart: {
              type: 'column'
          },
          title: {
              text: '异常工序统计图'
          },
          subtitle: {
              text: '来源：上上RFID生产管理系统'
          },
          xAxis: {
              categories: p_categories,
              labels: {
                  // rotation: -45,
                  style: {
                      fontSize: '15px',
                  }
              },
              title: {
                  text: '工序名称'
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '重量（kg）'
              }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              formatter: function() {
                  var point = this.point,
                    rate = (this.y*100/totalWeight).toFixed(2),
                        s = this.x +':<b>'+ this.y +'kg （' + rate + '%）查看详情</b><br/>';
                  return s;
              }
          },
          plotOptions: {
              column: {
                  cursor: 'pointer',
                  point: {
                      events: {}
                  },
                  dataLabels: {
                      enabled: true,
                      style: {
                        fontSize: "14px",
                        fontFamily: '微软雅黑'
                      },
                      formatter: function() {
                          return this.y +'kg';
                      }
                  }
              }
          },
          series: [{
              name: '工序名称',
              data: dataJson_p,
              dataLabels: {
                  enabled: true
              }
          }]
      });
    });

    //第二个
    vpeService.getDTypeWeight().then(function (data){
      var colors = Highcharts.getOptions().colors;
      $.each(data, function(index, item) {
        t_categories.push(item.key);
        var JSONObject = {
                "y" : item.value,
                "color" : colors[index]
            };
        dataJson_t.push(JSONObject);
      });

      $('#containertwo').highcharts({
          chart: {
              type: 'column'
          },
          title: {
              text: '异常类型统计图'
          },
          subtitle: {
              text: '来源：上上RFID生产管理系统'
          },
          xAxis: {
              categories: t_categories,
              labels: {
                  // rotation: -45,
                  style: {
                      fontSize: '15px',
                  }
              },
              title: {
                  text: '异常类型'
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '重量（kg）'
              }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              formatter: function() {
                  var point = this.point,
                    rate = (this.y*100/totalWeight).toFixed(2),
                        s = this.x +':<b>'+ this.y +'kg （' + rate + '%）查看详情</b><br/>';
                  return s;
              }
          },
          plotOptions: {
              column: {
                  cursor: 'pointer',
                  point: {
                      events: {}
                  },
                  dataLabels: {
                      enabled: true,
                      style: {
                          fontSize: "14px",
                          fontFamily: '微软雅黑'
                      },
                      formatter: function() {
                          return this.y +'kg';
                      }
                  }
              }
          },
          series: [{
              name: '异常类型',
              data: dataJson_t,
              dataLabels: {
                  enabled: true
              }
          }]
      });
      //$("#chartPage").show();
      //$("#loading").hide();
      commonService.hideLoading();
    });
  });
})

//生产异常
.controller('vpeCtrl', function($scope, $state, $window, $timeout, commonService, localStorageService, vpeService, $ionicSideMenuDelegate) {
  var tabletr = $('.table-center tr').width();
  if ( tabletr > 800) {
    $scope.firstName = 700;
  }else{
    $scope.firstName = 280;
  }
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    
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
		var detailHTML = "<tr class=\"detail\"><td colspan=\"6\"><div class=\"content-p\" style=\"line-height:20px;\">" + 
						  "<span style=\"font-weight:bold!important\">异常：</span>" + message.dType  + " 　" +
						  "<span style=\"font-weight:bold!important\">重量：</span>" + message.nWeight  + "kg" + "　 " +
						  "<span style=\"font-weight:bold!important\">支数：</span>" + message.nQuantity + "支" +  "　 " +
						  "<span style=\"font-weight:bold!important\">米数：</span>" + message.nNumbers  + "米<br />" +
						  "<span style=\"font-weight:bold!important\">时间：</span>" + message.dDate  + 
						  "</div></td></tr>";
		$("#content tr:eq('"+index+"')").after(detailHTML);
		$(".content-p").animate({ 
		  width: "100%",
		  height: "45px", 
		  borderWidth: 10
		}, 300); 
	  };
	  //生产异常列表初始化
	  //$scope.serviceName = "vpeService";
	  $scope.produceMSelect = [];
	  $scope.dTypeSelect = [];
	  var allData;
	  var curData;
	  //取全部数据
	  vpeService.getVpes().then(function (data) {
		allData = data;
		curData = allData;

		$scope.initSelect(allData);
		$scope.pro_Name = "所有";
		$scope.d_Type = "所有";
		var timeout_return = $timeout(function() {
			  $scope.searchManager(false);
			} ,40);
	  });

	  $scope.getData = function () {
		if(curData != null) {
		  var data = curData.slice((vm.pagination.currentPage-1)*vm.pagination.perPage, vm.pagination.currentPage*vm.pagination.perPage);
		  vm.messages = vm.messages.concat(data);
		  $("#loading").hide();
      commonService.hideLoading();
		  vm.finishInit = true;
		  if (data.length === 0) {vm.moredata = true;}
		  //成功2秒后广播
		  $timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.pageNo ++;
		  }, 2000);
		} else {
		  vpeService.getVpesByPageNoAndSize(vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
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
		  //初始化工序select数组
		  if($scope.contains(item.producemName, $scope.produceMSelect) === 0) {
			$scope.produceMSelect.push(item.producemName);
		  }
		  //初始化异常select数组
		  if($scope.contains(item.dType, $scope.dTypeSelect) === 0) {
			$scope.dTypeSelect.push(item.dType);
		  };
		  if(device.platform != "Android") {
			$timeout(function () {
			  dropDown('pro_Name', '请选择工序名称', '<span class="show-icon">请选择工序名称</span>');
			  dropDown('d_Type', '请选择异常类型', '<span class="show-icon">请选择异常类型</span>');
			},50);
		  }
		});
	  };

	  //当点击搜索时调用
	  $scope.searchManager = function(isInit) {
		$scope.producemName = $("#pro_Name").val();
		$scope.dType = $("#d_Type").val();
		$scope.cardno = $("#cardno").val();
		$scope.contractno = $("#contractno").val();
		$scope.totalWeight = 0;
		$scope.totalQuantity = 0;
		curData = [];
		$.each(allData, function(index, item) {
		  //判断工序、框号、合同号和超期都为所选或所填项时，往curData里添加数据。
		  if(($scope.producemName === "所有" || item.producemName.indexOf($scope.producemName) != -1) && ($scope.dType === "所有" || item.dType.indexOf($scope.dType) != -1) && item.cardno.indexOf($scope.cardno) != -1 && item.contractno.indexOf($scope.contractno) != -1) {
			curData.push(item);
			$scope.totalWeight = $scope.totalWeight + item.nWeight;
			$scope.totalQuantity = $scope.totalQuantity + item.nQuantity;
		  }
		});
		$scope.totalWeight = parseFloat(($scope.totalWeight/1000).toFixed(2));
		//为统计信息显示而用。
		if($scope.dType === "") {$scope.dType = "所有";}
		if($scope.cardno === "") {$scope.cardno = "所有";}
		if($scope.contractno === "") {$scope.contractno = "所有";}

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