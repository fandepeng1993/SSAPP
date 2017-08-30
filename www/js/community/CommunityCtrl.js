angular.module('ssapp.controllers')

// 话题添加
.controller('addTopicCtrl', function($scope, $state, $rootScope, $ionicActionSheet, $ionicModal, $ionicSlideBoxDelegate, commonService, socialService, localStorageService, alertService, ConfigService){
  //commonService.showLoading();
  
  $scope.$on($state.current.name + "-init", function() {
    //图片头部动画
    $scope.controlModal = function(){
      if($(".photo-top-fixed").hasClass("showTitle")){
        $(".photo-top-fixed").animate({top:"0px"});
        $(".photo-top-fixed").removeClass("showTitle");
      }else{
        $(".photo-top-fixed").addClass("showTitle");
        $(".photo-top-fixed").animate({top:"-40px"});
      }
    };

    //监听滑动
    $scope.photoChanged = function (index) {
      $scope.currentPhoto = index + 1;
    };
    //图片展示
    $ionicModal.fromTemplateUrl('tab-photo.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function (index, photoArray) {
      $ionicSlideBoxDelegate.slide(index);
      $scope.slidePhotoArray = photoArray;
      $scope.currentPhoto = index + 1;
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    $scope.totalRecords = function (length) {
      return length === 0 ? 1 : length;
    }

    $scope.removePhoto = function () {
      var index = $scope.currentPhoto - 1;
      $scope.photos.splice(index, 1);
      if(index === 0 && $scope.photos.length === 0) {
        $scope.modal.hide();
      } else if(index === 0 && $scope.photos.length != 0) {
        $scope.openModal(index, $scope.photos);
      } else {
        $scope.openModal(index-1, $scope.photos);
      }
    }

    // 表情
    $(function(){
      $('.emotion').qqFace({
        id : 'facebox', 
        assign:'saytext', 
        path:'img/' //表情存放的路径
      });
    });
    //查看结果
    function replace_em(str){
      str = str.replace(/\</g,'&lt;');
      str = str.replace(/\>/g,'&gt;');
      str = str.replace(/\n/g,'<br/>');
      //str = str.replace(/\[em_([0-9]*)\]/g,'<img src="arclist/$1.gif" border="0" />');
      str = str.replace(/\[em_([0-9]*)\]/g,'<img src="img/$1.gif" border="0" />');
      //alert(str);
      return str;
    }

    var userId = localStorageService.get("User").userId;
    $scope.topic = {
      "user": {"userId": userId},
      "parentBlog": {"id": 1},
      "rootId": 1
    };
    $scope.addTopic = function () {
      var str = $("#saytext").val();
      //$("#show").html(replace_em(str));
      $scope.topic.content = replace_em(str);

      $scope.topic.photoUrls = "";
      for(var i=0; i<$scope.photos.length; i++) {
        $scope.topic.photoUrls = $scope.topic.photoUrls + $scope.photos[i] + "|";
      }
      if($scope.topic.photoUrls != "") {
        $scope.topic.photoUrls = $scope.topic.photoUrls.substring(0, $scope.topic.photoUrls.length - 1);
      }
      
      //alert($scope.topic.content);
      if(typeof($scope.topic.content) == "undefined") {
        alertService.showAlert($scope, "请填写内容！", true, "fail", null);
      } else {
        socialService.postBlog($scope.topic).then(function (data) {
          if(data.status == 1) {
            //平级广播，通知话题展示页面添加新的话题
            $rootScope.$broadcast('addNewTopic', data.msg);
            alertService.showAlert($scope, "话题发布成功!", true, "success", 'community');
          } else {
            alertService.showAlert($scope, data.msg, true, "fail", null);
          }
        });
      }
    };
    $scope.photos = [];

    //定义选择照片的函数
    $scope.choosePicMenu = function() {
        $ionicActionSheet.show({
            buttons: [
                { text: '从相册选择' },
                { text: '拍照' }
            ],
            titleText: '选择照片',
            cancelText: '取消',
            cancel: function() {
            },
            buttonClicked: function(index) {
                // Retrieve image file location from specified source
                navigator.camera.getPicture(uploadPhoto,
                                          function(message) { 
                                            //alert('get picture failed'); 
                                          },
                                          { 
                                            sourceType: index,
                                            quality: 55,
                                            correctOrientation: true,
                                            targetWidth: 1024,                                        //照片宽度
                                            targetHeight: 768                                       //照片高度
                                          });
                return true;
            }
        });
    };

    function uploadPhoto(imageURI) {
        $scope.img = imageURI;
        $scope.$apply();

        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";

        var params = {};
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        //alert(angular.toJson(options));

        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI(ConfigService.getHost() + "/uploadServlet?action=community"), win, fail, options);
    }

    function win(r) {//上传成功回调方法
        var resInfo = JSON.parse(r.response);
        if (resInfo.status === 1) {
            $scope.img = resInfo.msg;
            $scope.photos.push(resInfo.msg);
            $scope.$apply();
        } else {
            //上传失败
        }
    }

    function fail(error) {//上传失败回调方法
        //alert("An error has occurred: Code = " + error.code);
    }

    //commonService.hideLoading();
  });
})

