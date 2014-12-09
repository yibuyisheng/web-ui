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
});
