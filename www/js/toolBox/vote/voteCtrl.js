angular.module('ssapp.controllers')
.controller('voteCtrl', function($scope,$timeout,$state,$ionicLoading,$stateParams,voteServices,localStorageService,getallquestionrs,alertService){
		   // 方法一（加载有闪动）
	    // var uid=$stateParams.voteID;
	    // voteServices.getVoteQuestion(uid).then(function(data){
	    // 	$scope.voteAllquestion=data;
	    // 	console.log(data);
	    // 	var ids=voteServices.getqusetionids(data);
	    // 	console.log(ids);
	    //     var answer=voteServices.getallanswer(ids);
	    //     $scope.voteAnswer=answer;

	    // })
	    // 方法二（加载无闪动）
		    // $scope.voteAllquestion=getallquestionrs.data;
		    // console.log($scope.voteAllquestion);
		    // $scope.voteAnswer=getallanswerrs;
		    // console.log($stateParams.voteStart);
		    // console.log($stateParams.voteEnd);
		    $scope.alldatas=_.groupBy(getallquestionrs.data,function(item){
                return item.questionId;
              })
		    // console.log(getallquestionrs.data);
		     // console.log($scope.alldatas);
		    $scope.slecetAnswer=function($event,type){
		    	// console.log(type?'checbox':'radio')
				     if(type==1){
				     	$($event.target).toggleClass('onc');

				     }
				     else if(type==0){
				     	$($event.target).addClass('onr').siblings('p').removeClass('onr');
				     }
				     else {
				     	return;

				     }
		    }
		    $scope.slecetAnsweri=function($event,type){
		    	// console.log(type?'checbox':'radio')

				     if(type==1){
				     	$($event.target).parent().toggleClass('onc');

				     }
				     else if(type==0){
				     	$($event.target).parent().addClass('onr').siblings('p').removeClass('onr');
				     }
				     else {
				     	return;

				     }
		    }

			   voteServices.getAllcount($stateParams.voteID).then(function(data){
			   		$scope.allPerson=data[0]
			   		$scope.allCount=data[1];
			   });

		     var enddateTime=voteServices.getTimes($stateParams.voteEnd.substring(0,19));




		     $scope.startTimes=$stateParams.voteStart;
		     $scope.votites=$stateParams.VoteTitle;

		     $scope.toggleud=function(){
		    	$('#showvotedescinfo').children('i').toggleClass('ion-ios-arrow-up ion-ios-arrow-down');
		    	$('#votedescinfo').stop().slideToggle();
		    }

			$scope.$on('$stateChangeStart', function(e, state) {
				clearInterval(Inter);
			});
			$scope.watchResult=function(){
				var dateRe=enddateTime-new Date();
				if(dateRe<=0){
					 $state.go('watchtable',{VoteTitles:$stateParams.VoteTitle,voteID:$stateParams.voteID});
				}else{
					alertService.showAlert($scope,'投票结果必须在截止日期后才可以查看。', true, "warning", null);
				}
			};

			function jztime(){
		        var a=new Date();
		        var b= enddateTime;
		        var c=b-a.getTime();
		        if(c<=0){
		            $('#time').text('已经截止投票');
		         	clearInterval(Inter);
		         	return;
		        }
		        var day=Math.floor(c/1000/60/60/24);
		        var hours=Math.floor((c-(day*24*60*1000*60))/1000/60/60);
		        var h1time=(c-(day*24*60*1000*60));
		        var miniter=Math.floor((h1time-(hours*60*60*1000))/60/1000);
		        var h2time=(h1time-(hours*60*60*1000));
		        var second=Math.floor((h2time-(miniter*60*1000))/1000);
		        var h3time=(h2time-(miniter*60*1000));
		        var haomiao=(h3time-(second*1000));
		        hours=(hours>=10?hours:"0"+hours);
		        miniter=(miniter>=10?miniter:"0"+miniter);
		        second=(second>=10?second:"0"+second);
		        $('#time').text('距截止时间：'+day+' 天 '+hours+' 时 '+miniter+' 分 '+second+' 秒 ');
		   	}
		    jztime();
		    var Inter=setInterval(jztime,1000);

			$scope.submitpl=function(){
				$('.tp_list_submit').css({'background':'#3D81F2'});
				var qslen=$('.tp_list_box li');
				var ids='';
				for(var i=0;i<qslen.length;i++){
					var c=[];
					var pl=false;
					for(var j=0;j<$(qslen[i]).find('i').length;j++){
						if($($(qslen[i]).find('i')[j]).hasClass('checkboxs')){
							c[j]=$($(qslen[i]).find('p')[j]).hasClass('onc');
							if(c[j]==true){
								// ids.push($($(qslen[i]).find('i')[j]).attr("id"));
								ids=ids+$($(qslen[i]).find('i')[j]).attr("id")+','
							}
						}else{
							c[j]=$($(qslen[i]).find('p')[j]).hasClass('onr');
							if(c[j]==true){
								// ids.push($($(qslen[i]).find('i')[j]).attr("id"));
								ids=ids+$($(qslen[i]).find('i')[j]).attr("id")+','
							}
						}
					}

					for(var k=0;k<c.length;k++){
						pl= pl||c[k];

					}
					//有选项没有没选择
					if(pl==false){
						alertService.showAlert($scope,'您第'+(i+1)+'项答案没有选择！', true, "fail", null);
						return;
					}else{

					}
				}

				$ionicLoading.show({
					    template:'<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>',
					    showBackdrop: true,
					    maxWidth: 200,
					    showDelay: 0
				});

			    ids=ids.substring(0,ids.length-1);

			    voteServices.getTishi(localStorageService.get('User').userId,$stateParams.voteID).then(function(data){
			    	if(data.length==0){
			    		if(enddateTime<new Date()){
			    			$ionicLoading.hide();
							alertService.showAlert($scope,'对不起，提交投票信息活动已经截止！', true, "fail", null);
							return;
			    		}else{
			    			voteServices.setTijiao(localStorageService.get('User').userId,ids).then(function(data){
			    				$ionicLoading.hide();
				    			alertService.showAlert($scope,'提交投票信息成功！', true, "success", null);
				    			$scope.allPerson=$scope.allPerson+1;
				    			$scope.allCount=$scope.allCount+ids.split(',').length;
				    		},function(data){
				    			$ionicLoading.hide();
				    			alertService.showAlert($scope,'提交投票信息失败，请重新提交！', true, "fail", null);
				    		});
			    		}
			    		return;
			    	}else{
			    		$ionicLoading.hide();
			    		alertService.showAlert($scope,'您已经提交过该主题的问卷调查表！', true, "warning", null);
			    	};
			    });
			};
})

