/**
 * Created by pippo on 14-10-22.
 * 请假编辑
 */

define(function(){
    'use strict';

    return ['$scope', '$modal', '$q', '$timeout', '$routeParams', 'auth', 'evection', 'action', 'saveTooltip'
        , function($scope, $modal, $q, $timeout, $routeParams, Auth, evection,  Action, SaveTooltip){
            if(!Auth.isLogined()){ return;};

            $scope.htmlTitle = "编辑出差";
            $scope.formTempData ={
                beginTime: new Date().format('Y-m-d')
                , endTime:new Date().format('Y-m-d')
            };
            $scope.formData = {evectionId:"",  beginTime: new Date().format('Y-m-d'), endTime:new Date().format('Y-m-d'),reason:"",statusId:0};

            $scope.formData.evectionId =  $routeParams.id
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
            $scope.getDuration = function getDuration(){
                $scope.formData.duration =   $scope.formTempData.day*8
            }
            //加载数据
            $scope.getData = function getData(){
                evection.evectionEditData($scope.formData.evectionId).
                    //成功
                    success(function(response){
                        if(response.status){
                            $scope.formData.evectionId = response.item.evectionId;
                            $scope.formData.duration = response.item.duration;
                            $scope.formTempData.day=parseInt( $scope.formData.duration);
                            $scope.formTempData.beginTime=response.item.beginTime.substr(0,10);
                            $scope.formTempData.endTime=response.item.endTime.substr(0,10);
                            $scope.formData.reason = response.item.reason;
                            //$scope.formData.statusId = response.item.statusId;
//                            $scope.formData.typeId==3//调休

                            if(response.item.statusId==0){
                                $scope.formData.statusId=1
                            }
                            if(response.item.statusId==2){
                                $scope.formData.statusId=1
                            }
                            if(response.item.statusId==5){
                                $scope.formData.statusId=1
                            }
                            if(response.item.statusId==0||response.item.statusId==1){
                                $scope.remove=function(){
                                    return false
                                }
                            }
                            else{
                                $scope.remove=function(){
                                    return true
                                }
                            }
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



            //手动保存新增数据
            $scope.saveData = function saveData(){
                //判断是否可以保存
                    $scope.formData.employeeId=$scope.a;
                    $scope.send={
                                employeeId:$scope.formData.employeeId
                                ,beginTime:$scope.formData.beginTime
                                ,endTime:$scope.formData.endTime
                                ,duration:$scope.formData.duration
                                ,reason:$scope.formData.reason
                                ,evectionId:$scope.formData.evectionId
                                ,statusId:$scope.formData.statusId

                }
                    evection.evectionEdit($scope.send).
                        success(function(response){
                            SaveTooltip.showSaveTooltip(response);
                            if(response.status){
                                Action.forward('evectionTabs', 'evection',{seeSelf:1});
                            }
                        }).
                        error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status);
                        });

            }

        }];
});