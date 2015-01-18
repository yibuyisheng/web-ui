define(['utils/base'], function(base) {

    return {
        getParams: getParams,
        buildUrl: buildUrl
    };

    function getParams(url) {
        var paramSplit, paramStrs, params, urlSplit, value, _i, _len;
        if (!isString(url)) {
            return {};
        }
        urlSplit = url.split('?');
        if (urlSplit.length <= 1) {
            return {};
        }
        paramStrs = urlSplit[1].split('&');
        params = {};
        for (var i in paramStrs) {
            value = paramStrs[i];
            paramSplit = value.split('=');
            if (paramSplit.length === 2) {
                params[paramSplit[0]] = paramSplit[1];
            }
        }
        return params;
    }

    function buildUrl(url, params) {
        var allParams, baseParams, baseUrl, key, paramStrs, value;
        if (!isString(url)) {
            return null;
        }
        baseUrl = (url.split('?'))[0];
        baseParams = getParams(url);
        allParams = baseParams;
        for (var key in params) {
            value = params[key];
            if (!value) continue;
            allParams[key] = value;
        }
        paramStrs = (function() {
            var _results;
            _results = [];
            for (var key in allParams) {
                value = allParams[key];
                if (!value) continue;
                _results.push("" + key + "=" + value);
            }
            return _results;
        })();
        return "" + baseUrl + "?" + (paramStrs.join('&'));
    }

});