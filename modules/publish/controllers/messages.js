/**
 * Created by @kazaff on 14-3-25.
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', "message", "$routeParams", "action", function($scope, Auth, Message, $routeParams, Action){
        if(!Auth.isLogined()){ return;};;

        $scope.msgType = $routeParams.type;
        $scope.msgStatus = parseInt($routeParams.status);
        $scope.msgList = [];
        $scope.page = 1;
        $scope.perPage = 20;
        $scope.hasManyData = true;
        $scope.isLoading = false;


        //切换数据类型
        $scope.changeType = function(type){
            if(type != $scope.msgType){
                Action.forward("messageList", "publish", {type: type, status: 0});
            }
        };

        //切换数据状态
        $scope.changeStatus = function(status){
            if(status != $scope.msgStatus){
                Action.forward("messageList", "publish", {type: $scope.msgType, status: status});
            }
        };

        //删除自定消息
        $scope.deleteMsg = function(id){

            Message.delNew(id, $scope.msgType, function(response){

                if(response.ok == 0){
                    angular.element.gritter.add({
                        title: '提示'
                        , text: '消息删除失败'
                        , class_name: 'loser'
                        , image: 'img/save.png'
                        , sticky: false
                    });

                }else{
                    angular.forEach($scope.msgList, function(item, index){
                        if(item._id == id){
                            $scope.msgList.splice(index, 1);
                            return false;
                        }
                    });

                    //删除成功提示
                    angular.element.gritter.add({
                        title: '提示'
                        , text: '消息删除成功'
                        , class_name: 'winner'
                        , image: 'img/save.png'
                        , sticky: false
                    });
                }

                $scope.$root.$$phase || $scope.$apply();
            });
        };

        //获取列表数据
        $scope.getData = function(){
            $scope.isLoading = true;

            Message.getNewsList($scope.msgType, $scope.msgStatus, $scope.page++, $scope.perPage, function(response){
                $scope.isLoading = false;
                if(!angular.isUndefined(response.ok)){

                    angular.element.gritter.add({
                        title: '提示'
                        , text: '消息列表获取失败'
                        , class_name: 'loser'
                        , image: 'img/save.png'
                        , sticky: false
                    });

                    return;
                }

                if(response.length === 0){
                    $scope.hasManyData = false;
                }

                angular.forEach(response, function(item){
                    $scope.msgList.push(item);
                });
                $scope.$root.$$phase || $scope.$apply();
            });
        };

        $scope.getData();
    }];
});