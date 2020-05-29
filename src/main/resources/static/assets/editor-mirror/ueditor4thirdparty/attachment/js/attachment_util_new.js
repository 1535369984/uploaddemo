/**
 * 处理富文本中的附件
 */
var RichtextAttachmentUtils = {
		clickAttachment : function(){}, // 点击附件
		getTopDomain : function(){}, // 获取域名
		getTopParent : function(){}, // 获取最外层对象，（目前是只处理三层）
		top_domain : '',
		top_parent : '',
		b64DecodeUnicode : function(){}, // base64解码
		getNowFormatDate : function(){}, // 获取当前时间
		isPhone:false, // 是否是手机端
		isLearn:false, // 是否是课程那边的服务
		isXXT:false, // 是否是学习通客户端
}

RichtextAttachmentUtils.b64DecodeUnicode = function(str){
	 try{
		 str = decodeURIComponent(atob(str));
     }catch(e){
        
     }
     return str;
}

var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf('android') > -1 || ua.indexOf('adr') > -1; //android终端
var isIOS = ua.indexOf('iphone') >= 0 || ua.indexOf('ipad') >= 0 || ua.indexOf('ipod') >= 0; //ios终端

var host = document.referrer;
//是否是分享页，分享页点击附件时是打开分享页地址
var isShare = host.indexOf("sharewh.chaoxing.com") != -1;
// 是否是投屏页
var isScreen = host.indexOf("screen") != -1;

// 是否在学习通里面
RichtextAttachmentUtils.isXXT = ua && ua.indexOf("chaoxingstudy")!=-1 && ua.indexOf('chaoxingstudypc') == -1;
// 是否在手机端
RichtextAttachmentUtils.isPhone = isAndroid || isIOS;

if(isIOS) {
    // ios 上 onclick有时候会点击无效，因此在ios设备上采用 touch 事件
	var longClick = 0;
	var timeOutEvent;
	$(".attach-box").on({
        touchstart: function(e){
            longClick=0;
            timeOutEvent = setTimeout(function(){
                //此处为长按事件
                longClick=1;//假如长按，则设置为1
            },500);
        },
        touchmove: function(e){
            clearTimeout(timeOutEvent);
            timeOutEvent = 0;
        },
        touchend: function(e){
            clearTimeout(timeOutEvent);
            if(timeOutEvent!=0 && longClick==0){//点击
                //此处为点击事件----在此处跳转
                openClickEvent();
            }
            return false;
        }
    });

} else {
	$(".attach-box").on('click', function (){
		openClickEvent();
	});
}

var AttachmentType = {
		Topic:1,//话题
		Note:2,//笔记
		Special:3,//专题
		Newspaper:4,//报纸
		SpecialDomain:5,//专题域
		Periodical:6,//期刊
		Group:7,//小组
		Notice:8,//通知
		Notifications:30,//通知提醒
		Message:9,//消息
		Notebook:10,//笔记文件夹
		StudyFolder:11,//书房文件夹
		Courses:{ //15课程相关
			Value:15,
			subType:{
				test : 42, // 测验
				score : 23, // 评分
				vote : 14, // 投票/问卷
				signin:2,//签到
				liveVideo:0//直播
			}
		},
		//LiveVideo:15,//直播
		ResourcesDomain:16,//资源域
		CourseChapter:17,//课程章节
		CloudDisk:18,//云盘
		RedPacket:19,//红包
		UserInfo:20,//人员信息
		Course:21,//课程
		BookRoom:22,//书房
		GroupChat:23,//群聊
		DownloadApp:24,//APP下载
		Web:25,//网页
		Voice:26,//录音
		Video:29,//录制视频
		Link:31, //外链
		mapLocation:33,//地图
		CloudFolder:38, // 云盘文件夹
		microCourse:41, //速课
		TopicFolder:47, // 话题文件夹
		GroupDatafolder:48, // 资料文件夹
};
/**
 * 获取附件
 */
