/**
 * Created by pippo on 14-10-22.
 * 薪资列表
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'employee', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, employee, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;}
            $scope.title = "新增员工信息"
            //初始化参数
            $scope.employeeId = parseInt(localStorage.employeeId)
            //判断用户类型改变视图
            $scope.positionId = parseInt(localStorage.positionId)
//            if($scope.positionId==config.systemArguments.adminRole){
                $scope.deptId = 1
//            }else{
//                $scope.deptId = parseInt(localStorage.deptId)
//            }
            var results =employee.loadEmployeeList();
            results.unshift({ id:0,pyCode:'w',text:'无'});
            $scope.employeeListConfig={
//                    data :$scope.dic.sexDic
                width:"100%",
                allowClear:false
                ,data : {results: results}
                ,matcher: function(term, text,opt) {
                    return  text.toUpperCase().indexOf(term.toUpperCase())==0|| opt["pyCode"].toUpperCase().indexOf(term.toUpperCase())>=0; }
            }
            $('#parentId').select2($scope.employeeListConfig).on('change',function(event){
                if(event.added){
                    $scope.formTempData.parentId = event.added.id
                }

            }).val(16)//设置责任人
                .trigger("change");
//            $('#parentId').select2();

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

//            $scope.dic.positionDic=[{
//                positionId:1,
//                positionName:"普通员工"
//            },{
//                positionId:2,
//                positionName:"经理"
//            }]
            $scope.dic.employeeList = employee.loadEmployeeList();

            //初始值

            $scope.reset = function(){
                $scope.formTempData={sex:2
                    ,positionId:$scope.dic.positionDic[0].positionId
                    ,jobs: $scope.dic.jobsDic[0]
                    ,education: $scope.dic.educationDic[6].text
                    ,joinDate:new Date().format('Y-m-d')
                    ,parentId : 5
//                    ,deptName:''
                }
            }
            $scope.reset();
            initSelect('addEmpDeptTree');

//            function initSelect(obj,url){
////取得select标签的位置。obj:页面上被替代的select id.url：jsTree 获得json后台
//                var $selectObj = $("#"+obj);
//                var offset1=Offset($selectObj.get(0)); //取得Select所在的位置
////                $selectObj.css("display","none");//隐藏原来的select
//                var $iDiv = $("<div id='selectof"+obj+"'></div>");//模拟一个div替代select
//                $iDiv.css("position","absolute");
//                if(window.innerWidth<1480){
//                    offset1.top+=25
//                }
//                $iDiv.css("top",offset1.top-(window.innerHeight+100)*0.05+"px");
//                $iDiv.css("left",offset1.left+"px");
//                $iDiv.css("width",offset1.width+"px");
//                $iDiv.css("height",offset1.height+5+"px");
////                $iDiv.css("border","1px solid #3366ff");
//                $iDiv.css("font-size","15px");
//                $iDiv.css("font-weight","normal");
////                $iDiv.css("font-weight","normal");
//                $iDiv.css("textIndent","6px");
////                $iDiv.css("textAlign","center");
//                $iDiv.css("padding-top","5px");
//                $("body").append($iDiv);
//
//
//                $(window).resize(function() {  var offset= Offset($selectObj.get(0))//窗口变化事件
//                    $iDiv.css("top",offset.top+"px");
//                    $iDiv.css("left",offset.left+"px");
//                    $iDiv.css("width",offset.width+"px");
//                })
//                $iDiv.click(function(){
//                    var offset= Offset($selectObj.get(0))
////                    $iDiv.css("position","absolute");
//                    $iDiv.css("top",(offset.top)-3+"px");
//                    $iDiv.css("left",offset.left+"px");
//                    $iDiv.css("width",offset.width+"px");
//                    if($("#selectchild"+obj).length==1){
//                        $("#selectchild"+obj).css("top",offset.top+offset.height+"px");
//                        $("#selectchild"+obj).css("left",offset.left-4+"px");
//                        $("#selectchild"+obj).css("width",offset.width+2+"px");
//                        //判断是否创建过弹出层div
//                        if(($("#selectchild"+obj+":hidden").length==1)){
//                            //打开
//                            $("#selectchild"+obj).css("display","block");
//                        }else{
//                            //隐藏
//                            $("#selectchild"+obj).css("display","none");
//                        }
//                    }else{
//                        //初始一个div放在上一个div下边，当options的替身。
//                        var $cDiv = $("<div id='selectchild"+obj+"'></div>");
//                        $cDiv.css("position","absolute");
//                        $cDiv.css("top",offset.top+offset.height+"px");
//                        $cDiv.css("left",offset.left-4+"px");
//                        $cDiv.css("width",offset.width+2+"px");
//                        $cDiv.css("background","#f7f7f7");
//                        $cDiv.css("border","1px solid silver");
//                        var $deptDiv = $("<div></div>")
//                        //生成jsTree
//                        var conf={
//                            types : {
//                                "default": {
//                                    clickable: true,
//                                    draggable: false    //设置节点不可拖拽
//                                },
//                                "root" : {
//                                    valid_children: "folder" //设置下级节点类型，可是数组
//                                }
//                            },
//                            'core' : {
//                                "themes" : { "stripes" : true,icons:false },
//                                "animation" : 0,
//                                "check_callback" : true,
//                                'data' : getDeptList(),
//                                "multiple ":false
//                            },
//                            "plugins" : [  "state", "types", "wholerow" ]
//
//                        };
//                        var treeFunc = $deptDiv.jstree(conf).on("changed.jstree", function (e, data) {
//                            if(!data.node){
//                                return;
//                            }
//                            if(data.selected.length>1){
//                                return;
//                            }
//                            if(data.selected.length>0){
//                                $scope.formTempData.deptId = data.selected[0];//deptId
//                                if (!$scope.$$phase) {
//                                    $scope.$apply();
//                                }
//                            }
//                            $iDiv.text($("#"+data.node.id+">a:eq(0)").text());
//                            //将选中的ID写进原来的select
//                            var $Option = $("<option value="+data.node.id+"selected='true'></option>");
//
//                            $("#"+obj).append($Option);
//                            $cDiv.css("display","none");
//                        });
//                        $cDiv.append(treeFunc);
//                        $("body").append($cDiv);
//                    }
//                })
//            }
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
                        if(($("#selectchild"+obj+":hidden").length==1)){
                            //打开
                            $("#selectchild"+obj).css("display","block");
                        }else{
                            //隐藏
                            $("#selectchild"+obj).css("display","none");
                        }
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
                $scope.formTempData.status = 1;
                employee.addEmployee($scope.formTempData).success(function(response){
                    if(response.status){
                        SaveTooltip.showSaveTooltip(response);
                        Action.forward('employeeList', 'employee', {page: 1})
                    }else{
                        SaveTooltip.showSaveTooltip(response);
                    }
                }).error(function(response,status){
                    SaveTooltip.showSaveTooltip(response,status);
                })
            }


        }];

});