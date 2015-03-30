/**
 * Created with JetBrains WebStorm.
 * User: @webber
 * Date: 2014/10/18
 * Time: 下午4:04
 */
define(function(){
//    var domain = "http://oa.ztydata.cn:81/checkingIn/";
//    var host = "http://oa.ztydata.cn:81/ztyOAUI/";
    var domain = "http://127.0.0.1:8080/ztyOA/";
    var host = "http://127.0.0.1:8080/ztyOAUI/";
    var modules = [] ;
     var menuList =[
         'modules/publish',
         'modules/leave',
         'modules/workOvertime',
         'modules/set',
         'modules/pay',
         'modules/employee',
         'modules/evection'
     ];
    var authViewList = {};
    if(window.location.href!=(host+'login.html')&&window.localStorage.authViewList&&window.localStorage.authViewList!=''){
        eval('authViewList = '+window.localStorage.authViewList);
        if(authViewList.root){
            for(var i=0;i<authViewList.root.length;i++){
                modules.push(menuList[parseInt(authViewList.root[i])-1]);
            }
        }
    }else if(window.location.href!=(host+'login.html')){
        window.localStorage.employeeId ='';
        window.localStorage.positionId = '';
        window.localStorage.code ='';
        window.localStorage.employeeName = '';
        window.localStorage.deptId ='';
        window.localStorage.positionName = '';
        window.localStorage.authViewList = '';
        window.location.href = host+'login.html';
    }

    //定义要加载的模块
    return window.config = {
        appId: 0
        //前端URL
       , host:host
        //请求后端地址
       , domain:domain
        , modules:modules
        , menuList:menuList
        //分页显示大小
        , pageSize: 10
        //角色权限配置 大模块  子模块再内层过滤
        ,authViewList : authViewList//权限
        ,systemArguments:{
            leaveTypeExc : 21,//调休id
            extOverRestTime : 21.5,//调休id
            zeroDept : '000',
            noonRestHour : 2.5,//午休时长，不能超过3小时， 超过需修改代码
            noonRestTime : 12,//中午休息时间
            morningWorkTime : 8,//中午休息时间
            afternoonWorkTime : 14.5,//下午上班时间
            afternoonRestTime : 18.5,//下午上班时间
            isSafeSalaryType : [15],//保险
            isCompanySafeSalaryType : [16],//保险
            authSorter : [1,2,3,7,4,5,6]//保险
        }
    };
});