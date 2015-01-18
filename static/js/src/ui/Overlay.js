// dependence : jQuery, event/eventDealer.js, ui/utils.js[findMaxZIndex]

define([
    'src/event/eventDealer',
    'src/ui/utils',
    'lib/jquery'
], function(
    eventDealer,
    uiUtils
) {

    var eventDealer = eventDealer;
    var findMaxZIndex = uiUtils.findMaxZIndex;

    return function(options) {
        if (!arguments.callee.prototype._init) {
            $.extend(arguments.callee.prototype, eventDealer, {
                _init: function() {
                    var _this = this;

                    this._$overlay = $('<div></div>');
                    $('body').append(this._$overlay);
                    var maxZIndex = findMaxZIndex($('body'));
                    this._$overlay.css({
                        position: 'fixed',
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
                        _this.trigger('click');
                    });
                },
                show: function() {
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
                }
            });
        }

        this._init();
    };

});