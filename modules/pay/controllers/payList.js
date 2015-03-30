/**
 * Created by pippo on 14-10-22.
 * 薪资列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'pay', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Pay, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;};

            //权限验证
//            Auth()
            $scope.authFlag = {}
            var authViewList = config.authViewList;
            var numDeptListIndex = 0;
            var authFieldList = ['payListOwn','payListAdjustment','releaseSalaryAuth'];
            var authParentIndex = config.menuList.indexOf('modules/pay')
            for(var i=0;i<authViewList.authField.length;i++){
                if(Math.floor(authViewList.authField[i]/1000000)==(authParentIndex+1)&&Math.floor(authViewList.authField[i]/1000)==((numDeptListIndex+1)+(authParentIndex+1)*1000)){
                    $scope.authFlag[authFieldList[parseInt(authViewList.authField[i]%1000000%1000)-1]] = true;
                }
            }
            //初始化参数
            $scope.hasManyData = false;
            $scope.employeeId = parseInt(localStorage.employeeId)

            //判断用户类型改变视图
            $scope.userType = parseInt(localStorage.positionId)
            $scope.searchTypes = [{
                modelName:'employeeText',
                selectName : '员工',
                placeholderText:'员工姓名、简拼、工号'
            },{
                modelName:'deptText',
                selectName : '部门',
                placeholderText:'部门名称、简拼、编号'
            }]
            $scope.searchTypeSelection =  $scope.searchTypes[0]
            $scope.searchData = {}
            $scope.searchData.timeFrom = new Date().add(Date.MONTH,-1).format('Y-m');
            $scope.searchData.timeTo = new Date().format('Y-m');
            $scope.isGM = function isGM(){
                if($scope.authFlag.payListAdjustment){
                    return true;
                }
                return false;
            }
            //定义列属性


            var columnsModel =  [{
                        field: 'salaryId',
                        displayName: '序号',
                        visible : false
                    },
                    {
                        field: 'time',
                        displayName: '发放月份',
                        width:100,
                        cellFilter:'date:"yyyy年MM月"'

    //                        pinnable: false,
    //                        sortable: false,
    //                    visible : false
                    },
                    {
                        field: 'employeeId',
                        displayName: '员工id',
//                        width: 60,
//                        pinnable: false,
//                        sortable: false,
                        visible : false
                    },
                    {
                        field: 'employeeName',
                        displayName: '员工',
                        cellTemplate: '<div class="btn-link" style="margin:1% 3px;line-height: 2.5;" ng-click="getDetail(row)" >{{row.getProperty("employeeName")}}</div>',
                        width:85
                    },{
                        field: 'deptName',
                        displayName: '部门',
                    width:150,
                    cellClass:'text-left'
                    },{
                        field: 'deptId',
                        displayName: '部门id',
                        visible : false}];
//                    },{
//                        width:100,
//                        field: 'totalSalary',
//                        displayName: '合计'
//                    },{
//                        width:100,
//                        field: 'tax',
//                        displayName: '个人所得税'
//                    },{
//                        width:100,
//                        field: 'exceptTaxSalary',
//                        displayName: '实发工资合计'
//                    },
                var safeSalaryTypeCol ={};
                var safeCompanySalaryTypeCol ={};
                    //后台获取工资类型
                    $.each(Pay.getSalaryType(),function(index,item){
                        if(config.systemArguments.isSafeSalaryType.indexOf(item.salaryTypeId)>-1){
                            safeSalaryTypeCol={
                                width:85,
                                field:'salaryType'+ item.salaryTypeId,
                                displayName: item.salaryTypeName,
                                cellClass:'text-right'
                            }
                                return ;
                        }else if(config.systemArguments.isCompanySafeSalaryType.indexOf(item.salaryTypeId)>-1){
                            safeCompanySalaryTypeCol={
                                width:85,
                                field:'salaryType'+ item.salaryTypeId,
                                displayName: item.salaryTypeName,
                                cellClass:'text-right'
                            }
                            return ;
                        }
                        columnsModel.push( {
                            width:85,
                            field:'salaryType'+ item.salaryTypeId,
                            displayName: item.salaryTypeName,
                            cellClass:'text-right'
                        });
                    })
                    columnsModel.push({
                        width:85,
                        field: 'attendanceTimeCost',
                        displayName: '出勤扣除',
                        cellTemplate: '<div  class="btn-link" style="margin:1% 3px;line-height: 2.5;" ng-click="getAttendanceTimeDetail(row)" >{{row.getProperty("attendanceTimeCost")}}</div>',
                        cellClass:'text-right text-error'
                    })
                    columnsModel.push({
                        width:85,
                        field: 'overtimeTotal',
                        displayName: '加班补贴',
                        cellClass:'text-right'
                    })
                    //-------------------------------------
//                    columnsModel.push({
//                        width:85,
//                        field: 'overtime',
//                        displayName: '加班时长'
//                    })
        //                    columnsModel.push({
        //                        width:85,
        //                        field: 'overtimePay',
        //                        displayName: '加班薪资'
        //                    })
        //                    columnsModel.push({
        //                        width:85,
        //                        field: 'overtimeMeal',
        //                        displayName: '加班餐补'
        //                    })
                    //-------------------------------------
                    columnsModel.push({
                        width:85,
                        field: 'leaveDeducted',
                        displayName: '请假扣除合计',
                        cellClass:'text-right text-error'
                    })
                     //合计金额
                    columnsModel.push({
                        width:100,
                        field: 'totalSalary',
                        displayName: '合计',
                        cellClass:'text-right'
                    });
                    if(safeCompanySalaryTypeCol){
                        columnsModel.push(safeCompanySalaryTypeCol)
                    }
                    if(safeSalaryTypeCol) {
                        columnsModel.push(safeSalaryTypeCol)
                    }
                    columnsModel.push({
                        width:100,
                        field: 'tax',
                        displayName: '个人所得税',
                        cellClass:'text-right  text-error'
                    });
                    columnsModel.push({
                        width:100,
                        field: 'exceptTaxSalary',
                        displayName: '实发工资合计',
                        cellClass:'text-right  text-success'
                    });



//            if($scope.authFlag.payListAdjustment){
//                columnsModel = [].concat([{
//                        field: 'release',
//                        displayName: '发布标志',
//                        width: 60,
//                        cellTemplate: '<div ng-if="row.getProperty(col.field)==1" class="text-success"><div class="ngCellText">已发布</div></div>' +
//                            '<div ng-if="row.getProperty(col.field)==0" class="text-error"><div class="ngCellText">未发布</div></div>'
//                    }],columnsModel)
//            }
//            $scope.columnsModel = columnsModel

            //后台获取请假类型
            /*
             ['',]
             */
            var leaveType = Pay.getLeaveType();
