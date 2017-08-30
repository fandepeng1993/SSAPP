angular.module('ssapp.controllers')

//生产报废-数据统计
.controller('ScbfCtrl', function($scope, $state, vsrService, commonService, $ionicLoading) {
  //$("#loading").show();
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
  //$(function () {
    //工序数组
    var categories = [];
    //总重量数据数组
    var weightArray = [];
    //总支数数据数组
    var quantityArray = [];
    vsrService.proNWeiAndQuas().then(function (data){
      $.each(data, function(index, item) {
          categories.push("<span style=\"fontsize:\"30px\"\">" + item.produceM_Name);
          var weightJson = {
                      y:parseFloat((item.totalWeight/1000).toFixed(2)),
                      color:'#7cb5ec'
                  };
          weightArray.push(weightJson);
          var quantityJson = {
                      y:item.totalQuantity,
                      color:'#90ed7d'
                  };
          quantityArray.push(quantityJson);
      });


      $('#container').highcharts({
          chart: {
              type: 'bar'
          },
          title: {
              text: null
          },
          subtitle: {
              text: null
          },
          xAxis: {
              categories: categories,
              title: {
                  text: null
              } 
          },
          yAxis: [{ //设置第一个y轴 
            //tickInterval: 20, 
            tickPixelInterval:100,
            maxPadding: 0,
              min: 0,
              //max:Math.max.apply(null,weightArray),
              title: {                                                       
                  text: '重量(t)',                             
                  align: 'high',
                  style:{ // 此处可设置样式
                      fontSize:"15px",
                      fontFamily: '微软雅黑'
                  }
              },                                                             
              labels: {  
                step:4,
                  overflow: 'justify',
                  style:{ // 此处可设置样式
                      fontSize:"15px",
                      fontFamily: '微软雅黑'
                  }
              }                                                              
          },{ //设置第二个y轴 
            //tickInterval: 20,
            tickPixelInterval:100,
            maxPadding: 0,
              min: 0, 
              //max:Math.max.apply(null,cardNosArray),
              title: {                                                       
                  text: '支数(支)',                             
                  align: 'high',
                  style:{ // 此处可设置样式
                      fontSize:"15px",
                      fontFamily: '微软雅黑'
                  }
              },                                                             
              labels: {      
                step:4,
                  overflow: 'justify',
                  style:{ // 此处可设置样式
                      fontSize:"15px",
                      fontFamily: '微软雅黑'
                  }
              },
              opposite: true //表示是否跟第一个在反方向位置
          }],
          tooltip: {
              shared:true,
              style:{ // 此处可设置样式
                lineHeight:'20em',
                padding:'10px',
                    fontSize:"15px",
                    fontFamily: '微软雅黑'
              }
          },
          plotOptions: {
              bar: {
                  dataLabels: {
                      enabled: true
                  }
              }
          },
          legend: {
              layout: 'vertical',                                            
              align: 'right',                                                
              verticalAlign: 'top',                                          
              x: 140,                                                        
              y: 200,                                                        
              floating: true,                                                
              borderWidth: 0,                                        
              backgroundColor: 'blue',
              shadow: false  
          },
          credits: {
              enabled: false
          },
          series:  [{                                                         
              name: '重量(t)',                                             
              data: weightArray,
              yAxis:0,
              dataLabels: {
                  enabled: false,
                  formatter: function() {
                    return this.y + " t";
                  },
                  style: {
                      fontSize: "25px",
                      fontFamily: '微软雅黑'
                  }
              },
              tooltip: { valueSuffix: ' t' }//鼠标放到曲线上时的单位
          },{                                                         
              name: '支数(支)',                                             
              data: quantityArray, 
              yAxis:1,
              dataLabels: {
                  enabled: false,
                  formatter: function() {
                    return this.y + " 支";
                  },
                  style: {
                      fontSize: "25px",
                      fontFamily: '微软雅黑'
                  }
              },
              tooltip: { valueSuffix: ' 支' }//鼠标放到曲线上时的单位
          }]
      });
      //$("#chartPage").show();
      //$("#loading").hide();
      commonService.hideLoading();
    });
  });
})

