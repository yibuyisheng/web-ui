describe('urlHelper.js', function() {
    it('getParams', function() {
        var url = 'http://www.baidu.com?a=1&b=2';
        equal('1', WEBUI.urlHelper.getParams(url).a);
    });

    it('buildUrl', function() {
        equal('http://www.baidu.com?a=1&b=2', WEBUI.urlHelper.buildUrl('http://www.baidu.com', {a: 1, b: 2}));
        equal('http://www.baidu.com?a=1&b=2', WEBUI.urlHelper.buildUrl('http://www.baidu.com?a=1', {b: 2}));
        equal('http://www.baidu.com?a=2&b=2', WEBUI.urlHelper.buildUrl('http://www.baidu.com?a=1', {a: 2, b: 2}));
    });
});