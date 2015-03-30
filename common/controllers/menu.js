/**
 * Created with JetBrains WebStorm.
 * User: @kazaff
 * Date: 13-9-10
 * Time: 上午10:28
 */
define([
    'jquery/nprogress'
], function(NProgress){
    'use strict';

    var initialize = function(module ,routeRules){

        //主菜单
        module.controller('menuCtrl', ['$scope', 'action', 'auth', '$window', '$modal', '$q', '$location','$http','saveTooltip', function($scope, Action, Auth, $window, $modal, $q, $location,$http,SaveTooltip){
            var data = Action.data
            var b = parseInt(localStorage.positionId)
            var c;

            /*
            //local storage监听事件
            var Storage;
            var se = document.createEvent("StorageEvent");
            se.initStorageEvent('storage', false, false);
            window.dispatchEvent(se);
            window.addEventListener("storage",function(e){
             window.localStorage.employeeId = "";
             window.localStorage.positionId = "";
             window.localStorage.employeeName = "";
             window.localStorage.deptId = "";
                window.location.href = window.config.host+"login.html"  ;
            },false);
            */

            $(".quit").click(function(){
                window.localStorage.employeeId ='';
                window.localStorage.positionId = '';
                window.localStorage.code ='';
                window.localStorage.employeeName = '';
                window.localStorage.deptId ='';
                window.localStorage.positionName = '';
                window.localStorage.authViewList = '';
                window.location.href = window.config.host+'login.html';
            });


            c=window.localStorage.positionName

            $scope.User="欢迎使用，"+c+"__"+localStorage.employeeName+" !";
//
                //把组下包含的uri抽出来，用于方便sidebar-menu指令验证当前组
                angular.forEach(data, function(item, key){

                    data[key].sonUris = [];
                    angular.forEach(item.son, function(route){
                        data[key].sonUris.push(route.uri);
                    });
                });

                $scope.menu = data;
            var modalPromise = $modal({
                template: 'logout.html'
                , persist: true
                , show: false
                , backdrop: 'static'
                , scope: $scope
            });
            var modal = $q.when(modalPromise);

            //用于触发 退出系统的模态窗口
            $scope.modalWin = function(){
                modal.then(function(modalEl){
                    modalEl.modal('show');
                });
            };

            $scope.logout = function(){
                //清除用户信息

                window.localStorage.employeeId ='';
                window.localStorage.positionId = '';
                window.localStorage.code ='';
                window.localStorage.employeeName = '';
                window.localStorage.deptId ='';
                window.localStorage.positionName = '';
                window.localStorage.authViewList = '';
                //跳转到登录页
                $window.location.href = config.host + 'login.html';
            };

            $scope.openStatus = 1;
            $scope.expansion = function(){
                $scope.openStatus = - $scope.openStatus;
            };

            //路由事件
            $scope.$on("$routeChangeStart", function(angularEvent, next){
                NProgress.start();

                if(angular.isUndefined(next.$$route)){
                    return ;
                }

                //更新面包屑数据
                var breadCrumbs = [];
                var flag = false;
                angular.forEach(Action.data, function(group){

                    angular.forEach(group.son, function(page){
                        if(next.$$route.controller === page.controller){    //确定要去的页面是哪个

                            if(page.ifMenu){    //如果要去的页面是导航中的页面，则需要重新初始化面包屑数据
                                breadCrumbs.push({"name": group.title, "group": group.group, "uri": ""});
                                breadCrumbs.push({"name": page.title, "group": group.group, "uri": $location.path()});
                            }else{  //否则根据情况更新面包屑

                                //获取当前的面包屑数据
                                if(!angular.isUndefined(window.localStorage.breadCrumbs)){
                                    breadCrumbs = JSON.parse(window.localStorage.breadCrumbs);
                                }

                                //检查当前面包屑中是否已包含要去的页面
                                var isOwn = false;
                                angular.forEach(breadCrumbs, function(item){
                                    if(item.uri === $location.path()){
                                        isOwn = true;
                                        return false;
                                    }
                                });

                                //如果没有包含，则添加
                                if(!isOwn){
                                    breadCrumbs.push({"name": page.title, "group": group.group, "uri": $location.path()});
                                }
                            }

                            flag = true;
                            return false;
                        }
                    });

                    if(flag){
                        return false;
                    }
                });

                window.localStorage.breadCrumbs = JSON.stringify(breadCrumbs);
            });

            $scope.$on("$routeChangeSuccess", function(){
                NProgress.done();
            });

            $scope.editUserInfo = function(){
                $.ajax({ url:config.domain + 'employee/userInfoOwn' ,async : false,context: document.body, success: function(response){
                    if(response.status){
                        if(response.item){
                            $scope.userInfo = response.item
                            $scope.userInfo.password = null;
                            $scope.userInfo.newPassword = null;
//                            $scope.userInfo.email = ($scope.userInfo.email==''||!$scope.userInfo.email)?null:$scope.userInfo.email;
                        }
//                        tempData = response.items;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                    SaveTooltip.showSaveTooltip(response,response.status);
                }});

                var modalPromise = $modal({
                    template: 'editUserInfo.html'
                    , persist: true
                    , show: false
                    , backdrop: 'static'
                    , scope: $scope
                });

                $scope.modal = $q.when(modalPromise);
                $scope.modal.then(function(modalEl){
                    modalEl.modal('show');
                });
            }
            $scope.setPassword = function(){
                $scope.errorTip = null;
//                String phone;//电话
//                String location;//住址
//                String email;//email
//                String passWord;//原密码
//                String newPassWord;//新密码
                var dataPwd = {
                    phone:$scope.userInfo.phone,
                    location:$scope.userInfo.location,
                    email:$scope.userInfo.email,
                    password:$scope.userInfo.password,
                    newPassword:$scope.userInfo.newPassword
                }
                $http.put(config.domain + 'employee/userInfo',dataPwd).success(function(response){
//                    alert(response);
                    if(response.status){
                        $scope.modal.then(function(modalEl){
                            modalEl.modal('hide');
                        });
                        $scope.userInfo = null;
                        $scope.newPasswordRe = null;
                    }
                    SaveTooltip.showSaveTooltip(response);
                    if(!response.status){
//                        $scope.userInfoEditForm.$error.password = true;
                        $scope.errorTip = response.message;
                    }

                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status);
//
                });
            }
        }]);

        return module;
    };

    return {
        initialize: initialize
    };
});