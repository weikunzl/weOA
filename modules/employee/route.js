/**
 * Created by pippo on 14-10-27.
 * 设置route
 */

define(function(){
    'use strict';
    var son = [];

    var employeeList =  {
            uri: '/employee/list/:page'
            , controller: 'employeeList'
            , templateUrl: 'modules/employee/templates/employeePanel.html'
            , ifMenu: true
            , name: 'employeeList'
            , title: '员工列表'
            , icon: 'icon-edit'
            , api: ''
         };
    var addEmployee =  {
            uri: '/employee/addEmployee'
            , controller: 'addEmployee'
            , templateUrl: 'modules/employee/templates/addEmployee.html'
            , ifMenu: true
            , name: 'addEmployee'
            , title: '新增员工'
            , icon: 'icon-edit'
            , api: ''
         };
    var detailEmployee =  {
            uri: '/employee/detailEmployee/:employeeId/:edit'
            , controller: 'detailEmployee'
            , templateUrl: 'modules/employee/templates/detailEmployee.html'
            , ifMenu: false
            , name: 'detailEmployee'
            , title: '员工详情'
            , icon: 'icon-edit'
            , api: ''
         };
    var addressBook =  {
            uri: '/employee/addressBook'
            , controller: 'addressBook'
            , templateUrl: 'modules/employee/templates/addressBook.html'
            , ifMenu: true
            , name: 'addressBook'
            , title: '通讯录'
            , icon: 'icon-edit'
            , api: ''
         };

    var sonList = [addEmployee,employeeList,detailEmployee,addressBook];
    var group = 'employee'
    var authViewList = config.authViewList;
    var authParentIndex = config.menuList.indexOf('modules/'+group)
    if(authViewList&&authViewList.authDir){
        for(var i=0;i<authViewList.authDir.length;i++){
            if(sonList.length==son.length){
                break;
            }
            if(Math.floor(authViewList.authDir[i]/1000)==(authParentIndex+1)){
                if(authViewList.authDir[i]%1000-1>=sonList.length){
                    console.error('auth,error')
                    continue;
                }
                son.push(sonList[parseInt(authViewList.authDir[i]%1000)-1]);
            }
        }
    }

    return  {
        group: group
        , title: '人事管理'
        , icon: 'icon-user'
        , son:son
    };
});