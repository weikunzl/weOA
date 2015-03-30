/**
 * Created by pippo on 14-10-27.
 * 加班route
 */

define(function(){
    'use strict';
    //角色管理
    var son = [];
    var add = {
        uri: '/workOvertime/add'
        , controller: 'workOvertimeAddCtrl'
        , templateUrl: 'modules/workOvertime/templates/add-edit.html'
        , ifMenu: true
        , name: 'add'
        , title: '加班申请'
        , icon: 'icon-th'
        , api: ''
    };
    var edit = {
        uri: '/workOvertime/edit/:id'
        , controller: 'workOvertimeEditCtrl'
        , templateUrl: 'modules/workOvertime/templates/add-edit.html'
        , ifMenu: false
        , name: 'edit'
        , title: '编辑'
        , icon: 'icon-edit'
        , api: ''
    };

    var sonList = [add ,edit,{
        uri: '/workOvertime/listTabs/:seeSelf'
        , controller: 'workOvertimeTabsCtrl'
        , templateUrl: 'modules/workOvertime/templates/listTabs.html'
        , ifMenu: true
        , name: 'listTabs'
        , title: '加班列表'
        , icon: 'icon-th'
        , api: ''
    },{
        uri: '/workOvertime/listOwn/:seeSelf'
        , controller: 'workOvertimeListOwnCtrl'
        , templateUrl: 'modules/workOvertime/templates/listOwn.html'
        , ifMenu: false
        , name: 'listOwn'
        , title: '个人查询'
        , icon: 'icon-th'
        , api: ''
    },{
        uri: '/workOvertime/list/:seeSelf'
        , controller: 'workOvertimeListCtrl'
        , templateUrl: 'modules/workOvertime/templates/list.html'
        , ifMenu: false
        , name: 'list'
        , title: '加班审批'
        , icon: 'icon-th'
        , api: ''
    },{
        uri: '/workOvertime/listEmp/:seeSelf'
        , controller: 'workOvertimeListEmpCtrl'
        , templateUrl: 'modules/workOvertime/templates/listEmp.html'
        , ifMenu: false
        , name: 'listEmp'
        , title: '下属查询'
        , icon: 'icon-th'
        , api: ''
    }];
    var group = 'workOvertime'
    var authViewList = config.authViewList;
    var authParentIndex = config.menuList.indexOf('modules/'+group)
    if(authViewList&&authViewList.authDir){
        for(var i=0;i<authViewList.authDir.length;i++){
            if(Math.floor(authViewList.authDir[i]/1000)==(authParentIndex+1)){
                if(sonList.length==son.length){
                    break;
                }
                if(authViewList.authDir[i]%1000-1>=sonList.length){
                    console.error('auth,error')
                    continue;
                }
                son.push(sonList[parseInt(authViewList.authDir[i]%1000)-1]);
            }
        }
    }
    return  {
        group:group
        , title: '加班'
        , icon: 'icon-briefcase'
        , son:son
    };
});