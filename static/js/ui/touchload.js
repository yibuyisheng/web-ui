define([
    'src/event/eventDealer'
], function(
    eventDealer
) {
    return {
        create: function($scroll) {
            return new TouchLoad($scroll);
        }
    };

    /**
     * 移动端的触摸加载（向上向下）
     */
    function TouchLoad($scroll) {
        this._$scroll = $scroll;

        if (!TouchLoad.prototype._init) {
            base.extend(TouchLoad.prototype, eventDealer, {
                _init: function() {
                    this._$top = document.createElement('div');
                    this._$bottom = document.createElement('div');

                    this._$top.style.display = 'none';
                    this._$bottom.style.display = 'none';

                    this._$scroll.insertBefore(this._$top, this._$scroll.firstElementChild);
                    this._$scroll.appendChild(this._$bottom);

                    var state = {
                        isStart: false,
                        position: null, // 给当前滑动定性，究竟是变动顶部的div还是变动底部的div
                        previousY: null,

                        offsetHeight: null
                    };
                    var _this = this;
                    this._$scroll.addEventListener('touchstart', touchstart);
                    this._$scroll.addEventListener('touchmove', touchmove);
                    this._$scroll.addEventListener('touchend', touchend);

                    this._touchstart = touchstart;
                    this._touchmove = touchmove;
                    this._touchend = touchend;

                    function touchstart() {
                        state.isStart = true;
                        state.previousY = event.touches[0].clientY;

                        state.offsetHeight = this._$scroll.offsetHeight;
                    }

                    function touchmove() {
                        if (!state.isStart) return;

                        _this._$top.style.display = 'block';
                        _this._$bottom.style.display = 'block';

                        var distance = event.touches[0].clientY - state.previousY;
                        // 第一次进来，根据这次的运动方向决定position
                        if (!state.position) {
                            state.position = distance > 0 ? 'top' : 'bottom';
                        }

                        // 应该顶部动
                        if (state.position === 'top' && _this._$scroll.scrollTop === 0) {
                            var preHeight = parseFloat(_this._$top.style.height);
                            preHeight = preHeight ? preHeight : 0;
                            _this._$top.style.height = (preHeight + distance) + 'px';
                        }
                        // 应该底部动
                        else if (state.position === 'bottom'
                            && (_this._$scroll.scrollTop + state.offsetHeight === _this._$scroll.scrollHeight)
                        ) {
                            var preHeight = parseFloat(_this._$bottom.style.height);
                            preHeight = preHeight ? preHeight : 0;
                            _this._$bottom.style.height = (preHeight - distance) + 'px';
                        }

                        state.previousY = event.touches[0].clientY;
                    }

                    function touchend() {
                        try {
                            if (_this._$top.offsetHeight > 50) {
                                _this.trigger('topLoad');
                            } else if (_this._$bottom.offsetHeight > 50) {
                                _this.trigger('bottomLoad');
                            }
                        } catch (e) {
                            throw e;
                        } finally {
                            state.isStart = false;
                            state.previousY = null;
                            state.position = null;

                            _this._$top.style.display = 'none';
                            _this._$top.style.height = '';
                            _this._$bottom.style.display = 'none';
                            _this._$bottom.style.height = '';
                        }
                    }
                },
                destroy: function() {
                    this._$scroll.removeChild(this._$top);
                    this._$scroll.removeChild(this._$bottom);
                    this._$scroll.removeEventListener('touchstart', this._touchstart);
                    this._$scroll.removeEventListener('touchmove', this._touchmove);
                    this._$scroll.removeEventListener('touchend', this._touchend);
                },
                scrollToTop: function() {
                    this._$scroll.scrollTop = 0;
                },
                scrollToBottom: function() {
                    this._$scroll.scrollTop = this._$scroll.scrollHeight - this._$scroll.offsetHeight;
                }
            });
        }

        this._init();
    }
});

