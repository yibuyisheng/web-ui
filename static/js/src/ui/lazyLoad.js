// dependence: jQuery

// 延迟加载，目前仅用于图片的延迟加载
define([
  'lib/jquery'
], function(
  $
) {

  // 查看元素是否位于可视区域
  var _isInView = function($elem) {
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
      offset.left < windowRight ;
  };

  var checkImg = function($img, srcAttr) {
    if ($img.data('lazy-show') !== 'done' && _isInView($img)) {
      $img.attr({
        'src': $img.attr(srcAttr)
      });
      $img.data('lazy-show', 'done');
    } 
    return $img.data('lazy-show') === 'done';
  };
  var lazyLoad = function(opts) {
    var opts = WEB_UI.extend({
      selector: 'img[lazy]',
      srcAttr: 'lazy-src'
    }, opts);

    var $lazyElems = $(opts.selector);

    $(window).on('scroll', function() {
      var isAllShow = true;
      $lazyLoad.each(function() {
        if (!checkImg($(this), opts.srcAttr) && isAllShow) isAllShow = false;
      });
      if (isAllShow) {
        $(window).off('scroll', arguments.callee);
      }
    });
  };

});
