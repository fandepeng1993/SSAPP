/**
 * 定义serviece模块
 * 该模块下定义所有的service,和 app 常量
 */
angular.module('ssapp.services')

	//消息服务
    .service('msgService', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            // 获取用户各类未读消息个数
            unreadCountsByUId: function (uid) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/uMsgMarkAdmin/unreadCountsByUId/" + uid + commonService.getReqParamStr();
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
            // 根据userId和类别category获取用户消息标记
            UMsgMarksByUIdAndCate: function (uid, category) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/uMsgMarkAdmin/UMsgMarksByUIdAndCate/" + uid + "," + category + commonService.getReqParamStr();
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
            // 阅读消息之后根据userId和类别更新
            readByCategory: function (uid, category) {
                var deferred = $q.defer();
                var url = ConfigService.getHost() + "/uMsgMarkAdmin/readByCategory/" + uid + "," + category + commonService.getReqParamStr();
                $http({
                    method: 'POST',
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

    //jMessage即时通讯服务
    .service('jMessageService', ['$http', '$q', '$filter', '$rootScope', '$state', 'ConfigService', 'commonService', 'IMChatService', 'localStorageService', 'ToastService', function ($http, $q, $filter, $rootScope, $state, ConfigService, commonService, IMChatService, localStorageService, ToastService) {
        var across_appkey = '95811b694b5efcc279dc7cb6';
        var disconnectInterval;

        var runDisconnectFunCount = 0;//断线函数中的定时任务执行次数。
        //对断线情况进行处理的函数
        var handleDisconnect = function() {
            disconnectInterval = window.setInterval(function() {
                runDisconnectFunCount++;
                jMessageObj.init();
                if(runDisconnectFunCount > 50) window.clearInterval(disconnectInterval); //定时任务执行超过50次，销毁断线处理定时任务
            }, 500);
        };
        try {
            window.JIM = new JMessage({
                // debug : true
            });
            JIM.onDisconnect(function(){
                handleDisconnect();
            }); //异常断线监听
        } catch(e) {
            //alert(e);
        }

        var loginTime = 0;
        var lock = false;//用于给函数加锁
		var isLogin = false;

        var allMsgArr = [];//待处理的消息数组
        var isHandling = false;

        function getFile() {
            var fd = new FormData();
            var file = document.getElementById('file_box');
            if(!file.files[0]) {
                appendToDashboard('error:' + '获取文件失败');
                throw new Error('获取文件失败');
            }
            fd.append(file.files[0].name, file.files[0]);
            return fd;
        };
		
		var alreadyInit = false;//确定是否进行过初始化
        var intervalId;

        var oldTime = null;
        var jMessageObj = {
			setMsgEventHandleFun: function (msgEventHandleFun) {
                appendMessageFun = msgEventHandleFun;
            },
            init: function () {
                if(oldTime == null)
                    oldTime = new Date().getTime();

				alreadyInit = true;
                var deferred = $q.defer();
                var now = new Date().getTime();
                var signature = hex_md5("appkey=" + across_appkey + "&"
                        + "timestamp=" + now + "&"
                        + "random_str=aaaaaaaaaaaaaaaaaaaa&"
                        + "key=5bb690d252ebf20984caba8f").toUpperCase();

                var imInit = function() {
                    try{
                        JIM.init({
                            "appkey": across_appkey,
                            "random_str": "aaaaaaaaaaaaaaaaaaaa",
                            "signature": signature,
                            "timestamp": now,
                        }).onSuccess(function(data) {
                            runDisconnectFunCount = 0;
                            window.clearInterval(intervalId); //销毁初始化定时任务
                            window.clearInterval(disconnectInterval); //销毁断线处理定时任务
                            //登陆
                            jMessageObj.login();
                            deferred.resolve(data);
                        }).onFail(function(data) {
                        });
                    }catch(e){
                    }
                };

                var num = 0;
                //IMChatService.setMsgEventHandleFun(msgEventHandleFun);
                var imInitFun = function() {
                    num++;
                    if(num>20) window.clearInterval(intervalId); //重复20次（10s）后，若还登不上，则取消定时执行任务
                    imInit();
                };
                intervalId = window.setInterval(imInitFun, 500);
                imInitFun();

                //确定本地确实有相关表
                IMChatService.createMsgTable().then(function (data) {
                    IMChatService.createCommunicateTable().then(function (data) {
                        //alert(new Date().getTime() - oldTime);
                    });
                });
                
                return deferred.promise;
            },
            register: function () {
                var userNo = localStorageService.get("User").userNo;
                var userName = "ss_" + userNo;
                var password = "ss_" + userNo;
                JIM.register({
                    'username' : userName,
                    'password': password,
                    'is_md5' : false
                }).onSuccess(function(data) {
                    //注册成功自动登陆
                    if(!isLogin) jMessageObj.login();
                }).onFail(function(data) {
                    console.log('error:' + JSON.stringify(data));
                });
            },
            login: function () {
				if(!alreadyInit) {
					jMessageObj.init();
					return;
				}
                var userNo = localStorageService.get("User").userNo;
                var userName = "ss_" + userNo;
                var password = "ss_" + userNo;
                JIM.login({
                    'username' : userName,
                    'password' : password
                }).onSuccess(function(data) {
                    isLogin = true;
                    //alert("login ok");
                    //更新自己的昵称
                    var nickName = localStorageService.get("User").userName;
                    //登陆成功更新昵称
                    JIM.updateSelfInfo({
                            'nickname' : nickName, // 昵称
                           }).onSuccess(function(data) {
                    }).onFail(function(data) {
                    });

                    //监听接收消息
                    JIM.onMsgReceive(function(data) {
                        jMessageObj.receiveMsg(data.messages);
                    });
                    //监听接收离线消息
                    JIM.onSyncConversation(function(data) { //离线消息同步监听
                        $.each(data, function(index, item) {
                            $.each(item.msgs, function(index, msgItem) {
                                if(msgItem.content.target_type === "group") msgItem.from_gid = item.key;
                            });
                            jMessageObj.receiveMsg(item.msgs);
                        });
                    });
                    //监听点击通知栏消息
                    //document.addEventListener("jmessage.onOpenMessage", jMessageObj.onOpenMessage, false);
                    
                }).onFail(function(data) {
                    loginTime++;
                    if(loginTime > 20) return;
                    //若返回失败，并确认失败原因是未注册，则进行注册
                    if(data.code === 880103) {
                        jMessageObj.register();
                    }
                }).onTimeout(function(data) {
                });
            },
            logout: function () {
                JIM.loginOut();
            },
            getUserInfo: function (userName) {
                var deferred = $q.defer();
                try {
                    JIM.getUserInfo({
                        'username' : userName
                    }).onSuccess(function(response) {
                        response = response.user_info;
                        if(typeof(response) != "object") response = angular.fromJson(response);
                        deferred.resolve(response);
                    }).onFail(function(data) {
                    });
                } catch(e) {
                    handleDisconnect();
                }

                return deferred.promise;
            },
            onOpenMessage: function (msg) {
                var msgObj = jMessageObj.formatJson(msg, "receive");
                $state.go("messageDetail", {targetId: msgObj.targetId, targetType: msgObj.targetType});
            },
            /*receiveMsg: function (result) {
                $.each(result, function (index, item) {
                    jMessageObj.handleReceiveMsg(item);
                });
            },*/
            receiveMsg: function (result) {
                allMsgArr = allMsgArr.concat(result);
                var handleMsgQueue = function() {
                    if(allMsgArr[0]) {
                        isHandling = true;
                        if(device.platform === "Android") {
                            jMessageObj.handleReceiveMsg(allMsgArr[0]).then(function() {
                                allMsgArr.shift();
                                handleMsgQueue();
                            });
                        } else {
                            setTimeout(function() {
                                jMessageObj.handleReceiveMsg(allMsgArr[0]).then(function() {
                                    allMsgArr.shift();
                                    handleMsgQueue();
                                });
                            }, 300);
                        }
                        
                    } else {
                        isHandling = false;
                    }
                };
                if(!isHandling) handleMsgQueue();
            },
            formatJson: function (result, type) {
                //处理接收到或发送的消息
                var createdate = $filter("date")(new Date(result.content.create_time), "yyyy-MM-dd HH:mm:ss");
                var fromUserId = result.content.from_id;
                
                var targetType = result.content.target_type === "single" ? "user" : result.content.target_type;
                var targetId;
                if(targetType === "user") {
                    targetId = result.content.target_id;
                } else {
                    targetId = result.from_gid;
                }
                var msgType = result.content.msg_type;
                var content = result.content.msg_body.text;
                var msgId = result.msg_id;
                //将消息整理成msgObj的json
                var msgObj = {
                    "msgId": msgId,
                    "fromUserId": fromUserId, 
                    "targetId": targetId, 
                    "targetType": targetType,
                    "content": content, 
                    "msgType": msgType, 
                    "resourceUrl": "", 
                    "localResourcePath": "",
                    "state": 0,
                    "createdate": createdate
                };
                return msgObj;
            },
            handleMsg: function (result, receiveOrSend) {
                var deferred = $q.defer();
                var msgObj = {};

                if(receiveOrSend === "send") {
                    msgObj = result;
                } else if(receiveOrSend === "receive") {
                    msgObj = jMessageObj.formatJson(result, receiveOrSend);
                }
                //插入消息（与用户或群组的消息）
                IMChatService.insertMsg(msgObj).then(function (data) {
                    checkLockAndPersist();
                });
                var persistCommunicate = function(msgObj) {
                    lock = true;//加锁
                    var user = localStorageService.get("User");
                    var curUserId = "ss_" + user.userNo;
                    //查询消息记录中是否已有与该用户的通话，确定插入还是更新消息记录
                    IMChatService.selectCommunicateByUser(curUserId).then(function (data) {
                        var targetId = msgObj.targetId;
                        if(targetId === curUserId) targetId = msgObj.fromUserId;
                        
                        var addOrUpdate = "add";
                        $.each(data, function (index, item) {
                            if(item.targetId === targetId+"" && item.targetType === msgObj.targetType) {
                                //更新对话记录
                                addOrUpdate = "update";
                            }
                        });
                        try {
                            if(addOrUpdate === "add") {
                                //还没有与该对象产生对话记录，新建对话记录，否则更新对话记录
                                IMChatService.insertCommunicate(curUserId, msgObj.fromUserId, targetId, msgObj).then(function (subData) {
                                    result.receiveOrSend = receiveOrSend;
                                    $rootScope.$broadcast('hasNewMsg',result);
                                    deferred.resolve("success");
                                    lock = false;//打开锁
                                }, function (error) {
                                    deferred.resolve("error");
                                    lock = false;//打开锁
                                });
                            } else if(addOrUpdate === "update") {
                                //更新对话记录
                                IMChatService.updateCommunicate(curUserId, msgObj.fromUserId, targetId, msgObj).then(function (subData) {
                                    result.receiveOrSend = receiveOrSend;
                                    $rootScope.$broadcast('hasNewMsg',result);
                                    deferred.resolve("success");
                                    lock = false;//打开锁
                                }, function (error) {
                                    deferred.resolve("error");
                                    lock = false;//打开锁
                                });
                            }
                        } catch(e) {
                            //发生异常时，要打开锁
                            deferred.resolve("error");
                            lock = false;//打开锁
                        }
                    });
                };

                var checkNum = 0;//判断轮训的次数
                var checkLockAndPersist = function () {
                    setTimeout(function () {
                        checkNum++;
                        if(checkNum > 2000) {
                            lock = false;//若轮训次数超过2000次，则打开锁。
                        }
                        //alert(checkNum + "---" + lock);
                        if(!lock) persistCommunicate(msgObj);
                        else {
                            checkLockAndPersist();
                        }
                    }, 20);
                }
                return deferred.promise;
            },
            handleReceiveMsg: function (result) {
                var deferred = $q.defer();
                //处理接收到的消息
                jMessageObj.handleMsg(result, "receive").then(function(result) {
                    deferred.resolve(result);
                });

                //本地通知
                var targetType = result.content.target_type === "single" ? "user" : result.content.target_type;
                var title = "";
                var targetId = "";
                if(targetType === "user") {
                    targetId = result.content.from_id;
                    title = result.content.from_name === "" ? result.content.from_id : result.content.from_name;
                } else {
                    targetId = result.from_gid;
                    title = result.content.target_name === "" ? result.from_gid : result.content.target_name;
                }
                
                var builderId = 3; //本地通知样式
                var content = result.content.msg_body.text;
                var notificationID = result.msg_id;
                var broadcastTime = 1; //设置本地通知触发时间，为距离当前时间的数值，单位是毫秒

                //判断是否免打扰
                jMessageObj.getNoDisturb(targetId, targetType).then(function(result) {
                    var isNoDisturb = result;
                    if(device.platform === "Android" && !isNoDisturb) {
                        plugins.jPushPlugin.addLocalNotification(builderId, content, title,
                                            notificationID, broadcastTime, {targetId: targetId, targetType: targetType});
                    } else if(!isNoDisturb) {
                        window.plugins.jPushPlugin.getApplicationIconBadgeNumber(function(result) {
                            plugins.jPushPlugin.addLocalNotificationForIOS(broadcastTime, content,
                                            result, notificationID, {targetId: targetId, targetType: targetType});
                        });
                    }
                });
                return deferred.promise;
            },
            handleSendMessage: function (result) {
                //处理发送的消息
                jMessageObj.handleMsg(result, "send");
            },
            errorCallBack: function (response) {
                console.log("send message fail" + response);
                response = response + "";
                var errorCode = response.substring(0, 6);
                switch(errorCode) {
                case "871102":
                    ToastService.showShortBottom("请求失败，请检查网络!");
                    break;
                case "898002":
                    ToastService.showShortBottom("消息发送失败！即时通讯模块尚未存在该用户！");
                    break;
                case "871310":
                    ToastService.showShortBottom("网络连接已断开，请检查网络!");
                    break;
                case "871302":
                    ToastService.showShortBottom("发送消息的消息体过大，整个消息体大小不能超过4k!");
                    break;
                case "810007":
                    ToastService.showShortBottom("添加成员失败，请勿重复添加用户!");
                    break;
                case "810008":
                    ToastService.showShortBottom("添加成员失败，成员数量超出讨论组拥有的最大成员数上限!");
                    break;
                }
            },
            sendTextMessage: function (targetId, targetType, content, successCallBack) {
                var onSuccess = function(response) {
                    //成功回调
                    if(typeof(response) != "object") response = angular.fromJson(response);
                    successCallBack(response);
                    var msgObj = {
                        "msgId": response.msg_id,
                        "fromUserId": "ss_"+localStorageService.get("User").userNo, 
                        "targetId": targetId, 
                        "targetType": targetType,
                        "content": content, 
                        "msgType": "text", 
                        "resourceUrl": "", 
                        "localResourcePath": "",
                        "state": 0,
                        "createdate": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                    };
                    jMessageObj.handleSendMessage(msgObj);
                };
                try {
                    if(targetType === "user") {
                        JIM.sendSingleMsg({
                            'target_username' : targetId,
                            'target_nickname' : '',
                            'content' : content,
                            'appkey' : across_appkey
                        }).onSuccess(function(response) {
                            onSuccess(response);
                        }).onFail(function(response) {
                            jMessageObj.errorCallBack(response);
                        });
                    } else if(targetType === "group") {
                        JIM.sendGroupMsg({
                            'target_gid' : targetId,
                            'target_gname' : '',
                            'content' : content
                        }).onSuccess(function(response) {
                            onSuccess(response);
                        }).onFail(function(response) {
                            jMessageObj.errorCallBack(response);
                        });
                    }
                } catch(e) {
                    handleDisconnect();
                }
                
            },
            sendImageMessage: function (targetId, targetType, imageUrl, successCallBack) {
                try {
                    if(targetType === "user") {
                        JIM.sendSinglePic({
                            'target_username' : targetId,
                            'target_nickname' : '',
                            'appkey' : across_appkey,
                            'image' : getFile()
                        }).onSuccess(function(response) {
                            //成功回调
                            if(typeof(response) != "object") response = angular.fromJson(response)
                            successCallBack(response);
                            //jMessageObj.handleSendMessage(angular.fromJson(response));
                        }).onFail(function(response) {
                            jMessageObj.errorCallBack(response);
                        });
                    } else if(targetType === "group") {
                        JIM.sendGroupPic({
                            'target_gid' : targetGid,
                            'target_gname' : targetGName,
                            'image' : getFile()
                        }).onSuccess(function(response) {
                            //成功回调
                            if(typeof(response) != "object") response = angular.fromJson(response)
                            successCallBack(response);
                            //jMessageObj.handleSendMessage(angular.fromJson(response));
                        }).onFail(function(response) {
                            jMessageObj.errorCallBack(response);
                        });
                    }
                } catch(e) {
                    handleDisconnect();
                }
            },
            createGroup: function (groupName, groupDesc, usernameStr) {
                var deferred = $q.defer();
                if(groupDesc === "") groupDesc = "还没有群公告！";
                try {
                    JIM.createGroup({
                        'group_name' :  groupName,
                        'group_description' : groupDesc
                    }).onSuccess(function(data) {
                        //添加相关成员
                        jMessageObj.addGroupMembers(data.gid, usernameStr).then(function(result) {
                            deferred.resolve(data.gid);
                        });
                    }).onFail(function(errorMsg) {
                        jMessageObj.errorCallBack(errorMsg);
                    });
                } catch(e) {
                    handleDisconnect();
                }
                
                return deferred.promise;
            },
            getGroupIds: function () {
                var deferred = $q.defer();
                try {
                    JIM.getGroups().onSuccess(function(data) {
                        if(typeof(data) != "object") data = angular.fromJson(data);
                        deferred.resolve(data);
                    }).onFail(function(data) {
                    });
                } catch(e) {
                    handleDisconnect();
                }
                return deferred.promise;
            },
            getGroupInfo: function (groupId) {
                var deferred = $q.defer();
                try {
                    JIM.getGroupInfo({'gid':groupId}).onSuccess(function(data) {
                        if(typeof(data) != "object") data = angular.fromJson(data);
                        deferred.resolve(data);
                    }).onFail(function(data) {
                        //alert("error getGroupInfo");
                    });
                } catch(e) {
                    handleDisconnect();
                }
                return deferred.promise;
            },
            updateGroupName: function (groupId, newName) {
                var deferred = $q.defer();
                jMessageObj.getGroupInfo(groupId).then(function(data) {
                    try {
                        JIM.updateGroupInfo( {'group_name' : newName,'group_description' : data.group_info.desc,'gid':groupId}).onSuccess(function(data) {
                            deferred.resolve("success");
                        }).onFail(function(data) {
                            //alert(angular.toJson(data));
                        });
                    } catch(e) {

                    }
                });
                return deferred.promise;
            },
            updateGroupDescription: function (groupId, newDesc) {
                var deferred = $q.defer();
                jMessageObj.getGroupInfo(groupId).then(function(data) {
                    try {
                        JIM.updateGroupInfo( {'group_name' : data.group_info.name,'group_description' : newDesc,'gid':groupId}).onSuccess(function(data) {
                            deferred.resolve("success");
                        }).onFail(function(data) {
                            //alert(angular.toJson(data));
                        });
                    } catch(e) {
                        handleDisconnect();
                    }
                });
                return deferred.promise;
            },
            //- groupId：群组 ID。
            //- usernameStr：要添加的用户名字符串，形如：'username1,username2'。
            addGroupMembers: function (groupId, usernameStr) {
                var deferred = $q.defer();
                var usernames = usernameStr.split(",");
                var usernameArr = [];
                for(var i=0; i<usernames.length; i++) {
                    usernameArr.push({'username': usernames[i]});
                }
                try {
                    JIM.addGroupMembers({'gid':groupId,'member_usernames':usernameArr}).onSuccess(function(data) {
                        deferred.resolve("success");
                    }).onFail(function(errorMsg) {
                        jMessageObj.errorCallBack(errorMsg);
                    });
                } catch(e) {
                    handleDisconnect();
                }
                return deferred.promise;
            },
            //- groupId：群组 ID。
            //- usernameStr：要删除的用户名字符串，形如：'username1,username2'。
            removeGroupMembers: function (groupId, usernameStr) {
                var deferred = $q.defer();
                var usernames = usernameStr.split(",");
                var usernameArr = [];
                for(var i=0; i<usernames.length; i++) {
                    usernameArr.push({'username': usernames[i]});
                }
                try {
                    JIM.delGroupMembers({'gid':groupId,'member_usernames':usernameArr}).onSuccess(function(data) {
                        deferred.resolve("success");
                    }).onFail(function(errorMsg) {
                        jMessageObj.errorCallBack(errorMsg);
                    });
                } catch(e) {
                    handleDisconnect();
                }
                return deferred.promise;
            },
            exitGroup: function (groupId) {
                var deferred = $q.defer();
                try {
                    JIM.exitGroup({'gid':groupId}).onSuccess(function(data) {
                        deferred.resolve("success");
                    }).onFail(function(data) {
                        //alert("exitGroup fail--" + angular.toJson(data));
                    });
                } catch(e) {
                    handleDisconnect();
                }
                return deferred.promise;
            },
            getGroupMembers: function (groupId) {
                var deferred = $q.defer();
                try {
                    JIM.getGroupMembers({'gid':groupId}).onSuccess(function(data) {
                        if(typeof(data) != "object") data = angular.fromJson(data);
                        deferred.resolve(data);
                    }).onFail(function(data) {
                        //alert('error:' + JSON.stringify(data));
                    });
                } catch(e) {
                    handleDisconnect();
                }
                return deferred.promise;
            },
            // 设置对某个用户或群组免打扰。isNoDisturb: 0 - 普通状态，1 - 免打扰状态。
            setNoDisturb: function (targetId, targetType, isNoDisturb) {
                var deferred = $q.defer();
                try{
                    if(targetType === "user") {
                        if(!isNoDisturb) {
                            JIM.delSingleNoDisturb({
                                'target_name' : targetId
                                //'appkey' : across_appkey
                            }).onSuccess(function(data) {
                                deferred.resolve(data);
                            }).onFail(function(data) {
                            });
                        } else {
                            JIM.addSingleNoDisturb({
                                'target_name' : targetId,
                                //'appkey' : across_appkey
                            }).onSuccess(function(data) {
                                deferred.resolve(data);
                            }).onFail(function(data) {
                            });
                        }
                    } else if(targetType === "group") {
                        if(!isNoDisturb) {
                            JIM.delGroupNoDisturb({
                                'gid' : targetId
                            }).onSuccess(function(data) {
                                deferred.resolve(data);
                            }).onFail(function(data) {
                            });
                        } else {
                            JIM.addGroupNoDisturb({
                                'gid' : targetId
                            }).onSuccess(function(data) {
                                deferred.resolve(data);
                            }).onFail(function(data) {
                            });
                        }
                    }
                } catch(e) {
                    handleDisconnect();
                }
                return deferred.promise;
            },
            // 获取对特定用户的免打扰状态。0 - 普通状态，1 - 免打扰状态。
            getNoDisturb: function (targetId, targetType) {
                var deferred = $q.defer();
                var isNoDisturb = 0;
                try {
                    JIM.getNoDisturb().onSuccess(function(data) {
                        if(targetType === "user") {
                            $.each(data.no_disturb.users, function(index, item) {
                                if(item.username === targetId) {
                                    isNoDisturb = 1;
                                }
                            });
                        } else if(targetType === "group") {
                            $.each(data.no_disturb.groups, function(index, item) {
                                if(item.gid === parseInt(targetId)) {
                                    isNoDisturb = 1;
                                }
                            });
                        }
                        deferred.resolve(isNoDisturb);
                    }).onFail(function(data) {
                       //data.code 返回码
                       //data.message 描述
                    });
                } catch(e) {
                    handleDisconnect();
                }
                
                return deferred.promise;
            }
        };
        return jMessageObj;
    }]);