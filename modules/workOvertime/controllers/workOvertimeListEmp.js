/**
 * Created by pippo on 14-10-22.
 * 加班列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'workOvertime', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, workOvertime, SaveTooltip,DataBusiness) {
            if(!Auth.isLogined()){ return;};
            if(!$scope.$parent.$parent.listEmp){
                return;
            }
            $scope.seeSelf = $routeParams.seeSelf;
            $scope.employeeId = parseInt(localStorage.employeeId)
            //判断用户类型改变视图
            $scope.positionId = parseInt(localStorage.positionId)
            $scope.isNormalEmployee = (localStorage.positionId == config.systemArguments.roleNormalEmployeeId);
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

            //选项卡3
            var page3 = 1;
            $scope.vm3 = {}
            $scope.vm3.values = [
                {type: '需审批', id: [0,1,6]},
                {type: '已通过', id: [4,3,2]},
                {type: '驳回', id: [5]}
            ];
            $scope.vm3.selection = {};
            $scope.hasManyData3 = true;

            $scope.searchData3 = {}
            $scope.searchData3.beginTime = new Date().getFirstDateOfMonth().format('Y-m-d');
            $scope.searchData3.endTime = new Date().getLastDateOfMonth().format('Y-m-d');
            $scope.searchData3.employeeText = "";

            $scope.data3 = [];

            $scope.loadGridDataEmp = function loadGridDataEmp(event,tag,getMore){

                    if($scope.employeeSelection){
                        $scope.employeeSelection.extraWorkId =""
                    }

                    var selectInfo= [];

                    for(var i=0;i< $scope.vm3.values.length;i++){
                        var value = $scope.vm3.selection['checked'+$scope.vm3.values[i]['id']];
                        if(value!=false){
                            Array.prototype.push.apply(selectInfo,$scope.vm3.values[i]['id']);
                        }
                    }
                    if(getMore==true){
                        ++page3;
                    }else{
                        $scope.data3=[]
                        page3=1;
                    }
//                    if($scope.selectDeptId){
//                        selectInfo =[4,5];//（绑定status必须为审核通过状态 0）
//                    }
                    $scope.searchData3.page= page3;
                    $scope.searchData3.deptId= 0;
                    $scope.searchData3.status = selectInfo

                    workOvertime.workOvertimeList($scope.searchData3,tag).
                        success(function(response){
                            if(response.status){
                                //获取数据
                                angular.forEach(response.items, function(item){

                                    // item.Lessreason=item.reason.substr(0,20)
                                    $scope.data3.push(item);
                                });

                                if(!response.hasMore){
                                    $scope.hasManyData3 = false;
                                }
                                if(response.hasMore){
                                    $scope.hasManyData3 = true;
                                }
                            }else
                            {
                                SaveTooltip.showSaveTooltip(response);
                            }
                            $scope.isLoading = false;
                        }).
                        error(function(response,status){
                            //提示
                            SaveTooltip.showSaveTooltip(response,status);
                            $scope.hasManyData3 = false;
                            $scope.isLoading = false;
                        });


            };
            $scope.listenCheck = function listenCheck(tag){
                 $scope.loadGridDataEmp(null,'employeeList');
            }

            $scope.$on("employeeList",$scope.loadGridDataEmp)
            if($scope.$parent.$parent.list&&!$scope.$parent.$parent.list&&!$scope.$parent.$parent.listOwn){
                $scope.loadGridDataEmp(null,'employeeList');
            }            //查询框回车事件
            $scope.enterSeacrh = function enterSeacrh(tag){
                if(event.keyCode == 13){
                    $scope.loadGridDataEmp(null,tag);
                }
            }


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
//                            $scope.loadGridDataEmp()
                            $scope.loadGridDataEmp(null,'employeeList');
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
