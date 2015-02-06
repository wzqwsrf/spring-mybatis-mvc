/**
 * Created by zhenqingwang on 7/24/14.
 */
//dataTable样式-->


//替换方法
(function ($) {
    $.parseStr = function (str) {
        var args = [].slice.call(arguments, 1),
            i = 0;
        return str.replace(/%s/g, function () {
            return args[i++];
        });
    }
})(jQuery);

function getCurrentMonthStart() {
    var start_time = new Date();
    start_time.setMilliseconds(0);
    start_time.setDate(1);
    start_time.setHours(0);
    start_time.setMinutes(0);
    start_time.setSeconds(0);
    return start_time;
}

function containsValue(list, value) {
    var len = list.length;
    for (var i = 0; i < len; i++) {
        if (list[i] == value) {
            return true;
        }
    }
    return false;
}

/*   判断输入框值是否为空*/
function isNull(value) {
    if (value == undefined || value == '' || value == null) {
        return true;
    }
    return false;
}
