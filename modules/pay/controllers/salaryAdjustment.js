/**
 * Created by weik on 2014/11/10.
 */
/**
 * Created by pippo on 14-10-22.
 * 薪资列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'pay', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Pay, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;};
            //初始化参数
            //定义列属性
            $scope.hasManyData = false;
            function getDeptList(){
                var deptTreedata = [];

//                $scope.deptData = Pay.deptList(localStorage.deptId);
                $scope.deptData = Pay.deptList(0);
//                $scope.deptData.push({"deptId":2, //部门id
////                        //"proDeptId":1, //上级部门id
//                        "deptName":'开发部'});
                if($scope.deptData){
                    $.each($scope.deptData,function(index,deptItem){
                        var tempData = {};
                        tempData.id=deptItem.deptId;
                        tempData.parent=deptItem.deptId==0?'#':deptItem.proDeptId==0?'#':deptItem.proDeptId;
                        tempData.text=deptItem.deptName;
                        deptTreedata.push(tempData);
                    })
                }
                return deptTreedata;
            }

//            var rightClickItems = {customerClick: {
//                label: "生成薪资",
//                action: function (node) { return {customerClick: $scope.createSalaryShow()}; }
//            }};
            $scope.roleWhere =false;
//            $scope.createSalaryShow = function createSalaryShow(){
//
//            }
            $('#deptTreeSalary').jstree({
                types : {
                    "default": {
                        clickable: true,
                        draggable: false    //设置节点不可拖拽
                    },
                    "root" : {
                        valid_children: "folder" //设置下级节点类型，可是数组
                    }
                },
                'core' : {
                    "themes" : { "stripes" : true,icons:false },
                    "multiple ":false,
                    "animation" : 0,
                    "check_callback" : true,
                    'data' : getDeptList()
                },
                "plugins" : [  "search", "state", "types", "wholerow"]//,"checkbox" ]//拖拽插件"dnd","contextmenu",
//                ,"checkbox" : {three_state :false}
            }).on("changed.jstree", function(e,action){
                $scope.deptSelection = action.selected;
                if(action.selected.length!=1){
                    return;
                }
                $scope.loadGridData();
                $scope.gridOptions.selectAll()
                $scope.employeeSelection=null;
                $scope.$root.$$phase || $scope.$apply();
            });
           /* $scope.checkDeptAll = function checkDeptAll(){
                if(!$scope.isCheckedAll){
                    $scope.isCheckedAll = true;
                    $('#deptTreeSalary').jstree(true).uncheck_all()
                }else{
                    $scope.isCheckedAll = false;
                    $('#deptTreeSalary').jstree(true).check_all()
                }
            }*/
