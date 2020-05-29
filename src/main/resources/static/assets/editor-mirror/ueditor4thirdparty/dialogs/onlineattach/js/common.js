var Common = {
		getFolderHtml : function(){},
		getAttachHtml : function(){},
		current_dpath : '', //当前路径
		backDpathArray : new Array(), //记录查询的dpath，用于返回上一级
		selectedAttachmentMap : new Map(), // 选中的数据
		dataMap : new Map(),  // 所有数据
		current_page : 1,
		pageSize : 100,
		attachmentType : '',
		closeDialog : function(){}, // 关闭当前 dialog 窗口 
		insertFile : function(){}, // 将选择的内容加到页面中
		updateSelectedCount : function(){}, // 更新选中的附件数量
}

Common.getFolderHtml = function(resid, name, modifyDate, desc) {
	var active = "";
	var checked = "";
	if(Common.selectedAttachmentMap.containsKey(resid)) {
		active = "active";
		checked = "checked";
	} else {
		active = "";
		checked = "";
	}
	var dateDesc = '';
	if (modifyDate) {
		dateDesc += '<p>-</p>';
		dateDesc += '<p>'+ getFormatDateByLong(modifyDate) +'</p>'
	}
	if (desc) {
		desc = '<p>'+ desc +'</p>';
	} else {
		desc = '';
	}
	folderHtml = '<li class="folderItem '+ active +'" resid="'+ resid +'">'
			   +     '<div class="checkbox '+ checked +'"><span class="check"></span></div>'
			   +     '<div class="folder">'
			   +         '<img class="folderIcon" src="images/folder.png" />'
			   +         '<div class="folderInfo">'
			   +             '<h3>'+ (name || '') +'</h3>'
			   +             desc
			   +             dateDesc
			   +          '</div>'
//			   +          '<img class="arrow" src="images/arrow.png" />'
			   +      '</div>'
			   + '</li>';
	return folderHtml;
}

Common.getAttachHtml = function(resid, icon, title, desc, onerrorIcon, modifyDate, unsupported) {
	if(Common.selectedAttachmentMap.containsKey(resid)) {
		active = "active";
		checked = "checked";
	} else {
		active = "";
		checked = "";
	}
	var dateDesc = '';
	if (modifyDate) {
		dateDesc = '<p>'+ getFormatDateByLong(modifyDate) +'</p>'
	}
	var checkboxClass = '';
	if (unsupported) {
		title = '暂不支持选择此类型资源';
		checkboxClass = 'checkbox_disabled';
	} else {
		checkboxClass = 'checkbox ' + checked;
	}
	attachHtml = '<li class="cloudItem '+ active +'" resid="'+ resid +'">'
			   +     '<div class="'+ checkboxClass +'"><span class="check"></span></div>'
		       +     '<div class="Mtion-con">'
		       +     	'<div class="Ht-nation">'
		       +             '<span class="Ht-img"><img src="'+ icon +'" onerror="javascript:this.src=\''+ onerrorIcon +'\';"></span>'
		       +             '<div class="Ht-ct">'
		       +                 '<h3 class="Ht-tit">'+ title +'</h3>'
		       + 				 '<p class="Ht-p">'+ desc +'</p>'
		       +                 dateDesc
		       + 			'</div>'
		       +			'</div>'
		       +		'</div>'
		       + '</li>';
	
	onerror="javascript:this.src='images/logoError.png';"
	return attachHtml;
}

// 将附件添加到编辑框
Common.insertFile = function() {
	// 获取选择的文件的key集合
	var list = Common.selectedAttachmentMap.keys();
	if(!list || list.length == 0) {
		return false;
	}
	var att_fileArray = new Array();
	// 根据选择的文件的key，从map中获取对应的内容
	for(var i=0; i<list.length; i++) {
		att_fileArray.push(Common.dataMap.get(list[i]));
	}
	
//	editor.execCommand('insertfile', att_fileArray);
	parent.postMessage({'msgType': 'execCommand', 'className':"edui-dialog edui-for-"+ currentDialog +" edui-default", 'type':'editor', 'command':'insertfile', 'data':att_fileArray}, '*');
	
	Common.closeDialog();
}

/**
 * 关闭当前窗口
 */
Common.closeDialog = function() {
	parent.postMessage({'msgType': 'execCommand', 'className':"edui-dialog edui-for-"+ currentDialog +" edui-default", 'type':'dialog', 'command':'close'}, '*');
}

/**
 * 更新选中的附件数量
 */
Common.updateSelectedCount = function() {
	var selectdCount = $('.tabbody .list').find('.active').length;
	/*if (currentDialog == 'cloud') {
		selectdCount = $('.tabbody').find('.checkbox_checked').length;
	} else {
		selectdCount = $('.tabbody .list').find('.active').length;
	}*/
	$('.colorShallow').find('em').text(selectdCount);
}

/*function initButtons() {
    dialog.onok = function () {
    	if(Common.attachmentType == 'cloud') {
    		shareCloudFolder(insertFile);
    		return false;
    	} else {
    		insertFile()
    	}
    };
}*/
