describe('base.js测试', function() {
    it('extend将后面的对象合并到第一个对象上面去', function() {
        var a = {};
        var b = a;
        var a = WEBUI.base.extend(a, {});
        equal(a, b);
    });

    it('extend深复制', function() {
        var a = {};
        WEBUI.base.extend(a, {b: {c: 'c'}});
        equal('c', a.b.c);
    });

    it('bind给函数绑定this', function() {
        var obj = {a: 1};
        function fn() {
            equal(1, this.a);
        }

        WEBUI.base.bind(fn, obj)();
    });

    it('format', function() {
        equal('hello world!', WEBUI.base.format('hello {0}{1}', 'world', '!'));
    });

    it('keys and values', function() {
        var obj = {
            a: 1,
            b: 2,
            c: 3
        };
        equal('a', WEBUI.base.keys(obj).sort()[0]);
        equal(1, WEBUI.base.values(obj).sort()[0]);
    });
});