//            $.each(leaveType,function(index,item){
//                columnsModel.push( {
//                    width:85,
//                    field: 'leaveTime'+item.id,
//                    displayName: item.type+'时长'
//                });
//                columnsModel.push( {
//                    width:85,
//                    field: 'leave'+item.id,
//                    displayName: item.type+'扣除'
//                });
//            })




            $scope.btnTextRelease = "发布薪资(全部)"
            $scope.btnTextReleaseId = 0
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
            $scope.gridOptionsPay = {
                data: 'salaryDatas',//ng-dblclick="getDetail()"
                rowTemplate:'<div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()"  class="ngCell {{col.cellClass}}">'+
                    '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
                multiSelect: true,
                showSelectionCheckbox: true,
                //enableCellSelection: true,
                enableRowSelection: true,
//                enableCellEdit: true,
//                enablePinning: true,
                enableColumnResize:true,
                columnDefs:columnsModel,
//                enablePaging: true,
//                showFooter: true,
                totalServerItems: 'totalServerItems',
//                pagingOptions: $scope.pagingOptions,
//                filterOptions: $scope.filterOptions,
//                selectedItems: $scope.selectedInfo,
                afterSelectionChange : function(rowItem, event) {

                    if($scope.gridOptionsPay.$gridScope.selectedItems.length==1){
                        $scope.selectedInfo = rowItem.entity;//赋值选中信息
                    }else{
                        $scope.selectedInfo = null
                    }
                    if(event){
                        $scope.employeeSelection =  $scope.salaryDatas
                    }else{
                        $scope.employeeSelection = $scope.gridOptionsPay.$gridScope.selectedItems;
                    }

                    if($scope.employeeSelection&& $scope.employeeSelection.length>0){
                        $scope.btnTextRelease = '发布薪资'
                        $scope.btnTextReleaseId = 1
                    }else{
                        $scope.btnTextRelease = "发布薪资(全体)"
//                        $scope.btnTextRelease = '发布薪资'
                        $scope.btnTextReleaseId = 0
                    }
                }
            };
            //查询框回车事件
            $scope.enterSearch = function enterSearch(){
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
            }

            //创建分页
            $scope.setPagingData = function (data, page, pageSize,totalServerItems,hasMore ) {
//                var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                if(hasMore){
                    Array.prototype.push.apply( $scope.salaryDatas, data);
                }else{
                    $scope.salaryDatas = data;
                }
                $scope.totalServerItems = totalServerItems;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
           function Rate_7(XSum){//工资薪金[喝小酒的网摘]http://blog.const.net.cn/a/1223.htm
                var Rate;
                var Balan;
                var TSum_7;
                if (XSum<=1500)
                {Rate=3;
                    Balan=0;
                }
                if ((1500<XSum) && (XSum<=4500))
                {Rate=10;
                    Balan=105;
                }
                if ((4500<XSum) && (XSum<=9000))
                {Rate=20;
                    Balan=555;
                }
                if ((9000<XSum) && (XSum<=35000))
                {Rate=25;
                    Balan=1005;
                }
                if ((35000<XSum) && (XSum<=55000))
                {Rate=30;
                    Balan=2755;
                }
                if ((55000<XSum) && (XSum<=80000))
                {Rate=35;
                    Balan=5505;
                }
                if (XSum>80000)
                {Rate=45;
                    Balan=13505;
                }
                TSum_7=(XSum*Rate)/100-Balan
                if (TSum_7<0)
                {
                    TSum_7=0
                }
                return TSum_7.toFixed(2)
            }

            $scope.getPagedDataAsync = function(pageSize, page,hasMore) {
                if(!$scope.isGM()){//假参数，该业务后台处理
                    $scope.employeeText = $scope.employeeId;
                }
                if(!hasMore){
                    $scope.mainTotalSalary =0;
                    $scope.mainTotalTax =0;
                    $scope.mainTotalSalaryCost =0;
                    $scope.exceptTaxTotalSalary =0;
                    $scope.companySafeSalaryTotal =0;
                }
                //获取查询条件
                $scope.searchData.employeeId = $scope.employeeId
//                $scope.searchData[$scope.searchTypeSelection.modelName]=$scope.searchname;
//                if($scope.searchTypeSelection.modelName=='deptText'){
//                    $scope.searchData.employeeText = '';
//                }else if($scope.searchTypeSelection.modelName=='employeeText'){
//                    $scope.searchData.deptText = '';
//                }
                //var ft = searchText.toLowerCase();

                Pay.payList( $scope.searchData,pageSize,page,$scope.authFlag)
                    .success(function (response) {
                        var data = [];
                        var items = response.items;
                        //数据组装
                        $scope.hasManyData=response.hasMore
                        $.each(items,function(index,item){
                            var tempData;
                            var totalSalary = 0;//计算公式  所有工资类型+ 加班费合计  - 请假合计
                            var totalAttSalaryCost = 0;//计算公式  所有工资类型+ 加班费合计  - 请假合计
                            var safeSalary = 0;//保险
                            var companySafeSalary = 0;//公司保险
                            var leaveSum = 0;

                            if(item.leave){
                                var leaveSet = item.leave;
                                delete item.leave;
                                //遍历赋值
                                $.each(leaveSet,function(index,it) {
                                    item['leaveTime' + it.leaveTypeId]= it.leaveTypeTime;
                                    item['leave' + it.leaveTypeId]= it.leaveTypeCost;
                                    leaveSum =parseFloat(leaveSum)+ parseFloat(it.leaveTypeCost);
                                })
                            }
                            //加班增加
                            totalSalary =parseFloat(totalSalary)+parseFloat(item.overtimeTotal);
                            totalAttSalaryCost = totalAttSalaryCost+parseFloat(item.overtimeTotal)
                            item.overtimeTotal = item.overtimeTotal.toFixed(2)
                            //出勤扣除
                            totalSalary = parseFloat(totalSalary)-parseFloat(item.attendanceTimeCost);
                            totalAttSalaryCost = totalAttSalaryCost-parseFloat(item.attendanceTimeCost)
                            item.attendanceTimeCost = item.attendanceTimeCost.toFixed(2)


                            totalAttSalaryCost = totalAttSalaryCost-parseFloat(leaveSum)
                            item['leaveDeducted'] = leaveSum.toFixed(2);//正数

                            item.totalMainSalary = 0;
                            if(item.otherSalaryType) {
                                var salarySet =  item.otherSalaryType;
                                delete item.otherSalaryType;
                                $.each(salarySet,function(index,it) {
                                    item['salaryType'+ it.salaryTypeId]= it.salaryTypeCost;

                                    if(config.systemArguments.isSafeSalaryType.indexOf(it.salaryTypeId)>-1){//去除保险
                                        safeSalary= parseFloat(safeSalary)+parseFloat(it.salaryTypeCost?it.salaryTypeCost:0);
                                    }else if(config.systemArguments.isCompanySafeSalaryType.indexOf(it.salaryTypeId)>-1){
                                        companySafeSalary= parseFloat(companySafeSalary)+parseFloat(it.salaryTypeCost?it.salaryTypeCost:0);
                                    }else{
                                        item.totalMainSalary += parseFloat(it.salaryTypeCost?it.salaryTypeCost:0);//所有薪资累加合计
                                        totalSalary =parseFloat(totalSalary)+ parseFloat(it.salaryTypeCost?it.salaryTypeCost:0);
                                    }
                                })
                            }
                            item['totalSalary'] = parseFloat(parseFloat(totalSalary) - parseFloat(leaveSum)).toFixed(2);
                            var salaryTemp = parseFloat(totalSalary)- parseFloat(leaveSum)
                            var tax = 0;
                            if(salaryTemp>3500){
                                tax = Rate_7(parseFloat(totalSalary)- parseFloat(leaveSum)-3500)
                            }
                            item['tax'] = tax;
                            $scope.companySafeSalaryTotal = parseFloat( $scope.companySafeSalaryTotal)+parseFloat(companySafeSalary)
                            item['exceptTaxSalary'] = (parseFloat(parseFloat(item['totalSalary'])-parseFloat(item['tax'])-parseFloat(safeSalary))).toFixed(2);//合计金额-个税-保险
                            $scope.mainTotalSalary = parseFloat($scope.mainTotalSalary) + parseFloat(item['totalSalary']);
                            $scope.mainTotalSalaryCost = (parseFloat($scope.mainTotalSalaryCost) +parseFloat(safeSalary));
                            $scope.mainTotalTax =(parseFloat($scope.mainTotalTax) +parseFloat(item['tax']));
                            $scope.exceptTaxTotalSalary =(parseFloat($scope.exceptTaxTotalSalary) +parseFloat(item['exceptTaxSalary']));
                            item['totalSalaryContainCost'] = (parseFloat(item['totalSalary']) +parseFloat(totalAttSalaryCost)).toFixed(2);
                            data.push(item);
                            //字段排列
                        });
                        //格式化结果
                        $scope.mainTotalSalary = (parseFloat($scope.mainTotalSalary)+parseFloat( $scope.companySafeSalaryTotal)).toFixed(2)
                        $scope.mainTotalSalaryCost =parseFloat($scope.mainTotalSalaryCost).toFixed(2);
                        $scope.mainTotalTax =parseFloat($scope.mainTotalTax).toFixed(2);
                        $scope.exceptTaxTotalSalary =parseFloat($scope.exceptTaxTotalSalary).toFixed(2);
//                            data = largeLoad.filter(function (item) {
//                                return JSON.stringify(item).toLowerCase().indexOf() != -1;
//                            });
                        $scope.setPagingData(data, response.page, response.pageSize,response.totalServerItems,hasMore );
                    }).error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    });
            };


            //获取分页数据
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
//
//            $scope.$watch('pagingOptions', function (newVal, oldVal) {//每页总数
//
//                if (newVal !== oldVal) {
//                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
//                    $scope.selectedInfo = null;
//                }
//            }, true);
//            $scope.$watch('filterOptions', function (newVal, oldVal) {//翻页
//                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
//                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);//, $scope.filterOptions.filterText);
//                    $scope.selectedInfo = null;
//                }
//            }, true);
            //---------------详细开始---------
            var morningWorkTimeMinute = config.systemArguments.morningWorkTime*60;
            var noonRestTimeMinute = config.systemArguments.noonRestTime*60;
            var afternoonWorkTimeMinute = config.systemArguments.afternoonWorkTime*60;
            var afternoonRestTimeMinute = config.systemArguments.afternoonRestTime*60;
            $scope.morningWorkTimeMinute = morningWorkTimeMinute;
            $scope.noonRestTimeMinute = noonRestTimeMinute;
            $scope.afternoonWorkTimeMinute = afternoonWorkTimeMinute;
            $scope.afternoonRestTimeMinute = afternoonRestTimeMinute;
            function getAMorPM(dateStr){
                if(!dateStr){
                    return;
                }
                var minute = parseInt(dateStr.substr(11,2))*60+parseInt(dateStr.substr(14,2));
                if(morningWorkTimeMinute<=minute&&minute<=noonRestTimeMinute){//上午
                    return 'AM';
                }else if(afternoonWorkTimeMinute<=minute&&minute<=afternoonRestTimeMinute) {//下午
                    return 'PM';
                }
            }
