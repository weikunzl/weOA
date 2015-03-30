/**
 * Created by pippo on 14-10-22.
 * 工资设置
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', '$routeParams', '$location', '$modal', '$q', 'action', 'set', 'saveTooltip','dataBusiness'
        , function($scope, Auth, $routeParams, $location, $modal, $q, Action, Set, SaveTooltip,DataBusiness){
            if(!Auth.isLogined()){ return;};
            $scope.setPassword = function setPassword(){
                var password = {
                    passwordOld : $scope.salaryInputPasswordOld,
                    passwordNew : $scope.salaryInputPassword1
                }
                Set.salaryPwdSet(password).success(function(response){

                }).error(function(response,status){
                    //提示框
                    SaveTooltip.showSaveTooltip(response,status);
                });
            }
        }];
});