/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//工具箱模块服务
    .service('toolboxService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 根据合同号获取订单发货相关统计信息
            getOrderDeliveryStat: function (contractno) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/toolboxAdmin/getOrderDeliveryStat/" + contractno + commonService.getReqParamStr();
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