/**
 * Created by pippo on 14-10-22.
 * 工资设置
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'set', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Set, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;};
            $scope.data = [];
            $scope.formData={salaryTypeName:"",salaryTypeId:""}
            $scope.c = parseInt(localStorage.positionId)
//            if($scope.c==1){
//                window.localStorage.employeeId ='';
//                window.localStorage['positionId'] = '';
//                window.localStorage.employeeName = '';
//                window.localStorage.deptId = '';
//                Auth.overTimeLog();
//            }
            //获取数据
            $scope.downloadData = function(){
                Set.salarySetData().
                    success(function(response){
                        if(response.status){
                            //获取数据
                            angular.forEach(response.items, function(item){
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


            //根据类型验证表单是否满足提交条件
            $scope.isOK = function isOK(){
                if(angular.isUndefined($scope.formData.salaryTypeName)||$scope.formData.salaryTypeName==""){
                    return false;
                }
                return true;
            };
            //提交增加的数据
            $scope.saveData = function saveData(){
                if($scope.isOK()){
                    Set.salarySetAdd($scope.formData).
                        success(function (response) {
                            if (response.status) {
                                SaveTooltip.showSaveTooltip(response);
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
            }

            //提交编辑的数据
            $scope.saveEditData = function saveEditData(item){
                item.$editing = false;
                    Set.salarySet({salaryTypeId:item.salaryTypeId,salaryTypeName:item.salaryTypeName}).
                        success(function (response) {
                            if (response.status) {
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
                formData.salaryTypeId  = item.salaryTypeId ;
                Set.salaryDelete(formData.salaryTypeId).
                    success(function(response){
                        if(response.status){
                            //从列表中删除数据
                            for(var i =0; i <$scope.data.length; i++){
                                if($scope.data[i].salaryTypeId  == item.salaryTypeId ){
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