(function() {
  var Dialog = function(options) {
    this._options = $.extend({

    }, options);

    var cssTpl = [
      '<style type="text/css" id="web-ui-dialog-css">',
        '.dialog{position:absolute;width:500px;height:200px;left:50%;top:50%;margin-left:-250px;margin-top:-100px;background:white;border:1px solid #ccc;}',
        '.title{height:30px;background:lightblue;}',
      '</type>'
    ].join('');
    var htmlTpl = [
      '<div class="dialog">',
        '<div class="title"></div>',
        '<div class="content"></div>',
        '<div class="foot"></div>',
      '</div>'
    ].join('');
    var overlayTpl = [
    ].join();

    if ($css) console.log('====================');
    var $css = $css ? $css : $(cssTpl);

    var counter = 1;

    if (arguments.callee.prototype._init) return;
    arguments.callee.prototype._init = true;

    arguments.callee.prototype.show = function() {
      $css.remove();
      $('head').append($css);

      this._$dialog = $(htmlTpl);
      $('body').append(this._$dialog);

      console.log(counter ++);

      return this;
    };
    arguments.callee.prototype.hide = function() {
      this._$dialog.hide();
    };
    arguments.callee.prototype.destroy = function() {
      $css.remove();
      this._$dialog.remove();
    };
  };

  window.dialog = new Dialog().show();
  new Dialog().show();
})();