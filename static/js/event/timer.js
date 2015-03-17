// 用于界面动画的“定时器”
var arrayHelper = require('../utils/arrayHelper.js');

// 外部注册进来的回调函数
var callbacks = [];

var timerFunction = window.requestAnimationFrame ? window.requestAnimationFrame : function() {
    return function(fn) {
        window.setTimeout(fn, 50)
    };
};
timerCallback();

module.exports = {
    // 添加timer回调函数
    add: function(fn, minInterval) {
        var fnObj = {
            preTime: +(new Date()),
            minInterval: minInterval ? minInterval : 0,
            type: 'every',
            callback: fn
        };
        callbacks.push(fnObj);
    },
    // 移除timer回调函数
    remove: function(fn) {
        callbacks = utils.map(callbacks, function(val) {
            return val.callback === fn ? null : val;
        });
    },
    // 注册一个只会调用一次的函数
    once: function(fn, minDelay) {
        callbacks.push({
            preTime: +(new Date()),
            minDelay: minDelay ? minDelay : 0,
            type: 'once',
            callback: fn
        });
    }
};

function timerCallback() {
    callbacks = arrayHelper.filter(callbacks, function(val, index) {
        var now = +(new Date());
        if (
            val
            && (
                (val.type === 'every' && now - val.preTime >= val.minInterval)
                || (val.type === 'once' && now - val.preTime >= val.minDelay)
            )
        ) {
            val.callback();
            if (val.type === 'once') val = null;
            else val.preTime = now;
        }

        return val !== null;
    });

    timerFunction(timerCallback);
}
