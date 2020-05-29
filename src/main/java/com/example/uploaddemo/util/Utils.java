package com.example.uploaddemo.util;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

public final class Utils {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(Utils.class);

	public static String getFileMd5(String filePath) {
		File file = new File(filePath);
		return getFileMd5(file);
	}
	public static String getFileMd5(File file) {
		String md5 = null;
		if (file.exists()) {
			try {
				InputStream inputStream = new FileInputStream(file);
				md5 = DigestUtils.md5Hex(inputStream);
				LOGGER.trace(file.getAbsolutePath() + " md5: " + md5);
			} catch (Exception e) {
				throw new RuntimeException("get file md5 failure!");
			}
		}
		return md5;
	}
	
	
	public static String printStackTraceToString(Throwable throwable) {
	    StringWriter stringWriter = new StringWriter();
	    throwable.printStackTrace(new PrintWriter(stringWriter, true));
	    return stringWriter.getBuffer().toString();
	}
	
	public static final String getRequestIp(HttpServletRequest request) {
		
		String ip = request.getHeader("X-Real-IP");
	    if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
	    	ip = request.getHeader("x-forwarded-for");
	    }
	    if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
	        ip = request.getHeader("Proxy-Client-IP");
	    }
	    if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
	        ip = request.getHeader("WL-Proxy-Client-IP");
	    }
	    if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
	        ip = request.getRemoteAddr();
	    }

		// 如果是多级代理，那么取第一个ip为客户端ip
		if (ip != null && ip.indexOf(",") != -1) {
			ip = ip.substring(0, ip.indexOf(",")).trim();
		}

	    return ip;
	}
	
	public static final boolean isWechat(HttpServletRequest request) {
		String userAgent = request.getHeader("user-agent");
		return userAgent.contains("MicroMessenger");
	}
	
	/** 获取当前月第一天 */
	public static final Date getFirstDayOfMonth(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_MONTH, 1);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.clear(Calendar.MINUTE);
		calendar.clear(Calendar.SECOND);
		return calendar.getTime();
	}
	
	/** 获取当前月最后一天 */
	public static final Date getLastDayOfMonth(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
		calendar.set(Calendar.HOUR_OF_DAY, calendar.getActualMaximum(Calendar.HOUR_OF_DAY));
		calendar.set(Calendar.MINUTE, calendar.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar.getActualMaximum(Calendar.SECOND));
		return calendar.getTime();
	}
	
	/** 获取当前周第一天 */
	public static final Date getWeekStart(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setFirstDayOfWeek(Calendar.MONDAY);
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		calendar.set(Calendar.HOUR_OF_DAY, calendar.getActualMinimum(Calendar.HOUR_OF_DAY));
		calendar.clear(Calendar.MINUTE);
		calendar.clear(Calendar.SECOND);
		return calendar.getTime();
	}
	
	/** 获取当前周最后一天 */
	public static final Date getWeekEnd(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setFirstDayOfWeek(Calendar.MONDAY);
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
		calendar.set(Calendar.HOUR_OF_DAY, calendar.getActualMaximum(Calendar.HOUR_OF_DAY));
		calendar.set(Calendar.MINUTE, calendar.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar.getActualMaximum(Calendar.SECOND));
		return calendar.getTime();
	}
	
	/** 获取当天开始时间 */
	public static final Date getDayStart() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, calendar.getActualMinimum(Calendar.HOUR_OF_DAY));
		calendar.clear(Calendar.MINUTE);
		calendar.clear(Calendar.SECOND);
		return calendar.getTime();
	}
	
	/** 获取当天结束时间 */
	public static final Date getDayEnd() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, calendar.getActualMaximum(Calendar.HOUR_OF_DAY));
		calendar.set(Calendar.MINUTE, calendar.getActualMaximum(Calendar.MINUTE));
		calendar.set(Calendar.SECOND, calendar.getActualMaximum(Calendar.SECOND));
		return calendar.getTime();
	}
	
	/** 获取最近6个月 */
	public static final List<Map<String, String>> getLastSixMonth() {
		
		List<Map<String, String>> monthList = new ArrayList<Map<String,String>>();
		Calendar calendar = Calendar.getInstance();
		for (int i = 0; i < 6; i++) {
			Map<String, String> month = new HashMap<String, String>();
			month.put("value", DateFormatUtils.format(calendar, "yyyyMM"));
			month.put("text", DateFormatUtils.format(calendar, "yyyy年MM月"));
			monthList.add(month);
			calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) - 1);
		}
		
		return monthList;
	}
	
	/** 日期转换 */
	public static final Date parseDate(String dateString) {
		
		Date date = null;
        if(StringUtils.isEmpty(dateString)){
        	date = new Date();
        } else {
        	try {
				date = DateUtils.parseDate(dateString, new String[]{"yyyyMM", "yyyyMMdd", "yyyyMMdd HH:mm:ss"});
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
        Assert.state(date != null, "parseDate error.");
		return date;
	}

	public static String dateToWeek() {
		String[] weekDays = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
		Calendar cal = Calendar.getInstance();
		//一周的第几天
		int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
		if (w < 0)
			w = 0;
		return weekDays[w];
	}

	public static String getTimeStr(Date d){
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
		return f.format(d);
	}

	/** 验证url是否合格 */
	public static boolean checkUrl(String url){
		Pattern pattern = Pattern.compile("^(http|ftp|https):\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&:/~\\+#{}]*[\\w\\-\\@?^=%&/~\\+#{}])?$");
		return pattern.matcher(url).matches();
	}

	/**
	 * 返回uuid 去掉中划线的情况
	 * @return
	 */
	public static String getUUID(){
		String uuid = UUID.randomUUID().toString();
		uuid = uuid.replace("-","");
		return uuid;
	}


	/** 判定是否是图片 */
	public static boolean isImage(String extension){
		return "jpg".equalsIgnoreCase(extension) || "jpeg".equalsIgnoreCase(extension) || "png".equalsIgnoreCase(extension);
	}

	public static String generateSignature(String signType, String key, String dateStr, Integer wfwfid) {
		String sign = null;
		switch (signType) {
			case "MD5":
				// date格式为:yyyy-MM-dd date={date}&wfwfid={wfwfid}&key={key}
				sign = DigestUtils.md5Hex(String.format("date=%s&wfwfid=%d&key=%s", dateStr, wfwfid, key));
				break;
			case "DES":
				break;
			case "RSA":
				break;
			default:
				throw new IllegalArgumentException();
		}
		return sign;
	}
}
