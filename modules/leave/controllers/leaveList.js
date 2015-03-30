/**
 * Created by pippo on 14-10-22.
 * 请假列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'leave', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Leave, SaveTooltip,DataBusiness){

            if(!Auth.isLogined()){ return;};
            if(!$scope.$parent.$parent.list){
                return;
            }
            //权限验证
//            Auth()
            $scope.seeSelf = $routeParams.seeSelf;
            //获取请假类型
            $scope.leaveTypes=  Leave.leaveType();

            $scope.employeeId = parseInt(localStorage.employeeId)
            //判断用户类型改变视图
            $scope.positionId = parseInt(localStorage.positionId)
            //$scope.deptId = localStorage.deptId;
            $scope.passTypeList={
                0: '新增',
                1: '审批中',
                2: '审批中',
                3: '销假成功',
                4: '已通过',
                5: '未通过',
                6:'审批中'};

            var page2 = 1;
            //选项卡

                $scope.vm2 = {}
//                $scope.vm2.values = [
//                    {type: '需审批', id: [0,1,2,3,6]},
//                    {type: '已通过', id: [4]},
//                    {type: '驳回', id: [5]}
//                ];
//                $scope.vm2.selection = {};
                $scope.hasManyData2 = true;
                $scope.searchData2 = {}
                $scope.searchData2.leaveTypeId = [];
                $scope.searchData2.beginTime = new Date().getFirstDateOfMonth().format('Y-m-d');
                $scope.searchData2.endTime = new Date().getLastDateOfMonth().format('Y-m-d');

                $scope.data2 = [];

                $scope.passTypeList2={
                    0: '新增',
                    1: '需审批',
                    2: '销假审批',
                    3: '销假通过',
                    4: '已通过',
                    5: '未通过',
                    6:'需审批'};


            $scope.loadGridData = function loadGridData(event,tag,getMore){

                    if($scope.employeeSelection) {
                        $scope.employeeSelection.leaveId = ""
                    }

                    var selectInfo= [0,1,6];

//                    for(var i=0;i< $scope.vm2.values.length;i++){
//                        var value = $scope.vm2.selection['checked'+$scope.vm2.values[i]['id']];
//                        if(value!=false){
//                            Array.prototype.push.apply(selectInfo,$scope.vm.values[i]['id']);
//                        }
//                    }

//                    if($scope.selectDeptId){
//                        selectInfo =[4,5];//（绑定status必须为审核通过状态 0）
//                    }
                    if(getMore==true){
                        ++page2;
                    }else{
                        $scope.data2=[]
                        page2=1;
                    }
//                    var leaveTypeId2 = !$scope.$$childHead||!$scope.$$childHead.leaveTypeSelection2?0:$scope.$$childHead.leaveTypeSelection2.id;
                    $scope.searchData2.page = page2;
                    $scope.searchData2.status = selectInfo;
//                    $scope.searchData2.leaveTypeId = leaveTypeId2;
                    Leave.leaveList($scope.searchData2).
                        success(function(response){
                            if(response.status){
                                //获取数据
//                                $scope.data2 = [];
                                angular.forEach(response.items, function(item){

                                    // item.Lessreason=item.reason.substr(0,20)
                                    $scope.data2.push(item);
                                });

                                if(!response.hasMore){
                                    $scope.hasManyData2 = false;
                                }
                                if(response.hasMore){
                                    $scope.hasManyData2 = true;
                                }
                            }else
                            {
                                $scope.hasManyData2 = false;
                                //SaveTooltip.showSaveTooltip(response);
                            }
                            $scope.isLoading = false;
                        }).
                        error(function(response,status){
                            //提示
                            $scope.hasManyData2 = false;
                            SaveTooltip.showSaveTooltip(response,status);
                            $scope.isLoading = false;
                        });

            };

            $scope.checkAllLeaveType = function(checkAllLeaveTypeFlag,tag){

                $scope.searchData2.leaveTypeId =[];
                if(checkAllLeaveTypeFlag==undefined){
                    return;
                }
                if(!checkAllLeaveTypeFlag){
                    $.each($scope.leaveTypes,function(index,leaveType){
                        $scope.searchData2.leaveTypeId.push(leaveType.id)
                    })
                }
            }
            $scope.checkAllLeaveType(false);
            $scope.listenCheck = function listenCheck(tag){

                $scope.loadGridData();

            }

            //查询框回车事件
            $scope.enterSeacrh = function enterSeacrh(tag){
                if(event.keyCode == 13){
                    $scope.loadGridData(null,tag);
                }
            }

            //多选
            $scope.checkAll = function checkAll(chkall){
                $scope.employeeSelection.leaveId =""
                angular.forEach($scope.data2, function(value, key){
//                    if(value.disabled) {
                        value.employeeSelection = !chkall;

                        if (value.employeeSelection) {
                            $scope.employeeSelection.leaveId += value.leaveId + ',';
                        }
//                    }
                })
            }
            $scope.employeeSelection = {leaveId:''};
            $scope.toggleEmployeeSelection = function toggleEmployeeSelection(item){
                //多条操作过滤
//                if(!$scope.isPassed(item)){
//                    return;
//                }
                item.employeeSelection = !item.employeeSelection;
                if($scope.employeeSelection.leaveId.indexOf(item.leaveId)>-1){
                    $scope.employeeSelection.leaveId =$scope.employeeSelection.leaveId.replace(item.leaveId+',','');
                }else{
                    $scope.employeeSelection.leaveId +=item.leaveId+',';
                }

            };
            $scope.$on("list",$scope.loadGridData)
            if($scope.$parent.$parent.list&&$scope.$parent.$parent.seeSelf!=1){
                $scope.loadGridData();
            }
            //$scope.loadGridData();

            //按钮事件
            //驳回操作
            $scope.reject = function(item){
                var leaveId = [];
                if(!item.employeeName){//多选按钮
                    if($scope.employeeSelection.leaveId.length<2){
                        return;
                    }
                    leaveId = $scope.employeeSelection.leaveId.substring(0,$scope.employeeSelection.leaveId.length-1).split(',');
                }else{
                    leaveId.push(item.leaveId);
                }
                item.isDelete = 1; //标识该数据被删除
                var formData = {};
                formData.applyId  = leaveId;
                if( angular.isUndefined(item.resultReason)){
                    formData.resultReason=""
                } else{
                    formData.resultReason = item.resultReason;
                }
                formData.statusId=5;

                Leave.rejectData(formData).
                    success(function(response){
                        if(response.status){
                            //从列表中删除数据
//                            for(var i =0; i <$scope.data.length; i++){
//                                if($scope.data[i].leaveId  == item.leaveId ){
//                                    //从列表中删除该条数据
//                                    $scope.data.splice(i, 1);
//                                    break;
//                                }
//                            }
                            $scope.loadGridData()
//                            $scope.loadGridData('employeeList');
                            SaveTooltip.showSaveTooltip(response);
                        } else {
                            item.isDelete = 0;    //取消该数据的删除状态
                        }
                    }).
                    error(function(response,status){
                        item.isDelete = 0;    //取消该数据的删除状态
                        SaveTooltip.showSaveTooltip(response,status);
                    });
                //刷新列表
                $scope.$root.$$phase || $scope.$apply();
                $scope.employeeSelection.leaveId =""
            };

            //同意操作
            $scope.pass = function(item){
                var leaveId = [];
                if(!item.employeeName){//多选按钮
                    if($scope.employeeSelection.leaveId.length<2){
                        return;
                    }
                    leaveId = $scope.employeeSelection.leaveId.substring(0,$scope.employeeSelection.leaveId.length-1).split(',');
                }else{
                    leaveId.push(item.leaveId);
                }

                item.isDelete = 1; //标识该数据被删除
                var formData = {};
                formData.applyId  = leaveId;
                if( angular.isUndefined(item.resultReason)){
                    formData.resultReason=""
                } else{
                    formData.resultReason = item.resultReason;
                }

                formData.statusId=4;

                Leave.passData(formData).
                    success(function(response){
                        if(response.status){
                            //从列表中删除数据
//                            for(var i =0; i <$scope.data.length; i++){
//                                if($scope.data[i].leaveId  == item.leaveId ){
//                                    //从列表中删除该条数据
//                                    $scope.data.splice(i, 1);
//                                    break;
//                                }
//                            }
                            $scope.loadGridData()
//                            $scope.loadGridData('employeeList');
                            SaveTooltip.showSaveTooltip(response);
                        } else {
                            item.isDelete = 0;    //取消该数据的删除状态
                        }
                    }).
                    error(function(response,status){
                        item.isDelete = 0;    //取消该数据的删除状态
                        SaveTooltip.showSaveTooltip(response,status);
                    });
                //刷新列表
                $scope.$root.$$phase || $scope.$apply();
                $scope.employeeSelection.leaveId =""
            };


            //数据轨迹
            $scope.showTrackData = function showTrackData(id){
                Leave.trackList(id).
                    success(function(response){
                        if(response.status){
                            //轨迹列表模态窗口
                            var modalPromise = $modal({
                                template: 'dataTrack.html'
                                , persist: true
                                , show: false
                                , backdrop: 'static'
                                , scope: $scope
                            });

                            var modal = $q.when(modalPromise);
                            modal.then(function(modalEl){
                                modalEl.modal('show');
                            });

                            $scope.trackData = [];
                            angular.forEach(response.items, function(item){
                                item.statusName = DataBusiness.showStatusToName(item.status);
                                if(item.statusId==0){
                                    item.statusId="新增"
                                }else
                                if(item.statusId==1){
                                    item.statusId="编辑"
                                }else
                                if(item.statusId==2){
                                    item.statusId="销假"
                                }else
                                if(item.statusId==3){
                                    item.statusId="销假完成"
                                }else
                                if(item.statusId==4){
                                    item.statusId="通过"
                                }else
                                if(item.statusId==5){
                                    item.statusId="驳回"
                                }else
                                if(item.statusId==6){
                                    item.statusId="审批中"
                                }
                                $scope.trackData.push(item);
                            });
                        }
                    }).
                    error(function(response,status){
                        SaveTooltip.showSaveTooltip(response);
                    })
            };
            $scope.searchDataLeaveType = function(id,item){
                if(!item.leaveTypeId){
                    item.leaveTypeId = [id]
                    return;
                }
                if(item.leaveTypeId.indexOf(id)>-1){
                    item.leaveTypeId.splice(item.leaveTypeId.indexOf(id),1);
                }else{
                    item.leaveTypeId.push(id);
                }
            }

            $scope.parseDate = function(str){
                if(typeof(str)=='string' ){
                    return Date.parse(str,'Y-m-d H:i');
                }else{
                    return str;
                }
            }
            $scope.parseDateWeek = function(str){
                if(typeof(str)=='string' ){
                    return Date.parseDate(str,'Y-m-d H:i:s').getShortDayNameByDateCN();
                }else{
                    return str.getShortDayNameByDateCN();
                }
            }
//
//            //从URL参数判断默认加载的数据
//            if( angular.isUndefined($scope.id)||$scope.id==""){
//                $scope.downloadData();
//            }
//            else{
//                $scope.downloadOtherData();
//            }
//

        }];
});