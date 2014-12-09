define(function() {
    /**
     * 动态添加样式表规则（来自http://www.cnblogs.com/rubylouvre/archive/2009/07/14/1523104.html）
     * @param {string} cssCode css代码
     * @param {Document} 应用于哪一个Document对象
     */
    function addSheet(cssCode, doc) {
        if (!cssCode) {
            throw new Error('no css code');
        }
        if (!doc) {
            doc = document;
        }
        if (!+"\v1") { //增加自动转换透明度功能，用户只需输入W3C的透明样式，它会自动转换成IE的透明滤镜
            var t = cssCode.match(/opacity:(\d?\.\d+);/);
            if (t != null) {
                cssCode = cssCode.replace(t[0], "filter:alpha(opacity=" + parseFloat(t[1]) * 100 + ")")
            }
        }
        cssCode = cssCode + "\n"; //增加末尾的换行符，方便在firebug下的查看。
        var headElement = doc.getElementsByTagName("head")[0];
        var styleElements = headElement.getElementsByTagName("style");
        if (styleElements.length === 0) { //如果不存在style元素则创建
            if (doc.createStyleSheet) { //ie
                doc.createStyleSheet();
            } else {
                var tempStyleElement = doc.createElement('style'); //w3c
                tempStyleElement.setAttribute("type", "text/css");
                headElement.appendChild(tempStyleElement);
            }
        }
        var styleElement = styleElements[0];
        var media = styleElement.getAttribute("media");
        if (media != null && !/screen/.test(media.toLowerCase())) {
            styleElement.setAttribute("media", "screen");
        }
        if (styleElement.styleSheet) { //ie
            styleElement.styleSheet.cssText += cssCode;
        } else if (doc.getBoxObjectFor) {
            styleElement.innerHTML += cssCode; //火狐支持直接innerHTML添加样式表字串
        } else {
            styleElement.appendChild(doc.createTextNode(cssCode))
        }
    }

    /**
     * 移除DOM节点（来自http://www.cnblogs.com/rubylouvre/archive/2009/07/17/1525637.html）
     * 在IE中移除容器类节点，会引起内存泄露，最好是创建一个新的节点，比如div，然后将要删除的节点放入这个div中，再将div的innerHTML清空。其它的直接removeChild就可以了。
     *
     * @param {Node} node 需要被移除的节点
     */
    var removeNode = !+"\v1" ? function() {
        var d;
        return function(node) {
            if (node && node.tagName != 'BODY') {
                d = d || document.createElement('DIV');
                d.appendChild(node);
                d.innerHTML = '';
            }
        }
    }() : function(node) {
        if (node && node.parentNode && node.tagName != 'BODY') {
            node.parentNode.removeChild(node);
        }
    };

    /**
     * 根据类名查找元素（来自http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html）
     * @param  {string} searchClass    需要查找的类名
     * @param  {?(Node|Document)} node 父元素或者说是查找context
     * @param  {?string} tag           标签名，默认是*，即匹配所有标签
     * @return {Array.<Node>}          匹配的节点数组
     */
    function getElementsByClassName(searchClass, node, tag) {
        node = node || document;
        tag = tag || "*";

        var result = [];
        if (node.getElementsByClassName) {
            var nodes = node.getElementsByClassName(searchClass),
                childNode;
            for (var i = 0; childNode = nodes[i++];) {
                if (tag !== "*" && childNode.tagName === tag.toUpperCase()) {
                    result.push(childNode);
                    continue;
                }
                result.push(childNode);
            }
            return result
        }

        var classes = searchClass.split(/\s+/),
            elements = (tag === "*" && node.all) ? node.all : node.getElementsByTagName(tag), // IE5不支持document.getElementsByTagName("*")，使用分支document.all以防错误
            patterns = [],
            current,
            match;
        var i = classes.length;
        while (--i >= 0) {
            patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));
        }
        var j = elements.length;
        while (--j >= 0) {
            current = elements[j];
            match = false;
            for (var k = 0, kl = patterns.length; k < kl; k++) {
                match = patterns[k].test(current.className);
                if (!match) break;
            }
            if (match) result.push(current);
        }
        return result;
    }

    /**
     * 添加事件回调函数（来自http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1530020.html）
     * @param {Element} el  需要添加事件处理函数的元素
     * @param {string} type 事件名称
     * @param {Function} fn 事件触发回调函数
     */
    var addEvent = (function() {
        if (document.addEventListener) {
            return function(el, type, fn) {
                el.addEventListener(type, fn, false);
            };
        } else {
            return function(el, type, fn) {
                el.attachEvent('on' + type, function() {
                    return fn.call(el, window.event);
                });
            }
        }
    })();

    /**
     * 移除事件，出处同上
     * @param  {Element} obj 待移除事件的元素
     * @param  {string} type 待事件名称
     * @param  {Function} fn 待移除事件的回调函数
     */
    function removeEvent(obj, type, fn) {
        if (obj.removeEventListener)
            obj.removeEventListener(type, fn, false);
        else if (obj.detachEvent) {
            obj.detachEvent("on" + type, obj["e" + type + fn]);
            obj["e" + type + fn] = null;
        }
    };

    /**
     * 阻止事件冒泡
     * @param  {Event} e 需要阻止的事件
     */
    var stopPropagation = function(e) {
        e = e || window.event;
        if (!+"\v1") {
            e.cancelBubble = true;
        } else {
            e.stopPropagation();
        }
    }

    return {
        addSheet: addSheet,
        removeNode: removeNode,
        getElementsByClassName: getElementsByClassName,
        addEvent: addEvent,
        removeEvent: removeNode,
        stopPropagation: stopPropagation
    };
});