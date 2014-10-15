// dependence: utils/utils.js
define([
  'src/utils/utils'
], function(
  utils
) {

  // 事件处理对象
  // 需要事件机制的object都可以继承自该object
  var eventDealer = {
    on: function(eventName, cb) {
      if (!utils.isFunction(cb)) return;
      if (!this._cbs) this._cbs = {};
      if (!this._cbs[eventName]) this._cbs[eventName] = [];

      this._cbs[eventName].push(cb);

      return this;
    },
    trigger: function(eventName, data) {
      var _this = this;
      if (this._cbs && this._cbs[eventName]) {
        utils.forEach(this._cbs[eventName], function(val) {
          if (utils.isFunction(val)) val.call(_this, data);
        });
      }
      return this;
    },
    off: function(eventName, cb) {
      if (!utils.isFunction(cb)) return;

      // 使用setTimeout，防止在trigger的时候前面的函数off掉后面的函数，造成回调遍历出错
      var _this = this;
      setTimeout(function() {
        _this._cbs[eventName] = utils.filter(_this._cbs[eventName], function(val) {
          return val !== cb;
        });
      });
    }
  };

  return eventDealer;

});
