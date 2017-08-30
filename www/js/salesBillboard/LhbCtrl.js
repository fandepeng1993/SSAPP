angular.module('ssapp.controllers')

// 龙虎榜
.controller('netInCtrl',function($scope, $state, commonService, dSchedulesService, TimeService, ConfigService, localStorageService) {
  //commonService.showLoading();
  //$scope.$on($state.current.name + "-init", function() {
    var beginWeek = TimeService.beginWeek();
    var endWeek = TimeService.endWeek();
    var beginMonth = TimeService.beginMonth();
    var endMonth = TimeService.endMonth();
    var beginLastWeek = TimeService.beginLastWeek();
    var endLastWeek = TimeService.endLastWeek();
    var beginLastMonth = TimeService.beginLastMonth();
    var endLastMonth = TimeService.endLastMonth();
    
    var num = 0;
    //上周
    dSchedulesService.orderStatisticsByDate(beginLastWeek, endLastWeek).then(function (data) {
      //alert(angular.toJson(data));
      $scope.lastWeekNetIn1 = data[0];
      $scope.lastWeekNetIn2 = data[1];
      $scope.lastWeekNetIn3 = data[2];
      $scope.lastWeekNetIn = data.splice(3,data.length);
      num++;
      if(num === 4) commonService.hideLoading();
    });
    //本周
    dSchedulesService.orderStatisticsByDate(beginWeek, endWeek).then(function (data) {
      $scope.weekNetIn1 = data[0];
      $scope.weekNetIn2 = data[1];
      $scope.weekNetIn3 = data[2];
      $scope.weekNetIn = data.splice(3,data.length);
      num++;
      if(num === 4) commonService.hideLoading();
    });
    //上月
    dSchedulesService.orderStatisticsByDate(beginLastMonth, endLastMonth).then(function (data) {
      $scope.lastMonthNetIn1 = data[0];
      $scope.lastMonthNetIn2 = data[1];
      $scope.lastMonthNetIn3 = data[2];
      $scope.lastMonthNetIn = data.splice(3,data.length);
      num++;
      if(num === 4) commonService.hideLoading();
    });
    //本月
    dSchedulesService.orderStatisticsByDate(beginMonth, endMonth).then(function (data) {
      $scope.monthNetIn1 = data[0];
      $scope.monthNetIn2 = data[1];
      $scope.monthNetIn3 = data[2];
      $scope.monthNetIn = data.splice(3,data.length);
      num++;
      if(num === 4) commonService.hideLoading();
    });

    $scope.getUserName = function (user) {
      if(typeof(user) === "undefined") {
        return "虚位以待";
      }
      if(typeof(user.key) === "object") {
        //if(user.key.userName === "") return user.key.userName;
        return user.key.userName;
      } else if(typeof(user.key) === "string") {
        return user.key;
      } else {
        return "";
      }
    }

    $scope.getUserPhotoUrl = function (user) {
      if(typeof(user) === "undefined") {
        return "img/default.png";
      }
      if(typeof(user.key) === "object" && user.key.photoUrl != "") {
        return user.key.photoUrl;
      } else {
        return "img/default.png";
      }
    }

    $scope.formatValue = function (value) {
      if(typeof(value) != "undefined") {
        if(value > 1000) {
          return (value/1000).toFixed(2) + "t";
        }
        return value + "kg";
      } else {
        return "";
      }
    }

    // 龙虎榜--详细
    /*var getDetailFromDate = function (fromdate, enddate) {
      dSchedulesService.orderStatisticsByDate(fromdate, enddate).then(function (data) {
        $scope.netIns = data;
        if(data.length === 0) {
          $scope.hasDate = false;
        }
        commonService.hideLoading();
      });
    }*/
    /*getDetailFromDate(beginLastWeek, endLastWeek);
    getDetailFromDate(beginWeek, endWeek);
    getDetailFromDate(beginLastMonth, endLastMonth);
    getDetailFromDate(beginMonth, endMonth);*/

    /*$scope.viewDetail = function (str) {
      if(str === "lastWeek") {
        $state.go("lhb-in", {fromdate: beginLastWeek, enddate: endLastWeek});
      } else if(str === "week") {
        $state.go("lhb-in", {fromdate: beginWeek, enddate: endWeek});
      } else if(str === "lastMonth") {
        $state.go("lhb-in", {fromdate: beginLastMonth, enddate: endLastMonth});
      } else if(str === "month") {
        $state.go("lhb-in", {fromdate: beginMonth, enddate: endMonth});
      }
    };*/
  //});
})

// 龙虎榜--详细
.controller('netInDetailCtrl',function($scope, $state, $stateParams, commonService, dSchedulesService, TimeService, ConfigService, localStorageService) {
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $scope.hasDate = true;
    var fromdate = $stateParams.fromdate;
    var enddate = $stateParams.enddate;

    dSchedulesService.orderStatisticsByDate(fromdate, enddate).then(function (data) {
      $scope.netIns = data;
      if(data.length === 0) {
        $scope.hasDate = false;
      }
      commonService.hideLoading();
    });

    $scope.getUserName = function (user) {
      if(typeof(user) === "undefined") {
        return "虚位以待";
      }
      if(typeof(user.key) === "object") {
        return user.key.userName;
      } else {
        return "";
      }
    }

    $scope.getUserPhotoUrl = function (user) {
      if(typeof(user) === "undefined") {
        return "img/ben.png";
      }
      if(typeof(user.key) === "object" && user.key.photoUrl != "") {
        return user.key.photoUrl;
      } else {
        return "img/default.png";
      }
    }

    $scope.getMedal = function (index) {
      if(index === 0) {
        return "img/gold.jpg";
      } else if(index === 1) {
        return "img/yin.jpg";
      } else if(index === 2) {
        return "img/tong.jpg";
      } else {
        return "img/tie.jpg";
      }
    }
  });

  /*$scope.viewDetail = function (category) {
    $state.go("tab.xszy", {category: category});
  };*/
});