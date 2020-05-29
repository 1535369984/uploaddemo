var Note = {
		loadMore : false,
		offsetValue: '',
		openStateConfig : {// 文件夹共享状态
			0 : "私有",
			1 : "共享给好友",
			2 : "共享给个人",
			3 : "公开",
		},
}
	
    window.onload = function () {
//        initButtons();
        loadNotebooks("root", "", 1, true);
    };
    
    
//    function initButtons() {
//        dialog.onok = function () {
//        	console.log('ok')
//            var list = [];
////          list = uploadFile.getInsertList();
//            editor.execCommand('insertfile', list,'insertNote');
//        };
//    }
    
    // 组装笔记页面
    function getNoteHtml(list, user) {
    	var noteHtml = "";
    	for(var i=0; i<list.length; i++) {
    		var note = list[i];
    		noteHtml += '<li class="noteItem" resid="'+ note.cid +'">'
    					+ '<div class="checkbox"><span class="check"></span></div>'
    					+ '<div class="note">';
    		if (note.title) {
    			noteHtml += '<h1 class="noteTitle">'+ note.title +'</h1>'
    		}
    		if (note.content) {
    			noteHtml += '<p class="noteContent">'+ note.content +'</p>';
    		}
    		if (note.imgs && note.imgs.length > 0) {
    			noteHtml += '<div class="noteImg"><img src="'+ note.imgs[0].imgUrl.replace("origin",'100_100c') + '" alt=""></div>';
    		}
    		if(note.attachment) {
    			var attachmentArray = new Array();
    			attachmentArray.push(JSON.parse(note.attachment)[0])
    			noteHtml += getAttachment(attachmentArray, "","",false);
    		}
    		noteHtml += '</div>';
//    		noteHtml += '<p class="noteTime">'+ note.ftime +'</p>';
    		var obj = {
    				"att_note": {
    					"cid": note.cid,
    					"contentTxt": note.content,
    					"createTime": note.createTime,
    					"creatorAvatar": "http://photo.chaoxing.com/p/"+ user.puid +"_80?flag=1&psize=100_100c&ext=jpg",
    					"creatorId": user.uid,
    					"creatorName": user.name,
    					"isRtf": note.isRtf,
    					"shareUrl": note.shareUrl,
    					"title": note.title
    				},
    				"attachmentType": 2
    		}
    		Common.dataMap.put(note.cid, obj);
		}
    	return noteHtml;
    }
    
    // 加载笔记
    function loadNotes(notebookCid, top, offsetValue) {
    	notebookCid = notebookCid || "root";
    	
    	var data = {
			offsetValue:offsetValue,
			top:top,
			pageSize : 50,
			replaceN : 1
		};
		$.ajax({
			url : "/pc/note_note/myNotesLatest?notebookCid=" + notebookCid,
			type : "get",
			data : data,
			dataType : "json",
			success : function(resultData) {
				if (resultData && (resultData.result || 0) == 1) {
					if (resultData.msg) {
						if(resultData.msg.list && resultData.msg.list.length > 0){
							if(resultData.msg.pos.lastPage != 1) {
								Note.loadMore = true;
							} else {
								Note.loadMore = false;
							}
							// 记录上传拉取的最后一条数据值，用于下次查询
							Note.offsetValue = resultData.msg.pos.lastValue;
							$("#attachment").append(getNoteHtml(resultData.msg.list, resultData.msg.user));
							$('#attachment .noteItem .Mtion-con').find('a').attr('href',"javascript:void(0);");
						}
						if (top == 1 && $('.notes .noteItem').length < data.pageSize) {
							loadNotes(notebookCid, 0, '')
						}
					}
				}
				afterload();
			},
			error : function() {
			}
		});
    }
    
    // 加载笔记本
    function loadNotebooks (notebookCid, offsetValue, top, clear) {
    	if(!notebookCid) {
    		notebookCid = 'root';
    	}
    	var data = {
			notebookCid : notebookCid,
			top : top,
			pageSize : 100
		}
		if(offsetValue) {
			data.offsetValue = offsetValue;
		}
    	if(clear) {
			$("#attachment").empty();
		}
    		
		$.ajax({
			url : "/pc/note_notebook/getNotebooksLatest",
			type : "get",
			data : data,
			dataType : "json",
			success : function(resultData) {
				if (resultData && (resultData.result || 0) == 1) {
					if (resultData.msg && resultData.msg.list && resultData.msg.list instanceof Array) {
						//renderNotebooks(resultData.msg.list, notebookCid, clear);
						var list = resultData.msg.list;
						var folderHtml = "";
						for(var i=0; i<list.length; i++) {
							var obj = list[i];
							var introduce = "";
							if (obj.introduce && (obj.openedState == 1 || obj.openedState == 2)) {
								introduce = "共享给" + obj.introduce;
							}
							if(!introduce) {
								// 没有 introduce，或者是私有的 ， 用默认的
								introduce = Note.openStateConfig[obj.openedState || 0];
							}
							folderHtml += Common.getFolderHtml(obj.cid, list[i].name, '', introduce);
							var notebook = {
									"att_notebook": {
										"cid": obj.cid,
										"createTime": obj.createTime,
										"deleted": obj.deleted,
										"editStatus": 0,
										"level": 1,
										"name": obj.name,
										"numCount": obj.note_count,
										"openedState": obj.openedState,
										"showIcon": true,
										"sort": obj.sort,
										"subNoteBookCount": 0,
										"tag": obj.tag,
										"tagType": -2,
										"top": obj.top,
										"updateTime": obj.updateTime,
										"version": obj.version
									},
									"attachmentType": 10
							}
							Common.dataMap.put(obj.cid, notebook);
						}
						$("#attachment").append(folderHtml);
					}
					if (resultData.msg && resultData.msg.pos) {//如果有更多数据，尝试渲染下一页数据
						var lastPage = resultData.msg.pos.lastPage || 0;
						if (lastPage != 1) {
							loadNotebooks(notebookCid, resultData.msg.pos.lastValue, top, false);
						} else if(top == 1){
							loadNotebooks(notebookCid, "", 0, false);
						} else {
							afterload();
							// 开始渲染笔记
							loadNotes(notebookCid, 1, '');
						}
					} else {
						// 开始渲染笔记
						loadNotes(notebookCid, 1, '');
					}
				}
			}
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
    })
    
    // 点击笔记
    $('#attachment').on('click','.noteItem .note',function(){
    	$(this).prev().toggleClass('checked');
    	$(this).parent().toggleClass('active');
    	if($(this).prev().hasClass('checked')) {
    		// 选中状态
    		Common.selectedAttachmentMap.put($(this).parent().attr('resid'),"selected");
    	} else {
    		Common.selectedAttachmentMap.removeByKey($(this).parent().attr('resid'));
    	}
    })
    
    // 点击文件夹，查询当前文件夹下的文件
    $('#attachment').on('click','.folderItem .folder',function(){
    	
    	if($(this).prev().hasClass('checked')) {
    		// 文件夹已选中，改为取消选中
    		$(this).prev().toggleClass('checked');
    		$(this).parent().toggleClass('active');
    		Common.selectedAttachmentMap.removeByKey($(this).parent().attr('resid'));
    	} else {
    		Common.current_dpath = $(this).parent().attr('resid');
    		Common.backDpathArray.push(Common.current_dpath);
    		Common.current_page = 1;
    		loadNotebooks(Common.current_dpath, "", 1, true);
    		
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
		loadNotebooks(Common.current_dpath, "", 1, true);
	});
    
    // 返回上一级
    $('.backToLast').click(function(){
    	Common.backDpathArray.splice(Common.backDpathArray.length-1,1);
    	if(Common.backDpathArray.length == 0) {
    		Common.current_dpath = '';
    		$('.backToLast').hide();
    	} else {
    		Common.current_dpath = Common.backDpathArray[Common.backDpathArray.length-1];
    	}
    	Common.current_page = 1;
    	loadNotebooks(Common.current_dpath, "", 1, true);
    })
    
    // 滑动加载更多
    $(".tabbody").mCustomScrollbar({
		theme: 'minimal-dark',
		callbacks: {
			whileScrolling: function(){ // 只要滚动条滚动，这个函数就会执行
				if (this.mcs.topPct > 80 && Note.loadMore) {    // 这表示当滚动条滚动到这个div的80%(当然这个值是可变的)的时候调用下面的代码，
					Note.loadMore = false;
					loadNotes(Common.current_dpath, 0, Note.offsetValue);
				}
			}
		}
	})
    
    //数据加载完成后，设置文字显示行数、滚动条、多选框
    function afterload(){
//    	if($('.backToLast').css('display')=='block'){
//    		$('.tabbody').height($('.wrapper').height()-$('.backToLast').height()-1)
//    	}
    	$('.noteTitle').each(function(index, element) {
		    $clamp(element, { clamp: 2, useNativeClamp: false });
		});
		$('.Ht-p').each(function(index, element) {
		    $clamp(element, { clamp: 2, useNativeClamp: false });
		});
		$('.noteContent').each(function(index, element) {
		    $clamp(element, { clamp: 3, useNativeClamp: false });
		});
		$('.tabbody').getNiceScroll().remove();
		$('.tabbody').niceScroll({
			cursorcolor: "#dddddd",
			cursorborder: 'solid 1px #dddddd'
		});
    }