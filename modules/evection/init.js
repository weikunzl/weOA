/**
 * Created by pippo on 14-10-27.
 * 请假模块初始化
 */

define([
    'angular/angular'
    //控制器
    , 'modules/evection/controllers/add'
    , "modules/evection/controllers/edit"
    , "modules/evection/controllers/evectionListOwn"
    , "modules/evection/controllers/evectionListEmp"
    , "modules/evection/controllers/evectionList"
    , "modules/evection/controllers/evectionListEdit"
    , "modules/evection/controllers/evectionTabs"
    , "modules/evection/controllers/remove"
    //服务
    , "modules/evection/services/evection"
    , 'angular/angular-resource'

], function(angular, addCtrl, editCtrl, listOwnCtrl,listEmpCtrl,listCtrl,evectionListEditCtrl,evectionTabsCtrl, removeCtrl,evectionService){
    'use strict';

    var evectionModule = angular.module('evectionModule', ['ngResource']);

    evectionModule.controller('evectionAddCtrl', addCtrl);
    evectionModule.controller('evectionEditCtrl', editCtrl);
    evectionModule.controller('evectionListOwnCtrl', listOwnCtrl);
    evectionModule.controller('evectionListEmpCtrl', listEmpCtrl);
    evectionModule.controller('evectionListCtrl', listCtrl);
    evectionModule.controller('evectionListEditCtrl', evectionListEditCtrl);
    evectionModule.controller('evectionTabs', evectionTabsCtrl);
    evectionModule.controller('evectionRemoveCtrl', removeCtrl);
//    deptModule.controller('addNewEmployee', addNewEmployeeCtrl);
    //deptModule.controller('add', addCtrl);
    evectionModule.factory('evection', evectionService);

    return evectionModule;
});
