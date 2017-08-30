angular.module('ssapp.filters', [])

	.filter('getWeekNameByDate', function () {
		return function (dateStr, type) {
			if(typeof(dateStr) != "undefined") {
				var a,b,c,date;
				if(dateStr.indexOf(":") != -1) {
					//时间
					a = dateStr.split(" ");
					b = a[0].split("-"); 
					c = a[1].split(":"); 
					date = new Date(b[0], b[1]-1, b[2], c[0], c[1], c[2]);
				} else {
					//日期
					a = dateStr.split(" ");
					b = a[0].split("-"); 
					date = new Date(b[0], b[1]-1, b[2]);
				}
				
				var week = date.getDay();
				var prevStr = "周";
				if(type === 1) prevStr = "星期";
				if(type === 2) prevStr = "周";

				switch (week) {
					case 0:
						return prevStr + "日";
						break;
					case 1:
						return prevStr + "一";
						break;
					case 2:
						return prevStr + "二";
						break;
					case 3:
						return prevStr + "三";
						break;
					case 4:
						return prevStr + "四";
						break;
					case 5:
						return prevStr + "五";
						break;
					case 6:
						return prevStr + "六";
						break;
				}
			}
			return "";
			
		}
	})

	.filter('getIMUserByField', function (localStorageService) {
		return function (imUserId, column) {
			var imUsers = angular.fromJson(window.sessionStorage.getItem("imUsers"));
			var cusNameInChat = localStorageService.get("cusNameInChat");
			var user = eval("imUsers." + imUserId);

			if(typeof(user) != "undefined") {
				//ss_x用户
				var result = eval("imUsers." + imUserId + "." + column);
				if(column === "photoUrl" && (result === null || result === "")) result = "img/default.png";
				return result;
			} else {
				//其余用户
				if(column === "photoUrl") result = "img/default.png";
				if(column === "userName") {
					result = imUserId;
					//针对客户，显示名字时，显示其客户名称
					if(imUserId.indexOf("cus_") != -1 && typeof(cusNameInChat) === "object") {
						result = cusNameInChat[imUserId];
					}
				}
				return result;
			}
			return "";
		}
	})

	.filter('dateDefference', function () {
		return function (strDateStart, strDateEnd) {
			if(strDateStart && strDateStart.indexOf("/") != -1)
				strDateStart = strDateStart.replace(/\//g,"-");
			if(strDateEnd && strDateEnd.indexOf("/") != -1)
				strDateEnd = strDateEnd.replace(/\//g,"-");
			if(typeof(strDateStart) === "string") strDateStart = strDateStart.substring(0, 10);
			if(typeof(strDateEnd) === "string") strDateEnd = strDateEnd.substring(0, 10);
			var  re =/^(\d{4})-(\d{2})-(\d{2})$/;
			//判断日期格式符合YYYY/MM/DD标准 
   			if(!re.test(strDateStart) || !re.test(strDateEnd)) {
   				return "";
   			}
			var strSeparator = "-"; //日期分隔符
			var oDate1;
			var oDate2;
			var iDays;
			oDate1= strDateStart.split(strSeparator);
			oDate2= strDateEnd.split(strSeparator);
			var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
			var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
			iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数 
			return iDays;
		}
	})
	
	.filter('isInArray',function(){
        return function (input,a){
            return a.indexOf(input)!=-1?true:false;
        }
    });