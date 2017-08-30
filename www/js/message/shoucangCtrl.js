angular.module('ssapp.controllers')
.controller('shoucangCtrl', function($scope, $stateParams, UserService, commonService, $ionicHistory) {
	$scope.back = function(){
		$ionicHistory.goBack();
	};
	var h1 = $(window).height();
	var h2 = $('.bar-header').innerHeight();
	var h3 = $('.addfriend_list').outerHeight() + 20;
	var hcha = h1 - h2 - h3;
	console.log(h1,h2,h3);
	$scope.hess = {'height':hcha+'px','border-top': '1px solid #d9d9d9'};
});