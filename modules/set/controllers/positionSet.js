/**
 * Created by pippo on 14-10-22.
 * 请假设置
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'set', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Set, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;};
            $scope.addPositionDataItem={}
            $scope.doingTypes = Set.getLeaveType();
            $scope.doingTypes.push({
                "type" : "加班",id:0
            })
            $scope.doingTypes.push({
                "type" : "出差(天)",id:99998
            })
            $scope.getPositionDuration = function(positionData,doingType){
                return Array.find(positionData,"typeId=="+doingType.id).item.duration;
            }
            $scope.saveData = function(){
                if($scope.addPositionDataItem.positionId){//修改
                    Set.positionEdit($scope.addPositionDataItem).success(function(response){
                        SaveTooltip.showSaveTooltip(response);
                    }).error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    })
                }else{//新增
                    Set.positionEdit($scope.addPositionDataItem).success(function(response){
                        SaveTooltip.showSaveTooltip(response);
                    }).error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    })
                }
            }

            $scope.loadGridData = function(){
                Set.getPositionList().success(function(response){
                    $scope.positionList = changePositionList(response);
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status);
                })
            }
            $scope.loadGridData()
//            var data= [{
//                id:1,
//                positionName  :'1boss',            //职位姓名
//                positionData:[{
//                                    typeId: 0,              //类型ID  （加班=0）
//                                    duration:  1           //可审批时长 int
//                                  },{
//                    typeId:5,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:6,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:21,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:26,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:27,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:28,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:29,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:31,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:32,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                }]
//                        },{
//                id:1,
//                positionName  :'xxx',            //职位姓名
//                positionData:[{
//                    typeId: 0,              //类型ID  （加班=0）
//                    duration:  2           //可审批时长 int
//                },{
//                    typeId:5,              //类型ID  （加班=0）
//                    duration:  3           //可审批时长 int
//                },{
//                    typeId:6,              //类型ID  （加班=0）
//                    duration:  8           //可审批时长 int
//                },{
//                    typeId:21,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:26,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:27,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:28,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:29,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:31,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                },{
//                    typeId:32,              //类型ID  （加班=0）
//                    duration:  1           //可审批时长 int
//                }]
//            }]
//            if($scope.positionList){
//                $scope.positionList = changePositionList($scope.positionList);
//            }
            function changePositionList(positionList){
                var start = new Date().getTime();
                var resultList = [];
                angular.forEach(positionList,function(response){
                    var tempPosition = {
                        positionName:response.positionName,
                        id : response.positionId
                    };
                    angular.forEach(response.positionData,function(position){
                        tempPosition['position'+position.typeId] = position.duration;
                    })
                    resultList.push(tempPosition)
                })
                return resultList;
            }
            var columnsModel = [{
                 field:'positionName',
                displayName:'职位名称'
            },{
                field:'id',
                visible : false
            }]
            $.each($scope.doingTypes,function(index,item){
                columnsModel.push( {
//                    width:85,
                    field:'position'+ item.id,
                    displayName: item.type
                });
            })
            columnsModel.push( {
                width:185,
                displayName: '操作',

                cellTemplate: '<div style="text-align: center;margin-top: 1%"><a class="btn btn-info btn-small" ng-if="!item.$editing" ng-click="getEdit(row)" style="color: #ffffff">'
                                +'<i class="icon-edit"></i> 编辑</a>'
                                +' <a class="btn btn-danger btn-small" ng-click="deleteItem(row)" style="color: #ffffff">'
                                +'    <i class="icon-remove"></i> 删除'
                                +'  </a></div>'
            });
            $scope.columnsModel = columnsModel;
            $scope.gridOptions = {
                data: 'positionList',
                rowTemplate:'<div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ng-dblclick="getEdit(row)" class="ngCell {{col.cellClass}} text-right">'+
                    '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
                multiSelect: false,
                //enableCellSelection: true,
                enableRowSelection: true,
//                enableCellEdit: true,
//                enablePinning: true,
                enableColumnResize:true,
                columnDefs:columnsModel
//                enablePaging: true,
//                showFooter: true,
//                totalServerItems: 'totalServerItems'
//                pagingOptions: $scope.pagingOptions,
//                filterOptions: $scope.filterOptions,
//                selectedItems: $scope.selectedInfo,
//                afterSelectionChange : function(rowItem, event) {
//                    $scope.selectedInfo = rowItem.entity;//赋值选中信息
//                }
            };
            //编辑
            $scope.getEdit = function(row){
                $scope.addPositionDataItem = row.entity;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
            //保存
            $scope.saveData = function(){
                var saveTempData = getSaveDataModel($scope.addPositionDataItem);
                if(saveTempData.positionId){
                    Set.positionEdit(saveTempData).success(function(response){
                        if(response.status){
                            $scope.loadGridData();
                            SaveTooltip.showSaveTooltip(response);
                        }else{
                            SaveTooltip.showSaveTooltip(response);
                        }
                    }).error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    })
                }else{
                    Set.positionAdd(saveTempData).success(function(response){
                        if(response.status){
                            $scope.loadGridData();
                            SaveTooltip.showSaveTooltip(response);
                        }else{
                            SaveTooltip.showSaveTooltip(response);
                        }
                    }).error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    })
                }

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
            //格式化数据
            function getSaveDataModel(addPositionDataItem){
                var resultTemp = {
                    positionId:addPositionDataItem.id,
                    positionName:addPositionDataItem.positionName,
                    positionData:[]
                }

                angular.forEach($scope.doingTypes,function(item){
                    resultTemp.positionData.push({
                        typeId:item.id,
                        duration:addPositionDataItem['position'+item.id]
                    })
                })
                return resultTemp;
            }
            //删除
            $scope.deleteItem = function(row){
                $.confirm({
                    text: "删除后将不能还原，请确认！",
                    title: "删除职务--"+row.entity.positionName,
                    confirm: function(button) {
                        $scope.addPositionDataItem = row.entity;
                        Set.positionDelete(row.entity.id).success(function(response){
                            if(response.status){
                                $scope.loadGridData();
                                SaveTooltip.showSaveTooltip(response);
                            }else{
                                SaveTooltip.showSaveTooltip(response);
                            }
                        }).error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status);
                        })
                    },
                    cancel: function(button) {
                        //do nothing
                    },
                    confirmButton: "确认删除",
                    cancelButton: "取消删除",
                    post: true,
                    confirmButtonClass: "btn-danger"
                });

            }
        }];
});