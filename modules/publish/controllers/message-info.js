/**
 * Created by @kazaff on 14-3-25.
 */
define(function(){
    'use strict';

    return ['$scope', 'auth', "message", "$routeParams", "action", function($scope, Auth, Message, $routeParams, Action){
        if(!Auth.isLogined()){ return;};;

        $scope.msgInfo = null;
        $scope.msgType = $routeParams.type;
        $scope.replyForm = {};
        $scope.isLoading = true;

        //获取消息信息
        Message.getNewInfo($routeParams.id, $routeParams.type, function(response){

            $scope.isLoading = false;
            if(response === null || !angular.isUndefined(response.ok)){

                angular.element.gritter.add({
                    title: '提示'
                    , text: '消息获取失败，可能已删除'
                    , class_name: 'loser'
                    , image: 'img/save.png'
                    , sticky: false
                });

                Action.forward("messageList", "publish", {type: $scope.msgType, status: 0});
                $scope.$root.$$phase || $scope.$apply();
                return;
            }

            $scope.msgInfo = response;
            $scope.$root.$$phase || $scope.$apply();
        });

        //删除指定消息
        $scope.deleteMsg = function(){
            if($scope.msgInfo){
                Message.delNew($scope.msgInfo._id, $routeParams.type, function(response){

                    if(response.ok == 0){
                        angular.element.gritter.add({
                            title: '提示'
                            , text: '消息删除失败'
                            , class_name: 'loser'
                            , image: 'img/save.png'
                            , sticky: false
                        });

                    }else{
                        Action.forward("messageList", "publish", {type: $routeParams.type, status: 0});
                    }

                    $scope.$root.$$phase || $scope.$apply();
                });
            }
        };

        //回复
        $scope.reply = function(){

            Message.send($scope.msgInfo.from, $scope.replyForm.title, $scope.replyForm.message, function(response){
                if(response.ok == 1){
                    $scope.replyForm = {};

                    //回复成功提示
                    angular.element.gritter.add({
                        title: '提示'
                        , text: '消息回复成功!'
                        , class_name: 'winner'
                        , image: 'img/save.png'
                        , sticky: false
                    });
                }else{
                    angular.element.gritter.add({
                        title: '提示'
                        , text: '消息回复失败'
                        , class_name: 'loser'
                        , image: 'img/save.png'
                        , sticky: false
                    });
                }

                $scope.$root.$$phase || $scope.$apply();
            });
        };

        //历史消息
        $scope.history = function(){
            if($scope.msgInfo){
                Action.forward("messageHistory", "publish", {type: $scope.msgType, target: ($scope.msgType != 0)? $scope.msgInfo.from : $scope.msgInfo.sid});
            }
        };
    }];
});