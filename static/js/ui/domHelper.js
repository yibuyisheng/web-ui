// dependence: jQuery

(function(global) {

    global.domHelper = {
        findMaxZIndex: findMaxZIndex,
        scrollTop: scrollTop,
        // 找到两个node相同的祖先node
        findTheSameParent: findTheSameParent
    };

    function scrollTop() {
        return document.documentElement.scrollTop // 对于有doctype声明的页面则可以使用
                || window.pageYOffset // safari比较特别，有自己获取scrollTop的函数
                || document.body.scrollTop; // 对于没有doctype声明的页面里可以使用
    }

    function findMaxZIndex($container) {
        var children = $container.children();
        if (!children.length) return null;

        var ret = null;
        children.each(function() {
            if (this === window) return;

            var zIndex = $(this).css("z-index");
            if ($.isNumeric(zIndex)) {
                if (!ret || ret < zIndex) ret = zIndex;
            } else {
                var result = findMaxZIndex($(this));
                if (!ret || ($.isNumeric(result) && ret < result)) ret = result;
            }
        });

        return ret ? parseInt(ret) : 0;
    }

    function findTheSameParent() {
        var nodes = arguments,
            rootNode = document.body;

        var curNodes = nodes,
            sameParent,
            clearNodes = []; // 暂存设置了data-counter属性的node，用于操作结束之后去掉这个属性
        var iterate = function() {
            var parents = [],
                curNodesTmp = [],
                counter,
                parentNode;
            for (var i = 0, il = curNodes.length; i < il; i += 1) {

                if (curNodes[i] !== rootNode) {
                    parentNode = curNodes[i].parentNode;
                    counter = parseInt(parentNode.getAttribute('data-counter'));
                    counter = counter ? (counter + 1) : 1;

                    // 如果计数器达到了nodes.length，说明共同的祖先就是这个了
                    if (counter === nodes.length) {
                        sameParent = parentNode;

                        return false;
                    }

                    parentNode.setAttribute('data-counter', counter);
                    curNodesTmp.push(parentNode);
                    clearNodes.push(parentNode);
                }
            }
            curNodes = curNodesTmp;

            return true;
        };

        while (iterate()) {

        };

        // 清除
        for (var i = 0, il = clearNodes.length; i < il; i += 1) {
            clearNodes[i].removeAttribute('data-counter');
        }

        return sameParent;
    }

})((window.WEBUI = window.WEBUI || {}, window.WEBUI));