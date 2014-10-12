Function.prototype.bind = function() {
  var args = arguments;
  var obj = args.length > 0 ? args[0] : undefined;
  var _this = this;
  return function() {
    var totalArgs = Array.prototype.concat.apply(Array.prototype.slice.call(args, 1), arguments);
    return _this.apply(obj, totalArgs);
  };
}

Array.prototype.reduce = function(callback, initialValue) {
  if (Object.prototype.toString.call(callback) !== '[object Function]') return;

  var arr = initialValue ? Array.prototype.concat.call(this, initialValue) : this;
  if (arr.length < 2) return initialValue;

  var previousValue = arr[0];
  for (var i = 1, len = arr.length; i < len; i += 1) {
    previousValue = callback(previousValue, this[i], i, this);
  }
  return previousValue;
};
