// dependence: jQuery
(function() {

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

  $(document).on("click", function(event) {
    var nodeList = findAllHashNodesFromCurrentNode($(event.target));

    var obj = $.extend({}, eventCache);
    $.each(nodeList, function() {
      if (eventCache[$(this).data("jquery-outer-hash")]) {
        obj[$(this).data("jquery-outer-hash")] = null;
        delete obj[$(this).data("jquery-outer-hash")];
      }
    });

    $.each(obj, function(k, v) {
      $.each(v.cbs, function() {
        this.call(v.$node[0], event);
      });
    });
  });

  // 绑定outer事件
  var guid = 0;
  $.fn.outer = function(cb) {
    var curNodeHash = "jquery-outer-" + guid ++;
    $(this).data("jquery-outer-hash", curNodeHash);

    if (!eventCache[curNodeHash]) eventCache[curNodeHash] = {};
    if (!eventCache[curNodeHash].cbs) {
      eventCache[curNodeHash].cbs = [cb];
    } else {
      eventCache[curNodeHash].cbs.push(cb);
    }
    eventCache[curNodeHash].$node = $(this);
  };

  // 取消绑定outer事件
  $.fn.offOuter = function(cb) {
    var hash = $(this).data("jquery-outer-hash");
    if (!hash) return;
    if (!eventCache[hash]) return;

    if (cb instanceof Function) {
      var newCbs = [];
      $.each(eventCache[hash].cbs, function() {
        if (this !== cb) newCbs.push(this);
      });
      eventCache[hash].cbs = newCbs;
    } else {
      eventCache[hash] = null;
      delete eventCache[hash];
    }
  };
})();