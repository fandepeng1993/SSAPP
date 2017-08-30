/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//荒管投料服务
    .service('vdftService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 获取本月荒管投料
            getVdfts: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vdftAdmin/vdfts" + commonService.getReqParamStr();
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
            // 根据pageNo和pageSize获取本月荒管投料
            getVdftsByPageNoAndSize: function (pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vdftAdmin/vdftsByPageNoAndSize/" + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 获取本月荒管投料总重量和总支数,totalWeight和totalQuantity
            totalWeiAndQua: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vdftAdmin/totalWeiAndQua" + commonService.getReqParamStr();
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