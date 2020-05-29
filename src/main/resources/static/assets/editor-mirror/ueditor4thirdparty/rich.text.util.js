/**
 * 本次修改的地方:
 * 1、重新定义loadEditorProfile调取镜像版的loadEditorProfile1。 loadEditorProfile1为镜像版原loadEditorProfile方法
 * 2、UE.getEditor 多加参数 fileFieldName: 'uploadFile',imageFieldName: 'uploadFile'
 * 3、rtf_content.replace editor回显注释掉部分代码
 * 4、loadCssFile、loadJsFile 多加判断，如果没以http开头并且不以定义的prefix开头的链接会组装prefix
 * 5、intranetMode为TRUE（局域网模式），prefix仍然生效
 * 6、ueditor.all.js中组装iframe标签ueditor4thirdparty/attachment之前均加上了prefix
 *
 * 问题：
 * 太多东西是根据云盘定制，例如attachment里的一系列html文件，不好改。
 * 而且上传返回的数据结构不同，我们只管上传，和云盘差异性大，后续处理逻辑差异性大，会涉及大量源码的修改
 * */

RichTextUitl = {
		getRichText : function() {}, // 获取内容方法 content：正文内容，content_imgs：图片，attachment：附件，rtf_content：富文本内容
		showTips : function(){}, // 显示提示和错误信息的方法
		addLink : function(){}, // 链接标蓝（详情页调用）
		cropImage : function(){}, // 裁剪图片，将富文本中的图片换成Q50的缩略图（详情页调用）
		thumbnail2BigImgMap : '', // 替换富文本总的图片为缩略图时，生成的map，缩略图（Q50）-大图（Q80）
		afterPageRendered : function(){}, // 页面渲染完成后调用的方法（详情页调用）
		randomUUID : function() {}, // 获取 UUID
		loadImg : function() {}, // 加载图片方法
		beforeSetRtfContent : function(){}, // 在页面上设置富文本内容之前进行的操作（详情页调用）
		Regex4LinkText: new RegExp('((((http[s]{0,1}|ftp)://)([a-zA-Z0-9\\-]+\\.)+[a-zA-Z0-9\\-]+(:\\d+)?)|(((http[s]{0,1}|ftp)://)?(((?:(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))(:\\d+)?)|(([a-zA-Z0-9\\-]+\\.)+((ac)|(ad)|(ae)|(aero)|(af)|(ag)|(ai)|(al)|(am)|(an)|(ao)|(ar)|(arpa)|(as)|(asia)|(at)|(au)|(aw)|(ax)|(az)|(ba)|(bb)|(bd)|(be)|(bf)|(bg)|(bh)|(bi)|(biz)|(bj)|(bm)|(bn)|(bo)|(br)|(bs)|(bt)|(bv)|(bw)|(by)|(bz)|(ca)|(cat)|(cc)|(cd)|(cf)|(cg)|(ch)|(chintai)|(ci)|(ck)|(cl)|(cm)|(cn)|(co)|(com)|(coop)|(cr)|(cu)|(cv)|(cx)|(cy)|(cz)|(de)|(dj)|(dk)|(dm)|(do)|(dz)|(ec)|(edu)|(ee)|(eg)|(er)|(es)|(et)|(eu)|(fi)|(fj)|(fk)|(fm)|(fo)|(fr)|(ga)|(gb)|(gd)|(ge)|(gf)|(gg)|(gh)|(gi)|(gl)|(global)|(globo)|(gm)|(gmail)|(gn)|(gov)|(gp)|(gq)|(gr)|(gs)|(gt)|(gu)|(gw)|(gy)|(hk)|(hm)|(hn)|(hr)|(ht)|(hu)|(id)|(ie)|(il)|(im)|(in)|(info)|(int)|(iq)|(ir)|(is)|(it)|(je)|(jm)|(jo)|(jobs)|(jp)|(ke)|(kg)|(kh)|(ki)|(km)|(kn)|(kp)|(kr)|(kw)|(ky)|(kz)|(la)|(lb)|(lc)|(li)|(lk)|(lr)|(ls)|(lt)|(lu)|(lv)|(ly)|(ma)|(mc)|(md)|(me)|(mg)|(mh)|(mil)|(mk)|(ml)|(mm)|(mn)|(mo)|(mobi)|(mp)|(mq)|(mr)|(ms)|(mt)|(mu)|(museum)|(mv)|(mw)|(mx)|(my)|(mz)|(na)|(name)|(nc)|(ne)|(net)|(nf)|(ng)|(ni)|(nl)|(no)|(np)|(nr)|(nu)|(nz)|(om)|(org)|(pa)|(pe)|(pf)|(pg)|(ph)|(pk)|(pl)|(pm)|(pn)|(pr)|(pro)|(ps)|(pt)|(pw)|(py)|(qa)|(re)|(ro)|(rs)|(ru)|(rw)|(sa)|(sb)|(sc)|(sd)|(se)|(sg)|(sh)|(si)|(sj)|(sk)|(sl)|(sm)|(smile)|(so)|(sr)|(st)|(su)|(sy)|(sz)|(tc)|(td)|(tel)|(tf)|(tg)|(th)|(tj)|(tl)|(tm)|(tn)|(to)|(tp)|(tr)|(travel)|(tt)|(tv)|(tw)|(tz)|(ua)|(ug)|(uk)|(us)|(uy)|(uz)|(va)|(vc)|(ve)|(vg)|(vi)|(vn)|(vu)|(wf)|(ws)|(ye)|(yt)|(za)|(zm)|(zw))(?![a-zA-Z0-9]))(:\\d+)?)))(/[a-zA-Z0-9\\.\\-~!@#$%^&#$%^&amp;*+?:_/=&lt;&gt;()]*)?','gi'),//超链接文本
		loadEditorProfile : function(){}, // 编辑页加载相关配置
		loadDetailPageProfile: function(){}, // 详情页加载相关配置
		loadCssFile : function(){}, // 加载css文件
		loadJSFile : function(){}, // 加载js文件
		initUEditor : function(){}, // 初始化ueditor
		imageViewer:'', // 查看图片插件
		ueditor : '', // ueditor编辑器对象
		b64EncodeUnicode : function(){}, // base64编码
		showDeleteTips : true, // 删除图片时弹出 提示框
		limpidImg:function(){}, //图片变清晰方法
		t:'20200527',
		imgArray:new Array(), // 图片数组
		hasLoadAttachmentListener : false,
		isScreen: false,// 是否是投屏页
		// 上传文件需要的参数
		puid:'',
		token:'',
		hasLoadViewer : false,
		intranetMode : false, // 是否是内网模式，内网模式，静态资源走相对访问
		prefix : 'https://noteyd.chaoxing.com/res/plugin/',
		customUploadDataAnalysis : function(){}, // 解析上传接口返回的数据，将自定义的上传地址的结果改为编辑器里面可以解析的结构
		uploadUrl : '', // 上传图片和文件的地址
		uploadRemoteImageUrl : '', // 用于将非指定地址下的图片传到服务端替换成指定地址的图片，ueditor.config.js里面开启catchRemoteImageEnable后，需要配置
		mirrorPrefix: ''

}

