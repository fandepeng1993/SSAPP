angular.module('ssapp.controllers')
		.controller('txfilectrl',function($scope){
			var wH=$(window).height();
			var bH=$('.bar-header').innerHeight();
			var sH=$('.tsb-icons').innerHeight();
			var cha=wH-bH-sH;
			var he=cha+'px';
			$scope.myObj = {
             "height" : he,
             "overflow-y":"scroll"
    }
			
});
