/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//生产台账服务
    .service('vprService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 获取当天的生产台账
            getVprs: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/vprs/" + uid + commonService.getReqParamStr();
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
            // 根据pageNo和pageSize获取当天的生产台账
            getVprsByPageNoAndSize: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/vprsByPageNoAndSize/" + uid + ","  + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 获取当月优秀员工
            getGoodUsers: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/goodUsers" + commonService.getReqParamStr();
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
            // 获取当天生产台账的总重量和总支数,totalWeight和totalQuantity
            totalWeiAndQua: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/totalWeiAndQua" + commonService.getReqParamStr();
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
            // 根据工序名称获取当天的生产台账
            getVprsByPro_N: function (produceM_Name) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/vprsByProduceMName/" + produceM_Name + commonService.getReqParamStr();
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
            // 通过工序名称，查询当天该工序生产台账的总重量和总支数。
            totalWeiAndQuaByPro_N: function (produceM_Name) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/totalWeiAndQuaByPro_N/" + produceM_Name + commonService.getReqParamStr();
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
            // 根据用户姓名获取当天的生产台账
            getVprsByUser_N: function (userName, fromdate) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/vprsByUserName/" + fromdate + "?userName=" + userName + "&" + commonService.getReqParamStr().substring(1,commonService.getReqParamStr().length);
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
            // 根据pageNo和pageSize获取当天该用户的生产台账
            userVprsByPageNoAndSize: function (userName, fromdate, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/userVprsByPageNoAndSize/" + fromdate + "," + pageNo + "," + pageSize + "?userName=" + userName + "&" + commonService.getReqParamStr().substring(1,commonService.getReqParamStr().length);
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
            // 通过员工名称，查询当天该员工生产台账的总重量和总支数。
            totalWeiAndQuaByUser_N: function (userName) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/totalWeiAndQuaByUser_N/" + userName + commonService.getReqParamStr();
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
            // 根据用户名称和月份获取每天的台账统计量
            reportDatasByUName: function (userName, year, month) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/reportDatasByUName/" + year + "," + month + "?userName=" + userName + "&" + commonService.getReqParamStr().substring(1,commonService.getReqParamStr().length);
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {"userName":userName}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 根据工序名称和月份获取每天的台账统计量
            reportDatasByProName: function (proName, year, month) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/vprAdmin/reportDatasByProName/" + year + "," + month + "?proName=" + proName + "&" + commonService.getReqParamStr().substring(1,commonService.getReqParamStr().length);
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {proName:proName}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
        };
    }])
	
	//员工信息服务
    .service('hrEmpService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 获取员工信息
            getHrEmps: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/hrEmpAdmin/hrEmployees/" + uid + commonService.getReqParamStr();
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