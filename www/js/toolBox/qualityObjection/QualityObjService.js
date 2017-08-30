/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//客户管理服务
    .service('cusService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建客户
            postCustomer: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/cusAdmin/customer" + commonService.getReqParamStr();
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

			//根据关键字查询项目
            getProjectsByKey: function (userId, keyWords) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/ProjectAdmin/getProjectsByKey?keyWords=" + keyWords + "&" + commonService.getReqParamStr().substring(1,commonService.getReqParamStr().length);
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

            // 更新客户
            updateCustomer: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/cusAdmin/customer" + commonService.getReqParamStr();
                $http({
                    method: 'PUT',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: data
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //根据searchDTO对象查询客户
            getCusesByDTO: function (dto) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/cusAdmin/searchCustomer" + commonService.getReqParamStr();
                $http({
                    method: 'POST',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: dto
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //根据Id获取客户对象
            getCusById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/cusAdmin/customer/" + id + commonService.getReqParamStr();
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
	
	//质量异议服务
    .service('qualityObjService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建质量异议
            postQualityObj: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/qualityObjectAdmin/qualityObjection" + commonService.getReqParamStr();
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
            // 更新质量异议
            updateQualityObj: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/qualityObjectAdmin/qualityObjection" + commonService.getReqParamStr();
                $http({
                    method: 'PUT',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: data
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            //根据用户Id获取用户在质量异议中的角色
            getUserRoleInQua: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/qualityObjectAdmin/getUserRoleInQua/" + uid + commonService.getReqParamStr();
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
            //根据用户Id获取可查看的质量异议（懒加载）
            selectByPriLazy: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/qualityObjectAdmin/selectByPriLazy/" + uid + "," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            //根据Id获取质量异议
            selectById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/qualityObjectAdmin/qualityObjection/" + id + commonService.getReqParamStr();
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