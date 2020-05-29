/**
 * 解析附件--增加了音视频播放（视频使用videojs插件(优先html5其次flash)，音频使用audio标签）
 * 		 --增加了直播支持(观看直播、中断回看、结束重播记录)
 * @date 2018-04-24 10:21:33.324
 * @author huqizhi
 */

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
				BallotQuest:{
					value : 0,
					atype : {
						test : 42, // 测验
						score : 23, // 评分
						vote : 14 // 投票/问卷
					}
				},
				Signin:1,//签到
				LiveVideo:4//直播
			}
		},
		LiveVideo:15,//直播
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
		MapLocation : 33, // 位置
		CloudFolder:38, // 云盘文件夹
		MicroCourse :41, // 速课
		TopicFolder:47, // 话题文件夹
		GroupDatafolder:48, // 小组资料文件夹
		/*DefaultHTML: '<div class="Pro-forward">'
					+'	<div class="Pro-forward-them">电脑暂不支持该附件类型，请使用移动设备查看。</div>'
					+'</div>',//默认显示的html片段
*/					
		CloudDiskImg : [
            {"type":"ppt","img":"/res/pc/images/richtext/ppt.png"},
            {"type":"pptx","img":"/res/pc/images/richtext/ppt.png"},
            {"type":"doc","img":"/res/pc/images/richtext/doc.png"},
            {"type":"docx","img":"/res/pc/images/richtext/doc.png"},
            {"type":"rar","img":"/res/pc/images/richtext/rar.png"},
            {"type":"zip","img":"/res/pc/images/richtext/rar.png"},
            {"type":"jpg","img":"/res/pc/images/richtext/jpg.png"},
            {"type":"png","img":"/res/pc/images/richtext/jpg.png"},
            {"type":"jpeg","img":"/res/pc/images/richtext/jpg.png"},
            {"type":"psd","img":"/res/pc/images/richtext/jpg.png"},
            {"type":"tiff","img":"/res/pc/images/richtext/jpg.png"},
            {"type":"gif","img":"/res/pc/images/richtext/jpg.png"},
            {"type":"bmp","img":"/res/pc/images/richtext/jpg.png"},
            {"type":"mp4","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"3gp","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"avi","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"rmvb","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"asf","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"divx","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"mpg","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"mpeg","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"mpe","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"mkv","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"vob","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"flv","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"m4v","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"mov","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"f4v","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"wmv","img":"/res/pc/images/richtext/mp4.png"},
            {"type":"mp3","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"wav","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"ogg","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"amr","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"mp3pro","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"ra","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"rma","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"real","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"midi","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"mid","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"mod","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"flac","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"ape","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"aac","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"aiff","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"m4a","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"wma","img":"/res/pc/images/richtext/mp3.png"},
            {"type":"pdf","img":"/res/pc/images/richtext/pdf.png"},
            {"type":"epub","img":"/res/pc/images/richtext/epub.png"},
            {"type":"xlsx","img":"/res/pc/images/richtext/xlsx.png"},
            {"type":"xls","img":"/res/pc/images/richtext/xlsx.png"},
            {"type":"xlsm","img":"/res/pc/images/richtext/xlsx.png"},
            {"type":"xltm","img":"/res/pc/images/richtext/xlsx.png"},
            {"type":"xlsb","img":"/res/pc/images/richtext/xlsx.png"},
            {"type":"txt","img":"/res/pc/images/richtext/txt.png"},
            {"type":"pdz","img":"/res/pc/images/richtext/pdz.png"}
   ]
};
//云盘文件类型列表
var CloudDiskFileType = {
	"xlt": {
		"pt": "Office",
		"ft": "doc"
	},
	"bmp": {
		"pt": "Image",
		"ft": "image"
	},
	"gif": {
		"pt": "Image",
		"ft": "image"
	},
	"log": {
		"pt": "Text",
		"ft": "doc"
	},
	"js": {
		"pt": "Text",
		"ft": "doc"
	},
	"rmvb": {
		"pt": "Video",
		"ft": "video"
	},
	"java": {
		"pt": "Text",
		"ft": "doc"
	},
	"avi": {
		"pt": "Video",
		"ft": "video"
	},
	"xml": {
		"pt": "Text",
		"ft": "doc"
	},
	"jpeg": {
		"pt": "Image",
		"ft": "image"
	},
	"json": {
		"pt": "Text",
		"ft": "doc"
	},
	"html": {
		"pt": "Text",
		"ft": "doc"
	},
	"jpg": {
		"pt": "Image",
		"ft": "image"
	},
	"xlsx": {
		"pt": "Office",
		"ft": "doc"
	},
	"wmv": {
		"pt": "Video",
		"ft": "video"
	},
	"png": {
		"pt": "Image",
		"ft": "image"
	},
	"wav": {
		"pt": "Audio",
		"ft": "audio"
	},
	"docx": {
		"pt": "Office",
		"ft": "doc"
	},
	"pptx": {
		"pt": "Office",
		"ft": "doc"
	},
	"mp4": {
		"pt": "Video",
		"ft": "video"
	},
	"mp3": {
		"pt": "Audio",
		"ft": "audio"
	},
	"txt": {
		"pt": "Text",
		"ft": "doc"
	},
	"flv": {
		"pt": "Video",
		"ft": "video"
	},
	"pdf": {
		"pt": "Pdf",
		"ft": "doc"
	},
	"ppt": {
		"pt": "Office",
		"ft": "doc"
	},
	"xlsm": {
		"pt": "Office",
		"ft": "doc"
	},
	"doc": {
		"pt": "Office",
		"ft": "doc"
	},
	"xls": {
		"pt": "Office",
		"ft": "doc"
	}
};
//实现ellipsis效果
var strEllipsis = function (str,maxLen){
	if(str != undefined && str.length>maxLen){
		return str.substring(0,maxLen+1)+"...";
	}
	if(str == undefined || str == null){
		str = "";
	}
	return str;
};
/**
 * 获取附件
 */
