/**
 * TODO: event pipe / event stream
 * 事件管道/事件流：Model a + Model b -> Model e, Model c + Model d -> Model f, Model e + Model f -> UI
 */

(function(global) {

    // 依赖
    var base = global.base;
    var arrayHelper = global.arrayHelper;

    var eventDealer = {
        on: function(eventName, cb) {
            if (!base.isFunction(cb)) return;
            if (!this._cbs) this._cbs = {};
            if (!this._cbs[eventName]) this._cbs[eventName] = [];
            this._cbs[eventName].push(cb);
            return this;
        },
        trigger: function(eventName, data) {
            if (this._cbs && this._cbs[eventName]) {
                this._cbs[eventName] = arrayHelper.filter(this._cbs[eventName], function(val) {
                    if (base.isFunction(val)) val.call(this, data);
                    return val !== null;
                }, this);
            }
            return this;
        },
        off: function(eventName, cb) {
            if (!base.isFunction(cb)) return;
            this._cbs[eventName] = arrayHelper.map(this._cbs[eventName], function(val, index, arr) {
                return val === cb ? null : val;
            });
        },
        pipe: function() {

        }
    };

    global.eventDealer = eventDealer;
})((window.WEBUI = window.WEBUI || {}, window.WEBUI));
