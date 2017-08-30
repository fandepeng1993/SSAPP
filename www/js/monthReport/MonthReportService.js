/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')
	//月度总结服务
    .service('mReportService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建月度总结
            postReport: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/mReportAdmin/monthlyReport" + commonService.getReqParamStr();
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
            // 获取工作圈中可查看员工的所有月度总结
            getReportsInWorkCir: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/mReportAdmin/mReportsByUserPri/" + uid + ",2" + commonService.getReqParamStr();
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
            // 获取工作圈中可查看员工的所有月度总结（懒加载）
            getReportsInWorkCirLazy: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/mReportAdmin/mReportsByUserPriLazy/" + uid + ",2," + pageNo + "," + pageSize + commonService.getReqParamStr();
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