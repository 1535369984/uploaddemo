/**
 * 富文本附件监测器，监听高度变化，音视频播放事件
 */
var AttachmentListener = {
		mediaDefaultErrorMsg : "暂时无法播放，请稍后再试。。。",//云存储多媒体默认错误提示信息
		mediaPlay:function(){}, // 播放音视频文件的方法
		loadedMediaMap : new Map(), // 已经加载了的音视频文件
		b64DecodeUnicode : function(){}, // base64解码
}

AttachmentListener.b64DecodeUnicode = function(str){
	 try{
		 str = decodeURIComponent(atob(str));
    }catch(e){
       
    }
    return str;
}

window.addEventListener('message', function (e) {
	var data = e.data;
    if (!data) {
        return;
    }
    if(data.msgType == 'playMedia') {
    	// 播放音视频
    	
    	AttachmentListener.mediaPlay(data.mediaType, data.media);
    } else if(data.msgType == 'dataChanged') {
    	// iframe数据有变化，在父页面查询后返回给子页面
    	var iframe = window.frames["ueditor_0"];
    	var doc = iframe.contentDocument || iframe.document;
    	var targetIframe = $(doc).find('iframe[cid="'+ data.cid +'"]')[0];
    	var name = targetIframe.name;
    	targetIframe.contentWindow.postMessage({'msgType':'dataChanged','cid':data.cid, 'name':name}, "*");
    } else if(data.msgType == 'dataChanged2') {
    	// 子页面让父页面数据变化
    	var iframe = window.frames["ueditor_0"];
    	if(iframe){
    		var doc = iframe.contentDocument || iframe.document;
        	var targetIframe = $(doc).find('iframe[cid="'+ data.cid +'"]');
    		if(data.newData && targetIframe.length>0){
    			var str = JSON.stringify(data.newData);
    			targetIframe.attr("name",RichTextUitl.b64EncodeUnicode(str));
    		}
    	}
    } else if(data.msgType == 'heightChanged'){
    	// 部分附件高度不固定，需要根据实际的内容来修改高度，例如笔记附件
    	if (e.data.height > 0) {
    		var iframe = window.frames["ueditor_0"];
    		if (iframe) {
    			// 编辑页
    			var doc = iframe.contentDocument || iframe.document;
            	var targetIframe = $(doc).find('iframe[cid="'+ data.cid +'"]');
    		} else {
    			var targetIframe = $('body').find('iframe[cid='+data.cid+']')
    		}
    		if(targetIframe) {
    			targetIframe.css('height', e.data.height);
    		}
    	}
    } else if (data.msgType == 'getUEditor') {
    	var iframeId = document.getElementsByClassName(data.className)[0].getAttribute('id');
    	var dialog = window.$EDITORUI[iframeId];
    	var att_editor = dialog.editor;
    	var targetIframe = $(document).find('iframe[id="'+ iframeId +'_iframe"]')[0];
    	var new_editor = {
    			options : {
    				themePath : att_editor.options.themePath,
    				theme : att_editor.options.theme,
    				langPath : att_editor.options.langPath,
    				lang : att_editor.options.lang
    			},
    			lang : att_editor.getLang(dialog.className.split( "-" )[2]),
    	};
    	
    	targetIframe.contentWindow.postMessage({'msgType':'ueditor','editor':new_editor}, "*");
    } else if (data.msgType == 'execCommand') {
    	var iframeId = document.getElementsByClassName(data.className)[0].getAttribute('id');
    	// 获取 dialog 对象
    	var dialog = window.$EDITORUI[iframeId];
    	var targetIframe = $(document).find('iframe[id="'+ iframeId +'_iframe"]')[0];
    	if (data.type == 'dialog') {
    		if (data.command == 'onok') {
        		dialog.onok = function () {
        			targetIframe.contentWindow.postMessage({'msgType':'dialogOnok'}, "*");
        			return false;
        	    };
        	} else if (data.command == 'close') {
        		dialog.close();
        	}
    	} else if (data.type == 'editor') {
    		var att_editor = dialog.editor;
    		att_editor.execCommand(data.command, data.data);
    		dialog.close();
    	}
    } else if(data.msgType == 'pauseVideo') {
    	// 事件为暂停音频播放
        var iframes = document.getElementsByTagName('iframe')
        for(i=0; i<iframes.length; i++) {
        	var src = iframes[i].getAttribute('src');
        	if(src && (src.indexOf("insertVoice") > -1 || src.indexOf("insertCloud") > -1)) {
        		// 处理音频附件和云盘附件（云盘文件可能是音频文件）,通知其他音频停止播放，cid：当前在播放的音频iframe 的 cid
        		iframes[i].contentWindow.postMessage({'cid': e.data.cid}, '*');
        	}
        }
    } else if(data.msgType == 'openCloudPop'){
    	//打开云盘弹窗
    	CLOUD_POP.openCloudPop(data.att_clouddisks);
    } else if(data.msgType == 'openBatchPop'){
    	//打开批量操作弹窗
    	CLOUD_POP.openBatchPop();
    } else if (data.msgType == 'CLIENT_OPEN_ATTACHMENT') {
    	// 通过客户端协议打开附件
    	try {
    		jsBridge.postNotification('CLIENT_OPEN_ATTACHMENT', data.data);
    	}
    	catch(e) {
    	}
    	return;
    }
    
})

