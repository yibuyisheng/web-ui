// dependence : jQuery, ui/utils.js[findMaxZIndex], eventDealer, Overlay, Drag

(function(global) {

    var findMaxZIndex = global.domHelper.findMaxZIndex;
    var eventDealer = global.eventDealer;
    var createOverlay = global.overlay.create;
    var createDrag = global.createDrag;

    global.dialog = {
        createDialog: function(options) {
            return new Dialog(options);
        },
        createConfirm: function(content, title, opts) {
            return new Confirm(content, title, opts);
        },
        createAlert: function(content, typ, opts) {
            return new Alert(content, typ, opts);
        }
    };

    // 对话框
    var cssTpl = [
        '<style type="text/css" name="web-ui-dialog">',
        '.dialog{position:fixed;display:none;width:500px;height:200px;left:50%;top:50%;margin-left:-250px;margin-top:-100px;border:1px solid #ccc;background:white;}',
        '.dialog .title{height:30px;background:#D43030;line-height:30px;font-weight:bold;font-size:14px;color:white;}',
        '.dialog .title span{margin-left:10px;}',
        '.dialog .close{text-decoration:none;color:white;float:right;margin-right:10px;}',
        '.dialog .content{padding:10px;height:auto;min-height:0;width:auto;margin:0}',
        '.dialog .foot{padding:10px;}',
        '</style>'
    ].join('');
    var dlgTpl = [
        '<div class="dialog">',
            '<div class="title">',
                '<span>对话框的标题</span>',
                '<a href="javascript:;" class="close">X</a>',
            '</div>',
                '<div class="content" style="height:auto">',
                '</div>',
            '<div class="foot"></div>',
        '</div>'
    ].join('');
    function Dialog(options) {
        // 以下参数，位于后面的具有高优先级
        this._options = $.extend({
            // 对话框内容相关的参数
            'titleVisible': true,               // 对话框标题是否可见
            'title': 'title',                   // 对话框的标题
            'content': 'content',               // 对话框的内容，html字符串或者jquery对象
            'footVisible': true,                // 对话框底部内容是否可见
            'foot': 'foot',                     // 对话框底部的内容，html字符串

            // 对话框位置和大小相关的参数
            'width': 500,                       // 宽度
            'height': 200,                      // 高度

            /***********两组有点矛盾的定位参数，后面精确控制位置的参数的优先级高*************/
            'hCenter': true,                    // 是否水平居中
            'vCenter': true,                    // 是否垂直居中

            'left': null,                       // 横坐标
            'top': null,                        // 纵坐标
            /********************************************************************************/

            'overlayVisible': true,             // 是否显示遮罩层
            'draggable': true,                  // 是否可以拖动

            'position': null                    // 对话框定位方式
        }, options);

        // 判断函数是否已经定义了
        if (!arguments.callee.prototype._init) {
            $.extend(arguments.callee.prototype, $({}), {
                _init: function() {
                    // 添加css
                    if (!$('head *[name="web-ui-dialog"]').length) $('head').append(cssTpl);
                    // 将对话框模板添加到文档中
                    this._$dialog = $(dlgTpl);
                    $('body').append(this._$dialog);

                    this._options.position !== null && this._$dialog.css('position', this._options.position);
                    this.$title = this._$dialog.find('>.title');
                    this.$content = this._$dialog.find('>.content');
                    this.$foot = this._$dialog.find('>.foot');
                    this.$title[this._options.titleVisible ? 'show' : 'hide']()
                        .find('span').text(this._options.title);
                    this.$content.empty().append(this._options.content);
                    this.$foot[this._options.footVisible ? 'show' : 'hide']().empty().append(this._options.foot);

                    this._options.overlayVisible && (this._overlay = createOverlay());

                    this._options.draggable && (this._drag = createDrag(this._$dialog, this._$dialog.find('.title')));

                    // 让对话框显示在最上层
                    var maxZIndex = findMaxZIndex($('body'));
                    this._$dialog.css('z-index', maxZIndex ? (maxZIndex + 1) : 0);

                    this._bindEvent();

                    var _this = this;
                },
                _setRectAndPos: function() {
                    this._$dialog.css('width', this._options.width);
                    this._$dialog.css(
                        'height',
                        this._options.height === 'auto'
                            ? (this.$title.outerHeight() + this.$content.outerHeight() + this.$foot.outerHeight())
                            : this._options.height
                    );

                    this._options.hCenter && this._options.left === null &&
                        this._$dialog.css({
                            left: '50%',
                            marginLeft: -this._$dialog.width() / 2
                        });
                    this._options.vCenter && this._options.top === null &&
                        this._$dialog.css({
                            top: '50%',
                            marginTop: -this._$dialog.height() / 2
                        });

                    this._options.left !== null && this._$dialog.css('left', this._options.left);
                    this._options.top !== null && this._$dialog.css('top', this._options.top);
                },
                // 显示对话框
                show: function show() {
                    this._$dialog.show();
                    this._overlay && this._overlay.show();

                    if (!this._isNotFirstTimeCallShow) {
                        this._setRectAndPos();
                        this._isNotFirstTimeCallShow = true;
                    }

                    return this;
                },
                fadeIn: function() {
                    this._$dialog.fadeIn.apply(this._$dialog, arguments);
                    this._overlay && this._overlay.fadeIn.apply(this._overlay, arguments);
                    return this;
                },
                fadeOut: function() {
                    this._$dialog.fadeOut.apply(this._$dialog, arguments);
                    this._overlay && this._overlay.fadeOut.apply(this._overlay, arguments);
                    return this;
                },
                _bindEvent: function() {
                    var _this = this;
                    this._$dialog.find('>.title .close').on('click', function() {
                        _this.destroy();
                    });
                    this._overlay && this._overlay.on('click', function() {
                        _this.destroy();
                    });
                },
                // 隐藏对话框
                hide: function() {
                    this._$dialog.hide();
                    this._overlay && this._overlay.hide();
                    return this;
                },
                // 将对话框从dom树中移除
                destroy: function() {
                    this.trigger('beforeDestroy');

                    this._$dialog.remove();
                    this._overlay && this._overlay.destroy();
                    this._drag.destroy();

                    this.trigger('afterDestroy');
                },
                setTitleColor: function(colorStr) {
                    this._$dialog.find('.title span').css('color', colorStr);
                    return this;
                },
                addEvent: function(eventName, elem, cb) {
                    this._$dialog.on(eventName, elem, cb);
                    return this;
                },
                removeEvent: function() {
                    $.fn.off.apply(this._$dialog, arguments);
                    return this;
                },
                find: function(selector) {
                    return this._$dialog.find(selector);
                },
                getBox: function() {
                    return this._$dialog;
                }
            });
        }

        this._init();
    }

    // confirm对话框
    function Confirm(content, title, opts) {
        this._content = content;
        this._opts = $.extend({
            okClass: 'btn-border btn_grey3',
            cancelClass: 'btn-border btn_grey3'
        }, opts);

        if (!arguments.callee.prototype._init) {
            $.extend(arguments.callee.prototype, $({}), {
                _init: function() {
                    this._$content = $('<div>' + this._content + '</div>');
                    this._$foot = $([
                        '<div>',
                        '<a href="javascript:;" class="ok ' + this._opts.okClass + '">确定</a>',
                        '<a href="javascript:;" class="cancel ' + this._opts.cancelClass + '">取消</a>',
                        '</div>'
                    ].join(''));

                    // 样式
                    this._$foot.css({
                        textAlign: 'right'
                    }).find('a').css({
                        textDecoration: 'none',
                        color: 'black'
                    }).hover(function() {
                        $(this).css('textDecoration', 'underline');
                    }, function() {
                        $(this).css('textDecoration', 'none');
                    }).filter('.cancel').css({
                        marginLeft: 10
                    });

                    this._dialog = new Dialog({
                        title: title ? title : '请选择',
                        content: this._$content,
                        foot: this._$foot,
                        height: 'auto'
                    });

                    var _this = this;
                    this._$foot.find('.ok, .cancel').on('click', function() {
                        if ($(this).hasClass('ok')) _this.trigger('ok');
                        if ($(this).hasClass('cancel')) _this.trigger('cancel');
                    });
                },
                show: function() {
                    return this._dialog.show(), this;
                },
                destroy: function() {
                    this._dialog.destroy();
                }
            });
        }

        this._init();
    }

    // 确定对话框（包括错误、警告、成功对话框）
    function Alert(content, typ, opts) {
        this._typ = typ;
        this._content = content;
        this._opts = $.extend({
            okClass: 'btn-border btn_grey3'
        }, opts);

        if (!arguments.callee.prototype._init) {
            $.extend(arguments.callee.prototype, $({}), {
                _init: function() {
                    var titleParam =
                        this._typ === 'error' ? {
                            text: '错误',
                            color: 'white'
                        } :
                        this._typ === 'warn' ? {
                            text: '警告',
                            color: 'white'
                        } :
                        this._typ === 'success' ? {
                            text: '成功',
                            color: 'white'
                        } :
                        this._typ === 'info' ? {
                            text: '提示',
                            color: 'white'
                        } : {
                            text: '未知类型的对话框',
                            color: 'black'
                        };
                    this._$foot = $('<div><a href="javascript:;" class="' + this._opts.okClass + '">确定</a></div>');

                    // 样式
                    this._$foot.css({
                        textAlign: 'right'
                    }).find('a').css({
                        textDecoration: 'none',
                        color: 'black'
                    }).hover(function() {
                        $(this).css({
                            textDecoration: 'underline'
                        });
                    }, function() {
                        $(this).css({
                            textDecoration: 'none'
                        });
                    });

                    this._dialog = new Dialog({
                        content: this._content,
                        title: titleParam.text,
                        footVisible: true,
                        foot: this._$foot,
                        height: 'auto',
                        width: 350
                    }).setTitleColor(titleParam.color);
                    this._dialog.find('.content').css({
                        'word-wrap': 'break-word'
                    });

                    var _this = this;
                    this._$foot.find('a').on('click', function() {
                        _this.destroy();
                        _this.trigger('ok');
                    });
                },
                show: function() {
                    this._dialog.show();
                    return this;
                },
                hide: function() {
                    this._dialog.hide();
                    return this;
                },
                destroy: function() {
                    this.trigger('destroy');
                    this._dialog.destroy();
                }
            });
        }

        arguments.callee.prototype._init.call(this);
    }

})((window.WEBUI = window.WEBUI || {}, window.WEBUI));