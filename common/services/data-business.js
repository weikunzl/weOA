/**
 * Created by styli on 14-2-25.
 * 数据业务逻辑
 */

define(function(){
    'use strict';

    var initialize = function(module){
        module.factory('dataBusiness', [function(){
            return {
                //转换显示ID为名称
                //showTypeId：显示样式的ID
                //showTypeName：返回显示样式中文名
                showAttTypeToName: function(showTypeId){
                    var showTypeName = "";
                    switch(showTypeId)
                    {
                        case 1:
                            showTypeName = "输入框";
                            break;
                        case 2:
                            showTypeName = "下拉框";
                            break;
                        case 3:
                            showTypeName = "单选框";
                            break;
                        case 4:
                            showTypeName = "复选框";
                            break;
                        case 5:
                            showTypeName = "复文本框";
                            break;
                        case 6:
                            showTypeName = "富文本编辑器"
                    }
                    return showTypeName;
                },

                //转换显示ID为名称
                //showTypeId：显示样式的ID
                //showTypeName：返回显示样式中文名
                showStatusToName: function(statusId){
                    var showStatusName = "";
                    switch(statusId)
                    {
                        case 0:
                            showStatusName = "录入";
                            break;
                        case 1:
                            showStatusName = "录入提交";
                            break;
                        case 2:
                            showStatusName = "编辑领取";
                            break;
                        case 3:
                            showStatusName = "编辑提交";
                            break;
                        case 4:
                            showStatusName = "审核领取";
                            break;
                        case 5:
                            showStatusName = "编辑驳回";
                            break;
                        case 6:
                            showStatusName = "审核驳回";
                            break;
                        case 7:
                            showStatusName = "录入删除";
                            break;
                        case 8:
                            showStatusName = "已发布";
                            break;
                        case 9:
                            showStatusName = "编辑删除";
                            break;
                        default :
                            showStatusName = "录入"
                    }
                    return showStatusName;
                },

                //显示文件内容的当前状态值
                showFileStatusName: function(statusId){
                    var showStatusName = "";
                    switch (statusId){
                        case 0:
                            showStatusName = "未处理";
                            break;
                        case 1:
                            showStatusName = "通过";
                            break;
                        case 2:
                            showStatusName = "未通过";
                            break;
                    }
                    return showStatusName;
                },

                //显示知识点处理状态名称
                showDealtName: function(dealtId){
                    var showStatusName = "";
                    switch (dealtId){
                        case 0:
                            showStatusName = "未处理";
                            break;
                        case 1:
                            showStatusName = "被拆分";
                            break;
                        case 2:
                            showStatusName = "被转换";
                            break;
                    }
                    return showStatusName;
                },

                //显示知识点类型状态名称
                showTypeName: function(typeId){
                    var showStatusName = "";
                    switch (typeId){
                        case 0:
                            showStatusName = "未处理";
                            break;
                        case 1:
                            showStatusName = "拆分新增";
                            break;
                        case 2:
                            showStatusName = "转换新增";
                            break;
                    }
                    return showStatusName;
                },

                //截取文件后缀名
                showFileNameSuffix: function(url){
                    //计算出点的位置
                    var typePos = url.lastIndexOf(".");
                    //截取点之后的字符串
                    var type = url.substring(typePos + 1);
                    return type;
                },

                //内容模式中文
                showContentTypeName: function(methodId){
                    var method =parseInt(methodId);
                    if(method == 0){
                        return "编辑模式";
                    }else if(method == 1){
                        return "附件模式";
                    }
                },

                //显示申请状态名
                showApplyName: function(statusId){
                    var showStatusName = "";
                    switch (statusId){
                        case 0:
                            showStatusName = "待处理";
                            break;
                        case 1:
                            showStatusName = "已通过";
                            break;
                        case 2:
                            showStatusName = "已驳回";
                            break;
                    }
                    return showStatusName;
                },

                //显示领域全路径
                showDomainPath: function(pathes){
                    var domainText = "";
                    angular.forEach(pathes, function(domain, $index){
                        if($index == 0){
                            domainText = domain.name;
                        }else{
                            domainText += " -> " + domain.name;
                        }
                    });
                    return domainText;
                },

                //判断文件大小的单位，是以MB、KB还是以后B为单位
                judgeFileSizeAndUnit: function(size){
                    //判断B
                    if(size < 1024){
                        return size.toString() + "B";
                    }else{
                        var kbFileSize = (size / 1024 ).toFixed(2);
                        //判断KB
                        if(kbFileSize < 1024){
                            return kbFileSize.toString() + "KB";
                        }else{
                            return (kbFileSize / 1024 ).toFixed(2).toString() + "MB";
                        }
                    }
                }
            };
        }]);

        return module;
    };

    return {
        initialize: initialize
    };
});
