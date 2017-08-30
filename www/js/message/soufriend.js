angular.module('ssapp.controllers')
.controller('soufriendCtrl', function($scope, UserService){
	 var wH=$(window).height();
			var bH=$('.bar-header').innerHeight();
			var sH=$('.addfriend_list').innerHeight()+10;
			console.log(sH);
			var cha=wH-bH-sH;
			$('.slide_list ul li').css({'height':cha/26+'px'});
			var hei=cha+'px';
			$scope.myObj1 = {
             "height" : hei,
             "overflow-y":"scroll"
             };
		    var english=[];
			var datax;	
			var obj={};
			var imgs={};
			$scope.tops={"top":sH+'px'};
          
	      	UserService.getUsers().then(function (data) {
				for(var i=0;i<data.length;i++){
						var pd=english.indexOf(pinyin.getCamelChars(data[i].userName).slice(0,1));
						if(pd==-1){
							english.push(pinyin.getCamelChars(data[i].userName).slice(0,1));
							obj[pinyin.getCamelChars(data[i].userName).slice(0,1)]=[data[i].userName];
							imgs[pinyin.getCamelChars(data[i].userName).slice(0,1)]=[data[i].photoUrl];
							english.sort();
						}
						else{
							obj[pinyin.getCamelChars(data[i].userName).slice(0,1)].push(data[i].userName);
							imgs[pinyin.getCamelChars(data[i].userName).slice(0,1)].push(data[i].photoUrl);
						}
				}
				$scope.lister=english;
				$scope.obj=obj;		
	        });
	   
	      $('.slide_list ul li').click(function(){
	      	var ll=english.indexOf($(this).text());
	      	var heightall=$('.list_txl_person').height();
	      	var heightcount=0;
	      		$('.fixed-con').text($(this).text()).stop().fadeIn(300,function(){
	      		$('.fixed-con').fadeOut();

	      	});
	      

		      	if(ll!=-1){
		      		if(ll==0){
		      			$('.out_selcet').scrollTop(0);

		      		}else{
		      			for(var j=0;j<ll;j++){
		      			heightcount=heightcount-1+$('.list_english').eq(j).height();
		      		    };
				      		    if(heightall-heightcount-cha>0){
				      		    	$('.out_selcet').animate({scrollTop: heightcount+'px'}, 200);
				      		    }
				      		    else{
				      		    	$('.out_selcet').animate({scrollTop: heightall-cha+'px'}, 200);
				      		    }
		      		    }

		      	}else{
		      		return;
		      	}
	      	
	      });
	
});
