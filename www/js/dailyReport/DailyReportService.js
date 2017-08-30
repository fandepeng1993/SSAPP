/**
 * ����servieceģ��
 * ��ģ���¶������е�service,�� app ����
 */
angular.module('ssapp.services')

	//�����ձ�����
    .service('dReportService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // �½������ձ�
            postReport: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dReportAdmin/dailyReport" + commonService.getReqParamStr();
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
            // ��ȡ����Ȧ�пɲ鿴Ա�������й����ձ�
            getReportsInWorkCir: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dReportAdmin/dReportsByUserPri/" + uid + ",2" + commonService.getReqParamStr();
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
            // ��ȡ����Ȧ�пɲ鿴Ա�������й����ձ��������أ�
            getReportsInWorkCirLazy: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dReportAdmin/dReportsByUserPriLazy/" + uid + ",2," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // ��ȡ���������ձ�
            getReportById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dReportAdmin/dailyReport/" + id + commonService.getReqParamStr();
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
            // ������ձ�
            fillReport: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dReportAdmin/fillDailyReport" + commonService.getReqParamStr();
                $http({
                    method: 'POST',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    /*transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },*/
                    data: data
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // ��ȡ��Ա�������Ѳ��ձ�����
            getFillCount: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dReportAdmin/getFillCount/" + uid + commonService.getReqParamStr();
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