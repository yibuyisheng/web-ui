// dependence: jQuery

define([
  'lib/jquery'
], function(
) {

  return {
    findMaxZIndex: function($container) {
      var children = $container.children();
      if (!children.length) return null;
      
      var ret = null;
      children.each(function() {
        if (this === window) return;

        var zIndex = $(this).css("z-index");
        if ($.isNumeric(zIndex)) {
          if (!ret || ret < zIndex) ret = zIndex;
        } else {
          var result = arguments.callee.call(null, $(this));
          if (!ret || ($.isNumeric(result) && ret < result)) ret = result;
        }
      });

      return ret ? ret : 0;
    },
    scrollTop: function() {
      return document.documentElement.scrollTop // 对于有doctype声明的页面则可以使用
        || window.pageYOffset                   // safari比较特别，有自己获取scrollTop的函数
        || document.body.scrollTop;             // 对于没有doctype声明的页面里可以使用
    }
  };

});
