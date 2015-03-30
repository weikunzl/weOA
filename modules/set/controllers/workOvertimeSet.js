/**
 * Created by pippo on 14-10-22.
 * 加班设置
 */

define(function(){
    'use strict';

    return ['$scope', '$modal', '$q', '$timeout', '$routeParams', 'auth', 'set', 'action', 'saveTooltip'
        , function($scope, $modal, $q, $timeout, $routeParams, Auth, Set,  Action, SaveTooltip){
            if(!Auth.isLogined()){ return;};;
            $scope.formData = {beginTime: "", mealprice:""};
            $scope.c = parseInt(localStorage.positionId)

            //加载数据
            $scope.getData = function getData(){
                Set.workOvertimeSetData().
                    //成功
                    success(function(response){
                        if(response.status){
                            $scope.formData.beginTime = response.item.beginTime;
                            $scope.formData.mealprice = response.item.mealprice;
                            $scope.formData.workday = response.item.workday;
                            $scope.formData.dinnerTime = response.item.dinnerTime;
                        }else{
                            //提示框
                            SaveTooltip.showSaveTooltip(response);
                        }
                    }).
                    error(function(response,status){
                        //提示框
                        SaveTooltip.showSaveTooltip(response,status);
                    });
            }
            $scope.getData();


            //根据类型验证表单是否满足提交条件
            $scope.isOK = function isOK(){
                if(angular.isUndefined($scope.formData.mealprice)||$scope.formData.mealprice==""){
                    return false;
                }
                if(angular.isUndefined($scope.formData.beginTime)||$scope.formData.beginTime==""){
                    return false;
                }
                if(angular.isUndefined($scope.formData.workday)||$scope.formData.workday==""){
                    return false;
                }
                if(angular.isUndefined($scope.formData.dinnerTime)||$scope.formData.dinnerTime==""){
                    return false;
                }
                return true;
            };

            //新增数据
            $scope.saveData = function saveData(){
                $scope.formData.mealprice=parseInt($scope.formData.mealprice)
                $scope.formData.workday=parseInt($scope.formData.workday)
                $scope.formData.dinnerTime=parseFloat($scope.formData.dinnerTime)
                //判断是否可以保存
                if($scope.isOK()){
                    Set.workOvertimeSet($scope.formData).
                        success(function(response){
                            if(response.status){
                                SaveTooltip.showSaveTooltip(response);
                            }
                        }).
                        error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status);
                        });
                }
            }
        }];
});