// 社区查看（话题评论）
.controller('CommunityFindCtrl', function($scope, $state, $filter, $ionicHistory, $stateParams, $timeout, $window, $cordovaToast, commonService, socialService, localStorageService, alertService, _, ShareService, $location, ConfigService, $ionicModal, $ionicSlideBoxDelegate, RewardService){
  $scope.back = function(){
    window.history.back();
  };
  $scope.dashang = function(){
    $(".common-bg-shang").show();
    $(".communy-fix-shang").show();
  };
  $scope.closeS = function(){
    $(".common-bg-shang").hide();
    $(".communy-fix-shang").hide();
  };
  commonService.showLoading();
  $("ion-content").show();
  $(".wsq-content").children("div").hide();
  $(".wsq-content_content").show();
  $(".wsq-content_font_all").hide();
  $(".wsq-content_content .wsq-content_content").show();
  
  //$scope.$on($state.current.name + "-init", function() {
    /*$ionicModal.fromTemplateUrl('tab-photo.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function(index, photoArray) {
      $ionicSlideBoxDelegate.slide(index);
      $scope.slidePhotoArray = photoArray;
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    
    $scope.remove = function () {
      var index = $scope.photos.indexOf($scope.currentPhoto);
      if (index > -1) {
          $scope.photos.splice(index, 1);
      }
      $('.photow').hide();
      $('.photow-bg').hide();
    };*/
    var initShowQiangshafa = true;
    var initStyle = function () {
      commonService.hideLoading();
      // 打上显示
      $(".communy-shang").show();
      $(".wsq-content").children("div").show();
      $(".wsq-content_font_all").show();
      if(initShowQiangshafa) $("#qiangshafa").hide();
    };
    //评论时隐藏填写
    $scope.hideComment = function(){
      $(".common-bg").hide();
      $(".communy-fix").hide();
      $(".wsq-bottom-all").show();
      $scope.removeHeight();
      $(".wsq-content_content").show();
    };
    // // 提高表情高度
    // $scope.changeHeight = function(){
    //   $(".communy-fix").css("top","44px");
    //   $timeout(function () {
    //     $("#facebox td").click(function () {
    //       $scope.removeHeight();
    //     });
    //   },50);
    // };
    // $scope.removeHeight = function(){
    //   $(".communy-fix").css("top","44px");
    // };
    
    // 表情
    $(function(){
      $('.emotion').qqFace({
        id : 'facebox', 
        assign:'saytext', 
        path:'img/' //表情存放的路径
      });
    });
    //查看结果
    function replace_em(str){
      str = str.replace(/\</g,'&lt;');
      str = str.replace(/\>/g,'&gt;');
      str = str.replace(/\n/g,'<br/>');
      //str = str.replace(/\[em_([0-9]*)\]/g,'<img src="arclist/$1.gif" border="0" />');
      str = str.replace(/\[em_([0-9]*)\]/g,'<img src="img/$1.gif" border="0" />');
      //alert(str);
      return str;
    }

    /*$('#close').click(function(){
        $('.blogwrite-tan-bg').hide();
        $('.blogwrite-tan').hide();
    });*/

    $scope.topicId = $stateParams.topicId;

    $scope.items = [];  
    var num = 0;
    var readNum = 0;
    var initTopic = function () {
      socialService.getBlogById($scope.topicId).then(function (data) {
        $scope.items = [];
        $scope.topic = data;

        /*$scope.topicVoteBadges = {
         carts: $scope.topic.voteNum,
         contact: $scope.topic.voteNum
        };*/

        //console.log(angular.toJson(data));
        for(var i=0; i<$scope.topic.photoUrlArray.length; i++) {
          var photo = {src:$scope.topic.photoUrlArray[i]};
          $scope.items.push(photo);
        }
        num++;
        if(num === 3) initStyle();
        //更新话题阅读次数
        if(readNum === 0) {
          socialService.readBlog($scope.topicId).then(function (data) {
            console.log(data.status);
          });
          readNum++;
        }
      });
    };
    initTopic();

    /*$scope.replyLength = 0;
    var getCount = function () {
      socialService.getCountByRootId($scope.topicId).then(function (data) {
        $scope.replyLength = data;
      });
    };
    getCount();*/
    $scope.getArr = function (id) {
      return $scope.allReplys["reply" + id];
    };
    $scope.allReplys = {};
    $scope.getData = function () {
      //socialService.getBlogsByRootIdLazy($scope.topicId, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
      socialService.getReplysByTopicLazy($scope.topicId, vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
        
        for(var key in data) {
          eval("$scope.allReplys.reply" + key + "=(" + angular.toJson(data[key]) + ")");
          //eval("$scope.allReplys.reply" + key + "=(" + angular.toJson(data[key]) + ")");
        }
        vm.messages = vm.messages.concat(data[$scope.topicId]);
        $("#loading").hide();
        vm.finishInit = true;
        num++;
        if(num === 3) initStyle();

        if(vm.messages.length === 0) initShowQiangshafa = false;
        if (data[$scope.topicId].length === 0)  vm.moredata = true;
        if (data[$scope.topicId].length === 0 && data[$scope.topicId].length > 6) {
          $cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
            // success  
          }, function (error) {  
            // error  
          });
        }
        //成功2秒后广播
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageNo ++;
        }, 2000);
      });
    };

    var vm = $scope.vm = {
      moredata: false,
      messages: [],
      finishInit: false,
      pagination: {
        currentPage: 1,
        perPage: 10
      },
      init: function () {
        vm.finishInit = false;
        vm.moredata = false;
        vm.messages = [];
        vm.pagination.currentPage = 1;
        $scope.getData();
      },
      show: function (message) {
        if (message.static) {
          message.static = false;
        } else {
          message.static = true;
        }
      },
      doRefresh: function () {
        $timeout(function () {
          initTopic();
          vm.init();
          $scope.$broadcast('scroll.refreshComplete');
          //$window.location.reload();
        }, 1000);
      },
      hasMoreDate: function () {
        if(vm.moredata) {
          return false;
        } return true;
      },
      loadMore: function () {
        $("#loading").show();
        if(vm.finishInit) {
          vm.pagination.currentPage += 1;
          $scope.getData();
        }
      },
    };
    vm.init();


    var userId = localStorageService.get("User").userId;
    var arrId;
    $scope.reply = {
      "user": {"userId": userId},
      "parentBlog": {"id": 0},
      "rootId": $scope.topicId
    };

    $scope.setReplyId = function (reply, blogId) {
	    $("#saytext").val("@" + reply.user.userName + ": ");
      $(".communy-fix").show();
      $(".common-bg").show();
      $(".communy-fix textarea").focus();
      $(".wsq-bottom-all").hide();
      $scope.replyId = reply.id;
      //当前要回复的Blog
      $scope.currentReply = reply;
      arrId = blogId;
    };

    $scope.addReply = function (pid) {
      var str = $("#saytext").val();
      //$("#show").html(replace_em(str));
      //提交时去除@字符串
      if(str.charAt(0) === "@" && str.indexOf(":") != -1) {
        var replyUserName = $.trim(str.split(":")[0]);
        if(replyUserName === "@"+$scope.currentReply.user.userName) {
          $scope.reply.content = $.trim(str.substring(str.indexOf(":")+1, str.length));
        }
      } else {
        $scope.reply.content = str;
      }
      $scope.reply.content = replace_em($scope.reply.content);
      $scope.reply.parentBlog.id = pid;

      if(typeof($scope.reply.content) === "undefined" || $scope.reply.content === "") {
        alertService.showAlert($scope, "请填写内容！", true, "fail", null);
      } else {
        socialService.postBlog($scope.reply).then(function (data) {
          if(data.status == 1) {
            alertService.showAlert($scope, "回复成功!", true, "success", null);
            $("#qiangshafa").hide();
            //若是对话题添加评论，则将更新的数据显示在最前面;若是对评论进行评论，则添加在对应的评论list中。
            //alert(angular.toJson(data.msg.content));
            var json = eval("(" + eval("(" + angular.toJson(data.msg) + ")") + ")");
            if(json.parentBlog.id === parseInt($scope.topicId)) {
              vm.messages.unshift(json);
            } else {
              if(typeof($scope.allReplys["reply" + arrId]) != "undefined") {
                $scope.allReplys["reply" + arrId].push(json);
              } else {
                $scope.allReplys["reply" + arrId] = [];
                $scope.allReplys["reply" + arrId].push(json);
                //eval("$scope.allReplys.reply" + key + "=("
              }
            }
            $scope.topic.replyNum ++;
            $scope.hideComment();
            //$state.go("tab.community-find", {topicId: $scope.topicId});
          } else {
            alertService.showAlert($scope, data.msg, true, "fail", null);
          }
        });
      }
    };

    var userVotes = [];

    $scope.addVote = function (replyId) {
      /*if($("#heart" + replyId).hasClass("ion-ios-heart-outline")) {
        userVotes.push(parseInt(replyId));
        $("#heart" + replyId).removeClass("ion-ios-heart-outline");
        $("#heart" + replyId).addClass("ion-ios-heart").css('color','#314c83');
        if(replyId == $scope.topicId) {
          $scope.topic.voteNum ++;
        }
      } else {
        var index = userVotes.indexOf(parseInt(replyId));
        if (index > -1) {
            userVotes.splice(index, 1);
        }
        $("#heart" + replyId).removeClass("ion-ios-heart");
        $("#heart" + replyId).addClass("ion-ios-heart-outline").css('color','#314c83');   
        if(replyId == $scope.topicId) {
          $scope.topic.voteNum --;
        }
      }*/
      if($("#heart" + replyId).hasClass("icon-zan-")) {
        userVotes.push(parseInt(replyId));
        if(replyId == $scope.topicId) {
          $scope.topic.voteNum ++;
        }
        $("#heart" + replyId).removeClass("icon-zan-");
        $("#heart" + replyId).addClass("icon-zan-1").css("color","#314c83");
        $("#heart" + replyId).children("div").removeClass("wsq_jia_none");
        $("#heart" + replyId).children("div").addClass("wsq_jia");
        $cordovaToast.showLongBottom('点赞成功！', 'long', 'center').then(function(success) {}, function (error) {});
      } else {
        var index = userVotes.indexOf(parseInt(replyId));
        if (index > -1) {
            userVotes.splice(index, 1);
        }
        $("#heart" + replyId).removeClass("icon-zan-1");
        $("#heart" + replyId).addClass("icon-zan-").css("color","#999");
        $("#heart" + replyId).children("div").removeClass("wsq_jia");
        $("#heart" + replyId).children("div").addClass("wsq_jia_none");
        $cordovaToast.showLongBottom('取消赞！', 'long', 'center').then(function(success) {}, function (error) {});
        if(replyId == $scope.topicId) {
          $scope.topic.voteNum --;
        }
      }


      var vote = {
        "userId": userId,
        "blogId": replyId
      };
      socialService.postVote(vote).then(function (data) {
        if(data.status == 1) {
          console.log("点赞成功！");
        } else {
          console.log("点赞失败！");
        }
      });
    };

    //获取当前用户的点赞信息
    socialService.getVoteByUId(userId).then(function (data){
      $.each(data, function (index, item) {
        if(item.state == 1) {
          userVotes.push(item.blogId);
        }
      });
      num++;
      if(num === 3) initStyle();
    });

    $scope.checkVote = function (blogId) {
      var index = _.indexOf(userVotes, parseInt(blogId));
      return index != -1 ? true : false;
    };

    // 分享
    $scope.share = function () {
      $scope.shareData = {};
      $scope.shareData.message = $scope.topic.title;
      $scope.shareData.subject = $scope.topic.content;
      $scope.shareData.link = ConfigService.getAppURL() + $location.path();
      ShareService.share($scope.shareData);
    };

    $scope.reward = {
      'payFrom': {"userId": userId},
      'payTo': {},
      "payNum": 1,
      'modelName': '微社区',
      'table': 'ss_blog'
    };

    //添加打赏
    $scope.addReward = function () {
      $scope.reward.payTo.userId = $scope.topic.user.userId;
      $scope.reward.rid = $scope.topic.id;
      if($scope.reward.payFrom.userId === $scope.reward.payTo.userId) {
        alertService.showAlert($scope, "抱歉，不能打赏给自己！", true, "warning", null);
        return;
      }
      if(parseFloat($scope.reward.payNum) === 0) {
        alertService.showAlert($scope, "抱歉，打赏金额不能为0！", true, "warning", null);
        return;
      }
      if(isNaN($scope.reward.payNum)) {
        alertService.showAlert($scope, "请填写数字！", true, "warning", null);
        return;
      }
      RewardService.postReward($scope.reward).then(function (data) {
        if(data.status == 1) {
          alertService.showAlert($scope, "打赏成功!", true, "success", null);
          $scope.closeS();
        } else {
          alertService.showAlert($scope, data.msg, true, "fail", null);
        }
      });
    }

    //确定只能填写两位小数
    $scope.clearNoNum = function (event) {
      var obj = event.target;
      var index = commonService.getCursortPosition(obj);
      obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
      obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
      obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
      obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数  
      if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
          obj.value= parseFloat(obj.value);
      }
      $scope.reward.payNum = obj.value;
      obj.selectionStart = index;
      obj.selectionEnd = index;
    }

    /*$scope.formatValue = function (event) {
      var obj = event.target;
      var index = commonService.getCursortPosition(obj);
      if($scope.reward.payNum.length > 2)
        $scope.reward.payNum = $scope.reward.payNum.substring(2,$scope.reward.payNum.length);
      $scope.reward.payNum = $scope.reward.payNum.replace(/,/g, "");
      $scope.reward.payNum = $filter("currency")($scope.reward.payNum, "￥ ");
      $timeout(function () {
        obj.selectionStart = index;
        obj.selectionEnd = index;
      },50);
    };*/
  //});
})