var getAttachment = function(attachments,limit,detailurl, needIndex) {
	detailurl = detailurl||"";
	if ($.trim(attachments) == "") {
		return "";
	}
	var noteAttIndex = "";
	
	var len = attachments.length;
	if (len == 0) {
		return "";
	}
	if ($.trim(limit||"") != ""){
		if (len > limit) {
			len = limit;
		}
	}
	var attachmentBox = "";
	for (var i = 0;i < len; i++) {
		//console.log(i);
		var attachment = attachments[i];
		var attachmentType = attachment.attachmentType;
		if (undefined == attachmentType || attachmentType == "") {
			continue;
		}
		if(needIndex) {
			noteAttIndex = 'noteAttIndex="att_' + i + '"'
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
			var att_topic_url = "http://group.yd.chaoxing.com/pc/topic/bbs/"+ att_topic.att_group.bbsId + "/" + att_topic_id + "/replysList";
			if(document.referrer && document.referrer.indexOf("screen/note_note") != -1){
				// 投屏页，打开对应的话题投屏页面
				att_topic_url = "https://groupyd.chaoxing.com/screen/screenProjection/topic/"+ att_topic.uuid +"/detail";
			}
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, att_topic_url, att_topic.images, att_topic.title, att_topic.content, att_topic.att_group.name);
			break;
		case AttachmentType.Note:
			//笔记
			var att_note=attachment.att_note;
			var att_note_url = (att_note.cid != undefined) ? ('https://noteyd.chaoxing.com/pc/note_note/noteDetailLatest/'+att_note.cid) : "javascript:void(0);";
			var host = window.location.host;
			var isNoteDomain = host && (host.indexOf("noteyd") > -1 || host.indexOf("note.yd") > -1);
			if(isNoteDomain && WinInitConfig["des"]&&$.trim(WinInitConfig["des"])!="") {
				// 笔记页面下生成笔记附件时用到
				att_note_url += '/'+WinInitConfig["des"];
			}
			if(host.indexOf("screen/note_note") != -1){
				// 投屏页，打开对应的笔记投屏页面
				att_note_url = "https://noteyd.chaoxing.com/screen/note_note/noteDetail/" + att_note.cid;
			} 
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, att_note_url, att_note.images, att_note.title, att_note.contentTxt, att_note.creatorName, attachmentType);
			break;
		case AttachmentType.Notebook:
			// 笔记本
			var att_notebook = attachment.att_notebook;
			if (!att_notebook) {
				break;
			}
			var notebookName = att_notebook.name || "";
	        var notebookLogo = "";
	        var notebookType = att_notebook.openedState || "";
	        if(notebookType == 0){
	            notebookLogo = "/res/pc/images/richtext/ic_folder_private.png";
	        }else if(notebookType == 1 || notebookType == 2 || notebookType == 3){
	            notebookLogo = "/res/pc/images/richtext/ic_folder_share.png";
	        }
			var att_notebook_url = 'https://noteyd.chaoxing.com/pc/note_notebook/otherNotebooksLatest/'+att_notebook.cid;
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, att_notebook_url, notebookLogo, notebookName);
			break;
		case AttachmentType.Special:
			//专题
			var att_subject = attachment.att_subject;
			var category = att_subject.category;
			if(category == "0"){//专题
				var subjectTitle = att_subject.subjectTitle;//专题标题
				var subjectDescription = att_subject.subjectDescription||"";//专题作者
				//专题
				var subjectLogo = att_subject.subjectLogo;//专题logo
				var subjectLink = att_subject.subjectLink;//链接
				var courseId = subjectLink.substring(subjectLink.lastIndexOf("/")+1);
				
				attachmentBox += getAttachmentFormatHtml(noteAttIndex, "http://mooc1.chaoxing.com/course/"+courseId+".html", subjectLogo, (subjectTitle||'专题'), subjectDescription);
			}else if(category == "1"){//专题章节
				//专题章节
				var chapterTitle = att_subject.chapterTitle;//章节标题
				var chapterDescription = att_subject.chapterDescription;//内容简介
				var chapterLogo = att_subject.chapterLogo;//章节logo
				var chapterLink = att_subject.chapterLink;//章节连接
				var askCharIndex = chapterLink.indexOf("?");
				var openUrl = "";
				if(chapterLink.indexOf("http://group.yd.chaoxing.com")!=-1){
					//一键专题对应的专题章节
					openUrl=chapterLink;
				}else{
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
						openUrl = 'http://mooc1-3.chaoxing.com/nodedetailcontroller/visitnodedetail?courseId='+courseId+'&knowledgeId='+chapterId+'&courseType=0';
					} else {
						openUrl = 'http://mooc1.chaoxing.com/course/'+courseId+'.html';
					}
				}
				attachmentBox += getAttachmentFormatHtml(noteAttIndex, openUrl, chapterLogo, (chapterTitle||"专题章节"), "", "《"+att_subject.subjectTitle+"》");
			}else{
				attachmentBox += '<div class="Pro-forward" '+ noteAttIndex +'>'
								+'	<div class="Pro-forward-them">电脑暂不支持该附件类型，请使用移动设备查看。</div>'
								+'</div>';
			}
			break;
		case AttachmentType.Newspaper:
			//报纸
			var done = false;
			var att_subject = attachment.att_subject;
			var category = att_subject.category;
			var subjectTitle = att_subject.subjectTitle;//报纸标题
			if(category == "0"){//报纸
				var subjectLogo = att_subject.subjectLogo;//报纸logo
				var subjectDescription = att_subject.subjectDescription||"";//报纸发表单位
				var subjectLink = att_subject.subjectLink;//链接
				if(subjectLogo&&$.trim(subjectLogo||"")!=""){					
					var paperId = subjectLogo.substring(subjectLogo.lastIndexOf("/")+1);
					if(paperId&&$.trim(paperId||"")!=""){
						subjectLink = "http://apps.ananas.chaoxing.com/paper/"+paperId.substring(0,paperId.indexOf("."));
						
						attachmentBox += getAttachmentFormatHtml(noteAttIndex, subjectLink, subjectLogo, (subjectTitle||'报纸'), subjectDescription);
						done = true;
					}
				}
			} else if (category == "1") {
				// 报纸章节
				var open_url = att_subject.chapterLink;// 章节链接，这个链接是投屏页的地址
				var chapterTitle = att_subject.chapterTitle || "";
				var chapterLogo = att_subject.chapterLogo || '';
				var transferKey = att_subject.transferKey || '';
				// transferKey 结构: "300000006_320700000014-100059093733"
				var paperId = transferKey.substring(transferKey.indexOf('_')+1, transferKey.indexOf('-'));
				var chapterId = transferKey.substring(transferKey.indexOf('-')+1, transferKey.length);
				if (paperId && chapterId) {
					var currentDate = getNowFormatDate('.');
					open_url = 'http://apps.ananas.chaoxing.com/paper/content/'+ currentDate +'/'+ paperId +'/'+ chapterId +'/0';
				}
				attachmentBox += getAttachmentFormatHtml(noteAttIndex, open_url, chapterLogo, chapterTitle, '', '《'+subjectTitle+'》');
				done = true;
			}
			if(!done){
				attachmentBox += '<div class="Pro-forward" '+ noteAttIndex +'>'
								+'	<div class="Pro-forward-them">电脑暂不支持该附件类型，请使用移动设备查看。</div>'
								+'</div>';
			}
			break;
		case AttachmentType.Group:
			//小组
			var att_group = attachment.att_group || "";
			if (att_group != "") {
				var groupLogo = att_group.groupLogo[0] || "";
				var groupName = att_group.groupName || "";
				var groupId = att_group.groupId || "";
				var url = "";
				if (groupId != "") {
					url = "http://group.yd.chaoxing.com/pc/topic/"+groupId+"/topicList";
				}
				
				attachmentBox += getAttachmentFormatHtml(noteAttIndex, url, groupLogo, "小组", groupName, "", attachmentType);
			}
			
			break;
		case AttachmentType.Notice:
			//通知
			var att_notice = attachment.att_notice;
			var noticeTitle = att_notice.title || "";//通知标题
			var noticeContent = att_notice.content || "";//通知内容
			var noticeId = att_notice.id || 0;
			
			var url = 'http://notice.chaoxing.com/pc/notice/'+noticeId+'/detail';
			var icon = att_notice.logo || "/res/pc/images/note/tz.png";
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, url, icon, (noticeTitle || '通知'), noticeContent, (att_notice.createrName||'通知'));
			break;
		case AttachmentType.Notifications:
			//通知提醒
			var att_notice = attachment.att_mission;
			var noticeTitle = att_notice.title || "";//通知标题
			var noticeContent = att_notice.content || "";//通知内容
			var noticeId = att_notice.aid || 0;
			
			var url = 'http://notice.chaoxing.com/pc/notice/'+noticeId+'/detail';
			var icon = "/res/pc/images/note/tz.png"
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, url, icon, (noticeTitle || '通知'), noticeContent, "通知提醒");
			break;
		case AttachmentType.Courses.Value://课程附件
			var att_course = attachment.att_chat_course||{};
			if(att_course&&att_course.type>-1){//格式完好，分类处理，没有处理的显示默认提示
				switch (att_course.type) {
				case AttachmentType.Courses.subType.LiveVideo://直播
					var att_livevideo = att_course;
					if(!att_livevideo.description||!att_livevideo.description.vdoid||!att_livevideo.description.downUrl||!att_livevideo.description.pullUrl){
						break;
					}
					var downUrl = att_livevideo.description.downUrl.mp4Url||""; //下载地址
					var liveUrl = att_livevideo.description.pullUrl.flvPullUrl||""; //直播地址,rtmp协议rtmpPullUrl地址，flv协议flvPullUrl地址
					var vdoid = att_livevideo.description.vdoid||"";  //直播资源id
					var liveId = att_livevideo.description.liveId || ""; // 直播id
					var streamName = att_livevideo.description.streamName||"";  //直播流媒体资源名称
					if(vdoid!=""&&liveUrl!=""&&downUrl!=""){
//						liveObj.map.put(vdoid, {"vdoid":vdoid,"streamName":streamName,"liveUrl":liveUrl+"?"+vdoid,"downUrl":downUrl,"liveStatus":0,"hasLoad":false,"ifreview":1,"liveId":liveId});
						attachmentBox += '<div class="Pro-annex-zb" vdoid="'+vdoid+'" '+ noteAttIndex +'>'
										+'	<div class="Mtion-con">'
										+'		<div class="Ht-nation Zb-nation-no">'
										+contentImgFormatHtml("/res/pc/images/zb_icon_stop.png")
										+'			<div class="Ht-ct">'
										+'				<div class="Ht-tit">'+(att_livevideo.title||'直播')+'</div>'
										+'				<p>'+(att_livevideo.subTitle||'')+'</p>'
										+'			</div>'
										+'		</div>'
										+'	</div>'
										+'	<div class="Zb-status clearfix">'
										+'		<span class="name fr">主播：'+(att_livevideo.description.userName||'')+'</span>'
										+'		<span class="Zb-text">直播未开始</span>'
										+'	</div>'
										+'</div>';
					}
					break;
				case AttachmentType.Courses.subType.Signin:
					var icon = att_course.logo;
					var title = att_course.title;
					var openUrl = "";
					if(att_course.id && att_course.atype == 2){
						// 小组签到
						openUrl = 'http://mobilelearn.chaoxing.com/widget/sign/group/pcStuSignGroupController/preSign?activeId='+att_course.id;
					}
					attachmentBox += getAttachmentFormatHtml(noteAttIndex, openUrl, (icon||"/res/pc/images/note/icon_signin.png"), (title||'签到'));
					break;
				case AttachmentType.Courses.subType.BallotQuest.value:
					var att_BQ = att_course;
					var openUrl = "javascript:void(0);";
					var show = true;
					switch(att_BQ.atype) {
					case AttachmentType.Courses.subType.BallotQuest.atype.test : // 测验
						// 测验暂时不显示
						show = false;
						break;
					case AttachmentType.Courses.subType.BallotQuest.atype.score : // 评分
						if((att_BQ.id||0)>0){
							openUrl = 'https://mobilelearn.chaoxing.com/widget/score/pc/queryGrade?activeId='+att_BQ.id;
						}
						break;
					case AttachmentType.Courses.subType.BallotQuest.atype.vote : // 投票/问卷
						if((att_BQ.id||0)>0){
							openUrl = 'http://mobilelearn.chaoxing.com/widget/pcgroup/goPCGroupVotePage?activeId='+att_BQ.id+'&quessequence=1'
						}
						break;
					defalut :
						break;
					}
					if((att_BQ.id||0)>0){
						var BQtitle = att_BQ.title;		//标题
						var BQsubTitle = att_BQ.subTitle || "";//副标题--时间
						var BQid = att_BQ.id;	//投票问卷id
						
						if(show) {
							attachmentBox += getAttachmentFormatHtml(noteAttIndex, openUrl, (att_BQ.logo||"/res/pc/images/note/vote_icon_img.png"), (BQtitle||'投票'), BQsubTitle);
								
						} else {
							attachmentBox += '<div class="Pro-forward" '+ noteAttIndex +'>'
											+'	<div class="Pro-forward-them">电脑暂不支持该附件类型，请使用移动设备查看。</div>'
											+'</div>';
						}
					}
					break;
				}
				break;
			}else{//格式异常，放弃处理，也不显示默认提示
				break;
			}
		case AttachmentType.CloudDisk:
			//云盘
			var att_cloud = attachment.att_clouddisk;
			if(att_cloud&&att_cloud.fileId){
				var name = att_cloud.name || "";
				var downPath = getDyDownURL(att_cloud.fileId);;
				var fileSize = att_cloud.fileSize || "";
				//icon兼容手机端上传的云盘附件里没有icon的情况
				//var icon = att_cloud.icon||(att_cloud.suffix?"https://mobilelearn.chaoxing.com/images/cloud"+att_cloud.suffix+".png":"/res/pc/images/cloudfile.png");
				var icon = "/res/pc/images/richtext/icon_cloud.png";
				for(var j=0;j<AttachmentType.CloudDiskImg.length;j++){
	                if(att_cloud.suffix == AttachmentType.CloudDiskImg[j].type){
	                    icon = AttachmentType.CloudDiskImg[j].img;
	                }
	            }
				var aHtml = "";
				//云盘可在网页浏览的类型，目前分为四大类：video、audio、doc、image，在CloudDiskFileType[att_cloud.suffix]["ft"]中
	        	if(att_cloud.isfile&&att_cloud.isfile==true&&att_cloud.suffix&&CloudDiskFileType[att_cloud.suffix]&&CloudDiskFileType[att_cloud.suffix]["ft"]){//云盘可在线预览文件
	        		aHtml = '<a href="javascript:void(0);" url="'+downPath+'" resid="'+att_cloud.fileId+'" class="cdft" cdft="'+(CloudDiskFileType[att_cloud.suffix]["ft"]||"")+'">';
	        	}else{//云盘不可在网页浏览的类型，直接下载
	        		aHtml = '<a href="javascript:void(0);" url="'+downPath+'" resid="'+att_cloud.fileId+'" class="cdft" cdft="">';
		    	}
	        	
	        	attachmentBox += getAttachmentFormatHtml(noteAttIndex, "", icon, name, fileSize, "", attachmentType, "/res/pc/images/cloudfile.png", aHtml);
			}
			break;
		case AttachmentType.Video:
			// 视频
			var att_video = attachment.att_video;
			if(att_video&&att_video.objectId2){
				var name = att_video.fileTitle || "";
				var fileSize = att_video.fileLength || 0;
				if(typeof fileSize == "number"){//如果是纯数字，则自动进阶保留一位小数
					fileSize = sizeformat(fileSize);
				}
				//icon兼容手机端上传的云盘附件里没有icon的情况
				//var icon = (att_video.coverUrl||"")!=""?att_video.coverUrl:(att_video.type?"https://mobilelearn.chaoxing.com/images/cloud"+att_video.type+".png":"/res/pc/images/cloudfile.png");
				var icon = att_video.coverUrl || "/res/pc/images/richtext/mp4.png";
				var aHtml = '<a href="javascript:void(0);" url="" resid="'+att_video.objectId2+'" class="cdft" video="video" cdft="video">'
				attachmentBox += getAttachmentFormatHtml(noteAttIndex, "", icon, name, fileSize, "", attachmentType, "/res/pc/images/richtext/mp4.png", aHtml);
			}
			break;
		case AttachmentType.Voice:
			var att_voice = attachment.att_voice;
			if(att_voice&&att_voice.objectId2){
				var name = "";
				if(att_voice.titleEdited == 1) {
					// 名称修改过，显示修改后的名称
					name = att_voice.fileTitle
				} else {
					// 显示时间
					name = timeformat(att_voice.voiceLength || 0);
				}
				var downPath = att_voice.downPath || "";
				var fileSize = att_voice.fileLength || 0;
				if(typeof fileSize == "number"){//如果是纯数字，则自动进阶保留一位小数
					fileSize = sizeformat(fileSize);
				}
				var icon = "/res/pc/images/richtext/voice.png";
				var aHtml = '	<a href="javascript:void(0);" url="'+downPath+'" resid="'+att_voice.objectId2+'"  class="cdft" voice="voice"  cdft="audio">';

				attachmentBox += getAttachmentFormatHtml(noteAttIndex, "", icon, name, fileSize, "", attachmentType, "/res/pc/images/cloudfile.png", aHtml);
            }
			break;
		case AttachmentType.Web:
			var att_web=attachment.att_web;
			//var errorImg = "javascript:this.src='/res/pc/images/note/link.png';"
			var errorImg = "/res/pc/images/note/link.png";
			var icon = att_web.logo||"/res/pc/images/note/link.png";
			
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, att_web.url, icon, (att_web.title||"网页"), "", "", "", errorImg);
			break;
		case AttachmentType.Link:
			var att_linker=attachment.att_linker;
			//var errorImg = "javascript:this.src='/res/pc/images/note/link.png';"
			var errorImg = "res/pc/images/note/link.png";
			var icon = att_linker.logo||"/res/pc/images/note/link.png";
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, att_linker.url, icon, (att_linker.title||"外链"), "", "", "", errorImg);
			break;
		case AttachmentType.StudyFolder:
			// 收藏文件夹
			var att_folder = attachment.att_resource;
			var att_resource = att_folder.content
			try {
				att_resource = JSON.parse(att_resource);
			} catch(e) {
				
			}
			if (!att_resource) {
				break;
			}
		    var resourceName = att_resource.folderName || "";
	        var resourceLogo = "";
	        var resourceType = att_resource.shareType || "";
	        if(resourceType == 2){
	            resourceLogo = "/res/pc/images/richtext/ic_folder_private.png" || "";
	        }else if(resourceType == 0 || resourceType == 3){
	            resourceLogo = "/res/pc/images/richtext/ic_folder_share.png" || "";
	        }
	        var	creatorId = att_resource.puid || "";
			var cfid = att_resource.cfid;//书房文件夹cfid
			var att_notebook_url = "javascript:void(0);";
			if(cfid && resourceName){
				att_notebook_url = 'http://pc.chaoxing.com/subscribe/getSubscribeByUidFolder?cfid='+cfid+'&puid='+creatorId+'&type=mobile';
			}
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, att_notebook_url, resourceLogo, resourceName);
			break;
		case AttachmentType.Periodical:
			// 期刊
			var att_subject = attachment.att_subject;
			if(!att_subject) {
				break;
			}
			var aid;
			var att_subject_url="javascript:void(0);";
			if(att_subject && att_subject.settings) {
				if(att_subject.settings.aid) {
					aid = att_subject.settings.aid;
				} else if(att_subject.settings.sourceConfig && att_subject.settings.sourceConfig.aidEncKey){
					aid = att_subject.settings.sourceConfig.aidEncKey;
				}
			}
			if(aid) {
				att_subject_url = "http://m.chaoxing.com/mqk/list?mags="+ aid +"&from=space";
			}
			
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, att_subject_url, att_subject.subjectLogo, att_subject.subjectTitle, att_subject.subjectDescription)
			break;
		case AttachmentType.CloudFolder:
			// 云盘文件夹
			var att_cloudFolder = attachment.att_cloudFolder;
			if (!att_cloudFolder) {
				break;
			}
			var cloudFolderName = att_cloudFolder.name || "";
			var icon = "/res/pc/images/richtext/ic_folder_private.png";
			var resid = att_cloudFolder.resid;
			var sharerPuid = att_cloudFolder.puid;
			var open_url = "";
			if(resid && sharerPuid) {
				open_url = "https://pan-yz.chaoxing.com/pcNote/openFolder?resid=" + resid + "&puid=" + sharerPuid;
			}
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, open_url, icon, cloudFolderName)
			break;
		case AttachmentType.MapLocation:
			// 地理位置
			var att_map_location = attachment.att_map_location;
			if (!att_map_location) {
				break;
			}
			var mapLogo = att_map_location.iconUrl || "/res/pc/images/richtext/icon_map.png";
			var openUrl = 'http://api.map.baidu.com/geocoder?title='+att_map_location.name+'&content='+att_map_location.address+'&location='+att_map_location.latitude+','+att_map_location.longitude+'&coord_type=bd09ll&output=html&src=webapp.baidu.openAPIdemo';
			attachmentBox += getAttachmentFormatHtml(noteAttIndex, openUrl, mapLogo, '<b class="icon"></b>位置共享', (att_map_location.address||""))
			break;
		case AttachmentType.MicroCourse:
			// 速课
			var att_micro_course = attachment.att_micro_course;
			if (!att_micro_course) {
				break;
			}
			var microCover = att_micro_course.cover || "/res/pc/images/richtext/icon_map.png";
            microCover = microCover.replace(/.webp/g, '.jpg');
            attachmentBox += getAttachmentFormatHtml(noteAttIndex, att_micro_course.url, microCover, '速课', (att_micro_course.title||""), "", attachmentType)
            break;
		case AttachmentType.TopicFolder:
			// 话题文件夹
			var att_folder = attachment.att_topicfolder;
			var name = att_folder.name || "";//文件夹名称
			var folder_uuid = att_folder.folder_uuid || '';//文件夹uuid
			var bbsid = att_folder.groupInfo.bbsId||'';//小组bbsid
			var url = "";
			if(bbsid && folder_uuid) {
				url = "http://group.yd.chaoxing.com/pc/topic/"+bbsid+"/topicList?isAttachment=1&folder_uuid="+folder_uuid;
			}
			var icon = "/res/pc/images/richtext/ic_folder_private.png";
            attachmentBox += getAttachmentFormatHtml(noteAttIndex, url, icon, name);
            break;
		case AttachmentType.GroupDatafolder:
			// 小组资料文件夹
			var att_folder = attachment.att_datafolder;
			var name = att_folder.folderName || "";//文件夹名称
			var folderId = att_folder.folderId || '';//文件夹标识
			var bbsid = att_folder.groupInfo.bbsId||'';//小组bbsid
			var url = "";
			if(bbsid && folderId) {
				url = "http://group.yd.chaoxing.com/pc/resource/"+bbsid+"/resourceList?isAttachment=1&folderId="+folderId;
			}
			var icon = "/res/pc/images/richtext/ic_folder_private.png";
            attachmentBox += getAttachmentFormatHtml(noteAttIndex, url, icon, name);
            break;
		case AttachmentType.UserInfo:
			// 名片
			var att_user = attachment.att_user;
			if (!att_user) {
				break;
			}
			var userPic = att_user.pic || "/res/pc/images/richtext/icon_gray.png";
			var userName = att_user.name || "";
            attachmentBox += getAttachmentFormatHtml(noteAttIndex, "", userPic, '名片', userName, "", attachmentType);
            break;
		default:
			attachmentBox += '<div class="Pro-forward" '+ noteAttIndex +'>'
							+'	<div class="Pro-forward-them">电脑暂不支持该附件类型，请使用移动设备查看。</div>'
							+'</div>';
			break;
		}
		
	}
	return attachmentBox;
};

