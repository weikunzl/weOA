/**
 * Created by pippo on 14-10-27.
 * 请假Services
 */
define(function(){
    'use strict';

    return ['$http','saveTooltip', function($http,SaveTooltip){
        var url = config.domain + 'evection';
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
            evectionList: function(searchData,tag){
                if(tag=='own'){
                    var invalid = searchData.invalid?1:0
                    return $http.get(url + "/listOwn/"+searchData.page+"?beginTime="+undefinedParse(searchData.beginTime)
                        + "&endTime=" + undefinedParse(searchData.endTime)
                        +"&statusId="+searchData.status+"&invalid=" +invalid+"&time=" + new Date().getTime());
                }else if(tag=='employeeList'){
                    return $http.get(url + "/listEmp/" + searchData.page + "?deptId=" + undefinedParse(searchData.deptId) + "&beginTime=" + undefinedParse(searchData.beginTime)
                        + "&endTime=" + undefinedParse(searchData.endTime) + "&employeeText=" + undefinedParse(searchData.employeeText) + "&statusId=" + searchData.status
                       + "&time=" + new Date().getTime());
                }else {
                    return $http.get(url + "/list/" + searchData.page + "?deptId=" + undefinedParse(searchData.deptId) + "&beginTime=" + undefinedParse(searchData.beginTime)
                        + "&endTime=" + undefinedParse(searchData.endTime) + "&employeeText=" + undefinedParse(searchData.employeeText) + "&statusId=" + searchData.status
                        + "&time=" + new Date().getTime());
                }
            },
            evectionListEdit:function(searchData){
                return $http.get(url + "/listEdit/"+searchData.page+"?beginTime="+undefinedParse(searchData.beginTime)
                    + "&endTime=" + undefinedParse(searchData.endTime)+ "&time=" + new Date().getTime());

             },


            //编辑获取
            evectionEditData: function(id){
                return $http.get(url +"/"+  id+ "?time=" + new Date().getTime());
            },

            //新增
            evectionAdd: function(data){
                return $http.post(url , data);
            },
            //编辑提交
            evectionEdit: function(data){
                return $http.put(url , data);
            },
            //销假
            evectionRemove: function(evectionId){
                return $http.get(url + "/remove?evectionId="+ evectionId);
            },
            //销假
            evectionRemoveEdit: function(data){
                return $http.put(url + "/remove", data);
            },
            //删除
            evectionDelete: function(id){
                return $http.delete(url+"/" +id);
            },
            //轨迹
            trackList: function (id) {
                return $http.get(url + "/track/" + id+ "?time=" + new Date().getTime());
            },
            //驳回
            rejectData: function(formData){
                return $http.post(url + "/pass",formData);
            },
            //批准
            passData: function(formData){
                return $http.post(url + "/pass",formData);
            }
//            //下属员工列表
//            lowEmployees:function (adminId,beginTime,endTime) {
//                return $http.get(url3 + "lowlist/evection"+"?adminId="+adminId+"&beginTime="+beginTime+"&endTime="+ endTime+"&time=" + new Date().getTime());
//            }
        };
    }];
});