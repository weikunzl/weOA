/**
 * Created with JetBrains WebStorm.
 * User: @kazaff
 * Date: 13-9-4
 * Time: 上午9:54
 */
define([
    //标准库
     'angular/angular'
    , 'common/init'
    , 'angular/angular-resource'
    , 'angular/angular-route'
    , 'angular/angular-animate'
    , 'angular/angular-strap'
    , "angular/angular-sanitize.min"
    , "angular/angular-moment.min"
    ,'lib/ng-grid-2.0.12/ng-grid.min'

], function(angular, common){
    'use strict';

    var initialize = function(needModules, routeRules){

        var deps = ['ngResource', 'ngRoute', 'ngAnimate', '$strap.directives', 'ngSanitize', "angularMoment",'ngGrid'];
        for(var index in needModules){
            deps.push(needModules[index].name);
        }

        var mainModule = angular.module('publish', deps);
        if(!ngGrid.config){
            ngGrid.config = {i18n : 'zh-cn'};
        }

        mainModule.config(['$httpProvider', '$locationProvider', '$routeProvider', '$windowProvider', '$compileProvider', function($httpProvider, $locationProvider, $routeProvider, $windowProvider, $compileProvider){

            $locationProvider.html5Mode(false).hashPrefix('!');
            //解决跨域问题
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

            angular.forEach(routeRules, function(item){
                if(typeof(item) != 'undefined'){
                    angular.forEach(item.son, function(route){

//                        //子节点过滤
//                        if(window.localStorage.positionId){
//
//                        }
                        if(!angular.isUndefined(route.uri)){

                            $routeProvider.when(route.uri, {
                                templateUrl: route.templateUrl
                                , controller: route.controller
                            });
                        }
                    });
                }
            });

            //TODO 避免硬编码
            $routeProvider.otherwise({redirectTo:'/dashboard'});

            //TODO 为了兼容旧浏览器，需要增加其他浏览器端持久化token的方法
            if(window.localStorage.token){
                $httpProvider.defaults.headers.common['AUTH'] = 'MD ' + window.localStorage.token;
            }


            //响应拦截器，用于检查登录状态
//            $httpProvider.interceptors.push(['$q','$modal','$rootScope','$http', function($q,$modal,$rootScope,$http){
//                $rootScope.title="登陆超时"
//                var modalPromise = $modal({
//                    template: 'loginOvertime.html'
//                    , persist: true
//                    , show: false
//                    , backdrop: 'static'
//                    , scope: $rootScope
//                });
//                return {
//                    'response': function(response){
//                        if(response.status>300){
//                            if(response.status==401){
//                                //TODO 避免硬编码
//                                window.localStorage.employeeId ='';
//                                window.localStorage.positionId = '';
//                                window.localStorage.employeeName = '';
//                                window.localStorage.deptId = '';
//
////                    var modal = $q.when(modalPromise);
//                                modalPromise.then(function(modalEl){
//                                    modalEl.modal('show');
//                                });
//
//                                $rootScope.login = function(){
//                                    $rootScope.$$childTail.isLoading = true;
//                                    $http({
//                                        method: 'POST'
//                                        , url: config.domain + 'login'
//                                        , data: $rootScope.$$childTail.user
//                                    }).success(function(response){
//                                        $rootScope.$$childTail.isLoading = false;
//
//                                        if(response.status != false){
//                                            //持久化token
//
//                                            window.localStorage.employeeId =response.item.employeeId;
//                                            window.localStorage['positionId'] = response.item.positionId;
//                                            window.localStorage.employeeName = response.item.employeeName;
//                                            window.localStorage.deptId = response.item.deptId;
//                                            window.localStorage.roleName = response.item.roleName;
//                                            //跳转到仪表盘
//                                            $window.location.reload();
//                                        }else{
//                                            $rootScope.$$childTail.user.psw = null;
//                                            alert(response.message)
//
//
//                                        }
//                                    }).error(function(response,status){
//                                        alert(response.message)
//                                    });
//                                };
//                            }
//                            return;
//                        }
////                        //若返回的数据中指示该用户未登录，则触发跳转到登录页面
////                        if(!angular.isUndefined(response.data)){
////                            if(!angular.isUndefined(response.data.loginStatus) && response.data.loginStatus == 0){
////                                window.localStorage.token = 0;   //删除会话id
////                                $windowProvider.$get().location.href = config.webOS + 'login.html';
////                            }
////
////                            if(!angular.isUndefined(response.data.allow) && response.data.allow == 0){
////                                window.localStorage.token = 0;   //删除会话id
////                                $windowProvider.$get().location.href = config.webOS + 'login.html';
////                            }
////                        }
//                        return response || $q.when(response);
//                    }
//                };
//            }]);
        }]);

        //加载通用模块
        common.initialize(mainModule, routeRules);

        return mainModule;
    };

    return {
        initialize: initialize
    };
});