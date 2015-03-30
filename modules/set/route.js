/**
 * Created by pippo on 14-10-27.
 * 设置route
 */

define(function(){
    'use strict';

    var son =[];
    var leaveSet =
        {
            uri: '/set/leaveSet'
            , controller: 'leaveSet'
            , templateUrl: 'modules/set/templates/leaveSet.html'
            , ifMenu: true
            , name: 'leaveSet'
            , title: '请假设置'
            , icon: 'icon-th'
            , api: ''
        };
    var attendanceTimeSet =
    {
        uri: '/set/attendanceTimeSet'
        , controller: 'attendanceTimeSet'
        , templateUrl: 'modules/set/templates/attendanceTimeSet.html'
        , ifMenu: true
        , name: 'attendanceTimeSet'
        , title: '出勤薪资绑定'
        , icon: 'icon-th'
        , api: ''
    };
    var salarySet ={
            uri: '/set/salarySet'
            , controller: 'salarySet'
            , templateUrl: 'modules/set/templates/salarySet.html'
            , ifMenu: true
            , name: 'salarySet'
            , title: '工资设置'
            , icon: 'icon-th'
            , api: ''
        };
     var workOvertimeSet = {
            uri: '/set/workOvertimeSet'
            , controller: 'workOvertimeSet'
            , templateUrl: 'modules/set/templates/workOvertimeSet.html'
            , ifMenu: true
            , name: 'workOvertimeSet'
            , title: '加班设置'
            , icon: 'icon-edit'
            , api: ''
        };
    var salaryPwdSet = {
            uri: '/set/salaryPwdSet'
            , controller: 'salaryPwdSet'
            , templateUrl: 'modules/set/templates/salaryPwdSet.html'
            , ifMenu: true
            , name: 'salaryPwdSet'
            , title: '薪资密码设置'
            , icon: 'icon-edit'
            , api: ''
        };


//    var positionAuth =  {
//        uri: '/set/positionAuth'
//        , controller: 'positionAuth'
//        , templateUrl: 'modules/set/templates/positionAuthPanel.html'
//        , ifMenu: false
//        , name: 'positionAuth'
//        , title: '职务权限绑定'
//        , icon: 'icon-edit'
//        , api: ''
//    };
    var  positionSet =  {
        uri: '/set/positionSet'
        , controller: 'positionSet'
        , templateUrl: 'modules/set/templates/positionSet.html'
        , ifMenu: true
        , name: 'positionSet'
        , title: '职务设置'
        , icon: 'icon-edit'
        , api: ''
    };
    var deptList =  {
        uri: '/dept/:page'
        , controller: 'deptList'
        , templateUrl: 'modules/set/templates/deptPanel.html'
        , ifMenu: true
        , name: 'dept'
        , title: '权限管理'
        , icon: 'icon-edit'
        , api: ''
    };

//    var addNewEmployee =  {
//        uri: '/dept/addNewEmployee'
//        , controller: 'addNewEmployee'
//        , templateUrl: 'modules/set/templates/addNewEmployee.html'
//        , ifMenu: false
//        , name: 'addNewEmployee'
//        , title: '权限管理'
//        , icon: 'icon-edit'
//        , api: ''
//    };
    var sonList = [leaveSet,salarySet,salaryPwdSet,workOvertimeSet,attendanceTimeSet,positionSet,deptList];
    var group = 'set'
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
//    var positionId = window.localStorage.positionId;
//    if(positionId==config.systemArguments.adminRole){
////        son = [leaveSet,salarySet,workOvertimeSet,salaryPwdSet];
//        son = [leaveSet,salarySet,workOvertimeSet,attendanceTimeSet,deptList,addNewEmployee,positionSet];
//    }else{
//        son = [leaveSet,salarySet,workOvertimeSet,attendanceTimeSet];
//    }
    return  {
        group: group
        , title: '设置'
        , icon: 'icon-cog'
        , son:son
    };
});