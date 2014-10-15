// dependence: jQuery

define([
  'lib/jquery'
], function(
) {

  // 事件处理对象
  var eventCache = {};

  var findHashNode = function($curNode) {
    if (!$curNode.length || $curNode[0].nodeName.toLowerCase() === "body") return null;
    if ($curNode.data("jquery-outer-hash")) return $curNode;
    return arguments.callee($curNode.parent());
  };

  // 从当前节点开始向上找，找到所有的有jquery-outer-hash的节点
  var findAllHashNodesFromCurrentNode = function($curNode) {
    var ret = [];
    var $hashNode = findHashNode($curNode);
    if ($hashNode === null) return ret;
    else ret.push($hashNode);

    return ret.concat(arguments.callee($hashNode.parent()));
  };

  var bindDocumentEvent = function(eventName) {
    $(document).on(eventName ? eventName : "click", function(event) {
      var nodeList = findAllHashNodesFromCurrentNode($(event.target));

      var obj = $.extend({}, eventCache);
      $.each(nodeList, function() {
        if (eventCache[$(this).data("jquery-outer-hash")]) {
          obj[$(this).data("jquery-outer-hash")] = null;
          delete obj[$(this).data("jquery-outer-hash")];
        }
      });

      $.each(obj, function(k, v) {
        if (v.outerEvent !== event.type) return;
        $.each(v.cbs, function() {
          this.call(v.$node[0], event);
        });
      });
    });
  }
  

  // 绑定outer事件
  var guid = 0;
  $.fn.onOuter = function(cb, opt) {
    this.__opt = $.extend({
      $otherBindElem: null,
      outerEvent: 'click'
    }, opt);

    var curNodeHash = "jquery-outer-" + guid ++;
    $(this).data({"jquery-outer-hash": curNodeHash, "other-bind-elem": this.__opt.$otherBindElem});
    if (this.__opt.$otherBindElem) this.__opt.$otherBindElem.data("jquery-outer-hash", curNodeHash);

    if (!eventCache[curNodeHash]) eventCache[curNodeHash] = {};
    if (!eventCache[curNodeHash].cbs) {
      eventCache[curNodeHash].cbs = [cb];
    } else {
      eventCache[curNodeHash].cbs.push(cb);
    }
    eventCache[curNodeHash].$node = $(this);

    eventCache[curNodeHash].outerEvent = this.__opt.outerEvent;
    bindDocumentEvent(this.__opt.outerEvent);
  };

  // 取消绑定outer事件
  $.fn.offOuter = function(cb) {
    var hash = $(this).data("jquery-outer-hash");
    if (!hash) return;
    if (!eventCache[hash]) return;

    var destroy = function() {
      eventCache[hash] = null;
      delete eventCache[hash];

      if ($(this).data("other-bind-elem")) {
        $(this).data("other-bind-elem").removeData("jquery-outer-hash");
      }

      $(this).removeData("jquery-outer-hash").removeData("other-bind-elem");
    };
    if (cb instanceof Function) {
      var newCbs = [];
      $.each(eventCache[hash].cbs, function() {
        if (this !== cb) newCbs.push(this);
      });

      if (newCbs.length === 0) {
        destroy.call(this);
      } else {
        eventCache[hash].cbs = newCbs;
      }
    } else {
      destroy.call(this);
    }
    
  };

  return $;

});
