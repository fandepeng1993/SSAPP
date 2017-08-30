/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//平台信息服务
    .service('dataService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 查看总经办子部门
            getDepts: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/deptAdmin/getDeptByPid/5" + commonService.getReqParamStr();
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
            // 查看对应Id的平台信息
            getDataById: function (dataId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dataAdmin/data/" + dataId + commonService.getReqParamStr();
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
            //查看对应部门及其子部门的所有平台信息
            getDatasByDeptId: function (deptId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dataAdmin/datasByDeptId/" + deptId + commonService.getReqParamStr();
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


            // 新建平台信息评论
            postDataReply: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dataReplyAdmin/reply" + commonService.getReqParamStr();
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
            // 根据平台信息dataId获取所有回复
            getReplysByDataId: function (dataId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dataReplyAdmin/getReplysByDataId/" + dataId + commonService.getReqParamStr();
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
            // 新建或更新平台信息回复点赞
            postDataVote: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dataVoteAdmin/vote" + commonService.getReqParamStr();
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
            // 根据用户获取所有点赞的平台信息回复
            getDataVoteByUId: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dataVoteAdmin/getVotesByUserId/" + uid + commonService.getReqParamStr();
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