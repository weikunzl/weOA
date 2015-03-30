/**
 * Created by pippo on 14-10-22.
 * 新增请假
 */

define(function(){
    'use strict';

    return ['$scope', '$modal', '$q', 'auth', 'leave',  'action',  'saveTooltip'
        , function($scope, $modal, $q, Auth, Leave, Action, SaveTooltip){
            if(!Auth.isLogined()){ return;};
            //初始化参数
            $scope.htmlTitle = "新增请假";
            $scope.leaveTypeExc = config.systemArguments.leaveTypeExc

            $scope.exchangeFormData = Leave.leaveHasTime(new Date());
            $scope.exchangeFormData.tempYesterdayExcT = $scope.exchangeFormData.yesterdayExcT;//保存初始时间
//            !(!exchangeFormData&&(exchangeFormData.noPayExcT==0&&exchangeFormData.payExcT==0)||exchangeFormData.countExc==0)&&
            $scope.checkExchange = function checkExchange(leaveType,tag){
                if(leaveType.id== $scope.leaveTypeExc){//调休
                    $scope.exchangeFormData = Leave.leaveHasTime($scope.formTempData.endTime);
                    $scope.exchangeFormData.tempYesterdayExcT = $scope.exchangeFormData.yesterdayExcT;//保存初始时间
                    checkExchangeFormData();
                    if(!$scope.exchangeFormData&& ($scope.exchangeFormData.noPayExcT+$scope.exchangeFormData.payExcT+$scope.exchangeFormData.yesterdayExcT)==0&&!tag){
                        SaveTooltip.showSaveTooltip({message:'没有可调休时间'});
                        $scope.formData.typeId = null;
                    }else if($scope.exchangeFormData.countExc<1){
                        SaveTooltip.showSaveTooltip({message:'没有可调休次数'});
                        $scope.formData.typeId = null;
                    }
                }else{
//                    SaveTooltip.showSaveTooltip();
//                    $scope.exchangeFormData = null;
                }
            }
            function checkExchangeFormData(){ //判断起始时间是否为8点
                if(($scope.formTempData.dataHourB.code+$scope.formTempData.minuteB.code)!=8){
                    $scope.exchangeFormData.payExcT = $scope.exchangeFormData.payExcT+ $scope.exchangeFormData.yesterdayExcT;
                    $scope.exchangeFormData.yesterdayExcT = 0;
                }else{
                    if($scope.exchangeFormData.yesterdayExcT!=$scope.exchangeFormData.tempYesterdayExcT){
                        $scope.exchangeFormData.yesterdayExcT = $scope.exchangeFormData.tempYesterdayExcT;
                        $scope.exchangeFormData.payExcT = $scope.exchangeFormData.payExcT -  $scope.exchangeFormData.tempYesterdayExcT;
                    }
                }
            }
            $scope.leaveTypeExcFlag = function leaveTypeExcFlag(){
                if(!$scope.exchangeFormData){
                    return false
                }else if(($scope.exchangeFormData.noPayExcT+$scope.exchangeFormData.payExcT+$scope.exchangeFormData.yesterdayExcT)==0||$scope.exchangeFormData.countExc==0){
                    return false;
                }else{
                    return true;
                }
            }
            $scope.checkMax = function checkMax(tag,exchangeFormData,formData){
               if(tag=='nop'){
                   if($scope.noPayExcCheck){
                       if(!/\d+[.]?\d*/.test(formData.noPayExcT)){
                           formData.noPayExcT = 0;
                           return;
                       }
                       if( formData.noPayExcT>exchangeFormData.noPayExcT){
                           formData.noPayExcT = 0;
                       }
                   }else{
                       formData.noPayExcT = 0;
                   }
               }else if(tag=='tp'){
                   if($scope.payExcYesterCheck){
                       if(!/\d+[.]?\d*/.test(formData.yesterdayExcT)){
                           formData.yesterdayExcT = 0;
                           return;
                       }
                       if( formData.yesterdayExcT>exchangeFormData.yesterdayExcT){
                           formData.yesterdayExcT = 0;
                       }
                   }else{
                       formData.yesterdayExcT = 0;
                   }
               }else {
                   if ($scope.payExcCheck) {
                       if(!/\d+[.]?\d*/.test(formData.payExcT)){
                           formData.payExcT = 0;
                           return;
                       }
                       if (formData.payExcT > exchangeFormData.payExcT) {
                           formData.payExcT = 0;
                       }
                   } else {
                       formData.payExcT = 0;
                   }
               }
            }

            //获取请假类型
            $scope.leaveTypes=  Leave.leaveType();

            $scope.cm =[{setHour:'08时',code:8},{setHour:'09时',code:9},{setHour:'10时',code:10},{setHour:'11时',code:11},{setHour:'14时',code:14}
                ,{setHour:'15时',code:15},{setHour:'16时',code:16},{setHour:'17时',code:17}];

            $scope.dm =[{setMinute:'00分',code:0},{setMinute:'30分',code:0.5}];
            $scope.em =[{setHour:'09时',code:9},{setHour:'10时',code:10},{setHour:'11时',code:11},{setHour:'12时',code:12}
                ,{setHour:'15时',code:15},{setHour:'16时',code:16},{setHour:'17时',code:17},{setHour:'18时',code:18}];

            $scope.formTempData ={
                beginTime: new Date().format('Y-m-d')
                , endTime:new Date().format('Y-m-d')
                , dataHourB : $scope.cm[0]
                , minuteB:$scope.dm[0]
                , dataHourE:$scope.em[0]
                , minuteE:$scope.dm[0]

            };
            $scope.getDay = function getDay(){
                if($scope.formTempData.beginTime==$scope.formTempData.endTime){
                    $scope.exchangeFormData = Leave.leaveHasTime($scope.formTempData.endTime);
                    $scope.exchangeFormData.tempYesterdayExcT = $scope.exchangeFormData.yesterdayExcT;//保存初始时间
                    checkExchangeFormData();
                    if(!$scope.exchangeFormData&& ($scope.exchangeFormData.noPayExcT+$scope.exchangeFormData.payExcT+$scope.exchangeFormData.yesterdayExcT)==0){
                        $scope.exchangeFormData = null;
                    }else if($scope.exchangeFormData.countExc<1){
                        $scope.exchangeFormData = null;
                    }
                }
                var long = Date.parseDate( $scope.formTempData.endTime,'Y-m-d')-Date.parseDate( $scope.formTempData.beginTime,'Y-m-d')
                if(long>0){
                    $scope.formTempData.day = long/1000/3600/24;
                }else{
                    $scope.formTempData.day = 0;
//                    $scope.formTempData.beginTime =  $scope.formTempData.endTime;
                }

            }

            $scope.getHour =function getHour(){
                checkExchangeFormData();
                var hour =  $scope.formTempData.dataHourE.code+$scope.formTempData.minuteE.code-$scope.formTempData.dataHourB.code-$scope.formTempData.minuteB.code
                if(hour>0){
                    if($scope.formTempData.dataHourE.code>config.systemArguments.noonRestTime
                        &&$scope.formTempData.dataHourB.code<=config.systemArguments.noonRestTime){
                        hour = hour - config.systemArguments.noonRestHour;
                    }
                    $scope.formTempData.hour = Math.round(hour);
                }else{
                    $scope.formTempData.hour = 0;
                }

            }
            $scope.getDay()
            $scope.getHour()
//            $scope.formTempData.day = Date.parseDate( $scope.formTempData.endTime,'Y-m-d')-Date.parseDate( $scope.formTempData.beginTime)

            $scope.formData = {leaveId:"", typeId:null, beginTime: new Date().format('Y-m-d'), endTime:new Date().format('Y-m-d'),reason:"",statusId:0,
                exchangeFlag:false ,payExcT:0,noPayExcT:0,yesterdayExcT:0};

            $scope.getDuration = function getDuration(){
                $scope.formData.duration =  Math.round($scope.formTempData.day*8+$scope.formTempData.hour)
            }
            $scope.getDuration()
            $scope.remove=false;

            $scope.a = parseInt(localStorage.employeeId)


            //根据类型验证表单是否满足提交条件
            $scope.isOK = function isOK(){
                if(angular.isUndefined($scope.formData.typeId)||$scope.formData.typeId==""||$scope.formData.typeId==null){
                    return false;
                }
                else if($scope.formTempData.beginTime == ""||angular.isUndefined($scope.formTempData.beginTime)||$scope.formTempData.endTime == ""||angular.isUndefined($scope.formTempData.endTime)){
                    return false;
                }
                else if($scope.formTempData.dataHourB== null||angular.isUndefined($scope.formTempData.dataHourB)||$scope.formTempData.dataHourE == null||angular.isUndefined($scope.formTempData.dataHourE)){
                    return false;
                }
                else if($scope.formTempData.minuteB == null||angular.isUndefined($scope.formTempData.minuteB)||$scope.formTempData.minuteE == null||angular.isUndefined($scope.formTempData.minuteE)){
                    return false;
                }
                if(angular.isUndefined($scope.formData.reason)||$scope.formData.reason==""){
                    return false;
                }
                if(Date.parse($scope.formTempData.beginTime)>Date.parse($scope.formTempData.endTime)){
                    return false;
                }
                $scope.getDay();
                $scope.getDuration();
                if($scope.formData.duration<=0){
                    return false;
                }
                if($scope.formData.typeId==config.systemArguments.leaveTypeExc){//&&$scope.formData.dataHour != ($scope.formData.payExcT+$scope.formData.noPayExcT)){//调休
                    if(!($scope.formData.payExcT+$scope.formData.noPayExcT+$scope.formData.yesterdayExcT)){
                        return false;
                    }
                    if($scope.formData.duration>($scope.formData.payExcT+$scope.formData.noPayExcT+$scope.formData.yesterdayExcT)){
//                        SaveTooltip.showSaveTooltip({message:'调休时间小于假期时长！'})
                        $scope.errorTip = '调休时间小于假期时长！'
                        return false;
                    }else if($scope.formData.duration<($scope.formData.payExcT+$scope.formData.noPayExcT+$scope.formData.yesterdayExcT)){
//                        SaveTooltip.showSaveTooltip({message:'假期时长小于调休时间,请核对！'})
                        $scope.errorTip = '假期时长小于调休时间,请核对！'
                        return false;
                    }else{
                        $scope.errorTip=''
                    }
                }
                $scope.errorTip=''
                return true;
            };

            //保存数据
            $scope.saveData = function saveData(){
                if($scope.isOK()){
                    $scope.formData.employeeId= parseInt(localStorage.employeeId);
                    $scope.getDuration();
                    var beginTimeHour = $scope.formTempData.dataHourB.code+$scope.formTempData.minuteB.code
                    $scope.formData.beginTime=$scope.formTempData.beginTime+" "+String.dateParse(beginTimeHour);
                    var endTimeHour = $scope.formTempData.dataHourE.code+$scope.formTempData.minuteE.code;
                    $scope.formData.endTime=$scope.formTempData.endTime+" "+String.dateParse(endTimeHour)
                    $scope.formData.exchangeFlag = $scope.formData.leaveTypeId==config.systemArguments.leaveTypeExc?1:0
                    Leave.leaveAdd($scope.formData).
                        success(function (response) {
                        if (response.status) {
                            SaveTooltip.showSaveTooltip(response);
                            Action.forward('leaveTabs', 'leave', {seeSelf: 1})
                        } else {
                            SaveTooltip.showSaveTooltip(response);
                        }
                    }).error(function(response,status){

                        SaveTooltip.showSaveTooltip(response,status);
                    });
                }
            }
            String.dateParse = function(num) {
                if(!/^[0-9]*[1-9][0-9]*$/.test(num)){
                    num =num-0.5;
                    if(num<10){
                        return '0'+num +':30:00'
                    }else{
                        return num +':30:00'
                    }
                }else{
                    if(num<10){
                        return '0'+num +':00:00'
                    }else{
                        return num +':00:00'
                    }
                }
            }
        }];
});