Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S" : this.getMilliseconds()
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
/**     
 *转换日期对象为日期字符串     
 * @param date 日期对象     
 * @param isFull 是否为完整的日期数据,     
 *               为true时, 格式如"2000-03-05 01:05:04"     
 *               为false时, 格式如 "2000-03-05"     
 * @return 符合要求的日期字符串     
 */
function getSmpFormatDate(date, isFull) {
	var pattern = "";
	if (isFull == true || isFull == undefined) {
		pattern = "yyyy-MM-dd hh:mm:ss";
	} else {
		pattern = "yyyy-MM-dd";
	}
	return getFormatDate(date, pattern);
}
/**     
 *转换当前日期对象为日期字符串     
 * @param date 日期对象     
 * @param isFull 是否为完整的日期数据,     
 *               为true时, 格式如"2000-03-05 01:05:04"     
 *               为false时, 格式如 "2000-03-05"     
 * @return 符合要求的日期字符串     
 */

function getSmpFormatNowDate(isFull) {
	return getSmpFormatDate(new Date(), isFull);
}
/**     
 *转换long值为日期字符串     
 * @param l long值     
 * @param isFull 是否为完整的日期数据,     
 *               为true时, 格式如"2000-03-05 01:05:04"     
 *               为false时, 格式如 "2000-03-05"     
 * @return 符合要求的日期字符串     
 */

function getSmpFormatDateByLong(l, isFull) {
	return getSmpFormatDate(new Date(l), isFull);
}
/**     
 *转换long值为日期字符串     
 * @param l long值     
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss     
 * @return 符合要求的日期字符串     
 */

function getFormatDateByLong(l, pattern) {
	return getFormatDate(new Date(l), pattern);
}
/**     
 *转换日期对象为日期字符串     
 * @param l long值     
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss     
 * @return 符合要求的日期字符串     
 */
function getFormatDate(date, pattern) {
	if (date == undefined) {
		date = new Date();
	}
	if (pattern == undefined) {
		pattern = "yyyy-MM-dd hh:mm:ss";
	}
	return date.format(pattern);
}

//扩展Date的format方法   
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S" : this.getMilliseconds()
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
/**   
 *转换日期对象为日期字符串   
 * @param date 日期对象   
 * @param isFull 是否为完整的日期数据,   
 *               为true时, 格式如"2000-03-05 01:05:04"   
 *               为false时, 格式如 "2000-03-05"   
 * @return 符合要求的日期字符串   
 */
function getSmpFormatDate(date, isFull) {
	var pattern = "";
	if (isFull == true || isFull == undefined) {
		pattern = "yyyy-MM-dd hh:mm";
	} else {
		pattern = "yyyy-MM-dd";
	}
	return getFormatDate(date, pattern);
}
/**   
 *转换当前日期对象为日期字符串   
 * @param date 日期对象   
 * @param isFull 是否为完整的日期数据,   
 *               为true时, 格式如"2000-03-05 01:05:04"   
 *               为false时, 格式如 "2000-03-05"   
 * @return 符合要求的日期字符串   
 */

function getSmpFormatNowDate(isFull) {
	return getSmpFormatDate(new Date(), isFull);
}
/**   
 *转换long值为日期字符串   
 * @param l long值   
 * @param isFull 是否为完整的日期数据,   
 *               为true时, 格式如"2000-03-05 01:05:04"   
 *               为false时, 格式如 "2000-03-05"   
 * @return 符合要求的日期字符串   
 */

function getSmpFormatDateByLong(l, isFull) {
	return getSmpFormatDate(new Date(l), isFull);
}
function getSmpFormatDateByLong2(l) {
	if(l==null||l==undefined||l==""){
		return "";
	}
	var date = new Date(l);
	var currDate = new Date();
	
	var currYear = currDate.getYear();
	var pattern = "";
	if(date.getYear() != currYear){
		pattern = "yyyy-MM-dd hh:mm";
	}else {
		pattern = "MM-dd hh:mm";
	}
	return getFormatDate(date, pattern);
}

function getIsCurYear(l){
	if(l==null||l==undefined||l==""){
		return false;
	}
	var date = new Date(l);
	var currDate = new Date();
	
	var currYear = currDate.getYear();
	if(date.getYear() != currYear){
		return false;
	}
	return true;
}

function getSmpFormatDateByLongPattern(l,format) {
	if(l==null||l==undefined||l==""){
		return "";
	}
	var date = new Date(l);
	var currDate = new Date();
	
	var currYear = currDate.getYear();
	var pattern = "";
	if(date.getYear() != currYear){
		pattern = "yyyy-MM-dd hh:mm";
		if(format!=null && format!=undefined){
			pattern = format;
		}
	}else {
		pattern = "MM-dd hh:mm";
		if(format!=null && format!=undefined){
			pattern = format;
		}
	}
	return getFormatDate(date, pattern);
}
/**   
 *转换long值为日期字符串   
 * @param l long值   
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss   
 * @return 符合要求的日期字符串   
 */

function getFormatDateByLong(l, pattern) {
	return getFormatDate(new Date(l), pattern);
}
/**   
 *转换日期对象为日期字符串   
 * @param l long值   
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss   
 * @return 符合要求的日期字符串   
 */
function getFormatDate(date, pattern) {
	if (date == undefined) {
		date = new Date();
	}
	if (pattern == undefined) {
		pattern = "yyyy-MM-dd hh:mm:ss";
	}
	return date.format(pattern);
}

function isToday(timeValue) {  
	if(timeValue==null||timeValue==undefined||timeValue==""){
		return false;
	}
	var date = getFormatDate(new Date(timeValue),'yyyy-MM-dd');
	var currDate = getFormatDate(new Date(),'yyyy-MM-dd');
	
	if(date != currDate){
		return true;
	}
	return false;
}; 
//60000 1分钟  
//3600000 1小时  
//86400000 24小时  
//对传入时间进行时间转换   
function timeChange(timeValue) {  
    var timeNew = Date.parse(new Date()); //当前时间
    var timeDiffer = timeNew - timeValue; //与当前时间误差  
    if(isToday(timeValue)){
    	return getSmpFormatDateByLong2(timeValue);
    }
    if(timeDiffer <= 60000) { //一分钟内  
    	return '刚刚';  
    } else if(timeDiffer > 60000 && timeDiffer < 3600000) { //1小时内  
    	return Math.floor(timeDiffer / 60000 )+ '分钟前';  
    } else { //今日  几小时前
    	return Math.floor(timeDiffer / 3600000 )+ '小时前';
    } 
}