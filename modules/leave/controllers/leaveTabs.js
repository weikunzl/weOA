/**
 * Created by pippo on 14-10-22.
 * 请假列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'leave', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Leave, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;};
            //权限验证
//            Auth()
            var authViewList = config.authViewList;
            var authParentIndex = config.menuList.indexOf('modules/leave')
            var moduleList = ['add','listTabs','list','listOwn','listEmp','leaveEdit','leaveEdit2','attendanceTimeTab','attendanceTimeList'
                ,'attendanceTimeListOwn','attendanceTimeListEdit']
                for(var i=0;i<authViewList.authDir.length;i++){
                    if(Math.floor(authViewList.authDir[i]/1000)==(authParentIndex+1)){
                        $scope[moduleList[parseInt(authViewList.authDir[i]%1000)-1]] = true;
                    }
                }
//            $scope.listOwn = false
//            $scope.listOwn = config.authViewList;
            $scope.seeSelf = $routeParams.seeSelf;
            //获取请假类型
            $scope.leaveTypes=  Leave.leaveType();

            $scope.employeeId = parseInt(localStorage.employeeId)
            //判断用户类型改变视图
            $scope.positionId = parseInt(localStorage.positionId)

            $scope.reload = function(tag){
                if(tag=='employeeList'){
                    $scope.$broadcast("employeeList",'employeeList');
                }else if(tag=='own'){
                    $scope.$broadcast("ownList",'own');
                }else{
                    $scope.$broadcast("list");
                }
            }

        }];
});