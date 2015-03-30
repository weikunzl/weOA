/**
 * Created by styli on 14-3-31.
 * 操作的提示框
 */

define(function(){
    'use strict';

    var initialize = function(module){
        module.factory('saveTooltip', ['auth',function(auth){
            return {
                //转换显示ID为名称
                //status：状态 true|false
                //message：消息
                showSaveTooltip: function(response,status){
                    if(!response){
                        angular.element.gritter.add({
                            title: '提示'
                            , text: '请检查网络！'
                            , class_name: 'winner'
                            , image: 'img/save.png'
                            , sticky: false
                        });
                        return;
                    }
                    if(status==401){//登陆超时异常
                        auth.overTimeLog();
                        return;
                    }

                    if(status==404){//登陆超时异常
                        angular.element.gritter.add({
                            title: '提示'
                            , text: '系统错误，请联系管理员！'
                            , class_name: 'loser'
                            , image: 'img/configuration2.png'
                            , sticky: false
                        });
                        return;
                    }
                    if(status==420){//登陆超时异常
                        //操作成功提示
                        angular.element.gritter.add({
                            title: '提示'
                            , text: '没有权限'
                            , class_name: 'loser'
                            , image: 'img/configuration2.png'
                            , sticky: false
                        });
                        return;
                    }
                    if(response.status){

                        //操作成功提示
                        angular.element.gritter.add({
                            title: '提示'
                            , text: response.message
                            , class_name: 'winner'
                            , image: 'img/save.png'
                            , sticky: false
                        });
                    }else{
                        //操作失败提示
                        angular.element.gritter.add({
                            title: '提示'
                            , text: response.message
                            , class_name: 'loser'
                            , image: 'img/configuration2.png'
                            , sticky: false
                        });
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