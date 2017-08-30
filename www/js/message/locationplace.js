angular.module('ssapp.controllers')
.controller('localctrl', function($scope, UserService, $ionicHistory){
	$scope.back = function(){
		$ionicHistory.goBack();
	};
		/***************************************
	}
由于Chrome、IOS10等已不再支持非安全域的浏览器定位请求，为保证定位成功率和精度，请尽快升级您的站点到HTTPS。
***************************************/
     var map, geolocation;
     var center_point;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('gdMap', {
         resizeEnable: true
         
        });
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
	            enableHighAccuracy: true,//是否使用高精度定位，默认:true
	            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
	            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
	            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	            buttonPosition:'RB'
             });
		 map.on('complete', function() {
	         center_point=[map.getCenter().lng,map.getCenter().lat];
	         // console.log(map);
	         placeSearch.searchNearBy('', center_point, 200, function(status, result) {
        	});

             var lnglatXY = center_point; //已知点坐标
             regeocoder();

		    	function regeocoder() {  //逆地理编码
		        var geocoder = new AMap.Geocoder({
		            radius: 1000,
		            extensions: "all"
		        });        
		        geocoder.getAddress(lnglatXY, function(status, result) {
		            if (status === 'complete' && result.info === 'OK') {
		                geocoder_CallBack(result);
		            }
		        });        
		        var marker = new AMap.Marker({  //加点
		            map: map,
		            position: lnglatXY
		        });
		        map.setFitView();
		       };
			    function geocoder_CallBack(data) {
			        var address = data.regeocode.formattedAddress; //返回地址描
			        $('.my-positon p').text(address);
			           var infoWindow;
					   function openInfo() {
				        //构建信息窗体中显示的内容
				        var info = [];
				        info.push("<div style=\"padding:0px 0px 0px 4px;\" id=\"position_cur\" loadingSpinner><b>当前位置</b>");
				        info.push("地址 :"+address);
				        infoWindow = new AMap.InfoWindow({
				            content: info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
				        });
				        infoWindow.open(map, map.getCenter());
				        }
				        openInfo();
				     

			    };
			   
			    
	     });
		 map.on('click', function(e) {
		 	// center_point=[ e.lnglat.getLng(),e.lnglat.getLat()];
		 	// // console.log(center_point);
		 	//  placeSearch.searchNearBy('', center_point, 200, function(status, result) {
        	// });
  		  });

        map.addControl(geolocation);
        geolocation.getCurrentPosition();
	        //输入提示
	    var autoOptions = {
	        input: "tipinput"
	    };
	    var auto = new AMap.Autocomplete(autoOptions);
	    var placeSearch = new AMap.PlaceSearch({
	        pageSize: 5,
            pageIndex: 1,
            map: map,
            panel: "panel"
	    });  //构造地点查询
	    AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
	    function select(e) {
	        placeSearch.setCity(e.poi.adcode);
	        placeSearch.search(e.poi.name);  //关键字查询查询
	    };
			    
    });

});