/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//简报服务
    .service('briefingService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 根据权限及用户获取总工作简报
            workBriefingByPri: function (uid, fromdate, enddate) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/briefingAdmin/workBriefingByPri/" + uid + "," + fromdate + "," + enddate + commonService.getReqParamStr();
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
            // 根据权限及用户获取总销售简报
            sellBriefingByPri: function (uid, fromdate) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/briefingAdmin/sellBriefingByPri/" + uid + "," + fromdate + commonService.getReqParamStr();
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
            // 根据权限及用户获取总拜访简报
            visitBriefingByPri: function (uid, fromdate) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/briefingAdmin/visitBriefingByPri/" + uid + "," + fromdate + commonService.getReqParamStr();
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
            // 根据权限及用户获取未拜访客户信息
            noVisitCusByPri: function (uid, fromdate) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/briefingAdmin/noVisitCusByPri/" + uid + "," + fromdate + commonService.getReqParamStr();
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