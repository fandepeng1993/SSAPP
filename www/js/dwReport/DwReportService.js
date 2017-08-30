/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')
	//部门周报服务
    .service('dwReportService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建部门周报
            postReport: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dwReportAdmin/deptWeekReport" + commonService.getReqParamStr();
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
            // 获取工作圈中可查看员工的所有部门周报
            getReportsInWorkCir: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dwReportAdmin/dwReportsByUserPri/" + uid + ",2" + commonService.getReqParamStr();
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
            // 获取工作圈中可查看员工的所有部门周报（懒加载）
            getReportsInWorkCirLazy: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dwReportAdmin/dwReportsByUserPriLazy/" + uid + ",2," + pageNo + "," + pageSize + commonService.getReqParamStr();
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