//base64编码
RichTextUitl.b64EncodeUnicode = function(str) {
    return btoa(encodeURIComponent(str))
}

RichTextUitl.customUploadDataAnalysis = function(data) {
	return data;
}

RichTextUitl.loadEditorProfile = function(){
    function customUploadDataAnalysis(responseJson) {
        var returnData = {
            result : responseJson.code == 1,
            msg : responseJson.message
        }
        var data = {
        }
        if (responseJson.code) {
            data.imgUrl = responseJson.data.url;
            data.downloadUrl = responseJson.data.url;
            data.thumbnail = responseJson.data.url;
            data.playUrl = responseJson.data.url;
            returnData.data = data;
        }
        return returnData;
    }
    RichTextUitl.prefix = "/engine/assets/editor-mirror/";
    RichTextUitl.uploadUrl = "/engine/upload";
    RichTextUitl.loadEditorProfile1(true, true, customUploadDataAnalysis);
}

/**
 * @param ueditorHeight：编辑器高度
 * @param rtf_content：富文本内容
 * @param customCssurl：自定义css文件url
 */
RichTextUitl.initUEditor = function(ueditorHeight, rtf_content, customCssurl) {
	var height = ueditorHeight || 500;
	UE.getEditor('container', {
		initialFrameHeight : height,
		themePath : RichTextUitl.prefix + "ueditor4thirdparty/themes/",
		UEDITOR_HOME_URL : RichTextUitl.prefix + "ueditor4thirdparty/",
		langPath : RichTextUitl.prefix + "ueditor4thirdparty/lang/",
		serverUrl : "",
		viewerCssurl : RichTextUitl.prefix + "ueditor4thirdparty/third-party/viewer/viewer.min.css",
		iframeCssUrl : RichTextUitl.prefix + "ueditor4thirdparty/themes/iframe.css",
		topOffset : 0,
		increaseCssurl: customCssurl,
		fileFieldName: 'uploadFile',
		imageFieldName: 'uploadFile'
	}).ready(function(){
		// 设置内容
        RichTextUitl.ueditor = this;
		if (rtf_content) {
			var note_domain = "https://noteyd.chaoxing.com";
		    rtf_content.replace(/<iframe [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
				//capture,返回每个匹配的字符串
				// var newStr = note_domain + "/attachment/" + capture;
				// rtf_content = rtf_content.replace('"'+capture+'"', newStr);
			});
			RichTextUitl.ueditor.setContent(rtf_content);
		}
        var imgList= RichTextUitl.ueditor.body.querySelectorAll('img');
        RichTextUitl.ueditor.focus(true);
        //setTimeout(function(){$('html').scrollTop($('html').height())}, 200);
        
        var iframe = window.frames["ueditor_0"];
	    var doc = iframe.contentDocument || iframe.document;
	    if(doc) {
	    	// 在 ueditor.all.js 里面有用到，用于上传图片后更新对应的查看图片插件中的视图
	    	RichTextUitl.imageViewer = new Viewer(doc.body,{tooltip: true,container:document.body,navbar:false,toolbar:false,});
	    	$(doc.body).on('click','.editor-image img',function(){
	            var index = $(doc.body).find('.editor-image img').index(this);
	            RichTextUitl.imageViewer.index = index;
	            RichTextUitl.imageViewer.show();
	            unactiveViewBtn();
	            $('.viewBtnWrap').fadeIn();
        	})
	    }

	})
}

