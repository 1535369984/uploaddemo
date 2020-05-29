var Cloud = {
		fileIconList : [
		     {'value':'/views/images/filelogo/x_TXT.png',     'keys':' .txt, '},
		     {'value':'/views/images/filelogo/x_PDZ.png',     'keys':' .pdz, '},
		     {'value':'/views/images/filelogo/x_pdf.png',     'keys':' .pdf, '},
		     {'value':'/views/images/filelogo/x_epub.png',    'keys':' .epub, '},
		     {'value':'/views/images/filelogo/x_ppt.png',     'keys':' .ppt, .pptx, '},
		     {'value':'/views/images/filelogo/x_word.png',    'keys':' .doc, .docx, '},
		     {'value':'/views/images/filelogo/x_excel.png',   'keys':' .xls, .xlsx, .xlt, .xlsm, .xlsm, .xltm, .xlsb, '},
		     {'value':'/views/images/filelogo/x_pic.png',     'keys':' .bmp, .jpg, .jpeg, .png, .gif, .tiff, .psd, '},
		     {'value':'/views/images/filelogo/x_video.png',   'keys':' .avi, .rmvb, .rm, .asf, .divx, .mpg, .mpeg, .mpe, .wmv, .mp4, .mkv, .vob, .mov, .m4v, .flv, .3gp, '},
		     {'value':'/views/images/filelogo/x_audio.png',   'keys':' .cd, .ogg, .mp3, .asf, .wma, .wav, .mp3pro, .rm, .real, .ape, .module, .midi, .vqf, .aac, .aiff, .amr, .flac, .m4a, .midm, .mod, .ra, .rma, '},
		     {'value':'/views/images/filelogo/x_rar.png',     'keys':' .rar, .cab, .arj, .lzh, .ace, .7-zip, .tar, .gzip, .uue, .bz2, .jar, .iso, .z, .xz, .zip, '}
		],
		loadMore : false,
		videoSuffix : "mp4,3gp,avi,rmvb,asf,divx,mpg,mpeg,mpeg,mpe,mkv,vob,flv,m4v,mov,f4v,wmv",
		imageSuffix : "jpg,png,jpeg,psd,tiff,gif,bmp",
		note_domain : "",
		shareCloudFolder : function(){},
			
}
	
    window.onload = function () {
//        initButtons();
        loadCloudList();
        Common.attachmentType = 'cloud';
    };
    
    // 文件夹添加到附件之前需要先调用分享文件夹接口，调用接口获取图片和视频信息
    Cloud.shareCloudFolder = function(callback) {
    	if(Common.selectedAttachmentMap.size() == 0) {
        	return false;
        }
    	var att_fileArray = new Array();
    	var folderResidArray = new Array();
    	var residArray = new Array();
    	
        var selectedKeys = Common.selectedAttachmentMap.keys();
        /**
         * 获取选择的云盘文件，如果是文件夹，要调用云盘分享接口去分享，
         * 如果是图片和视频，要调用云盘接口去获取对应的数据信息
         */ 
    	for(var i = 0; i < selectedKeys.length; i++) {
    		var key = selectedKeys[i]
    		if(Common.dataMap.get(key).attachmentType == 38) {
	    		// 文件夹
	    		folderResidArray.push(key);
    		} else if(Common.dataMap.get(key).att_clouddisk) {
    			var suffix = Common.dataMap.get(key).att_clouddisk.suffix
    			if(Cloud.imageSuffix.indexOf(suffix) > -1 || Cloud.videoSuffix.indexOf(suffix) > -1) {
    				// 图片或者视频
    				residArray.push(key);
    			} 
    		}
    	}
    	if(folderResidArray.length > 0) {
    		var url = "https://noteyd.chaoxing.com/pc/resource/shareCloudFolder?resids=" + folderResidArray.join();
    		$.ajax({
        		url : url,
        		type : "get",
                xhrFields: {
                    withCredentials: true
                },
                dataType : "json",
                success : function(data) {
                	if(data && data.result == 1) {
            			for(var i=0; i<folderResidArray.length; i++) {
            				if(Common.dataMap.containsKey(folderResidArray[i])) {
            					Common.dataMap.get(folderResidArray[i]).att_cloudFolder.shareInfo = data.data;
            				}
            			}
            			// 处理完文件夹后处理图片
            			getFileDetail(residArray, callback);
            		} else {
            			alert(data.msg);
            		}
                }
    		});
	    } else if(residArray.length > 0) {
	    	getFileDetail(residArray, callback);
	    } else {
	    	callback();
//	    	dialog.close();
	    	Common.closeDialog();
	    }
    }
    
    // 根据图片或视频的resid获取对应的url
    function getFileDetail(residArray, callback) {
    	if(!residArray || residArray.length == 0) {
    		callback();
//			dialog.close();
    		Common.closeDialog();
    	}
    	var url = "https://noteyd.chaoxing.com/pc/resource/getFilesInfo?resids=" + residArray.join();
    	$.ajax({
    		url : url,
    		type : "get",
            xhrFields: {
                withCredentials: true
            },
            dataType : "json",
            success : function(data) {
            	if(data && data.result && data.data) {
        			var fileDetailArr = data.data;
        			for(var i=0; i<fileDetailArr.length; i++) {
        				var fileDetail = fileDetailArr[i];
        				if(fileDetail.filename == undefined || fileDetail.filename == "") {
        					continue;
        				}
        				var suffix = fileDetail.filename.substring(fileDetail.filename.lastIndexOf(".")+1, fileDetail.filename.length)
        				if(Cloud.imageSuffix.indexOf(suffix) > -1) {
        					// 图片替换对应结构
        					var imgUrl = fileDetail.http;
        					var size = fileDetail.size
        					if(size) {
        						var rw = size.substring(0, size.indexOf("x"));
        						var rh = size.substring(size.indexOf("x")+1, size.length);
        						imgUrl = imgUrl + "?rw="+rw + "&rh=" + rh;
        					}
        					if(fileDetail.length) {
        						if(size) {
        							imgUrl += "&_fileSize=" + fileDetail.length;
        						} else {
        							imgUrl += "?_fileSize=" + fileDetail.length;
        						}
        					}
        					Common.dataMap.put(residArray[i],{"url": imgUrl,"type":"img", "objectid": fileDetail.objectid})
        				} else if(Cloud.videoSuffix.indexOf(suffix) > -1){
        					// 视频替换对应结构
        					// 获取当前视频对应的云盘文件的名称，这样才能拿到用户修改后的名称
        					var cloud_file = Common.dataMap.get(residArray[i]);
        					var cloud_file_name = "";
        					if(cloud_file && cloud_file.att_clouddisk) {
        						cloud_file_name = cloud_file.att_clouddisk.name || "";
        					} else {
        						cloud_file_name = fileDetail.filename || "";
        					}
        					file = {
        							"att_video": {
        								"coverUrl": fileDetail.screenshot,
        								"createTime": (new Date()).getTime(),
        								"fileLength": fileDetail.length,
        								"fileTitle": cloud_file_name.replace(/'/g,"&apos;"),
        								"objectId2": fileDetail.objectid,
        								"resid": residArray[i],
        								"thumbnails_url": "",
        								"type": suffix,
        								"videoHeight": 0,
        								"videoLength": fileDetail.duration,
        								"videoWidth": 0
        								},
        							"attachmentType": 29
            					}
        					Common.dataMap.put(residArray[i], file);
        				}
        			}
        			callback();
//        			dialog.close();
        			Common.closeDialog();
        		} else {
        			alert(data.msg);
        		}
            },
    	});
    }
    // 加载云盘列表
    function loadCloudList(page, pageSize, dpath) {
    	if(!page) {
    		page = 1;
    	}
    	if(!dpath) {
    		dpath = "";
    	}
    	if(!pageSize) {
    		pageSize = Common.pageSize;
    	}
    	if(page == 1) {
    		$("#attachment").empty();
    	}
    	var url = "https://noteyd.chaoxing.com/pc/resource/getCloudFiles?page=" + page + "&pageSize=" + pageSize + "&dpath=" + dpath;
    	$.ajax({
    		url : url,
    		type : "get",
            xhrFields: {
                withCredentials: true
            },
            dataType : "json",
            success : function(data) {
        		if(undefined == data || data == null) return;
        		var result =  data.result;
        		if(result == 1){
        			var icon_default = 'http://p.ananas.chaoxing.com/star3/origin/42ae8254a6bfa9d64f34aaca86f174aa.jpg?rw=750&rh=750';
        			
        			var list = data.list;
        			var listSize = 0;
        			if(list && list.length > 0){
        				if(pageSize == list.length) {
        					// 可以加载更多
        					Cloud.loadMore = true;
        				} else {
        					Cloud.loadMore = false;
        				}
        				var onerrorIcon = "https://pan-yz.chaoxing.com/views/images/filelogo/x_def.png"
        				for(var i=0; i<list.length; i++) {
        					var info = list[i];
        					var filesHtml= '';
        					var icon = info.thumbnail;
        					
        					if(!info.isfile){
        						// 文件夹
        						filesHtml = Common.getFolderHtml(info.resid, info.name, info.modifyDate);
        						var folder = {
        								"att_cloudFolder": {
        									"isempty": false,
        									"isfile": false,
        									"name": info.name,
        									"parentPath": "{}",
        									"preview": "",
        									"puid": info.puid,
        									"resid": info.residstr,
        									"restype": "RES_TYPE_YUNPAN_FOLDER",
        									"size": "0",
        									"suffix": "",
        									"thumbnail": ""
        								},
        								"attachmentType": 38
        						}
        						Common.dataMap.put(info.residstr, folder);
        					} else if (info.filetype == "COLLECT_CLASS") {
        						var modifyDate = info.modifyDate;
        						var residstr = info.residstr;
        						var info = JSON.parse(info.extinfo);
        						var cataid = parseInt(info.cataid);
        						if(cataid > 0 && cataid != 100000019){ // 云盘类型暂未发现添加来源，暂不处理
            						var resourceHtml = "";
            						var title = ""; // 名称
            						var icon = ""; // 图标
            						var desc = ""; // 描述
            						if (typeof info.content == 'string') {
            					        try {
            					        	content = JSON.parse(info.content);
            					        } catch(e) {
            					            console.log(e);
            					        }
            					    } else {
            					    	content = info.content;
            					    }
            						if (!content) {
            							return;
            						}
            						var json = {};
        							switch(cataid) {
        							case 100000001 : 
        								// 专题
        								title = content.appname;
        								icon = content.logopath;
        								var otherConfig = JSON.parse(content.otherConfig || "");
        								if (otherConfig) {
        									desc = otherConfig.author;
        								} 
        								
        								json = {
        										"att_subject": {
        											"category": 0,
        											"settings": {
        												"aid": content.aid,
        												"available": 0,
        												"bind": 0,
        												"isWebapp": 0,
        												"level": content.otherConfig.level || 0,
        												"logoshowtype": 0,
        												"needLogin": 0,
        												"needRegist": 0,
        												"norder": 0,
        												"rights": 0,
        												"useClientTool": content.useClientTool
        											},
        											"subjectDescription": content.otherConfig.author || "",
        											"subjectLink": content.appurl,
        											"subjectLogo": content.logopath,
        											"subjectTitle": content.appname
        										},
        										"attachmentType": 3
        								}
        								break;
        								
        							case 100000006 : 
        								// 期刊
        								title = content.appname;
        								icon = content.logopath;
        								var otherConfig = JSON.parse(content.otherConfig || "");
        								if (otherConfig) {
        									desc = otherConfig.author;
        								} 
        								json = {
        										"att_subject": {
        											"category": 0,
        											"settings": {
        												"aid": content.aid,
        												"available": 0,
        												"bind": 0,
        												"isWebapp": 0,
        												"level": 0,
        												"logoshowtype": 0,
        												"needLogin": 0,
        												"needRegist": 0,
        												"norder": 0,
        												"rights": 0,
        												"useClientTool": content.useClientTool
        											},
        											"subjectDescription": content.otherConfig.author || "",
        											"subjectLink": content.appurl,
        											"subjectLogo": content.logopath,
        											"subjectTitle": content.appname
        										},
        										"attachmentType": 6
        								}
        								break;
        								
        							case 100000015 :
        								// 网页
        								title = content.resTitle;
        								icon = content.resLogo;
        								desc = "";
        								json = {
        										"att_web": {
        											"logo": content.resLogo,
        											"showContent": 0,
        											"title": content.resTitle,
        											"url": content.resUrl
        										},
        										"attachmentType": 25
        								}
        								break;
        								
        							case 100000020 : 
        								// 话题
        								title = content.title;
        								icon = "/res/plugin/ueditor/dialogs/onlineattach/images/topic.png";
        								desc = content.createrName;
        								json = {
        										"att_topic": {
        											"att_group": {
        												"bbsId": content.bbsid,
        												"createTime": 0,
        												"deptId": 0,
        												"id": content.circleId,
        												"name": content.circleName
        											},
        											"createTime": 0,
        											"creatorId": content.createrId,
        											"creatorName": content.createrName,
        											"id": content.id,
        											"shareUrl": content.shareUrl,
        											"title": content.title,
        											"uuid" : content.uuid
        										},
        										"attachmentType": 1
        								}
        								break;
        							case 100000021 : 
        								// 笔记
        								title = content.title;
        								icon = "/res/plugin/ueditor/dialogs/onlineattach/images/note.png";
        								desc = content.createrName;
        								json = {
        										"att_note": {
        											"cid": content.cid,
        											"createTime": 0,
        											"creatorId": content.createrId,
        											"creatorName": content.createrName,
        											"isRtf": content.isRtf,
        											"shareUrl": content.shareUrl,
        											"title": content.title
        										},
        										"attachmentType": 2
        								}
        								break;
        							case 100000028 : 
        								title = content.title;
        								icon = "/res/plugin/ueditor/dialogs/onlineattach/images/notice_received.png";
        								if (content.sourceType == 1000) {
        									icon = "/res/plugin/ueditor/dialogs/onlineattach/images/letter_received.png";
        								}
        								desc = content.createrName;
        								json = {
        									"att_notice": {
        										"idCode": content.idCode,
        										"logo": content.logo,
        										"createrPuid": "17327127",
        										"id": content.id,
        										"title": content.title || '',
        										"createrId": content.createrId,
        										"shareUrl": content.shareUrl,
        										"createrName": content.createrName,
        										"sourceType": content.sourceType,
        										"insertTime": content.insertTime
        										},
        									"attachmentType": 8,
        								}
        								break;
        							}
        							Common.dataMap.put(residstr, json);
        							if(!icon) {
        								icon = "https://pan-yz.chaoxing.com/views/images/filelogo/x_def.png";
        							}
        							if (json.attachmentType) {
        								resourceHtml = Common.getAttachHtml(residstr, icon, title, desc || '-', '', modifyDate);
        							} else {
        								resourceHtml = Common.getAttachHtml(residstr, icon, title, desc,'','', true);
        							}
        	    					$("#attachment").append(resourceHtml);
            					}
        					} else {
        						// 文件
        						if(!icon){
        							icon = getIcon(info.suffix);
        						}
        						filesHtml = Common.getAttachHtml(info.residstr, icon, info.name, sizeformat(info.size), onerrorIcon, info.modifyDate);
        						var file = {};
    							var infoJson = {
        								"crc": info.crc,
        								"isempty": false,
        								"isfile": true,
        								"name": info.name.replace(/'/g,"&apos;"), // 将单引号进行替换，否则调ue的insertHtml方式，数据会被截断到单引号前
        								"objectId": info.objectId,
        								"parentPath": JSON.stringify({"objectId": info.objectId}),
        								"preview": info.preview,
        								"puid": info.puid,
        								"resid": info.residstr,
        								"restype": "RES_TYPE_YUNPAN_FILE",
        								"size": info.size,
        								"suffix": info.suffix,
        								"thumbnail": info.thumbnail
        						}
        						file = {
    								"att_clouddisk": {
    									"fileId": info.objectId,
    									"fileSize": sizeformat(info.size),
    									"infoJsonStr": JSON.stringify(infoJson),
    									"isfile": true,
    									"name": info.name.replace(/'/g,"&apos;"),
    									"parentPath": JSON.stringify({"objectId": info.objectId}),
    									"preview": info.preview,
    									"puid": info.puid,
    									"resid": info.residstr,
    									"size": info.size,
    									"suffix": info.suffix
    								},
    								"attachmentType": 18
        						}
        						
        						Common.dataMap.put(info.residstr, file);
        					}
        					$("#attachment").append(filesHtml);
        				}
        				$(".colorShallow").find('span').text($('.list').children().length);
        				Common.updateSelectedCount();
        				afterload();
        			}
        		}
            }
    	});
    }
    
    //文件大小格式
    function sizeformat(bytes){
        if (bytes / 1024 > 1) {
            if (bytes / (1024 * 1024) > 1) {
                return "" + (bytes/(1024 * 1024)).toFixed(1) + "MB";
            } else {
                return "" + parseInt(bytes/1024) + "KB";
            }
        } else {
            return "" + bytes + "B";
        }
    }
    
    // 获取文件图标
    function getIcon(suffix){
    	var baseUrl = 'https://pan-yz.chaoxing.com';
    	var icon = '/views/images/filelogo/x_def.png';
    	if(suffix != null && suffix != undefined && suffix != ''){
    		for(var j=0; j<Cloud.fileIconList.length; j++){
    			var fileIcon = Cloud.fileIconList[j];
    			var keys = fileIcon.keys;
    			if(keys.indexOf(suffix) > 0){
    				icon = fileIcon.value;
    			}
    		}
    	}
    	return baseUrl+icon;
    }
    //全选、取消全选
    $('.tabbody').on('click','.selectAll',function(e){
    	if(!$(this).hasClass('checkbox_checked')){			
    		//全选
    		$(this).addClass('checkbox_checked');
    		var $parent = $(this).parents('.tabbody');
    		$parent.find("li").addClass('active');
    		$parent.find(".checkbox").addClass('checked');
    		var $data_file = $parent.find(".list li");
    		$data_file.each(function(){
    			Common.selectedAttachmentMap.put($(this).attr('resid'),"selected");
    		});
    	}else{												
    		//取消全选
    		$(this).removeClass('checkbox_checked');
    		var $parent = $(this).parents('.tabbody');
    		$parent.find("li").removeClass('active');
    		$parent.find(".checkbox").removeClass('checked');
    		var $data_file = $parent.find(".list li");
    		$data_file.each(function(){
    			Common.selectedAttachmentMap.removeByKey($(this).attr('resid'));
    		});
    	}
    	Common.updateSelectedCount();
    })
    
    // 点击checkbox
    $('#attachment').on('click','.checkbox',function(){
    	$(this).toggleClass('checked');
    	$(this).parent().toggleClass('active');
    	if($(this).hasClass('checked')) {
    		// 选中状态
    		Common.selectedAttachmentMap.put($(this).parent().attr('resid'),"selected");
    	} else {
    		Common.selectedAttachmentMap.removeByKey($(this).parent().attr('resid'));
    	}
    	Common.updateSelectedCount();
    })
    
    // 点击文件
    $('#attachment').on('click','.cloudItem .Mtion-con',function(){
    	$(this).prev().toggleClass('checked');
    	$(this).parent().toggleClass('active');
    	if($(this).prev().hasClass('checked')) {
    		// 选中状态
    		Common.selectedAttachmentMap.put($(this).parent().attr('resid'),"selected");
    	} else {
    		Common.selectedAttachmentMap.removeByKey($(this).parent().attr('resid'));
    	}
    	Common.updateSelectedCount();
    })
    
    // 点击文件夹，查询当前文件夹下的文件
    $('#attachment').on('click','.folderItem .folder',function(){
    	if($(this).prev().hasClass('checked')) {
    		// 文件夹已选中，改为取消选中
    		$(this).prev().toggleClass('checked');
    		$(this).parent().toggleClass('active');
    		Common.selectedAttachmentMap.removeByKey($(this).parent().attr('resid'));
    		Common.updateSelectedCount();
    	} else {
    		Common.current_dpath = $(this).parent().attr('resid');
    		Common.backDpathArray.push(Common.current_dpath);
    		Common.current_page = 1;
    		loadCloudList(1, Common.pageSize, Common.current_dpath);
    		
//    		$('.backToLast').show().height(40);
//    		$('.tabbody').height($('.wrapper').height()-$('.backToLast').height()-1);
    		
    		//将改文件夹加到路径中
    		var choosedFolderResid = $(this).parent().attr('resid');
			$('.breadcrumb').find('.active').attr('class', 'clickable');
			tmpHtml = '<li class="active" resid="'+ choosedFolderResid +'">'+ $(this).find('h3').html() +'</li>';
			$('.breadcrumb').append(tmpHtml);
    	}
    })
    
    // 点击路径上的文件夹跳转到指定的文件夹下
	$('.breadcrumb').on('click', '.clickable ', function() {
		var resid = $(this).attr('resid')
		Common.current_dpath = resid;
		Common.current_page = 1;
		var includeChoosedFolder = $('.breadcrumb').find('li[resid="'+ resid +'"]')
		if (includeChoosedFolder && includeChoosedFolder.length > 0) {
			// 路径中有选中文件夹的resid，表示是点击的路径上的某个文件夹，去掉该文件夹后面的路径
			includeChoosedFolder.attr('class','active');
			includeChoosedFolder.nextAll().remove();
		}
		// 去掉点击的文件夹后的路径
		loadCloudList(1, Common.pageSize, Common.current_dpath);
	});
    
    // 返回上一级
    $('.backToLast').click(function(){
    	Common.backDpathArray.splice(Common.backDpathArray.length-1,1);
    	if(Common.backDpathArray.length == 0) {
    		Common.current_dpath = '';
    		$('.backToLast').hide();
    		$('.tabbody').height($('.wrapper').height());
    	} else {
    		Common.current_dpath = Common.backDpathArray[Common.backDpathArray.length-1];
    	}
    	Common.current_page = 1;
    	loadCloudList(1, Common.pageSize, Common.current_dpath);
    })
    
    // 滑动加载更多
    $(".tabbody").mCustomScrollbar({
		theme: 'minimal-dark',
		callbacks: {
			whileScrolling: function(){ // 只要滚动条滚动，这个函数就会执行
				if (this.mcs.topPct > 80 && Cloud.loadMore) {    // 这表示当滚动条滚动到这个div的80%(当然这个值是可变的)的时候调用下面的代码，
					loadCloudList(Common.current_page++, Common.pageSize, Common.current_dpath);
				}
			}
		}
	})
    
    //数据加载完成后，设置文字显示行数、滚动条、多选框
    function afterload(){
    	if($('.backToLast').css('display')=='block'){
    		$('.tabbody').height($('.wrapper').height()-$('.backToLast').height()-1)
    	}
    	$('.tabbody').getNiceScroll().remove();
		$('.tabbody').niceScroll({
			cursorcolor: "#dddddd",
			cursorborder: 'solid 1px #dddddd'
		});
		/*$('.checkbox').click(function(){
			$(this).toggleClass('checked')
		});
		$('.cloudItem .Mtion-con').click(function(){
			$(this).prev().toggleClass('checked')
		})
		$('.folderItem .folder').click(function(){
			$('.backToLast').show().height(40)
			$('.tabbody').height($('.wrapper').height()-$('.backToLast').height()-1)
		})*/
    }