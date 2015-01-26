(function(global) {
    global.TouchLoad = TouchLoad;

    // 依赖
    var base = global.base;

    var isIOS = /iphone/i.test(window.navigator.userAgent);

    function TouchLoad($scroll) {
        this._$scroll = $scroll;

        if (!TouchLoad.prototype._init) {
            base.extend(TouchLoad.prototype, base.eventDealer, {
                _init: function() {
                    var _this = this;
                    // 如果是IOS系统，则充分利用弹性滚动
                    if (isIOS) {
                        this._touchend = function(event) {
                            if (_this._$scroll.scrollTop < -50) {
                                _this.trigger('topLoad');
                            } else if (_this._$scroll.scrollTop + _this._$scroll.offsetHeight - _this._$scroll.scrollHeight > 50) {
                                _this.trigger('bottomLoad');
                            }
                        };

                        this._$scroll.addEventListener('touchend', this._touchend);

                        return;
                    }


                    this._$child = this._$scroll.firstElementChild;
                    if (!this._$child || this._$scroll.children.length !== 1) {
                        throw new Error('there must be only one element under the scroll container');
                    }
                    this._$child.style.position = 'relative';

                    var state = {
                        isStart: false,
                        position: null, // 给当前滑动定性，究竟是变动顶部的div还是变动底部的div
                        previousY: null,

                        lastMoveTime: null
                    };
                    this._$scroll.addEventListener('touchstart', touchstart);
                    this._$scroll.addEventListener('touchmove', touchmove);
                    this._$scroll.addEventListener('touchend', touchend);

                    this._touchstart = touchstart;
                    this._touchmove = touchmove;
                    this._touchend = touchend;

                    function touchstart() {
                        state.isStart = true;
                        state.previousY = event.touches[0].clientY;
                        state.offsetHeight = _this._$scroll.offsetHeight;
                    }

                    function touchmove() {
                        if (!state.isStart) return;

                        if (!state.lastMoveTime) {
                            state.lastMoveTime = new Date().getTime();
                        }
                        // 防抖动
                        else if (new Date().getTime() - state.lastMoveTime < 13.6) {
                            return;
                        }

                        var distance = event.touches[0].clientY - state.previousY;
                        // 第一次进来，根据这次的运动方向决定position
                        if (!state.position) {
                            // 并且要滚动条在顶部或者底部
                            var scrollTop = _this._$scroll.scrollTop;
                            if (scrollTop === 0 || (scrollTop + _this._$scroll.offsetHeight === _this._$scroll.scrollHeight)) {
                                state.position = distance > 0 ? 'top' : 'bottom';
                            }
                        }

                        // 应该顶部动
                        if (state.position === 'top') {
                            var preTop = parseFloat(_this._$child.style.top);
                            preTop = preTop ? preTop : 0;
                            _this._$child.style.top = (preTop + distance) + 'px';
                        }
                        // 应该底部动
                        else if (state.position === 'bottom') {
                            var preBottom = parseFloat(_this._$child.style.bottom);
                            preBottom = preBottom ? preBottom : 0;
                            _this._$child.style.bottom = (preBottom - distance) + 'px';
                        }

                        state.previousY = event.touches[0].clientY;
                    }

                    function touchend() {
                        try {
                            if (parseInt(_this._$child.style.top) > 100) {
                                _this.trigger('topLoad');
                            } else if (parseInt(_this._$child.style.bottom) > 100) {
                                _this.trigger('bottomLoad');
                            }
                        } catch (e) {
                            throw e;
                        } finally {
                            state.isStart = false;
                            state.previousY = null;
                            state.position = null;
                            state.lastMoveTime = null;

                            _this._$child.style.top = null;
                            _this._$child.style.bottom = null;
                        }
                    }
                },
                destroy: function() {
                    if (isIOS) {
                        this._$scroll.removeEventListener('touchend', this._touchend);
                        return;
                    }

                    this._$scroll.removeEventListener('touchstart', this._touchstart);
                    this._$scroll.removeEventListener('touchmove', this._touchmove);
                    this._$scroll.removeEventListener('touchend', this._touchend);
                    this._$child.style.position = null;
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
})((window.WEBUI = window.WEBUI || {}, window.WEBUI));

