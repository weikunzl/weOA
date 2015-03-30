/**
 * Created by pippo on 14-10-27.
 * 加班模块初始化
 */

define([
    'angular/angular'
    //控制器
    , 'modules/workOvertime/controllers/add'
    , "modules/workOvertime/controllers/edit"
    , "modules/workOvertime/controllers/workOvertimeTabs"
    , "modules/workOvertime/controllers/workOvertimeListOwn"
    , "modules/workOvertime/controllers/workOvertimeListEmp"
    , "modules/workOvertime/controllers/workOvertimeList"
    //服务
    , "modules/workOvertime/services/workOvertime"
    , 'angular/angular-resource'
], function(angular, addCtrl, editCtrl, workOvertimeTabsCtrl, workOvertimeListOwnCtrl, workOvertimeListEmpCtrl, listCtrl,workOvertimeService){
    'use strict';

    var workOvertimeModule = angular.module('workOvertimeModule', ['ngResource']);

    workOvertimeModule.controller('workOvertimeAddCtrl', addCtrl);
    workOvertimeModule.controller('workOvertimeEditCtrl', editCtrl);
    workOvertimeModule.controller('workOvertimeTabsCtrl', workOvertimeTabsCtrl);
    workOvertimeModule.controller('workOvertimeListOwnCtrl', workOvertimeListOwnCtrl);
    workOvertimeModule.controller('workOvertimeListEmpCtrl', workOvertimeListEmpCtrl);
    workOvertimeModule.controller('workOvertimeListCtrl', listCtrl);
    workOvertimeModule.factory('workOvertime', workOvertimeService);

    return workOvertimeModule;
});
