/**
 * Created by pippo on 14-10-22.
 * 请假列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'evection', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, evection, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;};
            //权限验证
//            Auth()
            var authViewList = config.authViewList;
            var authParentIndex = config.menuList.indexOf('modules/evection')
            var moduleList = ['add','listTabs','list','listOwn','listEmp','evectionEdit','evectionEdit2']
                for(var i=0;i<authViewList.authDir.length;i++){
                    if(Math.floor(authViewList.authDir[i]/1000)==(authParentIndex+1)){
                        $scope[moduleList[parseInt(authViewList.authDir[i]%1000)-1]] = true;
                    }
                }
            $scope.seeSelf = $routeParams.seeSelf;

            $scope.employeeId = parseInt(localStorage.employeeId)
            $scope.reload = function(tag){
                if(tag=='employeeList'){
                    $scope.$$childTail.$$childTail.loadGridData('employeeList')
                }else if(tag=='own'){
                    $scope.$$childTail.$$childTail.loadGridData('own')
                }else{
                    $scope.$$childTail.$$childTail.loadGridData()
                }
            }
        }];
});