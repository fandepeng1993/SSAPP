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
    }])
    
    //�����ܱ�����
    .service('wReportService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // �½������ܱ�
            postReport: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wReportAdmin/weeklyReport" + commonService.getReqParamStr();
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
            // ��ȡ���������ܱ�
            getReportById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wReportAdmin/weeklyReport/" + id + commonService.getReqParamStr();
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
            // ��ȡ����Ȧ�пɲ鿴Ա�������й����ܱ�
            getReportsInWorkCir: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wReportAdmin/wReportsByUserPri/" + uid + ",2" + commonService.getReqParamStr();
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
            // ��ȡ����Ȧ�пɲ鿴Ա�������й����ܱ��������أ�
            getReportsInWorkCirLazy: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wReportAdmin/wReportsByUserPriLazy/" + uid + ",2," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
    
    //�ܼƻ�����
    .service('wPlanService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // �½��ܹ����ƻ�
            postPlan: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wPlanAdmin/weekPlan" + commonService.getReqParamStr();
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
            // ��ȡ�����ܼƻ�
            getPlanById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wPlanAdmin/weekPlan/" + id + commonService.getReqParamStr();
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
            // ��ȡ����Ȧ�пɲ鿴Ա�������й����ܼƻ�
            getPlansInWorkCir: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wPlanAdmin/wPlansByUserPri/" + uid + ",2" + commonService.getReqParamStr();
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
            // ��ȡ����Ȧ�пɲ鿴Ա�������в����ܼƻ��������أ�
            getPlansInWorkCirLazy: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/wPlanAdmin/wPlansByUserPriLazy/" + uid + ",2," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
    
    //����ظ��������Ķ�����
    .service('reportReplyService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // �½��ظ�
            postReportReply: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/reportReplyAdmin/reportReply" + commonService.getReqParamStr();
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
            // ���ݱ���Id�ͱ������ͣ�1--�ձ���2--�ܱ���3--�±���4--�����ܱ���5--�ܼƻ�����ȡ���лظ�
            selByReportIdAndCate: function (reportId, category) {

                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/reportReplyAdmin/selByReportIdAndCate/" + reportId + "," + category + commonService.getReqParamStr();
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
            // ���ݱ���Id�ͱ������ͣ�1--�ձ���2--�ܱ���3--�±���4--�����ܱ���5--�ܼƻ�����ȡ���е���
            selVoteByReportIdAndCate: function (reportId, category) {

                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/reportVoteAdmin/selByReportIdAndCate/" + reportId + "," + category + commonService.getReqParamStr();
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
            // �½�����±������
            postReportVote: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/reportVoteAdmin/reportVote" + commonService.getReqParamStr();
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
            // �½�����±����Ķ�
            postReadRec: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/reportReadRecAdmin/reportReadRec" + commonService.getReqParamStr();
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
            // ���ݱ���Id�ͱ������ͣ�1--�ձ���2--�ܱ���3--�±���4--�����ܱ���5--�ܼƻ�����ȡ�����Ķ�
            selReadRecByReportIdAndCate: function (reportId, category) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/reportReadRecAdmin/selByReportIdAndCate/" + reportId + "," + category + commonService.getReqParamStr();
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
    
    //�¶��ܽ����
    .service('mReportService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // �½��¶��ܽ�
            postReport: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/mReportAdmin/monthlyReport" + commonService.getReqParamStr();
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
            // ��ȡ�����¶��ܽ�
            getReportById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/mReportAdmin/monthlyReport/" + id + commonService.getReqParamStr();
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
            // ��ȡ����Ȧ�пɲ鿴Ա���������¶��ܽ�
            getReportsInWorkCir: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/mReportAdmin/mReportsByUserPri/" + uid + ",2" + commonService.getReqParamStr();
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
            // ��ȡ����Ȧ�пɲ鿴Ա���������¶��ܽᣨ�����أ�
            getReportsInWorkCirLazy: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/mReportAdmin/mReportsByUserPriLazy/" + uid + ",2," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
    
    //�����ܱ�����
    .service('dwReportService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // �½������ܱ�
            postReport: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dwReportAdmin/deptWeekReport" + commonService.getReqParamStr();
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
            // ��ȡ���������ܱ�
            getReportById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dwReportAdmin/deptWeekReport/" + id + commonService.getReqParamStr();
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
            // ��ȡ����Ȧ�пɲ鿴Ա�������в����ܱ�
            getReportsInWorkCir: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dwReportAdmin/dwReportsByUserPri/" + uid + ",2" + commonService.getReqParamStr();
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
            // ��ȡ����Ȧ�пɲ鿴Ա�������в����ܱ��������أ�
            getReportsInWorkCirLazy: function (uid, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/dwReportAdmin/dwReportsByUserPriLazy/" + uid + ",2," + pageNo + "," + pageSize + commonService.getReqParamStr();
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