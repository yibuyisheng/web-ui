define(['src/utils/base'], function(base) {

    var strMap = {
        yyyy: function(dt) {
            return dateGetter(Date.prototype.getFullYear, dt);
        },
        MM: function(dt) {
            return dateGetter(Date.prototype.getMonth, dt) + 1;
        },
        dd: function(dt) {
            return dateGetter(Date.prototype.getDate, dt);
        },
        HH: function(dt) {
            return dateGetter(Date.prototype.getHours, dt);
        },
        mm: function(dt) {
            return dateGetter(Date.prototype.getMinutes, dt);
        },
        ss: function(dt) {
            return dateGetter(Date.prototype.getSeconds, dt);
        }
    };

    return {
        dateGetter: dateGetter,
        dateFormat: dateFormat
    };

    // 时间格式化
    function dateGetter(fn, dt) {
        return fn.call(dt);
    }

    function dateFormat(dt, formatStr) {
        return formatStr.replace(/(y{4})|([M|d|H|m|s]{2})/g, function(match) {
            return strMap[match](dt);
        });
    }
});