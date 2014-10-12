Function.prototype.bind = function() {
  var args = arguments;
  var obj = args.length > 0 ? args[0] : undefined;
  var _this = this;
  return function() {
    var totalArgs = Array.prototype.concat.apply(Array.prototype.slice.call(args, 1), arguments);
    return _this.apply(obj, totalArgs);
  };
}
