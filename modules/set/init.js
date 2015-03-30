/**
 * Created by pippo on 14-10-27.
 * 设置模块初始化
 */


define([
    'angular/angular'
    //控制器
    , 'modules/set/controllers/leaveSet'
    , 'modules/set/controllers/attendanceTimeSet'
    , "modules/set/controllers/salarySet"
    , "modules/set/controllers/workOvertimeSet"
    , "modules/set/controllers/salaryPwdSet"
    , "modules/set/controllers/deptList"
    , "modules/set/controllers/positionSet"
    //服务
    , "modules/set/services/set"
    , "modules/set/services/dept"
    , 'angular/angular-resource'
], function(angular, leaveSetCtrl,attendanceTimeSetCtrl, salarySetCtrl, workOvertimeSetCtrl,salaryPwdSetCtrl,deptListCtrl,positionSetCtrl, setServ,deptServ){
    'use strict';

    var setModule = angular.module('setModule', ['ngResource']);

    setModule.controller('leaveSet', leaveSetCtrl);
    setModule.controller('attendanceTimeSet', attendanceTimeSetCtrl);
    setModule.controller('salarySet', salarySetCtrl);
    setModule.controller('salaryPwdSet', salaryPwdSetCtrl);
    setModule.controller('workOvertimeSet', workOvertimeSetCtrl);
    setModule.controller('deptList', deptListCtrl);
    setModule.controller('positionSet', positionSetCtrl);
    setModule.factory('set', setServ);
    setModule.factory('dept', deptServ);

    return setModule;
});
