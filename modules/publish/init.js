/**
 * Created with JetBrains WebStorm.
 * User: @kazaff
 * Date: 13-9-4
 * Time: 下午4:22
 */
define([
    'angular/angular'
    //控制器
    , 'modules/publish/controllers/dashboard'
    , "modules/publish/controllers/message-info"
    , "modules/publish/controllers/messages"
    , "modules/publish/controllers/history"

    //服务
//    , "modules/publish/services/MainIndexSer",
    , 'angular/angular-resource'
], function(angular, dashboardCtrl, messageInfoCtrl, messagesCtrl, historyCtrl){
    'use strict';

    var publishModule = angular.module('publishModule', ['ngResource', 'ui.nestedSortable']);

    publishModule.controller('dashboardCtrl', dashboardCtrl);
	publishModule.controller('messageInfoCtrl', messageInfoCtrl);
    publishModule.controller('messagesCtrl', messagesCtrl);
    publishModule.controller('messageHistoryCtrl', historyCtrl);

//    publishModule.factory('mainIndexSer', MainIndexSer);
    return publishModule;
});