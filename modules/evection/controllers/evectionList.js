/**
 * Created by pippo on 14-10-22.
 * 请假列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'evection', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, evection, SaveTooltip,DataBusiness){

            if(!Auth.isLogined()){ return;};
            if(!$scope.$parent.$parent.list){
                return;
            }
            //权限验证
//            Auth()
            $scope.seeSelf = $routeParams.seeSelf;

            $scope.employeeId = parseInt(localStorage.employeeId)
            //判断用户类型改变视图
            $scope.positionId = parseInt(localStorage.positionId)
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
                $scope.searchData2.beginTime = new Date().getFirstDateOfMonth().format('Y-m-d');
                $scope.searchData2.endTime = new Date().getLastDateOfMonth().format('Y-m-d');

                $scope.data2 = [];

                $scope.passTypeList2={
                    0: '新增',
                    1: '需审批',
                    2: '出差审批',
                    3: '出差完成',
                    4: '已通过',
                    5: '未通过',
                    6:'需审批'};


            $scope.loadGridData = function loadGridData(tag,getMore){

                    if($scope.employeeSelection) {
                        $scope.employeeSelection.evectionId = ""
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
                    $scope.searchData2.page = page2;
                    $scope.searchData2.status = selectInfo;
                    evection.evectionList($scope.searchData2).
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
            $scope.listenCheck = function listenCheck(tag){

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
                $scope.employeeSelection.evectionId =""
                angular.forEach($scope.data2, function(value, key){
//                    if(value.disabled) {
                        value.employeeSelection = !chkall;

                        if (value.employeeSelection) {
                            $scope.employeeSelection.evectionId += value.evectionId + ',';
                        }
//                    }
                })
            }
            $scope.employeeSelection = {evectionId:''};
            $scope.toggleEmployeeSelection = function toggleEmployeeSelection(item){
                //多条操作过滤
//                if(!$scope.isPassed(item)){
//                    return;
//                }
                item.employeeSelection = !item.employeeSelection;
                if($scope.employeeSelection.evectionId.indexOf(item.evectionId)>-1){
                    $scope.employeeSelection.evectionId =$scope.employeeSelection.evectionId.replace(item.evectionId+',','');
                }else{
                    $scope.employeeSelection.evectionId +=item.evectionId+',';
                }

            };

            $scope.loadGridData();

            //$scope.loadGridData();

            //按钮事件
            //驳回操作
            $scope.reject = function(item){
                var evectionId = [];
                if(!item.employeeName){//多选按钮
                    if($scope.employeeSelection.evectionId.length<2){
                        return;
                    }
                    evectionId = $scope.employeeSelection.evectionId.substring(0,$scope.employeeSelection.evectionId.length-1).split(',');
                }else{
                    evectionId.push(item.evectionId);
                }
                item.isDelete = 1; //标识该数据被删除
                var formData = {};
                formData.evectionId  = evectionId;
                if( angular.isUndefined(item.resultReason)){
                    formData.resultReason=""
                } else{
                    formData.resultReason = item.resultReason;
                }
                formData.statusId=5;

                evection.rejectData(formData).
                    success(function(response){
                        if(response.status){
                            //从列表中删除数据
//                            for(var i =0; i <$scope.data.length; i++){
//                                if($scope.data[i].evectionId  == item.evectionId ){
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
                $scope.employeeSelection.evectionId =""
            };

            //同意操作
            $scope.pass = function(item){
                var evectionId = [];
                if(!item.employeeName){//多选按钮
                    if($scope.employeeSelection.evectionId.length<2){
                        return;
                    }
                    evectionId = $scope.employeeSelection.evectionId.substring(0,$scope.employeeSelection.evectionId.length-1).split(',');
                }else{
                    evectionId.push(item.evectionId);
                }

                item.isDelete = 1; //标识该数据被删除
                var formData = {};
                formData.evectionId  = evectionId;
                if( angular.isUndefined(item.resultReason)){
                    formData.resultReason=""
                } else{
                    formData.resultReason = item.resultReason;
                }

                formData.statusId=4;

                evection.passData(formData).
                    success(function(response){
                        if(response.status){
                            //从列表中删除数据
//                            for(var i =0; i <$scope.data.length; i++){
//                                if($scope.data[i].evectionId  == item.evectionId ){
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
                $scope.employeeSelection.evectionId =""
            };


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