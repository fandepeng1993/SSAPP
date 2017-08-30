/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//超排程服务
    .service('wftoService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 获取本月超排程
            getWftos: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wftoAdmin/wftos" + commonService.getReqParamStr();
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
            // 根据pageNo和pageSize获取本月超排程
            getWftosByPageNoAndSize: function (pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wftoAdmin/wftosByPageNoAndSize/" + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 获取本月各工序超排程总重量和总支数,totalWeight和totalQuantity
            wftoWeiAndCardNos: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wftoAdmin/wftoWeiAndCardNos" + commonService.getReqParamStr();
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