/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//单件流服务
    .service('vofService', ['$http', '$q', 'ConfigService', 'commonService', 'localStorageService', function ($http, $q, ConfigService, commonService, localStorageService) {
        return {
            // 获取本月及上月单件流
            getVofs: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vofAdmin/vofs" + commonService.getReqParamStr();
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
            // 根据pageNo和pageSize获取本月及上月单件流
            getVofsByPageNoAndSize: function (pageNo, pageSize) {
                var userId = localStorageService.get("User").userId;
                var deferred = $q.defer();
                //var url = ConfigService.getHost() + "/vofAdmin/vofsByPageNoAndSize/" + pageNo + "," + pageSize + commonService.getReqParamStr();
                var url = ConfigService.getHost() + "/vofAdmin/vofsByUserIdLazy/" + userId + "," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 根据生产框号获取所有单件流对象（详细信息）
            getVofDetail: function (produceM_BillNo) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vofAdmin/vofDetail/" + produceM_BillNo + commonService.getReqParamStr();
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
            // 根据生产框号获取相关统计信息
            getVofData: function (produceM_BillNo) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vofAdmin/vofDataDTO/" + produceM_BillNo + commonService.getReqParamStr();
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