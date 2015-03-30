/**
 * Created by pippo on 14-10-22.
 * 薪资列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'employee', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, employee, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;}
            //初始化参数
            $scope.timeFrom = '2000-01-01';
            $scope.timeTo = new Date().format('Y-m-d');
            $scope.employeeId = parseInt(localStorage.employeeId)
            //判断用户类型改变视图
            $scope.positionId = parseInt(localStorage.positionId)

            var authViewList = config.authViewList;
            $scope.authFlag={}
//            var authDirList = ['set','salaryAdjustment','add'];
            var numDeptListIndex = 1;
            var authFieldList = ['employeeList','resetPwdFlag'];
            var authViewList = config.authViewList;
            var authParentIndex = config.menuList.indexOf('modules/employee');
            for(var i=0;i<authViewList.authField.length;i++){
                if(Math.floor(authViewList.authField[i]/1000000)==(authParentIndex+1)&&Math.floor(authViewList.authField[i]/1000)==((numDeptListIndex+1)+(authParentIndex+1)*1000)){
                    $scope.authFlag[authFieldList[parseInt(authViewList.authField[i]%1000000%1000)-1]] = true;
                }
            }
            if(!$scope.authFlag['employeeList']){
                return;
            }
//            if($scope.positionId==config.systemArguments.adminRole){
//                $scope.employeeId = 1
//            }else{
//                $scope.employeeId = parseInt(localStorage.employeeId)
//            }
            //1：试用员工  2：正式员工  3：离职员工
            $scope.searchData={}
            $scope.hasManyData = false;
            $scope.statusList=[{
                value:[1,2],
                text:'全体员工'
            },{
                value:[1],
                text:'试用员工'
            },{
                value:[2],
                text:'正式员工'
            },{
                value:[3],
                text:'离职员工'
            }]
            $scope.searchData.status = $scope.statusList[0].value;

            $scope.listenChange = function(){
                $scope.loadGridData()
            }

            var cellCZ = '<div class="text-center" style="padding: 3px;"><span class="btn-info btn-small center" >'
                +'<a href="#!employee/detailEmployee/{{row.getProperty(\'employeeId\')}}/1" style="color: #ffffff"><i class="icon-legal"></i> 修改</a></span>';
            if($scope.authFlag&&$scope.authFlag.resetPwdFlag){
                cellCZ += ' <span class="btn-danger btn-small center" data-trigger="click">'
                    +'<a ng-click="getResetPassword(row)" style="color: #ffffff"><i class="icon-check"></i> 重置密码</a></span>'
            }
            cellCZ +='</div>';
            var columnsModel = [
               {
                    field: 'deptName',
                    width:100,
                    displayName: '部门',
                   cellClass:'text-left'
                },{
                    field: 'deptId',
                    displayName: '部门id',
                    visible : false
               },{
                    field: 'employeeId',
                    displayName: '员工id',
                    visible : false
                },{
                    field: 'employeeName',
                    displayName: '员工',
                    width:100,
                    cellClass:'text-center'
                },{
                    field: 'account',
                    displayName: '账号',
                    width:100
                },{
                    field: 'phone',
                    displayName: '电话',
                    width:100
                },{
                    field: 'email',
                    displayName: '邮箱',
                    width:100
                },{
                    field: 'status',
                    displayName: '就职状态',
                    width:100,
                    cellTemplate: '<div ng-if="row.getProperty(col.field)==1" class="text-warning"><div class="ngCellText">试用期</div></div>' +
                        '<div ng-if="row.getProperty(col.field)==2" class="text-success"><div class="ngCellText">正式</div></div>' +
                        '<div ng-if="row.getProperty(col.field)==3" class="text-error"><div class="ngCellText">离职</div></div>'
                },{
                    field: 'joinDate',
                    displayName: '入职时间',
                    width: 120,
                    cellFilter:'date:"yyyy年MM月dd日"'
                },{
                    field: 'positionName',
                    displayName: '职务',
                    width:100
                },{
                    field: 'jobs',
                    displayName: '岗位',
                    width:100
                },{
                    field: 'parentId',
                    displayName: '直属上级',
                    cellTemplate: '<a class="btn-link" style="margin:1% 3px;line-height: 2.5;" target="view_frame" href="#!employee/detailEmployee/{{row.getProperty(\'parentId\')}}/0" id="{{row.getProperty(col.field)}}">{{row.getProperty("parentName")}}</a>',
                    width:100 ,
                    cellClass:'text-center'
                },{
                    field: 'children',
                    displayName: '直属下级',
                    cellTemplate: '<span ng-repeat="child in row.getProperty(col.field)"  style="margin-right: 3px;line-height: 2.5;" ><a class="btn-link" target="view_frame"  href="#!employee/detailEmployee/{{child.employeeId}}/0" >{{child.employeeName}}</a></span>'
                },{
                    displayName: '操作',
                    width:200,
                    cellTemplate:cellCZ
//                    + ' <span class="btn-success btn-small center" data-trigger="click" data-unique="1">'
//                    +'<a href="" style="color: #ffffff"><i class="icon-check"></i> 生成薪资</a></span>'


                }];

            $scope.columnsModel = columnsModel;
            $scope.gridOptions = {
                data: 'employeeListData',
                rowTemplate:'<div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ng-dblclick="getDetail(row)" class="ngCell {{col.cellClass}} text-right">'+
                    '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
                multiSelect: false,
                //enableCellSelection: true,
                enableRowSelection: true,
//                enableCellEdit: true,
//                enablePinning: true,
                enableColumnResize:true,
                columnDefs:columnsModel,
//                enablePaging: true,
//                showFooter: true,
                totalServerItems: 'totalServerItems'
//                pagingOptions: $scope.pagingOptions,
//                filterOptions: $scope.filterOptions,
//                selectedItems: $scope.selectedInfo,
//                afterSelectionChange : function(rowItem, event) {
//                    $scope.selectedInfo = rowItem.entity;//赋值选中信息
//                }
            };
            var page = 1;
            $scope.loadGridData = function(hasMore){
                if(hasMore){
                    page +=1;
                }else{
                    page =1;
                }
                employee.getEmployeeList(page,$scope.searchData).success(function(response){
                    if(response.status){

                        if(hasMore){
                            Array.prototype.push.apply($scope.employeeListData, response.items);
                        }else{
                            $scope.employeeListData = response.items;
                        }
                        $scope.hasManyData = response.hasMore;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }else{
                        $scope.hasManyData = false;
                        SaveTooltip.showSaveTooltip(response)
                    }

                }).error(function(response,status){
                    $scope.hasManyData = false
                    SaveTooltip.showSaveTooltip(response,status)
                })
            }
            $scope.loadGridData()
            //按钮事件
            $scope.getDetail =function(row){
//                $location.href='#!/employee/detailEmployee/'+row.entity.employeeId
                Action.forward('detailEmployee','employee',{employeeId:row.entity.employeeId})
            };
            $scope.getResetPassword = function(row){
                employee.resetPwd(row.entity.employeeId).success(function(response){
                    SaveTooltip.showSaveTooltip(response)
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status)
                });
            }

            $scope.enterSeacrh = function enterSearch(){
                if(event.keyCode == 13){
                    $scope.loadGridData();
                }
            }
        }];
});
