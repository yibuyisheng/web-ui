/**
 * 依赖：[
 *     'static/lib/jquery-1.11.2.min.js',
 *     'static/js/common/ui/overlay.js'
 * ]
 * 加载中，让用户知道当前正在加载
 */

define([
    'src/ui/Overlay',
    'src/ui/domHelper',
    'lib/jquery'
], function(
    Overlay,
    domHelper
) {
    var tpl = [
        '<div style="color:white">',
            'loading',
        '</div>'
    ].join('');

    return {
        create: create,
        ajax: ajax
    };

    function ajax(opts) {
        var ld = create(opts).show();
        return $.ajax($.extend(opts, {
            complete: function() {
                ld.destroy();
                if (!opts.complete) return;
                return opts.complete.apply(null, arguments);
            }
        }));
    }

    function create(opts) {
        return new Load(opts);
    }

    function Load(opts) {
        this._opts = $.extend({
            $box: null, // 加载的区域
            replace: false // 是否隐藏加载区域原先的内容
        }, opts);

        if (!Load.prototype._init) {
            $.extend(Load.prototype, {
                _init: function() {
                    var $body = $('body');
                    this._overlay = new Overlay({
                        $box: this._opts.$box
                    });

                    this._$tpl = $(tpl).hide();
                    this._opts.$box = this._opts.$box || $body;

                    if (this._opts.replace) {
                        this._saveState();
                        this._hideAllChildren();
                    }
                    this._opts.$box.append(this._$tpl);
                },
                _hideAllChildren: function() {
                    this._opts.$box.children().map(function() {
                        $(this).hide();
                    });
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
                },
                show: function() {
                    this._overlay.show();
                    this._correctBoxPos();
                    this._$tpl.css({
                        position: 'absolute',
                        height: 32,
                        width: 32,
                        top: '50%',
                        left: '50%',
                        marginTop: -16,
                        marginLeft: -16,
                        display: 'block',
                        zIndex: domHelper.findMaxZIndex(this._opts.$box)
                    });
                    return this;
                },
                hide: function() {
                    this._overlay.show();
                    this._$tpl.hide();
                    this._overlay.hide();
                },
                destroy: function() {
                    this._$tpl.remove();
                    this._overlay.destroy();
                    this._recoveryState();
                    this._recoveryBoxPos();
                },
                _saveState: function() {
                    var _this = this;
                    var counter = 0;
                    this._opts.$box.children().map(function() {
                        _this._childrenState = _this._childrenState || {};
                        $(this).attr('loading-node-state', counter);
                        _this._childrenState[counter] = {
                            display: $(this).css('display')
                        };
                        counter ++;
                    });
                },
                _recoveryState: function() {
                    if (!this._childrenState) return;
                    for (var k in this._childrenState) {
                        var $child = this._opts.$box.find('*[loading-node-state="' + k + '"]');
                        $child.css('display', this._childrenState[k].display);
                        $child.removeAttr('loading-node-state');
                    }
                }
            });
        }
        this._init();
    }
});