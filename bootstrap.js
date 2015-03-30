'use strict';

require.config({
    baseUrl: '.'
    , paths: {
        'angular': 'lib/angularJS'
        , 'jquery' : 'lib/jquery'
    }
    , waitSeconds: 200
    , shim: {
        'lib/bootstrap': ['jquery/jquery']
        , 'jquery/jquery.gritter.min': ['jquery/jquery']
        , 'jquery/backToTop': ['jquery/jquery']
        , 'jquery/nprogress': ['jquery/jquery']
        , 'lib/jsTree/jstree.min': ['jquery/jquery']
        , 'jquery/jquery.confirm.min': ['jquery/jquery','lib/bootstrap']
        ,  'jquery/jquery.printArea': ['jquery/jquery','lib/bootstrap']
        ,  'lib/matrix/matrix': ['jquery/jquery','lib/bootstrap']
        ,  'lib/matrix/moment.min': ['jquery/jquery','lib/bootstrap']
        ,  'lib/matrix/fullcalendar.min': ['jquery/jquery','lib/bootstrap','lib/matrix/moment.min']
        , 'angular/angular-resource': ['angular/angular']
        , 'angular/angular-route': ['angular/angular']
        , 'angular/angular-animate': ['angular/angular']
        , "angular/angular-sanitize.min": ["angular/angular"]
        , 'angular/angular-strap': ['angular/angular', 'lib/bootstrap']
        , 'lib/ng-grid-2.0.12/ng-grid.min': ['jquery/jquery','angular/angular', 'lib/bootstrap']
        ,  'angular/select/select2': ['jquery/jquery']
        ,  'angular/select/select2_locale_zh-CN': ['jquery/jquery','angular/select/select2']
        , 'angular/bootstrap-datepicker': ['angular/angular-strap']
        , 'angular/bootstrap-datepicker.zh-CN': ['angular/bootstrap-datepicker']
        , "angular/angular-moment.min": ["angular/angular", "lib/moment/lang/zh-cn"]
        , "lib/moment/lang/zh-cn": ["lib/moment/moment.min"]
        , 'jquery/bootstrap-switch.min': ['jquery/jquery', 'lib/bootstrap']
        , 'angular/angular-nestedSortable': ['angular/angular']
        , 'angular/angular': {
            exports: 'angular'
            , deps: ['jquery/jquery',"lib/socket.io/socket.io.min"]
        }
        , 'lib/console-min': {
            exports: 'console'
        }
    }
});

require([
    'require'

    , 'utils/loader'
    , 'jquery/jquery'
    , 'angular/angular'

    , 'config'

    , 'lib/modernizr'
    , 'lib/bootstrap'

    , 'jquery/jquery.gritter.min'
    , 'jquery/backToTop'
    , 'jquery/nprogress'
    , 'angular/angular-nestedSortable'

    //公共代码
    , 'app'
    , 'common/services/auth'
    , 'common/services/acl'
    , 'common/services/action'
    , 'common/services/message'
    , 'common/services/data-business'
    , 'common/services/save-tooltip'

    , 'common/directives/sidebar-menu'
    , 'common/directives/action'
    , 'common/directives/select2'
    , 'common/directives/bread-crumbs'
    , 'common/directives/blur'
    , 'common/controllers/menu'
    , 'common/init'
    //业务代码
    , 'modules/publish/controllers/dashboard'
    , 'modules/publish/controllers/history'
    , 'modules/publish/controllers/message-info'
    , 'modules/publish/controllers/messages'
    , 'modules/publish/init'
    , 'modules/publish/route'

    , 'modules/leave/controllers/add'
    , 'modules/leave/controllers/edit'
    , "modules/leave/controllers/leaveListOwn"
    , "modules/leave/controllers/leaveListEmp"
    , "modules/leave/controllers/leaveList"
    , "modules/leave/controllers/leaveListEdit"
    , "modules/leave/controllers/leaveTabs"
    , 'modules/leave/controllers/remove'
    , 'modules/leave/init'
    , 'modules/leave/route'
    , 'modules/leave/services/leave'

    , 'modules/workOvertime/controllers/add'
    , 'modules/workOvertime/controllers/edit'
    , "modules/workOvertime/controllers/workOvertimeTabs"
    , "modules/workOvertime/controllers/workOvertimeListOwn"
    , "modules/workOvertime/controllers/workOvertimeListEmp"
    , "modules/workOvertime/controllers/workOvertimeList"
    , 'modules/workOvertime/init'
    , 'modules/workOvertime/route'
    , 'modules/workOvertime/services/workOvertime'

    , "modules/leave/controllers/attendanceTimeTabs"
    , "modules/leave/controllers/attendanceTimeList"
    , "modules/leave/controllers/attendanceTimeListEdit"
    , "modules/leave/controllers/attendanceTimeListOwn"
    , 'modules/leave/services/attendanceTime'

    , 'modules/set/controllers/leaveSet'
    , 'modules/set/controllers/attendanceTimeSet'
    , 'modules/set/controllers/salarySet'
    , "modules/set/controllers/salaryPwdSet"
    , 'modules/set/controllers/workOvertimeSet'
    , 'modules/set/controllers/deptList'
    , 'modules/set/controllers/positionSet'
    , 'modules/set/init'
    , 'modules/set/route'
    , 'modules/set/services/set'
    , 'modules/set/services/dept'


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
    , 'modules/evection/init'
    , 'modules/evection/route'
//    , 'modules/higher/controllers/sethigher'
//    , 'modules/higher/init'
//    , 'modules/higher/route'
//    , 'modules/higher/services/higher'

    , 'modules/pay/controllers/payList'
    , 'modules/pay/controllers/add'
    , 'modules/pay/init'
    , 'modules/pay/route'
    , 'modules/pay/services/pay'


    , "modules/employee/controllers/employeeList"
    , "modules/employee/controllers/addEmployee"
    , "modules/employee/controllers/detailEmployee"
    , "modules/employee/controllers/addressBook"
    , 'modules/employee/init'
    , 'modules/employee/route'
    , 'modules/employee/services/employee'


    ,'lib/ng-grid-2.0.12/ng-grid.min'
    ,'lib/jsTree/jstree.min'
    ,'jquery/jquery.confirm.min'
    , 'utils/DateUtil'
    , 'utils/WeiUtil'
    , 'lib/matrix/fullcalendar.min'
    , 'lib/matrix/moment.min'
    , 'lib/matrix/matrix'
    , 'jquery/jquery.printArea'
    , 'angular/select/select2'
    , 'angular/select/select2_locale_zh-CN'
], function(require, loader, jquery, angular, config){

    if(!window.JSON){
        require(['lib/json2']);
    }

    if(!Function.prototype.bind){
        require(['lib/es5-shim']);
    }

    //角色过滤
    var deps = ['app'].concat(loader.loadRouteRules(config.modules), loader.loadModules(config.modules));
    require(deps, function(){

        //由于每个合法的模块都会包含init.js和route.js，所以这两类文件的个数应该是相等的
        var routes = [];
        for(var index = 1, max = (arguments.length - 1) / 2; index <= max; index++){
            routes.push(arguments[index]);
        }

        var modules = [];
        for(var index = (arguments.length - 1) / 2 + 1, max = arguments.length; index < max; index++ ){
            if(typeof(arguments[index]) == 'undefined'){
                throw new Error('欲加载的模块配置文件不符合AMD语法');
            }

            modules.push(arguments[index]);
        }

        var mainModule = arguments[0].initialize(modules, routes);

        angular.bootstrap(window.document, [mainModule.name]);
    });
});