/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//入网证书服务
    .service('netInService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建入网证书
            postNetIn: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/NetinAdmin/Netin" + commonService.getReqParamStr();
                $http({
                    method: 'POST',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: data
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //根据pageNo和pageSize获取入网证书
            getNetIns: function (pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/NetinAdmin/netinsByPageNoAndSize/" + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            //根据关键字，pageNo和pageSize获取入网证书
            getNetInsByKey: function (keyWords, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/NetinAdmin/netinsByKeyLazy/" + pageNo + "," + pageSize + "?keyWords=" + keyWords + "&" + commonService.getReqParamStr().substring(1,commonService.getReqParamStr().length);
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