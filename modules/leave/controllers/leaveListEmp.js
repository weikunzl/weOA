/**
 * Created by pippo on 14-10-22.
 * 请假列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'leave', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Leave, SaveTooltip,DataBusiness){

            if(!Auth.isLogined()){ return;};
            if(!$scope.$parent.$parent.listEmp){
                return;
            }
            //权限验证
//            Auth()
            $scope.seeSelf = $routeParams.seeSelf;

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


            //选项卡3
            $scope.vm3 = {}
            $scope.vm3.values = [
                {type: '审批中', id: [0,1,2,6]},
                {type: '已通过', id:  [4]},
                {type: '未通过', id: [5]},
                {type: '销假完成', id: [3]}
            ];
            $scope.vm3.selection = {};

            var page3 = 1;
            $scope.hasManyData3 = true;

            var searchPage3 = 1;

            $scope.searchData3 = {}
            $scope.searchData3.leaveTypeId=[];
            $scope.searchData3.beginTime = new Date().getFirstDateOfMonth().format('Y-m-d');
            $scope.searchData3.endTime = new Date().getLastDateOfMonth().format('Y-m-d');

            $scope.data3 = [];
            $scope.loadGridDataEmp = function loadGridDataEmp(event,tag,getMore){

                    var format = function format(item){
                        return item.type
                    }
//                    $scope.leaveTypesConfig = {
//                        data :{results:$scope.leaveTypes,text:'type'},
//                        formatSelection : format,
//                        formatResult : format
//                    }

                    var selectInfo = [];
                    for(var i=0;i< $scope.vm3.values.length;i++){
                        var value = $scope.vm3.selection['checked'+$scope.vm3.values[i]['id']];
                        if(value!=false){
                            Array.prototype.push.apply(selectInfo,$scope.vm3.values[i]['id']);
                        }
                    }
                    if(getMore==true){
                        page3+=1;
                    }else{
                        $scope.data3=[]
                        page3=1;
                    }
//                    var leaveTypeId = !$scope.$$childHead||!$scope.$$childHead.leaveTypeSelection3?0:$scope.$$childHead.leaveTypeSelection3.id;
                    $scope.searchData3.page = page3;
//                    $scope.searchData3.leaveTypeId = leaveTypeId;
                    $scope.searchData3.status = selectInfo;
                    Leave.leaveList($scope.searchData3,tag).
                        success(function(response){
                            if(response.status){
                                //获取数据
                                //$scope.data = [];
                                angular.forEach(response.items, function(item){
                                    //item.Lessreason=item.reason.substr(0,20)
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
                                $scope.hasManyData3 = false;
                                //SaveTooltip.showSaveTooltip(response);
                            }
                            $scope.isLoading3 = false;
                        }).
                        error(function(response,status){

                            //提示
                            $scope.hasManyData3 = false;
                            SaveTooltip.showSaveTooltip(response,status);
                            $scope.isLoading3 = false;
                        });

            };

            $scope.checkAllLeaveType = function(checkAllLeaveTypeFlag,tag){
                $scope.searchData3.leaveTypeId =[];
                if(checkAllLeaveTypeFlag==undefined){
                    return;
                }
                if(!checkAllLeaveTypeFlag){
                    $.each($scope.leaveTypes,function(index,leaveType){
                        $scope.searchData3.leaveTypeId.push(leaveType.id)
                    })
                }

            }
            $scope.checkAllLeaveType(false,'employeeList');
            $scope.listenCheck = function listenCheck(tag){
                $scope.loadGridDataEmp(null,'employeeList');
            }

            //查询框回车事件
            $scope.enterSeacrh = function enterSeacrh(tag){
                if(event.keyCode == 13){
                    $scope.loadGridDataEmp(null,tag);
                }
            }

            $scope.$on("employeeList",$scope.loadGridDataEmp)
            if($scope.$parent.$parent.list&&!$scope.$parent.$parent.list&&!$scope.$parent.$parent.listOwn){
                $scope.loadGridDataEmp(null,'employeeList');
            }
//



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