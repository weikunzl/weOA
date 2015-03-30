/**
 * Created by @kazaff on 14-3-24.
 */
define([
    'config'
], function(config){
    'use strict';
    var initialize = function(module){
        module.factory('message', ["$http", "$rootScope", function($http, $rootScope){
            this.sio = null;
            var self = this;

            //用来等到socket连接完成
            function wait4Connect(cb){
                if(self.sio){
                    cb();
                }else{
                    var deregistration = $rootScope.$on("msg-ok", function(){
                        deregistration();
                        cb();
                    });
                }
            }

            //连接消息服务器
            function connect(chanel){
                //获取服务器位置信息
                $http({method: 'GET', url: config.message})
                    .success(function(data, status, headers, config){

                        //连接消息服务器
                        self.sio = io.connect(data.protocol + "://" + data.host + ":" + data.port + "/" + chanel + "?auth=" + window.localStorage.token, {
                            "reconnect": false
                            , "force new connection": true
                        });

                        self.sio.on("connect", function(){
                            $rootScope.$broadcast("msg-ok");
                        });

                        self.sio.on("connect_failed", function(err){
                            console.log(err);

                            self.sio = null;
                            $rootScope.$broadcast("msg-error", err);
                        });
                        self.sio.on("error", function(err){
                            console.log(err);

                            self.sio = null;
                            $rootScope.$broadcast("msg-error", err);
                        });
                        self.sio.on("disconnect", function(){
                            self.sio = null;
                            $rootScope.$broadcast("msg-close");
                        });

                        //新消息数目提醒
                        self.sio.on("news-total", function(data){
                            $rootScope.$broadcast("msg-notice", data);
                        });
                    })
                    .error(function(data, status, headers, config){
                        console.log(data);

                        self.sio = null;
                        $rootScope.$broadcast("msg-error", data);
                    });
            }

            //用户发消息
            function send(to, title, message, cb){
                wait4Connect(function(){
                    self.sio.emit("send", {
                        sid: config.appId
                        , to: parseInt(to)
                        , title: title
                        , message: message
                    }, cb);
                });
            }

            //获取消息列表
            function getNewsList(type, status, page, perPage , cb){

                wait4Connect(function(){
                    self.sio.emit("news-list", {type: parseInt(type), status: parseInt(status), page: parseInt(page), perPage: parseInt(perPage)}, cb);
                });
            }

            //忽略全部消息
            function ignoreAll(type, cb){
                wait4Connect(function(){
                    self.sio.emit("ignore-news", {type: parseInt(type)}, cb);
                });
            }

            //显示消息详情
            function getNewInfo(id, type, cb){
                wait4Connect(function(){
                    self.sio.emit("new-info", {id: id, type: parseInt(type)}, cb);
                });
            }

            //删除指定消息
            function delNew(id, type, cb){
                wait4Connect(function(){
                    self.sio.emit("remove-new", {id: id, type: parseInt(type)}, cb);
                });
            }

            //查看指定来源历史消息
            function history(target, type, page, perPage, cb){
                wait4Connect(function(){
                    self.sio.emit("history-news", {from: parseInt(target), type: parseInt(type), page: parseInt(page), perPage: parseInt(perPage)}, cb);
                });
            }

            return {
                connect: connect
                , getNewsList: getNewsList
                , ignoreAll: ignoreAll
                , getNewInfo: getNewInfo
                , delNew: delNew
                , send: send
                , history: history
            };
        }]);

        return module;
    };

    return {
        initialize: initialize
    };
});