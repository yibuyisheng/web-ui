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

    it('bind', function() {
        var obj = {a: 1};
        function fn() {
            equal(1, this.a);
        }

        WEBUI.base.bind(fn, obj)();
    });
});