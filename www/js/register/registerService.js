/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//注册服务
    .service('registerService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            //向指定手机号发送验证码
            sendSMSVerifyCode: function (telephone) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/loginAdmin/sendSMSVerifyCode/" + telephone + commonService.getReqParamStr();
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
            // 注册
            register: function (telephone, smsVerifyCode, imageVerifyCode) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/loginAdmin/register/" + telephone + "," + smsVerifyCode + "," + imageVerifyCode + commonService.getReqParamStr();
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