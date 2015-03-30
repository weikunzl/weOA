/**
 * Created by pippo on 14-10-22.
 * 加班列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'workOvertime', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, workOvertime, SaveTooltip,DataBusiness) {
            if(!Auth.isLogined()){ return;};
            if(!$scope.$parent.$parent.list){
                return;
            }
            $scope.seeSelf = $routeParams.seeSelf;
            $scope.employeeId = parseInt(localStorage.employeeId)
            //判断用户类型改变视图
            $scope.positionId = parseInt(localStorage.positionId)
//            $scope.isNormalEmployee = (localStorage.positionId == config.systemArguments.roleNormalEmployeeId);
            $scope.deptId = localStorage.deptId;

//            $scope.passTypeList=[
//                {type: '审批中', id: 0},
//                {type: '审批中', id: 1},
//                {type: '审批中', id: 2},
//                {type: '审批中', id: 3},
//                {type: '已通过', id: 4},
//                {type: '未通过', id: 5},
//                {type: '审批中', id: 6}
//            ]
            $scope.passTypeList = function passTypeList(statusId){
                if(statusId==4){
                    return "已通过";
                }else if(statusId==0){
                    return "新增" ;
                }else if(statusId==5){
                    return "未通过";
                }else{
                    return "审批中" ;
                }
            }
            $scope.passTypeList2 = function passTypeList2(statusId){
                if(statusId==4){
                    return "已通过";
                }else if(statusId==0){
                    return "新增" ;
                }else if(statusId==5){
                    return "已驳回";
                }else{
                    return "需审批" ;
                }
            }
//            $scope.passTypeList2 = [
//            {type: '需审批', id: 0},
//                {type: '需审批', id: 1},
//                {type: '需审批', id: 2},
//                {type: '需审批', id: 3},
//                {type: '', id: 4},
//                {type: '已驳回', id: 5},
//                {type: '需审批', id: 6}
//            ]
//            if(r)
            //选项卡2

            var page2 = 1;
            $scope.vm2 = {}
            $scope.vm2.values = [
                {type: '需审批', id: [0,1,6]},
                {type: '已通过', id: [4]},
                {type: '驳回', id: [5]}
            ];
            $scope.vm2.selection = {};
            $scope.hasManyData2 = true;

            $scope.searchData2 = {}
            $scope.searchData2.beginTime = new Date().getFirstDateOfMonth().format('Y-m-d');
            $scope.searchData2.endTime = new Date().getLastDateOfMonth().format('Y-m-d');
            $scope.searchData2.employeeText = "";

            $scope.data2 = [];

            $scope.loadGridData = function loadGridData(tag,getMore){

                    if($scope.employeeSelection){
                        $scope.employeeSelection.extraWorkId =""
                    }

                    var selectInfo= [0,1,6];

//                    for(var i=0;i< $scope.vm2.values.length;i++){
//                        var value = $scope.vm2.selection['checked'+$scope.vm2.values[i]['id']];
//                        if(value!=false){
//                            Array.prototype.push.apply(selectInfo,$scope.vm.values[i]['id']);
//                        }
//                    }
                    if(getMore==true){
                        ++page2;
                    }else{
                        $scope.data2=[]
                        page2=1;
                    }
//                    if($scope.selectDeptId){
//                        selectInfo =[4,5];//（绑定status必须为审核通过状态 0）
//                    }
                    $scope.searchData2.page= page2;
                    $scope.searchData2.deptId= 0;
//                    $scope.searchData2.employeeText ;
                    $scope.searchData2.status = selectInfo

                    workOvertime.workOvertimeList($scope.searchData2,tag).
                        success(function(response){
                            if(response.status){
                                //获取数据
                                $scope.data2 = [];
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
                                SaveTooltip.showSaveTooltip(response);
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
            $scope.listenCheck = function listenCheck(tag){
                $scope.loadGridData();
            }

            //初始化数据
            $scope.$on("list",$scope.loadGridData)
            if($scope.$parent.$parent.list&&$scope.$parent.$parent.seeSelf!=1){
                $scope.loadGridData();
            }

            //查询框回车事件
            $scope.enterSeacrh = function enterSeacrh(tag){
                if(event.keyCode == 13){
                    $scope.loadGridData(tag);
                }
            }

            //多选
            $scope.checkAll = function checkAll(chkall){
                $scope.employeeSelection.extraWorkId =""
                angular.forEach($scope.data2, function(value, key){
//                    if(value.disabled){
                        value.employeeSelection = !chkall;
                        if(value.employeeSelection){
                            $scope.employeeSelection.extraWorkId +=value.extraWorkId+',';
                        }
//                    }

                })
            }
            $scope.employeeSelection = {extraWorkId:''};
            $scope.toggleEmployeeSelection = function toggleEmployeeSelection(item){
                //多条操作过滤
//                if(!$scope.isPassed(item)){
//                    return;
//                }
                item.employeeSelection = !item.employeeSelection;
                if($scope.employeeSelection.extraWorkId.indexOf(item.extraWorkId)>-1){
                    $scope.employeeSelection.extraWorkId =$scope.employeeSelection.extraWorkId.replace(item.extraWorkId+',','');
                }else{
                    $scope.employeeSelection.extraWorkId +=item.extraWorkId+',';
                }

            };
//
//              $scope.isPassed = function isPassed(item){
//                  item.disabled = item.statusId !=4 &&item.statusId !=6 &&item.statusId !=5
//                  return item.disabled;
//              }
            //驳回操作
            $scope.reject = function(item){
                var extraWorkId = [];
                if(!item.employeeName){//多选按钮
                    if($scope.employeeSelection.extraWorkId.length<2){
                        return;
                    }
                    extraWorkId = $scope.employeeSelection.extraWorkId.substring(0,$scope.employeeSelection.extraWorkId.length-1).split(',');
                }else{
                    extraWorkId.push(item.extraWorkId);
                }
                item.isDelete = 1; //标识该数据被删除
                var formData = {};
                formData.extraWorkId  = extraWorkId;
                if( angular.isUndefined(item.resultReason)){
                    formData.resultReason=""
                } else{
                    formData.resultReason = item.resultReason;
                }
                formData.statusId=5;

                workOvertime.rejectData(formData).
                    success(function(response){
                        if(response.status){
                            //从列表中删除数据
//                            for(var i =0; i <$scope.data.length; i++){
//                                if($scope.data[i].extraWorkId  == item.extraWorkId ){
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
            };

            //同意操作
            $scope.pass = function(item){
                var extraWorkId = [];
                if(!item.employeeName){//多选按钮
                    if($scope.employeeSelection.extraWorkId.length<2){
                        return;
                    }
                    extraWorkId = $scope.employeeSelection.extraWorkId.substring(0,$scope.employeeSelection.extraWorkId.length-1).split(',');
                }else{
                    extraWorkId.push(item.extraWorkId);
                }
                item.isDelete = 1; //标识该数据被删除
                var formData = {};
                formData.extraWorkId  = extraWorkId;
                if( angular.isUndefined(item.resultReason)){
                    formData.resultReason=""
                } else{
                    formData.resultReason = item.resultReason;
                }

                formData.statusId=4;

                workOvertime.passData(formData).
                    success(function(response){
                        if(response.status){
                            //从列表中删除数据
//                            for(var i =0; i <$scope.data.length; i++){
//                                if($scope.data[i].extraWorkId  == item.extraWorkId ){
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
                $scope.employeeSelection.extraWorkId =""
            };


            //数据轨迹
            $scope.showTrackData = function showTrackData(id){
                workOvertime.trackList(id).
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
                                if(item.statusId==5){
                                    item.statusId="驳回"
                                }
                                if(item.statusId==4){
                                    item.statusId="通过"
                                }
                                $scope.trackData.push(item);
                            });
                        }
                    }).
                    error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    })
            };

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

        }];
});
