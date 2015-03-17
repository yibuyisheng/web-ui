var utilities = require('utilities');
var base = utilities.base;
var arrayHelper = utilities.arrayHelper;

var outerCallbacks = [];
addEvent(document, 'click', function(event) {
    var newCallbacks = [];
    for (var i = 0, il = outerCallbacks.length; i < il; i += 1) {
        var outerCallback = outerCallbacks[i];
        if (outerCallback && !isIn(outerCallback.nodes, event.target)) {
            outerCallback.callback.call(event.target);
        }

        // 注意在回调函数中可能会调用offOuter，所以此处需要移除掉为null的元素
        if (outerCallbacks[i]) {
            newCallbacks.push(outerCallbacks[i]);
        }
    }
    outerCallbacks = newCallbacks;
});

module.exports = {
    on: outer,
    off: outerOff
};

// 判断node的祖先节点中是否有parentNodes种的某一个
function contains(parentNode, childNode) {
    var fn = Node.prototype.contains || function(childNode) {
        while (childNode) {
            if (childNode === parentNode) return true;
            childNode = childNode.parentNode;
        }
    };
    return fn.call(parentNode, childNode);
}

function isIn(parentNodes, node) {
    for (var i = 0, il = parentNodes.length; i < il; i += 1) {
        if (contains(parentNodes[i], node)) return true;
    }
    return false;
}

function addEvent(elem, eventName, callback) {
    if (window.addEventListener) {
        elem.addEventListener(eventName, callback, false);
    } else if (window.attachEvent) {
        elem.attachEvent('on' + eventName, callback);
    } else {
        elem['on' + eventName] = function() {
            callback.call(elem, window.event);
        };
    }
}

function outer(elem, callback) {
    if (!utils.isFunction(callback)) return;

    outerCallbacks.push({
        nodes: (utils.isArray(elem) ? elem : [elem]),
        callback: callback
    });
}

function outerOff(elem, callback) {
    if (!elem && !callback) return;
    if (utils.isFunction(elem)) {
        callback = elem;
        elem = undefined;
    }

    if (elem && !utils.isArray(elem)) elem = [elem];

    for (var i = 0, il = outerCallbacks.length; i < il; i += 1) {
        var counter = 0,
            isElemIn;
        if (elem) {
            for (var j = 0, jl = outerCallbacks[i].nodes.length; j < jl; j += 1) {
                if (utils.some(elem, function(val) {
                        return val === outerCallbacks[i].nodes[j]
                    })) counter += 1;
            }
            isElemIn = (counter === elem.length);
            counter = 0;
        }

        var isCallbackIn;
        if (callback) {
            isCallbackIn = (outerCallbacks[i].callback === callback);
        }

        if (elem && callback) {
            isElemIn && isCallbackIn && (outerCallbacks[i] = null);
        } else if (elem) {
            isElemIn && (outerCallbacks[i] = null);
        } else if (callback) {
            isCallbackIn && (outerCallbacks[i] = null);
        }
    }
}