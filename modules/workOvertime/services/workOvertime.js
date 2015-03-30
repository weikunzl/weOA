/**
 * Created by pippo on 14-10-27.
 * 加班Services
 */
define(function(){
    'use strict';

    return ['$http', function($http){
        var url = config.domain + 'workOvertime';
//        var url2 = config.domain + 'employees/';
        var url3 = config.domain + 'set';
        return {
            //列表
            workOvertimeList: function(searchData,tag){
                if(tag=='own'){
                    return $http.get(url + "/listOwn/"+searchData.page+"?beginTime="+searchData.beginTime+"&endTime="+searchData.endTime
                        +"&status="+searchData.status+ "&time=" + new Date().getTime());
                }else if(tag=='employeeList'){
                    return $http.get(url + "/listEmp/"+searchData.page+"?deptId=" + searchData.deptId + "&beginTime=" + searchData.beginTime + "&endTime=" + searchData.endTime
                        + "&employeeText=" + searchData.employeeText + "&status=" + searchData.status + "&time=" + new Date().getTime());
                }else {
                    return $http.get(url + "/list/" + searchData.page + "?deptId=" + searchData.deptId + "&beginTime=" + searchData.beginTime + "&endTime=" + searchData.endTime
                        + "&employeeText=" + searchData.employeeText + "&status=" + searchData.status + "&time=" + new Date().getTime());
                }

            },
//            //管理员列表
//            LeaderWorkOvertimeList: function(page,adminId,time,employeeID){
//                return $http.get(url2 + "workOvertimeList/"+page+"?adminId="+adminId+"&searchTime="+time+"&employeeID="+employeeID+ "&time=" + new Date().getTime());
//            },
            //编辑获取
            workOvertimeEditData: function(id){
                return $http.get(url+"/"  + id+ "?time=" + new Date().getTime());
            },
            //新增获取
            workOvertimeSetData: function(){
                return $http.get(url3 + "/workOvertimeSet/data"+ "?time=" + new Date().getTime());
            },
            //新增
            workOvertimeAdd: function(data){
                data.isSalary =  parseInt(data.isSalary)
                return $http.post(url , data);
            },

            //编辑提交
            workOvertimeEdit: function(data){
                data.isSalary =  parseInt(data.isSalary)
                return $http.put(url, data);
            },

            //删除
            workOvertimeDelete: function(id){
                return $http.delete(url+"/" +id);
            },
            //轨迹
            trackList: function (id) {
                return $http.get(url + "/track/" + id+ "?time=" + new Date().getTime());
            },
            //驳回
            rejectData: function(id){
                return $http.post(url + "/pass",id);
            },
            //批准
            passData: function(id){
                return $http.post(url + "/pass",id);
            }
//            //下属员工列表
//            lowEmployees:function (adminId,beginTime,endTime) {
//                return $http.get(url2 + "lowlist/workOvertime"+"?adminId="+adminId+"&beginTime="+beginTime+"&endTime="+ endTime+"&time=" + new Date().getTime());
//            }
        };
    }];
});