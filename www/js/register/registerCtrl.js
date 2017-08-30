angular.module('ssapp.controllers')
.controller('registerCtrl', function($scope, $state, localStorageService,alertService,registerService) {
	$scope.switchIcon=false;
	$scope.phoneNumber=null;
	$scope.securityCode=function(phoneNumber){
		var pattern = /0?(13|14|15|18)[0-9]{9}/;
		if(pattern.test(phoneNumber)){
			console.log('调用短信接口',phoneNumber);
			registerService.sendSMSVerifyCode(phoneNumber).then(function(data) {
				if(data.status === 1) {
					alertService.showAlert($scope, data.msg, true, "success", null);
					setTimeout(function() {
						$state.go('securityCode', {telephone: phoneNumber});
					},1000);
				} else {
					alertService.showAlert($scope, data.msg, true, "fail", null);
					return;
				}
			});
		}else{
			alertService.showAlert($scope, "手机号格式错误", true, "fail", null);
		};
		
	}

})

.controller('setPwdCtrl',function($scope){
	$scope.seePwd=true;
	$scope.suffix="password";
	$scope.SeePwd=function(){
		if($scope.suffix=="password"){
			$scope.suffix="text"
		}else{
			$scope.suffix="password"
		}
	}
})

.controller('securityCodeCtrl',function($scope,$state,$stateParams,$ionicHistory,$interval,registerService,ConfigService,alertService){
	var telephone = $stateParams.telephone;
	$scope.imagesUrl = ConfigService.getHost() + '/loginAdmin/getVerifyCodeImage?t='+ new Date().getTime();
	$scope.secound=59;
	$scope.IssHOW=true;
	$scope.myfns=true;
	$scope.smsVerifyCode=null;
	$scope.imageVerifyCode=null;
	$scope.reloadVerifyCode=function(){
		$scope.imagesUrl = ConfigService.getHost() + '/loginAdmin/getVerifyCodeImage?t='+ new Date().getTime();
	};

	$scope.goback=function(){
		$ionicHistory.goBack();
	};

	$scope.nextStep=function(smsVerifyCode, imageVerifyCode){
		console.log('调用后端服务校验短信验证码和图片验证码',smsVerifyCode, imageVerifyCode);

		registerService.register(telephone, smsVerifyCode, imageVerifyCode).then(function(data) {
			if(data.status === 1) {
				alertService.showAlert($scope, data.msg, true, "success", null);
				setTimeout(function() {
					$state.go('login');
				},1000);
			} else {
				alertService.showAlert($scope, data.msg, true, "fail", null);
				return;
			}
		});
	};

	var reGetSMSVerifyCode = function(){
		console.log('执行短信验证再次发送接口');
		registerService.sendSMSVerifyCode(telephone).then(function(data) {
			if(data.status === 1) {
				alertService.showAlert($scope, data.msg, true, "success", null);
				setTimeout(function() {
					if(timer == null) move();
				},1000);
			} else {
				alertService.showAlert($scope, data.msg, true, "fail", null);
				return;
			}
		});

		$scope.myfns=true;
		$scope.IssHOW=true;
		$scope.secound=59;
		//if(timer == null) move();
	};

	$("#reGetCode").click(function() {
		reGetSMSVerifyCode();
	});
	
	var timer = null;
	function move(){
		timer=$interval(function(){
			$scope.secound--;
			if($scope.secound<1){
				$interval.cancel(timer);
				$scope.IssHOW=false;
				$scope.myfns=false;
				timer = null;
			}
		},1000);
	}
	move();
})

.controller('findPwdCtrl',function($scope,$state,$ionicHistory,alertService,registerService){
	$scope.FindPhone=null;
	$scope.securityCode = function(phoneNumber) {
		var pattern = /0?(13|14|15|18)[0-9]{9}/;
		if(pattern.test(phoneNumber)){
			console.log('调用短信接口',phoneNumber);
			registerService.sendSMSVerifyCode(phoneNumber).then(function(data) {
				if(data.status === 1) {
					alertService.showAlert($scope, data.msg, true, "success", null);
					setTimeout(function() {
						$state.go('securityCode', {telephone: phoneNumber});
					},1000);
				} else {
					alertService.showAlert($scope, data.msg, true, "fail", null);
					return;
				}
			});
		}else{
			alertService.showAlert($scope, "手机号格式错误", true, "fail", null);
		};
	}
});