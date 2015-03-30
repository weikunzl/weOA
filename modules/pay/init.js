/**
 * Created by pippo on 14-10-27.
 * 设置模块初始化
 */


define([
    'angular/angular'
    //控制器

    , "modules/pay/controllers/payList"
    , "modules/pay/controllers/add"
    , "modules/pay/controllers/salaryAdjustment"

    //服务
    , "modules/pay/services/pay"
    , 'angular/angular-resource'
], function(angular, payListCtrl, addCtrl,salaryAdjustmentCtrl ,payServ){
    'use strict';

    var payModule = angular.module('payModule', ['ngResource']);

    payModule.controller('payList', payListCtrl);
    payModule.controller('add', addCtrl);
    payModule.controller('salaryAdjustment', salaryAdjustmentCtrl);

    payModule.factory('pay', payServ);

    return payModule;
});
