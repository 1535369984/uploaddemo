var Collection = {
		//current_dpath : '',
		//backDpathArray : new Array(), //记录查询的dpath，用于返回上一级
		//dataMap : new Map(),  // 记录数据
		//current_page : 1,
		//loadMore : false
}
	
    window.onload = function () {
//        initButtons();
        loadCollectionList();
    };
    
    
//    function initButtons() {
//        dialog.onok = function () {
//        	console.log('ok')
//            var list = [];
////          list = uploadFile.getInsertList();
//            editor.execCommand('insertfile', list);
//        };
//    }
    
    // 加载收藏列表
    function loadCollectionList(page, dpath) {
    	if(!page) {
    		page = 1;
    	}
    	if(!dpath) {
    		dpath = "-1";
    	}
    	if(page == 1) {
    		$("#attachment").empty();
    	}
    	// cataid 100000001 专题； 100000006 期刊； 100000015 网页；100000017 文件夹；100000019 云盘文件； 100000020 话题；100000021 笔记
    	var url = "/pc/resource/getSubscribe?dpath=" + dpath;
    	$.getJSON(url,function(data){
    		if(undefined == data || data == null) return;
    		var result =  data.result;
    		var count = 0;
    		if(result == 1){
    			var icon_default = 'http://p.ananas.chaoxing.com/star3/origin/245a131d75653842d897f5fde3183f06.png?rw=150&rh=150&_fileSize=3177';
    			var list = data.list;
    			if(undefined != list && list != null && list.length > 0){
    				for(var i=0;i<list.length;i++){
    					count = list.length;
    					var info = list[i];
    					var cataid = info.cataid;
    					if(cataid > 0 && cataid != 100000019){ // 云盘类型暂未发现添加来源，暂不处理
    						var resourceHtml = "";
    						var title = ""; // 名称
    						var icon = ""; // 图标
    						var desc = ""; // 描述
    						var content = info.content;
    						var json = {};
    						if(cataid == 100000017) {
    							// 文件夹
//    							resourceHtml = '<li class="folderItem">'
//    								+     '<div class="checkbox"><span class="check"></span></div>'
//    								+     '<div class="folder" resid="100000017_'+ info.id +'">'
//    								+         '<img class="folderIcon" src="images/folder.png" />'
//    								+         '<div class="folderInfo">'
//    								+             '<h3>'+ content.folderName +'</h3>'
//    								+          '</div>'
//    								+          '<img class="arrow" src="images/arrow.png" />'
//    								+      '</div>'
//    								+ '</li>';
    							
    							json = {
									"att_resource": {
										"content": JSON.stringify(content),
										"creatorId": info.content.uid
									},
									"attachmentType": 11
    							}
    							var shareType = content.shareType;
    							var desc = '';
    							if (shareType == 2) {
    								desc = '私有';
    							} else {
    								desc = '公开';
    							}
    							Common.dataMap.put(info.id, json);
    							
    							resourceHtml = Common.getFolderHtml(info.id, content.folderName, '', desc);
    						} else {
    							
    							switch(cataid) {
    							
    							case 100000001 : 
    								// 专题
    								title = content.appname;
    								icon = content.logopath;
    								desc = content.otherConfig.author;
    								
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
    								desc = content.otherConfig.author || "";
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
    							}
    							Common.dataMap.put(info.id, json);
//    							resourceHtml = '<li class="cloudItem">'
//    								+     '<div class="checkbox"><span class="check"></span></div>'
//    								+     '<div class="Mtion-con" resid="'+ key +'">'
//    								+     	'<div class="Ht-nation">'
//    								+             '<span class="Ht-img"><img src="'+ icon +'"></span>'
//    								+             '<div class="Ht-ct">'
//    								+                 '<h3 class="Ht-tit">'+ title +'</h3>';
//    							if(desc) {
//    								resourceHtml += '<p class="Ht-p">'+ desc +'</p>'
//    							}
//    							resourceHtml += '</div>'
//			    							+ '</div>'
//			    							+ '</div>'
//			    							+ '</li>';
    							if(!icon) {
    								icon = "http://p.ananas.chaoxing.com/star3/origin/245a131d75653842d897f5fde3183f06.png?rw=150&rh=150&_fileSize=3177";
    							}
    							if (json.attachmentType) {
    								resourceHtml = Common.getAttachHtml(info.id, icon, title, desc);
    							} else {
    								resourceHtml = Common.getAttachHtml(info.id, icon, title, desc,'','', true);
    							}
    						}
	    					$("#attachment").append(resourceHtml);
    					}
    					
    				}
    			}
    		}
    		afterload();
    		$(".colorShallow").find('span').text(count);
    		Common.updateSelectedCount();
    	});
    }
    
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
    	if ($(this).prev().hasClass('checkbox_disabled')) {
    		return;
    	}
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
    		Common.current_dpath = $(this).parents('.folderItem').attr('resid');
    		Common.backDpathArray.push(Common.current_dpath);
    		Common.current_page = 1;
    		loadCollectionList(1, Common.current_dpath);
    		
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
		loadCollectionList(1, Common.current_dpath);
	});
    
    // 返回上一级
	/*$('.backToLast').click(function(){
		Common.backDpathArray.splice(Common.backDpathArray.length-1,1);
		if(Common.backDpathArray.length == 0) {
			Common.current_dpath = '';
			$('.backToLast').hide();
		} else {
			Common.current_dpath = Common.backDpathArray[Common.backDpathArray.length-1];
		}
		Common.current_page = 1;
		loadCollectionList(1, Common.current_dpath);
	})*/
    
    // 返回上一级
//    $('.backToLast').click(function(){
//    	Collection.backDpathArray.splice(Collection.backDpathArray.length-1,1);
//    	if(Collection.backDpathArray.length == 0) {
//    		Collection.current_dpath = '';
//    		$('.backToLast').hide();
//    	} else {
//    		Collection.current_dpath = Collection.backDpathArray[Collection.backDpathArray.length-1];
//    	}
//    	Collection.current_page = 1;
//    	loadCollectionList(1, 20, Collection.current_dpath);
//    })
    
    // 滑动加载更多
//    $(".tabbody").mCustomScrollbar({
//		theme: 'minimal-dark',
//		callbacks: {
//			whileScrolling: function(){ // 只要滚动条滚动，这个函数就会执行
//				if (this.mcs.topPct == 80 && Collection.loadMore) {    // 这表示当滚动条滚动到这个div的80%(当然这个值是可变的)的时候调用下面的代码，
//					loadCollectionList(Collection.current_page++, 20, Collection.current_dpath);
//				}
//			}
//		}
//	})
    
    // 点击checkbox
//    $('#attachment').on('click','.checkbox',function(){
//    	$(this).toggleClass('checked');
//    })
//    
//    // 点击文件
//    $('#attachment').on('click','.cloudItem .Mtion-con',function(){
//    	$(this).prev().toggleClass('checked');
//    })
    
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
    }