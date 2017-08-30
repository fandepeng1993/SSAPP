angular.module('ssapp.controllers')

// 订单发货数据统计
.controller('DdfhCtrl',function($scope, $state, commonService, toolboxService, ConfigService, localStorageService, alertService) {
  $scope.isInit = true;
  $scope.hasData = true;
  $scope.showChartPage = false;
  $scope.searchText = "";
  //commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    var initChart = function (contactno) {
      $scope.showChartPage = false;
      $scope.loading = true;
      toolboxService.getOrderDeliveryStat(contactno).then(function (ddfhData) {
        if(ddfhData.sumOrder === 0) {
          $scope.hasData = false;
          $scope.loading = false;
          $scope.isInit = false;
          return;
        }
        //订单总重量
        $scope.sumOrder = parseFloat(ddfhData.sumOrder.toFixed(1));
        //发货过磅总重量
        $scope.sumWeighedWeight = parseFloat(ddfhData.sumWeighedWeight.toFixed(1));
        //未发重量
        $scope.noDeliverWeight = parseFloat((ddfhData.sumOrder - ddfhData.sumWeighedWeight).toFixed(1));

        //构建HighChart
        /*var colors = Highcharts.getOptions().colors,
        categories = ['已发重量:' + $scope.sumWeighedWeight + 'kg', '未发重量:' + $scope.noDeliverWeight + 'kg'],
        name = 'Browser brands',
        data = [{
                y: $scope.sumWeighedWeight,
                color: colors[9],
                drilldown: {
                    name: 'MSIE versions',
                    categories: ['订单总重量'],
                    data: [$scope.sumOrder],
                    color: colors[9]
                }
            },{
                y: $scope.noDeliverWeight,
                color: colors[2],
                drilldown: {
                    name: 'Opera versions',
                    categories: [],
                    data: [],
                    color: colors[2]
                }
            }];
        var browserData = [];
        var versionsData = [];
        for (var i = 0; i < data.length; i++) {
            browserData.push({
                name: categories[i],
                y: data[i].y,
                color: data[i].color
            });
            for (var j = 0; j < data[i].drilldown.data.length; j++) {
                var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
                versionsData.push({
                    name: data[i].drilldown.categories[j],
                    y: data[i].drilldown.data[j],
                    color: Highcharts.Color(data[i].color).brighten(brightness).get()
                });
            }
        }*/
        Highcharts.chart('container', {
            chart: {
                type: 'column',
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    viewDistance: 25,
                    depth: 40
                }
            },
            title: {
                text: '合同号：' + ddfhData.contractno
            },
            subtitle: {
                text: '结算方式：' + ddfhData.settlement
            },
            xAxis: {
                categories: ['订单发货重量统计']
            },
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: '重量（kg）'
                }
            },
            tooltip: {
                headerFormat: '<b>{point.key}</b><br>',
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} kg/ {point.stackTotal} kg'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    depth: 40
                }
            },
            series: [{
                name: '未发重量',
                data: [$scope.noDeliverWeight],
                stack: 'male',
                color:'#FF0000'
            }, {
                name: '已发重量',
                data: [$scope.sumWeighedWeight],
                stack: 'male'
            }, {
                name: '订单总重量',
                data: [$scope.sumOrder],
                stack: 'female',
                color:'#66CD00'
            }]
        });
        /*$('#container').highcharts({
            chart: {
                type: 'pie'
            },
            title: {
                text: '合同号：' + ddfhData.contractno + "---" + ddfhData.settlement
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    center: ['50%', '50%']
                }
            },
            tooltip: {
                valueSuffix: 'kg'
            },
            series: [{
                name: '重量',
                data: browserData,
                size: '80%',
                dataLabels: {
                    formatter: function() {
                        return this.y > 5 ? this.point.name : null;
                    },
                    color: 'black',
                    distance: -80
                }
            }, {
                name: '重量',
                data: versionsData,
                size: '90%',
                innerSize: '80%',
                dataLabels: {
                    formatter: function() {
                        // display only if larger than 1
                        return this.y > 1 ? '<b>'+ this.point.name +':</b> '+ this.y +'kg'  : null;
                    }
                }
            }]
        });*/
        //$("#loading").hide();
        //$ionicLoading.hide();
        $scope.hasData = true;
        $scope.loading = false;
        $scope.isInit = false;
        $scope.showChartPage = true;
        //commonService.hideLoading();
      });
    };

    //initChart('S301-SH161214003');

    $scope.searchData = function () {
      if($scope.searchText === "") {
        alertService.showAlert($scope, "请先填写合同号！", true, "warning", null);
        return;
      }
      initChart($scope.searchText);
    }
  });
});