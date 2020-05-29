(function () {
    var parent = window.parent;
    //dialog对象
//    dialog = parent.$EDITORUI[window.frameElement.id.replace( /_iframe$/, '' )];
    //当前打开dialog的编辑器实例
//    editor = dialog.editor;

//    UE = parent.UE;

    domUtils = UE.dom.domUtils;

    utils = UE.utils;

    browser = UE.browser;

    ajax = UE.ajax;

    $G = function ( id ) {
        return document.getElementById( id )
    };
    //focus元素
    $focus = function ( node ) {
        setTimeout( function () {
            if ( browser.ie ) {
                var r = node.createTextRange();
                r.collapse( false );
                r.select();
            } else {
                node.focus()
            }
        }, 0 )
    };
 // 通知父页面中去绑定 dialog 的 onok 方法
    if (currentDialog) {
    	parent.postMessage({'msgType': 'execCommand', 'type':'dialog', 'command':'onok', 'className':"edui-dialog edui-for-"+ currentDialog +" edui-default"}, '*');
    }
    
    window.addEventListener('message', function (e) {
    	var data = e.data;
        if (!data) {
            return;
        }
        if(data.msgType == 'ueditor') {
        	editor = data.editor
           
            /*utils.loadFile(document,{
                href:editor.options.themePath + editor.options.theme + "/dialogbase.css?cache="+Math.random(),
                tag:"link",
                type:"text/css",
                rel:"stylesheet"
            });*/
            lang = editor.lang;
            if(lang){
                domUtils.on(window,'load',function () {

                    var langImgPath = editor.options.langPath + editor.options.lang + "/images/";
                    //针对静态资源
                    for ( var i in lang["static"] ) {
                        var dom = $G( i );
                        if(!dom) continue;
                        var tagName = dom.tagName,
                            content = lang["static"][i];
                        if(content.src){
                            //clone
                            content = utils.extend({},content,false);
                            content.src = langImgPath + content.src;
                        }
                        if(content.style){
                            content = utils.extend({},content,false);
                            content.style = content.style.replace(/url\s*\(/g,"url(" + langImgPath)
                        }
                        switch ( tagName.toLowerCase() ) {
                            case "var":
                                dom.parentNode.replaceChild( document.createTextNode( content ), dom );
                                break;
                            case "select":
                                var ops = dom.options;
                                for ( var j = 0, oj; oj = ops[j]; ) {
                                    oj.innerHTML = content.options[j++];
                                }
                                for ( var p in content ) {
                                    p != "options" && dom.setAttribute( p, content[p] );
                                }
                                break;
                            default :
                                domUtils.setAttributes( dom, content);
                        }
                    }
                } );
            }
            
        } else if (data.msgType == 'dialogOnok') {
        	if (currentDialog == 'cloud' || currentDialog == 'notes' || currentDialog == 'collection') {
        		// 点击的是云盘的确定
        		if(currentDialog == 'cloud') {
        			// 云盘如果选择了文件夹，需要走一下分享文件夹的逻辑
        			Cloud.shareCloudFolder(Common.insertFile);
    	    	} else {
    	    		Common.insertFile();
    	    	}
        	} else if (currentDialog == 'link') {
        		// 点击的是链接的确定
        		handleDialogOk();
        	}
        	
        }
    });


})();