// 社区评论（话题展示）
.controller('CommunityCtrl', function($scope, $state, $rootScope, socialService, commonService, alertService, $cordovaToast, $window, $state, $timeout, localStorageService, $location, ConfigService, ShareService, $ionicModal, $ionicSlideBoxDelegate){
  commonService.showLoading();
  $scope.$on($state.current.name + "-init", function() {
    $ionicModal.fromTemplateUrl('tab-photo.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function(index, photoArray) {
      $ionicSlideBoxDelegate.slide(index);
      $scope.slidePhotoArray = photoArray;
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    
    $scope.remove = function () {
      var index = $scope.photos.indexOf($scope.currentPhoto);
      if (index > -1) {
          $scope.photos.splice(index, 1);
      }
      $('.photow').hide();
      $('.photow-bg').hide();
    };

    $('#community').click(function(){
        $('.blogwrite-tan-bg').show();
        $('.blogwrite-tan').show();
    });
    $('#close').click(function(){
        $('.blogwrite-tan-bg').hide();
        $('.blogwrite-tan').hide();
    });

    //监听话题添加的广播事件
    $rootScope.$on('addNewTopic', function(event, data) {
      //将更新的数据显示在最前面
      vm.messages.unshift(angular.fromJson(data));
    });

    $("#loading").hide();
    $scope.getData = function () {
      socialService.getTopicsLazy(vm.pagination.currentPage, vm.pagination.perPage).then(function (data) {
        vm.messages = vm.messages.concat(data);
        $("#loading").hide();
        vm.finishInit = true;
        if (data.length === 0) {
          $cordovaToast.showLongBottom('亲，已经没有数据了！', 'long', 'center').then(function(success) {  
            // success  
          }, function (error) {  
            // error  
          });
          vm.moredata = true;
        }
        //成功2秒后广播
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageNo ++;
        }, 2000);
        commonService.hideLoading();
        $("#blogWrite").show();
        // 获取字数
        /*$timeout(function() {
          // console.log($(".wsq-content_font").eq(0).text().length);
          var contentLength = $(".wsq-content_font").length;
          for(var i = 0; i < contentLength; i++){
            if($.trim($(".wsq-content_font").eq(i).text()).length > 70){
              $(".wsq-content_font").eq(i).next().show();
              $(".wsq-content_font").eq(i).next().click(function(){
                alert(1);
                if($(this).prev().hasClass("wsq-content_font")){

                  $(this).prev().removeClass("wsq-content_font");
                  $(this).prev().addClass("wsq-content_font_all");
                  $(this).text("");
                  $(this).text("点击收缩全文");
                }else{
                  $(this).prev().addClass("wsq-content_font");
                  $(this).prev().removeClass("wsq-content_font_all");
                  $(this).text("");
                  $(this).text("点击展开全文");
                }         
              })
            }else{
              $(".wsq-content_font").eq(i).next().hide();
            }
          }
          
        },500);*/
      });
    };

    var vm = $scope.vm = commonService.getWaterFallVM($scope, $scope.getData, "loading", 10);
    vm.init();

    $scope.showAll = function (i) {
      if($(".wsq-content_content").eq(i).children("div").eq(0).hasClass("wsq-content_font")){
        $(".wsq-content_content").eq(i).children("div").eq(0).removeClass("wsq-content_font");
        $(".wsq-content_content").eq(i).children("div").eq(0).addClass("wsq-content_font_all");
        $(".wsq-find-all").eq(i).text("");
        $(".wsq-find-all").eq(i).text("点击收缩全文");
      } else {
        $(".wsq-content_content").eq(i).children("div").eq(0).addClass("wsq-content_font");
        $(".wsq-content_content").eq(i).children("div").eq(0).removeClass("wsq-content_font_all");
        $(".wsq-find-all").eq(i).text("");
        $(".wsq-find-all").eq(i).text("点击展开全文");
      }
    };

    $scope.getPhotoJson = function (photoUrls) {
      var items = [];
      for(var i=0; i<photoUrls.length; i++) {
        var photo = {src:photoUrls[i]};
        items.push(photo);
      }
      return items;
    };

    /*$scope.checkPhotoClass = function (topic) {
      if(topic.photoUrlArray.length === 1) {
        return "one";
      } else if(topic.photoUrlArray.length === 2) {
        return "two";
      } else if(topic.photoUrlArray.length >= 3) {
        return "three";
      }
    }*/

    $scope.viewReplys = function (topicId) {
      $state.go("tab.community-find", {topicId: topicId});
    };

    var userId = localStorageService.get("User").userId;

    $scope.addVote = function (topicId, index) {
      if($("#heart" + topicId).hasClass("icon-zan-")) {
        $("#heart" + topicId).removeClass("icon-zan-");
        $("#heart" + topicId).addClass("icon-zan-1").css("color","#314c83");
         $("#heart" + topicId).children("div").fadeIn().fadeOut();
        // $("#heart" + topicId).children("div").removeClass("wsq_jia_none");
        // $("#heart" + topicId).children("div").addClass("wsq_jia");
        vm.messages[index].voteNum++;
        $cordovaToast.showLongBottom('点赞成功！', 'long', 'center').then(function(success) {}, function (error) {});
      } else {
        $("#heart" + topicId).removeClass("icon-zan-1");
        $("#heart" + topicId).addClass("icon-zan-").css("color","#999");
        // $("#heart" + topicId).children("div").fadeIn().fadeOut();
        // $("#heart" + topicId).children("div").addClass("wsq_jia_none");
        vm.messages[index].voteNum--;
        $cordovaToast.showLongBottom('取消赞！', 'long', 'center').then(function(success) {}, function (error) {});
      }
     
      var vote = {
        "userId": userId,
        "blogId": topicId
      };
      socialService.postVote(vote).then(function (data) {
        if(data.status == 1) {
          console.log("点赞成功！");
        } else {
          console.log("点赞失败！");
        }
      });
    };

    var userVotes = [];

    socialService.getVoteByUId(userId).then(function (data){
      $.each(data, function (index, item) {
        if(item.state == 1) {
          userVotes.push(item.blogId);
        }
      });
    });

    $scope.checkVote = function (blogId) {
      var index = _.indexOf(userVotes, blogId);
      return index != -1 ? true : false;
    };

    // 分享
    $scope.share = function (topic) {
      $scope.shareData = {};
      $scope.shareData.message = topic.title;
      $scope.shareData.subject = topic.content;
      $scope.shareData.link = ConfigService.getAppURL() + $location.path() + "/" + topic.id;
      ShareService.share($scope.shareData);
    };
  });
  
});