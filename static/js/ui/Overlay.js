// dependence : jQuery, event/eventDealer.js, ui/utils.js[findMaxZIndex]

(function(global) {

    var eventDealer = global.eventDealer;
    var findMaxZIndex = global.domHelper.findMaxZIndex;

    global.overlay = {
        create: function(options) {
            return new Overlay(options);
        }
    };

    function Overlay(options) {
        this._opts = $.extend({
            $box: null        // 覆盖在这个box上面
        }, options);
        if (!arguments.callee.prototype._init) {
            $.extend(arguments.callee.prototype, eventDealer, {
                _init: function() {
                    var _this = this;

                    this._$overlay = $('<div></div>');
                    this._opts.$box = this._opts.$box || $('body');
                    this._opts.$box.append(this._$overlay);
                    var maxZIndex = findMaxZIndex(this._opts.$box);
                    this._$overlay.css({
                        position: this._opts.$box.is('body') ? 'fixed' : 'absolute',
                        display: 'none',
                        background: 'black',
                        opacity: 0.5,
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: maxZIndex ? (maxZIndex + 1) : 0
                    });

                    this._$overlay.on('click', function() {
                        _this.trigger('close');
                    });
                },
                show: function() {
                    this._correctBoxPos();
                    return this._$overlay.show(), this;
                },
                fadeIn: function() {
                    return this._$overlay.fadeIn.apply(this._$overlay, arguments), this;
                },
                fadeOut: function() {
                    return this._$overlay.fadeOut.apply(this._$overlay, arguments), this;
                },
                hide: function() {
                    return this._$overlay.hide(), this;
                },
                destroy: function() {
                    this._$overlay.remove();
                    this._recoveryBoxPos();
                },
                _correctBoxPos: function() {
                    this._originBoxPos = this._opts.$box.css('position');
                    if (this._originBoxPos !== 'fixed'
                        && this._originBoxPos !== 'absolute'
                        && this._originBoxPos !== 'fixed'
                    ) {
                        this._opts.$box.css('position', 'relative');
                    }
                },
                _recoveryBoxPos: function() {
                    this._opts.$box.css('position', this._originBoxPos);
                }
            });
        }

        this._init();
    };

})((window.WEBUI = window.WEBUI || {}, window.WEBUI));