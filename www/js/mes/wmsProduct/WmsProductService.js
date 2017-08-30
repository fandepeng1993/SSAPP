/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//产品库存服务
    .service('viewWmsProService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 根据起止时间统计库存信息
            statisticWMSProduct: function (fromdate, enddate) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/viewWmsProAdmin/statisticWMSProduct/" + fromdate + "," + enddate + commonService.getReqParamStr();
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
            // 根据仓库代码（warehouseCode）和起止时间统计库存信息
            statisticWMSProByCode: function (code, fromdate, enddate) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/viewWmsProAdmin/statisticWMSProByCode/" + code + "," + fromdate + "," + enddate + commonService.getReqParamStr();
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
            // 根据仓库代码（warehouseCode）获取产品库存明细
            getVWPsByCode: function (code) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/viewWmsProAdmin/vwpsByCode/" + code + commonService.getReqParamStr();
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
            // 根据仓库代码（warehouseCode）获取产品库存明细
            getVWPsByCodeLazy: function (code, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/viewWmsProAdmin/vwpsByCodeLazy/" + code + "," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
    }])
    //产品库存服务
    .service('widService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 获取本月产品库存
            getWids: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/widAdmin/wids" + commonService.getReqParamStr();
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
            // 根据pageNo和pageSize获取本月产品库存
            getWidsByPageNoAndSize: function (pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/widAdmin/widsByPageNoAndSize/" + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 获取本月产品库存总重量和总支数,totalWeight和totalQuantity
            totalWeiAndQua: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/widAdmin/totalWeiAndQua" + commonService.getReqParamStr();
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
    }])
    //产品库存服务
    .service('wmsProductService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 获取本月产品库存
            getWmsProducts: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wmsProductAdmin/wmsProducts" + commonService.getReqParamStr();
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
            // 根据pageNo和pageSize获取本月产品库存
            getWmsProductsByPageNoAndSize: function (pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wmsProductAdmin/wmsProductsByPageNoAndSize/" + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 获取本月产品库存总重量和总支数,totalWeight和totalQuantity
            totalWeiAndQua: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wmsProductAdmin/totalWeiAndQua" + commonService.getReqParamStr();
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