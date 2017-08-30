angular.module('ssapp.controllers')

//成品查询-统计表
.controller('CpcxCtrl', function($scope, $state, commonService, $ionicLoading, vwfcService) {
  //commonService.loading();
  //$("#loading").show();
  $(".cpcx").hide();
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
  //$(function () {
    var totalWeight;
    var totalQuantity;
    vwfcService.totalWeiAndQua().then(function (data){
      totalWeight = data.totalWeight;
      totalWeight = parseFloat((totalWeight/1000).toFixed(2));
      totalQuantity = data.totalQuantity;
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
              text: '支数(支)',
              style: {
                fontSize: "15px",
                color: '#4572A7'
              }
            },
            labels: {
              format: '{value} 支',
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
          name: '总支数',
          color: '#4572A7',
          type: 'column',
          yAxis: 1,
          data: [' ', totalQuantity],
          tooltip: {
            valueSuffix: ' 支'
          },
          dataLabels: {
            formatter: function() {
              return this.y + " 支";
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
      //$("#chartPage").show();
      //$("#loading").hide();
	  $(".cpcx").show();
      commonService.hideLoading();
    });
  });                                      
})

//成品查询
.controller('vwfcCtrl', function($scope, $state, $window, $timeout, localStorageService, commonService, vwfcService, $ionicSideMenuDelegate) {
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
						  "<span style=\"font-weight:bold!important\">工序支数：</span>" + message.producemNumber  + "支" + "　 " +
						  "<span style=\"font-weight:bold!important\">工序重量：</span>" + message.producemWeight  + "kg" + "　 " +
						  "<span style=\"font-weight:bold!important\">工序米数：</span>" + message.producemWeights + "米" + "<br />" +
						  "<span style=\"font-weight:bold!important\">完成时间：</span>" + message.producemEndtime + "<br />" + 
						  "<span style=\"font-weight:bold!important\">投料日期：</span>" + message.feedingdate + "　 "+ 
						  "<span style=\"font-weight:bold!important\">交货日期：</span>" + message.deliverydate  + 
						  "</div></td></tr>";
		$("#content tr:eq('"+index+"')").after(detailHTML);
		$(".content-p").animate({ 
		  width: "100%",
		  height: "65px", 
		  borderWidth: 10
		}, 300); 
	  };
	  //成品管理列表初始化
	  //$scope.serviceName = "vwfcService";
	  var allData;
	  var curData;
	  //取全部数据
	  vwfcService.getVwfcs().then(function (data) {
		allData = data;
		curData = allData;

		//$scope.initSelect(allData);
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
			vwfcService.getVwfcsByPageNoAndSize(vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
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

	  //当点击搜索时调用
	  $scope.searchManager = function(isInit) {
		$scope.cardno = $("#cardno").val();
		$scope.contractno = $("#contractno").val();
		$scope.totalWeight = 0;
		$scope.totalQuantity = 0;
		curData = [];
		$.each(allData, function(index, item) {
		  //判断工序、框号、合同号和超期都为所选或所填项时，往curData里添加数据。
		  if(item.cardno.indexOf($scope.cardno) != -1 && item.contractno.indexOf($scope.contractno) != -1) {
			curData.push(item);
			$scope.totalWeight = $scope.totalWeight + item.producemWeight;
			$scope.totalQuantity = $scope.totalQuantity + item.producemNumber;
		  }
		});
		$scope.totalWeight = parseFloat(($scope.totalWeight/1000).toFixed(2));
		//为统计信息显示而用。
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