/**
 * Created by pippo on 14-10-22.
 * 薪资列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'employee', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, employee, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;}
            $scope.title = "员工信息"
            //初始化参数
            $scope.employeeId = parseInt(localStorage.employeeId)
            //判断用户类型改变视图
            $scope.positionId = parseInt(localStorage.positionId)
            $scope.deptId = 1
//            if($scope.positionId==config.systemArguments.adminRole){
//                $scope.deptId = 1
//            }else{
//                $scope.deptId = parseInt(localStorage.deptId)
//            }
            var numDeptListIndex = 2;
            $scope.authFlag={}
            var authFieldList = ['employeeDetail','positive','dismissal','employeeEdit'];
            var authViewList = config.authViewList;
            var authParentIndex = config.menuList.indexOf('modules/employee');
            for(var i=0;i<authViewList.authField.length;i++){
                if(Math.floor(authViewList.authField[i]/1000000)==(authParentIndex+1)&&Math.floor(authViewList.authField[i]/1000)==((numDeptListIndex+1)+(authParentIndex+1)*1000)){
                    $scope.authFlag[authFieldList[parseInt(authViewList.authField[i]%1000000%1000)-1]] = true;
                }
            }
            if(!$scope.authFlag['employeeDetail']){
                return;
            }

            var pageEmployeeId = $routeParams.employeeId
            var edit = $routeParams.edit
            if(edit==1&&$scope.authFlag.employeeEdit){
                $scope.$editing = true;
            }
            function getDeptList(){
                var deptTreedata = [];

                $scope.deptData = employee.deptList($scope.deptId);
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

            //dictionary
            $scope.dic = {}
            $scope.dic.sexDic=[{
                id:1,
                text:'男'
            },{
                id:2,
                text:'女'
            }]
            $scope.dic.educationDic = [{text:"无"},{text:"小学"},{text:"初中"},{text:"高中"},{text:"中专"},{text:"大专"},{text:"本科"},{text:"研究生"},{text:"博士生"}]
//            $scope.dic.jobsDic = [{text:"无"},{text:"小学"},{text:"初中"},{text:"高中"},{text:"中专"},{text:"大专"},{text:"本科"},{text:"研究生"},{text:"博士生"}]
            $scope.dic.jobsDic=['会计','人事','行政','软件工程师（前端）','软件工程师（后端）','运维工程师','编辑','管理']
            $scope.dic.positionDic = employee.positionList()
//            $scope.dic.employeeList = employee.loadEmployeeList();
            $scope.statusMap = {
                1:'试用期',
                2:'正式员工',
                3:'离职员工'
            }
            //初始值

            $scope.reset = function(){
                $scope.$childEditing = false;

                employee.getEmployee(pageEmployeeId).success(function(response){
                    $scope.formTempData = response.item;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    $scope.edit = function(){
                        $scope.$editing=true;
                        var results =employee.loadEmployeeList()
                        if(results&&results.length>0){
                            var index = Array.find(results,'id=='+pageEmployeeId).index;
                            if(index>-1){
                                results.splice(index,1);
                            }
                            results.unshift({ id:0,pyCode:'w',text:'无'});
                        }

                        $scope.employeeListConfig={
//                    data :$scope.dic.sexDic
                            width:"100%",
                            allowClear:false
                            ,data : {results: results}
                            ,matcher: function(term, text,opt) {
                                return  text.toUpperCase().indexOf(term.toUpperCase())==0|| opt["pyCode"].toUpperCase().indexOf(term.toUpperCase())>=0; }
                        }
                        $('#editParentId').select2($scope.employeeListConfig).on('change',function(event){
                            if(event.added){
                                $scope.formTempData.parentId = event.added.id
                            }

                        }).val($scope.formTempData.parentId)//设置责任人
                            .trigger("change");


                        //部门下拉树

                        initSelect('editEmpDeptTree');
                    }
                    //上级绑定
                    if($scope.$editing){
                        $scope.edit();
                    }
                }).error(function(response,status){
//                    Action.forward()
//                    SaveTooltip.showSaveTooltip(response,status)
                    alert(response)
                })
            }
            $scope.reset()





            function initSelect(obj,url){
//取得select标签的位置。obj:页面上被替代的select id.url：jsTree 获得json后台
                var $selectObj = $("#"+obj);
               var createDeptTree = function (){
                    var offset= WeiUtil.Offset($selectObj.get(0))
                    if($("#selectchild"+obj).length==1){
                        $("#selectchild"+obj).css("top",offset.top+offset.height+"px");
                        $("#selectchild"+obj).css("left",offset.left-4+"px");
                        $("#selectchild"+obj).css("width",offset.width+2+"px");
                        //判断是否创建过弹出层div
//                        if(($("#selectchild"+obj+":hidden").length==1)){
                            //打开
                            $("#selectchild"+obj).css("display","block");
//                        }else{
//                            //隐藏
//                            $("#selectchild"+obj).css("display","none");
//                        }
                    }else{
                        //初始一个div放在上一个div下边，当options的替身。
                        var $cDiv = $("<div id='selectchild"+obj+"'></div>");
                        $cDiv.css("position","absolute");
                        $cDiv.css("top",offset.top+offset.height+"px");
                        $cDiv.css("left",offset.left-4+"px");
                        $cDiv.css("width",offset.width+2+"px");
                        $cDiv.css("background","#f7f7f7");
                        $cDiv.css("border","1px solid silver");
                        var $deptDiv = $("<div></div>")
                        //生成jsTree
                        var conf={
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
                            "plugins" : [  "state", "types", "wholerow" ]

                        };
                        var treeFunc = $deptDiv.jstree(conf).on("changed.jstree", function (e, data) {
                            if(!data.node){
                                return;
                            }
                            if(data.selected.length>1){
                                return;
                            }
                            if(data.selected.length>0){
                                $('#editEmpDeptTree').val(data.node.text);
                                $scope.formTempData.deptId = parseInt(data.selected[0]);//deptId
                                $scope.formTempData.deptName = data.node.text;//deptId
                                if (!$scope.$$phase) {
                                    $scope.$apply();
                                }
                            }
//                            $iDiv.text($("#"+data.node.id+">a:eq(0)").text());
//                            //将选中的ID写进原来的select
//                            var $Option = $("<option value="+data.node.id+"selected='true'></option>");
//
//                            $("#"+obj).append($Option);
                            $cDiv.css("display","none");
                        });
                        $cDiv.append(treeFunc);
                        $("body").append($cDiv);
                    }
                }
                $selectObj.on('focus',createDeptTree)
                $selectObj.on('click',createDeptTree)
            }
            //保存
            $scope.saveData = function(){
                employee.editEmployee($scope.formTempData).success(function(response){
                    if(response.status){
                        SaveTooltip.showSaveTooltip(response);
                        Action.forward('detailEmployee', 'employee', {employeeId: $scope.formTempData.employeeId})
                    }else{
                        SaveTooltip.showSaveTooltip(response);
                    }
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status);
                })
            }

            $scope.editChildOfParent = function(item){
                var tempConfig = $scope.employeeListConfig;
                tempConfig.width='20%'
                $scope.$childEditing = true;
                $scope.$childEditingId = item.employeeId;
                $('#editChildParentId'+item.employeeId).select2(tempConfig).on('change',function(event){
                    if(event.added){
                        item.parentId = event.added.id
                    }

                }).val($scope.formTempData.employeeId)//设置责任人
                    .trigger("change");
                item.parentId = $scope.formTempData.employeeId
            }

            $scope.saveEditedChildOfParent = function(editedChildOfParent){
                if(!editedChildOfParent.parentId){
                    alert("程序错误，检查前端代码")
                    return;
                }

                if($scope.formTempData.employeeId==editedChildOfParent.employeeId){
//                    $scope.formTempData.children
                    return;
                }else{
                    var saveChildOfParentData = {
                        parentId : editedChildOfParent.parentId,
                        employeeId : editedChildOfParent.employeeId
                    }
                    employee.directRelation(saveChildOfParentData).success(function(response){
                        if(response.status){
                            var tempData = $scope.formTempData.children
                            var index = Array.find(tempData,'employeeId=='+editedChildOfParent.employeeId).index
                            $scope.formTempData.children = tempData.splice(index,1);
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                            $('#childEmployeeListSpan'+editedChildOfParent.employeeId).empty();
                            SaveTooltip.showSaveTooltip(response);
                        }else{
                            SaveTooltip.showSaveTooltip(response);
                        }
                    }).error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    })
                }
            }
            $scope.getResetPassword = function(row){
                if(!row.entity||!row.entity.employeeId){
                    return;
                }
                employee.resetPwd(row.entity.employeeId).success(function(response){
                    if(response.status){
                        SaveTooltip.showSaveTooltip(response);
                    }else{
                        SaveTooltip.showSaveTooltip(response);
                    }
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status);
                })

            }
            $scope.positive = function(){
                if(!$scope.authFlag.positive)return;
                var data = {
                    employeeId: pageEmployeeId,  //员工ID
                    status:  2 //正式
                }
                employee.positive(data).success(function(response){
                    if(response.status){
                        $scope.reset()
                    }
                    SaveTooltip.showSaveTooltip(response)
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status)
                })

            }

            $scope.dismissal = function(){
                if(!$scope.authFlag.dismissal)return;
                var data = {
                    employeeId: pageEmployeeId,  //员工ID
                    status:  3 //解聘
                }
                employee.dismissal(data).success(function(response){
                    if(response.status){
                        $scope.reset()
                    }
                    SaveTooltip.showSaveTooltip(response)
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status)
                })
            }
        }];

});