/**
 * 编辑页加载相关配置
 */
RichTextUitl.loadEditorProfile1 = function(userDefaultMediaPulgin, intranetMode, customUploadDataAnalysis) {
	RichTextUitl.intranetMode = intranetMode;
	if (intranetMode) {
		// RichTextUitl.prefix = '';
	} else {
		/**
		 * 获取上传文件需要的参数
		 */
		$.ajax({
			url : "https://noteyd.chaoxing.com/pc/files/getUploadConfig",
			type : "get",
			xhrFields: {
	            withCredentials: true
	        },
			data : {},
			dataType : "json",
			success : function(resultData) {
				if (resultData && resultData.result == 1) {
					RichTextUitl.puid = resultData.msg.puid;
					RichTextUitl.token = resultData.msg.token;
				}
			},
			error : function() {
			}
		});
	}
	if (customUploadDataAnalysis) {
		RichTextUitl.customUploadDataAnalysis = customUploadDataAnalysis;
	}

	// 加载 ueditor 配置js
	RichTextUitl.loadJSFile(RichTextUitl.prefix + 'ueditor4thirdparty/ueditor.config.js?_t=' + RichTextUitl.t);
	// 加载 ueditor 编辑功能相关js
	RichTextUitl.loadJSFile(RichTextUitl.prefix + 'ueditor4thirdparty/ueditor.all.js?_t=' + RichTextUitl.t);
	// 加载上传插件相关js和css
	RichTextUitl.loadJSFile(RichTextUitl.prefix + 'ueditor4thirdparty/dialogs/onlineattach/js/radialIndicator.min.js?_t=' + RichTextUitl.t);
	RichTextUitl.loadJSFile(RichTextUitl.prefix + 'ueditor4thirdparty/third-party/webuploader/webuploader.min.js?_t=' + RichTextUitl.t)
	RichTextUitl.loadCssFile(RichTextUitl.prefix + 'ueditor4thirdparty/third-party/webuploader/webuploader.css?_t=' + RichTextUitl.t);
	// 加载编辑器相关样式
	//RichTextUitl.loadCssFile("https://noteyd.chaoxing.com/res/css/pc/note/note_richtext.css");
	// 查看图片相关插件
	loadImgViewer();

	RichTextUitl.hasLoadViewer = true;
	if (!RichTextUitl.hasLoadAttachmentListener) {
		RichTextUitl.loadJSFile('ueditor4thirdparty/attachment_listener.js?_t=' + RichTextUitl.t);
		RichTextUitl.hasLoadAttachmentListener = true;
	}
	
	RichTextUitl.loadCssFile(RichTextUitl.prefix + 'ueditor4thirdparty/themes/thirdparty.richtext.css?_t=' + RichTextUitl.t);

	// 加载音视频播放插件
	if (userDefaultMediaPulgin) {
		loadMediaPlugin();
	}
}

/**
 * 加载详情页样式
 * @param userDefaultMediaPulgin：是否使用默认的音视频播放器，true/false
 * @param 已废弃 loadAttachmentListener：是否加载附件点击相关的监听js，调用了上面的loadEditorProfile 则不用加,
 * @param isScreen：是否是投屏页，投屏页有单独的样式，音视频的播放也是采用投屏页的方法
 */
RichTextUitl.loadDetailPageProfile = function(userDefaultMediaPulgin, loadAttachmentListener, isScreen, intranetMode) {

	if (intranetMode) {
		// RichTextUitl.prefix = '';
	}

	// 查看图片相关插件
	if (!RichTextUitl.hasLoadViewer) {
		loadImgViewer();
	}
	
	// 加载富文本中需要用到的样式
	RichTextUitl.loadCssFile('ueditor4thirdparty/themes/richtext_detail.css?_t=' + RichTextUitl.t);
	if (isScreen) {
		// 投屏页，加载投屏页的样式
		RichTextUitl.isScreen = true;
		RichTextUitl.loadCssFile('ueditor4thirdparty/themes/special_richtext.css?_t=' + RichTextUitl.t);
	} else {
		RichTextUitl.loadCssFile('ueditor4thirdparty/themes/thirdparty.richtext.css?_t=' + RichTextUitl.t);
	}
	// 附件点击相关
	if (!RichTextUitl.hasLoadAttachmentListener) {
		RichTextUitl.loadJSFile('ueditor4thirdparty/attachment_listener.js?_t=' + RichTextUitl.t);
		RichTextUitl.hasLoadAttachmentListener = true;
	}
	
	// 加载音视频播放插件
	if (userDefaultMediaPulgin) {
		loadMediaPlugin();
	}
	
}

RichTextUitl.loadJSFile = function(url) {
	if (!url) {
		return;
	}
	if (!url.startsWith("http") && url.indexOf(RichTextUitl.prefix) == -1) {
		url = RichTextUitl.prefix + url;
	}
	document.write('<script src="'+ url +'" type="text/javascript" charset="utf-8"></script>')
}

RichTextUitl.loadCssFile = function(url) {
	if (!url) {
		return;
	}
	if (!url.startsWith("http") && url.indexOf(RichTextUitl.prefix) == -1) {
		url = RichTextUitl.prefix + url;
	}
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = url
	document.getElementsByTagName("head")[0].appendChild(link);
}


