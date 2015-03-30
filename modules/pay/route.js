/**
 * Created by pippo on 14-10-27.
 * 设置route
 */

define(function(){
    'use strict';
    var son=[];
    var payList =
        {
            uri: '/pay/payList/:page'
            , controller: 'payList'
            , templateUrl: 'modules/pay/templates/listTabs.html'
            , ifMenu: true
            , name: 'payList'
            , title: '薪资列表'
            , icon: 'icon-edit'
            , api: ''
        };
      var salaryAdjustment =  {
            uri: '/pay/salaryAdjustment'
            , controller: 'salaryAdjustment'
            , templateUrl: 'modules/pay/templates/salaryAdjustmentList.html'
            , ifMenu: true
            , name: 'salaryAdjustment'
            , title: '薪资调整'
            , icon: 'icon-edit'
            , api: ''
        };
    var add =  {
            uri: '/pay/add'
            , controller: 'add'
            , templateUrl: 'modules/pay/templates/add.html'
            , ifMenu: false
            , name: 'add'
            , title: '薪资调整'
            , icon: 'icon-edit'
            , api: ''
        };
    var sonList = [payList,salaryAdjustment,add];
    var group = 'pay'
    var authViewList = config.authViewList;
    var authParentIndex = config.menuList.indexOf('modules/'+group)
    if(authViewList&&authViewList.authDir){
        for(var i=0;i<authViewList.authDir.length;i++){
            if(sonList.length==son.length){
                break;
            }
            if(Math.floor(authViewList.authDir[i]/1000)==(authParentIndex+1)){
                son.push(sonList[parseInt(authViewList.authDir[i]%1000)-1]);
            }
        }
    }

    return  {
        group: group
        , title: '薪资'
        , icon: 'icon-money'
        , son:son
    };
});