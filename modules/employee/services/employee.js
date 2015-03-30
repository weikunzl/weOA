/**
 * Created by pippo on 14-10-27.
 * 设置Services
 */
define(function(){
    'use strict';

    return ['$http','saveTooltip', function($http,SaveTooltip){
        var url = config.domain + 'employee';
        var url2 = config.domain + 'directRelation';
        function undefinedParse(str){
            return str?str:'';
        }
        return {
            test:function(){
                return $http.get("books1.json");
            },
            getEmployeeList:function(page,searchData){
                return $http.get(url+'/'+page+'?status='+searchData.status+'&employeeText='+undefinedParse(searchData.employeeText));
            },
            getEmployee:function(employeeId){
                return $http.get(url+'/userInfo?employeeId='+employeeId);
            },
            deptList: function (deptId) {
                var tempData
                $.ajax({ url: config.domain +  "dept?deptId="+deptId+"&time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
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
            } ,
            positionList: function () {
                var tempData
                $.ajax({ url: config.domain +  "position?&time=" + new Date().getTime(), async : false,context: document.body, success: function(response){
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
            } ,
            loadEmployeeList:function(){
                var tempData = [];
                $.ajax({ url: url+'?status=1,2'+'&employeeText=', async : false,context: document.body, success: function(response){
                    if(response.status){
                        if(response.items&&response.items.length>0){
                            angular.forEach(response.items,function(item){
                                tempData.push({
                                    id : item.employeeId,
                                    text:item.employeeName,
                                    pyCode:item.code
                                })
                            })
                        }
//                        tempData = response.items;
                    }else{
                        //提示框
                        SaveTooltip.showSaveTooltip(response);
                    }
                },error:function(response){
                    SaveTooltip.showSaveTooltip(response,response.status);
                }});
                return tempData;
            },
            //提交新员工
            addEmployee:function(data){
                return $http.post(url,data);
            },
            //提交新员工
            editEmployee:function(data){
                return $http.put(url,data);
            },
             //重置密码
            resetPwd:function(id){
                return $http.get(url+'/resetPwd/'+id);
            },
            //修改员工上属
            directRelation:function(data){
                return $http.put(url2,data);
            },
            //转正
            positive:function(data){
                return $http.put(url+'/status',data);
            },
            //解聘
            dismissal:function(data){
                return $http.put(url+'/status',data);
            }

        };
    }];
});