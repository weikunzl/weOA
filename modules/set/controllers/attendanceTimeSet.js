/**
 * Created by pippo on 14-10-22.
 * 请假设置
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'set', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Set, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;};
            $scope.item = {
                salaryTypeId :[]
            }
            $scope.formData={salaryTypeId:""}
            var vm = $scope.vm = {};
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
                Set.attendanceTimeSetData().
                    success(function(response){
                        if(response.status){
                            //获取数据
                            $scope.item.salaryTypeId = response.item

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
            $scope.getSalaryTypeName = function(item){
                if(!item){
                    return
                }
                var salaryTypeName = [];
                for(var i=0;i<item.salaryTypeId.length;i++){
                    if(item.salaryTypeId[i]){
                        salaryTypeName.push(Array.find($scope.vm.values,'salaryTypeId=='+item.salaryTypeId[i]).item.salaryTypeName)
                    }
                }
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
//                if(angular.isUndefined($scope.formData.type)||$scope.formData.type==""){
//                    return false;
//                }
                return true;
            };

            //保存编辑的数据
            $scope.saveEditData = function saveEditData(item){
                item.$editing = false;
                Set.attendanceTimeSet(item.salaryTypeId).
                    success(function (response) {
                        if (response.status) {
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

        }];
});