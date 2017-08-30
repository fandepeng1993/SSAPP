angular.module('ssapp.controllers')

//发货记录查询
.controller('lsblCtrl', function($scope, $state, $window, $timeout, $cordovaToast, $filter, localStorageService, commonService, lsblService, $ionicSideMenuDelegate) {
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
	  
	  $scope.subStringCon = function (str) {
		  return str.replace(/S301-/g, "");
	  }
  
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
						  "<span style=\"font-weight:bold!important\">品名：</span>" + message.lName + "　 " +
								  "<span style=\"font-weight:bold!important\">炉号：</span>" + message.dFurnaceno + "　 " + "<br />" +
						  "<span style=\"font-weight:bold!important\">标准：</span>" + message.dStandards + "　 "  + 
						  "<span style=\"font-weight:bold!important\">过磅重量：</span>" + message.lWeighedWeight + "kg<br />" +
						  "<span style=\"font-weight:bold!important\">数量：</span>" + message.lQuantity + "支　" +
						  "<span style=\"font-weight:bold!important\">米数：</span>" + message.lNumbers + "米　" + 
						  "<span style=\"font-weight:bold!important\">计划重量：</span>" + message.lWeight + "kg<br />" + 
						  "<span style=\"font-weight:bold!important\">创建时间：</span>" + message.dCreatedate + "　 " + 
						  "<span style=\"font-weight:bold!important\">创建人：</span>" + message.dCreate +
						  "</div></td></tr>";
		$("#content tr:eq('"+index+"')").after(detailHTML);
		$(".content-p").animate({ 
		  width: "100%",
		  height: "85px", 
		  borderWidth: 10
		}, 300); 
	  };
	  dropDown('date', '<span class="show-icon">请选择出货时间</span>', '请选择出货时间');

	  //直接取数据
	  $scope.getData = function () {
		lsblService.getLsblsLazy(vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
		  if(typeof(data) === "object") {
		  	vm.messages = vm.messages.concat(data);
		  }
		  //$("#loading").hide();
		  $scope.loading = false;
		  if(vm.messages.length === 0) {
			$scope.hasDate = false;
		  }
		  vm.finishInit = true;
		  if (data.length === 0) {
			$cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
			  // success  
			}, function (error) {  
			  // error  
			});
			vm.moredata = true;
		  }
		  //成功2秒后广播
		  $timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.pageNo ++;
		  }, 2000);
		});
	  };
	  //根据pojo取数据
	  var pojo = {};
	  $scope.getDataByPojo = function () {
		lsblService.getLsblsByPojoLazy(pojo, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
		  if(typeof(data) === "object") {
		  	vm.messages = vm.messages.concat(data);
		  }
		  //$("#loading").hide();
		  $scope.loading = false;
		  commonService.hideLoading();
		  $(".top_header_All").hide();
		  if(vm.messages.length === 0) {
			$scope.hasDate = false;
		  }
		  vm.finishInit = true;
		  if (data.length === 0) {
			$cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
			  // success  
			}, function (error) {  
			  // error  
			});
			vm.moredata = true;
		  }
		  //成功2秒后广播
		  $timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.pageNo ++;
		  }, 2000);
		});
	  };

	  //var vm = $scope.vm = commonService.getWaterFallVM($scope, $scope.getData, "loading");
	  vm = $scope.vm = commonService.getWaterFallVM($scope, $scope.getDataByPojo, "loading");
	  vm.init();

	  //当点击搜索时调用
	  $scope.searchManager = function(isInit) {
		$scope.hasDate = true;
		$scope.loading = true;
		$scope.contractno = $("#contractno").val();
		$scope.lName = $("#lName").val();
		$scope.lSteel = $("#lSteel").val();
		$scope.date = $("#date").val();

		pojo.contractno = $scope.contractno;
		pojo.lName = $scope.lName;
		pojo.lSteel = $scope.lSteel;
		if($scope.date === "所有") {
		  pojo.dCreatedate = "";
		} else if($scope.date === "今日出货") {
		  pojo.dCreatedate = $filter("date")(new Date(), "yyyy-MM-dd");
		} else if($scope.date === "本周出货") {
		  var currentDate = new Date(); 
		  var millisecond = 1000 * 60 * 60 * 24;  
		  var minusDay = currentDate.getDay() != 0 ? currentDate.getDay()-1 : 6;     
		  pojo.dCreatedate = $filter("date")(new Date(currentDate.getTime() - (minusDay * millisecond)), "yyyy-MM-dd");
		} else if($scope.date === "本月出货") {
		  var curMonth = $filter("date")(new Date(), "yyyy-MM");
		  pojo.dCreatedate = curMonth + "-01";
		}

		lsblService.totalWeiAndQuaByPojo(pojo).then(function (data) {
		  $scope.totalWeight = (data.totalWeight/1000).toFixed(2);
		  $scope.totalWeighedWeight = (data.totalWeighedWeight/1000).toFixed(2);
		  $scope.totalQuantity = data.totalQuantity;

		  $("#dataStat").show();
		});

		//vm = $scope.vm = commonService.getWaterFallVM($scope, $scope.getDataByPojo, "loading");
		//vm.init();

		//重新初始化页码和数据
		if(isInit) {
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