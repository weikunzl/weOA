/**
 * Created by pippo on 14-10-22.
 * 加班编辑
 */

define(function(){
    'use strict';

    return ['$scope', '$modal', '$q', '$timeout', '$routeParams', 'auth', 'workOvertime', 'action', 'saveTooltip'
        , function($scope, $modal, $q, $timeout, $routeParams, Auth, workOvertime,  Action, SaveTooltip){
            if(!Auth.isLogined()){ return;};

            $scope.htmlTitle = "编辑请假";
            var vm = $scope.vm = {};
            $scope.formData = {duration:2,employeeId:"", beginTime:new Date().format("Y-m-dbH:00"), endTime:new Date().format("Y-m-dbH:00"),reason:"",statusId:0};
            $scope.formData.extraWorkId =  $routeParams.id
            var endHour=0;
            $scope.getDuration = function getDuration(){
                var endTime = $scope.formData.endTime;
                var beginTime = $scope.formData.beginTime;
                if(endTime<beginTime){

                    $scope.formData.duration = 0;
//                    SaveTooltip.showSaveTooltip({message:'时间不合法'});
                    $scope.formData.beginTime = $scope.formData.endTime;
                    return;
                }
                var day = (Date.parseDate(endTime.substring(0,10),'Y-m-d')-Date.parseDate(beginTime.substring(0,10),'Y-m-d'))/1000/3600/24;//几天

                var beginHour = (Date.parseDate(beginTime.substring(0,16),'Y-m-dbH:i')-Date.parseDate(beginTime.substring(0,10),'Y-m-d'))/1000/3600//几点
                endHour = (Date.parseDate(endTime.substring(0,16),'Y-m-dbH:i')-Date.parseDate(endTime.substring(0,10),'Y-m-d'))/1000/3600//几点
                var tempHour = 0;
                if(endHour<beginHour){
                    tempHour =(parseInt(day)-1)*8+(24-parseFloat(beginHour)+parseFloat(endHour));
                }else{
                    tempHour =(parseInt(day))*8+(parseFloat(endHour)-parseFloat(beginHour));
                }
                if(beginHour<config.systemArguments.noonRestTime&&endHour>config.systemArguments.afternoonWorkTime){
                    tempHour = tempHour-config.systemArguments.noonRestHour;
                }
                if(tempHour<0){
                    $scope.formData.duration = 0;
                    $scope.tip=""
                }else if(tempHour>8){
                    $scope.formData.duration = 0;
                    $scope.tip='加班不能超过8小时';
                }else{
                    $scope.formData.duration = (Math.floor(4*tempHour.toFixed(2))/4).toFixed(2);
                    $scope.tip=""
                }

            }
//            $scope.formData.duration = $scope.getDuration();

            $scope.a = parseInt(localStorage.employeeId)
            //加载数据
            $scope.getData = function getData(){
                workOvertime.workOvertimeEditData($scope.formData.extraWorkId).
                    //成功
                    success(function(response){
                        if(response.status){
                            $scope.formData.extraWorkId = response.item.extraWorkId;
                            $scope.formData.duration = response.item.duration;
                            $scope.formData.endTime = response.item.endTime.substring(0,10)+'T'+response.item.endTime.substring(11,16);
                            $scope.formData.beginTime = response.item.beginTime.substring(0,10)+'T'+response.item.beginTime.substring(11,16);
//                            $scope.formData.beginTime=$scope.formData.beginTime.substr(0,10)+"T"+$scope.formData.beginTime.substr(11,5)
//                            if($scope.formData.beginTime!=""){
//                                $scope.formData.endTime=response.item.endTime.substr(0,10)+"T"+response.item.endTime.substr(11,5)
//                            }
//                            if(angular.isUndefined($scope.formData.beginTime)){
//                                $scope.formData.endTime=""
//                            }
                            $scope.formData.reason = response.item.reason;
                            $scope.formData.statusId = 1;
                            $scope.formData.dinner = response.item.dinner;
                            $scope.formData.isSalary = response.item.isSalary;
                            $scope.formData.isWeekend = response.item.isWeekend;
//                            if($scope.formData.dinner==1){
//                                $scope.formData.dinner=true
//                            }
//                            if($scope.formData.dinner==0){
//                                $scope.formData.dinner=false
//                            }
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
                if(angular.isUndefined($scope.formData.duration)||$scope.formData.duration==""){
                    return false;
                }
                if(angular.isUndefined($scope.formData.beginTime)||$scope.formData.beginTime==""){
                    return false;
                }
                if(angular.isUndefined($scope.formData.endTime)||$scope.formData.endTime==""){
                    return false;
                }
                if(angular.isUndefined($scope.formData.reason)||$scope.formData.reason==""){
                    return false;
                }
                if($scope.formData.duration>8){
                    return false;
                }
                return true;
            };
            function getMinuteCode(str){
                return str=='30'?0.5:0
            }
            //手动保存新增数据
            $scope.saveData = function saveData(){
                $scope.getDuration();
                //判断是否可以保存
                if($scope.isOK()){
                    if(parseInt($scope.formData.duration)>=10){
                        $scope.tip="加班时长不超过10小时"
                    }
                    else{
                        $scope.formData.employeeId=localStorage.employeeId;
                        //超过十点
                        $scope.formData.isWeekend = parseInt($scope.formData.endTime.substr(11,2))+getMinuteCode($scope.formData.endTime.substr(14,2))>=config.systemArguments.extOverRestTime?1:0//超过几点

                        if($scope.formData.isSalary==0){
                            $scope.formData.dinner=0
                        }
                        $scope.formData.beginTime=$scope.formData.beginTime.replace('T',' ')+":00"
                            $scope.formData.endTime=$scope.formData.endTime.replace('T',' ')+":00"

                        workOvertime.workOvertimeEdit($scope.formData).
                        success(function(response){
                            SaveTooltip.showSaveTooltip(response);
                            if(response.status){
                                Action.forward('listTabs', 'workOvertime', {seeSelf: 1});
                            }
                        }).
                        error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status);
                        });}
                }
            }
        }];
});