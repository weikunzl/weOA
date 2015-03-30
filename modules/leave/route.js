/**
 * Created by pippo on 14-10-27.
 * 请假route
 */

define(function(){
    'use strict';
    var son =[];
    var leaveAdd = {
        uri: '/leave/add'
        , controller: 'leaveAddCtrl'
        , templateUrl: 'modules/leave/templates/add-edit.html'
        , ifMenu: true
        , name: 'add'
        , title: '请假申请'
        , icon: 'icon-th'
        , api: ''
    };
    var leaveEdit = {
        uri: '/leave/edit/:id'
        , controller: 'leaveEditCtrl'
        , templateUrl: 'modules/leave/templates/add-edit.html'
        , ifMenu: false
        , name: 'edit'
        , title: '编辑'
        , icon: 'icon-edit'
        , api: ''
    };
   var leaveEdit2 = {
        uri: '/leave/remove/:id'
        , controller: 'leaveRemoveCtrl'
        , templateUrl: 'modules/leave/templates/add-edit.html'
        , ifMenu: false
        , name: 'remove'
        , title: '销假'
        , icon: 'icon-edit'
        , api: ''
    };

    var attendanceTimeTab =  {
        uri: '/attendanceTime'
        , controller: 'attendanceTimeTabs'
        , templateUrl: 'modules/leave/templates/attListTabs.html'
        , ifMenu: true
        , name: 'attendanceTimeTabs'
        , title: '迟到早退'
        , icon: 'icon-edit'
        , api: ''
    };
    var attendanceTimeList =  {
        uri: '/attendanceTime/list'
        , controller: 'attendanceTimeList'
        , templateUrl: 'modules/leave/templates/attendanceTimeListPanel.html'
        , ifMenu: false
        , name: 'attendanceTimeList'
        , title: '下属'
        , icon: 'icon-edit'
        , api: ''
    };
    var attendanceTimeListEdit =  {
        uri: '/attendanceTime/listEdit'
        , controller: 'attendanceTimeListEdit'
        , templateUrl: 'modules/leave/templates/attendanceTimeListEditWindow.html'
        , ifMenu: false
        , name: 'attendanceTimeListEdit'
        , title: '下属'
        , icon: 'icon-edit'
        , api: ''
    };
    var attendanceTimeListOwn =  {
        uri: '/attendanceTime/listOwn'
        , controller: 'attendanceTimeListOwn'
        , templateUrl: 'modules/leave/templates/attendanceTimeListOwnPanel.html'
        , ifMenu: false
        , name: 'attendanceTimeListOwn'
        , title: '个人'
        , icon: 'icon-edit'
        , api: ''
    };
    var listEdit =  {
        uri: '/leave/listEdit'
        , controller: 'leaveListEditCtrl'
        , templateUrl: 'modules/leave/templates/listEdit.html'
        , ifMenu: true
        , name: 'leaveListEditCtrl'
        , title: '错误假条驳回'
        , icon: 'icon-edit'
        , api: ''
    };

//顺序与数据库权限一致
    var sonList = [leaveAdd,{
        uri: '/leave/leaveTabs/:seeSelf'
        , controller: 'leaveTabs'
        , templateUrl: 'modules/leave/templates/listTabs.html'
        , ifMenu: true
        , name: 'leaveTabs'
        , title: '请假列表'
        , icon: 'icon-th'
        , api: ''
    }, {
        uri: '/leave/list/:seeSelf'
        , controller: 'leaveListCtrl'
        , templateUrl: 'modules/leave/templates/list.html'
        , ifMenu: false
        , name: 'leaveListCtrl'
        , title: '下属审批'
        , icon: 'icon-th'
        , api: ''
    }, {
        uri: '/leave/listOwn/:seeSelf'
        , controller: 'leaveListOwnCtrl'
        , templateUrl: 'modules/leave/templates/listOwn.html'
        , ifMenu: false
        , name: 'leaveListOwnCtrl'
        , title: '个人查询'
        , icon: 'icon-th'
        , api: ''
    }, {
        uri: '/leave/listEmp/:seeSelf'
        , controller: 'leaveListEmpCtrl'
        , templateUrl: 'modules/leave/templates/listEmp.html'
        , ifMenu: false
        , name: 'leaveListEmpCtrl'
        , title: '下属查询'
        , icon: 'icon-th'
        , api: ''
    },leaveEdit,leaveEdit2,attendanceTimeTab,attendanceTimeList,attendanceTimeListOwn,attendanceTimeListEdit,listEdit];
    var group = 'leave'
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
        , title: '请假'
        , icon: 'icon-tag'
        , son:son
    };
});