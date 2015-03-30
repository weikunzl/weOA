/**
 * Created with JetBrains WebStorm.
 * User: fanruiping
 * Date: 14-1-21
 * Time: 下午5:08
 */
$(function() {
    $.fn.backToTop = function(options){

        var defaults = {
            showHeight : 150,
            speed : 1000
        };

        var options = $.extend(defaults,options);

        $("body").prepend("<div id='totop'><a>返回</a></div>");

        var toTop = $(this);
        var top = $("#totop");

        toTop.scroll(function(){
            var scrolltop = $(this).scrollTop();
            if(scrolltop >= options.showHeight){
                top.show();
            }else{
                top.hide();
            }
        });

        top.click(function(){
            $("html,body").animate({scrollTop: 0} , options.speed);
        });
    }

    $(window).backToTop({
        showHeight : 100,//设置滚动高度时显示
        speed : 500 //返回顶部的速度以毫秒为单位
    });
});
