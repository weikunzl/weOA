/**
 * Created by pippo on 14-10-27.
 * 设置模块初始化
 */


define([
    'angular/angular'
    //控制器

    , "modules/employee/controllers/employeeList"
    , "modules/employee/controllers/addEmployee"
    , "modules/employee/controllers/detailEmployee"
    , "modules/employee/controllers/addressBook"

    //服务
    , "modules/employee/services/employee"
    , 'angular/angular-resource'


], function(angular, employeeListCtrl,addEmployeeCtrl,detailEmployeeCtrl,addressBookCtrl,
            //addCtrl,
            employeeService){
    'use strict';
    var employeeModule = angular.module('employeeModule', ['ngResource']);
//console.log(employeeListCtrl)
    employeeModule.controller('employeeList', employeeListCtrl);
    employeeModule.controller('addEmployee', addEmployeeCtrl);
    employeeModule.controller('detailEmployee', detailEmployeeCtrl);
    employeeModule.controller('addressBook', addressBookCtrl);
    //employeeModule.controller('add', addCtrl);

    employeeModule.factory('employee', employeeService);

    return employeeModule;
});
