/**
 * Created by pippo on 14-10-22.
 * 薪资列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'attendanceTime', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, attendanceTime, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;}

            $scope.isNormalEmployee = (localStorage.positionId == config.systemArguments.roleNormalEmployeeId);
            var authViewList = config.authViewList;
            var authParentIndex = config.menuList.indexOf('modules/leave')
            var moduleList = ['add','listTabs','list','listOwn','listEmp','leaveEdit','leaveEdit2','attendanceTimeTab','attendanceTimeList'
                ,'attendanceTimeListOwn','attendanceTimeListEdit']
            for(var i=0;i<authViewList.authDir.length;i++){
                if(Math.floor(authViewList.authDir[i]/1000)==(authParentIndex+1)){
                    $scope[moduleList[parseInt(authViewList.authDir[i]%1000)-1]] = true;
                }
            }
            $scope.reload = function(tag){
                if(tag=='employeeList'){
                    $scope.$$childTail.$$childTail.loadGridData()
                }else if(tag=='own'){
                    $scope.$$childHead.$$childTail.loadGridData('own')
                }
            }
        }];
});
