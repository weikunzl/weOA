/**
 * Created by pippo on 14-10-22.
 * 销假
 */

define(function(){
    'use strict';

    return ['$scope', '$modal', '$q', '$timeout', '$routeParams', 'auth', 'leave', 'action', 'saveTooltip'
        , function($scope, $modal, $q, $timeout, $routeParams, Auth, Leave,  Action, SaveTooltip){
            if(!Auth.isLogined()){ return;};;
            $scope.htmlTitle = "编辑请假";

            $scope.leaveTypeExc = config.systemArguments.leaveTypeExc;
            $scope.checkExchange = function checkExchange(leaveType,tag){
                if(leaveType.id==config.systemArguments.leaveTypeExc){//调休
                    $scope.exchangeFormData = Leave.leaveHasTime($scope.formTempData.endTime);

                    $scope.exchangeFormData.tempYesterdayExcT = $scope.exchangeFormData.yesterdayExcT;//保存初始时间
                    checkExchangeFormData();
//                    $scope.exchangeFormData = {
//                        noPayExcT   : 8,
//                            payExcT :5.5
//                    }
                    if(!$scope.exchangeFormData&& ($scope.exchangeFormData.noPayExcT+$scope.exchangeFormData.payExcT+$scope.exchangeFormData.yesterdayExcT)==0&&!tag){
                        SaveTooltip.showSaveTooltip({message:'没有可调休时间'});
                        $scope.formData.typeId = null;
                    }else if($scope.exchangeFormData.countExc<1){
                        SaveTooltip.showSaveTooltip({message:'没有可调休次数'});
                        $scope.formData.typeId = null;
                    }
                }else{
//                    SaveTooltip.showSaveTooltip();
                    $scope.exchangeFormData = null;
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
//                , dataHourB : $scope.cm[0]
//                , minuteB:$scope.dm[0]
//                , dataHourE:$scope.em[0]
//                , minuteE:$scope.dm[0]

            };
            $scope.getDay = function getDay(){
                if($scope.formTempData.beginTime==$scope.formTempData.endTime){
                    $scope.exchangeFormData = Leave.leaveHasTime($scope.formTempData.endTime);
                    $scope.exchangeFormData.tempYesterdayExcT = $scope.exchangeFormData.yesterdayExcT;//保存初始时间
                    checkExchangeFormData();
                    if(!$scope.exchangeFormData&& ($scope.exchangeFormData.noPayExcT+$scope.exchangeFormData.payExcT+$scope.exchangeFormData.yesterdayExcT)==0&&!tag){
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
                //判断起始时间是否为8点
                if(($scope.formTempData.dataHourB.code+$scope.formTempData.minuteB.code)!=8){
                    $scope.exchangeFormData.payExcT = parseFloat($scope.exchangeFormData.payExcT)+ parseFloat($scope.exchangeFormData.yesterdayExcT);
                    $scope.exchangeFormData.yesterdayExcT = 0;
                }else{
                    if($scope.exchangeFormData.yesterdayExcT!=$scope.exchangeFormData.tempYesterdayExcT){
                        $scope.exchangeFormData.yesterdayExcT = $scope.exchangeFormData.tempYesterdayExcT;
                        $scope.exchangeFormData.payExcT = $scope.exchangeFormData.payExcT -  $scope.exchangeFormData.tempYesterdayExcT;
                    }
                }
                if($scope.formTempData.dataHourB.code==config.systemArguments.noonRestTime){
                    $scope.formTempData.minuteB.code = 0;
                }
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
//            $scope.formTempData.day = Date.parseDate( $scope.formTempData.endTime,'Y-m-d')-Date.parseDate( $scope.formTempData.beginTime)

            $scope.formData = {leaveId:"", typeId:null, beginTime: new Date().format('Y-m-d'), endTime:new Date().format('Y-m-d'),reason:"",statusId:0
            ,exchangeFlag:false ,payExcT:0,noPayExcT:0,yesterdayExcT:0};

            $scope.getDuration = function getDuration(){
                $scope.formData.duration =   Math.round($scope.formTempData.day*8+$scope.formTempData.hour)
            }

            $scope.a = parseInt(localStorage.employeeId)
            $scope.formData.leaveId =  $routeParams.id
            //加载数据
            $scope.getData = function getData(){
                Leave.leaveEditData($scope.formData.leaveId ).
                    //成功
                    success(function(response){
                        if(response.status){
                            $scope.formData.leaveId  = response.item.leaveId ;
                            $scope.formData.duration = response.item.duration;
                            $scope.formTempData.day=parseInt( $scope.formData.duration/8);
                            $scope.formTempData.hour=$scope.formData.duration%8;
                            $scope.formData.typeId = response.item.leaveTypeId;
                            $scope.formTempData.beginTime=response.item.beginTime.substr(0,10);
                            $scope.formTempData.endTime=response.item.endTime.substr(0,10);

                            $scope.exchangeFormData = Leave.leaveHasTime($scope.formTempData.endTime);
                            $scope.exchangeFormData.tempYesterdayExcT = $scope.exchangeFormData.yesterdayExcT;//保存初始时间
                            checkExchangeFormData();
                            $scope.formTempData.dataHourB= $scope.cm[Array.find($scope.cm,'code=='+parseInt(response.item.beginTime.substr(11,2))).index];

                            $scope.formTempData.minuteB=$scope.dm[Array.find($scope.dm,'code=='+getMinuteCode(response.item.beginTime.substr(14,2))).index];
                            $scope.formTempData.dataHourE=$scope.em[Array.find($scope.em,'code=='+parseInt(response.item.endTime.substr(11,2))).index];
                            $scope.formTempData.minuteE=$scope.dm[Array.find($scope.dm,'code=='+getMinuteCode(response.item.endTime.substr(14,2))).index];
                            $scope.formData.reason = response.item.reason;
                            $scope.formData.statusId = 2;
//                            $scope.getDay()
//                            $scope.getHour()
//                            $scope.getDuration()
                            if( response.item.leaveTypeId==config.systemArguments.leaveTypeExc){
                                $scope.checkExchange({id:response.item.leaveTypeId},true);
                                if(response.item.noPayExcT>0){
                                    $scope.noPayExcCheck = true;
                                    $scope.formData.noPayExcT = response.item.noPayExcT;
                                }
                                if(response.item.payExcT>0){
                                    $scope.payExcCheck = true;
                                    $scope.formData.payExcT = response.item.payExcT;
                                }
                                if(response.item.yesterdayExcT>0){
                                    $scope.payExcYesterCheck = true;
                                    $scope.formData.yesterdayExcT = response.item.yesterdayExcT;
                                }
                                $scope.formData.noPayExcT = response.item.noPayExcT;
                                $scope.formData.payExcT = response.item.payExcT;
                                if($scope.exchangeFormData&&$scope.exchangeFormData.yesterdayExcT>0){
                                    $scope.formData.payExcT = response.item.payExcT-$scope.exchangeFormData.yesterdayExcT;
                                    $scope.formData.yesterdayExcT = $scope.exchangeFormData.yesterdayExcT;
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



            //表单全部显示
            $scope.remove=function(){
              return  true;
            }

            //根据类型验证表单是否满足提交条件
            $scope.isOK = function isOK(){

                if(Date.parse($scope.formTempData.beginTime)>Date.parse($scope.formTempData.endTime)){
                    return false;
                }
                if($scope.formData.day == ""&&$scope.formData.hour == ""){
                    return false;
                }
                else if($scope.formData.typeId == ""||angular.isUndefined($scope.formData.typeId)){
                    return false;
                }
                else if($scope.formData.beginTime == ""||angular.isUndefined($scope.formData.beginTime)){
                    return false;
                }
                else if($scope.formTempData.dataHourB== null||angular.isUndefined($scope.formTempData.dataHourB)||$scope.formTempData.dataHourE == null||angular.isUndefined($scope.formTempData.dataHourE)){
                    return false;
                }
                else if($scope.formTempData.minuteB == null||angular.isUndefined($scope.formTempData.minuteB)||$scope.formTempData.minuteE == null||angular.isUndefined($scope.formTempData.minuteE)){
                    return false;
                }
                else if($scope.formData.endTime == ""||angular.isUndefined($scope.formData.endTime)){
                    return false;
                }
                else if($scope.formData.reason == ""||angular.isUndefined($scope.formData.reason)){
                    return false;
                }
                $scope.getDay();
                $scope.getDuration();
                if($scope.formData.duration<=0){
                    return false;
                }
                if($scope.formData.typeId==config.systemArguments.leaveTypeExc+$scope.formData.yesterdayExcT){//&&$scope.formData.dataHour != ($scope.formData.payExcT+$scope.formData.noPayExcT)){//调休
                    if($scope.formData.duration>($scope.formData.payExcT+$scope.formData.yesterdayExcT+$scope.formData.noPayExcT)){
                        $scope.errorTip = '调休时间小于假期时长！'
                        return false;
                    }else if($scope.formData.duration<($scope.formData.payExcT+$scope.formData.yesterdayExcT+$scope.formData.noPayExcT)){
                        $scope.errorTip = '假期时长小于调休时间,请核对！'
                        return false;
                    }else{
                        $scope.errorTip=''
                    }
                }
                $scope.errorTip=''
                return true;

            };


            //手动保存新增数据
            $scope.saveData = function saveData(){
                //判断是否可以保存
                if($scope.isOK()){
                    $scope.formData.statusId = 2;
                    $scope.formData.day=parseInt($scope.formTempData.day)
                    $scope.formData.hour=parseInt($scope.formTempData.hour)
//                    $scope.formData.duration=parseInt($scope.formData.day)*8+parseInt($scope.formData.hour);
                    $scope.getDuration();
                    $scope.formData.typeId =parseInt($scope.formData.typeId )
                    var beginTimeHour = $scope.formTempData.dataHourB.code+$scope.formTempData.minuteB.code
//                    beginTimeHour = beginTimeHour>config.systemArguments.noonRestTime?beginTimeHour+config.systemArguments.noonRestHour:beginTimeHour;
                    $scope.formData.beginTime=$scope.formTempData.beginTime+" "+String.dateParse(beginTimeHour);
                    var endTimeHour = $scope.formTempData.dataHourE.code+$scope.formTempData.minuteE.code;
//                    endTimeHour = endTimeHour>config.systemArguments.noonRestTime?endTimeHour+config.systemArguments.noonRestHour:endTimeHour;
                    $scope.formData.endTime=$scope.formTempData.endTime+" "+String.dateParse(endTimeHour)
                    $scope.formData.exchangeFlag = $scope.formData.leaveTypeId==config.systemArguments.leaveTypeExc?1:0
//                    $scope.formData.payExcT = $scope.formData.payExcT+$scope.formData.yesterdayExcT
                    $scope.hehe ={exchangeFlag:$scope.formData.exchangeFlag,reason:$scope.formData.reason,beginTime:$scope.formData.beginTime,endTime:$scope.formData.endTime,duration:$scope.formData.duration,leaveId:$scope.formData.leaveId,statusId:2,employeeId:$scope.a,typeId:$scope.formData.typeId}
                    Leave.leaveRemoveEdit($scope.hehe).
                        success(function(response){
                            SaveTooltip.showSaveTooltip(response);
                            if(response.status){
                                Action.forward('leaveTabs', 'leave', {seeSelf: 1});
                            }
                        }).
                        error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status);
                        });
                }
            }

//            String.dateParse = function(num) {
//                if(num+config.systemArguments.noonRestHour>=config.systemArguments.afternoonWorkTime){
//                    num += config.systemArguments.noonRestHour
//                }
//                if(!/^[0-9]*[1-9][0-9]*$/.test(num)){
//                    num = num-0.5;
//                    if(num<10){
//                        return '0'+num +':30:00'
//                    }else{
//                        return num +':30:00'
//                    }
//                }else{
//                    if(num<10){
//                        return '0'+num +':00:00'
//
//                    }else {
//                        return num +':00:00'
//                    }
//                }
//            }
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
            function getMinuteCode(str){
                return str=='30'?0.5:0
            }
//            Array.find = function(ary,str){
//                var tempItem = {}
//                $.each( ary, function(index,item){
//                    if(eval('item.'+str)){
//                        tempItem = item;
//                    }
//                })
//                return tempItem;
//            }
        }];
});