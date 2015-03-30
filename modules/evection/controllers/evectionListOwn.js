/**
 * Created by pippo on 14-10-22.
 * 请假列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'evection', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, evection, SaveTooltip,DataBusiness){

            if(!Auth.isLogined()){ return;};
            //权限验证
//            Auth()
           if(!$scope.$parent.$parent.listOwn){
               return;
           }
            $scope.seeSelf = $routeParams.seeSelf;

            $scope.employeeId = parseInt(localStorage.employeeId)
            //$scope.deptId = localStorage.deptId;
            $scope.passTypeList={
                0: '新增',
                1: '审批中',
               2: '审批中',
                3: '出差完成',
                4: '已通过',
                5: '未通过',
                6:'审批中'};

            //选项卡1
            $scope.vm = {}
            $scope.vm.values = [
                {type: '审批中', id: [0,1,2,6]},
                {type: '已通过', id:  [4]},
                {type: '未通过', id: [5]},
                {type: '出差完成', id: [3]}
            ];
            $scope.vm.selection = {};

            var page = 1;
            $scope.hasManyData = true;

            var searchPage = 1;

            $scope.searchData = {}
            $scope.searchData.beginTime = new Date().getFirstDateOfMonth().format('Y-m-d');
            $scope.searchData.endTime = new Date().getLastDateOfMonth().format('Y-m-d');

            $scope.employeeText = $scope.employeeId;
            $scope.data = [];
            var page2 = 1;
            //选项卡2

            $scope.loadGridData = function loadGridData(tag,getMore){
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
                    $scope.searchData.page = page;
                    $scope.searchData.status = selectInfo;

                    evection.evectionList($scope.searchData,tag).
                        success(function(response){
                            if(response.status){
                                //获取数据
                                //$scope.data = [];
                                angular.forEach(response.items, function(item){
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
            $scope.listenCheck = function listenCheck(tag){
                    $scope.loadGridData('own');

            }

            //查询框回车事件
            $scope.enterSeacrh = function enterSeacrh(tag){
                if(event.keyCode == 13){
                    $scope.loadGridData(tag);
                }
            }

            $scope.employeeSelection = {evectionId:''};
            $scope.toggleEmployeeSelection = function toggleEmployeeSelection(item){
                item.employeeSelection = !item.employeeSelection;
                if($scope.employeeSelection.evectionId.indexOf(item.evectionId)>-1){
                    $scope.employeeSelection.evectionId =$scope.employeeSelection.evectionId.replace(item.evectionId+',','');
                }else{
                    $scope.employeeSelection.evectionId +=item.evectionId+',';
                }

            };

            $scope.loadGridData('own');


//

            //删除
            $scope.deleteItem = function(item){
                item.isDelete = 1; //标识该数据被删除
                var formData = {};
                formData.evectionId = item.evectionId;
                evection.evectionDelete(formData.evectionId).
                    success(function(response){
                        if(response.status){
                            $scope.loadGridData('own')
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
            $scope.removeevection = function removeevection(evectionItem){
                $.confirm({
                    text: "若未正常休假，请选择销假修改",
                    title: "销假操作",
                    confirm: function(button) {
                        evection.evectionRemove(evectionItem.evectionId).success(function(response){
                            //do nothing
                            $scope.loadGridData('own');
                        }).error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status);
                        });
                    },
                    cancel: function(button) {
                       window.location= '#!/evection/remove/'+evectionItem.evectionId ;
                    },
                    confirmButton: "完成销假",
                    cancelButton: "销假修改",
                    post: true,
                    confirmButtonClass: "btn-success"
                });
            }

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
                                    item.statusId="出差完成"
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