/**
 * 渲染html
 */

(function(global) {

    var nodeEnum = {
        ELEMENT_NODE: 1,
        TEXT_NODE: 3
    };
    var EXPRESSION_REGEXP = /\{\{(.*?)\}\}/g;

    // 注册的tag
    var tags = {};

    global.render = {
        createTag: createTag,
        mount: mount
    };

    function createTag(name, tpl) {
        tags[name] = tpl;
    }

    function mount(name, vm) {
        var nodes = document.getElementsByTagName(name);
        var tpl = tags[name];
        if (!tpl) return;

        var instances = [];
        for (var i = 0, il = nodes.length; i < il; i++) {
            var dom = createDom(tpl);
            var expressions = collectExpressions(dom);
            var instance = {
                vm: vm,
                expressions: expressions,
                update: function() {
                    update(this.expressions, this.vm);
                }
            };
            instance.update();
            instances.push(instance);

            nodes[i].parentNode.replaceChild(dom, nodes[i]);
        }
        return instances;
    }

    function createDom(tpl) {
        var div = document.createElement('div');
        div.innerHTML = tpl;
        if (div.children.length !== 1) {
            throw new Error('tag must have one element root');
        }
        return div.firstElementChild;
    }

    /**
     * 搜集表达式
     * expressions数据结构：
     * {
     *     '{{name}}': {
     *         list: [{node: node, updateFn: function(value, node) {...}}], // 节点及更新节点的方法
     *         fnObj: {                                                     // 重新计算表达式值的函数
     *             args: [...],                                             // 此函数的参数名字数组（一个字符串数组）
     *             fn: function() {...}                                     // 具体的函数
     *         }
     *     }
     * }
     */
    function collectExpressions(dom) {
        var expressions = {};
        traverse(dom, function(node) {
            if (node.nodeType === nodeEnum.ELEMENT_NODE) {
                // if (node.getAttribute('repeat')) {
                //     var cmtStart = document.createComment('start: ' + node.outerHTML);
                //     var cmtEnd = document.createComment('end');
                //     var parentNode = node.parentNode;
                //     parentNode.replaceChild(cmtStart, node);
                //     parentNode.insertBefore(cmtEnd, cmtStart.nextSibling);
                //     add(node.outerHTML, [cmtStart, cmtEnd, node], function(value, opts) {
                //         var cmtStart = opts[0];
                //         var cmtEnd = opts[1];
                //         var node = opts[2];
                //     });
                //     return;
                // }

                var attrs = node.attributes;
                for (var i = 0, il = attrs.length; i < il; i++) {
                    var attr = attrs[i];
                    if (!EXPRESSION_REGEXP.test(attr.value)) continue;
                    add(attr.value, node, function(value, node) {
                        node.setAttribute(attr.name, value);
                    });
                }
            } else if (
                node.nodeType === nodeEnum.TEXT_NODE
                && EXPRESSION_REGEXP.test(node.textContent)
            ) {
                add(node.textContent, node, function(value, node) {
                    node.textContent = value;
                });
            }
        });
        return expressions;

        function add(expression, opts, updateFn) {
            expressions[expression] = expressions[expression] || {list: []};
            expressions[expression].list.push({
                opts: opts,
                updateFn: updateFn
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
    // filterFn用于过滤node，如果返回值为false，则不再遍历该节点下面的子孙节点
    function traverse(dom, fn, filterFn) {
        var stack = [dom];
        while (stack.length) {
            var top = stack.pop();
            fn(top);
            if (filterFn && !filterFn(top)) continue;
            var childNodes = top.childNodes;
            for (var i = 0, il = childNodes.length; i < il; i += 1) {
                fn(childNodes[i]);
                stack.push(childNodes[i]);
            }
        }
    }

    // 将数据渲染上去
    function update(expressions, vm) {
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
                    exprObj.list[i].updateFn(exprValue, exprObj.list[i].node);
                }
            }
            exprObj.lastValue = exprValue;
        }
    }


})((window.WEBUI = window.WEBUI || {}, window.WEBUI));