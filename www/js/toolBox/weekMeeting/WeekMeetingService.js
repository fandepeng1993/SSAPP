/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//周例会议题服务
    .service('weekMeetingService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建周例会议题
            postWeekMeeting: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/weekMeetingAdmin/weekMeetings" + commonService.getReqParamStr();
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
            //根据用户Id获取周例会列表（懒加载）
            selectByPriLazy: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/weekMeetingAdmin/selectByPriLazy/" + uid + "," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            //根据用户Id和周数获取周例会详情
            selByUIdAndWeek: function (uid, week) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/weekMeetingAdmin/selByUIdAndWeek/" + uid + "," + week + commonService.getReqParamStr();
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