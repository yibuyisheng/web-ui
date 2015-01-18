define(['utils/base'], function(base) {

    var strMap = {
        yyyy: base.bind(dateGetter, Date.prototype.getFullYear),
        MM: function(dt) {
            return dateGetter(Date.prototype.getMonth, dt) + 1;
        },
        dd: base.bind(dateGetter, Date.prototype.getDate),
        HH: base.bind(dateGetter, Date.prototype.getHours),
        mm: base.bind(dateGetter, Date.prototype.getMinutes),
        ss: base.bind(dateGetter, Date.prototype.getSeconds)
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