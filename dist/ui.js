/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./base.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// dependence: jQuery

	(function(global) {

	    global.domHelper = {
	        findMaxZIndex: findMaxZIndex,
	        scrollTop: scrollTop,
	        // 找到两个node相同的祖先node
	        findTheSameParent: findTheSameParent
	    };

	    function scrollTop() {
	        return document.documentElement.scrollTop // 对于有doctype声明的页面则可以使用
	                || window.pageYOffset // safari比较特别，有自己获取scrollTop的函数
	                || document.body.scrollTop; // 对于没有doctype声明的页面里可以使用
	    }

	    function findMaxZIndex($container) {
	        var children = $container.children();
	        if (!children.length) return null;

	        var ret = null;
	        children.each(function() {
	            if (this === window) return;

	            var zIndex = $(this).css("z-index");
	            if ($.isNumeric(zIndex)) {
	                if (!ret || ret < zIndex) ret = zIndex;
	            } else {
	                var result = findMaxZIndex($(this));
	                if (!ret || ($.isNumeric(result) && ret < result)) ret = result;
	            }
	        });

	        return ret ? parseInt(ret) : 0;
	    }

	    function findTheSameParent() {
	        var nodes = arguments,
	            rootNode = document.body;

	        var curNodes = nodes,
	            sameParent,
	            clearNodes = []; // 暂存设置了data-counter属性的node，用于操作结束之后去掉这个属性
	        var iterate = function() {
	            var parents = [],
	                curNodesTmp = [],
	                counter,
	                parentNode;
	            for (var i = 0, il = curNodes.length; i < il; i += 1) {

	                if (curNodes[i] !== rootNode) {
	                    parentNode = curNodes[i].parentNode;
	                    counter = parseInt(parentNode.getAttribute('data-counter'));
	                    counter = counter ? (counter + 1) : 1;

	                    // 如果计数器达到了nodes.length，说明共同的祖先就是这个了
	                    if (counter === nodes.length) {
	                        sameParent = parentNode;

	                        return false;
	                    }

	                    parentNode.setAttribute('data-counter', counter);
	                    curNodesTmp.push(parentNode);
	                    clearNodes.push(parentNode);
	                }
	            }
	            curNodes = curNodesTmp;

	            return true;
	        };

	        while (iterate()) {

	        };

	        // 清除
	        for (var i = 0, il = clearNodes.length; i < il; i += 1) {
	            clearNodes[i].removeAttribute('data-counter');
	        }

	        return sameParent;
	    }

	})((window.WEBUI = window.WEBUI || {}, window.WEBUI));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// dependence : jQuery

	/**
	 * 拖动
	 * @param {jquery object} $box 需要移动的元素
	 * @param {jquery object} $target 鼠标操作的元素
	 */
	(function(global) {

	    global.createDrag = function($box, $target) {
	        return new Drag($box, $target);
	    };

	    function Drag($box, $target) {
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
	})((window.WEBUI = window.WEBUI || {}, window.WEBUI));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// dependence: jQuery

	// 延迟加载，目前仅用于图片的延迟加载

	(function(global) {

	    global.lazyload = lazyload;

	    // 查看元素是否位于可视区域
	    function _isInView($elem) {
	        var $elem = $($elem);

	        var offset = $elem.offset(),
	            height = $elem.outerHeight(),
	            width = $elem.outerWidth();
	        var windowTop = $(document).scrollTop(),
	            windowBottom = windowTop + $(window).height(),
	            windowLeft = $(document).scrollLeft(),
	            windowRight = windowLeft + $(window).width();

	        return offset.top + height > windowTop &&
	            offset.top < windowBottom &&
	            offset.left + width > windowLeft &&
	            offset.left < windowRight;
	    };

	    function checkImg($img, srcAttr) {
	        if ($img.data('lazy-show') !== 'done' && _isInView($img)) {
	            $img.attr({
	                'src': $img.attr(srcAttr)
	            });
	            $img.data('lazy-show', 'done');
	        }
	        return $img.data('lazy-show') === 'done';
	    };

	    function lazyload(opts) {
	        var opts = $.extend({
	            selector: 'img[lazy]',
	            srcAttr: 'data-original',
	            container: window,
	            skipInvisible: true
	        }, opts);

	        var $lazyElems = $(opts.selector),
	            $container = $(opts.container);

	        var checkTimer;

	        if (opts.skipInvisible) {
	            $container.on('scroll', update);
	            $(window).on('resize', update);
	        } else {
	            checkTimer = setInterval(update, 100);
	        }

	        function update() {
	            var isAllShow = true;
	            $lazyElems.each(function() {
	                if (!checkImg($(this), opts.srcAttr) && isAllShow) isAllShow = false;
	            });

	            if (isAllShow) {
	                if (opts.skipInvisible) {
	                    $container.off('scroll', update);
	                    $(window).off('resize', update);
	                } else {
	                    clearInterval(checkTimer);
	                }
	            }
	        };
	    };

	})((window.WEBUI = window.WEBUI || {}, window.WEBUI));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 依赖：[
	 *     'static/lib/jquery-1.11.2.min.js',
	 *     'static/js/common/ui/overlay.js'
	 * ]
	 * 加载中，让用户知道当前正在加载
	 */

	(function(global) {

	    var createOverlay = global.overlay.create;
	    var domHelper = global.domHelper;

	    var tpl = [
	        '<div style="color:white">',
	            'loading',
	        '</div>'
	    ].join('');

	    global.loading = {
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
	                    this._overlay = createOverlay({
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

	})((window.WEBUI = window.WEBUI || {}, window.WEBUI));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 渲染html
	 */

	(function(global) {

	    var nodeEnum = {
	        ELEMENT_NODE: 1,
	        TEXT_NODE: 3
	    };
	    var EXPRESSION_REGEXP = /\{\{(.*?)\}\}/g;

	    // 注册的tag
	    var tags = {};

	    global.render = {
	        createTag: createTag,
	        mount: mount
	    };

	    function createTag(name, tpl) {
	        tags[name] = tpl;
	    }

	    function mount(name, vm) {
	        var nodes = document.getElementsByTagName(name);
	        var tpl = tags[name];
	        if (!tpl) return;

	        var instances = [];
	        for (var i = 0, il = nodes.length; i < il; i++) {
	            var dom = createDom(tpl);
	            var expressions = collectExpressions(dom);
	            var instance = {
	                vm: vm,
	                expressions: expressions,
	                update: function() {
	                    update(this.expressions, this.vm);
	                }
	            };
	            instance.update();
	            instances.push(instance);

	            nodes[i].parentNode.replaceChild(dom, nodes[i]);
	        }
	        return instances;
	    }

	    function createDom(tpl) {
	        var div = document.createElement('div');
	        div.innerHTML = tpl;
	        if (div.children.length !== 1) {
	            throw new Error('tag must have one element root');
	        }
	        return div.firstElementChild;
	    }

	    /**
	     * 搜集表达式
	     * expressions数据结构：
	     * {
	     *     '{{name}}': {
	     *         list: [{opts: opts, updateFn: function(value, opts) {...}}], // 节点及更新节点的方法
	     *         fnObj: {                                                     // 重新计算表达式值的函数
	     *             args: [...],                                             // 此函数的参数名字数组（一个字符串数组）
	     *             fn: function() {...}                                     // 具体的函数
	     *         }
	     *     }
	     * }
	     */
	    function collectExpressions(dom) {
	        var expressions = {};
	        traverse(dom, function(node) {
	            if (node.nodeType === nodeEnum.ELEMENT_NODE) {
	                if (node.getAttribute('repeat')) {
	                    repeat(node);
	                    return;
	                }

	                var attrs = node.attributes;
	                for (var i = 0, il = attrs.length; i < il; i++) {
	                    var attr = attrs[i];
	                    if (!attr.value.match(EXPRESSION_REGEXP).length) continue;
	                    add(attr.value, {node: node, attrName: attr.name}, function(value, opts) {
	                        opts.node.setAttribute(opts.attrName, value);
	                    });
	                }
	            } else if (
	                node.nodeType === nodeEnum.TEXT_NODE
	                && EXPRESSION_REGEXP.test(node.textContent)
	            ) {
	                add(node.textContent, {node: node}, function(value, opts) {
	                    opts.node.textContent = value;
	                });
	            }
	        }, function(node) {
	            if (node.getAttribute && node.getAttribute('repeat')) {
	                return false;
	            }
	            return true;
	        });
	        return expressions;

	        function add(expression, opts, updateFn) {
	            expressions[expression] = expressions[expression] || {list: []};
	            expressions[expression].list.push({
	                opts: opts,
	                updateFn: updateFn
	            });
	            expressions[expression].fnObj = expressions[expression].fnObj || createFn(expression);
	        }

	        function createFn(expression) {
	            var args = [], fnBody;
	            if (expression.indexOf('{{') + 1) {
	                var args = [];
	                var fnBody = 'return \'' + expression.replace(/\'/g, '\\\'').replace(EXPRESSION_REGEXP, function() {
	                    var arg = arguments[1];
	                    args.push(arg);
	                    return '\' + ' + arg + ' + \'';
	                }) + '\'';
	            } else {
	                args.push(expression);
	                fnBody = 'return ' + expression;
	            }
	            return {
	                args: args,
	                fn: new Function(args.join(','), fnBody)
	            };
	        }

	        // repeat节点
	        function repeat(node) {
	            var cmtStart = document.createComment('start: ' + node.outerHTML);
	            var cmtEnd = document.createComment('end');
	            var parentNode = node.parentNode;
	            parentNode.replaceChild(cmtStart, node);
	            parentNode.insertBefore(cmtEnd, cmtStart.nextSibling);
	            add(node.getAttribute('repeat'), [cmtStart, cmtEnd, node, {}], function(value, opts, vm) {
	                var cmtStart = opts[0];
	                var cmtEnd = opts[1];
	                var node = opts[2];
	                var instances = opts[3];

	                for (var i in value) {
	                    var instance = instances[i];
	                    if (instance) {
	                        instance.vm.value = value;
	                        instance.vm.index = i;
	                    } else {
	                        var nodeClone = createDom(node.outerHTML);
	                        nodeClone.removeAttribute('repeat');
	                        var repeatItemExprs = collectExpressions(nodeClone);
	                        instance = {
	                            dom: nodeClone,
	                            expressions: repeatItemExprs,
	                            vm: Object.create(vm || {}, {
	                                value: { value: value[i] },
	                                index: { value: i }
	                            }),
	                            update: function() {
	                                update(this.expressions, this.vm);
	                            }
	                        };
	                        instances[i] = instance;
	                        cmtEnd.parentNode.insertBefore(nodeClone, cmtEnd);
	                    }

	                    instance.update();
	                }
	            });
	        }
	    }

	    // 遍历节点
	    // filterFn用于过滤node，如果返回值为false，则不再遍历该节点下面的子孙节点
	    function traverse(dom, fn, filterFn) {
	        var stack = [dom];
	        while (stack.length) {
	            var top = stack.pop();
	            fn(top);
	            if (filterFn && !filterFn(top)) continue;
	            var childNodes = top.childNodes;
	            for (var i = 0, il = childNodes.length; i < il; i += 1) {
	                fn(childNodes[i]);
	                stack.push(childNodes[i]);
	            }
	        }
	    }

	    // 将数据渲染上去
	    function update(expressions, vm) {
	        for (var expr in expressions) {
	            var exprObj = expressions[expr];
	            var params = [];
	            for (var i in exprObj.fnObj.args) {
	                params.push(vm[exprObj.fnObj.args[i]]);
	            }
	            var exprValue = exprObj.fnObj.fn.apply(null, params);

	            // 脏检测
	            if (exprValue !== exprObj.lastValue) {
	                for (var i in exprObj.list) {
	                    exprObj.list[i].updateFn(exprValue, exprObj.list[i].opts, vm);
	                }
	            }
	            exprObj.lastValue = exprValue;
	        }
	    }

	})((window.WEBUI = window.WEBUI || {}, window.WEBUI));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

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



/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	(function(global) {
	    global.editor = {
	        create: function(iframe) {
	            return new Editor(iframe);
	        }
	    };

	    function Editor(iframe) {
	        this._iframe = iframe;

	        if (!Editor.prototype._init) {
	            base.extend(Editor.prototype, {
	                _init: function() {
	                    this._contentWindow = this._iframe.contentWindow;
	                    this._contentDocument = this._iframe.contentWindow.document;

	                    this._contentDocument.write([
	                        '<html>',
	                            '<head>',
	                                '<meta charset="utf-8">',
	                            '</head>',
	                            '<body contenteditable="true"></body>',
	                        '</html>'
	                    ].join(''));
	                },
	                // http://www.quirksmode.org/dom/execCommand.html
	                // backcolor bold copy
	                execCommand: function(cmd, value) {
	                    this._contentDocument.execCommand(cmd, false, value);
	                }
	            });
	        }

	        this._init();
	    }
	})((window.WEBUI = window.WEBUI || {}, window.WEBUI));

/***/ }
/******/ ]);