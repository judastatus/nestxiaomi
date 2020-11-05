$(function(){
	
	app.init();

})

var app={

	init:function(){
		this.slideToggle();
		this.resizeIframe();
		this.confirmDelete();

	},
	resizeIframe:function(){
		//1、获取浏览器的高度
		//2、设置iframe的高度

		// alert($(window).height());

		$("#rightMain").height($(window).height()-80);
	},
	slideToggle:function(){
		$('.aside h4').click(function(){		
						
					
					$(this).siblings('ul').slideToggle();
		})
	},
	// 提示是否删除
	confirmDelete(){
		$('.delete').click(function(){

			var flag=confirm('您确定要删除吗?');
			return flag;
		})
	},
	// 轮播图 修改状态
	changeStatus(el,model,fields,id){
		
		$.get('/admin/main/changeStatus',{id:id,model:model,fields:fields},function(data){			
			if(data.success){
				if(el.src.indexOf('yes')!=-1){
					el.src='/admin/images/no.gif';
				}else{
					el.src='/admin/images/yes.gif';
				}
			}
		})
	}

}

window.onresize=function(){

	app.resizeIframe();
}
