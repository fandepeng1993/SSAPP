/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')
	//密码锁屏
    .service('LoginService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {
        return {
            getLoginPattern: function() {
                return localStorageService.get('User').keyboardLock;
            },
            setLoginPattern: function(pattern) {
                var user = localStorageService.get('User');
                user.keyboardLock = pattern;
                localStorageService.set("User", user);
                //localStorageService.set('login_pattern', pattern);
            },
            checkLoginPattern: function(pattern) {
                var deferred = $q.defer();
                var promise = deferred.promise;
     
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                };
                if (pattern == this.getLoginPattern()) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
                return promise;
            }
        };

    }]);