define(function() {
  var toString = Object.prototype.toString;

  function getClassName(obj) {
    return toString.call(obj).slice(8, -1);
  }

  function isObject(obj) {
    return getClassName(obj) === 'Object';
  }

  function isFunction(obj) {
    return getClassName(obj) === 'Function';
  }

  function isArray(obj) {
    return getClassName(obj) === 'Array';
  }

  function reduce(arr, callback, initialValue) {
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
  }

  // 实现extend方法
  function extend() {
    var args = arguments;
    if (!args.length) return;
    if (!args.length === 1) return args[0];

    function isValueType(obj) {
      return typeof obj !== 'object'             // 不是对象类型
        || typeof obj === 'undefined'
        || obj === null;
    }
    if (isValueType(args[0])) return args[0];

    function merge(obj1, obj2) {
      if (isValueType(obj2)) return obj1;

      for (var k in obj2) {
        if (isValueType(obj1[k])) {
          obj1[k] = obj2[k];
        } 
        // 是对象类型
        else {
          obj1[k] = {};
          merge(obj1[k], obj2[k]);
        }
      }
      return obj1;
    }

    for (var i = 1, il = args.length; i < il; i += 1) {
      args[0] = merge(args[0], args[i]);
    }

    return args[0];
  }

  function map(arr, fn, thisArg) {
    if (!isArray(arr) || !isFunction(fn)) return arr;

    var map = Array.prototype.map || function(fn, thisArg) {
      var newArr = [];
      for (var i in this) {
        newArr.push(fn.call(thisArg, this, this[i], i, this));
      }
      return newArr;
    };

    return map.call(arr, fn, thisArg);
  }

  function filter(arr, fn, thisArg) {
    if (!isArray(arr) || !isFunction(fn)) return arr;

    var filter = Array.prototype.filter || function(fn, thisArg) {
      var newArr = [];
      for (var i in this) {
        if (fn.call(thisArg, this, this[i], i, this)) newArr.push(this[i]);
      }
      return newArr;
    };

    return filter.call(arr, fn, thisArg);
  }

  function forEach(arr, fn, thisArg) {
    if (!isArray(arr) || !isFunction(fn)) return;

    var forEach = Array.prototype.forEach || function(fn, thisArg) {
      for (var i in this) {
        fn.call(thisArg, this, this[i], i, this);
      }
    };

    forEach.call(arr, fn, thisArg);
  }

  function some(arr, fn, thisArg) {
    if (!isArray(arr) || !isFunction(fn)) return;

    var some = Array.prototype.some || function(fn, thisArg) {
      for (var i in arr) {
        if (fn.call(thisArg, this, this[i], i, this)) return true;
      }
      return false;
    };

    return some.call(arr, fn, thisArg);
  }

  // 函数连续调用
  function chain(obj, fn, args) {
    var ret = fn.apply(obj, args);
    return typeof ret !== 'undefined' ? ret : obj;
  }

  function bind(fn, thisArg) {
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
    return bind.apply(fn, [thisArg].concat(Array.prototype.slice.call(arguments, 1)));
  }

  // 时间格式化
  function dateGetter(fn, dt) {
    return fn.call(dt);
  }
  var strMap = {
    yyyy: bind(dateGetter, Date.prototype.getFullYear),
    MM: function(dt) { return dateGetter(Date.prototype.getMonth, dt) + 1; },
    dd: bind(dateGetter, Date.prototype.getDate),
    HH: bind(dateGetter, Date.prototype.getHours),
    mm: bind(dateGetter, Date.prototype.getMinutes),
    ss: bind(dateGetter, Date.prototype.getSeconds)
  };
  function dateFormat(dt, formatStr) {
    return formatStr.replace(/(y{4})|(M{2})|(d{2})|(H{2})|(m{2})|(s{2})/g, function(match) {
      return strMap[match](dt);
    });
  }

  return {
    isFunction: isFunction,
    isArray: isArray,
    extend: extend,
    bind: bind,
    reduce: reduce,
    map: map,
    filter: filter,
    forEach: forEach,
    some: some,
    chain: chain,
    dateFormat: dateFormat
  };

});
