// dependence: utils/utils.js
/**
 * TODO: event pipe / event stream
 * 事件管道/事件流：Model a + Model b -> Model e, Model c + Model d -> Model f, Model e + Model f -> UI
 */
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
            if (this._cbs && this._cbs[eventName]) {
                this._cbs[eventName] = utils.filter(this._cbs[eventName], function(val) {
                    if (utils.isFunction(val)) val.call(this, data);
                    return val !== null;
                }, this);
            }
            return this;
        },
        off: function(eventName, cb) {
            if (!utils.isFunction(cb)) return;
            this._cbs[eventName] = utils.map(this._cbs[eventName], function(val, index, arr) {
                return val === cb ? null : val;
            });
        },
        pipe: function() {
            
        }
    };

    return eventDealer;
});