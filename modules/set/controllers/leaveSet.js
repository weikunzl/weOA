/**
 * Created by pippo on 14-10-22.
 * 请假设置
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'set', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Set, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;};

            $scope.data = [];
            $scope.formData={salaryTypeId:"",id:"",type:""}
            $scope.vm = {};
//            $scope.c = parseInt(localStorage.positionId)
//            if($scope.c==1){
//                window.localStorage.employeeId ='';
//                window.localStorage['positionId'] = '';
//                window.localStorage.employeeName = '';
//                window.localStorage.deptId = '';
//                Auth.overTimeLog();
//            }

            //获取数据
            $scope.downloadData = function(){
                Set.leaveSetData().
                    success(function(response){
                        if(response.status){
                            //获取数据
                                angular.forEach(response.items, function(item){
                                    item.salaryTypeName = getSalaryTypeName(item);
                                    $scope.data.push(item);
                            });

                        }else
                        {
                            SaveTooltip.showSaveTooltip(response);
                        }
                    }).
                    error(function(response,status){
                        //提示
                        SaveTooltip.showSaveTooltip(response,status);
                        $scope.isLoading = false;
                    });
            };
            $scope.downloadData();
            //获取所有工资类型

            $scope.vm.values = Set.salarySetDataSync();

            function getSalaryTypeName(item){
                if(!item||!item.salaryTypeId||item.salaryTypeId.length<1){
                    return []
                }
                var salaryTypeName = [];
                angular.forEach(item.salaryTypeId,function(salaryTypeId){
                    if(salaryTypeId){
                        salaryTypeName.push(Array.find($scope.vm.values,'salaryTypeId=='+salaryTypeId).item.salaryTypeName)
                    }
                })
                return salaryTypeName;
            }


            $scope.isClick = function isClick(salaryTypeId,item){
                if(!item.salaryTypeId){
                    item.salaryTypeId = [salaryTypeId]
                    return;
                }
                if(item.salaryTypeId.indexOf(salaryTypeId)>-1){
                    item.salaryTypeId.splice(item.salaryTypeId.indexOf(salaryTypeId),1);
                }else{
                    item.salaryTypeId.push(salaryTypeId);
                }
            }

            //根据类型验证表单是否满足提交条件
            $scope.isOK = function isOK(){
                if(angular.isUndefined($scope.formData.type)||$scope.formData.type==""){
                    return false;
                }
                return true;
            };

            //保存新增的数据
            $scope.saveData = function saveData(){
                if($scope.isOK()){
                    Set.leaveAdd($scope.formData).
                        success(function (response) {
                            if (response.status) {
                                SaveTooltip.showSaveTooltip(response);
                                $scope.formData={};
                                $scope.data=[];
                                $scope.downloadData();
                            } else {
                                SaveTooltip.showSaveTooltip(response);
                            }
                        }).
                        error(function(response,status){
                            SaveTooltip.showSaveTooltip(response,status);
                        });
                }
                $scope.formData={};
            }

            //保存编辑的数据
            $scope.saveEditData = function saveEditData(item){
                item.$editing = false;
                Set.leaveSet({salaryTypeId:item.salaryTypeId,type:item.type,id:item.id}).
                    success(function (response) {
                        if (response.status) {
                            $scope.data=[];
                            $scope.downloadData();
                            SaveTooltip.showSaveTooltip(response);
                        } else {
                            SaveTooltip.showSaveTooltip(response);
                        }
                    }).
                    error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    });
            }

            //删除
            $scope.deleteItem = function(item){
                item.isDelete = 1; //标识该数据被删除
                var formData = {};
                formData.id  = item.id ;
                Set.leaveDelete(formData.id).
                    success(function(response){
                        if(response.status){
                            //从列表中删除数据
                            for(var i =0; i <$scope.data.length; i++){
                                if($scope.data[i].id  == item.id ){
                                    //从列表中删除该条数据
                                    $scope.data.splice(i, 1);
                                    break;
                                }
                            }
                            SaveTooltip.showSaveTooltip(response);
                        } else {
                            item.isDelete = 0;    //取消该数据的删除状态
                            SaveTooltip.showSaveTooltip(response);
                        }
                    }).
                    error(function(response,status){
                        SaveTooltip.showSaveTooltip(response,status);
                    });
                //刷新列表
                $scope.$root.$$phase || $scope.$apply();
            };

        }];
});