RichtextAttachmentUtils.clickAttachment = function(attachments,append_className, target_val, isVideo) {
	var len = attachments.length;
	if (len == 0) {
		return "";
	}
	var open_url = "";
	for (var i = 0;i < len; i++) {
		var attachment = attachments[i];
		var attachmentType = attachment.attachmentType;
		if (undefined == attachmentType || attachmentType == "") {
			continue;
		}

		if (attachmentType == AttachmentType.CloudDisk && attachment.att_clouddisk && attachment.att_clouddisk.downPath) {
			$("#open_attachment").remove();
			$("div."+append_className).parent().append('<a style="display:none;" id="open_attachment" target="_blank" href="'+attachment.att_clouddisk.downPath+'"></a>');
			var el=document.getElementById('open_attachment');
			el.click();//触发打开事件
		}
		continue;

		if (!isShare && RichtextAttachmentUtils.isXXT) {
			// 非分享页，且是在学习通里面打开的，通过客户端协议展示附件
			if(window.parent) {
   				window.parent.postMessage({'data': attachment, 'msgType':'CLIENT_OPEN_ATTACHMENT'}, '*')
   			}
			continue;
		}
		switch (attachmentType) {
		case AttachmentType.Topic:
			//话题
			var att_topic=attachment.att_topic;
			var att_topic_id = att_topic.id;
			if($.trim(att_topic.shareUrl||"")!=""){//尝试获取加密的话题id
				var reg4GetDesNoteId = new RegExp("//sharewh.chaoxing.com/share/topic/([^/]+)/getTopic", "ig"); 
				var regResultArr = reg4GetDesNoteId.exec(att_topic.shareUrl||"");
				att_topic_id = regResultArr && regResultArr.length>1?regResultArr[1]:att_topic_id;
			}
			if(isShare){
				open_url = att_topic.shareUrl;
			}else if(isScreen){
				// 投屏页，打开对应的话题投屏页面
				open_url = "https://groupyd.chaoxing.com/screen/screenProjection/topic/"+ att_topic.uuid +"/detail";
			} else {
//				open_url = "http://group.yd.chaoxing.com/pc/topic/bbs/"+ att_topic.att_group.bbsId +"/"+att_topic_id+"/replysList";
				open_url = "https://groupweb.chaoxing.com/pc/topic/jumpToTopicDetail?bbsid="+ att_topic.att_group.bbsId +"&uuid=" + att_topic.uuid;
			}
			break;
		case AttachmentType.Note:
			//笔记
			var att_note=attachment.att_note;
			var att_note_url = 'https://noteyd.chaoxing.com/pc/note_note/noteDetailLatest/'+att_note.cid;
			if(isShare){
				open_url = att_note.shareUrl;
			} else if(isScreen){
				// 投屏页，打开对应的笔记投屏页面
				open_url = "https://noteyd.chaoxing.com/screen/note_note/noteDetail/" + att_note.cid;
			} else{
				open_url = att_note_url;
			}
			break;
		case AttachmentType.Notebook:
			// 笔记本
			var att_notebook = attachment.att_notebook;
			var att_notebook_url = 'https://noteyd.chaoxing.com/pc/note_notebook/otherNotebooksLatest/'+att_notebook.cid;
			if(!isShare){
				open_url = att_notebook_url;
			}
			break;
		case AttachmentType.Special:
			//专题
			var att_subject = attachment.att_subject;
			var category = att_subject.category;
			if(category == "0"){//专题
				var subjectLink = att_subject.subjectLink;//链接
				var courseId = subjectLink.substring(subjectLink.lastIndexOf("/")+1);
				var askCharIndex = courseId.indexOf("?");
				if (askCharIndex >-1) {
					courseId = courseId.substring(0,askCharIndex);
				}
				if(isShare){
					if (RichtextAttachmentUtils.isPhone) {
						open_url = subjectLink;
					} else {
						open_url = "http://mooc1.chaoxing.com/course/"+ courseId +".html";
					}
				}else{
					if (isScreen) {
						open_url = 'http://special.chaoxing.com/special/screen/'+courseId;
					} else {
						open_url = 'http://mooc1.chaoxing.com/course/'+courseId+'.html';
					}
				}
			}else if(category == "1"){//专题章节
				//专题章节
				var chapterLink = att_subject.chapterLink;//章节链接
				var askCharIndex = chapterLink.indexOf("?");
				var openUrl = "";
				if(chapterLink.indexOf("http://group.yd.chaoxing.com")!=-1){
					//一键专题对应的专题章节
					openUrl = chapterLink;
				} else if (chapterLink.indexOf('courseId') == -1) {
					// 不包含 courseId， 直接使用 chapterLink
					openUrl = chapterLink;
				} else{
					var courseId = '';
					var chapterId = '';
					if (askCharIndex > -1) {
						// 专题中的某一章，为一个具体的章节
						courseId = chapterLink.split("?")[1].split("&")[0].split("=")[1];
						chapterId = chapterLink.substring(chapterLink.lastIndexOf("/")+1,askCharIndex);
					} else {
						// 套专题中的某一章，是一个单独的专题
						courseId = chapterLink.substring(chapterLink.lastIndexOf("/")+1);
					}
					if (chapterId) {
						if (isScreen) {
							openUrl = 'http://special.chaoxing.com/special/screen/tocard/'+ chapterId +'?courseId='+ courseId;
						} else {
							openUrl = 'http://mooc1-3.chaoxing.com/nodedetailcontroller/visitnodedetail?courseId='+courseId+'&knowledgeId='+chapterId+'&courseType=0';
						}
					} else {
						if (isScreen) {
							openUrl = 'http://special.chaoxing.com/special/screen/'+courseId;
						} else {
							openUrl = 'http://mooc1.chaoxing.com/course/'+courseId+'.html';
						}
					}
					
				}
				if(isShare && RichtextAttachmentUtils.isPhone){
					openUrl = chapterLink;
				}
				open_url = openUrl;
			}
			break;
		case AttachmentType.Newspaper:
			//报纸
			var done = false;
			var att_subject = attachment.att_subject;
			var category = att_subject.category;
			if(category == "0"){
				//报纸
				var open_url = att_subject.subjectLink;//链接		
				var paperId = subjectLogo.substring(subjectLogo.lastIndexOf("/")+1);
				if (!isScreen && paperId&&$.trim(paperId||"")!=""){
					open_url = "http://apps.ananas.chaoxing.com/paper/"+paperId.substring(0,paperId.indexOf("."));
				}
			} else if (category=="1") {
				//报纸章节
				var open_url = att_subject.chapterLink;//章节链接
				if (!isScreen) {
					var transferKey = att_subject.transferKey || '';
					// transferKey 结构: "300000006_320700000014-100059093733"
					var paperId = transferKey.substring(transferKey.indexOf('_')+1, transferKey.indexOf('-'));
					var chapterId = transferKey.substring(transferKey.indexOf('-')+1, transferKey.length);
					if (paperId && chapterId) {
						var currentDate = RichtextAttachmentUtils.getNowFormatDate('.');
						open_url = 'http://apps.ananas.chaoxing.com/paper/content/'+ currentDate +'/'+ paperId +'/'+ chapterId +'/0';
					}
				}
			}
			break;
		case AttachmentType.Group:
			//小组
			var att_group = attachment.att_group || "";
			if (att_group != "") {
				if(isShare){
					open_url = att_group.shareUrl;
				}else{
					var bbsId = att_group.bbsId || "";
					if (bbsId != "") {
						open_url = "https://groupweb.chaoxing.com/pc/topic/topiclist/index?bbsid=" + bbsId;
						
					}
				}
			}
			break;
		case AttachmentType.Notice:
			//通知
			var att_notice = attachment.att_notice;
			var noticeId = att_notice.idCode;
			if (isShare){
				if (!att_notice.shareUrl) {
					open_url = "https://sharewh.chaoxing.com/share/notice?sn="+ noticeId +"&sharebacktype=4&s_noticeId="+noticeId;
				} else {
					open_url = att_notice.shareUrl;
				}
			} else if (isScreen){
				open_url = 'https://notice.chaoxing.com/screen/screenProjection/notice/detail?idCode='+noticeId;
			} else {
				open_url = 'http://notice.chaoxing.com/pc/notice/'+noticeId+'/detail';
			}
			break;
		case AttachmentType.Notifications:
			//通知提醒
			var att_notice = attachment.att_mission;
			var noticeId = att_notice.aid || 0;
			if(isShare){
				openUrl = att_notice.shareUrl;
			}else{
				open_url = 'https://notice.chaoxing.com/pc/notice/'+noticeId+'/detail';
			}
			break;
		case AttachmentType.Courses.Value://课程附件
			var att_course = attachment.att_chat_course||{};
			if(att_course && att_course.type>-1){//格式完好，分类处理，没有处理的显示默认提示
				switch (att_course.atype) {
				
				case AttachmentType.Courses.subType.liveVideo:
					//直播
					var att_livevideo = att_course;
					if(!att_livevideo.description||!att_livevideo.description.liveId){
						break;
					}
					var liveId = att_livevideo.description.liveId || '';
					open_url = "https://zhibo.chaoxing.com/"+liveId;
					break;
				case AttachmentType.Courses.subType.signin: 
					// 签到
					if(att_course.id){
						if (isScreen) {
							open_url = 'https://mobilelearn.chaoxing.com/widget/sign/pcTeaSignController/showSignInfoForQunliao?activeId='+att_course.id;
						} else {
							open_url = 'http://mobilelearn.chaoxing.com/widget/sign/group/pcStuSignGroupController/preSign?activeId='+att_course.id;
						}
					}
					break;
				case AttachmentType.Courses.subType.test:
					// 测验
					if (isScreen) {
						open_url = 'https://mobilelearn.chaoxing.com/widget/newvotescreen/goPCNewStatisticScreen?activeId='+att_course.id;
					}
					break;
				case AttachmentType.Courses.subType.score:
					// 评分
					if((att_course.id||0)>0){
						open_url = 'https://mobilelearn.chaoxing.com/widget/score/pc/queryGrade?activeId='+att_course.id;
					}
					break;
				case AttachmentType.Courses.subType.vote:
					// 投票/问卷
					if ((att_course.id||0)>0){
						if (isScreen) {
							open_url = 'https://mobilelearn.chaoxing.com/widget/newvotescreen/goPCNewStatisticScreen?activeId=' +att_course.id;
						} else {
							open_url = 'https://mobilelearn.chaoxing.com/widget/pcgroup/goPCGroupVotePage?activeId='+att_course.id+'&quessequence=1';
						}
					}
					break;
				}
				if (!att_course.atype) {
					// 没有 atype，则根据type判断
					if (att_course.type == 4) {
						// 直播
						var att_livevideo = att_course;
						if(!att_livevideo.description||!att_livevideo.description.liveId){
							break;
						}
						var liveId = att_livevideo.description.liveId || '';
						open_url = "https://zhibo.chaoxing.com/"+liveId;
					}
				}
				if(isShare && RichtextAttachmentUtils.isPhone && att_course.atype != AttachmentType.Courses.subType.liveVideo){
					open_url = att_course.url;
				}
			}else{
			    //格式异常，放弃处理，也不显示默认提示
				break;
			}
		case AttachmentType.CloudDisk:
			//云盘
			var att_cloud = attachment.att_clouddisk;
			if(att_cloud&&att_cloud.fileId){
				if(isShare) {
					if (isVideo) {
						// 分享页面下视频类型附件直接播放
						open_url = "https://sharewh.chaoxing.com/share/"+ att_cloud.fileId +"/playVideo";
					} else {
						// 其他附件通过分享服务的地址下载
						open_url = "https://sharewh.chaoxing.com/share/download/" + att_cloud.fileId;
					}
				} else {
					open_url = getDyDownURL(att_cloud.fileId, false);
				}
			}
			break;
		case AttachmentType.Video:
			//视频
			var att_video = attachment.att_video;
			if(att_video&&att_video.objectId2){
				if(isShare) {
					// 分享页面下直接播放
					open_url = "https://sharewh.chaoxing.com/share/"+ att_video.objectId2 +"/playVideo";
				} else {
					//open_url = "http://d0.ananas.chaoxing.com/download/" + att_video.objectId2;
					open_url = getDyDownURL(att_video.objectId2, false);
				}
			}
			break;
		case AttachmentType.Voice:
			var att_voice = attachment.att_voice;
			if(att_voice&&att_voice.objectId2){
				//open_url = "http://d0.ananas.chaoxing.com/download/" + att_voice.objectId2;
				open_url = getDyDownURL(att_voice.objectId2, false);
            }
			break;
		case AttachmentType.Web:
			var att_web=attachment.att_web;
			open_url = att_web.url;
			break;
		case AttachmentType.Link:
			var att_linker=attachment.att_linker;
			open_url = att_linker.url;
			break;
		case AttachmentType.microCourse:
			var att_micro_course=attachment.att_micro_course;
			open_url = att_micro_course.url;
			break;
		case AttachmentType.mapLocation:
			var att_map_location=attachment.att_map_location;
			//open_url = 'http://map.baidu.com/?newmap=1&ie=utf-8&s=s%26wd%3D'+att_map_location.name;
			open_url = 'http://api.map.baidu.com/geocoder?title='+att_map_location.name+'&content='+att_map_location.address+'&location='+att_map_location.latitude+','+att_map_location.longitude+'&coord_type=bd09ll&output=html&src=webapp.baidu.openAPIdemo';
			break;
		case AttachmentType.StudyFolder:
			// 收藏文件夹
			var att_folder = attachment.att_resource;
			var	creatorId = att_folder.content.puid || "";
			var name = att_folder.content.folderName;//文件夹名称
			var cfid = att_folder.content.cfid;//书房文件夹cfid
			if(cfid && name){
				open_url = 'http://pc.chaoxing.com/subscribe/getSubscribeByUidFolder?cfid='+cfid+'&puid='+creatorId+'&type=mobile';
			}
			break;
		case AttachmentType.Periodical:
			// 期刊
			var att_subject = attachment.att_subject;
			if(att_subject && att_subject.settings) {
				var aid;
				if(att_subject.settings.aid) {
					aid = att_subject.settings.aid;
				} else if(att_subject.settings.sourceConfig && att_subject.settings.sourceConfig.aidEncKey){
					aid = att_subject.settings.sourceConfig.aidEncKey;
				}
				open_url = "http://m.chaoxing.com/mqk/list?mags="+ att_subject.settings.aid +"&from=space";
			}
			break;
		case AttachmentType.CloudFolder:
			// 云盘文件夹
			var att_cloudFolder = attachment.att_cloudFolder;
			if (!att_cloudFolder) {
				break;
			}
			var resid = att_cloudFolder.resid;
			var sharerPuid = att_cloudFolder.puid;
			if(resid && sharerPuid) {
				open_url = "http://pan-yz.chaoxing.com/pcNote/openFolder?resid=" + resid + "&puid=" + sharerPuid;
			}
			break;
		case AttachmentType.TopicFolder:
			// 话题文件夹
			var att_folder = attachment.att_topicfolder;
			var folder_uuid = att_folder.folder_uuid || '';//文件夹uuid
			var bbsid = att_folder.groupInfo.bbsId||'';//小组bbsid
			if(folder_uuid && bbsid) {
				//open_url = "http://group.yd.chaoxing.com/pc/topic/"+bbsid+"/topicList?isAttachment=1&folder_uuid="+folder_uuid;
				open_url = "https://groupweb.chaoxing.com/pc/topic/topiclist/index?bbsid="+ bbsid +"&folder_uuid="+folder_uuid;
			}
			break;
		case AttachmentType.GroupDatafolder:
			// 小组资料文件夹
			var att_folder = attachment.att_datafolder;
			var folderId = att_folder.folderId || '';//文件夹标识
			var bbsid = att_folder.groupInfo.bbsId||'';//小组bbsid
			if(folderId && bbsid) {
//				open_url = "http://group.yd.chaoxing.com/pc/resource/"+bbsid+"/resourceList?isAttachment=1&folderId="+folderId;
				open_url = "https://groupweb.chaoxing.com/pc/resource/jumpToResourceList?bbsid="+bbsid;
			}
			break;
		default:
			break;
		}
		
	}
	if($.trim(append_className) == ''){
		//直接返回
		return open_url;
	}
	if($.trim(open_url) != ''){
		$("#open_attachment").remove();
		if($.trim(target_val) == ''){
			target_val = '_blank';
		}
		var ua = navigator.userAgent.toLowerCase();
		if(isShare && ua && ua.indexOf("chaoxingstudy")!=-1 && ua.indexOf('chaoxingstudypc') == -1){
			// 在客户端打开时通过openurl协议打开，pc客户端不走协议
   			if(window.parent) {
   				window.parent.postMessage({'url': open_url, 'msgType':'openUrl'}, 'https://sharewh.chaoxing.com')
   				return;
   			}
		} 
		
		if(isScreen) {
			// 投屏页通过协议打开网页链接
			var content = {"openInCurrent":0,"opt":1,"urls":[open_url],"type":2}
	    	var data = {"cmd":"resourceToScreen","content":content};
	    	var body={'body':JSON.stringify(data)};
	    	parent.parent.postMessage(JSON.stringify({'cmd':'resourceToScreen','body':body}),'*');
		} else {
			$("div."+append_className).parent().append('<a style="display:none;" id="open_attachment" target="'+target_val+'" href="'+open_url+'"></a>');
			var el=document.getElementById('open_attachment');
			//el.target = '_new'; //指定在新窗口打开
			el.click();//触发打开事件
		}
		
	}
};

