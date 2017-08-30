/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//订单服务
    .service('dSchedulesService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 通过用户名称获取该用户所有订单列表
            dSchedulesByUName: function (userName) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dSchedulesAdmin/dSchedulesByUserName?userName=" + userName + "&" + commonService.getReqParamStr().substring(1,commonService.getReqParamStr().length);
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
            // 通过合同号获取该合同所有订单列表
            dSchedulesByContractNo: function (contractNo) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dSchedulesAdmin/dSchedulesByContractNo/" + contractNo + commonService.getReqParamStr();
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
            // 通过用户名称,pageNo和pageSize获取该用户指定订单列表
            dSchedulesByUNameLazy: function (userName, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dSchedulesAdmin/dSchedulesByUserNameLazy/" + pageNo + "," + pageSize + "?userName=" + userName + "&" + commonService.getReqParamStr().substring(1,commonService.getReqParamStr().length);
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
            // 通过合同号,pageNo和pageSize获取该合同指定订单列表
            dSchedulesByContractNoLazy: function (contractNo, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dSchedulesAdmin/dSchedulesByContractNoLazy/" + contractNo + "," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 根据合同号获取订单明细
            dSchedulesDetailByContractNo: function (contractNo) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dSchedulesDetailAdmin/selectByContractNo/" + contractNo + commonService.getReqParamStr();
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
            // 获取所有员工的销售量统计数据
            getSaleStatistics: function (uid, year) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dSchedulesAdmin/saleStatisticsByYear/" + uid + "," + year + commonService.getReqParamStr();
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
            // 获取某个员工的销售目标数据
            getSellgoalByUName: function (userName, year) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/sellgoalAdmin/getSellgoalsByUserName/" + year + "?userName=" + userName + "&" + commonService.getReqParamStr().substring(1,commonService.getReqParamStr().length);
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
			// 根据开始时间和结束时间获取订单统计数据
            orderStatisticsByDate: function (fromdate, enddate) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dSchedulesDetailAdmin/orderStatisticsByDate/" + fromdate + "," + enddate + commonService.getReqParamStr();
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