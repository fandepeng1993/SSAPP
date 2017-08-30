angular.module('ssapp.controllers')

//荒管投料
.controller('vdftCtrl', function($scope, $state, $rootScope, $window, $timeout, commonService, localStorageService, vdftService, $ionicSideMenuDelegate) {
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
						  "<span style=\"font-weight:bold!important\">荒管规格：</span>" + message.dSpec  + " 　" +
						  "<span style=\"font-weight:bold!important\">支数：</span>" + message.dQuantity  + "支" + "　 "+
						  "<span style=\"font-weight:bold!important\">单支重量：</span>" + message.dWeight + "kg" + "<br />" +
						  "<span style=\"font-weight:bold!important\">总重量：</span>" + message.dTotalweight  + "kg" + " 　" +
						  "<span style=\"font-weight:bold!important\">炉号：</span>" + message.dFurnaceno  + 
						  "</div></td></tr>";
		$("#content tr:eq('"+index+"')").after(detailHTML);
		$(".content-p").animate({ 
		  width: "100%",
		  height: "45px", 
		  borderWidth: 10
		}, 300); 
	  };
	  var allData = {};
	  //荒管投料列表初始化
	  //$scope.serviceName = "vdftService";
	  var curData;
	  //取全部数据
	  vdftService.getVdfts().then(function (data) {
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
		  commonService.hideLoading();
		  vm.finishInit = true;
		  if (data.length === 0) {vm.moredata = true;}
		  //成功2秒后广播
		  $timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.pageNo ++;
		  }, 2000);
		} else {
		  vdftService.getVdftsByPageNoAndSize(vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
			if(typeof(data) === "object") {
		  		vm.messages = vm.messages.concat(data);
		  	}
		  	
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
			$scope.totalWeight = $scope.totalWeight + parseFloat(item.dTotalweight);
			$scope.totalQuantity = $scope.totalQuantity + parseInt(item.dQuantity);
		  }
		});
		$scope.totalWeight = parseFloat(($scope.totalWeight/1000).toFixed(2));
		//为统计信息显示而用。
		if($scope.producemBillno === "") {$scope.producemBillno = "所有";}
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