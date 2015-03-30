/**
 * Created by pippo on 14-10-27.
 * 设置Services
 */
define(function(){
    'use strict';

    return ['$http','saveTooltip', function($http,SaveTooltip){
        var url = config.domain + 'mainIndex/';

        function undefinedParse(str){
            return str?str:'';
        }
        return {
//            getLeaveHour: function () {
//                return $http.get(url + "leaveHour?date="+new Date().format('Y-m-d')+"&time=" + new Date().getTime());
//            },
//            getWorkOvertimeHour: function () {
//                return $http.get(url + "workOvertimeHour?date="+new Date().format('Y-m-d')+"&time=" + new Date().getTime());
//            }
        };
    }];
});