/**
 * 显示提示的方法
 */
RichTextUitl.showTips = function(msg) {
	if($(".tips")) {
		$(".tips").show().html(msg);
		setTimeout(function(){$(".tips").hide()},3000);
	} else {
		alert(msg);
	}
}
/**
 * 参数：显示错误提示的方法, function(msg){}，不传采用alert
 * 
 * 返回json串
 * content : 普通文本内容
 * content_imgs : 图片
 * attachment : 附件
 * rtf_content : 富文本内容
 */
RichTextUitl.getRichText = function(showTipsFunction) {
	var return_data = {};
	var content = RichTextUitl.ueditor.getPlainTxt(); // 获取带格式的文本内容（去掉了文本标签，转义了换行和空格）、图片标签、iframe标签
	var rtf_content = RichTextUitl.ueditor.getContent(); // 获取内容，包含所有标签
	var content_imgs;
	
	var iframe = window.frames["ueditor_0"];
	var doc = iframe.contentDocument || iframe.document;
	if(doc) {
		attachments = doc.getElementsByTagName('iframe');
    	$noteImgs = doc.getElementsByTagName("img");
    	if(doc.getElementsByClassName("imgprogress").length > 0 || doc.getElementsByClassName("attachprogress").length > 0) {
    		// 有未上传完的图片
    		if(showTipsFunction) {
    			showTipsFunction('有正在上传的内容!');
    		} else {
    			RichTextUitl.showTips('有正在上传的内容!');
    		}
    		return;
    	}
	}
	
    // 处理图片
	if($noteImgs.length>0){
		for(var i=0; i<$noteImgs.length; i++) {
			var imgSrc = $.trim($noteImgs[i].getAttribute("src"));
			if(imgSrc.indexOf('/images/spacer.gif') > 0) {
				// 有未上传完的图片
	    		if(showTipsFunction) {
	    			showTipsFunction('有正在上传的内容!');
	    		} else {
	    			RichTextUitl.showTips('有正在上传的内容!');
	    		}
	    		return
			}
		}
		// 匹配 img 标签的正则表达
		var imgReg = /<img.*?(?:>|\/>)/gi;
		// 匹配 img 标签 src 属性的正则表达
		var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
		// 匹配 img 标签 objectid 属性的正则表达
		var objectidReg = /objectid=[\'\"]?([^\'\"]*)[\'\"]?/i;
	    // 包含所有img标签的数组
		var imgArr = content.match(imgReg); 
		
		var isNoteDomain = window.location.host.indexOf('noteyd.chaoxing.com') > -1 || window.location.host.indexOf('note.yd.chaoxing.com') > -1;
		if(isNoteDomain) {
			// 笔记服务特殊处理
			content_imgs = {};
			for (var i = 0; i < imgArr.length; i++) {
				 //获取图片地址
				 var imgSrc = imgArr[i].match(srcReg);
				 // 获取objectid
				 var objectId = imgArr[i].match(objectidReg);
				 if(objectId && imgSrc){
					 content_imgs[objectId] = imgSrc[1];
					 content = content.replace(imgArr[i],"（№♂◎┟ξψ┽"+objectId[1]+"）");
				 } else {
					 content = content.replace(imgArr[i],"");
				 }
			}
		} else {
			content_imgs = "";
			for (var i = 0; i < imgArr.length; i++) {
				 //获取图片地址
				 var imgSrc = imgArr[i].match(srcReg);
				 if(imgSrc){
					 content_imgs += imgSrc[1]+";";
				 }
				 content = content.replace(imgArr[i],"");
			}
		}
	}
	// 处理附件
	var attachmentStr = "";
	if(attachments.length > 0 ) {
		var attachmentArray = new Array();
		for(i=0; i<attachments.length; i++) {
			// 获取附件内容
			var att = attachments[i].getAttribute('name');
			try{
				att = decodeURIComponent(atob(att));
		    }catch(e){
		        
		    }
			try{
				var att_json = JSON.parse(att);
				if(att_json && att_json.attachmentType == 18) {
					// 云盘内容在iframe上存储时需要将 infoJsonStr 和 parentPath 转成json（客户端目前这样做的），在最终保存附件时需要把 infoJsonStr 和 parentPath 转回成string（客户端要求）
					att_json.att_clouddisk.infoJsonStr = JSON.stringify(att_json.att_clouddisk.infoJsonStr);
					att_json.att_clouddisk.parentPath = JSON.stringify(att_json.att_clouddisk.parentPath);
					att = JSON.stringify(att_json);
				}
				if(att) {
					attachmentArray.push(att);
				}
	        }catch(e){
	            console.log(e);
	        }
			
//			var att_text = attachments[i].outerHTML;
//			// 替换掉文本内容里面的附件
//			content = content.replace(att_text.replace("</iframe>",""),"");
		}
		// 替换掉文本内容里面的附件
		content = content.replace(/<iframe.*?>/gi, '');
		if(attachmentArray.length > 0) {
			attachmentStr = "[" + attachmentArray.join() + "]";
		}
	}
	//PC编辑器之间复制附件会带上当前页面的路径，需要去掉
	if(rtf_content) {
		var iframeReg = /<iframe.*?(?:<\/iframe>)/gi; //匹配iframe标签
	    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配iframe中的src
	    var arr = rtf_content.match(iframeReg);  //筛选出所有的iframe
	    var srcArr = [];
	    if(arr) {
	    	for (var i = 0; i < arr.length; i++) {
	    		var src = arr[i].match(srcReg)
	    		// 获取iframe src
	    		if(src) {
	    			//srcArr.push(src[1]);
	    			iframe_src = src[1];
	    			if(iframe_src && iframe_src.indexOf("insert") > 0) {
	    				// 包含insert且不是以insert开头的才需要替换
	    				rtf_content = rtf_content.replace(iframe_src, iframe_src.substring(iframe_src.indexOf("insert"), iframe_src.length));   
	    			}
	    		}
	    	}
	    }
	}
	
	return_data.content = restoresEscapedCharacter(content);
	if(isNoteDomain) {
		// 笔记服务的content_imgs 为json 结构
		return_data.content_imgs = JSON.stringify(content_imgs);
	} else {
		return_data.content_imgs = content_imgs;
	}
	return_data.attachment = attachmentStr.replace(/&apos;/g,"'");// 附件中的内容包含单引号时进行了转换，保存时替换回来;
	return_data.rtf_content = rtf_content.replace(/&apos;/g,"'"); // 附件中的内容包含单引号时进行了转换，保存时替换回来;
	
	return return_data;
}

//标记富文本内容中的链接
RichTextUitl.addLink = function(html){
	if(!html) {
		return html;
	}
	var iframeReg = new RegExp('<\\s*iframe([\\s\\S]*?)>\\s*<\/iframe>','gi');
	html=html.replace(iframeReg,function(){
		return '<iframe'+arguments[1].replace(/</gi,'&lt;').replace(/>/gi,'&gt;')+'></iframe>';
	})
	//匹配出所有标签内的文本内容
	var innertextReg=new RegExp('>(>[^<>]*)*[^<]+(<[^<>]*)*<','gi');
	html='>'+html+'<';
	html=html.replace(innertextReg,function(){
		var str=arguments[0];
		str=str.substr(1,str.length-2);
		return '>'+matchURL(str)+'<';
	})
	return html.substr(1,html.length-2);
}
function matchURL(str){
	//标签内的文本内容判断是url的加<a>标签
	str=str.replace(RichTextUitl.Regex4LinkText,function(){
		var url=arguments[0].replace(/&nbsp;/g," ").trim();
		if(url.indexOf('http')!=0 && url.indexOf('ftp')!=0){
			url='http://'+url;
		}
		return '<a href="'+url+'" class="dynacALink">'+arguments[0]+'</a>';
	})
	return str;
}

/**
 * 裁剪图片
 * 预览图：不超过编辑区域宽度的图片，按原图大小显示，超过的取编辑区域最大宽度。清晰度取Q50。
 * 大图：清晰度取Q80。
 * @returns 处理后的富文本内容
 */
RichTextUitl.cropImage = function(rtf_content){
	if(!rtf_content) {
		return "";
	}
	var imgMap = new Map();
	var imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
	var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
	var arr = rtf_content.match(imgReg)  //筛选出所有的img
    var srcArr = []
	if(!arr || arr.length == 0) {
		return rtf_content;
	}
	if (!RichTextUitl.thumbnail2BigImgMap) {
		RichTextUitl.thumbnail2BigImgMap = new Map();
	}
    for (var i = 0; i < arr.length; i++) {
    	var src = arr[i].match(srcReg)
        // 获取图片地址
        //srcArr.push(src[1]);
    	if (src) {
    		var rtf_img = src[1];
    		var rw = parseInt(getImgurlParam(rtf_img.replace(/&amp;/g,'&'), 'rw')||'');
    		var rh = parseInt(getImgurlParam(rtf_img.replace(/&amp;/g,'&'), 'rh')||'');
    		var new_rw = rw;
    		var new_rh = rh;
    		if(rtf_img.indexOf("chaoxing.com")> -1 && rw && rh) {
    			var maxImgWidth = 720;
    			if(rw > maxImgWidth) {
    				// 宽度大于720，按比例缩小
    				new_rw = maxImgWidth;
    				new_rh = parseInt(maxImgWidth/rw * rh);
    			}
    			var res_str = "";
    			if(rtf_img.indexOf("origin") == -1) {
    				res_str = '([0-9]+_[0-9]*[A-z]*[0-9]*)';
    			} else {
    				res_str = 'origin';
    			}
    			var origin_reg = new RegExp(res_str);
    			var small_img = rtf_img.replace(origin_reg,  new_rw + '_' + new_rh + 'Q50');
    			// png格式换成jpg
    			if (small_img.indexOf('.png') > -1) {
    				small_img = small_img.replace('.png', '.jpg')
    			}
    			// 大图改为用原图
    			var big_img = rtf_img;
//    			var big_img = rtf_img.replace(origin_reg,  rw + '_' + rh + 'Q80');
    			rtf_content = rtf_content.replace(new RegExp(rtf_img.substr(0,rtf_img.indexOf('?')),'g'), small_img.substr(0,small_img.indexOf('?')));
    			
    			RichTextUitl.thumbnail2BigImgMap.put(small_img.replace(/&amp;/g,'&'), big_img);
    		} else {
    			RichTextUitl.thumbnail2BigImgMap.put(rtf_img, rtf_img);
    		}
    		var imgObj = {"imageUrl": rtf_img};
    		RichTextUitl.imgArray.push(imgObj);
    	}
    }
	
	return rtf_content;
}

/**
 * 获取图片参数
 */
function getImgurlParam(url,name){
	if (url.indexOf("?") != -1) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r =url.split("?")[1].match(reg); 
        if (r != null) return unescape(r[2]); 
        return null; 
	}else{
		return null;
	}
}

