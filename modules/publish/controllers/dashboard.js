/**
 * Created with JetBrains WebStorm.
 * User: @kazaff
 * Date: 13-9-5
 * Time: 下午2:45
 */
define(function(){
    'use strict';

    return ['$scope', 'auth','saveTooltip', function($scope, Auth,SaveTooltip){
        if(!Auth.isLogined()){ return;};
        var showList = [1,2,7,3,5]
        var showListName = ['leaveShow','workOvertimeShow','evectionShow','attendanceTimeShow','payShow']

        var authShow = config.authViewList.root
        if(authShow.length==7){
            $scope.leaveShow = true;
            $scope.workOvertimeShow = true;
            $scope.evectionShow = true;
            $scope.attendanceTimeShow = true;
            $scope.payShow = true;
        }else{
            $scope.leaveShow = true;
            $scope.workOvertimeShow = true;
            $scope.evectionShow = true;
            $scope.attendanceTimeShow = true;
            $scope.payShow = true;
            for(var countIndex in showList){
                if(authShow.indexOf(showList[countIndex])<0){
                    $scope[showListName[countIndex]] = false;
                }
            }
        }
        //统计小时数
        var url = config.domain + 'pay/';
        var url3 = config.domain + 'set/';
        var leaveType = []
        $.ajax({ url: url3 + "leaveSet/data"+ "?time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
            if(response.status){
                leaveType = response.items;
            }else{
                //提示框
                SaveTooltip.showSaveTooltip(response);
            }
        },error:function(response){
            SaveTooltip.showSaveTooltip(response,response.status);
        }});
        $scope.doingTypes =[{
            "type" : "加班",id:0
        }].concat(leaveType)

//                    $scope.doingTypes.push()
        $scope.doingTypes.push({
            "type" : "迟到早退(分钟)",id:99999
        })
        $scope.doingTypes.push({
            "type" : "出差(天)",id:99998
        })
//                    $scope.doingTypes.push({
//                        "type" : "调休",id:101
//                    })
//        $.ajax({ url: url + "detail?salaryId=-1&time=" + new Date().getTime(), async : false,context: document.body, success: function(response){


        var morningWorkTimeMinute = config.systemArguments.morningWorkTime*60;
        var noonRestTimeMinute = config.systemArguments.noonRestTime*60;
        var afternoonWorkTimeMinute = config.systemArguments.afternoonWorkTime*60;
        var afternoonRestTimeMinute = config.systemArguments.afternoonRestTime*60;

        $scope.morningWorkTimeMinute = morningWorkTimeMinute;
        $scope.noonRestTimeMinute = noonRestTimeMinute;
        $scope.afternoonWorkTimeMinute = afternoonWorkTimeMinute;
        $scope.afternoonRestTimeMinute = afternoonRestTimeMinute;
        function getAMorPM(dateStr){
            if(!dateStr){
                return;
            }
            var minute = parseInt(dateStr.substr(11,2))*60+parseInt(dateStr.substr(14,2));
            if(morningWorkTimeMinute<=minute&&minute<=noonRestTimeMinute){//上午
                return 'AM';
            }else if(afternoonWorkTimeMinute<=minute&&minute<=afternoonRestTimeMinute) {//下午
                return 'PM';
            }
        }

        $scope.getTimeByMinute = function(minuteStr){
            return (Math.floor(minuteStr/60)<10?('0'+Math.floor(minuteStr/60)):Math.floor(minuteStr/60))+':'+(minuteStr%60<10?('0'+minuteStr%60):minuteStr%60);
        }
        //按钮事件
//            var doingTypes = leaveType;
        function getAttendanceDateTime(salaryDetailList){
            var dayNum = new Date().getDaysInMonth()
            if(new Date().getMonth()==new Date().getMonth()){
                dayNum = parseInt(new Date().format('Y-m-d').substring(8,10));
            }
            var firstWeekNum = new Date().getFirstDateOfMonth().getDay();

            var resultSalaryDetailList = []
            for(var dayCount=1;dayCount<dayNum+1;dayCount++){
                var salaryDetail = Array.find(salaryDetailList,'day=='+dayCount).item;
                if(salaryDetail||salaryDetail==0){
                    var tempSalaryDetail ={}
                    var day = salaryDetail.day;
                    tempSalaryDetail.day = day;
                    tempSalaryDetail.beginTimeAM = morningWorkTimeMinute;
                    tempSalaryDetail.endTimeAM = noonRestTimeMinute;
                    tempSalaryDetail.beginTimePM = afternoonWorkTimeMinute;
                    tempSalaryDetail.endTimePM = afternoonRestTimeMinute;
                    tempSalaryDetail.doingType =[];
                    $.each(salaryDetail.doingType,function(indexIn,doingType){
                        var tempDoingType = doingType;
                        //加班pass
                        if(tempDoingType.doingTypeId==0){
                            var doingEndDateMinute = parseInt(doingType.doingEndDate.substr(11,2))*60+parseInt(tempDoingType.doingEndDate.substr(14,2));
                            tempSalaryDetail.endTimePM = doingEndDateMinute;
                            tempSalaryDetail.doingType.push(tempDoingType)
                            return ;//continue
                        }
                        if(tempDoingType.doingTypeId==99998){//出差
                            tempSalaryDetail.beginTimeAM = 0;
                            tempSalaryDetail.endTimeAM = 0;
                            tempSalaryDetail.beginTimePM = 0;
                            tempSalaryDetail.endTimePM = 0;
                            tempSalaryDetail.doingType.push(tempDoingType)
                            return ;//continue
                        }
                        var beginNoon = getAMorPM(tempDoingType.doingBeginDate)
                        var endNoon = getAMorPM(tempDoingType.doingEndDate)

                        //迟到早退
                        if(tempDoingType.doingTypeId==99999){
                            if(tempSalaryDetail.doingCost){
                                tempSalaryDetail.doingCost +=tempSalaryDetail.doingCost
                            }
                            if(tempDoingType.doingBeginDate&&tempDoingType.doingBeginDate!=''){//迟到
                                var doingBeginDateMinute = parseInt(doingType.doingBeginDate.substr(11,2))*60+parseInt(tempDoingType.doingBeginDate.substr(14,2));
                                if(beginNoon=='AM'){
                                    tempSalaryDetail.beginTimeAM =doingBeginDateMinute;
                                }else if(beginNoon=='PM'){
                                    tempSalaryDetail.beginTimePM = doingBeginDateMinute;
                                }else{
                                    alert("数据错误:noon")
                                }
                            }else if(tempDoingType.doingEndDate&&tempDoingType.doingEndDate!=''){//早退
                                var doingEndDateMinute = parseInt(doingType.doingEndDate.substr(11,2))*60+parseInt(tempDoingType.doingEndDate.substr(14,2));
                                if(endNoon=='AM'){
                                    tempSalaryDetail.endTimeAM =doingEndDateMinute
                                }else if(endNoon=='PM'){
                                    tempSalaryDetail.endTimePM = doingEndDateMinute;
                                }else{
                                    alert("数据错误:noon")
                                }
                            }else{
                                alert("数据错误")
                            }
                            tempSalaryDetail.doingType.push(tempDoingType)
                            return ;//continue
                        }
                        var doingBeginDateMinute = parseInt(doingType.doingBeginDate.substr(11,2))*60+parseInt(tempDoingType.doingBeginDate.substr(14,2));
                        var doingEndDateMinute = parseInt(doingType.doingEndDate.substr(11,2))*60+parseInt(tempDoingType.doingEndDate.substr(14,2));
                        //判断是否跨天
                        var doingBeginDate = tempDoingType.doingBeginDate;
                        var doingEndDate = tempDoingType.doingEndDate;
                        var bDay = doingBeginDate.substring(8,10);
                        var eDay = doingEndDate.substring(8,10);
                        if(bDay==eDay){//一天内
                            if(beginNoon==endNoon){//单上午，或下午
//                                var long = Date.parseDate(doingType.doingEndDate,'Y-m-d h:i:s')-Date.parseDate(doingType.doingBeginDate,'Y-m-d h:i:s')
                                if(beginNoon=='AM'){
                                    if(morningWorkTimeMinute==doingBeginDateMinute&&noonRestTimeMinute==doingEndDateMinute){
                                        tempSalaryDetail.beginTimeAM = 0;
                                        tempSalaryDetail.endTimeAM = 0
                                    } else if(noonRestTimeMinute==doingEndDateMinute){
                                        tempSalaryDetail.endTimeAM = noonRestTimeMinute-tempDoingType.doingTime*60
                                    }else if(morningWorkTimeMinute==doingBeginDateMinute){
                                        tempSalaryDetail.beginTimeAM = morningWorkTimeMinute+tempDoingType.doingTime*60
                                    }
                                }else if(beginNoon=='PM'){
                                    if(afternoonWorkTimeMinute==doingBeginDateMinute&&afternoonRestTimeMinute==doingEndDateMinute){
                                        tempSalaryDetail.endTimePM = 0;
                                        tempSalaryDetail.beginTimePM = 0
                                    }else if(afternoonRestTimeMinute==doingEndDateMinute){
                                        tempSalaryDetail.beginTimePM = afternoonRestTimeMinute+tempDoingType.doingTime*60
                                    }else if(afternoonWorkTimeMinute==doingBeginDateMinute){
                                        tempSalaryDetail.endTimePM = afternoonWorkTimeMinute-tempDoingType.doingTime*60
                                    }
                                }else{
                                    alert('error')
                                }
                            }else{//跨上午下午
                                tempSalaryDetail.beginTimeAM = doingBeginDateMinute;
                                tempSalaryDetail.endTimePM = doingEndDateMinute;

                                tempSalaryDetail.beginTimePM = 0;
                                tempSalaryDetail.endTimeAM = 0;
                            }
                        }else {//超过一天
                            var longDay = parseInt(eDay) - parseInt(bDay);
                            //当前天判断结束
                            if(endNoon=='AM'){
                                if(doingEndDateMinute==noonRestTimeMinute){
                                    tempSalaryDetail.beginTimeAM = 0;
                                    tempSalaryDetail.endTimeAM = 0;
                                }else{
                                    tempSalaryDetail.beginTimeAM = doingEndDateMinute;
                                }
                            }else if(endNoon=='PM'){
                                tempSalaryDetail.beginTimeAM = 0;
                                tempSalaryDetail.endTimeAM = 0;
                                if(doingEndDateMinute==afternoonRestTimeMinute){
                                    tempSalaryDetail.beginTimePM = 0;
                                    tempSalaryDetail.endTimePM = 0;
                                }else{
                                    tempSalaryDetail.beginTimePM = doingEndDateMinute;
                                }
                            }else{
                                alert('error,today')
                            }
                            //第一天开始
                            var tempFirstLeave = Array.find(resultSalaryDetailList,'day=='+(dayCount- longDay)).index
                            if(tempFirstLeave||tempFirstLeave==0){
                                if(beginNoon=='AM'){
                                    resultSalaryDetailList[tempFirstLeave].beginTimePM = 0;
                                    resultSalaryDetailList[tempFirstLeave].endTimePM = 0;
                                    if(doingBeginDateMinute==morningWorkTimeMinute){
                                        resultSalaryDetailList[tempFirstLeave].beginTimeAM = 0;
                                        resultSalaryDetailList[tempFirstLeave].endTimeAM = 0;
                                    }else{
                                        resultSalaryDetailList[tempFirstLeave].endTimeAM = doingBeginDateMinute;
                                    }
                                }else if(endNoon=='PM'){
//                                        resultSalaryDetailList[tempFirstLeave].endTimeAM = noonRestTimeMinute;
//                                        resultSalaryDetailList[tempFirstLeave].beginTimeAM = morningWorkTimeMinute;
                                    if(doingBeginDateMinute==afternoonWorkTimeMinute){
                                        resultSalaryDetailList[tempFirstLeave].beginTimePM = 0;
                                        resultSalaryDetailList[tempFirstLeave].endTimePM = 0;
                                    }else{

                                        resultSalaryDetailList[tempFirstLeave].endTimePM = doingBeginDateMinute;
                                    }

                                }else{
                                    alert('error,firstLeaveDay')
                                }
                            }
                            if(longDay>1){//超过两天
                                for(var i=longDay-1;i>0;i--) {//制空其他天
                                    if(dayCount- longDay<0){
                                        break;
                                    }
                                    Array.find(resultSalaryDetailList,'day=='+(dayCount- longDay) ).item = {
                                        day: parseInt(dayCount- longDay),
                                        beginTimeAM:0,
                                        endTimePM:0,
                                        beginTimePM:0,
                                        endTimeAM:0
                                    }
                                }
                            }
                        }
                        tempSalaryDetail.doingType.push(tempDoingType)
                    })
                    resultSalaryDetailList.push(tempSalaryDetail);
                }else if((firstWeekNum+dayCount-1)%7==0){//周日
                    resultSalaryDetailList.push({
                        day : dayCount,
                        beginTimeAM : 0,
                        endTimeAM : 0,
                        beginTimePM : 0,
                        endTimePM : 0
                    })
                }else{
                    resultSalaryDetailList.push({
                        day : dayCount,
                        beginTimeAM : morningWorkTimeMinute,
                        endTimeAM : noonRestTimeMinute,
                        beginTimePM : afternoonWorkTimeMinute,
                        endTimePM : afternoonRestTimeMinute
                    })
                }
            }
            return resultSalaryDetailList;
        }

        $scope.workOvertimeHour = 0
        $scope.evectionHour = 0
        $scope.leaveHour = 0
        function getTotalData(salaryDetail){
            var leaveTotal = 0;
            if(salaryDetail&&salaryDetail.length>0) {
                $scope.totalTimeData = {}
                $scope.totalCostData = {}
                $scope.totalCostSalary = 0
                for(var i=0;i<salaryDetail.length;i++){
                    if(!salaryDetail[i].doingType){
                        continue;
                    }
                    for(var j=0;j<salaryDetail[i].doingType.length;j++){
                        $.each($scope.doingTypes,function(index,item){
                            if(item.id==salaryDetail[i].doingType[j].doingTypeId){
                                if(item.id||item.id==0){
                                    if(eval('$scope.totalTimeData.doingType'+item.id)==null||eval('$scope.totalTimeData.doingType'+item.id)==undefined){
                                        eval('$scope.totalTimeData.doingType'+item.id +'='+salaryDetail[i].doingType[j].doingTime)
                                    }else{
                                        eval('$scope.totalTimeData.doingType'+item.id+' += '+salaryDetail[i].doingType[j].doingTime);
                                    }
                                    if(item.id!=0&&item.id!=99999&&item.id!=99998){
                                        leaveTotal += salaryDetail[i].doingType[j].doingTime
                                    }
                                    if(item.id==0||item.id==99998){
                                        $scope.totalCostSalary +=salaryDetail[i].doingType[j].doingCost;
                                    }else{
                                        $scope.totalCostSalary -=salaryDetail[i].doingType[j].doingCost;
                                    }
                                    if(eval('$scope.totalCostData.doingType'+item.id)==null||eval('$scope.totalCostData.doingType'+item.id)==undefined){
                                        eval('$scope.totalCostData.doingType'+item.id +'='+salaryDetail[i].doingType[j].doingCost)
                                    }else{
                                        eval('$scope.totalCostData.doingType'+item.id+' += '+salaryDetail[i].doingType[j].doingCost);
                                    }
                                    return;
                                }
                            }
                        });
                    }
                }
            }
            $scope.leaveHour = leaveTotal;
            $scope.workOvertimeHour = $scope.totalTimeData&&$scope.totalTimeData.doingType0?$scope.totalTimeData.doingType0:0;
            $scope.evectionHour = $scope.totalTimeData&&$scope.totalTimeData.doingType99998?$scope.totalTimeData.doingType99998:0;
        }
        $scope.getDoingTypeTime =  function(salaryData,doingTypeItem){
            if(!salaryData.doingType){
                return '-';
            }
            var obj = Array.find(salaryData.doingType,'doingTypeId=='+doingTypeItem.id)
            if(obj&&obj.item){
                return obj.item.doingTime
            }else{
                return '-';
            }
        }
        $scope.getDoingTimeItemValue = function(doingType_temp,totalData){
            if(!totalData){
                return;
            }
            if(totalData['doingType'+doingType_temp.id]==0){
                return totalData['doingType'+doingType_temp.id];
            }
            return totalData['doingType'+doingType_temp.id]?totalData['doingType'+doingType_temp.id]:'-'
        }

        $.ajax({ url: config.domain+'pay/mainDetail?salaryId=-1', async : false,context: document.body, success: function(response){
            if(response.status&&response.items){
                getTotalData(response.items);
                $scope.salaryDetail =getAttendanceDateTime( response.items);
            }else{
                //提示框
//                SaveTooltip.showSaveTooltip(response);
            }
        },error:function(response){
            SaveTooltip.showSaveTooltip(response,response.status);
        }});

       //---------------待办事项
        if(localStorage.positionId==config.systemArguments.roleNormalEmployeeId){//普通员工
            $scope.todoList=[{
                iconClass:'icon-tag',
                href:'#!/leave/list/1',
                titleList:'您的3条假条未审批',
                context:'1条假条未审批，2条被驳回',
                date:new Date()
            },{
                iconClass:'icon-briefcase',
                href:'#!/workOvertime/list/1',
                titleList:'您的3条加班单未审批',
                context:'1条加班未审批，2条被驳回',
                date:new Date()
            },{
                iconClass:'icon-money',
                href:'#!/pay/payList/1',
                titleList:'新的工资单已生成',
                context:'当月工资单',
                date:new Date()
            }];
        }else{

            $scope.todoList=[{
                iconClass:'icon-tag',
                href:'#!/leave/list/1',
                titleList:'您的3条假条未审批',
                context:'1条假条未审批，2条被驳回',
                date:new Date()
            },{
                iconClass:'icon-briefcase',
                href:'#!/workOvertime/list/1',
                titleList:'您的3条加班单未审批',
                context:'1条加班未审批，2条被驳回',
                date:new Date()
            },{
                iconClass:'icon-tags',
                href:'#!/leave/list/0',
                titleList:'3条假条需审批',
                context:'假条未审批，XX,XX请假详情',
                date:new Date()
            },{
                iconClass:'icon-folder-close',
                href:'#!/workOvertime/list/0',
                titleList:'3条加班单需审批',
                context:'加班单，XX,XX的加班',
                date:new Date()
            },{
                iconClass:'icon-money',
                href:'#!/pay/payList/1',
                titleList:'新的工资单已生成',
                context:'当月工资单',
                date:new Date()
            }];
        }
        /*<div class="new-update clearfix"><i class="icon-briefcase"></i>
            <span class="update-notice"> <a title="" href="#!/workOvertime/list/1"><strong>您的3条加班单未审批 </strong></a> <span>点击查看</span>
            </span> <span class="update-date"><span class="update-day">11</span>一月</span> </div>
        <div class="new-update clearfix"><i class="icon-tags"></i>
            <div class="update-done"><a title="" href="#!/leave/list/0"><strong>3条假条需审批</strong></a> <span>1条假条未审批，2条被驳回</span> </div>
        <div class="update-date"><span class="update-day">20</span>一月</div>
        </div>
        <div class="new-update clearfix"><i class="icon-folder-close"></i>
            <span class="update-notice"> <a title="" href="#!/workOvertime/list/0"><strong>3条加班单需审批 </strong></a> <span>加班单，XX,XX的加班</span>
            </span> <span class="update-date"><span class="update-day">11</span>一月</span> </div>
        <div class="new-update clearfix"> <i class="icon-money"></i> <span class="update-alert"> <a title="" href="#!/pay/payList/1"><strong>新的工资单已生成</strong></a>
            <span>点击查看</span> </span> <span class="update-date"><span class="update-day">07</span>一月</span>
        </div>*/
    }];
});