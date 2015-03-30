(function ($) {
    var printAreaCount = 0;
    $.fn.printArea = function (columnsModel,datas) {
        var ele = $(this);
        var idPrefix = "printArea_";
        removePrintArea(idPrefix + printAreaCount);
        printAreaCount++;
        var iframeId = idPrefix + printAreaCount;
        var iframeStyle = 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;';
        iframe = document.createElement('IFRAME');
        $(iframe).attr({
            style: iframeStyle,
            id: iframeId
        });
        document.body.appendChild(iframe);
        var doc = iframe.contentWindow.document;
        doc.write(' <link rel="stylesheet" href="./css/bootstrap.css" />');
        $(document).find("link").filter(function () {
            return $(this).attr("rel").toLowerCase() == "stylesheet";
        }).each(
                function () {
                    doc.write('<link type="text/css" rel="stylesheet" href="'
                            + $(this).attr("href") + '" >');
                });
        console.log( $(ele))
        doc.write('<div class="' + $(ele).attr("class") + '">' + createPrintDom(columnsModel,datas)
                + '</div>');
        doc.close();
        var frameWindow = iframe.contentWindow;
        frameWindow.close();
        frameWindow.focus();
        frameWindow.print();
    }
    var removePrintArea = function (id) {
        $("iframe#" + id).remove();
    };

    function createPrintDom(columnsModel,datas){
        var thDom = "";
        angular.forEach(columnsModel,function(column){
            if(column.visible==false){
                return
            }
            thDom+='        <th class="">'+column.displayName+'</th>'
        })
        var trDom ="";
        angular.forEach(datas,function(item){
            var tdDom = "";
            angular.forEach(columnsModel,function(column){
                if(column.visible==false){
                    return
                }
                tdDom+='<td class="center" >'+ undefinedParse(item[column.field]) +'</td>'
            })
            trDom +='<tr >'+tdDom+'</tr>'
        })
        var tableDom =
            '<table class="table table-bordered" style="border-bottom: 1px solid #cccccc;border-top: 1px solid #cccccc;" data-kz-table-fixed-header>'
            +'<thead>'
            +' <tr>'
            +thDom
            +'    </tr>'
            +'</thead>'
            +'<tbody>'
            +trDom
            +'</tbody>'
            +'</table>'
        return tableDom
    }
    function undefinedParse(str){
        if(!str){
            return '';
        }
        return str;
    }
})(jQuery);