//            $scope.searchTypes = [{
//                modelName:'employeeText',
//                selectName : '员工',
//                placeholderText:'员工姓名、简拼、工号'
//            },{
//                modelName:'deptText',
//                selectName : '部门',
//                placeholderText:'部门名称、简拼、编号'
//            }]
//            $scope.searchTypeSelection =  $scope.searchTypes[0]
            var columnsModel = [
                {
                    field: 'payId',
                    displayName: '序号',
                    visible : false
                },
                {
                    field: 'employeeName',
                    displayName: '员工'
                    //cellFilter : ''
                },{
                    field: 'employeeId',
                    displayName: '员工',
                    visible : false
                },{
                    field: 'deptName',
                    displayName: '部门'
                },{
                    field: 'deptId',
                    displayName: '部门id',
                    visible : false
                }];
            $scope.salaryTypes = Pay.getSalaryType();
            $.each($scope.salaryTypes,function(index,item){
                columnsModel.push( {
                    width:85,
                    field:'salaryType'+ item.salaryTypeId,
                    displayName: item.salaryTypeName,
                    cellClass : 'text-right'
                });
            })

            columnsModel.push( {
                width:200,
                //field: 'adjustmentId',
                displayName: '操作',
//                    cellTemplate: '<div><a ui-sref="bookdetail({adjustmentId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
                cellTemplate: '<div class="text-center" style="padding: 3px;"><span class="btn-warning btn-small center" >'
                    +'<a ng-click="getDetail(row)" style="color: #ffffff"><i class="icon-legal"></i> 薪资调整</a></span>'
//                    + ' <span class="btn-success btn-small center" data-trigger="click" data-unique="1">'
//                    +'<a href="" style="color: #ffffff"><i class="icon-check"></i> 生成薪资</a></span>'
                    + ' <span class="btn-success btn-small center" data-trigger="click" data-unique="1">'
                    +'<a ng-click="getUpdateDetail(row)" style="color: #ffffff"><i class="icon-check"></i> 修改记录</a></span>'
                    +'</div>'
            });

            $scope.filterOptions = {
                filterText: "",
                useExternalFilter: true
            };
            $scope.totalServerItems = 0;
            $scope.pagingOptions = {
                pageSizes: [10, 20, 30],
                pageSize: 10,
                currentPage: 1
            };

            var tempID = 0;
            $scope.getDetail = function getDetail(row){
                tempID = row.rowIndex
                var tempRowEntityData = angular.copy(row.entity);
                $scope.opener = {
                    entity : tempRowEntityData
                };
                $scope.formOptions=[]
                if(row.entity){
                    //查看详细
                    var modalPromise = $modal({
                        template: 'modules/pay/templates/salaryEdit.html'
                        , persist: true
                        , show: false
                        , backdrop: 'static'
                        , scope: $scope
                    });
                    var modal = $q.when(modalPromise);
                    modal.then(function(modalEl){
                        modalEl.modal('show');
                    });
                }else{
                    SaveTooltip.showSaveTooltip({message:"请选中要查看的员工！"});
                }
            }

            $scope.getUpdateDetail = function getUpdateDetail(row){
                if(row.entity){
                    Pay.salaryAdjustmentDetail(row.entity.employeeId).success(function(response){
                        $scope.opener = {
                            entity : row.entity,
                            updateDataList : response.items
                        };
//                      $scope.formOptions=[]
                        //查看详细
                        var modalPromise = $modal({
                            template: 'modules/pay/templates/salaryAdjustmentDetail.html'
                            , persist: true
                            , show: false
                            , backdrop: 'static'
                            , scope: $scope
                        });

                        var modal = $q.when(modalPromise);
                        modal.then(function(modalEl){
                            modalEl.modal('show');
                        });

                    }).error(function(response,status){
                        $scope.opener={};
                        SaveTooltip.showSaveTooltip(response,status);
                    });
                }else{
                    $scope.opener={};
                    SaveTooltip.showSaveTooltip({message:"请选中要查看的员工！"});
                }
            }
            $scope.getDetailListNode  = function getDetailListNode(salaryType,salaryEmployeeDetail){
                var temp = Array.find(salaryEmployeeDetail.otherSalaryType,'salaryTypeId =='+salaryType.salaryTypeId)
                if(temp){
                    if(temp.item){
                        return temp.item.salaryTypeCost
                    }
                    return;
                }
                return;
            }
            $scope.close = function(){
//                $scope.opener.entity =  tempRowEntityData;
                //do nothing
            }

            $scope.columnsModel = columnsModel;
            $scope.gridOptions = {
                data: 'salaryDatas',
                rowTemplate:
//                    '<a href="{{\'#collapse\'+row.rowIndex}}"  data-toggle="{{\'collapse\'+row.rowIndex}}" aria-expanded="true" aria-controls="{{\'collapse\'+row.rowIndex}}">' +
                    '<div style="height: 100%" >' +
                    '<div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell" >' +
                    '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
                    '<div ng-cell></div></div>' +
//                    '</div>' +
//                    '</a><div id="{{\'collapse\'+row.rowIndex}}" class="panel-collapse collapse in" style="height: 100px;width: 100%;border: 1px solid red" role="tabpanel" >' +
//                    '1111' +
                        '</div>',
                //checkboxCellTemplate :'<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
                //checkboxHeaderTemplate:'<input class="ngSelectionHeader" type="checkbox" ng-show="multiSelect" ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',
                multiSelect: true,
                showSelectionCheckbox: true,
                //enableCellSelection: true,
                enableRowSelection: true,
                enableColumnResize:true,
//                enableCellEdit: true,
//                enablePinning: true,
                columnDefs:columnsModel,
//                enablePaging: true,
//                showFooter: true,
//                totalServerItems: 'totalServerItems',
//                pagingOptions: $scope.pagingOptions,
//                filterOptions: $scope.filterOptions,
                afterSelectionChange :employeeSelectionChange
            };
            function employeeSelectionChange(){
                    $scope.employeeSelection = $scope.gridOptions.$gridScope.selectedItems;
                if($scope.employeeSelection&& $scope.employeeSelection.length>0){
                    $scope.actionNameCreateSalary = '生成薪资'
                    $scope.actionNameCreateSalaryId = 1
                }else{
                    $scope.actionNameCreateSalary = "生成薪资(全体)"
                    $scope.actionNameCreateSalaryId = 0
                }
            }
            //创建分页
            $scope.setPagingData = function (data, page, pageSize,total,hasMore) {
                var pagedData = data;
                if(hasMore){
                    Array.prototype.push.apply($scope.salaryDatas,data);
                }else{
                    $scope.salaryDatas = pagedData;
                }
                $scope.gridOptions.selectAll(false)
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            $scope.getPagedDataAsync = function(pageSize, page, hasMore) {
                if($scope.deptSelection.length>1){
                    $scope.deptSelection = $scope.deptSelection[0]
                }else if(!$scope.deptSelection){
                    $scope.deptSelection = 1;
                }
//                var data;
                var searchData = {
                   employeeText : $scope.employeeText,
                   deptText : $scope.deptSelection
                };


                    Pay.salaryAdjustment(searchData,pageSize,page)
//                    Pay.salaryAdjustment(searchData)
//                    Pay.test()
                        .success(function (response) {
//                            data = largeLoad.filter(function (item) {
//                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
//                            });
                            $scope.hasManyData=response.hasMore
                            var data = [];
                            var items = response.items
                            $.each(items,function(index,item) {
                                if (item.otherSalaryType) {
                                    var salarySet = item.otherSalaryType;
                                    delete item.otherSalaryType;
                                    $.each(salarySet, function (index, it) {
                                        item['salaryType' + it.salaryTypeId] = it.salaryTypeCost;
                                    })
                                }
                                data.push(item)
                            })

                            $scope.setPagingData(data, response.page, response.pageSize,response.total,hasMore);
//                            $scope.setPagingData(data,hasMore);
                        }).error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status)
                        });

            };


            $scope.createSalaryMonthInp2 = new Date().add(Date.MONTH,-1).format('Y-m')//默认时间
            $scope.createSalary = function createSalary(tag,createSalaryMonthInp,t){
                if($scope.actionNameCreateSalaryId==0){
                    Pay.salaryAdjustmentSetAll(createSalaryMonthInp).success(function(response){
                            $scope.isLoading = false;
                            t.hide();
                            SaveTooltip.showSaveTooltip(response)
                        }).error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status)
                            $scope.isLoading = false;
                            t.hide();
                        });
                    return;
                }

                if(!$scope.employeeSelection|| $scope.employeeSelection.length<1){
                    return
                }
                if(!$scope.deptSelection||$scope.deptSelection.length<1){
                    return
                }
                var employeeList=[];
                $.each($scope.employeeSelection,function(index,employee){
                    employeeList.push(employee.employeeId)
                })
                var dataList = employeeList;

                $scope.isLoading = true;
                Pay.salaryAdjustmentSet(createSalaryMonthInp,dataList,tag).success(function(response){
                    $scope.isLoading = false;
                    t.hide();
                    SaveTooltip.showSaveTooltip(response)
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status)
                    $scope.isLoading = false;
                    t.hide();
                });
            }
            $scope.enterSeacrh = function enterSeacrh(){
                if(event.keyCode == 13){
                    $scope.loadGridData()
                }
            }
            $scope.loadGridData = function loadGridData(hasMore){
                if(hasMore){
                    $scope.pagingOptions.currentPage +=1;
                }else{
                    $scope.pagingOptions.currentPage =1;
                }
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,hasMore);
//                $scope.getPagedDataAsync();
            }
            $scope.submitSalaryEdit = function submitSalaryEdit(entity,t){
                //装载数据
                var data = {};
                data.employeeId = entity.employeeId;
                var otherSalaryType =[]
                $.each($scope.salaryTypes,function(index,item){
                    var temp = {};
                    temp['salaryTypeId'] = item.salaryTypeId;
                    temp['salaryTypeCost'] = entity['salaryType'+item.salaryTypeId];
                    otherSalaryType.push(temp);
                })
                data.otherSalaryType = otherSalaryType;
                Pay.salaryAdjustmentEdit(data).success(function(response){
//                    $scope.tempRowEntityData = tempRowEntityData
                    $scope.salaryDatas[tempID] = $scope.opener.entity;

                    $scope.setPagingData(angular.copy( $scope.salaryDatas));
                    t.hide();
//                    $scope.loadGridData()
                    SaveTooltip.showSaveTooltip(response)
                }).error(function(response,status){
                    t.hide();
                    SaveTooltip.showSaveTooltip(response,status)
                });

            }

            $scope.isOK = function isOK(){
                if(!$scope.opener.entity){
                    return false;
                }
                var flag = true;
                $.each($scope.salaryTypes,function(index,item){
                    if($scope.opener.entity['salaryType'+item.salaryTypeId]==null||$scope.opener.entity['salaryType'+item.salaryTypeId]==undefined||$scope.opener.entity['salaryType'+item.salaryTypeId]<0){
                        flag = false;
                        return false;
                    }
                })
                return flag;
            }
        }];
});