var getDyDownURL = function(objectId, isMedia) {
	var url = 'https://noteyd.chaoxing.com/screen/note_note/files/status/'+objectId+'?isMedia='+isMedia;
	var downUrl = '';
	$.ajaxSettings.async = false;//设置同步执行
	$.getJSON(url, function(data) {
		if (!data.status) {
			//alert('获取下载地址出错');
			return;
		}
		downUrl = data.download;
		var scheme = location.protocol;
		if(scheme.indexOf('https') != -1){
			downUrl = downUrl.replace("http://", "https://");
		}
	});
	$.ajaxSettings.async = true;//取消设置同步执行
	return downUrl;
};

// 获取域名
RichtextAttachmentUtils.getTopDomain = function(){
	
	if(!RichtextAttachmentUtils.top_domain) {
		var url = '';
	    try {
	        url = top.location.href || ''; 
	    }catch (e) { 
	        url = document.referrer || ''; 
	    }
	    if(url && url.indexOf('com') > -1) {
	    	RichtextAttachmentUtils.top_domain = url.substring(0,url.indexOf('com')+3);
	    } else {
	    	RichtextAttachmentUtils.top_domain = "";
	    }
	}
	
    return RichtextAttachmentUtils.top_domain;
}

// 获取最外层对象
RichtextAttachmentUtils.getTopParent = function() {
	 if(!RichtextAttachmentUtils.top_parent) {
		 if(parent !== parent.parent) {
			 if(isScreen) {
				 // 投屏页
				 RichtextAttachmentUtils.top_parent = parent;
			 } else {
				// 编辑页
				 RichtextAttachmentUtils.top_parent = parent.parent;
			 }
	     } else {
	         // 详情页
	    	 RichtextAttachmentUtils.top_parent = parent;
	     }
	 }
     
     return RichtextAttachmentUtils.top_parent;
}

// 获取当前时间
RichtextAttachmentUtils.getNowFormatDate = function(seperator) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if(!seperator) {
    	seperator = '-';
    }
    var currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
}