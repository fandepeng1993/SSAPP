angular.module('ssapp.controllers')
.controller('processCtrl',function($scope, processMgService, localStorageService){
	// console.log(123);
	//流程定义及对应配置文件（包含menuCode等信息）
	var processJson = localStorageService.get("processJson");
	if(processJson === null) {
		processMgService.getProcessJson().then(function(data) {
			localStorageService.set("processJson", data);
		});
	} else {
		if(typeof(processJson) != "object") {
			localStorageService.set("processJson", angular.fromJson(processJson));
		}
	}
	
})

//发起流程大类列表页
.controller('sendProcessCtrl', function($scope, $ionicHistory){
	$scope.back = function(){
		$ionicHistory.goBack();
	};
})

//流程列表
.controller('sendProcessListDetailsCtrl',function($scope, $stateParams, $state, localStorageService){
		// var data=[1,2,3,4,5,6,7,8,9];
		$scope.show = function(processObj){
			$state.go("addProcessForm", {processDefinitionKey: processObj.processDefinitionKey});
		};
		var num=Number($stateParams.managename);
		var processJson = localStorageService.get("processJson");
		var datares=[
			{
				infos:['入职申请单','离职申请单'],
				photosrc:["img/ruzhi.png","img/lizhi.png"]
			},
			{	infos:['公章使用申请','出差申请单','出门出车单','外检通知单','应酬申请单','行政请购单'],
				photosrc:["img/gongzhang.png","img/chuchai.png","img/chumen.png","img/waijian.png","img/yinchou.png","img/xingzhengi.png"]
			},
			{
				infos:['付款申请单','其他费用申请','票据先行申请'],
				photosrc:["img/fukuan.png","img/qitafeiyong.png","img/piaoju.png"]
			},
			{
				infos:['加班单','补卡单','请假单'],
				photosrc:["img/waijian.png","img/yinchou.png","img/xingzhengi.png"]
			},
			// {
			// 	infos:['不合格品处置','库存改制申请','生产指令单','补料单','设备保修/保养单','退货通知单','采购超收申请单','更多'],
			// 	photosrc:"img/itlr.png"},
			// {
			// 	infos:['外发货通知单','客户来访联络函','承诺书','投标备案审批表','样品申请作业','订单变更/取消','订单结案','运输申请单','更多'],
			// 	photosrc:"img/itlr.png"},
			// {
			// 	infos:['加班单','补卡单','请假单','更多'],
			// 	photosrc:"img/itlr.png"}
		];

		var data = [];
		for(var i=0; i<datares[num-1].infos.length; i++) {
			var processObj = {};
			processObj.name = datares[num-1].infos[i];
			for(var key in processJson) {
				if(processObj.name === processJson[key].name) {
					//找到对应流程的配置了
					processObj = processJson[key];
				}
			}
			processObj.photoUrl = datares[num-1].photosrc[i];

			data.push(processObj);
		}
		$scope.data = data;
		console.log($scope.data);
})

// 发起流程
.controller('addProcessCtrl', function($scope, $state, $stateParams, $ionicHistory, localStorageService, FormService, processMgService, commonService, alertService){
	commonService.showLoading();
	$scope.$on($state.current.name + "-init", function() {
		$scope.back = function(){
			$ionicHistory.goBack();
		};


		/*datePicker('startDate');
		dropDown('salesProgress', '<span class="show-icon">请选择销售进度</span>', '请选择销售进度');*/


		var processDefinitionKey = $stateParams.processDefinitionKey;
		var processJson = localStorageService.get("processJson");
		$scope.curProcess = processJson[processDefinitionKey];

		//获取表单元素
		FormService.getFormsByMenuCode($scope.curProcess.menuCode).then(function(data) {
			console.log("表单元素：", data);
			$.each(data, function(index, item) {
				if(item.event != "") {
					item.event = angular.fromJson(item.event);
				}
				if(item.options != "") {
					item.options = angular.fromJson(item.options);
				}
			});
			//构造表单
			$scope.formObjs = data;
			setTimeout(function() { commonService.hideLoading(); });
		});

		$scope.save = function() {
			//构造提交数据到formObjJson
			var formObjJson = FormService.serializeFormObject($("#processForm"));
			formObjJson.processDefinitionKey = processDefinitionKey;
			console.log(formObjJson);
			//校验数据，通过后提交
			if(FormService.checkForm($("#processForm"), $scope)) {
				processMgService.startProcess(formObjJson, processDefinitionKey).then(function(data) {
					if(data.status == 1) {
						alertService.showAlert($scope, data.msg, true, "success", "processMg");
					} else {
						alertService.showAlert($scope, data.msg, true, "fail", null);
					}
				});
			}
		};

		console.log("curProcess", $scope.curProcess);
	});
})