/**
 * 将富文本内容设置到页面之前执行的操作
 * 1、给附件的src添加笔记域名
 * 2、对图片进行裁剪
 * 3、标记富文本内容中的链接
 * 
 * @param rtf_content：富文本内容
 */
RichTextUitl.beforeSetRtfContent = function(rtf_content) {
	if(!rtf_content) {
		return;
	}
	var note_domain = "";
    rtf_content.replace(/<iframe [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
		//capture,返回每个匹配的字符串
    	var newStr = 'ueditor4thirdparty/attachment/' + capture;
		rtf_content = rtf_content.replace('"'+capture+'"', newStr);
	});
	return RichTextUitl.addLink(RichTextUitl.cropImage(rtf_content));
}

/**
 *  填充页面后执行的操作
 *  1、图片在加载的过程中先采用灰色背景框的占位符显示，加载完成后再显示对应的图片
 *  2、初始化查看图片插件
 *  3、解决转发到笔记的附件上面显示三个空行的问题
 *  
 *  @param selector：包含图片标签的dom节点
 *  @param userDefaultMediaPulgin：是否使用默认的音视频播放器，true/false
 */
RichTextUitl.afterPageRendered = function(selector) {
	if (selector) {
		// 加载图片
		imgList = $(selector).find('img');
		if (imgList) {
			imgList.each(function(){
				// 遍历图片标签，给图片添加data_original属性，内容为原图大小Q80图片
				var src = $(this).attr('src');
				$(this).attr('data-original', RichTextUitl.thumbnail2BigImgMap.get(src));
			});
			RichTextUitl.loadImg(imgList);
		}
		
		// 学习通里面打开的课程页，不用Viewer插件，通过客户端协议查看图片，其他情况通过插件查看
		if(!isInXXT()) {
			setTimeout(function(){
				RichTextUitl.imageViewer = new Viewer(selector,{tooltip: true,container:document.body,navbar:false,toolbar:false,url:"data-original"});
		    	$(document.body).on('click','.editor-image img',function(){
		            var index = $(document.body).find('.editor-image img').index(this);
		            RichTextUitl.imageViewer.index = index;
		            RichTextUitl.imageViewer.show();
		            unactiveViewBtn();
		            $('.viewBtnWrap').fadeIn();
	        	})
				
			}, 500)
		}
	}
	
}