/**
 * description ：播放富文本中的音视频
 * mediaType : 播放的资源类型（audio：音频； video：视频）
 * media : 对应的音视频文件
 */
AttachmentListener.mediaPlay = function(mediaType, media) {
	//异步获取附件文件地址
	var mediaErrorMsg = AttachmentListener.mediaDefaultErrorMsg;
	var url = '';
	if (RichTextUitl.intranetMode){
		url = media.playUrl || '';
	} else {
		if(!media.fileId) {
			return;
		}
		url = AttachmentListener.loadedMediaMap.get(media.fileId);
		if(!url && mediaType!="audio"){//非音频获取下载地址
			$.ajax({
				url:"https://noteyd.chaoxing.com/screen/note_note/files/status/"+(media.fileId||""),
				data:{isMedia:mediaType=="video"},
				type:"get",
				async:false,
				xhrFields: {
	                withCredentials: true
	            },
				success:function(backData){
					if(backData&&backData["status"]&&backData["status"]==true){
						url = backData["url"]||"";
						AttachmentListener.loadedMediaMap.put(media.fileId, url);
					}else{
						if(backData && backData["msg"] && (backData["msg"]||"") != ""){
							mediaErrorMsg = backData["msg"];
						}
					}
				},
				error : function(xhr ,textStatus ,errorThrown) {
					var status = xhr.status;
					var errorMsg = "";
					if(status == 0) {
						mediaErrorMsg = "网络错误，请稍后重试";
					} else if(status == 503){
						mediaErrorMsg = "请求超时，请稍后重试";
					} else {
						mediaErrorMsg = "操作失败(code:"+ status +")";
					}
				}
			});
			if(url==""){
				//alert(mediaErrorMsg);
				return false;
			}
		}
	}
	
	//在线预览或者下载附件文件
	if(mediaType=="video"){
		//视频
		if(videoPlayer&&videoPlayer.vars&&videoPlayer.vars.video&&videoPlayer.vars.video==encodeURIComponent(url)){//如果视频存在且已经加载了，直接播放即可
			videoPlayer.videoPlay();
		}else{
			var videoObject = {
				playerID:'ckplayer01',//播放器ID，第一个字符不能是数字，用来在使用多个播放器时监听到的函数将在所有参数最后添加一个参数用来获取播放器的内容
				container: '#video', //容器的ID或className
				//variable: 'player', //播放函数名称
				//loaded: 'loadedHandler', //当播放器加载后执行的函数
				//loop: true, //播放结束是否循环播放
				autoplay: true, //是否自动播放
				//duration: 500, //设置视频总时间
				config: '', //指定配置函数
				flashplayer: false, //强制使用flashplayer
				drag: 'start', //拖动的属性
				seek: 0, //默认跳转的时间
				video: url //视频地址
			};
			videoPlayer = new ckplayer(videoObject);
		}
		easyDialog.open({
		    container : 'videoDiv',
		    noFn : true,
		    drag:true
		});
	}else if(mediaType=="audio"){
		//音频
		if(musicPlayer){
			var exists = false;
			for(i in musicPlayer.musicList){
				if(musicPlayer.musicList[i]["resid"] == media.fileId){
					exists = true;
					break;
				}
			}
			if(!exists){
				var title = media.name;
				musicPlayer.addMusic({resid:media.fileId,title:title,src:url});
			}
			musicPlayer.play(media.fileId);
			$("#audioDiv").show();
		}else{
			var musicList = new Array();
			var defaultIdx = 0;
			if(media.infoJsonStr) {
				// 云盘里面的音频，单独处理一下处理一下
				musicList.push({resid:media.fileId,title:media.name,src:""});
			}
			
			var iframes;
			var ueditor_iframe = window.frames["ueditor_0"];
			if(ueditor_iframe) {
				// 编辑页
				var doc = ueditor_iframe.contentDocument || ueditor_iframe.document;
				if(doc) {
					iframes = doc.getElementsByTagName('iframe');
				}
			} else {
				// 详情页
			    iframes = document.getElementsByTagName('iframe');
			}
			// 遍历iframe，找到所有的音频附件，云盘中的音频暂不考虑
			if(iframes && iframes.length > 0) {
				var audio_index = 0;
            	for(i=0; i<iframes.length; i++) {
            		var src = iframes[i].getAttribute('src');
            		if(src && src.indexOf("insertVoice") > -1) {
            			try{
            		        json = JSON.parse(AttachmentListener.b64DecodeUnicode(iframes[i].getAttribute('name')));
            		    }catch(e){
            		        console.log(e);
            		        json = "";
            		    }
            		    if(json && json.att_voice) {
            		    	var name = "";
            		    	if(json.att_voice.titleEdited == 1){
                                name = json.att_voice.fileTitle || "";
                            }else{
                                name = "录音-" + timeformat(json.att_voice.voiceLength || 0);
                            }
            		    	musicList.push({resid:json.att_voice.objectId2, title: name, src:"", iframe_cid:json.cid});
            		    	if(media.fileId == json.att_voice.objectId2) {
            		    		// 获取点击的那个音频在列表中的位置，用于后面播放相应位置的音频
            		    		defaultIdx = audio_index;
            		    	}
            		    	audio_index++;
            		    }
            		}
            	}
            }
			musicPlayer = new SMusic({
		        musicList : musicList,
		        autoPlay  : true,  //是否自动播放
		        defaultIndex :defaultIdx,//默认为选中
		        defaultMode : 1,   //默认播放模式，列表模式
		        callback:function(thisPlayer,curMusic){
		        	var $musicListDiv = $(thisPlayer.musicDom.listWrap);
		        	var $scrollToContainer = $musicListDiv.find("[musicresid='"+curMusic["resid"]+"']");
		        	$musicListDiv.animate({
		            	scrollTop: $scrollToContainer.offset().top - $musicListDiv.offset().top + $musicListDiv.scrollTop()
		            }, 1000);//2秒滑动到指定位置
		        },
		        loadMusic:function(thisPlayer,curMusic){//歌曲不在时，开始加载
		        	var loaded = false;
		        	if($.trim(curMusic["resid"]||"")!=""){
			        	$.ajax({
							url:"https://noteyd.chaoxing.com/pc/files/status/"+(curMusic["resid"]||""),
							data:{isMedia:true},
							type:"get",
							async:false,
							xhrFields: {
				                withCredentials: true
				            },
							success:function(backData){
								if(backData&&backData["status"]&&backData["status"]==true&&(backData["url"]||"")!=""){
									var curMusicUrl = backData["url"]||"";
									curMusic["src"] = curMusicUrl;
									AttachmentListener.loadedMediaMap.put(media.fileId, curMusicUrl);
									loaded = true;
								}else{
									if(backData && backData["msg"] && (backData["msg"]||"") != ""){
										alert(backData["msg"]);
									}else{
										alert(AttachmentListener.mediaDefaultErrorMsg);
									}
								}
							},
							error:function(xhr){
								alert(AttachmentListener.mediaDefaultErrorMsg);
							}
						});
		        	}
		        	return loaded;
		        }
		    });
			$("#audioDiv").show().hqzDrag(".headBar");
		}
	}
}