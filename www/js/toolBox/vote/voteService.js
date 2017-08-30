angular.module('ssapp.services')
.service('voteServices',['$http','$q','ConfigService','commonService',function($http,$q,ConfigService,commonService){
  return {
        getVoteInfo: function (uid) {
          var deferred = $q.defer();
          var url = ConfigService.getHost() + "/ssVoteAdmin/votesByUserId/" + uid + commonService.getReqParamStr();
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
        getVoteQuestion: function (VoteId) {
          var deferred = $q.defer();
          var url = ConfigService.getHost() + "/voteQuestionAdmin/voteQuestions/" + VoteId + commonService.getReqParamStr();
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
        getqusetionids:function(data){
          var qUIDS=[];
          for(var i=0;i<data.length;i++){
            qUIDS.push(data[i].id)
          }
          return qUIDS;
        },
        getVoteAnwser: function (QuId) {
          var deferred = $q.defer();
          var url = ConfigService.getHost() + "/voteQuestionItemAdmin/voteQuestionItems/" + QuId + commonService.getReqParamStr();
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
        xuanranVIew:function(data){
          // var ctrl={
          //   init: function (data) {
          //       $('.tp_list_box ul').html("");
          //        model.getdata(data);

          //   },
          //   clickCheckbox: function () {
          //       $('.checkBox').click(function () {
          //           $(this).toggleClass('onc');
          //       })
          //   },
          //   clickRadio: function () {
          //       $('.raDio').click(function () {
          //           $(this).addClass('onr').siblings().removeClass('onr');
          //       })
          //   }
          //  };

          // var model={
          //     getdata: function (data) {
          //         for(var i=0;i<data.length;i++){
          //             view.createP(data[i].title,data[i].answer,data[i].type,i);
          //         }
          //     }
          // };
          //   var view={
          //       createP: function (title,answer,type,i) {
          //         console.log(title,answer,type,i);
          //           var html=$('<li></li>');
          //           var len=answer.length;

          //           var p='';
          //           if(type=='radio'){
          //               var title='<h2>'+(i+1)+'.'+title+'</h2>';
          //                  for(var j=0;j<len;j++){
          //                      p+= '<p class="raDio"><i></i>'+answer[j].optionName+'</p>'
          //                  }
          //               p=title+p;
          //               html.append(p);
          //               $('.tp_list_box ul').append(html);
          //               // 绑定点击函数
          //               ctrl.clickRadio();
          //           }
          //           else{
          //               var title='<h2>'+(i+1)+'.'+title+'</h2>';
          //               for(let j=0;j<len;j++){
          //                   p+= '<p class="checkBox"><span></span>'+answer[j].optionName+'</p>'
          //               }
          //               p=title+p;
          //               html.append(p);
          //               $('.tp_list_box ul').append(html);
          //               // 绑定点击函数
          //               ctrl.clickCheckbox();
          //           }
          //       }
          //   };
        },
        getallanswer:function(arry){
            var times= arry.length;
            // var dataAnswer=[];
            var jsonObj={};
            
            CloudiaTransfer_func(times,arry);
            function CloudiaTransfer_func(times,xmlStrArr){

              if(times <= 0){
                  return 
              }
              (function($){
                  temp = times-1;
                  $.ajax({
                      type: "get",
                      url: ConfigService.getHost() + "/voteQuestionItemAdmin/voteQuestionItems/" + xmlStrArr[temp] + commonService.getReqParamStr(),
                      async:false,
                      // dataType:"jsonp",
                      error: function(request) {;
                          alert('error:'+temp)
                      },
                      success: function(data) {
                          // $("#"+ContentID).html('上传中');
                          // $(".locState span").html('上传中');
                        for(var i=0;i<xmlStrArr.length;i++){

                        }
                          // console.log(xmlStrArr);
                          // var tsts=(xmlStrArr.length-1)-temp;
                          
                          var a = xmlStrArr[temp];
                          // "allanswer[" + idss + "] = answerData;"
                          eval("jsonObj[" + a + "]=data");
                          // dataAnswer.push(jsonObj);

                          // console.log(jsonObj);
                          times --;
                          CloudiaTransfer_func(times,xmlStrArr); //递归调用
                      }
                  });
              })(jQuery);

            }
            return jsonObj;
        },
        getTimes:function(date){
         var times=new Date(date.replace(/\-/g,"/")).getTime();
         return times;
        },
        setTijiao:function(userId,idsl){
          var deferred = $q.defer();
          var url = ConfigService.getHost() + "/voteRecordAdmin/voterecords/"+userId + "/" + idsl + commonService.getReqParamStr();;
          $http({
            method: 'POST',
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {}
          }).success(
            function (data, status, header, config) {
               deferred.resolve(data);
            }).error(function(data, status, header, config){
              deferred.reject(data);
            });
          return deferred.promise;
        },
        getTishi:function(userId,voteID){
          var deferred = $q.defer();
          var url = ConfigService.getHost() + "/ssVoteAdmin/getRecordsByKey/" + userId + "," + voteID + commonService.getReqParamStr();;
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
        getAllcount:function(voteID){
          var deferred = $q.defer();
          var url = ConfigService.getHost() + "/ssVoteAdmin/getAllCountByVoteId/" + voteID + commonService.getReqParamStr();
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
        getAlldata:function(voteID){
          var deferred = $q.defer();
          var url = ConfigService.getHost() + "/ssVoteAdmin/getAllDatasByVoteId/" + voteID + commonService.getReqParamStr();
          $http({
            method: 'GET',
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {}
          }).success(
            function (data, status, header, config) {
              data=_.groupBy(data,function(item){
                return item.questionId;
              })
              deferred.resolve(data);
            });
          return deferred.promise;
        }
  }


}])
.filter('format',function(){
  return function(data){
    return data.substring(0,data.length-2);
  }
})
.filter('formatgs',function(voteServices){
  return function(data){
    return (voteServices.getTimes(data)-new Date().getTime())>0?true:false;
  }
});
