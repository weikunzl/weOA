/**
 * Created by pippo on 14-10-27.
 * 设置Services
 */
define(function(){
    'use strict';

    return ['$http','saveTooltip', function($http,SaveTooltip){
        var url = config.domain + 'dept';
        var url2 = config.domain + 'employeeInfo';
        var url3 = config.domain + 'position';
        var url4 = config.domain + 'auth';
        return {
//            test: function () {
//                return $http.get('books0.json');
//            },
            deptList: function (deptId) {
                var tempData
                $.ajax({ url: url + "?deptId="+deptId+"&time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
                    if(response.status){
                        tempData = response.items;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                    SaveTooltip.showSaveTooltip(response,response.status);
                }});
                return tempData;
//                return $http.get('books0.json?');
            },
            deptEmployeeList: function (searchData,pageSize,page) {
                return $http.get(url2 + "?beginTime="+ searchData.timeFrom+"&endTime="+ searchData.timeTo+"&employeeText="+(searchData.employeeText?searchData.employeeText:"")+
                    "&deptId="+(searchData.deptId?searchData.deptId:0)+ "&page="+page+"&pageSize="+pageSize+"&time=" + new Date().getTime());
                //return $http.get('books0.json?'+searchData);
            },
            getNewEmployeeList:function(){
                return $http.get(url2+'/newEmployeeList');
            },
            deptDelete:function (deptId) {
                return $http.delete(url +'?deptId='+deptId);
            },
            deptEdit:function (editTempData_create,editTempData_update) {
                return $http.put(url,{"createData":editTempData_create,"updateData":editTempData_update});
            },
            //职务获取
            positionList : function(){
                return $http.get(url3);
            },
            //权限获取
            authList : function(){
                var tempData
                $.ajax({ url: url4 + "?&time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
                    if(response.status){
                        tempData = response.items;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                    SaveTooltip.showSaveTooltip(response,response.status);
                }});
                return tempData;
            },
            //职务权限获取
            getPositionAuth : function(positionId){
                return $http.get(url4+'/position/'+positionId);
            },
            updatePositionAuth : function(positionData){
                return $http.put(url4+'/position',positionData);
            },
            //个人权限获取
            getEmpAuth : function(employeeId){
                return $http.get(url4+'/employee/'+employeeId);
            },
            updateEmpAuth : function(data){
                return $http.put(url4+'/employee',data);
            }
//            deptEdit:function (editTempData_create,editTempData_update) {
//                return $http.put(url,{"createData":editTempData_create,"updateData":editTempData_update});
//            },
        };
    }];
});