// 待处理流程
.controller('ProcessToTreatedCtrl', function($scope, $ionicHistory, $state, processMgService, commonService){
	commonService.showLoading();
	$scope.$on($state.current.name + "-init", function() {
		$scope.viewProcessDetail = function(waitTodoTask){
			$state.go("processWaitTodoDetail", {taskId: waitTodoTask.taskId, processDefinitionKey: waitTodoTask.processDefinitionKey});
		};
		$scope.back = function(){
			$ionicHistory.goBack();
		};

		//获取待处理列表
		processMgService.getWaitToDoTasks().then(function(data) {
			console.log("待处理列表:", data);
			$scope.waitTodoTasks = data;
			setTimeout(function() { commonService.hideLoading(); });
		});
	});
})

// 待处理流程详情查看
.controller('processWaitTodoDetailCtrl', function($scope, $stateParams, $ionicModal, $ionicHistory, $state, processMgService, FormService, localStorageService, commonService, alertService){
	// 虚拟窗口
	$ionicModal.fromTemplateUrl('templates/ProcessManagement/modal.html', {
	    scope: $scope}).then(function(modal) {
	    $scope.modal1 = modal;
  	});
	commonService.showLoading();
	$scope.$on($state.current.name + "-init", function() {
		$scope.back = function(){
			$ionicHistory.goBack();
		};
		//选项卡控制
		(function(){
	      $('.rwgl-title .rwgl-title-left').click(function(){
	        $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
	        // $("#search").show();
	        $("#one").show();
	        $("#two").hide();
	      });
	      $('.rwgl-title .rwgl-title-right').click(function(){
	        $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
	        // $("#search").hide();
	        $("#one").hide();
	        $("#two").show();
	      });
	    })($);

		var taskId = $stateParams.taskId;

		var processDefinitionKey = $stateParams.processDefinitionKey;
		var processJson = localStorageService.get("processJson");
		$scope.curProcess = processJson[processDefinitionKey];
		
		var num = 0;
		//获取表单元素
		FormService.getFormsByMenuCode($scope.curProcess.menuCode).then(function(data) {
			console.log("表单元素：", data);
			$.each(data, function(index, item) {
				if(item.event != "") {
					item.event = angular.fromJson(item.event);
				}
				if(item.options != "") {
					item.options = angular.fromJson(item.options);
				}
			});
			//构造表单
			$scope.formObjs = data;
			num++;
			if(num === 3) {
				setTimeout(function() { commonService.hideLoading(); });
			}
		});

		$scope.fillDatas = null;
		//根据任务ID获取流程变量
		processMgService.getTaskVariables(taskId).then(function(data) {
			console.log("流程变量：",data);
			$scope.fillDatas = data;
			num++;
			if(num === 3) {
				setTimeout(function() { commonService.hideLoading(); });
			}
		});

		//根据taskId取得各级审批批注
		processMgService.getProcessCommentsByTaskId(taskId).then(function(data) {
			console.log("各级审批批注：",data);
			$scope.processComments = data;
			num++;
			if(num === 3) {
				setTimeout(function() { commonService.hideLoading(); });
			}
		});

		$scope.showModel = function() {
			$scope.modal1.show();
		};

		$scope.completeTask = function () {
			processMgService.completeTask({"opinion": $("#opinionTextarea").val()}, taskId).then(function(data) {
				if(data.status == 1) {
					setTimeout(function() {
						$scope.modal1.remove();
					},1000);
					
					alertService.showAlert($scope, data.msg, true, "success", "processMg");
				} else {
					alertService.showAlert($scope, data.msg, true, "fail", null);
				}
			});
		};

		$scope.reject = function () {
			processMgService.reject({"opinion": "驳回意见"}, taskId).then(function(data) {
				if(data.status == 1) {
					alertService.showAlert($scope, data.msg, true, "success", "processMg");
				} else {
					alertService.showAlert($scope, data.msg, true, "fail", null);
				}
			});
		};
	});
})

// 流程管理列表查看
.controller('processManageCtrl', function($scope, $ionicHistory, $state, processMgService, commonService){
	commonService.showLoading();
	$scope.$on($state.current.name + "-init", function() {
		(function(){
	      $('.rwgl-title .rwgl-title-left').click(function(){
	        $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
	        // $("#search").show();
	        $("#one").show();
	        $("#two").hide();
	      });
	      $('.rwgl-title .rwgl-title-right').click(function(){
	        $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
	        // $("#search").hide();
	        $("#one").hide();
	        $("#two").show();
	      });
	    })($);
		$scope.back = function(){
			$ionicHistory.goBack();
		};

		$scope.viewProcessDetail = function(process, type){
			//未完成 或 已完成
			$state.go("viewProcessDetail", {proId: process.processInstanceId, processDefinitionKey: process.processDefinitionKey, type: type});
		};

		var num = 0;
		//获取未完成流程
		processMgService.getUnfinishedProcess().then(function(data) {
			console.log("未完成流程列表:", data);
			$scope.unfinishedProcesses = data;
			if(++num === 2) {
				setTimeout(function() { commonService.hideLoading(); });
			}
		});

		//获取已完成流程
		processMgService.getFinishedProcess().then(function(data) {
			console.log("已完成流程列表:", data);
			$scope.finishedProcesses = data;
			if(++num === 2) {
				setTimeout(function() { commonService.hideLoading(); });
			}
		});
	});
})

