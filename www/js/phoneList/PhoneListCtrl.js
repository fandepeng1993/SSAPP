angular.module('ssapp.controllers')

//通讯录
.controller('TxlCtrl', function ($scope, $state, $ionicHistory, UserService, $timeout, $compile, commonService) {
  
  commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
    $scope.userMap = {};
    $scope.$on('tab.txl-init', function() {
    //$(function(){
      var Initials=$('.initials');
      var LetterBox=$('#letter');
      Initials.find('ul').append('<li>A</li><li>B</li><li>C</li><li>D</li><li>E</li><li>F</li><li>G</li><li>H</li><li>I</li><li>J</li><li>K</li><li>L</li><li>M</li><li>N</li><li>O</li><li>P</li><li>Q</li><li>R</li><li>S</li><li>T</li><li>U</li><li>V</li><li>W</li><li>X</li><li>Y</li><li>Z</li><li>#</li>');
      
      initials();
      $(".initials ul li").click(function(){
          var _this=$(this);
          var LetterHtml=_this.html();
          LetterBox.html(LetterHtml).fadeIn();
          Initials.css('background','#ccc');  
          setTimeout(function(){
              Initials.css('background','#fff');
              LetterBox.fadeOut();
          },100);
          var _index = _this.index();
          if(_index===0){
              $('ion-content').animate({scrollTop: '0px'}, 100);//点击第一个滚到顶部
          }else{
              var letter = _this.text();
              if($('#'+letter).length>0){
                  var LetterTop = document.getElementById(letter).offsetTop;
                  $('ion-content').animate({scrollTop: LetterTop+'px'}, 100);
              }
          }
      });
      var windowHeight=$('ion-view').height();
      var InitHeight=windowHeight-45;
      Initials.height(InitHeight);
      var LiHeight=InitHeight/30;
      Initials.find('li').height(LiHeight);
    });
    function initials() {//公众号排序
        var newDate = new Date().getTime();
        UserService.getSortUsers().then(function (data) {
          //$("#userHTML").append(data);
          //通过$compile动态编译html
          //alert(new Date().getTime() - newDate);
          //var html = data;
          //var template = angular.element(html);
          var mobileDialogElement = $compile(data)($scope);
          $('#userHTML').append(mobileDialogElement);
          commonService.hideLoading();
          //$scope.userHTML = data;
          //$scope.userMap = data;
          //alert(new Date().getTime() - newDate);
        });
    }

    $scope.viewTxlDetail = function (userId) {
      $state.go("tab.txl-find", {userId:userId});
    };
  //});
})

//通讯录人员详细信息
.controller('txlDetailCtrl', function($scope, $state, $stateParams,UserService,commonService) {
  var userId = $stateParams.userId;
  $scope.user = {};

  $scope.back = function () {
    window.history.go(-1);
  };
  
  UserService.getUserById(userId).then(function (data) {
    $scope.user = data;
  });

  $scope.phoneTo = function (phoneNum) {
    commonService.phoneTo(phoneNum);
  }

  $scope.mailTo = function (email) {
    window.location.href = "mailto:" + email;
  }
            
  $scope.smsTo = function (sms) {
    window.location.href = "sms:" + sms;
  }

  $scope.chatWith = function (user) {
    var targetId = "ss_" + user.userNo;
    var targetType = "user";
    $state.go("messageDetail", {targetId: targetId, targetType: targetType});
  }
});