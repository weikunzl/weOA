/**
 * Created by pippo on 14-10-22.
 * 薪资列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'attendanceTime', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, attendanceTime, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;}

            /*
             attendanceTimeId          //迟到早退条ID
             employeeName  //请假员工姓名
             employeeId     //请假员工Id 增
             attendanceTimeTypeId 迟到早退类型 （1迟到，2早退）
             attendanceTimeDateTime //迟到早退日期
             attendanceTimeDuration //迟到早退时长 （分钟计）
             comments //备注
             */
            var month ;
            $scope.own = {
                selectedInfo : $scope.$parent.selectedInfoItem
            }
            if(typeof $scope.own.selectedInfo.time == "string"){
                month = Date.parseDate($scope.own.selectedInfo.time,'Y-m-d');
            }else{
                month = $scope.own.selectedInfo.time
            }

//            var authViewList = config.authViewList;
//            var authParentIndex = config.menuList.indexOf('modules/pay')
////            var moduleList = ['add','listTabs','listOwn','list','listEmp','leaveEdit','leaveEdit2','attendanceTimeTab','attendanceTimeList','attendanceTimeListOwn','attendanceTimeListEdit']
//            for(var i=0;i<authViewList.authDir.length;i++){
//                if(Math.floor(authViewList.authDir[i]/1000)==(authParentIndex+1)){
//                    if(authViewList.authDir[i]%1000-1>=moduleList.length){
//                        console.error('auth,error')
//                        continue;
//                    }
//                    $scope[moduleList[parseInt(authViewList.authDir[i]%1000)-1]] = true;
//                }
//            }

            $scope.authFlag = {}
            var authViewList = config.authViewList;
            var numDeptListIndex = 0;
            var authFieldList = ['payListOwn','payListAdjustment','releaseSalaryAuth'];
            var authParentIndex = config.menuList.indexOf('modules/pay')
            for(var i=0;i<authViewList.authField.length;i++){
                if(Math.floor(authViewList.authField[i]/1000000)==(authParentIndex+1)&&Math.floor(authViewList.authField[i]/1000)==((numDeptListIndex+1)+(authParentIndex+1)*1000)){
                    $scope.authFlag[authFieldList[parseInt(authViewList.authField[i]%1000000%1000)-1]] = true;
                }
            }
            var selectedInfo ;
            $scope.isGM = function isGM(){//是否有管理权限
                if($scope.authFlag.payListAdjustment){
                    selectedInfo = $scope.own.selectedInfo
                    return true;
                }else if($scope.authFlag.payListOwn){
                    selectedInfo = {
                        employeeId: parseInt(localStorage.employeeId),
                        employeeName : localStorage.employeeName
                    }
                    return false;
                }
                return false;
            }
            $scope.searchData={
                month : month.format('Y-m')

//                endTime:new Date().getLastDateOfMonth().format('Y-m-d')
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



            $scope.loadGridData = function loadGridData(hasMore){
                if($scope.isGM()){
                    $scope.searchData.employeeId = selectedInfo.employeeId
                    attendanceTime.listEdit($scope.searchData,page).success(function(response){
                        if(response.status){
                            if(hasMore){
                                Array.prototype.push.apply($scope.attendanceTimeOwnData,response.items);
                            }else{
                                $scope.attendanceTimeOwnData =response.items;
                            }
                            $scope.hasManyData = response.hasMore
                            if(hasMore){
                                page +=1;
                            }else{
                                page =1;
                            }
                            $scope.attendanceTimeOwnData.push({
                                $editing:true,
                                attendanceTimeTypeId:1,
                                attendanceTimeDateTime:new Date().format('Y-m-dbH:i'),
                                employeeName:selectedInfo.employeeName,
                                employeeId:selectedInfo.employeeId
                            });
                        }else{
                            SaveTooltip.showSaveTooltip(response)
                        }
                    }).error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status)
                    })
                }else{

                    $scope.searchData ={
                        beginTime:month.getFirstDateOfMonth().format('Y-m-d'),
                        endTime:month.getLastDateOfMonth().format('Y-m-d')
                    }
                    attendanceTime.listOwn($scope.searchData,page).success(function(response){
                        if(response.status){
                            if(hasMore){
                                Array.prototype.push.apply($scope.attendanceTimeOwnData,response.items);
                            }else{
                                $scope.attendanceTimeOwnData =response.items;
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

            }
//            $scope.attendanceTimeOwnData=[{
////                $editing:true,
//                attendanceTimeDateTime:new Date().getFirstDateOfMonth(),
//                attendanceTimeTypeId :1,
//                attendanceTimeDuration:15,
//                employeeName:$scope.$parent.selectedInfo.employeeName,
//                employeeId:$scope.$parent.selectedInfo.employeeId
//            },{
////                $editing:true,
//                attendanceTimeDateTime:new Date(),
//                attendanceTimeTypeId :2,
//                attendanceTimeDuration:66,
//                employeeName:$scope.$parent.selectedInfo.employeeName,
//                employeeId:$scope.$parent.selectedInfo.employeeId
//            },{
////                $editing:true,
//                attendanceTimeDateTime:new Date().getLastDateOfMonth(),
//                attendanceTimeTypeId :2,
//                attendanceTimeDuration:100,
//                employeeName:$scope.$parent.selectedInfo.employeeName,
//                employeeId:localStorage.employeeId
//            },{
////                $editing:true,
//                attendanceTimeDateTime:new Date().getFirstDateOfMonth(),
//                attendanceTimeTypeId :1,
//                attendanceTimeDuration:15,
//                employeeName:$scope.$parent.selectedInfo.employeeName,
//                employeeId:$scope.$parent.selectedInfo.employeeId
//            }]
            $scope.loadGridData()
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
            $scope.addAttendanceTimeListOwn = function(){
                $scope.addDisable = true;
                if(!$scope.attendanceTimeOwnData){
                    $scope.attendanceTimeOwnData = []
                }
                $scope.attendanceTimeOwnData.push({
                    $editing:true,
                    attendanceTimeTypeId:1,
                    attendanceTimeDateTime:new Date().format('Y-m-dbH:i'),
                    employeeName:selectedInfo.employeeName,
                    employeeId:selectedInfo.employeeId
                });
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }

            $scope.editAttendanceTimeListOwn = function(row) {
                if(!$scope.isGM()){
                    return;
                }
                if(typeof(row.attendanceTimeDateTime)!='string'){
                    row.attendanceTimeDateTime = row.attendanceTimeDateTime.format('Y-m-dbH:i');
                }else if(row.attendanceTimeDateTime.indexOf('T')<0){
                    row.attendanceTimeDateTime = row.attendanceTimeDateTime.replace(' ','T');
                }
                row.$editing = true;
            }
            $scope.saveAttendanceTimeListOwn = function(row) {
//                row.enableCellEdit = false;
                $scope.attendanceTimeDuration(row)
                if(!row.attendanceTimeDuration||$scope.$parent.errorTip!=''){
                    return
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
                attendanceTime.save(data).success(function(response){
                    if(response.status){
                        $scope.addDisable = false;
                        $scope.loadGridData();
                    }else{
                        SaveTooltip.showSaveTooltip(response)
                    }
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status)
                })
            }
            $scope.deleteAttendanceTimeListOwn = function(row) {
                if(row.attendanceTimeId){
                    attendanceTime.deleteData(row.attendanceTimeId).success(function(response){
                        if(response.status){
                            $scope.loadGridData()
                        }else{
                            SaveTooltip.showSaveTooltip(response)
                        }
                    }).error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status)
                    });
                }else{//静态数据删除
                    $scope.attendanceTimeOwnData.splice($scope.attendanceTimeOwnData.indexOf(row),1);
                    $scope.attendanceTimeOwnData.push({
                        $editing:true,
                        attendanceTimeTypeId:1,
                        attendanceTimeDateTime:new Date().format('Y-m-dbH:i'),
                        employeeName:selectedInfo.employeeName,
                        employeeId:selectedInfo.employeeId
                    });
                }
            }
            var morningWorkTimeMinute = config.systemArguments.morningWorkTime*60;
            var noonRestTimeMinute = config.systemArguments.noonRestTime*60;
            var afternoonWorkTimeMinute = config.systemArguments.afternoonWorkTime*60;
            var afternoonRestTimeMinute = config.systemArguments.afternoonRestTime*60;
            $scope.attendanceTimeDuration = function(row){
                $scope.$parent.errorTip=''
                if(!row.attendanceTimeDateTime){
                    return;
                }
                var minute = parseInt(row.attendanceTimeDateTime.substr(11,2))*60+parseInt(row.attendanceTimeDateTime.substr(14,2));
                if(morningWorkTimeMinute<minute&&minute<noonRestTimeMinute){//上午
                    if(row.attendanceTimeTypeId==1){//迟到
                        row.attendanceTimeDuration=minute-morningWorkTimeMinute;
                    }else if(row.attendanceTimeTypeId==2){//早退
                        row.attendanceTimeDuration=noonRestTimeMinute-minute;
                    }
                }else if(afternoonWorkTimeMinute<minute&&minute<afternoonRestTimeMinute){//下午
                    if(row.attendanceTimeTypeId==1){//迟到
                        row.attendanceTimeDuration=minute-afternoonWorkTimeMinute;
                    }else if(row.attendanceTimeTypeId==2){//早退
                        row.attendanceTimeDuration=afternoonRestTimeMinute-minute;
                    }
                }else{
                   $scope.$parent.errorTip='错误时间';
                    return;
                }
                if(row.attendanceTimeDuration>60){
                    $scope.$parent.errorTip='不能超过一小时';
                    return;
                }
                //早上
                //中午
                //下午上班
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