// 投票系统主页面
.controller('listTpCtrl', function($scope,$timeout, $filter, $ionicLoading,voteServices,localStorageService,gettplist){
 		 $scope.allVote=gettplist.data;
    	 // console.log(gettplist.data);
})


// highth-chart图表展示
.controller('watchTCtrl', function($scope,$timeout, $ionicLoading,voteServices,localStorageService,$stateParams,getAllDatas,commonService){

	$scope.backPre=function(){
		window.history.go(-1);
	}
	var titlename=$stateParams.VoteTitles;
	var subtitlenams='数据来源: 上上德盛集团';
	var database=getAllDatas.data;
	console.log(database);
	console.log(database[0]);
	var Qnames=[];
	var allCounts=[];
    var namesA=[];
    var z=0;
    console.log(database[0]);
	for(let i in database[0]){
		// console.log(i);
		Qnames.push(i);
		var temparry=[];
		var tempcont=null;
		for(var j=0;j<database[0][i].length;j++){
			temparry.push([database[0][i][j].oname,database[0][i][j].count]);
			tempcont+=database[0][i][j].count;
		}
		namesA[z]=temparry;
		allCounts[z]=tempcont;
		z++;
	}

	$scope.repeats=Qnames;
	commonService.showLoading();
	setTimeout(function() {
		commonService.hideLoading();
		for(var l=0;l<Qnames.length;l++){
			if(l!=0){
				titlename=null;
				subtitlenams=null;
			}
			for(var p=0;p<namesA[l].length;p++){
				if(allCounts==0){
					namesA[l][p][1]==0;
				}else{
					namesA[l][p][1]=(namesA[l][p][1]/allCounts[l])*100;
				}

			}
			$('#container'+l).highcharts({
		        chart: {
		            type: 'column'
		        },
		        title: {
		            text: titlename
		        },
		        subtitle: {
		            text: subtitlenams
		        },
		        xAxis: {
		            type: 'category',
		            labels: {
		                rotation: 0,
		                style: {
		                    fontSize: '13px',
		                    fontFamily: 'Verdana, sans-serif'
		                }
		            }
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: '选项所占比例（%）'
		            }
		        },
		        legend: {
		            enabled: true,
		        },
		        tooltip: {
		            pointFormat: '所占比例为: <b>{point.y:.1f}%</b>'
		        },
		        series: [{
		            name: Qnames[l],
		            data:namesA[l],
		            dataLabels: {
		                enabled: true,
		                rotation: -45,
		                color: 'red',
		                align: 'center',
		                format: '{point.y:.1f}'+'%', // one decimal
		                y: 10, // 10 pixels down from the top
		                style: {
		                    fontSize: '10px',
		                    fontFamily: 'Verdana, sans-serif'
		                }
		            }
		        }]
		    });
		}
	},500);

});

