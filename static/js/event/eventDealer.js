// 依赖
var base = require('../utils/base.js');
var arrayHelper = require('../utils/arrayHelper.js');

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
    }
};

module.exports = eventDealer;
