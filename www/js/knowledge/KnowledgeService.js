/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')
	//知识库管理
    .service('knowLedgeService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 根据部门名称获取知识库文件
            knowledgesByDept: function (deptName) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/knowLedgeAdmin/selectByDeptName/" + deptName + commonService.getReqParamStr();
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
            // 根据类别名称获取知识库文件
            knowledgesByCategory: function (category) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/knowLedgeAdmin/selectByCategory/" + category + commonService.getReqParamStr();
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
            // 获取部门知识库列表及相关文件个数
            deptKnowledgesCount: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/knowLedgeAdmin/selDeptKnowLCount" + commonService.getReqParamStr();
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
            // 获取部门知识库列表及相关文件个数
            categoryKnowledgesCount: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/knowLedgeAdmin/selCategoryKnowLCount" + commonService.getReqParamStr();
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