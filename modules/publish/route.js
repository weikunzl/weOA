/**
 * Created with JetBrains WebStorm.
 * User: @kazaff
 * Date: 13-9-4
 * Time: 下午3:43
 */
define(function(){
    'use strict';
//角色管理
    var son = [];
    var dashboard = {
        uri: '/dashboard'
        , controller: 'dashboardCtrl'
        , templateUrl: 'modules/publish/templates/dashboard.html'
        , ifMenu: true
        , name: 'dashboard'
        , title: '快捷入口'
        , icon: 'icon-th'
        , api: 'restV2/dashboard/get'
        , status: 1
        ,authIndex:1
    }
        /* ,{
         ifMenu: false
         , name: 'logout'
         , title: '退出'
         , icon: 'icon-off'
         , status: true
         }
         ,{
         ifMenu: false
         , name: 'back'
         , title: '返回主系统'
         , icon: 'icon-dashboard'
         , status: true
         }*/
    var messageList={
            uri: '/messages/:type/:status'
            , controller: 'messagesCtrl'
            , templateUrl: 'modules/publish/templates/message-list.html'
            , ifMenu: false
            , name: 'messageList'
            , title: '消息箱'
            , icon: 'icon-inbox'
            , api: ''
            , status: 1
        ,authIndex:2
        };
       var messageInfo = {
            uri: '/message/:type/:id'
            , controller: 'messageInfoCtrl'
            , templateUrl: 'modules/publish/templates/info.html'
            , ifMenu: false
            , name: 'messageInfo'
            , title: '详细信息'
            , icon: 'icon-envelope'
            , api: ''
            , status: 1
           ,authIndex:3
        };
       var messageHistory ={
            uri: '/message/history/:type/:target'
            , controller: 'messageHistoryCtrl'
            , templateUrl: 'modules/publish/templates/history.html'
            , ifMenu: false
            , name: 'messageHistory'
            , title: '历史消息'
            , icon: 'icon-envelope'
            , api: ''
            , status: 1
           ,authIndex:4
        };
    var group =  'publish';
    //顺序与数据库权限一致
    var sonList = [dashboard,messageList,messageInfo ,messageHistory];
    var authViewList = config.authViewList;
    var authParentIndex = config.menuList.indexOf('modules/'+group)//获取顺序
    if(authViewList&&authViewList.authDir){
        for(var i=0;i<authViewList.authDir.length;i++){
            if(sonList.length==son.length){
                break;
            }
            if(Math.floor(authViewList.authDir[i]/1000)==(authParentIndex+1)){
                son.push(sonList[parseInt(authViewList.authDir[i]%1000)-1]);
            }
        }
    }
    return  {
        group:group
        , title: '首页'
        , icon: 'icon-home'
        , son:son
    };
});