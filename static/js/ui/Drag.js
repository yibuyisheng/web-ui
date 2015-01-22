// dependence : jQuery

/**
 * 拖动
 * @param {jquery object} $box 需要移动的元素
 * @param {jquery object} $target 鼠标操作的元素
 */
define(['src/event/timer', 'lib/jquery'], function(timer) {

    return function($box, $target) {
        this._$box = $box;
        this._$target = $target;

        if (!arguments.callee.prototype._init) {
            $.extend(arguments.callee.prototype, {
                _init: function() {
                    this._$target.css('cursor', 'move');

                    this._moveReady = false;
                    var _this = this;
                    this._mousedown = function(event) {
                        _this.moveReady = true;
                        _this._prePageX = event.pageX;
                        _this._prePageY = event.pageY;
                    };
                    this._mouseup = function() {
                        _this.moveReady = false;
                    };
                    this._mousemove = function() {
                        if (!_this.moveReady) return;

                        var xDistance = event.pageX - _this._prePageX;
                        var yDistance = event.pageY - _this._prePageY;

                        timer.once(function() {
                            _this._$box.css({
                                left: parseFloat(_this._$box.css('left')) + xDistance,
                                top: parseFloat(_this._$box.css('top')) + yDistance
                            });
                        });

                        _this._prePageX = event.pageX;
                        _this._prePageY = event.pageY;
                    };
                    this._$target.on('mousedown', this._mousedown);
                    $(document).on('mousemove', this._mousemove);
                    $(document).on('mouseup', this._mouseup);
                },
                destroy: function() {
                    this._$target.css('cursor', 'auto');
                    this._$target.off('mousedown', this._mousedown);
                    $(document).off('mouseup', this._mouseup);
                    $(document).off('mousemove', this._mousemove);
                }
            });
        }

        this._init();
    };

});