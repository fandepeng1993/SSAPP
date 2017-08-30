/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')
	//周计划服务
    .service('wPlanService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建周工作计划
            postPlan: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wPlanAdmin/weekPlan" + commonService.getReqParamStr();
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
            // 获取工作圈中可查看员工的所有工作周计划
            getPlansInWorkCir: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wPlanAdmin/wPlansByUserPri/" + uid + ",2" + commonService.getReqParamStr();
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
            // 获取工作圈中可查看员工的所有部门周计划（懒加载）
            getPlansInWorkCirLazy: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wPlanAdmin/wPlansByUserPriLazy/" + uid + ",2," + pageNo + "," + pageSize + commonService.getReqParamStr();
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