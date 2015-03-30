/**
 * Created by pippo on 14-10-27.
 * 出差route
 */

define(function(){
    'use strict';
    var son =[];
    var evectionAdd = {
        uri: '/evection/add'
        , controller: 'evectionAddCtrl'
        , templateUrl: 'modules/evection/templates/add-edit.html'
        , ifMenu: true
        , name: 'add'
        , title: '出差申请'
        , icon: 'icon-th'
        , api: ''
    };
    var evectionEdit = {
        uri: '/evection/edit/:id'
        , controller: 'evectionEditCtrl'
        , templateUrl: 'modules/evection/templates/add-edit.html'
        , ifMenu: false
        , name: 'edit'
        , title: '编辑'
        , icon: 'icon-edit'
        , api: ''
    };
   var evectionEdit2 = {
        uri: '/evection/remove/:id'
        , controller: 'evectionRemoveCtrl'
        , templateUrl: 'modules/evection/templates/add-edit.html'
        , ifMenu: false
        , name: 'remove'
        , title: '销假'
        , icon: 'icon-edit'
        , api: ''
    };


    var listEdit =  {
        uri: '/evection/listEdit'
        , controller: 'evectionListEditCtrl'
        , templateUrl: 'modules/evection/templates/listEdit.html'
        , ifMenu: true
        , name: 'evectionListEditCtrl'
        , title: '财务审核'
        , icon: 'icon-edit'
        , api: ''
    };

//顺序与数据库权限一致
    var sonList = [evectionAdd,{
        uri: '/evection/evectionTabs/:seeSelf'
        , controller: 'evectionTabs'
        , templateUrl: 'modules/evection/templates/listTabs.html'
        , ifMenu: true
        , name: 'evectionTabs'
        , title: '出差列表'
        , icon: 'icon-th'
        , api: ''
    }, {
        uri: '/evection/list/:seeSelf'
        , controller: 'evectionListCtrl'
        , templateUrl: 'modules/evection/templates/list.html'
        , ifMenu: false
        , name: 'evectionListCtrl'
        , title: '下属审批'
        , icon: 'icon-th'
        , api: ''
    }, {
        uri: '/evection/listOwn/:seeSelf'
        , controller: 'evectionListOwnCtrl'
        , templateUrl: 'modules/evection/templates/listOwn.html'
        , ifMenu: false
        , name: 'evectionListOwnCtrl'
        , title: '个人查询'
        , icon: 'icon-th'
        , api: ''
    }, {
        uri: '/evection/listEmp/:seeSelf'
        , controller: 'evectionListEmpCtrl'
        , templateUrl: 'modules/evection/templates/listEmp.html'
        , ifMenu: false
        , name: 'evectionListEmpCtrl'
        , title: '下属查询'
        , icon: 'icon-th'
        , api: ''
    },evectionEdit,evectionEdit2,listEdit];
    var group = 'evection'
    var authViewList = config.authViewList;
    var authParentIndex = config.menuList.indexOf('modules/'+group)
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
        group: group
        , title: '出差'
        , icon: 'icon-plane'
        , son:son
    };
});