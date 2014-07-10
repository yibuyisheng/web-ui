(function() {
  // 事件处理对象
  // 需要事件机制的object都可以继承自该object
  var eventDealer = {
    on: function(eventName, cb) {
      if (!cb instanceof Function) return;
      if (!this._cbs) this._cbs = {};
      if (!this._cbs[eventName]) this._cbs[eventName] = [];

      this._cbs[eventName].push(cb);

      return this;
    },
    trigger: function(eventName, data) {
      var _this = this;
      if (this._cbs && this._cbs[eventName]) {
        $.each(this._cbs[eventName], function() {
          if (this instanceof Function) this.call(_this, data);
        });
      }
      return this;
    }
  };

  window.eventDealer = eventDealer;
})();
  
