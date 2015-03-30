/**
 * Created by pippo on 14-10-22.
 * 薪资列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'attendanceTime', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, attendanceTime, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;}
            if(!$scope.$parent.$parent.attendanceTimeListOwn){
                return;
            }
            /*
             attendanceTimeId          //迟到早退条ID
             employeeName  //请假员工姓名
             employeeId     //请假员工Id 增
             attendanceTimeTypeId 迟到早退类型 （1迟到，2早退）
             attendanceTimeDateTime //迟到早退日期
             attendanceTimeDuration //迟到早退时长 （分钟计）
             comments //备注
             */
            $scope.searchData={
                beginTime : new Date().getFirstDateOfMonth().format('Y-m-d'),
                endTime:new Date().getLastDateOfMonth().format('Y-m-d')
            }
            var page = 1;
            $scope.hasManyData = false

            $scope.columnsModel = [
                {
                    field: 'attendanceTimeId',
                    displayName: '迟到早退条ID',
                    visible : false
                    //width:100
                },
                {

                    enableCellEdit : true,
                    field: 'attendanceTimeDateTime ',
                    displayName: '时间',
                    cellFilter : 'date:"yyyy年MM月dd日 hh:mm"',
                    editType:'datetime-local',
                    width:17
//                    editableCellTemplate : '<input ng-class="\'colt\' + col.index" ng-model="COL_FIELD" ng-input="COL_FIELD" type="datetime-local" style="width: 95%" value="COL_FIELD" ng-change="test(row.entity)"/>'
                },
                {
                    field: 'employeeId',
                    displayName: '员工id',
                    visible : false
                },
                {
                    width:13,
                    field: 'employeeName',
                    displayName: '员工姓名'
                    //width:100
                },
                {
                    width:13,
                    displayName: '上/下午'
                    //width:100
                },
                {
                    width:10,
                    field: 'attendanceTimeTypeId',
                    displayName: '迟到早退'
                },
                {
                    width:15,
                    field: 'attendanceTimeDuration',
                    displayName: '时长'
                },
                //-------------------------------------
                {
                    width:30,
                    enableCellEdit : true,
                    field: 'comments',
                    displayName: '备注'
                }
                ];



            $scope.loadGridData = function loadGridData(tag,hasMore){
                attendanceTime.listOwn($scope.searchData,page).success(function(response){
                    if(response.status){
                        if(hasMore){
                            Array.prototype.push.apply($scope.attendanceTimeOwnData,response.items);
                        }else{
                            $scope.attendanceTimeOwnData =[{
                                $editing:true,
                                attendanceTimeTypeId:1,
                                attendanceTimeDateTime:new Date().format('Y-m-dbH:i'),
                                employeeName:localStorage.employeeName,
                                employeeId:parseInt(localStorage.employeeId)
                            }];
                            Array.prototype.push.apply($scope.attendanceTimeOwnData,response.items);
                        }
                        $scope.hasManyData = response.hasMore
                        if(hasMore){
                            page +=1;
                        }else{
                            page =1;
                        }
                    }else{
                        SaveTooltip.showSaveTooltip(response)
                    }
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status)
                })
            }
            $scope.loadGridData('own')
            $scope.formatAttendanceTimeDuration = function(num){
                if(!num){
                    return;
                }
                if(Math.floor(num/60)){
                    return Math.floor(num/60)+'小时'+num%60+'分'
                }else{
                    return num%60+'分'
                }

            }
            $scope.editAttendanceTimeListOwn = function(row) {
                if(typeof(row.attendanceTimeDateTime)!='string'){
                    row.attendanceTimeDateTime = row.attendanceTimeDateTime.format('Y-m-dbH:i');
                }
                row.$editing = true;
            }
            $scope.saveAttendanceTimeListOwn = function(row) {
                $scope.attendanceTimeDuration(row);
                if(!row.attendanceTimeDuration||$scope.saveDisable){
                    return;
                }
                var data =row;
                if(typeof(row.attendanceTimeDateTime)!='string'){
                    data.attendanceTimeDateTime = row.attendanceTimeDateTime.format('Y-m-d h:i');
                }else{
                    data.attendanceTimeDateTime = row.attendanceTimeDateTime.replace('T',' ');
                }
                if(!data.comments){
                    data.comments = ''
                }
//                row.enableCellEdit = false;
                attendanceTime.save(data).success(function(response){
                    if(response.status){
//                        row.$editing = false;
//                        $scope.addDisable = false;
                        $scope.loadGridData('own');
                    }else{
                        SaveTooltip.showSaveTooltip(response)
                    }
                }).error(function(response,status){
//                    row.$editing = true;
                    SaveTooltip.showSaveTooltip(response,status)
                })

            }