/**
 * 获取附件 html
 * @param noteAttIndex 旧版笔记编辑的时候需要用
 * @param openUrl 打开地址
 * @param img 附件左侧图片
 * @param title 附件第一行内容
 * @param desc 附件第二行内容
 * @param from 附件第三行内容
 * @param attachmentType 附件类型
 * @param errorImg 错误图片
 * @param aHtml a标签内容（云盘文件用）
 * @returns
 */
function getAttachmentFormatHtml(noteAttIndex, openUrl, img, title, desc, from, attachmentType, errorImg, aHtml) {
	var attachment = "";
	attachment += '<div class="noteAppendix">'
				+ '<a href="#">';
	
	if(!errorImg) {
		errorImg = "/res/pc/images/richtext/icon_gray.png";
	}
	attachment += contentImgFormatHtml(img, errorImg);
	attachment += '<div class="appendixTxt">'
	attachment += '<h3>' + title + '</h3>'
	
	if(from) {
		if(attachmentType == AttachmentType.Note) {
			from = from + "的笔记"
		}
		attachment += '<p>来自-'+ from +'</p>';
	} else {
		attachment += '<p>'+ desc +'</p>'
	}
	attachment += '</div></a></div>'
	
	return attachment;
}


//将秒格式化为时分秒
function formatSeconds(value) { 
	var theTime = parseInt(value);// 秒 
	var theTime1 = 0;// 分 
	var theTime2 = 0;// 小时 
	// alert(theTime); 
	if(theTime > 60) {
		theTime1 = parseInt(theTime/60); 
		theTime = parseInt(theTime%60); 
		// alert(theTime1+"-"+theTime); 
		if(theTime1 > 60) { 
			theTime2 = parseInt(theTime1/60); 
			theTime1 = parseInt(theTime1%60); 
		}
	}
	var result = ""+parseInt(theTime)+"秒"; 
	if(theTime1 > 0) { 
		result = ""+parseInt(theTime1)+"分"+result; 
	} 
	if(theTime2 > 0) { 
		result = ""+parseInt(theTime2)+"时"+result; 
	} 
	return result; 
}
//文件大小格式
function sizeformat(limit){
	if(limit ==null || limit == ""){
		return "0KB";
	}  
	var index=0;    
	var array=new Array('B','KB','MB','GB','TB','PT');    
	while(limit>=1024){//数字部分1到1024之间  
	    limit /= 1024;
	    index += 1;
	}  
	limit=limit.toFixed(1)+array[index];
	return limit;    
}
function getFile(objectId,divId){
	if(objectId == null || undefined == objectId || '' == objectId){
		return;
	}
	var url = '/share/note/'+objectId+'/getYunFiles';
	$.getJSON(url,function(data){
		if(data.result = 1){
			var mp3url = data.data;
			$("#"+divId).append('<audio preload="preload">'
					+'<source src="'+mp3url+'" type="audio/mpeg">'
					+'</audio>');
		}
	});
}
//时间格式化
function timeformat(limit){
	if(!limit){  
		return "0秒";
	}
	limit = parseInt(limit);
	var index=0;    
	var timeUnit=new Array('秒','分','小时');
	var timeArray = new Array();
	if(limit>=60){
		while(limit>=60){//数字部分1到60之间
			timeArray.push(limit%60);
			limit = parseInt(limit/60);
			index += 1;
		};
	}
	timeArray.push(limit);
	var timeFormat = "";
	for(var i=timeArray.length-1;i>=0;i--){
		timeFormat += timeArray[i]+timeUnit[i];
	}
	return timeFormat;    
}
/**
 * @descr 附件图标html片段构造--只识别超星图片服务器的图，其他图不识别将使用原图
 * @param imgs 图片地址字符串或者图片地址字符串构成的数组
 * @param errorImg 错误图片
 * @param format 格式化字符串，将替换超星图片服务器中的/origin/或者/width_height*\/部分，默认值为'58_58c'
 */