//生产报废
.controller('vsrCtrl', function($scope, $state, $rootScope, $window, $timeout, commonService, localStorageService, vsrService, $ionicSideMenuDelegate) {
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
		$("#content tr:eq('"+index+"')").css('border-left','5px solid #F7931E');//添加左边框
		$("#content tr:eq('"+index+"') td:eq(0) #leftsj").show();//添加三角
		
		var detailHTML = "<tr class=\"detail\"><td colspan=\"6\"><div class=\"content-p\" style=\"line-height:20px;\">" + 
						  "<span style=\"font-weight:bold!important\">报废支数：</span>" + message.dQuantity1 + "支　 " +
						  "<span style=\"font-weight:bold!important\">报废重量：</span>" + message.dWeight  + "kg　 " +
						  "<span style=\"font-weight:bold!important\">报废米数：</span>" + message.dNumbers  +  "米<br />" +
						  "<span style=\"font-weight:bold!important\">处理人：</span>" + message.dUser + "　 " +
						  "<span style=\"font-weight:bold!important\">处理日期：</span>" + message.dDate  +
						  "</div></td></tr>";
		$("#content tr:eq('"+index+"')").after(detailHTML);
		$(".content-p").animate({ 
		  width: "100%",
		  height: "45px", 
		  borderWidth: 10
		}, 300); 
	  };
	  $scope.produceMSelect = [];
	  var allData = [];
	  //生产报废列表初始化
	  //$scope.serviceName = "vsrService";
	  var curData;
	  //取全部数据
	  vsrService.getVsrs().then(function (data) {
		allData = data;
		curData = allData;

		$scope.initSelect(allData);
		$scope.pro_Name = "所有";
		var timeout_return = $timeout(function() {
			  $scope.searchManager(false);
			} ,40);
	  });

	  $scope.getData = function () {
		if(curData != null) {
		  var data = curData.slice((vm.pagination.currentPage-1)*vm.pagination.perPage, vm.pagination.currentPage*vm.pagination.perPage);
		  vm.messages = vm.messages.concat(data);
		  vm.finishInit = true;
		  //$("#loading").hide();
		  $scope.loading = false;
		  commonService.hideLoading();
		  if(vm.messages.length === 0) {
			$scope.hasDate = false;
		  }
		  if (data.length === 0) {vm.moredata = true;}
		  //成功2秒后广播
		  $timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.pageNo ++;
		  }, 2000);
		} else {
		  vsrService.getVsrsByPageNoAndSize(vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
			if(typeof(data) === "object") {
		  		vm.messages = vm.messages.concat(data);
		  	}
			vm.finishInit = true;
			//$("#loading").hide();
			$scope.loading = false;
			commonService.hideLoading();
			$(".top_header_All").hide();
			if(vm.messages.length === 0) {
			  $scope.hasDate = false;
			}
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
		  //$("#loading").show();
		  $scope.loading = true;
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
		  };
		  if(device.platform != "Android") {
			$timeout(function () {
			  dropDown('pro_Name', '请选择工序名称', '<span class="show-icon">请选择工序名称</span>');
			},50);
		  }
		});
	  };

	  //当点击搜索时调用
	  $scope.searchManager = function(isInit) {
		$scope.producemName = $("#pro_Name").val();
		$scope.cardno = $("#cardno").val();
		$scope.contractno = $("#contractno").val();
		$scope.totalWeight = 0;
		$scope.totalQuantity = 0;
		curData = [];
		$.each(allData, function(index, item) {
		  //判断工序、框号、合同号和超期都为所选或所填项时，往curData里添加数据。
		  if(($scope.producemName === "所有" || item.producemName.indexOf($scope.producemName) != -1) && item.cardno.indexOf($scope.cardno) != -1 && item.contractno.indexOf($scope.contractno) != -1) {
			curData.push(item);
			$scope.totalWeight = $scope.totalWeight + item.dWeight;
			$scope.totalQuantity = $scope.totalQuantity + item.dQuantity1;
		  }
		});
		$scope.totalWeight = parseFloat(($scope.totalWeight/1000).toFixed(2));
		//为统计信息显示而用。
		if($scope.cardno === "") {$scope.cardno = "所有";}
		if($scope.contractno === "") {$scope.contractno = "所有";}
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
});