//            $scope.deleteAttendanceTimeListOwn = function(row) {
//                if(row.attendanceTimeId){
//                    attendanceTime.deleteData(row.attendanceTimeId).success(function(response){
//                        if(response.status){
//                            $scope.loadGridData()
//                        }else{
//                            SaveTooltip.showSaveTooltip(response)
//                        }
//                    }).error(function(response,status){
//                        SaveTooltip.showSaveTooltip(response,status)
//                    });
//                }else{//静态数据删除
//                    $scope.attendanceTimeOwnData.splice($scope.attendanceTimeOwnData.indexOf(row),1);
//                }
//            }
            var morningWorkTimeMinute = config.systemArguments.morningWorkTime*60;
            var noonRestTimeMinute = config.systemArguments.noonRestTime*60;
            var afternoonWorkTimeMinute = config.systemArguments.afternoonWorkTime*60;
            var afternoonRestTimeMinute = config.systemArguments.afternoonRestTime*60;
            $scope.attendanceTimeDuration = function(attendanceTimeOwnItem){
                if(!attendanceTimeOwnItem.attendanceTimeDateTime){
                    return;
                }

                $scope.saveDisable=false;
                var minute = parseInt(attendanceTimeOwnItem.attendanceTimeDateTime.substr(11,2))*60+parseInt(attendanceTimeOwnItem.attendanceTimeDateTime.substr(14,2));
                if(morningWorkTimeMinute<minute&&minute<noonRestTimeMinute){//上午
                    if(attendanceTimeOwnItem.attendanceTimeTypeId==1){//迟到
                        attendanceTimeOwnItem.attendanceTimeDuration  = minute-morningWorkTimeMinute;
                    }else if(attendanceTimeOwnItem.attendanceTimeTypeId==2){//早退
                        attendanceTimeOwnItem.attendanceTimeDuration  = noonRestTimeMinute-minute;
                    }
                }else if(afternoonWorkTimeMinute<minute&&minute<afternoonRestTimeMinute){//下午
                    if(attendanceTimeOwnItem.attendanceTimeTypeId==1){//迟到
                        attendanceTimeOwnItem.attendanceTimeDuration =minute-afternoonWorkTimeMinute;
                    }else if(attendanceTimeOwnItem.attendanceTimeTypeId==2){//早退
                        attendanceTimeOwnItem.attendanceTimeDuration =afternoonRestTimeMinute-minute;
                    }
                }else{
                    SaveTooltip.showSaveTooltip({message:'错误时间'})
                    $scope.saveDisable = true;
                    return;
                }
                if(attendanceTimeOwnItem.attendanceTimeDuration>60){
                    SaveTooltip.showSaveTooltip({message:'不能超过一小时'})
                    $scope.saveDisable = true;
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.getAMorPM = function(dateStr){
                var minute = parseInt(dateStr.substr(11,2))*60+parseInt(dateStr.substr(14,2));
                if(morningWorkTimeMinute<minute&&minute<noonRestTimeMinute){//上午
                    return 'AM';
                }else if(afternoonWorkTimeMinute<minute&&minute<afternoonRestTimeMinute) {//下午
                    return 'PM';
                }
            }
        }];
});
