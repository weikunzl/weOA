/**
 * Created by pippo on 14-10-22.
 * 加班列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'workOvertime', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, workOvertime, SaveTooltip,DataBusiness) {
            if(!Auth.isLogined()){ return;};
            if(!$scope.$parent.$parent.listOwn){
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
            //选项卡1
            $scope.vm = {}
            $scope.vm.values = [
                {type: '审批中', id: [0,1,6]},
                {type: '已通过', id:  [4]},
                {type: '未通过', id: [5]}
            ];
            $scope.vm.selection = {};

            var page = 1;
            $scope.hasManyData = true;

            var searchPage = 1;
            $scope.searchData = {}
            $scope.searchData.beginTime = new Date().getFirstDateOfMonth().format('Y-m-d');
            $scope.searchData.endTime = new Date().getLastDateOfMonth().format('Y-m-d');

            $scope.employeeText1 = $scope.employeeId;
            $scope.data = [];


            $scope.loadGridDataOwn = function loadGridDataOwn(event,tag,getMore){
                    var selectInfo = [];
                    for(var i=0;i< $scope.vm.values.length;i++){
                        var value = $scope.vm.selection['checked'+$scope.vm.values[i]['id']];
                        if(value!=false){
                            Array.prototype.push.apply(selectInfo,$scope.vm.values[i]['id']);
                        }
                    }
                    if(getMore==true){
                        ++page;
                    }else{
                        $scope.data=[]
                        page=1;
                    }
//                        if(getMore){
//
//                        }

                    $scope.searchData.page = page;
                    $scope.searchData.status =selectInfo;

                    workOvertime.workOvertimeList($scope.searchData,tag).
                        success(function(response){
                            if(response.status){
                                //获取数据
//                                $scope.data = [];
                                angular.forEach(response.items, function(item){

                                    // item.Lessreason=item.reason.substr(0,20)
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
                                SaveTooltip.showSaveTooltip(response);
                            }
                            $scope.isLoading = false;
                        }).
                        error(function(response,status){
                            //提示
                            SaveTooltip.showSaveTooltip(response,status);
                            $scope.hasManyData = false;
                            $scope.isLoading = false;
                        });

            };
            $scope.listenCheck = function listenCheck(tag){
                $scope.loadGridDataOwn(null,'own');

            }
            //初始化数据
            $scope.$on("ownList",$scope.loadGridDataOwn)
            if($scope.$parent.$parent.listOwn&&($scope.$parent.$parent.seeSelf==1||!$scope.$parent.$parent.list)){
                $scope.loadGridDataOwn(null,'own')
            }

            //查询框回车事件
            $scope.enterSeacrh = function enterSeacrh(tag){
                if(event.keyCode == 13){
                    $scope.loadGridDataOwn(null,tag);
                }
            }




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

            //删除
            $scope.deleteItem = function deleteItem(item){
                item.isDelete = 1; //标识该数据被删除
                var formData = {};
                formData.extraWorkId  = item.extraWorkId ;
                workOvertime.workOvertimeDelete(formData.extraWorkId).
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
                            SaveTooltip.showSaveTooltip(response);
                            $scope.loadGridDataOwn(null,'own')
                        } else {
                            item.isDelete = 0;    //取消该数据的删除状态
                        }
                    }).
                    error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    });
                //刷新列表
                $scope.$root.$$phase || $scope.$apply();
                $scope.employeeSelection.extraWorkId =""
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
