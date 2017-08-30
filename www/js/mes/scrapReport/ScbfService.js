/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//生产报废服务
    .service('vsrService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 获取本月及上月所有生产报废对象
            getVsrs: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vsrAdmin/vsrs" + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 根据pageNo和pageSize获取本月及上月所有生产报废对象
            getVsrsByPageNoAndSize: function (pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vsrAdmin/vsrsByPageNoAndSize/" + pageNo + "," + pageSize + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            }, 
            // 取本月及上月生产报废总重量和总支数。totalWeight和totalQuantity。
            totalWeiAndQua: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vsrAdmin/totalWeiAndQua" + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 取本月及上月各个工序的报废总重量和总支数。
            proNWeiAndQuas: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vsrAdmin/proNWeiAndQuas" + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
        };
    }]);