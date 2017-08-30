angular.module('ssapp.controllers')

//生产工单
.controller('pwoCtrl', function($scope, $state, $rootScope, $window, $timeout, commonService, localStorageService, pwoService, $ionicSideMenuDelegate) {
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
	  dropDown('pro_Name', '<span class="show-icon">请选择工序名称</span>', '请选择工序名称');
  
	  $scope.expandDetail = function(index, pwo) {
		$("#content tr:eq('"+index+"')").siblings().each(function() {
		  $(this).children("td:eq(0)").children("i").removeClass('ion-chevron-down');
		  $(this).children("td:eq(0)").children("i").addClass('ion-chevron-right');
		  $(this).css('background','#fff');//选中其他背景还原
		});
		$("#content tr[class='detail']").remove();
		$("#content tr:eq('"+index+"') td:eq(0) i").removeClass('ion-chevron-right');
		$("#content tr:eq('"+index+"')").css('background','#f2f2f2');//选中当前背景改变
		$("#content tr:eq('"+index+"') td:eq(0) i").addClass('ion-chevron-down');
		
		var detailHTML = "<tr class=\"detail\"><td colspan=\"6\"><div class=\"content-p\" style=\"line-height:30px;\">"  + 
						  "<span style=\"font-weight:bold!important\">工序支数：</span>" + pwo.producemNumber  + "支 　"  +
						  "<span style=\"font-weight:bold!important\">工序重量：</span>" + pwo.producemWeight +  "kg　 " +
						  "<span style=\"font-weight:bold!important\">创建时间：</span>" + pwo.dCreatedate + 
						  "</div></td></tr>";
		$("#content tr:eq('"+index+"')").after(detailHTML);
		$(".content-p").animate({ 
		  width: "100%",
		  height: "30px", 
		  left: "50px",
		  borderWidth: 10
		}, 300); 
	  };

	  $scope.produceMSelect = [];
	  var allData = {};
	  //生产工单列表初始化
	  var curData;
	  //取全部数据
	  pwoService.getPwos().then(function (data) {
		allData = data;
		curData = allData;
		if(allData.length != 0){
		  $('#nonedept-scgd').hide();
		}else{
		  $('#nonedept-scgd').show();
		}
		$scope.initSelect(allData);
		$scope.pro_Name = "所有";
		var timeout_return = $timeout(function() {
			  //$scope.searchManager(false);
			}, 40);
	  });

	  $scope.getData = function () {
		if(curData != null) {
		  var data = curData.slice((vm.pagination.currentPage-1)*vm.pagination.perPage, vm.pagination.currentPage*vm.pagination.perPage);
		  vm.messages = vm.messages.concat(data);
		  //$("#loading").hide();
		  $scope.loading = false;
		  commonService.hideLoading();
		  if(vm.messages.length === 0) {
			$scope.hasDate = false;
		  }
		  vm.finishInit = true;
		  if (data.length === 0) {vm.moredata = true;}
		  //成功2秒后广播
		  $timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.pageNo ++;
		  }, 2000);
		} else {
		  pwoService.getPwosByPageNoAndSize(vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
			if(typeof(data) === "object") {
		  		vm.messages = vm.messages.concat(data);
		  	}
			//$("#loading").hide();
			$scope.loading = false;
			commonService.hideLoading();
			if(vm.messages.length === 0) {
			  $scope.hasDate = false;
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
		//初始化select数组
		$.each(data, function(index, item) {
		  if($scope.contains(item.producemName, $scope.produceMSelect) === 0) {
			$scope.produceMSelect.push(item.producemName);
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