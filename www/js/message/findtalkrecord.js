angular.module('ssapp.controllers')
.controller('findtalkCtrl', function($scope, UserService){
	var h1=$(window).height();
	var h2=$('.bar-header').innerHeight();
	var h3=$('.addfriend_list').outerHeight()+20;
	var h4=$('.talkrecord').innerHeight();
	var hcha=h1-h2-h3-h4;
	$scope.heis={'height':hcha+'px'};
});