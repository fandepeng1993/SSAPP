/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//制度及积分管理
    .service('instAndUScoreService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 根据岗位Id获取相关制度
            getInstsByCusId: function (positionId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/instAdmin/getInstsByPosId/" + positionId + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    params: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 根据员工Id获取该员工当月分数
            monthScoreByUId: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/uScoreAdmin/monthUScoreByEmpId/" + uid + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    params: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 新建用户积分
            postUserScore: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/uScoreAdmin/userScore" + commonService.getReqParamStr();
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
            // 获取用户的扣分记录
            getUScoresByEmpId: function (empId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/uScoreAdmin/getUScoresByEmpId/" + empId + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    params: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 获取用户的扣分记录（懒加载）
            getUScoresByEmpIdLazy: function (empId, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/uScoreAdmin/getUScoresByEmpIdLazy/" + empId + "," + pageNo + "," + pageSize + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    params: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 获取用户的考核薪资
            getUserCheckDatas: function (uid, date) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/checkDataAdmin/selectByUidAndDate/" + uid + "," + date + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    params: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
        };
    }]);