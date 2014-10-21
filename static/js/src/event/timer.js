// 用于界面动画的“定时器”
define(['src/utils/utils'], function(utils) {

  // 外部注册进来的回调函数
  var callbacks = [];

  var timerCallback = function() {    
    callbacks = utils.filter(callbacks, function(val, index) {
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

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(timerCallback);
    } else {
      window.setTimeout(timerCallback, 50);
    }
  };
  timerCallback();

  return {
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

});