//            $scope.selectedInfo={
//                time : new Date()
//        }
            $scope.getTimeByMinute = function(minuteStr){
                return (Math.floor(minuteStr/60)<10?('0'+Math.floor(minuteStr/60)):Math.floor(minuteStr/60))+':'+(minuteStr%60<10?('0'+minuteStr%60):minuteStr%60);
            }
            //按钮事件
//            var doingTypes = leaveType;
            function getAttendanceDateTime(salaryDetailList){
                $scope.selectedInfoItem.time = new Date(Date.parse($scope.selectedInfoItem.time,'Y-m-d'))
                var dayNum = $scope.selectedInfoItem.time.getDaysInMonth()
                if(new Date().getMonth()==$scope.selectedInfoItem.time.getMonth()){
                    dayNum = parseInt(new Date().format('Y-m-d').substring(8,10));
                }
                var firstWeekNum = $scope.selectedInfoItem.time.getFirstDateOfMonth().getDay();

                var resultSalaryDetailList = []
                for(var dayCount=1;dayCount<dayNum+1;dayCount++){
                    var salaryDetail = Array.find(salaryDetailList,'day=='+dayCount).item;
                    if(salaryDetail||salaryDetail==0){
                        var tempSalaryDetail ={}
                        var day = salaryDetail.day;
                        tempSalaryDetail.day = day;
                        tempSalaryDetail.beginTimeAM = morningWorkTimeMinute;
                        tempSalaryDetail.endTimeAM = noonRestTimeMinute;
                        tempSalaryDetail.beginTimePM = afternoonWorkTimeMinute;
                        tempSalaryDetail.endTimePM = afternoonRestTimeMinute;
                        tempSalaryDetail.doingType =[];
                        $.each(salaryDetail.doingType,function(indexIn,doingType){
                            var tempDoingType = doingType;
                            //加班pass
                            if(tempDoingType.doingTypeId==0){
                                var doingEndDateMinute = parseInt(doingType.doingEndDate.substr(11,2))*60+parseInt(tempDoingType.doingEndDate.substr(14,2));
                                tempSalaryDetail.endTimePM = doingEndDateMinute;
                                tempSalaryDetail.doingType.push(tempDoingType)
                                return ;//continue
                            }
                            if(tempDoingType.doingTypeId==99998){//出差
                                tempSalaryDetail.beginTimeAM = 0;
                                tempSalaryDetail.endTimeAM = 0;
                                tempSalaryDetail.beginTimePM = 0;
                                tempSalaryDetail.endTimePM = 0;
                                tempSalaryDetail.doingType.push(tempDoingType)
                                return ;//continue
                            }
                            var beginNoon = getAMorPM(tempDoingType.doingBeginDate)
                            var endNoon = getAMorPM(tempDoingType.doingEndDate)

                            //迟到早退
                            if(tempDoingType.doingTypeId==99999){
                                if(tempSalaryDetail.doingCost){
                                    tempSalaryDetail.doingCost +=tempSalaryDetail.doingCost
                                }
                                if(tempDoingType.doingBeginDate&&tempDoingType.doingBeginDate!=''){//迟到
                                    var doingBeginDateMinute = parseInt(doingType.doingBeginDate.substr(11,2))*60+parseInt(tempDoingType.doingBeginDate.substr(14,2));
                                    if(beginNoon=='AM'){
                                        tempSalaryDetail.beginTimeAM =doingBeginDateMinute;
                                    }else if(beginNoon=='PM'){
                                        tempSalaryDetail.beginTimePM = doingBeginDateMinute;
                                    }else{
                                        alert("数据错误:noon")
                                    }
                                }else if(tempDoingType.doingEndDate&&tempDoingType.doingEndDate!=''){//早退
                                    var doingEndDateMinute = parseInt(doingType.doingEndDate.substr(11,2))*60+parseInt(tempDoingType.doingEndDate.substr(14,2));
                                    if(endNoon=='AM'){
                                        tempSalaryDetail.endTimeAM =doingEndDateMinute
                                    }else if(endNoon=='PM'){
                                        tempSalaryDetail.endTimePM = doingEndDateMinute;
                                    }else{
                                        alert("数据错误:noon")
                                    }
                                }else{
                                    alert("数据错误")
                                }
                                tempSalaryDetail.doingType.push(tempDoingType)
                                return ;//continue
                            }
                            var doingBeginDateMinute = parseInt(doingType.doingBeginDate.substr(11,2))*60+parseInt(tempDoingType.doingBeginDate.substr(14,2));
                            var doingEndDateMinute = parseInt(doingType.doingEndDate.substr(11,2))*60+parseInt(tempDoingType.doingEndDate.substr(14,2));
                            //判断是否跨天
                            var doingBeginDate = tempDoingType.doingBeginDate;
                            var doingEndDate = tempDoingType.doingEndDate;
                            var bDay = doingBeginDate.substring(8,10);
                            var eDay = doingEndDate.substring(8,10);
                            if(bDay==eDay){//一天内
                                if(beginNoon==endNoon){//单上午，或下午
//                                var long = Date.parseDate(doingType.doingEndDate,'Y-m-d h:i:s')-Date.parseDate(doingType.doingBeginDate,'Y-m-d h:i:s')
                                    if(beginNoon=='AM'){
                                        if(morningWorkTimeMinute==doingBeginDateMinute&&noonRestTimeMinute==doingEndDateMinute){
                                            tempSalaryDetail.beginTimeAM = 0;
                                            tempSalaryDetail.endTimeAM = 0
                                        } else if(noonRestTimeMinute==doingEndDateMinute){
                                            tempSalaryDetail.endTimeAM = noonRestTimeMinute-tempDoingType.doingTime*60
                                        }else if(morningWorkTimeMinute==doingBeginDateMinute){
                                            tempSalaryDetail.beginTimeAM = morningWorkTimeMinute+tempDoingType.doingTime*60
                                        }
                                    }else if(beginNoon=='PM'){
                                        if(afternoonWorkTimeMinute==doingBeginDateMinute&&afternoonRestTimeMinute==doingEndDateMinute){
                                            tempSalaryDetail.endTimePM = 0;
                                            tempSalaryDetail.beginTimePM = 0
                                        }else if(afternoonRestTimeMinute==doingEndDateMinute){
                                            tempSalaryDetail.beginTimePM = afternoonRestTimeMinute+tempDoingType.doingTime*60
                                        }else if(afternoonWorkTimeMinute==doingBeginDateMinute){
                                            tempSalaryDetail.endTimePM = afternoonWorkTimeMinute-tempDoingType.doingTime*60
                                        }
                                    }else{
                                        alert('error')
                                    }
                                }else{//跨上午下午
                                    tempSalaryDetail.beginTimeAM = doingBeginDateMinute;
                                    tempSalaryDetail.endTimePM = doingEndDateMinute;

                                    tempSalaryDetail.beginTimePM = 0;
                                    tempSalaryDetail.endTimeAM = 0;
                                }
                            }else {//超过一天
                                var longDay = parseInt(eDay) - parseInt(bDay);
                                //当前天判断结束
                                if(endNoon=='AM'){
                                    if(doingEndDateMinute==noonRestTimeMinute){
                                        tempSalaryDetail.beginTimeAM = 0;
                                        tempSalaryDetail.endTimeAM = 0;
                                    }else{
                                        tempSalaryDetail.beginTimeAM = doingEndDateMinute;
                                    }
                                }else if(endNoon=='PM'){
                                    tempSalaryDetail.beginTimeAM = 0;
                                    tempSalaryDetail.endTimeAM = 0;
                                    if(doingEndDateMinute==afternoonRestTimeMinute){
                                        tempSalaryDetail.beginTimePM = 0;
                                        tempSalaryDetail.endTimePM = 0;
                                    }else{
                                        tempSalaryDetail.beginTimePM = doingEndDateMinute;
                                    }
                                }else{
                                    alert('error,today')
                                }
                                //第一天开始
                                var tempFirstLeave = Array.find(resultSalaryDetailList,'day=='+(dayCount- longDay)).index
                                if(tempFirstLeave||tempFirstLeave==0){
                                    if(beginNoon=='AM'){
                                        resultSalaryDetailList[tempFirstLeave].beginTimePM = 0;
                                        resultSalaryDetailList[tempFirstLeave].endTimePM = 0;
                                        if(doingBeginDateMinute==morningWorkTimeMinute){
                                            resultSalaryDetailList[tempFirstLeave].beginTimeAM = 0;
                                            resultSalaryDetailList[tempFirstLeave].endTimeAM = 0;
                                        }else{
                                            resultSalaryDetailList[tempFirstLeave].endTimeAM = doingBeginDateMinute;
                                        }
                                    }else if(endNoon=='PM'){
//                                        resultSalaryDetailList[tempFirstLeave].endTimeAM = noonRestTimeMinute;
//                                        resultSalaryDetailList[tempFirstLeave].beginTimeAM = morningWorkTimeMinute;
                                        if(doingBeginDateMinute==afternoonWorkTimeMinute){
                                            resultSalaryDetailList[tempFirstLeave].beginTimePM = 0;
                                            resultSalaryDetailList[tempFirstLeave].endTimePM = 0;
                                        }else{

                                            resultSalaryDetailList[tempFirstLeave].endTimePM = doingBeginDateMinute;
                                        }

                                    }else{
                                        alert('error,firstLeaveDay')
                                    }
                                }
                                if(longDay>1){//超过两天
                                    for(var i=longDay-1;i>0;i--) {//制空其他天
                                        if(dayCount- longDay<0){
                                            break;
                                        }
                                        Array.find(resultSalaryDetailList,'day=='+(dayCount- longDay) ).item = {
                                            day: parseInt(dayCount- longDay),
                                            beginTimeAM:0,
                                            endTimePM:0,
                                            beginTimePM:0,
                                            endTimeAM:0
                                        }
                                    }
                                }
                            }
                            tempSalaryDetail.doingType.push(tempDoingType)
                        })
                        resultSalaryDetailList.push(tempSalaryDetail);
                    }else if((firstWeekNum+dayCount-1)%7==0){//周日
                        resultSalaryDetailList.push({
                            day : dayCount,
                            beginTimeAM : 0,
                            endTimeAM : 0,
                            beginTimePM : 0,
                            endTimePM : 0
                        })
                    }else{
                        resultSalaryDetailList.push({
                            day : dayCount,
                            beginTimeAM : morningWorkTimeMinute,
                            endTimeAM : noonRestTimeMinute,
                            beginTimePM : afternoonWorkTimeMinute,
                            endTimePM : afternoonRestTimeMinute
                        })
                    }
                }
                return resultSalaryDetailList;
            }

            function getTotalData(salaryDetail){
                if(salaryDetail&&salaryDetail.length>0) {
                    $scope.selectedInfoItem.totalTimeData = {}
                    $scope.selectedInfoItem.totalCostData = {}
                    $scope.selectedInfoItem.totalCostSalary = 0
                    for(var i=0;i<salaryDetail.length;i++){
                        if(!salaryDetail[i].doingType){
                            continue;
                        }
                        for(var j=0;j<salaryDetail[i].doingType.length;j++){
                            $.each($scope.doingTypes,function(index,item){
                                if(item.id==salaryDetail[i].doingType[j].doingTypeId){
                                    if(item.id||item.id==0){
                                        if(eval('$scope.selectedInfoItem.totalTimeData.doingType'+item.id)==null||eval('$scope.selectedInfoItem.totalTimeData.doingType'+item.id)==undefined){
                                            eval('$scope.selectedInfoItem.totalTimeData.doingType'+item.id +'='+parseFloat(salaryDetail[i].doingType[j].doingTime))
                                        }else{
                                            eval('$scope.selectedInfoItem.totalTimeData.doingType'+item.id+' += '+parseFloat(salaryDetail[i].doingType[j].doingTime));
                                        }
                                        if(item.id==0||item.id==99998){
                                            $scope.selectedInfoItem.totalCostSalary +=parseFloat(salaryDetail[i].doingType[j].doingCost);
                                        }else{
                                            $scope.selectedInfoItem.totalCostSalary -=parseFloat(salaryDetail[i].doingType[j].doingCost);
                                        }
                                        if(eval('$scope.selectedInfoItem.totalCostData.doingType'+item.id)==null||eval('$scope.selectedInfoItem.totalCostData.doingType'+item.id)==undefined){
                                            eval('$scope.selectedInfoItem.totalCostData.doingType'+item.id +'='+parseFloat(salaryDetail[i].doingType[j].doingCost))
                                        }else{
                                            eval('$scope.selectedInfoItem.totalCostData.doingType'+item.id+' += '+parseFloat(salaryDetail[i].doingType[j].doingCost));
                                        }
                                        return;
                                    }
                                }
                            });
                        }
                    }
                    $scope.selectedInfoItem.totalCostSalary = parseFloat( $scope.selectedInfoItem.totalCostSalary).toFixed(2)
                }
            }

            $scope.getDetail = function getDetail(row){
                $scope.selectedInfoItem = row.entity
                if($scope.selectedInfoItem){
                    $scope.doingTypes =[{
                        "type" : "加班",id:0
                    }].concat(leaveType)

//                    $scope.doingTypes.push()
                    $scope.doingTypes.push({
                        "type" : "迟到早退(分钟)",id:99999
                    })
                    $scope.doingTypes.push({
                        "type" : "出差(天)",id:99998
                    })
//                    $scope.doingTypes.push({
//                        "type" : "调休",id:101
//                    })
//                    $.ajax({ url: 'salaryDetail2.json', async : false,context: document.body, success: function(response){
                    var url = '';
                    if($scope.authFlag.payListAdjustment){
                        url = config.domain+'pay/detail?salaryId='+$scope.selectedInfoItem.salaryId;
                    }else if($scope.authFlag.payListOwn){
                        url = config.domain+'pay/detailOwn?salaryId='+$scope.selectedInfoItem.salaryId;
                    }else{
                        return
                    }

                    $.ajax({ url: url, async : false,context: document.body, success: function(response){
                        if(response.status&&response.items){
                            getTotalData(response.items)
                            $scope.salaryDetail = getAttendanceDateTime(response.items);
                        }

                    },error:function(response){
                        SaveTooltip.showSaveTooltip(response,response.status);
                    }});


                    //查看详细
                    var modalPromise = $modal({
                        template: 'modules/pay/templates/salaryDetail.html'
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

            $scope.getDoingTypeTime =  function(salaryData,doingTypeItem){
                if(!salaryData.doingType){
                    return '-';
                }
                var obj = Array.find(salaryData.doingType,'doingTypeId=='+doingTypeItem.id)
                if(obj&&obj.item){
                    return obj.item.doingTime
                }else{
                    return '-';
                }
            }
            $scope.getDoingTimeItemValue = function(doingType_temp,totalData){
                if(!totalData){
                    return;
                }
                if(totalData['doingType'+doingType_temp.id]==0){
                    return parseFloat(totalData['doingType'+doingType_temp.id]).toFixed(2);
                }
                return totalData['doingType'+doingType_temp.id]?parseFloat(totalData['doingType'+doingType_temp.id]).toFixed(2):'-'
            }
            //---------------详细结束---------
            $scope.getAttendanceTimeDetail = function(row){

                $scope.selectedInfoItem = row.entity
//                url: '/attendanceTime/listEdit/'+$scope.selectedInfo.employeeId
                var modalPromise = $modal({
                    template: 'modules/leave/templates/attendanceTimeListEditWindow.html'
                    , persist: true
                    , show: false
                    , backdrop: 'static'
                    , scope: $scope
                });

                var modal = $q.when(modalPromise);
                modal.then(function(modalEl){
                    modalEl.modal('show');
                });
            }
            if($scope.authFlag.releaseSalaryAuth){
                $scope.releaseSalary = function releaseSalary(){
                    if($scope.btnTextReleaseId==0){//全体
                        Pay.releaseSalaryAll() .success(function(response){
                            if(response.status){
                                SaveTooltip.showSaveTooltip(response)
                            }else{
                                SaveTooltip.showSaveTooltip(response)
                            }
                        }).error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status)
                        })
                        return;
                    }
                    if(!$scope.employeeSelection||$scope.employeeSelection.length<1){
                        return;
                    }
                    var salaryIdList = {
                        salaryIdList : []
                    }
                    angular.forEach($scope.employeeSelection,function(entity){
                        salaryIdList.salaryIdList.push(entity.salaryId);
                    })
                    Pay.releaseSalary(salaryIdList)
                        .success(function(response){
                            if(response.status){
                                SaveTooltip.showSaveTooltip(response)
                            }else{
                                SaveTooltip.showSaveTooltip(response)
                            }
                        }).error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status)
                        })
                };
            }

            $scope.print = function print(){

                $('<div id="payPrint"></div>').printArea(columnsModel,$scope.salaryDatas);
            };


        }];
});