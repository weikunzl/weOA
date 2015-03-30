/**
 * Created by pippo on 14-10-22.
 * 新增请假
 */

define(function(){
    'use strict';

    return ['$scope', '$modal', '$q', 'auth', 'evection',  'action',  'saveTooltip'
        , function($scope, $modal, $q, Auth, evection, Action, SaveTooltip){
            if(!Auth.isLogined()){ return;};
            //初始化参数
            $scope.htmlTitle = "新增出差";

            $scope.formTempData ={
                beginTime: new Date().format('Y-m-d')
                , endTime:new Date().format('Y-m-d')
            };
            $scope.getDay = function getDay(){
                if($scope.formTempData.beginTime==$scope.formTempData.endTime){
                    $scope.formTempData.day = 1;
                    return ;
                }
                var long = Date.parseDate( $scope.formTempData.endTime,'Y-m-d')-Date.parseDate( $scope.formTempData.beginTime,'Y-m-d')
                if(long>0){
                    $scope.formTempData.day = long/1000/3600/24;
                }else{
                    $scope.formTempData.day = 0;
                    $scope.formTempData.beginTime =  $scope.formTempData.endTime;
                }

            }
            $scope.getDay()

            $scope.formData = { beginTime: new Date().format('Y-m-d'), endTime:new Date().format('Y-m-d'),reason:"",statusId:0};

            $scope.getDuration = function getDuration(){
                $scope.formData.duration = $scope.formTempData.day
            }
            $scope.getDuration()
            //保存数据
            $scope.saveData = function saveData(){
                $scope.formData.employeeId= parseInt(localStorage.employeeId);

                evection.evectionAdd($scope.formData).
                    success(function (response) {
                    if (response.status) {
                        SaveTooltip.showSaveTooltip(response);
                        Action.forward('evectionTabs', 'evection', {seeSelf: 1})
                    } else {
                        SaveTooltip.showSaveTooltip(response);
                    }
                }).error(function(response,status){

                    SaveTooltip.showSaveTooltip(response,status);
                });

            }

        }];
});