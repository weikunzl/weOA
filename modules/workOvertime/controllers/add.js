/**
 * Created by pippo on 14-10-22.
 * 新增加班
 */

define(function(){
    'use strict';

    return ['$scope', '$modal', '$q', 'auth', 'workOvertime',  'action',  'saveTooltip'
        , function($scope, $modal, $q, Auth, workOvertime, Action, SaveTooltip){
            if(!Auth.isLogined()){ return;};
            $scope.htmlTitle = "新增请假";
//            $scope.dinnerTime="";
            $scope.formData = {duration:2,employeeId:"", beginTime:new Date().format("Y-m-db19:30"), endTime:new Date().format("Y-m-db21:30"),reason:"",statusId:0,isSalary:1,dinner:1,isWeekend:0};
            var endHour =0;
            $scope.getDuration = function getDuration(){
                var endTime = $scope.formData.endTime;
                var beginTime = $scope.formData.beginTime;
                if(endTime<beginTime){

                    $scope.formData.duration = 0;
                    SaveTooltip.showSaveTooltip({message:'时间不合法'});
                    return;
                }
                var day = Math.abs((Date.parseDate(endTime.substring(0,10),'Y-m-d')-Date.parseDate(beginTime.substring(0,10),'Y-m-d'))/1000/3600/24);//几天
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
           $scope.getDuration();

            $scope.a = parseInt(localStorage.employeeId)


//            $scope.changeEndTime = function changeEndTime(){
//                alert(1)
//                if(parseInt($scope.formData.duration)<$scope.dinnerTime){
//                    $scope.formData.dinner=false
//                }
//                if(parseInt($scope.formData.duration)>=$scope.dinnerTime){
//                    $scope.formData.dinner=true
//                }
//                if(parseInt($scope.formData.duration)<0){
//                    $scope.tip="加班时长不合法";
//                    $scope.formData.duration = 0;
//                }else{
//                    $scope.tip=''
//                }
//
//                if(parseInt($scope.formData.endTime.substr(11,2))<24){
//                $scope.formData.endTime=$scope.formData.beginTime.substr(0,11)+
//                    (parseInt($scope.formData.beginTime.toString().substr(11,2))+
//                        parseInt($scope.formData.duration.toString().substr(0,1))).toString()+":"+
//                    (parseInt($scope.formData.beginTime.substr(14,2))+parseInt($scope.formData.duration.substr(2,1)*6)).toString()
//                    if(parseInt($scope.formData.beginTime.substr(14,2))+parseInt($scope.formData.duration.substr(2,1)*6)==60){
//                        $scope.formData.endTime=$scope.formData.beginTime.substr(0,11)+
//                            (parseInt($scope.formData.beginTime.toString().substr(11,2))+
//                                (parseInt($scope.formData.duration.toString().substr(0,1)))+1).toString()+":00"
//                    }
//                }
//
//                    if(parseInt($scope.formData.endTime.substr(11,2))>=24){
//                        if((parseInt($scope.formData.beginTime.substr(8,2))+1)<10)
//                        {
//                            var f ="0"+(parseInt($scope.formData.endTime.toString().substr(8,2))+1)
//                        }
//                        else{
//                            f =parseInt($scope.formData.endTime.toString().substr(8,2))+1
//                        }
//                        if((parseInt($scope.formData.endTime.substr(11,2))-24)<10){
//                            var g ="0"+(parseInt($scope.formData.endTime.substr(11,2))-24)
//                        }
//                        else{
//                            g =parseInt($scope.formData.endTime.substr(11,2))-24
//                        }
//                        if(parseInt($scope.formData.beginTime.substr(14,2))+parseInt($scope.formData.duration.substr(2,1)*6)==60){
//                            var t = ":00"
//                        }
//                        else{
//                            t=":30"
//                        }
//                        $scope.formData.endTime=
//                                $scope.formData.beginTime.substr(0,8)
//                                +f+"T"+g+t
//                    }
//
//            }

            //根据类型验证表单是否满足提交条件
            $scope.isOK = function isOK(){
                if(angular.isUndefined($scope.formData.duration)||$scope.formData.duration==""||$scope.formData.duration==0){
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
            //保存数据
            $scope.saveData = function saveData(){
                $scope.getDuration();
                if($scope.isOK()){
//                        if($scope.formData.dinner==true){
//                            $scope.formData.dinner=1
//                        }else
//                        if($scope.formData.dinner==false){
//                            $scope.formData.dinner=0
//                        }
//                        if($scope.formData.isSalary==true){
//                            $scope.formData.isSalary=1
//                        }else
//                        if($scope.formData.isSalary==false){
//                            $scope.formData.isSalary=0
//                        }
//                        if($scope.formData.isWeekend==true){
//                            $scope.formData.isWeekend=1
//                        }else
//                        if($scope.formData.isWeekend==false){
//                            $scope.formData.isWeekend=0
//                        }
                        $scope.formData.isWeekend = parseInt($scope.formData.endTime.substr(11,2))+getMinuteCode($scope.formData.endTime.substr(14,2))>=config.systemArguments.extOverRestTime?1:0//超过几点
                        if($scope.formData.isSalary==0){
                            $scope.formData.dinner=0
                        }
                        $scope.formData.employeeId=$scope.a
                        $scope.formData.duration=parseFloat($scope.formData.duration)
                        $scope.formData.beginTime=$scope.formData.beginTime.substr(0,10)+" "+$scope.formData.beginTime.substr(11,5)+":00"
                        $scope.formData.endTime=$scope.formData.endTime.substr(0,10)+" "+$scope.formData.endTime.substr(11,5)+":00"
                        workOvertime.workOvertimeAdd($scope.formData).
                        success(function (response) {
                        if (response.status) {
                            SaveTooltip.showSaveTooltip(response);
                            Action.forward('listTabs', 'workOvertime', {seeSelf: 1})
                        } else {
                            SaveTooltip.showSaveTooltip(response);
                        }
                    }).
                    error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    });}

            }
        }];
});