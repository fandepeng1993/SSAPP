/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')
	//社区服务
    .service('socialService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 新建话题或回复
            postBlog: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/blogAdmin/blog" + commonService.getReqParamStr();
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
            // 获取所有的话题
            getTopics: function () {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/blogAdmin/getBlogsByRootId/" + 1 + commonService.getReqParamStr();
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
            // 获取所有的话题（懒加载）
            getTopicsLazy: function (pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/blogAdmin/getBlogsByRootIdLazy/" + 1 + "," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 获取单个Blog
            getBlogById: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/blogAdmin/blog/" + id + commonService.getReqParamStr();
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
            // 根据话题BlogId获取所有回复
            getBlogsByRootId: function (rootId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/blogAdmin/getBlogsByRootId/" + rootId + commonService.getReqParamStr();
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
            // 根据话题BlogId获取所有回复（懒加载）
            getBlogsByRootIdLazy: function (rootId, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/blogAdmin/getBlogsByRootIdLazy/" + rootId + "," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 根据话题BlogId获取所有回复（懒加载）
            getReplysByTopicLazy: function (topicId, pageNo, pageSize) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/blogAdmin/getReplysByTopicLazy/" + topicId + "," + pageNo + "," + pageSize + commonService.getReqParamStr();
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
            // 根据话题BlogId获取回复数量
            getCountByRootId: function (rootId) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/blogAdmin/getCountByRootId/" + rootId + commonService.getReqParamStr();
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
            // 阅读话题
            readBlog: function (id) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/blogAdmin/readBlog/" + id + commonService.getReqParamStr();
                $http({
                    method: 'PUT',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {}
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            // 新建或更新点赞
            postVote: function (data) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/voteAdmin/vote" + commonService.getReqParamStr();
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
            // 根据用户获取所有点赞的Blog
            getVoteByUId: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/voteAdmin/getVotesByUserId/" + uid + commonService.getReqParamStr();
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