/**
 * 获取 UUID
 */
RichTextUitl.randomUUID = function() {
	var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
 
    var uuid = s.join("");
    return uuid;
}

/**
 * 加载图片方法，加载过程中用灰色背景框代替
 * @param img标签对象数组
 */
RichTextUitl.loadImg = function(imgList){
	if(!imgList || imgList.length == 0) {
		return;
	}
	for(var i=0;i<imgList.length;i++){
		var addr = imgList[i].getAttribute("src");
		addr = addr.replace(/&amp;/g,'&');
		var winWidth = 720;//最大宽度
		var imgW1 = getImgurlParam(addr,'rw');
		var imgH1 = getImgurlParam(addr,'rh');
		if (imgW1 && imgH1) {
			imgList[i].style.backgroundColor="#e7e8e7";
			var imgW2 = imgW1>winWidth?winWidth:imgW1;
			var imgH2 = parseInt(imgW2 * imgH1 / imgW1);
			if (!isInXXT()) {
				imgList[i].style.width = imgW2+'px';
				imgList[i].style.height = imgH2+'px';
			}
			imgList[i].onload=function(){
		        this.style.opacity=1;
		        this.style.backgroundColor="";
		    }
		}
		else{
			if (!isInXXT()) {
				imgList[i].style.width = 'auto';
				imgList[i].style.height = "auto";
				imgList[i].style.minHeight = "200px";
			}
			imgList[i].style.backgroundColor="#e7e8e7";
			imgList[i].onload=function(){
				this.style.opacity=1;
				this.style.minHeight = "unset";
		        this.style.backgroundColor="";
		    }
		}
	}
	
	setTimeout(function(){
		RichTextUitl.limpidImg();
	},100)
	
	// 如果是课程域名，且是在客户端打开的，通过协议查看图片
	if (isInXXT()) {
		$('body').on('click', '.editor-image img', function() {
			var index = $("body .editor-image img").index(this);
			clientPreviewImages(RichTextUitl.imgArray, index);
		})
	}
}

