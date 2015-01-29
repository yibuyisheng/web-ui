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
