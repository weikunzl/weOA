/**
 * Created with JetBrains WebStorm.
 * User: @kazaff
 * Date: 13-9-5
 * Time: 上午9:16
 */
define(function(){
    'use strict';

    var initialize = function(module){
        module.factory('auth', ['$window','$rootScope','$modal','$http', function($window,$rootScope,$modal,$http){
            $rootScope.title="登陆超时"
            var modalPromise = $modal({
                template: 'loginOvertime.html'
                , persist: true
                , show: false
                , backdrop: 'static'
                , scope: $rootScope
            });
            function isUndefined(str){
                if(!str||str=='null'||str=='undefined'||str==''){
                    return true;
                }else{
                    return false
                }
            }
            return {
                isLogined: function(){
                    //TODO 为了兼容旧浏览器，需要增加其他浏览器端持久化token的方法
                    if(isUndefined(window.localStorage.employeeId)||isUndefined(window.localStorage['positionId'])||isUndefined(window.localStorage.employeeName)||
                        isUndefined(window.localStorage.deptId)){
                        //TODO 避免硬编码

                        window.localStorage.employeeId ='';
                        window.localStorage.positionId = '';
                        window.localStorage.code ='';
                        window.localStorage.employeeName = '';
                        window.localStorage.deptId ='';
                        window.localStorage.deptName ='';
                        window.localStorage.positionName = '';
                        window.localStorage.authViewList = '';
                        this.overTimeLog();
                        return false;
                    }
                    return true;
                },
                overTimeLog : function(){
                    //TODO 避免硬编码
                    window.localStorage.employeeId ='';
                    window.localStorage.positionId = '';
                    window.localStorage.code ='';
                    window.localStorage.employeeName = '';
                    window.localStorage.deptId ='';
                    window.localStorage.deptName ='';
                    window.localStorage.positionName = '';
                    window.localStorage.authViewList = '';
//                    var modal = $q.when(modalPromise);
                    modalPromise.then(function(modalEl){
                        modalEl.modal('show');
                    });

                    $rootScope.login = function(){
                        $rootScope.$$childTail.isLoading = true;
                        $http({
                            method: 'POST'
                            , url: config.domain + 'login'
                            , data: $rootScope.$$childTail.user
                        }).success(function(response){
                            $rootScope.$$childTail.isLoading = false;

                            if(response.status != false){
                                //持久化token

                                window.localStorage.employeeId =response.item.employeeId;
                                window.localStorage.positionId = response.item.positionId;
                                window.localStorage.code = response.item.code;
                                window.localStorage.employeeName = response.item.employeeName;
                                window.localStorage.deptId = response.item.deptId;
                                window.localStorage.deptName = response.item.deptName;
                                window.localStorage.positionName = response.item.positionName;
								window.localStorage.authViewList = '{root:[1,2,3,4,5,6],authDir:[1001,1002,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,3001,3002,3003,3004,3005,3006,4001,4002,4003,4004,4005,4006,4007,5001,5002,5003,6001,6002,6003],authField:[5001002,5001001,5002002,5002001,5001003,6003001,6003002,6002001,4007001,4007002,4007003]}'//response.item.authViewList;
                    
                                //window.localStorage.authViewList =  WeiUtil.objConvertStr(response.item.authViewList);
                                //跳转到仪表盘
                                $window.location.reload();
                            }else{
                                $rootScope.$$childTail.user.password = null;
                                alert(response.message)


                            }
                        }).error(function(response,status){
                            alert(response.message)
                        });
                    };

//
//                , userInfo: function(user){
//                    if(angular.isUndefined(user)){
//                        return {
//                            id: window.localStorage.employeeId
//                            ,account: window.localStorageAccount
//                            , name: window.localStorage.employeeName
//                            , idCard: window.localStorage.employeeIdCard
//                            , sex: window.localStorageSex
//                            , type: window.localStorage.positionId
//                            , email: window.localStorageEmail
//                            , qq: window.localStorageQq
//                            , phone: window.localStoragePhone
//                            , mobile: window.localStorageMobile
//                            , info: window.localStorageInfo
//                            , photo: window.localStoragePhoto
//                        };
//                    }else{
//                        window.localStorage.employeeId = user.id || 0;
//                        window.localStorageAccount = user.account || '';
//                        window.localStorage.employeeName = user.name || '';
//                        window.localStorage.employeeIdCard = user.idCard || '';
//                        window.localStorageSex = user.sex || -1;
//                        window.localStorage.positionId = user.type || '';
//                        window.localStorageEmail = user.email || '';
//                        window.localStorageQq = user.qq || '';
//                        window.localStoragePhone = user.phone || '';
//                        window.localStorageMobile = user.mobile || '';
//                        window.localStorageInfo = user.info || '';
//                        window.localStoragePhoto = user.photo || './img/default-face.png';
//                    }
//                }

                }
            }
        }]);

        return module;
    };

    return {
        initialize: initialize
    };
});