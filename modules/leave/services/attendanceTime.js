/**
 * Created by pippo on 14-10-27.
 * 设置Services
 */
define(function(){
    'use strict';

    return ['$http','saveTooltip', function($http,SaveTooltip){
        var url = config.domain + 'attendanceTime';

        return {
            list: function (searchData,page) {
               return $http.get(url+'/list/'+page+'?beginTime='+searchData.beginTime+'&endTime='+searchData.endTime+'&employeeText='+searchData.employeeText+'&deptText='+searchData.deptText)
            },
            listOwn: function (searchData,page) {
               return $http.get(url+'/listOwn/'+page+'?beginTime='+searchData.beginTime+'&endTime='+searchData.endTime)
            },
            listEdit: function (searchData,page) {
               return $http.get(url+'/listSomeOne/'+page+'?month='+searchData.month+'&employeeId='+searchData.employeeId)
            },
            save: function (data) {
                if(data.attendanceTimeId){//修改
                    return $http.put(url,data);
                }else{//新增
                    return $http.post(url,data);
                }
            },
            deleteData: function (attendanceTimeId) {
                return $http.delete(url+"/"+attendanceTimeId)
            }
        };
    }];
});