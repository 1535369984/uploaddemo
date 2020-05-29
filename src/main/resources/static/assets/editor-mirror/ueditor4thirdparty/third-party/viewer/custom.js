//最后一张图片右键头不可点，第一张图片左箭头不可点
function unactiveViewBtn(){
    $('#viewPrev').removeClass('unactive');
    $('#viewNext').removeClass('unactive');
    if(RichTextUitl.imageViewer.index == 0){
        $('#viewPrev').addClass('unactive');
    }else if(RichTextUitl.imageViewer.index == (RichTextUitl.imageViewer.length-1)){
        $('#viewNext').addClass('unactive');
    }
}
$(document).ready(function() {
	$(window).keydown(function (event) {
	    if (event.keyCode == 27) {
	        $('.viewBtnWrap').fadeOut();
	    }
	});
	document.getElementById('viewPrev').onclick = function() {
	    RichTextUitl.imageViewer.prev();
	    unactiveViewBtn()
	}
	document.getElementById('viewNext').onclick = function() {
	    RichTextUitl.imageViewer.next();
	    unactiveViewBtn()
	}
	document.getElementById('viewZoomIn').onclick = function() {
	    RichTextUitl.imageViewer.zoom(0.1);
	}
	document.getElementById('viewZoomOut').onclick = function() {
	    RichTextUitl.imageViewer.zoom(-0.1);
	}
	document.getElementById('viewFlip').onclick = function() {
	    RichTextUitl.imageViewer.rotate(-90);
	}
	document.getElementById('viewDownload').onclick = function() {
		var src = RichTextUitl.imageViewer.image.getAttribute('src');
	    //http://p.ananas.chaoxing.com/star3/600_900Q80/c13d749411edd5a213b0ce9078a45340.jpeg?rw=600&rh=900&_fileSize=78728&_orientation=1
	    if(src){
	        //获取objectId
	        var objectId = src.substring(src.lastIndexOf("/")+1,src.lastIndexOf("."));
	        if(objectId){
	        	Viewer.isDownloadImg = true;
	            //获取云存储下载地址
	            window.location.href = "http://d0.ananas.chaoxing.com/download/"+objectId;;
	        }
	    }
	}
	document.getElementById('viewClose').onclick = function() {
	    RichTextUitl.imageViewer.hide();
	    $('.viewBtnWrap').fadeOut();
	}
	document.getElementById('viewClose').onclick = function() {
		RichTextUitl.imageViewer.hide();
	    $('.viewBtnWrap').fadeOut();
	}
	$('body').on('click','.viewer-canvas',function(e){
		RichTextUitl.imageViewer.hide();
	    $('.viewBtnWrap').fadeOut();
	}); 
	$('body').on('click','.viewer-canvas img',function(e){
	    e.stopPropagation();
	});
});