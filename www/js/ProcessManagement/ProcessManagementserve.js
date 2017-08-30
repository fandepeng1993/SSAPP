angular.module('ssapp.services')

	//出差报告管理
    .service('processMgService', ['$http', '$q', 'ConfigService', 'commonService', 'localStorageService', function ($http, $q, ConfigService, commonService, localStorageService) {
        return {
            getProcessJson: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/js/oaProcessJson.js" + commonService.getReqParamStr();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                    	eval(data);
                        deferred.resolve(processJson);
                    });
                return deferred.promise;
            },
            // 发起流程
            startProcess: function (data, processDefinitionKey) {
                var deferred = $q.defer();
                var currentUserNo = localStorageService.get("User").userNo;
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/startProcess/" + currentUserNo + "," + processDefinitionKey + commonService.getReqParamStr();
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
            /* 待处理部分 */
            //查看待处理流程
            getWaitToDoTasks: function () {
                var deferred = $q.defer();
                var currentUserNo = localStorageService.get("User").userNo;
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/getAllTasks/" + currentUserNo + commonService.getReqParamStr();
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
            //查看流程图片url
            getProcessImg: function (taskId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/getProcessImg/" + taskId + commonService.getReqParamStr();
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
            //根据taskId获取流程变量
            getTaskVariables: function (taskId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/getTaskVariables/" + taskId + commonService.getReqParamStr();
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
            //根据taskId取得各级审批批注
            getProcessCommentsByTaskId: function (taskId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/getProcessComments/" + taskId + commonService.getReqParamStr();
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
            //根据proId获取流程变量
            getProVariables: function (proId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/getProVariables/" + proId + commonService.getReqParamStr();
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
            //根据proId取得各级审批批注
            getCommentsByProId: function (proId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/getCommentsByProId/" + proId + commonService.getReqParamStr();
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
            // 审核通过
            completeTask: function (data, taskId) {
                var deferred = $q.defer();
                var currentUserNo = localStorageService.get("User").userNo;
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/completeTask/" + currentUserNo + "," + taskId + commonService.getReqParamStr();
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
            // 驳回流程
            reject: function (data, taskId) {
                var deferred = $q.defer();
                var currentUserNo = localStorageService.get("User").userNo;
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/reject/" + currentUserNo + "," + taskId + commonService.getReqParamStr();
                console.log(data);
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
            /* 流程管理部分 */
            //获取自己发起的未完成流程
            getUnfinishedProcess: function () {
                var deferred = $q.defer();
                var currentUserNo = localStorageService.get("User").userNo;
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/getUnfinishedProcess/" + currentUserNo + commonService.getReqParamStr();
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
            //获取自己发起的已完成流程
            getFinishedProcess: function () {
                var deferred = $q.defer();
                var currentUserNo = localStorageService.get("User").userNo;
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/getFinishedProcess/" + currentUserNo + commonService.getReqParamStr();
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
            //根据processInstanceId流程撤销
            deleteProcess: function (processInstanceId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/deleteProcess/" + processInstanceId + commonService.getReqParamStr();
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
            /* 流程取回部分 */
            //获取可取回流程列表
            getCanBackProcess: function () {
                var deferred = $q.defer();
                var currentUserNo = localStorageService.get("User").userNo;
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/getCanBackProcess/" + currentUserNo + commonService.getReqParamStr();
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
            //取回流程
            backProcess: function (processInstanceId) {
                var deferred = $q.defer();
                var currentUserNo = localStorageService.get("User").userNo;
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/getBackProcess/" + currentUserNo + "," + processInstanceId + commonService.getReqParamStr();
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
            /* 流程通知部分 */
            //获取被通知流程列表
            getNoticProcess: function () {
                var deferred = $q.defer();
                var currentUserNo = localStorageService.get("User").userNo;
                var url = ConfigService.getHost() + "/OAProcessMgrAdmin/selectNotic/" + currentUserNo + commonService.getReqParamStr();
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