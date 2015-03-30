/**
 * Created by pippo on 14-10-27.
 * 请假Services
 */
define(function(){
    'use strict';

    return ['$http','saveTooltip', function($http,SaveTooltip){
        var url = config.domain + 'leave';
        var url2 = config.domain + 'set';
        var url3 = config.domain + 'employees';
        function undefinedParse(str){
//            if(str==undefined){
//                return '';
//            }
            return str?str:'';
        }
        return {
            //列表
            leaveList: function(searchData,tag){
                if(tag=='own'){
                    var invalid = searchData.invalid?1:0
                    return $http.get(url + "/listOwn/"+searchData.page+"?beginTime="+undefinedParse(searchData.beginTime)
                        + "&endTime=" + undefinedParse(searchData.endTime)
                        +"&statusId="+searchData.status+ "&leaveTypeId="+searchData.leaveTypeId+"&invalid=" +invalid+"&time=" + new Date().getTime());
                }else if(tag=='employeeList'){
                    return $http.get(url + "/listEmp/" + searchData.page + "?deptId=" + undefinedParse(searchData.deptId) + "&beginTime=" + undefinedParse(searchData.beginTime)
                        + "&endTime=" + undefinedParse(searchData.endTime) + "&employeeText=" + undefinedParse(searchData.employeeText) + "&statusId=" + searchData.status
                        + "&leaveTypeId="+searchData.leaveTypeId+ "&time=" + new Date().getTime());
                }else {
                    return $http.get(url + "/list/" + searchData.page + "?deptId=" + undefinedParse(searchData.deptId) + "&beginTime=" + undefinedParse(searchData.beginTime)
                        + "&endTime=" + undefinedParse(searchData.endTime) + "&employeeText=" + undefinedParse(searchData.employeeText) + "&statusId=" + searchData.status
                        + "&leaveTypeId="+searchData.leaveTypeId+ "&time=" + new Date().getTime());
                }
            },
            leaveListEdit:function(searchData){
                return $http.get(url + "/listEdit/"+searchData.page+"?beginTime="+undefinedParse(searchData.beginTime)
                    + "&endTime=" + undefinedParse(searchData.endTime)+ "&employeeText=" + undefinedParse(searchData.employeeText)+ "&leaveTypeId="+searchData.leaveTypeId+"&time=" + new Date().getTime());

             },
            //获取可调休时间获取
            leaveHasTime: function(date){
                var leaveHasTime
                date = undefinedParse(date)==''?new Date('Y-m'):undefinedParse(date);
                 $.ajax({ url: url + "/hasTime"+ "?excMonth="+date+"&time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
                    if(response.status){
                        leaveHasTime  = response.item;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                     SaveTooltip.showSaveTooltip(response,response.status);
                 }});
                return leaveHasTime;
            },

            //编辑获取
            leaveEditData: function(id){
                return $http.get(url +"/"+  id+ "?time=" + new Date().getTime());
            },

            //新增
            leaveAdd: function(data){
                return $http.post(url , data);
            },

            //请假类型获取
            leaveType:function(){
                var leaveType = [];
                $.ajax({ url:url2 + "/leaveSet/data"+ "?time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
                    if(response.status){
                        leaveType  = response.items;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                    SaveTooltip.showSaveTooltip(response,response.status);
                }});
                return leaveType;
            },
            //编辑提交
            leaveEdit: function(data){
                return $http.put(url , data);
            },
            //销假
            leaveRemove: function(leaveId){
                return $http.get(url + "/remove?leaveId="+ leaveId);
            },
            //销假
            leaveRemoveEdit: function(data){
                return $http.put(url + "/remove", data);
            },
            //删除
            leaveDelete: function(id){
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
//                return $http.get(url3 + "lowlist/leave"+"?adminId="+adminId+"&beginTime="+beginTime+"&endTime="+ endTime+"&time=" + new Date().getTime());
//            }
        };
    }];
});