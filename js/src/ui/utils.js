// dependence: jQuery
(function() {
  var utils = {
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
    }
  };

  window.uiUtils = utils;
})();