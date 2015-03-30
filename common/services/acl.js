/**
 * Created with JetBrains WebStorm.
 * User: @kazaff
 * Date: 13-9-6
 * Time: 下午4:40
 */
define(function(){
    'use strict';
    var initialize = function(module){
        module.factory('acl', [function( api){
            return  function(api){
                if(api == "edit")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }]);

        return module;
    };

    return {
        initialize: initialize
    };
});