//图片变清晰
RichTextUitl.limpidImg = function(){
	// 笔记
	var imgList = $('body .editor-image img');
	var imgsize_reg = new RegExp('([0-9]+_[0-9]*[A-z]*[0-9]*)');
	for(var i=0;i<imgList.length;i++){
		var src = imgList[i].src;
		if (src.indexOf('p.ananas.chaoxing.com') == -1) {
			continue;
		}
		var imgW1 = getImgurlParam(src,'rw');//原始图片宽度
		var imgH1 = getImgurlParam(src,'rh');//原始图片高度
		if (imgW1 && imgH1) {
			var img = new Image();
			img.setAttribute('index',i);
			src = src.replace(imgsize_reg,  imgW1 + '_' + imgH1 + 'Q50').replace('.jpg', '.png')
			
			img.src = src;
			img.onload = function(){
				index = this.getAttribute('index');
				imgList[index].src = this.src;
//				imgList[index].classList.remove('thumbnails');
				img.remove
			}
		}
	}
}

/**
 * 还原被转义的字符 < > & " '
 */
function restoresEscapedCharacter(content){
	if(content) {
		return content.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
	}
	return "";
}

/**
 *  加载音视频播放插件
 * @returns
 */
function loadMediaPlugin(){
	// RichTextUitl.loadCssFile("https://noteyd.chaoxing.com/res/pc/cssnew/media.css");
	// RichTextUitl.loadCssFile("https://noteyd.chaoxing.com/res/plugin/smusic/css/smusic.css");
	// RichTextUitl.loadCssFile("https://noteyd.chaoxing.com/res/pc/css/easydialog.css");
	// RichTextUitl.loadJSFile("https://noteyd.chaoxing.com/res/plugin/smusic/js/smusic.js");
	// RichTextUitl.loadJSFile('https://noteyd.chaoxing.com/res/plugin/ckplayer/ckplayer.js')
	// RichTextUitl.loadJSFile('https://noteyd.chaoxing.com/res/pc/js/media.js"');
	// RichTextUitl.loadJSFile('https://noteyd.chaoxing.com/res/js/common/easydialog.min.js');
	// 本地Load
	RichTextUitl.loadCssFile("ueditor4thirdparty/medisPlugins/media.css");
	RichTextUitl.loadCssFile("ueditor4thirdparty/medisPlugins/smusic.css");
	RichTextUitl.loadCssFile("ueditor4thirdparty/medisPlugins/easydialog.css");
	RichTextUitl.loadJSFile("ueditor4thirdparty/medisPlugins/smusic.js");
	RichTextUitl.loadJSFile('ueditor4thirdparty/medisPlugins/ckplayer.js')
	RichTextUitl.loadJSFile('ueditor4thirdparty/medisPlugins/media.js"');
	RichTextUitl.loadJSFile('ueditor4thirdparty/medisPlugins/easydialog.min.js');
	var pluginHtml = 
//	视频播放器
	 '<div id="videoDiv" style="display:none;">'
	+	'<span class="videoCloseBtn"></span>'
	+	'<div id="video"></div>'
	+'</div>'
//	音频播放容器
	+'<div id="audioDiv" style="display:none;">'
	+	'<div class="headBar"><span class="audioCloseBtn"></span></div>'
	+	'<div class="grid-music-container f-usn">'
	+	    '<div class="m-music-play-wrap">'
	+	        '<div class="u-cover"></div>'
	+	        '<div class="m-now-info">'
	+	            '<h1 class="u-music-title"><strong></strong></h1>'
	+	            '<div class="m-now-controls">'
	+	              '<div class="startTime">00:00&nbsp;&nbsp;</div>'
	+	                '<div class="u-control u-process ">'
	+	                    '<div class="old-bar"></div>'
	+	                    '<span class="buffer-process"></span>'
	+	                    '<span class="current-bar"  ></span>'
	+	                    '<span class="current-process"></span>'
	+	                '</div>'
	+	                '<div class="u-control u-time">00:00</div>'
	+	                '<div class="u-control u-volume new-volume">'
	+	                        '<div class="volume">'
	+	                                '<span class="volume-event">'
	+	                                    '<div class="volume-process" data-volume="0.50"></div> '
	+	                                    '<span class="volume-current"></span>'
	+	                                    '<span class="volume-bar"></span>'
	+	                                '</span>'
	+	                            '<a class="volume-control"></a>'
	+	                         '</div>'
	+	                     '</div>'
	+	            '<div class="m-play-controls">'
	+	                '<div class="musicOrder">'
	+	                    '<a  class="u-play-btn mode mode-list  " title="列表循环"></a>  '
	+	                    '<!-- <a class="u-play-btn mode mode-random  " title="随机播放"></a>'
	+	                    '<a class="u-play-btn mode mode-single " title="单曲循环"></a>  -->'
	+	                '</div>'
	+	                '<a class="u-play-btn prev" title="上一曲"></a>'
	+	                '<a class="u-play-btn ctrl-play play" title="暂停"></a>'
	+	                '<a class="u-play-btn next" title="下一曲"></a>'
	+	            '</div>'
	+	        '</div>'
	+	    	'</div>'
	+	    	'<div class="f-cb">&nbsp;</div>'
	+	    	'<div class="m-music-list-wrap"></div>'
	+	   		'<div class="m-music-lyric-wrap">'
	+	        '<div class="inner">'
	+	             '<ul class="js-music-lyric-content">'
	+	                '<li class="eof">暂无歌词...</li>'
	+	            '</ul>'
	+	        '</div>'
	+	    	'</div>'
	+		'</div>'
	+	'</div>'
	+'</div>';
	
	$('body').append(pluginHtml);
}

