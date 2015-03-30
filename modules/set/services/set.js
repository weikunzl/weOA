/**
 * Created by pippo on 14-10-27.
 * 设置Services
 */
define(function(){
    'use strict';

    return ['$http', function($http){
        var url = config.domain + 'set/';
        return {

            //请假列表获取
            leaveSetData: function(){
                return $http.get(url + "leaveSet/data"+ "?time=" + new Date().getTime());
            },

            //请假编辑提交
            leaveSet: function(data){
                return $http.put(url + "leaveSet/edit", data);
            },

            //请假新增提交
            leaveAdd: function(data){
                return $http.post(url + "leaveSet/add", data);
            },
            //请假删除
            leaveDelete: function(id){
                return $http.delete(url + "leaveSet/delete/"+id);
            },

            //加班编辑获取
            workOvertimeSetData: function(){
                return $http.get(url + "workovertimeSet/data"+ "?time=" + new Date().getTime());
            },

            //加班编辑提交
            workOvertimeSet: function(data){
                return $http.put(url + "workovertimeSet/add", data);
            },


            //工资类型增加
            salarySetAdd: function(data){
                return $http.post(url + "salarySet/add", data);
            },

            //工资类型获取
            salarySetData: function(){
                return $http.get(url + "salarySet/data"+ "?time=" + new Date().getTime());
            },
            //工资类型获取
            salarySetDataSync: function(){
                var otherSalaryType = [] ;
                $.ajax({ url: url + "salarySet/data"+ "?time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
                    if(response.status){
                        otherSalaryType  = response.items;
                    }else{
                        //提示框

                    }
                },error:function(response){
//                    SaveTooltip.showSaveTooltip(response,response.status);
                }});
                return otherSalaryType;
            },
            //工资类型编辑提交
            salarySet: function(data){
                return $http.put(url + "salarySet/edit", data);
            },

            //工资类型删除
            salaryDelete: function(id){
                return $http.delete(url + "salarySet/delete/"+id);
            },
            //设置密码
            salaryPwdSet: function(pwd){
                return $http.get(url + "salaryPasswordSet?passwordOld="+pwd.passwordOld+"&passwordNew="+pwd.passwordNew);
            },
            //迟到早退
            attendanceTimeSetData: function(){
                return $http.get(url + "attendanceTimeSet"+ "?time=" + new Date().getTime());
            },

            //迟到早退提交
            attendanceTimeSet: function(data){
                return $http.put(url + "attendanceTimeSet", data);
            },
            //职务列表
            getPositionList: function(){
                return $http.get(url + "position");
            },
            //职务删除
            positionDelete: function(id){
                return $http.delete(url + "position/"+id);
            },
            //职务新增
            positionAdd: function(data){
                return $http.post(url + "position",data);
            },
            //职务修改
            positionEdit: function(data){
                return $http.put(url + "position",data);
            },
            getLeaveType:function(){
                var otherSalary = [];
                $.ajax({ url: url + "leaveSet/data"+ "?time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
                    if(response.status){
                        otherSalary = response.items;
                    }else{
                        //提示框
//                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
//                    SaveTooltip.showSaveTooltip(response,response.status);
                }});
                return otherSalary;
            }
        };
    }];
});