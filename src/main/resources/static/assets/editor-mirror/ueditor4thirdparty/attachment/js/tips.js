/*
 *  自定义的Tips
 */

var scrollTopAll =0;
//通知框滚动
if(parent && parent.window && parent.window != window){
	// 绑定滑动事件
		window.setTimeout(function(){
	        if ('parentIFrame' in window) {
	            parentIFrame.getPageInfo(function(callback){
	                try{
	                	//弹框的高度，没有默认为0
	                	var popHeight = $(".maskFadeOut .popDiv").outerHeight() || 0;
	                	scrollTopAll = callback.scrollTop;// 获取当前窗口距离页面顶部高度
//	                	var parentTop = (callback.clientHeight - popHeight)/2 - 44; 
	                	var parentTop = (callback.clientHeight-49)/2; 
						$('.toolTipBox').css('top',(scrollTopAll+400)+'px');
						//滑到底部超出外面不执行
						if(scrollTopAll+parentTop > document.body.clientHeight- parseInt(popHeight/2)){
	                		return;
	                	}
						//滑到顶部超出外面不执行
//						if(scrollTopAll+parentTop < parseInt(popHeight/2)){
//	                		return;
//	                	}
						$('.popDiv').css('top',(scrollTopAll+parentTop)+'px');
	                }catch(e){
	                }
	            });
	        }
		}, 2000);
		
		
/*		window.setTimeout(function(){
	        if ('parentIFrame' in window) {
	            parentIFrame.getPageInfo(function(callback){
	                try{
	                	scrollTopAll = callback.scrollTop;// 获取当前窗口距离页面顶部高度
	                	var parentTop = (callback.clientHeight - $('.popDiv').outerHeight())/2 - 44;
						$('.toolTipBox').css('top',(scrollTopAll+400)+'px');
						$('.popDiv').css('top',(scrollTopAll+parentTop)+'px');
	                }catch(e){
	                }
	            });
	        }
		}, 2000);*/
}
 //错误提示
  function errorTips(mes){
	  $(".toolTipBox").remove();
	  var html = '<div class="toolTipBox" style="top:50%;z-index:2019;"><i class="popicon"><img src="/res/pc/images/tips/wrong.png" /></i>'+ mes +'</div>';
      
      $("body").append("\r\n"+html+"\r\n");
      $(".toolTipBox").fadeIn();
	  function hide(){
		$(".toolTipBox").fadeOut();
		$(".toolTipBox").remove();
	  }
	  setTimeout(hide, 1500)
	  
  }
  
  //成功提示
  function successTips(mes){
	  $(".toolTipBox").remove();
	  var html = '<div class="toolTipBox" style="top:50%;z-index:2019;"><i class="popicon"><img src="/res/pc/images/tips/right.png" /></i>'+ mes +'</div>';
      
      $("body").append("\r\n"+html+"\r\n");
      $(".toolTipBox").fadeIn();
	  function hide(){
		$(".toolTipBox").fadeOut();
		$(".toolTipBox").remove();
	  }
	  setTimeout(hide, 1500)
	  
  }
  
  //加载中【若关闭 再调用一次】
  function loadingTips(mes){
	  if($(".loadingTipBox").length > 0){
		  $(".loadingTipBox").remove();
	  }else{
		  var html = '<div class="toolTipBox loadingTipBox" style="top:50%;z-index:2019;"><i class="loadicon"><img src="/res/pc/images/tips/round.png" /></i>'+ mes +'</div>';
	      $("body").append("\r\n"+html+"\r\n");
	      $(".toolTipBox").fadeIn();
	  }
  }
  
      
