angular.module('ssapp.controllers')

// 不锈钢管计算器
.controller('bxggJsqCtrl',function($scope, $stateParams){
	var casenum=$stateParams.id;
	$scope.casenum=casenum;
	var needdata="";
	var jsonpdata={
          id1:{
            name:'不锈钢管',
            slectType:"请选择牌号",
            publicColum:[{name: "长度", column: "L"},{name: "重量", column: "W"}],
            privateColumn: [{name: "外径", column: "D"},{name: "壁厚", column: "S"}],
            ChooseBrand:[
              {series:'304系列',expressionW:'W=0.00002491*S*(D-S)*L',expressionH:'L=W/(0.00002491*S*(D-S))',parameter:'0.00002491'},
              {series:'321系列',expressionW:'W=0.00002491*S*(D-S)*L',expressionH:'L=W/(0.00002491*S*(D-S))',parameter:'0.00002491'},
              {series:'316系列',expressionW:'W=0.00002507*S*(D-S)*L',expressionH:'L=W/(0.00002507*S*(D-S))',parameter:'0.00002507'}
              ]
          },
          id2:{
            name:'不锈钢板材',
            slectType:"请选择材质",
            publicColum:[{name: "长度", column: "L"},{name: "重量", column: "W"}],
            privateColumn: [{name: "厚度", column: "d"},{name: "宽度", column: "w"}],
            ChooseBrand:[
              {series:'201',expressionW:'W=0.00000793*d*w*L',expressionH:'L=W/(0.00000793*d*w)',parameter:'0.00000793'},
              {series:'202',expressionW:'W=0.00000793*d*w*L',expressionH:'L=W/(0.00000793*d*w)',parameter:'0.00000793'},
              {series:'301',expressionW:'W=0.00000793*d*w*L',expressionH:'L=W/(0.00000793*d*w)',parameter:'0.00000793'},
              {series:'302',expressionW:'W=0.00000793*d*w*L',expressionH:'L=W/(0.00000793*d*w)',parameter:'0.00000793'},
              {series:'304',expressionW:'W=0.00000793*d*w*L',expressionH:'L=W/(0.00000793*d*w)',parameter:'0.00000793'},
              {series:'304L',expressionW:'W=0.00000793*d*w*L',expressionH:'L=W/(0.00000793*d*w)',parameter:'0.00000793'},
              {series:'305',expressionW:'W=0.00000793*d*w*L',expressionH:'L=W/(0.00000793*d*w)',parameter:'0.00000793'},
              {series:'310',expressionW:'W=0.00000793*d*w*L',expressionH:'L=W/(0.00000793*d*w)',parameter:'0.00000793'},
              {series:'321',expressionW:'W=0.00000793*d*w*L',expressionH:'L=W/(0.00000793*d*w)',parameter:'0.00000793'},
              {series:'309S',expressionW:'W=0.00000798*d*w*L',expressionH:'L=W/(0.00000798*d*w)',parameter:'0.00000798'},
              {series:'310S',expressionW:'W=0.00000798*d*w*L',expressionH:'L=W/(0.00000798*d*w)',parameter:'0.00000798'},
              {series:'316',expressionW:'W=0.00000798*d*w*L',expressionH:'L=W/(0.00000798*d*w)',parameter:'0.00000798'},
              {series:'316L',expressionW:'W=0.00000798*d*w*L',expressionH:'L=W/(0.00000798*d*w)',parameter:'0.00000798'},
              {series:'347',expressionW:'W=0.00000798*d*w*L',expressionH:'L=W/(0.00000798*d*w)',parameter:'0.00000798'},
              {series:'405',expressionW:'W=0.00000775*d*w*L',expressionH:'L=W/(0.00000775*d*w)',parameter:'0.00000775'},
              {series:'410',expressionW:'W=0.00000775*d*w*L',expressionH:'L=W/(0.00000775*d*w)',parameter:'0.00000775'},
              {series:'420',expressionW:'W=0.00000775*d*w*L',expressionH:'L=W/(0.00000775*d*w)',parameter:'0.00000775'},
              {series:'409',expressionW:'W=0.00000770*d*w*L',expressionH:'L=W/(0.00000770*d*w)',parameter:'0.00000770'},
              {series:'430',expressionW:'W=0.00000770*d*w*L',expressionH:'L=W/(0.00000770*d*w)',parameter:'0.00000770'},
              {series:'434',expressionW:'W=0.00000770*d*w*L',expressionH:'L=W/(0.00000770*d*w)',parameter:'0.00000770'}
            ]
          },
          id3:{
            name:'不锈钢圆钢',
            slectType:"请选择牌号",
            publicColum:[{name: "长度", column: "L"},{name: "重量", column: "W"}],
            privateColumn: [{name: "直径", column: "I"}],
            ChooseBrand:[
              {series:'青山标准：301',expressionW:'W=0.000006228*I*L',expressionH:'L=W/(0.000006228*I)',parameter:'0.000006228'},
              {series:'青山标准：303',expressionW:'W=0.000006228*I*L',expressionH:'L=W/(0.000006228*I)',parameter:'0.000006228'},
              {series:'青山标准：304',expressionW:'W=0.000006228*I*L',expressionH:'L=W/(0.000006228*I)',parameter:'0.000006228'},
              {series:'青山标准：316',expressionW:'W=0.000006228*I*L',expressionH:'L=W/(0.000006228*I)',parameter:'0.000006228'},
              {series:'青山标准：321',expressionW:'W=0.000006228*I*L',expressionH:'L=W/(0.000006228*I)',parameter:'0.000006228'},
              {series:'行业标准：301',expressionW:'W=0.00000623*I*L',expressionH:'L=W/(0.00000623*I)',parameter:'0.00000623'},
              {series:'行业标准：303',expressionW:'W=0.00000623*I*L',expressionH:'L=W/(0.00000623*I)',parameter:'0.00000623'},
              {series:'行业标准：304',expressionW:'W=0.00000623*I*L',expressionH:'L=W/(0.00000623*I)',parameter:'0.00000623'},
              {series:'行业标准：316',expressionW:'W=0.00000623*I*L',expressionH:'L=W/(0.00000623*I)',parameter:'0.00000623'},
              {series:'行业标准：316L',expressionW:'W=0.00000623*I*L',expressionH:'L=W/(0.00000623*I)',parameter:'0.00000623'},
              {series:'行业标准：321',expressionW:'W=0.00000623*I*L',expressionH:'L=W/(0.00000623*I)',parameter:'0.00000623'},
              {series:'行业标准：410',expressionW:'W=0.00000609*I*L',expressionH:'L=W/(0.00000609*I)',parameter:'0.00000609'},
              {series:'行业标准：420',expressionW:'W=0.00000609*I*L',expressionH:'L=W/(0.00000609*I)',parameter:'0.00000609'},
              {series:'行业标准：420j',expressionW:'W=0.00000609*I*L',expressionH:'L=W/(0.00000609*I)',parameter:'0.00000609'},
              {series:'行业标准：430',expressionW:'W=0.00000609*I*L',expressionH:'L=W/(0.00000609*I)',parameter:'0.00000609'},
              {series:'行业标准：431',expressionW:'W=0.00000609*I*L',expressionH:'L=W/(0.00000609*I)',parameter:'0.00000609'}
            ]
          }
  };

  needdata=jsonpdata['id'+casenum];
	$scope.title=needdata.name;
	$scope.privateColumn=needdata.privateColumn;
	$scope.slectType=needdata.slectType;
  $scope.ChooseBrand=needdata.ChooseBrand;
	$scope.ActiveClass=true;
  $scope.Wparameter=0;
  $scope.Lparameter=0;
	$scope.expressionW=0;
	$scope.expressionH=0;

  $scope.calcWeight=function () {
      var W=0;
      var L=$("#calc_wL").val()?$("#calc_wL").val():0;
      $.each($scope.privateColumn, function (index, item) {
        var value = $("#calc_w" + item.column).val();
        eval(item.column + "=" + (value ? value : 0) + ";");
      });
      if($scope.expressionW){
        eval($scope.expressionW);
      }else {
        console.log(123);
      }
    $scope.resultW=W;
  }
 $('#markNumber').on('change',function () {
   var c=Number($(this).val());
   $scope.Wparameter=(needdata.ChooseBrand)[c].parameter;
   $scope.expressionW=(needdata.ChooseBrand)[c].expressionW;
   $scope.calcWeight();
   $scope.$apply();
 })

  $scope.calcHeight=function () {
    var L=0;
    var W=$("#calc_hW").val()?$("#calc_hW").val():0;
    $.each($scope.privateColumn, function (index, item) {
      var value = $("#calc_h" + item.column).val();
      eval(item.column + "=" + (value ? value : 0) + ";");
    });
    if($scope.expressionH){
      eval($scope.expressionH);
    }else {
      console.log(123);
    }
    $scope.resultH=L;

  }
  $('#MarKNumberS').on('change',function () {
    var c=Number($(this).val());
    $scope.Lparameter=(needdata.ChooseBrand)[c].parameter;
    $scope.expressionH=(needdata.ChooseBrand)[c].expressionH;
    $scope.calcHeight();
    $scope.$apply();
  })
  dropDown('markNumber','','请选择牌号');
  dropDown('MarKNumberS','','请选择牌号');

})
