/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//项目管理
    .service('ProjectService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            //根据关键字查询项目
            getProjectsByKey: function (userId, keyWords) {
                var dto = {
                    "salesmanIds": [userId],
                    "projectName": keyWords
                };
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/projectAdmin/searchProject" + commonService.getReqParamStr();
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
            //根据Id获取项目对象
            getProjectById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/projectAdmin/project/" + id + commonService.getReqParamStr();
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
            //根据searchDTO对象查询项目
            getProjectsByDTO: function (dto) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/projectAdmin/searchProject" + commonService.getReqParamStr();
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
        };
    }])
	//项目联系人管理
    .service('PContactService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            //根据项目id获取联系人列表
            getPcontactsByProId: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/pcontactAdmin/getPcontactsByProId/" + id + commonService.getReqParamStr();
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
            //根据searchDTO对象查询项目联系人
            getPContactsByDTO: function (dto) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/pcontactAdmin/searchPcontact" + commonService.getReqParamStr();
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
        };
    }])
    //项目跟进任务管理
    .service('PFollowService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            //根据id获取pfollow
            getPfollowById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/pfollowAdmin/pfollow/" + id + commonService.getReqParamStr();
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
            //根据pfollows
            getPfollowsByUserPri: function (userId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/pfollowAdmin/getPfollowsByUserPri/" + userId + commonService.getReqParamStr();
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
            //添加项目跟进任务
            postPfollow: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/pfollowAdmin/pfollow" + commonService.getReqParamStr();
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