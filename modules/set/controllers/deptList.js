/**
 * Created by pippo on 14-10-22.
 * 权限列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'dept', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, dept, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;}
            //初始化参数
            $scope.timeFrom = '2000-01-01';
            $scope.timeTo = new Date().format('Y-m-d');
            $scope.employeeId = parseInt(localStorage.employeeId)
            $scope.employeeName= localStorage.employeeName
            //判断用户类型改变视图
//            $scope.positionId = parseInt(localStorage.positionId)
//            if($scope.positionId==config.systemArguments.adminRole){
                $scope.selectDeptId = 1
            $scope.deptId = 1
//            }else{
//                $scope.deptId = parseInt(localStorage.deptId)
//            }

//            $scope.deptId = 2;
            var authViewList = config.authViewList;
            $scope.authFlag={}
//            var authDirList = ['set','salaryAdjustment','add'];
            var numDeptListIndex = 6;
            var authFieldList = ['deptEditFlag','empAuthFlag','positionAuthFlag'];
            var authParentIndex = config.menuList.indexOf('modules/set');
            for(var i=0;i<authViewList.authField.length;i++){
                if(Math.floor(authViewList.authField[i]/1000000)==(authParentIndex+1)&&Math.floor(authViewList.authField[i]/1000)==((numDeptListIndex+1)+(authParentIndex+1)*1000)){
                    $scope.authFlag[authFieldList[parseInt(authViewList.authField[i]%1000000%1000)-1]] = true;
                }
            }

            //-------创建部门树--------
            //初始化部门数据

            function getDeptList(){
                var deptTreedata = [];

                $scope.deptData = dept.deptList($scope.deptId);
//                $scope.deptData.push({"deptId":2, //部门id
////                        //"proDeptId":1, //上级部门id
//                        "deptName":'开发部'});
                if($scope.deptData){
                    $.each($scope.deptData,function(index,deptItem){
                        var tempData = {};
                        tempData.id=deptItem.deptId;
                        tempData.parent=deptItem.deptId== $scope.deptId?'#':deptItem.proDeptId;
                        tempData.text=deptItem.deptName;
                        deptTreedata.push(tempData);
                    })
                }
                return deptTreedata;
            }
            //var oldDeptDataLength = deptData&&deptData.length?deptData.length:0;
            var reg = /^p+/;
            //部门树事件
            var rightClickItems={} ;//必须使用空对象，
            if($scope.authFlag.deptEditFlag){//根据角色过滤
                rightClickItems = {createItem: {
                        label: "新增部门",
                            action: function (node) { return {createItem: $scope.createNode() }; }
                    },
                    renameItem: {
                        label: "重命名部门",
                            action: function (node) { return {renameItem: $scope.renameNode() }; }
                    },
                    deleteItem: {
                        label: "删除部门",
                            action: function (node) {return {deleteItem: $scope.deleteNode() };},
                        "separator_after": true
//                    },
//                    saveItem: {
//                        label: "保存部门",
//                            action: function (node) {return {saveItem: $scope.saveTreeData() }; }
                    }
                }
            }
            $scope.createNode = function createNode() {
                var ref = $('#deptTreeShow').jstree(true),
                    sel = ref.get_selected();
                if(!sel.length) { return false; }
                sel = sel[0];
                //产生id
//                var proNode = $('#deptTreeShow').jstree(true).get_node(sel);
//                var tempId = 'p_'+sel+'c_'+(proNode.children.length+1);
//                sel = ref.create_node(sel,{id:tempId});
                sel = ref.create_node(sel,{id:-1});
                if(sel) {
                    ref.edit(sel,'部门');
                }
            };
            $scope.renameNode = function renameNode() {
                var ref = $('#deptTreeShow').jstree(true),
                    sel = ref.get_selected();
                if(!sel.length) { return false; }
                sel = sel[0];
                ref.edit(sel);
            };


            $scope.deleteNode =function deleteNode(){
                if(!$scope.selectDeptId){
                    return;
                }
                var ref = $('#deptTreeShow').jstree(true),
                    sel = ref.get_selected();
                if(!sel.length) { return false; }
                //p
                if(reg.test($scope.selectDeptId)){
                    ref.delete_node(sel);
                }else{
                    $.confirm({
                        text: "此操作不可逆,确定要删除当前部门?",
                        title: "提示",
                        confirm: function(button) {
                           dept.deptDelete($scope.selectDeptId).success(function (response){
                                   if(response.status){
                                       ref.delete_node(sel);
                                   }
                            });
                        },
                        cancel: function(button) {
                            // nothing to do
                        },
                        confirmButton: "确定",
                        cancelButton: "取消",
                        post: true,
                        confirmButtonClass: "btn-danger"
                    });
                }
            };

            var editTempData_update =[];//保存修改数据
            var editTempData_create =[];//保存修改数据

            $('#deptTreeShow').jstree({
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
                    "animation" : 0,
                    "check_callback" : true,
                    'data' : getDeptList(),
                    "multiple ":false
                },
                "plugins" : [ "contextmenu", "search", "state", "types", "wholerow" ]//拖拽插件"dnd",
                ,"contextmenu" : {items :rightClickItems}

            }) .bind('rename_node.jstree', function(e,node) {

                if(node.node.id==-1){
                    editTempData_create.push({
                        deptId :node.node.id,
                        proDeptId :node.node.parent=='#'?0:node.node.parent,
                        deptName:node.text
                    })
                }else{
                    editTempData_update.push({
                        deptId :node.node.id,
                        proDeptId :node.node.parent=='#'?0:node.node.parent,
                        deptName:node.text
                    });
                }
                var ref = $('#deptTreeShow').jstree(true);
                var editTempData_create_result = editTempData_create;
//                $.each(editTempData_create_result,function(index,item){
//                    getRootDept(item);
//                })
                dept.deptEdit(editTempData_create_result,editTempData_update).success(function(response){
                    if(response.status){
                        ref.settings.core.data = getDeptList();
                        if(editTempData_create){
                            ref.refresh();
                        }
                        editTempData_update = []
                        editTempData_create = []
                    }
                });
                //读取数据

                //

                //dept.deptEdit(dept);
                //note.node.id.
            }).on("changed.jstree", function (e, data) {
                if(data.selected.length>1){
                    return;
                }
                $scope.selectDeptId = data.selected;
                if(data.selected.length>0&&!reg.test(data.selected)){
                    $scope.reloadEmployeeList(data.selected);//deptId
                }
            });

            //定义列属性
            var columnsModel = [
                    {
                        field: 'employeeId',
                        displayName: '员工id',
                        visible : false
                    },
                    {
                        field: 'employeeName',
                        displayName: '员工'
                        //width:100
                    },
                    {
                        visible : false,
                        field: 'deptId ',
                        displayName: '所属部门id'
                    },
                    {
                        //width:85,
                        field: 'deptName ',
                        displayName: '所属部门'
                    },
                    //-------------------------------------
                    {
                        //width:85,
                        field: 'phone',
                        displayName: '联系方式'
                    },
//                    {
//                        //width:85,
//                        field: 'position',
//                        displayName: '职务'
//                    },
                    {
                        //width:85,
                        visible : false,
                        field: 'positionId',
                        displayName: '职务id'

                    },
                    {
                        //width:85,
                        field: 'positionName',
                        displayName: '职务'
                    },
                    {
                        //width:85,
                        field: 'joinDate',
                        displayName: '入职时间'
                    }
            ];

            if($scope.authFlag.empAuthFlag){
                columnsModel.push({
                    width:200,
                    //field: 'adjustmentId',
                    displayName: '操作',
                    //                    cellTemplate: '<div><a ui-sref="bookdetail({adjustmentId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
                    cellTemplate: '<div class="text-center" style="padding: 3px;">'
                        //                    + ' <span class="btn-success btn-small center" data-trigger="click" data-unique="1">'
                        //                    +'<a href="" style="color: #ffffff"><i class="icon-check"></i> 生成薪资</a></span>'
                        + ' <span class="btn-success btn-small center" data-trigger="click" data-unique="1">'
                        +'<a ng-click="showUpdateEmployeeAuth(row)" style="color: #ffffff"><i class="icon-check"></i> 权限分配</a></span>'
                        +'</div>'
                })
            }

            $scope.filterOptions = {
                filterText: "",
                useExternalFilter: false
            };
            $scope.totalServerItems = 0;
            $scope.pagingOptions = {
                pageSizes: [10, 20, 30],
                pageSize: 10,
                currentPage: 1
            };

            $scope.columnsModel = columnsModel;
            $scope.gridOptions = {
                data: 'salaryDatas',
                rowTemplate:'<div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ng-dblclick="getDetail()" class="ngCell {{col.cellClass}}">'+
                    '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
                enableColumnResize:true,
                //enableCellSelection: true,
                enableRowSelection: true,
//                enableCellEdit: true,
//                enablePinning: true,
                jqueryUITheme: true,
                columnDefs:columnsModel,
                enablePaging: true,
                showFooter: true,
                totalServerItems: 'totalServerItems',
                pagingOptions: $scope.pagingOptions,
                filterOptions: $scope.filterOptions,
                multiSelect: false,
                //selectedItems: $scope.selectedInfo
                afterSelectionChange : function(rowItem, event) {
                    $scope.selectedInfo = rowItem.entity;//赋值选中信息
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            };
            $scope.reloadEmployeeList = function reloadEmployeeList(deptId){
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,deptId);
            }

            //创建分页
            $scope.setPagingData = function (data, page, pageSize,totalServerItems ) {
//                var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                $scope.salaryDatas = data;
                $scope.totalServerItems = totalServerItems;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            $scope.getPagedDataAsync = function(pageSize, page, deptId) {
                if(  $scope.selectDeptId&&$scope.selectDeptId.length>1){
                    $scope.selectDeptId =  $scope.selectDeptId[0]
                }
                //获取查询条件
                var searchData = {
                    timeFrom : $scope.timeFrom,
                    timeTo : $scope.timeTo,
                    employeeText : $scope.employeeText,
                    deptId : deptId?deptId: $scope.selectDeptId
                };
                if(!searchData.deptId){
                    searchData.deptId = 1;
                }
                //var ft = searchText.toLowerCase();
                dept.deptEmployeeList(searchData,pageSize,page)
                    .success(function (response) {
                        var items = response.items;
                        $scope.setPagingData(items, response.page, response.pageSize,response.total );
                    });
            };


            //获取分页数据
            //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

            $scope.$watch('pagingOptions', function (newVal, oldVal) {//每页总数

                if (newVal !== oldVal) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,$scope.selectDeptId);
                    $scope.selectedInfo = null;
                }
            }, true);
            $scope.$watch('filterOptions', function (newVal, oldVal) {//翻页
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,$scope.selectDeptId);//, $scope.filterOptions.filterText);
                    $scope.selectedInfo = null;
                }
            }, true);

            //职务获取
            dept.positionList().success(function(response){
                if(response.status){
                    $scope.positionList = response.items;
                }else{
                    SaveTooltip.showSaveTooltip(response)
                }
            }).error(function(response,status){
                SaveTooltip.showSaveTooltip(response,status)
            })
            //权限获取
             function getAuthList() {
                 var authListRes = dept.authList();
                 var authList = []
                 if (authListRes) {
                     $.each(authListRes, function (index, authItem) {
                         var tempData = {};
                         tempData.id = authItem.authId;
                         tempData.parent = authItem.proAuthId == 0 ? '#' : authItem.proAuthId;
                         tempData.text = authItem.authName;
                         authList.push(tempData);
                     })
                 }
                 return authList;
             }

            var modalPromise = $modal({
                template: 'modules/set/templates/addNewEmployee.html'
                , persist: true
                , show: false
                , backdrop: 'static'
                , scope: $scope
            });
            var modal = $q.when(modalPromise);
            modal.then(function(modalEl){
                $('#authInputTree').jstree({
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
                        "animation" : 0,
                        "check_callback" : true,
                        'data' : getAuthList(),
                        "multiple ":false
                    },
                    "plugins" : [ "state", "types", "wholerow" ,"checkbox"]

                }).on("changed.jstree", function (e, data) {
                    $scope.authEmpSelected = data.selected;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            })

            //提交表单
            $scope.submitNewEmployee = function submitNewEmployee(){
                var submitData = {
                    employeeId  :$scope.employeeSelected.employeeId,
                    authId  : changePositionAuthSelectData($scope.authEmpSelected)
//                    positionId : $scope.roleSelected.positionId
                }
                dept.updateEmpAuth(submitData).success(function(response){
                    if(response.status){
                        modal.then(function(modalEl){
                            modalEl.modal('hide');
                        });
                        SaveTooltip.showSaveTooltip(response);
                        $scope.reloadEmployeeList()
                    }else{
                        SaveTooltip.showSaveTooltip(response);
                    }
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status)

                });
                return;

            };
            //修改权限
            $scope.showUpdateEmployeeAuth = function showUpdateEmployeeAuth(row){
                $scope.employeeList = [ {
                    employeeName :row.entity.employeeName,
                    employeeId :row.entity.employeeId
                }];
                $scope.employeeSelected =$scope.employeeList[0];
                var ref =  $('#authInputTree').jstree(true);
                ref.deselect_all();
                dept.getEmpAuth(row.entity.employeeId).success(function(response){
                    if(response.status&&response.item){
                        var authList = changePositionAuthDataSelected(response.item.authId);
                        ref.select_node(authList);
                    }
                    $scope.modalTitle = '【'+row.entity.employeeName+'】员工权限修改'
//                    $scope.modalUpdate = 'update';
                    //查看详细

//                var modal = $q.when(modalPromise);
                    modal.then(function(modalEl){
                        modalEl.modal('show');
                    });
                }).error(function (response,status) {
                    SaveTooltip.showSaveTooltip(response,status)
                })

            };

            $scope.loadGridData = function loadGridData(){
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            }

            $scope.enterSeacrh = function enterSearch(){
                if(event.keyCode == 13){
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                }
            }

            //--------------------positionAuth

            var positionAuthInputTree = $modal({
                template: 'modules/set/templates/positionAuthPanel.html'
                , persist: true
                , show: false
                , backdrop: 'static'
                , scope: $scope
            });
            var positionAuthInputTreeModal = $q.when(positionAuthInputTree);
            positionAuthInputTreeModal.then(function(modalEl){
                $('#positionAuthInputTree').jstree({
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
                        "animation" : 0,
                        "check_callback" : true,
                        'data' :  getAuthList(),
                        "multiple ":false
                    },
                    "plugins" : [ "state", "types", "wholerow" ,"checkbox"]

                }).on("changed.jstree", function (e, data) {
                    $scope.authSelected = data.selected;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            })
            $scope.submitPositionAuth = function submitPositionAuth(){
                var submitData = {
                    positionId  :$scope.positionSelected.positionId,
                    authId  : changePositionAuthSelectData($scope.authSelected)
                }
                dept.updatePositionAuth(submitData).success(function(response){
//                    $scope.reloadEmployeeList()
                    positionAuthInputTreeModal.then(function(modalEl){
                        modalEl.modal('hide');
                    });
                    SaveTooltip.showSaveTooltip(response);
//                    t.hide()
                }).error(function(response,status){

                    SaveTooltip.showSaveTooltip(response,status)
//                    t.hide()
                });
            };


            //职务权限绑定
            $scope.showUpdatePositionAuth = function showUpdatePositionAuth(){
                var ref =  $('#positionAuthInputTree').jstree(true);
                ref.deselect_all();
                if($scope.positionSelected&&$scope.positionSelected.positionId){
                    dept.getPositionAuth($scope.positionSelected.positionId).success(function(response){
                        var authList = []
                        authList = changePositionAuthDataSelected(response.item.authId)
                        ref.select_node(authList);
                        positionAuthInputTreeModal.then(function(modalEl){
                            modalEl.modal('show');
                        });
                    }).error(function (response,status) {
                        SaveTooltip.showSaveTooltip(response,status)
                    })
                }

                positionAuthInputTreeModal.then(function(modalEl){
                    modalEl.modal('show');
                });
                //查看详细
//                var modal = $q.when(positionAuthInputTreeModal);

            };
            //职务切换
            $scope.positionAuthSelectChange = function positionAuthSelectChange(){
                $scope.authSelected = null
                if(!$scope.positionSelected){
                    return;
                }
//                $scope.positionSelected = $scope.positionSelected.positionId
                var ref =  $('#positionAuthInputTree').jstree(true);
                ref.deselect_all();
                dept.getPositionAuth($scope.positionSelected.positionId).success(function(response){
                    if(response.status&&response.item){
                        var authList = changePositionAuthDataSelected(response.item.authId)
                        ref.select_node(authList);
                    }
                }).error(function (response,status) {
                    SaveTooltip.showSaveTooltip(response,status)
                })


            }
            //保存数据调整
            function changePositionAuthSelectData(positionSelectedOld){
                var positionSelected =[];
                var level1 = []
                var level2 = []
                var level3 = []
                $.each(positionSelectedOld,function(index,item){
                    item = parseInt(item)
                    if(item<1000&&level1.indexOf(Math.floor(item))<0){
                        level1.push(item);
                    }else
                    if(item>1000&&item<1000000&&level2.indexOf(Math.floor(item))<0){
                        if(Math.floor(item/1000)!=0&&level1.indexOf(Math.floor(item/1000))<0){
                            level1.push(Math.floor(item/1000));
                        }
                        level2.push(item);
                    }else
                    if(item>1000000&&level3.indexOf(Math.floor(item))<0){
                        if(level2.indexOf(Math.floor(item/1000))<0){
                            level2.push(Math.floor(item/1000));
                        }
                        if(level1.indexOf(Math.floor(item/1000000))<0){
                            level1.push(Math.floor(item/1000000));
                        }
                        level3.push(item);
                    }
                })
                //排序
//                level1 = level1
                if(level1.length==config.systemArguments.authSorter.length){
                    level1 = config.systemArguments.authSorter;
                }else{
                    var tempLevel = [];
                    for(var countIndex in config.systemArguments.authSorter){
                        if(level1.indexOf(config.systemArguments.authSorter[countIndex])<0){
                            continue;
                        }else{
                            tempLevel.push(config.systemArguments.authSorter[countIndex])
                        }
                    }
                    level1 = tempLevel;
                }
                positionSelected = positionSelected.concat(level1)
                positionSelected= positionSelected.concat(level2)
                positionSelected = positionSelected.concat(level3)
                return positionSelected;
            }

            //选中数据调整
            function changePositionAuthDataSelected(authDataOld){
                var authData =[];
                var level1 = []
                var level2 = []
                var level3 = []
                $.each(authDataOld,function(index,item){
                    item = parseInt(item)
                    if(item<1000){
                        level1.push(item);
                    }else
                    if(item<1000000){
                        level2.push(item);
                    }else
                    if(item>1000000){
                        level3.push(item);
                    }
                })
                $.each(level3,function(index,item){
                    item = parseInt(item);
                    var tempIndex1 = level1.indexOf(Math.floor(item/1000000));
                    var tempIndex2 = level2.indexOf(Math.floor(item/1000));
                    if(tempIndex1>0){
                        level1.splice(tempIndex1,1);
                    }
                    if(tempIndex2>0){
                        level2.splice(tempIndex2,1);
                    }
                })
                $.each(level2,function(index,item) {
                    item = parseInt(item);
                    var tempIndex1 = level1.indexOf(Math.floor(item/1000));
                    if (tempIndex1 > 0) {
                        level1.splice(tempIndex1,1);
                    }
                })

                authData = authData.concat(level1)
                authData= authData.concat(level2)
                authData = authData.concat(level3)
                return authData;
            }
        }];
});
