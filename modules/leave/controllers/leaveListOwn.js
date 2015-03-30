/**
 * Created by pippo on 14-10-22.
 * 请假列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'leave', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Leave, SaveTooltip,DataBusiness){

            if(!Auth.isLogined()){ return;};
            //权限验证
//            Auth()
           if(!$scope.$parent.$parent.listOwn){
               return;
           }
            $scope.seeSelf = $routeParams.seeSelf;
            //获取请假类型
            $scope.leaveTypes=  $scope.$parent.$parent.leaveTypes;

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

            //选项卡1
            $scope.vm = {}
            $scope.vm.values = [
                {type: '审批中', id: [0,1,2,6]},
                {type: '已通过', id:  [4]},
                {type: '未通过', id: [5]},
                {type: '销假完成', id: [3]}
            ];
            $scope.vm.selection = {};

            var page = 1;
            $scope.hasManyData = true;

            var searchPage = 1;

            $scope.searchData = {}
            $scope.searchData.leaveTypeId = [];
            $scope.searchData.beginTime = new Date().getFirstDateOfMonth().format('Y-m-d');
            $scope.searchData.endTime = new Date().getLastDateOfMonth().format('Y-m-d');

            $scope.employeeText = $scope.employeeId;
            $scope.data = [];
            var page2 = 1;
            //选项卡2

            $scope.loadGridDataOwn = function loadGridDataOwn(event,tag,getMore){
                    var selectInfo = [];
                    for(var i=0;i< $scope.vm.values.length;i++){
                        var value = $scope.vm.selection['checked'+$scope.vm.values[i]['id']];
                        if(value!=false){
                            Array.prototype.push.apply(selectInfo,$scope.vm.values[i]['id']);
                        }
                    }
                    if(getMore==true){
                        page+=1;
                    }else{
                        $scope.data=[]
                        page=1;
                    }
//                    var leaveTypeId = !$scope.$$childHead||!$scope.$$childHead.leaveTypeSelection?0:$scope.$$childHead.leaveTypeSelection.id;
                    $scope.searchData.page = page;
//                    $scope.searchData.leaveTypeId = leaveTypeId;
                    $scope.searchData.status = selectInfo;
//                    $scope.searchData.invalid = $scope.searchData.invalid ?1:0;

                    Leave.leaveList($scope.searchData,tag).
                        success(function(response){
                            if(response.status){
                                //获取数据
                                //$scope.data = [];
                                angular.forEach(response.items, function(item){
                                    //item.Lessreason=item.reason.substr(0,20)
                                    $scope.data.push(item);
                                });
                                if(!response.hasMore){
                                    $scope.hasManyData = false;
                                }
                                if(response.hasMore){
                                    $scope.hasManyData = true;
                                }
                            }else
                            {
                                $scope.hasManyData = false;
                                //SaveTooltip.showSaveTooltip(response);
                            }
                            $scope.isLoading = false;
                        }).
                        error(function(response,status){

                            //提示
                            $scope.hasManyData = false;
                            SaveTooltip.showSaveTooltip(response,status);
                            $scope.isLoading = false;
                        });

            };

            $scope.checkAllLeaveType = function(checkAllLeaveTypeFlag,tag){

                $scope.searchData.leaveTypeId = [];
                if (checkAllLeaveTypeFlag == undefined) {
                    return;
                }
                if (!checkAllLeaveTypeFlag) {
                    $.each($scope.leaveTypes, function (index, leaveType) {
                        $scope.searchData.leaveTypeId.push(leaveType.id)
                    })
                }
            }
//            $scope.checkAllLeaveType(false,'employeeList');
            $scope.checkAllLeaveType(false,'own');
//            $scope.checkAllLeaveType(false);
            $scope.listenCheck = function listenCheck(tag){

                    $scope.loadGridDataOwn(null,'own');

            }

            //查询框回车事件
            $scope.enterSeacrh = function enterSeacrh(tag){
                if(event.keyCode == 13){
                    $scope.loadGridDataOwn(null,tag);
                }
            }

            //多选
//            $scope.checkAll = function checkAll(chkall){
//                $scope.employeeSelection.leaveId =""
//                angular.forEach($scope.data2, function(value, key){
////                    if(value.disabled) {
//                        value.employeeSelection = !chkall;
//
//                        if (value.employeeSelection) {
//                            $scope.employeeSelection.leaveId += value.leaveId + ',';
//                        }
////                    }
//                })
//            }
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

//            $scope.isPassed = function isPassed(item){
//                item.disabled = item.statusId !=4 &&item.statusId !=6 &&item.statusId !=5
//                return item.disabled;
//            }

            $scope.$on("ownList",$scope.loadGridDataOwn)
            if($scope.$parent.$parent.listOwn&&($scope.$parent.$parent.seeSelf==1||!$scope.$parent.$parent.list)){
                $scope.loadGridDataOwn(null,'own')
            }
//            $scope.loadGridDataOwn('own');


//

            //删除
            $scope.deleteItem = function(item){
                item.isDelete = 1; //标识该数据被删除
                var formData = {};
                formData.leaveId = item.leaveId;
                Leave.leaveDelete(formData.leaveId).
                    success(function(response){
                        if(response.status){
                            //从列表中删除数据
//                            for(var i =0; i <$scope.data.length; i++){
//                                if($scope.data[i].leaveId == item.leaveId){
//                                    //从列表中删除该条数据
//                                    $scope.data.splice(i, 1);
//                                    break;
//                                }
//                            }
                            $scope.loadGridDataOwn(null,'own')
                            SaveTooltip.showSaveTooltip(response);
                        } else {
                            item.isDelete = 0;    //取消该数据的删除状态
                        }
                    }).
                    error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    });
                //刷新列表
                $scope.$root.$$phase || $scope.$apply();
            };
            //销假
            $scope.removeLeave = function removeLeave(leaveItem){
                $.confirm({
                    text: "若未正常休假，请选择销假修改",
                    title: "销假操作",
                    confirm: function(button) {
                        Leave.leaveRemove(leaveItem.leaveId).success(function(response){
                            //do nothing
                            $scope.loadGridDataOwn(null,'own');
                        }).error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status);
                        });
                    },
                    cancel: function(button) {
                       window.location= '#!/leave/remove/'+leaveItem.leaveId ;
                    },
                    confirmButton: "完成销假",
                    cancelButton: "销假修改",
                    post: true,
                    confirmButtonClass: "btn-success"
                });
            }

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
                                }
                                if(item.statusId==1){
                                    item.statusId="编辑"
                                }
                                if(item.statusId==2){
                                    item.statusId="销假"
                                }
                                if(item.statusId==3){
                                    item.statusId="销假完成"
                                }
                                if(item.statusId==4){
                                    item.statusId="通过"
                                }
                                if(item.statusId==5){
                                    item.statusId="驳回"
                                }
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