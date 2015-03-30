/**
 * Created by pippo on 14-10-22.
 * 工资设置
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'pay', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Pay, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;};;
            $scope.data = [];
            $scope.submit=true;
            $scope.employeeId="";
            $scope.timeFrom=""
            var myDate = new Date();
            var myYear = myDate.getFullYear()
            var myMonth =  myDate.getMonth();
            $scope.timeFrom=myYear+"-"+myMonth
            $scope.c = parseInt(localStorage.positionId)
            $scope.b = localStorage.employeeName
            $scope.a = parseInt(localStorage.employeeId)
            if($scope.c==1){
                window.localStorage.employeeId ='';
                window.localStorage['positionId'] = '';
                window.localStorage.employeeName = '';
                window.localStorage.deptId = '';
                Auth.overTimeLog();
            }

            //获取全体员工列表
            $scope.download = function(){
                Pay.employees().
                    success(function(response){
                        if(response.status){
                            //获取数据
                            if(response.status){
                                var vm = $scope.vm = {};
                                vm.cities =response.items;
                            }else{
                                //提示框
                                SaveTooltip.showSaveTooltip(response);
                            }
                        }
                    }).
                    error(function(response,status){
                        //提示
                        SaveTooltip.showSaveTooltip(response,status);
                    });
            };
            //获取全体员工列表
            $scope.download();

            //获取数据
            $scope.downloadData = function(){
                Pay.salarySetData().
                    success(function(response){
                        if(response.status){
                            //获取数据
                            $scope.salaerdata=response.items
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

            //提交条件判定
            $scope.edit=function edit(item){
                angular.forEach(item,function(i){
                    if(i.salary!=""&&!angular.isUndefined(i.salary)&&$scope.employeeId!=""&&$scope.employeeId!==null&&$scope.timeFrom!=""){
                        $scope.submit=false;
                    }
                    else{
                        $scope.submit=true;
                    }
                })
                if($scope.employeeId==""||$scope.employeeId==null){
                    $scope.submit=true;
                }
                if($scope.timeFrom==""){
                    $scope.submit=true;
                }
            }

            //提交数据
            $scope.saveEditData = function saveEditData(item){
                var sendData={};
                sendData.time=$scope.timeFrom;
                sendData.employeeId=$scope.employeeId;
                sendData.pay=item;
                Pay.payAdd(sendData).
                    success(function (response) {
                        if (response.status) {
                            Pay.employees().
                                success(function(response){
                                    if(response.status){
                                        //获取数据
                                        if(response.status){
                                            var vm = $scope.vm = {};
                                            vm.cities ="";
                                            vm.cities=response.items;
                                        }else{
                                            //提示框
                                            SaveTooltip.showSaveTooltip(response);
                                        }
                                    }
                                }).
                                error(function(response,status){
                                    //提示
                                    SaveTooltip.showSaveTooltip(response,status);
                                });

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