// 流程详情查看
.controller('viewProcessDetailCtrl', function($scope, $stateParams,$ionicHistory, $state, processMgService, FormService, localStorageService, commonService, alertService){
	commonService.showLoading();
	$scope.$on($state.current.name + "-init", function() {
		$scope.back = function(){
			$ionicHistory.goBack();
		};
		//选项卡控制
		(function(){
	      $('.rwgl-title .rwgl-title-left').click(function(){
	        $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
	        // $("#search").show();
	        $("#one").show();
	        $("#two").hide();
	      });
	      $('.rwgl-title .rwgl-title-right').click(function(){
	        $(this).addClass('rwgl-ch').siblings().removeClass('rwgl-ch');
	        // $("#search").hide();
	        $("#one").hide();
	        $("#two").show();
	      });
	    })($);

		var proId = $stateParams.proId;
		$scope.type = $stateParams.type; //0--未完成；1--已完成；2--取回流程；3--查看流程详情
		var processDefinitionKey = $stateParams.processDefinitionKey;
		var processJson = localStorageService.get("processJson");
		$scope.curProcess = processJson[processDefinitionKey];
		
		var num = 0;
		//获取表单元素
		FormService.getFormsByMenuCode($scope.curProcess.menuCode).then(function(data) {
			console.log("表单元素：", data);
			$.each(data, function(index, item) {
				if(item.event != "") {
					item.event = angular.fromJson(item.event);
				}
				if(item.options != "") {
					item.options = angular.fromJson(item.options);
				}
			});
			//构造表单
			$scope.formObjs = data;
			if(++num === 3) {
				setTimeout(function() { commonService.hideLoading(); });
			}
		});

		$scope.fillDatas = null;
		//根据proId获取流程变量
		processMgService.getProVariables(proId).then(function(data) {
			console.log("流程变量：",data);
			$scope.fillDatas = data;
			if(++num === 3) {
				setTimeout(function() { commonService.hideLoading(); });
			}
		});

		//根据proId取得各级审批批注
		processMgService.getCommentsByProId(proId).then(function(data) {
			console.log("各级审批批注：",data);
			$scope.processComments = data;
			if(++num === 3) {
				setTimeout(function() { commonService.hideLoading(); });
			}
		});

		//对应未完成可执行的撤销操作
		$scope.deleteProcess = function () {
			processMgService.deleteProcess(proId).then(function(data) {
				console.log("撤销流程：",data);
				if(data.status == 1) {
					alertService.showAlert($scope, data.msg, true, "success", "processMg");
				} else {
					alertService.showAlert($scope, data.msg, true, "fail", null);
				}
			});
		};

		//对应可取回执行的取回操作
		$scope.backProcess = function () {
			processMgService.backProcess(proId).then(function(data) {
				console.log("取回流程：",data);
				if(data.status == 1) {
					alertService.showAlert($scope, data.msg, true, "success", "processMg");
				} else {
					alertService.showAlert($scope, data.msg, true, "fail", null);
				}
			});
		};
	});
})

// 流程取回
.controller('ProcessRecoveryCtrl', function($scope, $ionicHistory, $state, processMgService, commonService){
	commonService.showLoading();
	$scope.$on($state.current.name + "-init", function() {
		$scope.back = function(){
			$ionicHistory.goBack();
		};

		$scope.viewProcessDetail = function(process, type){
			//可取回
			$state.go("viewProcessDetail", {proId: process.processInstanceId, processDefinitionKey: process.processDefinitionKey, type: type});
		};

		//获取可取回流程列表
		processMgService.getCanBackProcess().then(function(data) {
			console.log("可取回流程列表:", data);
			$scope.canBackProcesses = data;
			setTimeout(function() { commonService.hideLoading(); });
		});
	});
})

// 查看通知
.controller('ViewNotificationCtrl', function($scope, $ionicHistory, $state, commonService){
	$scope.findMe = function(){
		$state.go("processWaitTodoDetail");
	};
	datePicker('startDate');
	$scope.back = function(){
		$ionicHistory.goBack();
	};
});