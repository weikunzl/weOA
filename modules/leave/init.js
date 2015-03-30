/**
 * Created by pippo on 14-10-27.
 * 请假模块初始化
 */

define([
    'angular/angular'
    //控制器
    , 'modules/leave/controllers/add'
    , "modules/leave/controllers/edit"
    , "modules/leave/controllers/leaveListOwn"
    , "modules/leave/controllers/leaveListEmp"
    , "modules/leave/controllers/leaveList"
    , "modules/leave/controllers/leaveListEdit"
    , "modules/leave/controllers/leaveTabs"
    , "modules/leave/controllers/remove"

    , "modules/leave/controllers/attendanceTimeTabs"
    , "modules/leave/controllers/attendanceTimeList"
    , "modules/leave/controllers/attendanceTimeListEdit"
    , "modules/leave/controllers/attendanceTimeListOwn"
    //服务
    , "modules/leave/services/attendanceTime"
    //服务
    , "modules/leave/services/leave"
    , 'angular/angular-resource'

], function(angular, addCtrl, editCtrl, listOwnCtrl,listEmpCtrl,listCtrl,leaveListEditCtrl,leaveTabsCtrl, removeCtrl,attendanceTimeTabsCtrl, attendanceTimeListCtrl,attendanceTimeListEditCtrl,attendanceTimeListOwnCtrl,//addNewEmployeeCtrl,
            //addCtrl,
            attendanceTimeListServ,leaveService){
    'use strict';

    var leaveModule = angular.module('leaveModule', ['ngResource']);

    leaveModule.controller('leaveAddCtrl', addCtrl);
    leaveModule.controller('leaveEditCtrl', editCtrl);
    leaveModule.controller('leaveListOwnCtrl', listOwnCtrl);
    leaveModule.controller('leaveListEmpCtrl', listEmpCtrl);
    leaveModule.controller('leaveListCtrl', listCtrl);
    leaveModule.controller('leaveListEditCtrl', leaveListEditCtrl);
    leaveModule.controller('leaveTabs', leaveTabsCtrl);
    leaveModule.controller('leaveRemoveCtrl', removeCtrl);

    leaveModule.controller('attendanceTimeTabs', attendanceTimeTabsCtrl);
    leaveModule.controller('attendanceTimeList', attendanceTimeListCtrl);
    leaveModule.controller('attendanceTimeListEdit', attendanceTimeListEditCtrl);
    leaveModule.controller('attendanceTimeListOwn', attendanceTimeListOwnCtrl);
//    deptModule.controller('addNewEmployee', addNewEmployeeCtrl);
    //deptModule.controller('add', addCtrl);

    leaveModule.factory('attendanceTime', attendanceTimeListServ);
    leaveModule.factory('leave', leaveService);

    return leaveModule;
});