function loadImgViewer() {
	RichTextUitl.loadCssFile(RichTextUitl.prefix + 'ueditor4thirdparty/third-party/viewer/viewer.min.css');
	RichTextUitl.loadJSFile(RichTextUitl.prefix + 'ueditor4thirdparty/third-party/viewer/viewer-jquery.min.js?_t=' + RichTextUitl.t);
	RichTextUitl.loadJSFile(RichTextUitl.prefix + 'ueditor4thirdparty/third-party/viewer/custom.js?_t=' + RichTextUitl.t);
	RichTextUitl.loadJSFile(RichTextUitl.prefix + 'ueditor4thirdparty/third-party/viewer/viewer.js?_t=' + RichTextUitl.t);
	RichTextUitl.loadCssFile(RichTextUitl.prefix + 'ueditor4thirdparty/third-party/viewer/view-button.css');
	var viewerHtml = '<div class="viewBtnWrap">'
					+    '<div id="viewPrev"></div>'
					+    '<div id="viewNext"></div>'
					+    '<div class="viewBtn" id="viewZoomIn"></div>'
					+    '<div class="viewBtn" id="viewZoomOut"></div>'
					+    '<div class="viewBtn" id="viewFlip"></div>'
					+    '<div class="viewBtn" id="viewDownload"></div>'
					+    '<div class="viewSplit"></div>'
					+    '<div class="viewBtn" id="viewClose"></div>'
					+    '<a href="" id="view_download_btn" download="图片名字"></a>'
					+'</div>';
	$('body').append(viewerHtml);
}
/**
 * 通过客户端协议查看图片
 * @param img_urlArray
 * @param index
 * @returns
 */
function clientPreviewImages(img_urlArray,index) {
	jsBridge.postNotification('CLIENT_PREVIEW_IMAGES',{
		imageUrls:img_urlArray,
		showIndex:index
	});
};

/**
 * 判断是否是课程域名，且是在学习通里面打开的
 * @returns
 */
function isInXXT() {
	var ua = navigator.userAgent.toLowerCase();
	return ua && ua.indexOf("chaoxingstudy")!=-1 && ua.indexOf('chaoxingstudypc') == -1
}

/*
 * MAP对象，实现MAP功能
 *
 * 接口：
 * size()     获取MAP元素个数
 * isEmpty()    判断MAP是否为空
 * clear()     删除MAP所有元素
 * put(key, value)   向MAP中增加元素（key, value) 
 * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
 * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
 * element(index)   获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
 * containsKey(key)  判断MAP中是否含有指定KEY的元素
 * containsValue(value) 判断MAP中是否含有指定VALUE的元素
 * values()    获取MAP中所有VALUE的数组（ARRAY）
 * keys()     获取MAP中所有KEY的数组（ARRAY）
 *
 * 例子：
 * var map = new Map();
 *
 * map.put("key", "value");
 * var val = map.get("key")
 * ……
 *
 */
function Map() {
    this.elements = new Array();

    //获取MAP元素个数
    this.size = function() {
        return this.elements.length;
    };

    //判断MAP是否为空
    this.isEmpty = function() {
        return (this.elements.length < 1);
    };

    //删除MAP所有元素
    this.clear = function() {
        this.elements = new Array();
    };

    //向MAP中增加元素（key, value) 
    this.put = function(_key, _value) {
    	this.removeByKey(_key);
        this.elements.push( {
            key : _key,
            value : _value
        });
    };

    //删除指定KEY的元素，成功返回True，失败返回False
    this.removeByKey = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    
    //删除指定VALUE的元素，成功返回True，失败返回False
    this.removeByValue = function(_value) {//removeByValueAndKey
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    
    //删除指定VALUE的元素，成功返回True，失败返回False
    this.removeByValueAndKey = function(_key,_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value && this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };

    //获取指定KEY的元素值VALUE，失败返回NULL
    this.get = function(_key) {
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch (e) {
            return false;
        }
        return false;
    };

    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
    this.element = function(_index) {
        if (_index < 0 || _index >= this.elements.length) {
            return null;
        }
        return this.elements[_index];
    };

    //判断MAP中是否含有指定KEY的元素
    this.containsKey = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };

    //判断MAP中是否含有指定VALUE的元素
    this.containsValue = function(_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    
    //判断MAP中是否含有指定VALUE的元素
    this.containsObj = function(_key,_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value && this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };

    //获取MAP中所有VALUE的数组（ARRAY）
    this.values = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    };
    
    //获取MAP中所有VALUE的数组（ARRAY）
    this.valuesByKey = function(_key) {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            if (this.elements[i].key == _key) {
                arr.push(this.elements[i].value);
            }
        }
        return arr;
    };

    //获取MAP中所有KEY的数组（ARRAY）
    this.keys = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    };
    
    //获取key通过value
    this.keysByValue = function(_value) {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            if(_value == this.elements[i].value){
                arr.push(this.elements[i].key);
            }
        }
        return arr;
    };
    
    //获取MAP中所有KEY的数组（ARRAY）
    this.keysRemoveDuplicate = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            var flag = true;
            for(var j=0;j<arr.length;j++){
                if(arr[j] == this.elements[i].key){
                    flag = false;
                    break;
                } 
            }
            if(flag){
                arr.push(this.elements[i].key);
            }
        }
        return arr;
    };
}