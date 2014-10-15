
(function() {
  var isInteger = function(src) {
    return src - parseInt( src ) >= 0;
  };


  // 私有变量
  var privateVariables = {guid: 0};

  var ArrayExt = function() {
    this._key = 'ArrayExt-' + privateVariables.guid ++;
    privateVariables[this._key] = {};

    if (arguments.length === 0) {
      privateVariables[this._key].arr = new Array();
    } else if (arguments.length === 1 && isInteger(arguments[0])) {
      privateVariables[this._key].arr = new Array(parseInt(arguments[0]));
    } else if (arguments.length === 1 && arguments[0] instanceof Array) {
      privateVariables[this._key].arr = arguments[0];
    } else {
      privateVariables[this._key].arr = [];
      for (var i = 0, il = arguments.length; i < il; i += 1) privateVariables[this._key].arr.push(arguments[i]);
    }
  };



  ArrayExt.prototype.get = function(index) {
    return privateVariables[this._key].arr[index];
  };
  ArrayExt.prototype.add = function(ele) {
    privateVariables[this._key].arr.push(ele);
    return this;
  };
  ArrayExt.prototype.modify = function(index, ele) {
    privateVariables[this._key].arr[index] = ele;
    return this;
  };
  ArrayExt.prototype.size = function() {
    return privateVariables[this._key].arr.length;
  };
  ArrayExt.prototype.forEach = function(callback, thisArg) {
    var array = this instanceof Array ? this : privateVariables[this._key].arr;
    if (!callback instanceof Function) return array;

    if (Array.prototype.forEach) {
      Array.prototype.forEach.call(array, callback, thisArg);
    } else {
      for (var i = 0, il = array.length; i < il; i += 1) {
        callback.call(thisArg, array[i], i, array);
      }
    }
    return array;
  };
  ArrayExt.prototype.map = function(callback) {
    var isArray = this instanceof Array;
    var array = isArray ? this : privateVariables[this._key].arr;
    if (!callback instanceof Function) return isArray ? [] : new ArrayExt();

    var ret = isArray ? [] : new ArrayExt();
    for (var i = 0, il = array.length; i < il; i += 1) {
      ret.push(callback.call(array, array[i], i, array));
    }
    return ret;
  };
  ArrayExt.prototype.each = function(callback) {
    var array = this instanceof Array ? this : privateVariables[this._key].arr;
    if (!callback instanceof Function) return array;

    for (var i = 0, il = array.length; i < il; i += 1) {
      if (callback.call(array, array[i], i, array)) break;
    }

    return array;
  };
  ArrayExt.prototype.filter = function(filterFn) {
    var isArray = this instanceof Array;
    var array = isArray ? this : privateVariables[this._key].arr;
    if (!filterFn instanceof Function) return isArray ? [] : new ArrayExt();

    var ret = isArray ? [] : new ArrayExt();
    for (var i = 0, il = array.length; i < il; i += 1) {
      if (filterFn.call(array, array[i], i, array)) ret.push(array[i]);
    }
    return ret;
  };
  ArrayExt.prototype.getHash = function() {
    return this._key;
  };
  ArrayExt.prototype.destroy = function() {
    privateVariables[this._key] = null;
    delete privateVariables[this._key];
  }




  ArrayExt.prototype.concat = function() {
    return this instanceof Array ? 
      Array.prototype.concat.apply(privateVariables[this._key].arr, arguments) : 
      new ArrayExt(Array.prototype.concat.apply(privateVariables[this._key].arr, arguments));
  };
  ArrayExt.prototype.join = function() {
    return Array.prototype.join.apply(privateVariables[this._key].arr, arguments);
  };
  ArrayExt.prototype.pop = function() {
    return Array.prototype.pop.apply(privateVariables[this._key].arr, arguments);
  };
  ArrayExt.prototype.push = function() {
    Array.prototype.push.apply(privateVariables[this._key].arr, arguments);
    return this;
  };
  ArrayExt.prototype.reverse = function() {
    Array.prototype.reverse.apply(privateVariables[this._key].arr, arguments);
    return this;
  };
  ArrayExt.prototype.shift = function() {
    return Array.prototype.shift.apply(privateVariables[this._key].arr, arguments);
  };
  ArrayExt.prototype.slice = function() {
    return this instanceof Array ? 
      Array.prototype.slice.apply(privateVariables[this._key].arr, arguments) :
      new ArrayExt(Array.prototype.slice.apply(privateVariables[this._key].arr, arguments));
  };
  ArrayExt.prototype.sort = function() {
    Array.prototype.sort.apply(privateVariables[this._key].arr, arguments);
    return this;
  };
  ArrayExt.prototype.splice = function() {
    Array.prototype.splice.apply(privateVariables[this._key].arr, arguments);
    return this;
  };
  ArrayExt.prototype.toSource = function() {
    return Array.prototype.toSource.apply(privateVariables[this._key].arr, arguments);
  };
  ArrayExt.prototype.toString = function() {
    return Array.prototype.toString.apply(privateVariables[this._key].arr, arguments);
  };
  ArrayExt.prototype.toLocaleString = function() {
    return Array.prototype.toLocaleString.apply(privateVariables[this._key].arr, arguments);
  };
  ArrayExt.prototype.unshift = function() {
    return Array.prototype.unshift.apply(privateVariables[this._key].arr, arguments);
  };
  ArrayExt.prototype.valueOf = function() {
    return Array.prototype.valueOf.apply(privateVariables[this._key].arr, arguments);
  };

  window.ArrayExt = ArrayExt;
})();