function contentImgFormatHtml(imgs, errorImg, formatStr){
	formatStr = formatStr||'58_58c';
	var myImgServerReg = /^http:\/\/p.ananas.chaoxing.com\/star3\/(origin|\d+_\d+\w?\d*)\//;
	if((imgs||[]).length>0 && (imgs instanceof Array||typeof imgs == "string")){
		var tmpOneImg = imgs instanceof Array?imgs[0]:imgs;
		if(myImgServerReg.test(tmpOneImg) && myImgServerReg.exec(tmpOneImg).length==2){
			tmpOneImg = tmpOneImg.replace(myImgServerReg.exec(tmpOneImg)[1],formatStr);
		}
		// ie 不支持 startsWith，改为正则匹配
		var reg = new RegExp("^/res");
		if(tmpOneImg && reg.test(tmpOneImg)) {
			// 相对路径，用的笔记服务里面的地址
			tmpOneImg = "https://noteyd.chaoxing.com" + tmpOneImg;
		}
		if(errorImg) {
			var icon_domain = "";
			if(errorImg && reg.test(errorImg)) {
				// 相对路径
				icon_domain = "https://noteyd.chaoxing.com";
			}
			errorImg = "javascript:this.src='" + icon_domain + errorImg +"';"
			return '<div class="appendixImg"><img src="'+tmpOneImg+'" onerror="'+ errorImg +'" alt="" ></div>'
		} else {
			return '<div class="appendixImg"><img src="' + tmpOneImg + '" alt="" ></div>'
		}
	}else{
		return '';
	}
}

// 动态获取文件下载地址
function getDyDownURL(objectId) {
	/*var url = '/pc/files/status/'+objectId
	var downUrl = '';
	$.ajaxSettings.async = false;//设置同步执行
	$.getJSON(url, function(data) {
		if (!data.status) {
			return downUrl;
		}
		downUrl = data.download;
		var scheme = location.protocol;
		if(scheme.indexOf('https') != -1){
			downUrl = downUrl.replace("http://", "https://");
		}
	});
	$.ajaxSettings.async = true;//取消设置同步执行
	return downUrl;*/
	return 'https://d0.ananas.chaoxing.com/download/' + objectId;
};

//获取当前时间
function getNowFormatDate (seperator) {
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