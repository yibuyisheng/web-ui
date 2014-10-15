(function(global) {
  var WEB_UI = global.WEB_UI = global.WEB_UI || {};

  var toString = Object.prototype.toString;

  var isFunction = function(obj) {
    return toString.call(obj) === '[object Function]';
  };

  var isArray = function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // TODO: 实现extend方法
  var extend = $.extend;
  WEB_UI.extend = extend;
  WEB_UI = extend(WEB_UI, {
    isFunction: isFunction,
    isArray: isArray,
    bind: function(fn) {
      if (!isFunction(fn)) return;

      var bind = Function.prototype.bind || function() {
        var args = arguments;
        var obj = args.length > 0 ? args[0] : undefined;
        var _this = this;
        return function() {
          var totalArgs = Array.prototype.concat.apply(Array.prototype.slice.call(args, 1), arguments);
          return _this.apply(obj, totalArgs);
        };
      };
      bind.apply(fn, Array.prototype.slice.call(arguments, 1));
    },
    reduce: function(arr, callback, initialValue) {
      if (!isArray(arr)) return;

      var reduce = Array.prototype.reduce || function(callback, initialValue) {
        if (!isFunction(callback)) return;

        var arr = initialValue ? Array.prototype.concat.call(this, initialValue) : this;
        if (arr.length < 2) return initialValue;

        var previousValue = arr[0];
        for (var i = 1, len = arr.length; i < len; i += 1) {
          previousValue = callback(previousValue, this[i], i, this);
        }
        return previousValue;
      };
      reduce.call(arr, callback, initialValue);
    },
    map: function(arr, fn, thisArg) {
      if (!isArray(arr) || !isFunction(fn)) return arr;

      var map = Array.prototype.map || function(fn) {
        var newArr = [];
        for (var i in this) {
          var ret = thisArg ? fn.call(thisArg, this, this[i], i, this) : fn(this, this[i], i, this);
          newArr.push(this[i]);
        }
        return newArr;
      };

      return map.call(arr, fn, thisArg);
    },
    filter = function(arr, fn, thisArg) {
      if (!isArray(arr) || !isFunction(fn)) return arr;

      var map = Array.prototype.filter || function(fn) {
        var newArr = [];
        for (var i in this) {
          var ret = false;
          if (thisArg) ret = fn.call(thisArg, this, this[i], i, this);
          else ret = fn(this, this[i], i, this);

          if (ret) newArr.push(this[i]);
        }
        return newArr;
      };

      return filter.call(arr, fn, thisArg);
    },
    forEach: function(arr, fn, thisArg) {
      if (!isArray(arr) || !isFunction(fn)) return;

      var forEach = Array.prototype.forEach || function() {
        for (var i in this) {
          if (thisArg) fn.call(thisArg, this, this[i], i, this);
          else fn(this, this[i], i, this);
        }
      };

      forEach.call(arr, fn, thisArg);
    },
    // 函数连续调用
    chain: function(obj, fn, args) {
      var ret = fn.apply(obj, args);
      return typeof ret !== 'undefined' ? ret : obj;
    };
  });

  global.WEB_UI = WEB_UI;

})(window);
