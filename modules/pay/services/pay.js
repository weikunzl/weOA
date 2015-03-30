/**
 * Created by pippo on 14-10-27.
 * 设置Services
 */
define(function(){
    'use strict';

    return ['$http','saveTooltip', function($http,SaveTooltip){
        var url = config.domain + 'pay/';
        var url3 = config.domain + 'set/';
        var url4 = config.domain + 'dept';
        function undefinedParse(str){
            return str?str:'';
        }
        return {

            //薪资列表
            payList: function (searchData,pageSize,page,authFlag) {
                if(authFlag.payListAdjustment){
                    return $http.get(url + "list/"+page+"?beginTime="+ searchData.timeFrom+"&endTime="+ searchData.timeTo+"&employeeText="+undefinedParse(searchData.employeeText)
                        +"&deptText="+undefinedParse(searchData.deptText)+
                        "&pageSize="+pageSize+"&time=" + new Date().getTime());
                }else if(authFlag.payListOwn){
                    return $http.get(url + "listOwn/"+page+"?beginTime="+ searchData.timeFrom+"&endTime="+ searchData.timeTo+"&employeeText="+undefinedParse(searchData.employeeText)
                        +"&deptText="+undefinedParse(searchData.deptText)+
                        "&pageSize="+pageSize+"&time=" + new Date().getTime());
                }else{
                    return ;
                }
            },

            //工资类型获取
            getSalaryType: function(){
                var otherSalaryType = [] ;
                $.ajax({ url: url3 + "salarySet/data"+ "?time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
                    if(response.status){
                        otherSalaryType  = response.items;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                    SaveTooltip.showSaveTooltip(response,response.status);
                }});
                return otherSalaryType;
            },

            getLeaveType:function(){
                var otherSalary = [];
                $.ajax({ url: url3 + "leaveSet/data"+ "?time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
                    if(response.status){
                        otherSalary = response.items;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                    SaveTooltip.showSaveTooltip(response,response.status);
                }});
                return otherSalary;
            },
            getSalaryDetail : function(selectedInfo){
                var salaryDetail;
                $.ajax({ url: url + "detail?salaryId="+selectedInfo.salaryId+"&time=" + new Date().getTime(), async : false,context: document.body, success: function(response){

                    if(response.status){
                        salaryDetail = response.items;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                    SaveTooltip.showSaveTooltip(response,response.status);
                }});
                return salaryDetail;
            },
            getSalaryDetailOwn : function(selectedInfo){
                var salaryDetail;
                $.ajax({ url: url + "detailOwn?salaryId="+selectedInfo.salaryId+"&time=" + new Date().getTime(), async : false,context: document.body, success: function(response){

                    if(response.status){
                        salaryDetail = response.items;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                    SaveTooltip.showSaveTooltip(response,response.status);
                }});
                return salaryDetail;
            },
            //薪资调整
            salaryAdjustment: function (searchData,pageSize,page) {
                return $http.get(url+'salaryAdjustment/' +page+"?employeeText="+undefinedParse(searchData.employeeText)+'&deptText='+undefinedParse(searchData.deptText)+
                    "&pageSize="+pageSize+"&time=" + new Date().getTime());
            },
            salaryAdjustmentEdit: function (data) {
                return $http.put(url+'salaryAdjustment',data);
            },
            salaryAdjustmentSetAll : function (month) {//薪资生成
                return $http.get(url+"salaryAdjustmentSet?month="+ month+"&time=" + new Date().getTime());
            },
            salaryAdjustmentSet : function (month,dataList,tag) {//薪资生成
                var data = {
                    month : month
                }
                if(tag=='dept'){
                    data.deptList = dataList;
                    data.employeeList = [];
                }else if(tag=='employee'){
                    data.employeeList = dataList;
                    data.deptList = [];
                }
                return $http.put(url+"salaryAdjustmentSetByRule",data);
            },
            deptList: function (deptId) {
                var tempData
                $.ajax({ url: url4 + "?deptId="+deptId+"&time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
                    if(response.status){
                        tempData = response.items;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                    SaveTooltip.showSaveTooltip(response,response.status);
                    return;
                }});
                return tempData;
//                return $http.get('books0.json?');
            },
            salaryAdjustmentDetail : function(employeeId){
                return $http.get(url+'salaryAdjustmentDetail?employeeId='+employeeId+"&time=" + new Date().getTime())
            },
            releaseSalaryAll : function(){
                return $http.get(url+'release');
            },
            releaseSalary : function(salaryIdList){
                return $http.put(url+'release',salaryIdList)
            }
        };
    }];
});