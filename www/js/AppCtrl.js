angular.module('ssapp.controllers', [])

	.controller('AppCtrl', ['$rootScope', '$scope', '$state', '$ionicLoading', function ($rootScope, $scope, $state, $ionicLoading) {
		/**
		* 监听页面载入完成，有一个转场时间，之后，做相应处理
		* @param e
		* @param state 当前页面的state
		*/
		$scope.$on('$ionicView.afterEnter', function(e, state) {
			if (!state.fromCache) {
				var initForPage = state.stateName + '-init'; //xxx-init
				$scope.$broadcast(initForPage);
			}
			/*if(state.stateName != "login" && state.stateName != "gesLogin") {
				var mobileDialogElement = $compile(data)($scope);
        		$('#userHTML').append(mobileDialogElement);
				$("ion-view").append("<ion-spinner id=\"loadingSpinner\" icon=\"dots\" class=\"spinner-calm spring-center\"></ion-spinner>");
				$("#loadingSpinner").show();
	  			$("ion-content").hide();
			}*/
			
		});

		$scope.$on('$stateChangeStart', function(e, state) {
			$ionicLoading.hide();
		});

		/*$scope.$on('$ionicView.loaded', function(e, state) {
			if (!state.fromCache) {
				var initForPage = state.stateName + '-init'; //xxx-init
				$scope.$broadcast(initForPage);
			}
			if(state.stateName != "login" && state.stateName != "gesLogin") {
				//var mobileDialogElement = $compile(data)($scope);
        		//$('#userHTML').append(mobileDialogElement);
				$("ion-view").append("<ion-spinner id=\"loadingSpinner\" icon=\"dots\" class=\"spinner-calm spring-center\"></ion-spinner>");
				$("#loadingSpinner").show();
	  			$("ion-content").hide();
			}
			
		});*/
		
		//在子controller中进行监听根controller的广播
		/*$scope.$on('xxx-init', function() {
			//加载远程数据
		});*/

	}]);
	
	