define(['utils/base'], function(base) {

    var strMap = {
        yyyy: bind(dateGetter, Date.prototype.getFullYear),
        MM: function(dt) {
            return dateGetter(Date.prototype.getMonth, dt) + 1;
        },
        dd: bind(dateGetter, Date.prototype.getDate),
        HH: bind(dateGetter, Date.prototype.getHours),
        mm: bind(dateGetter, Date.prototype.getMinutes),
        ss: bind(dateGetter, Date.prototype.getSeconds)
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