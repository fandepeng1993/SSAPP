/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//发货记录服务
    .service('lsblService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 获取所有发货记录
            getLsbls: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/lsblAdmin/lsbls" + commonService.getReqParamStr();
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
            // 获取所有发货记录(懒加载)
            getLsblsLazy: function (pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/lsblAdmin/lsblsByPageNoAndSize/" + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 根据开始时间获取所有发货记录
            getLsblsByDate: function (date) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/lsblAdmin/lsblsByDate/" + date + commonService.getReqParamStr();
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
            // 根据开始时间获取所有发货记录(懒加载)
            getLsblsByDateLazy: function (date, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/lsblAdmin/lsblsByDateLazy/" + date + "," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 获取所有发货记录(懒加载)
            getLsblsByPojoLazy: function (data, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/lsblAdmin/lsblsByPojo/" + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 获取所有发货记录的计划总重量，总支数和过磅总重量,totalWeight、totalQuantity和totalWeighedWeight
            totalWeiAndQua: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/lsblAdmin/totalWeiAndQua" + commonService.getReqParamStr();
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
            // 根据开始时间获取所有发货记录的计划总重量，总支数和过磅总重量,totalWeight、totalQuantity和totalWeighedWeight
            totalWeiAndQuaByDate: function (date) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/lsblAdmin/totalWeiAndQuaByDate/" + date + commonService.getReqParamStr();
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
            // 根据pojo对象获取所有发货记录的计划总重量，总支数和过磅总重量,totalWeight、totalQuantity和totalWeighedWeight
            totalWeiAndQuaByPojo: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/lsblAdmin/totalWeiAndQuaByPojo" + commonService.getReqParamStr();
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
        };
    }]);