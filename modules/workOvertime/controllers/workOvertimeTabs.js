/**
 * Created by pippo on 14-10-22.
 * 加班列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'workOvertime', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, workOvertime, SaveTooltip,DataBusiness) {
            if(!Auth.isLogined()){ return;};
            $scope.seeSelf = $routeParams.seeSelf;
            $scope.employeeId = parseInt(localStorage.employeeId)
            //判断用户类型改变视图
            var authViewList = config.authViewList;
            var authParentIndex = config.menuList.indexOf('modules/workOvertime')
            var moduleList = ['add','edit','listTabs','listOwn','list','listEmp']
            for(var i=0;i<authViewList.authDir.length;i++){
                if(Math.floor(authViewList.authDir[i]/1000)==(authParentIndex+1)){
                    if(authViewList.authDir[i]%1000-1>=moduleList.length){
                        console.error('auth,error')
                        continue;
                    }
                    $scope[moduleList[parseInt(authViewList.authDir[i]%1000)-1]] = true;
                }
            }
            $scope.deptId = localStorage.deptId;

//            $scope.passTypeList=[
//                {type: '审批中', id: 0},
//                {type: '审批中', id: 1},
//                {type: '审批中', id: 2},
//                {type: '审批中', id: 3},
//                {type: '已通过', id: 4},
//                {type: '未通过', id: 5},
//                {type: '审批中', id: 6}
//            ]
            $scope.passTypeList = function passTypeList(statusId){
                if(statusId==4){
                    return "已通过";
                }else if(statusId==0){
                    return "新增" ;
                }else if(statusId==5){
                    return "未通过";
                }else{
                    return "审批中" ;
                }
            }
            $scope.passTypeList2 = function passTypeList2(statusId){
                if(statusId==4){
                    return "已通过";
                }else if(statusId==0){
                    return "新增" ;
                }else if(statusId==5){
                    return "已驳回";
                }else{
                    return "需审批" ;
                }
            }

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
