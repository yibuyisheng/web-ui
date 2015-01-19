define([
    'src/event/eventDealer',
    'lib/hammer.min.js'
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

                    this._hm = new Hammer(this._$scroll);
                    this._hm.get('pan').set({direction: Hammer.DIRECTION_VERTICAL});
                    var _this = this;
                    var state = {
                        isTopStart: false,
                        isBottomStart: false
                    };
                    this._hm.on('pandown', function(event) {
                        if (_this._$scroll.scrollTop === 0) {
                            state.isTopStart = true;
                            _this._$top.style.display = 'block';
                        }
                        if (!state.isTopStart) return;

                        _this._$top.style.height = event.distance + 'px';
                    });
                    this._hm.on('panup', function(event) {
                        if (_this._$scroll.scrollTop + _this._$scroll.offsetHeight === _this._$scroll.scrollHeight) {
                            state.isBottomStart = true;
                            _this._$bottom.style.display = 'block';
                        }
                        if (!state.isBottomStart) return;

                        _this._$bottom.style.height = event.distance + 'px';
                    });
                    this._hm.on('panend', function(event) {
                        _this._$top.style.display = 'none';
                        _this._$top.style.height = '';

                        _this._$bottom.style.display = 'none';
                        _this._$bottom.style.height = '';

                        try {
                            if (event.distance > 50) {
                                state.isTopStart && _this.trigger('topLoad');
                                state.isBottomStart && _this.trigger('bottomLoad');
                            }
                        } catch (e) {
                            throw e;
                        } finally {
                            state.isTopStart = false;
                            state.isBottomStart = false;
                        }
                    });
                },
                destroy: function() {
                    this._$scroll.removeChild(this._$top);
                    this._$scroll.removeChild(this._$bottom);
                    this._hm.destroy();
                }
            });
        }

        this._init();
    }
});

