/**
 * Created by pippo on 14-10-22.
 * 请假列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'evection', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, evection, SaveTooltip,DataBusiness){

            if(!Auth.isLogined()){ return;};
            if(!$scope.$parent.$parent.listEmp){
                return;
            }
            //权限验证
//            Auth()
            $scope.seeSelf = $routeParams.seeSelf;
            $scope.employeeId = parseInt(localStorage.employeeId)
            //判断用户类型改变视图
            $scope.positionId = parseInt(localStorage.positionId)
            $scope.isNormalEmployee = ( config.systemArguments.roleNormalEmployeeId);
            //$scope.deptId = localStorage.deptId;
            $scope.passTypeList={
                0: '新增',
                1: '审批中',
                2: '审批中',
                3: '出差完成',
                4: '已通过',
                5: '未通过',
                6:'审批中'};


            //选项卡3
            $scope.vm3 = {}
            $scope.vm3.values = [
                {type: '审批中', id: [0,1,2,6]},
                {type: '已通过', id:  [4]},
                {type: '未通过', id: [5]},
                {type: '出差完成', id: [3]}
            ];
            $scope.vm3.selection = {};

            var page3 = 1;
            $scope.hasManyData3 = true;

            var searchPage3 = 1;

            $scope.searchData3 = {}
            $scope.searchData3.beginTime = new Date().getFirstDateOfMonth().format('Y-m-d');
            $scope.searchData3.endTime = new Date().getLastDateOfMonth().format('Y-m-d');

            $scope.data3 = [];
            $scope.loadGridData = function loadGridData(tag,getMore){

                    var format = function format(item){
                        return item.type
                    }

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
                    $scope.searchData3.page = page3;
                    $scope.searchData3.status = selectInfo;
                    evection.evectionList($scope.searchData3,tag).
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

            $scope.listenCheck = function listenCheck(tag){
                $scope.loadGridData('employeeList');
            }

            //查询框回车事件
            $scope.enterSeacrh = function enterSeacrh(tag){
                if(event.keyCode == 13){
                    $scope.loadGridData(tag);
                }
            }


            $scope.loadGridData('employeeList');



            //数据轨迹
            $scope.showTrackData = function showTrackData(id){
                evection.trackList(id).
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
            $scope.parseDate = function(str){
                if(typeof(str)=='string' ){
                    return Date.parseDate(str,'Y-m-d');
                }else{
                    return str;
                }
            }
            $scope.parseDateWeek = function(str){
                if(typeof(str)=='string' ){
                    return Date.parseDate(str,'Y-m-d').getShortDayNameByDateCN();
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