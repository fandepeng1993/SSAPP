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
	
	//联系人管理服务
    .service('contactService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建联系人
            postContact: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/contactAdmin/contact" + commonService.getReqParamStr();
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
            // 更新联系人
            updateContact: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/contactAdmin/contact" + commonService.getReqParamStr();
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
            //根据Id获取联系人对象
            getContactById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/contactAdmin/contact/" + id + commonService.getReqParamStr();
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
            //根据客户Id获取联系人对象
            getContactsByCusId: function (cusId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/contactAdmin/getContactsByCusId/" + cusId + commonService.getReqParamStr();
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
	
	//拜访服务
    .service('visitService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建拜访
            postVisit: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/visitPlanAdmin/visit" + commonService.getReqParamStr();
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
            //获取指定Id的拜访对象
            getVisitById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/visitPlanAdmin/visit/" + id + commonService.getReqParamStr();
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
            //根据DTO搜索拜访对象(查询自己)
            searchVisit: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/visitPlanAdmin/searchVisit" + commonService.getReqParamStr();
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
            //根据DTO搜索拜访对象(根据用户权限查询)
            searchVisitWithPri: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/visitPlanAdmin/searchVisitWithPri" + commonService.getReqParamStr();
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
        };
    }])
	
	//回访记录服务
    .service('visitRecordService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建回访记录
            postVisitRecord: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/visitRecordAdmin/visitRecord" + commonService.getReqParamStr();
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
            //获取指定Id的拜访对象
            getVisitRecordById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/visitRecordAdmin/visitRecord/" + id + commonService.getReqParamStr();
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
            //根据DTO搜索回访记录对象
            searchVisitRecord: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/visitRecordAdmin/searchVisitRecord" + commonService.getReqParamStr();
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
        };
    }]);