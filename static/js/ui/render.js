/**
 * 渲染html
 */

var nodeEnum = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3
};
var EXPRESSION_REGEXP = /\{\{(.*?)\}\}/g;
(function(global) {
    var tpl = [
        '<div>',
            '<span class="{{klass}}">{{klass}}</span>',
        '<div>'
    ].join('');


    window.onload = function() {
        var dom = createDom(tpl);
        var expressions = collectExpressions(dom);
        var cloneDom = createDom(dom.innerHTML);
        update(cloneDom, expressions, {klass: 'test'});
        document.body.appendChild(cloneDom);
    };

    function createDom(tpl) {
        var div = document.createElement('div');
        div.innerHTML = tpl;
        return div;
    }

    function generateUuid() {
        generateUuid.id = generateUuid.id || 0;
        return generateUuid.id++;
    }

    // 搜集表达式
    function collectExpressions(dom) {
        var expressions = {};
        tracerse(dom, function(node) {
            if (node.nodeType === nodeEnum.ELEMENT_NODE) {
                var uniqueId = generateUuid();
                node.setAttribute('unique-id', uniqueId);

                var attrs = node.attributes;
                for (var i = 0, il = attrs.length; i < il; i++) {
                    var attr = attrs[i];
                    if (EXPRESSION_REGEXP.test(attr.value)) {
                        add(attr.value, uniqueId, function(value, uniqueId, rootNode, opts) {
                            var node = rootNode.querySelector('*[unique-id="' + uniqueId + '"]');
                            node.setAttribute(opts.attrName, value);
                        }, {
                            attrName: attr.name
                        });
                    }
                }
            } else if (node.nodeType === nodeEnum.TEXT_NODE) {
                // if (EXPRESSION_REGEXP.test(node.textContent)) {
                //     add(node.textContent, uniqueId.parentNode.getAttribute('unique-id'), function(value, uniqueId, rootNode) {
                //         var parentNode = rootNode.querySelector('*[unique-id="' + uniqueId + '"]');
                //         node.textContent = value;
                //     });
                // }
            }
        });
        return expressions;

        function add(expression, uniqueId, updateFn, opts) {
            expressions[expression] = expressions[expression] || {list: []};
            expressions[expression].list.push({
                uniqueId: uniqueId,
                updateFn: updateFn,
                opts: opts
            });
            expressions[expression].fnObj = expressions[expression].fnObj || createFn(expression);
        }

        function createFn(expression) {
            var args = [];
            var fnBody = expression.replace(EXPRESSION_REGEXP, function(match) {
                var arg = match.slice(2, -2);
                args.push(arg);
                return 'return ' + arg;
            });
            return {
                args: args,
                fn: new Function(args.join(','), fnBody)
            };
        }
    }

    // 遍历节点
    function tracerse(dom, fn) {
        var stack = [dom];
        while (stack.length) {
            var top = stack.pop();
            var childNodes = top.childNodes;
            for (var i = 0, il = childNodes.length; i < il; i += 1) {
                fn(childNodes[i]);
                stack.push(childNodes[i]);
            }
        }
    }

    // 将数据渲染上去
    function update(dom, expressions, vm) {
        for (var expr in expressions) {
            var exprObj = expressions[expr];
            var params = [];
            for (var i in exprObj.fnObj.args) {
                params.push(vm[exprObj.fnObj.args[i]]);
            }
            var exprValue = exprObj.fnObj.fn.apply(null, params);

            // 脏检测
            if (exprValue !== exprObj.lastValue) {
                for (var i in exprObj.list) {
                    exprObj.list[i].updateFn(exprValue, exprObj.list[i].uniqueId, dom, exprObj.list[i].opts);
                }
            }
            exprObj.lastValue = exprValue;
        }
    }


})((window.WEBUI = window.WEBUI || {}, window.WEBUI));