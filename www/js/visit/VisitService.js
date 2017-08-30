/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

    //销售机会与记录服务
    .service('saleChanceService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建销售机会
            postSaleChance: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/salechanAdmin/salechan" + commonService.getReqParamStr();
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
            //根据用户Id获取可查看的销售机会
            getSaleChancesByUid: function (userId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/salechanAdmin/getSalechansByUserPri/" + userId + commonService.getReqParamStr();
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
            //根据id获取销售机会
            getSaleChanceByid: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/salechanAdmin/salechan/" + id + commonService.getReqParamStr();
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
            // 新建销售机会记录或评论
            postSaleChanceReco: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/salechanRecoAdmin/salechanReco" + commonService.getReqParamStr();
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
            //根据用户Id和机会Id获取指定销售机会的记录
            selRecordsByUIdAndChance: function (uid, chanceId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/salechanRecoAdmin/selByUIdAndChance/" + uid + "," + chanceId + commonService.getReqParamStr();
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