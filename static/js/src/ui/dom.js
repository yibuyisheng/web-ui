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

    return {
        addSheet: addSheet,
        removeNode: removeNode
    };
});