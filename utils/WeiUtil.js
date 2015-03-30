var WeiUtil={};
Array.find = function(ary,str){
    var tempItem = {}
    for(var i=0; i<ary.length;i++){
        var item =ary[i]
        if(eval('item.'+str)){
            tempItem ={
                index : i,
                item : item
            };
           break;
        }
    }
    return tempItem;
}
Array.prototype.indexOf = function(e){
    for(var i=0,j; j=this[i]; i++){
        if(j==e){return i;}
    }
    return -1;
}

WeiUtil.Offset=function(e)
{

//取标签的绝对位置
    var t = parseInt(e.offsetTop);
    var l = parseInt(e.offsetLeft)+5;
    var w = parseInt(e.offsetWidth)-5;
    var h = parseInt(e.offsetHeight);

    while(e=e.offsetParent)
    {
        t+=parseInt(e.offsetTop);
        l+=e.offsetLeft;
    }
    return {
        top : t,
        left : l,
        width : w,
        height : h
    }
}

WeiUtil.objConvertStr = function(o){
    if (o == undefined) {
        return "null";
    }
    var r = [];
    if (typeof o == "string") return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o)
                r.push("" + i + ":" + WeiUtil.objConvertStr(o[i]));
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}"
        } else {
            for (var i = 0; i < o.length; i++)
                r.push(WeiUtil.objConvertStr(o[i]))
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString().replace(/\"\:/g, '":""');
}
//获取简拼
//String.getSimplePYChar = function(text)
//{
//    var returnChar = "";
//    execScript("ascCode=Asc(\""+text+"\")", "vbscript");
//    var tmp = 65536 + ascCode;
//    if(tmp>=45217 && tmp<=45252)
//        returnChar= "A";
//    else if(tmp>=45253 && tmp<=45760)
//        returnChar= "B";
//    else if(tmp>=45761 && tmp<=46317)
//        returnChar= "C";
//    else if(tmp>=46318 && tmp<=46825)
//        returnChar= "D";
//    else if(tmp>=46826 && tmp<=47009)
//        returnChar= "E";
//    else if(tmp>=47010 && tmp<=47296)
//        returnChar= "F";
//    else if(tmp>=47297 && tmp<=47613)
//        returnChar= "G";
//    else if(tmp>=47614 && tmp<=48118)
//        returnChar= "H";
//    else if(tmp>=48119 && tmp<=49061)
//        returnChar= "J";
//    else if(tmp>=49062 && tmp<=49323)
//        returnChar= "K";
//    else if(tmp>=49324 && tmp<=49895)
//        returnChar= "L";
//    else if(tmp>=49896 && tmp<=50370)
//        returnChar= "M";
//    else if(tmp>=50371 && tmp<=50613)
//        returnChar= "N";
//    else if(tmp>=50614 && tmp<=50621)
//        returnChar= "O"
//    else if(tmp>=50622 && tmp<=50905)
//        returnChar= "P";
//    else if(tmp>=50906 && tmp<=51386)
//        returnChar= "Q";
//    else if(tmp>=51387 && tmp<=51445)
//        returnChar= "R";
//    else if(tmp>=51446 && tmp<=52217)
//        returnChar= "S";
//    else if(tmp>=52218 && tmp<=52697)
//        returnChar= "T";
//    else if(tmp>=52698 && tmp<=52979)
//        returnChar= "W";
//    else if(tmp>=52980 && tmp<=53640)
//        returnChar= "X";
//    else if(tmp>=53689 && tmp<=54480)
//        returnChar= "Y";
//    else if(tmp>=54481 && tmp<=62289)
//        returnChar= "Z";
//    else //如果不是中文，则不处理
//        returnChar=text;
//    return returnChar;
//}

