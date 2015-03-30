/**
 * Created with JetBrains WebStorm.
 * User: @webber
 * Date: 14-10-18
 * Time: 上午9:43
 */
define([
    //服务
    'common/services/auth'
    , 'common/services/acl'
    , 'common/services/action'

    , 'common/services/save-tooltip'
    , 'common/services/data-business'
    //指令
    , 'common/directives/sidebar-menu'
    , 'common/directives/action'
    , 'common/directives/select2'
    , 'common/directives/bread-crumbs'
    , 'common/directives/blur'
    //控制器
    , 'common/controllers/menu'
], function(auth, acl, actionS,saveTooltip,dataBusiness,siderbarMenu,actionD,select2, breadCrumbs, blur, menu){
    'use strict';

    var initialize = function(module, routeRules){

        //初始化服务
        auth.initialize(module, routeRules);
        acl.initialize(module, routeRules);
        actionS.initialize(module, routeRules);

        saveTooltip.initialize(module);
        dataBusiness.initialize(module);

        //初始化指令
        siderbarMenu.initialize(module);
        breadCrumbs.initialize(module);
        blur.initialize(module);
        actionD.initialize(module);
        select2.initialize(module);

        //初始化控制器
        menu.initialize(module);

        return module;
    }

    return {
        initialize: initialize
    };
});