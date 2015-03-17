/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	window.WEBUI = {
	    base: __webpack_require__(10),
	    arrayHelper: __webpack_require__(11),
	    dateHelper: __webpack_require__(12),
	    urlHelper: __webpack_require__(13),
	    eventDealer: __webpack_require__(14),
	    outer: __webpack_require__(15),
	    timer: __webpack_require__(16)
	};

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var toString = Object.prototype.toString;

	module.exports = {
	    getClassName: getClassName,
	    isObject: isObject,
	    isFunction: isFunction,
	    isArray: isArray,
	    isString: isString,
	    extend: extend,
	    bind: bind,
	    format: format,
	    keys: keys,
	    values: values
	};

	function getClassName(obj) {
	    return toString.call(obj).slice(8, -1);
	}

	function isObject(obj) {
	    return getClassName(obj) === 'Object';
	}

	function isFunction(obj) {
	    return getClassName(obj) === 'Function';
	}

	function isArray(obj) {
	    return getClassName(obj) === 'Array';
	}

	function isString() {
	    return getClassName(obj) === 'String';
	}

	/**
	 * 深复制
	 */
	function extend() {
	    var args = arguments;
	    if (!args.length) return;
	    if (!args.length === 1) return args[0];

	    function isValueType(obj) {
	        return typeof obj !== 'object' // 不是对象类型
	            || typeof obj === 'undefined' || obj === null;
	    }
	    if (isValueType(args[0])) return args[0];

	    function merge(obj1, obj2) {
	        if (isValueType(obj2)) return obj1;

	        for (var k in obj2) {
	            if (isValueType(obj1[k])) {
	                obj1[k] = obj2[k];
	            }
	            // 是对象类型
	            else {
	                obj1[k] = {};
	                merge(obj1[k], obj2[k]);
	            }
	        }
	        return obj1;
	    }

	    for (var i = 1, il = args.length; i < il; i += 1) {
	        args[0] = merge(args[0], args[i]);
	    }

	    return args[0];
	}

	function bind(fn, thisArg) {
	    if (!isFunction(fn)) return;

	    var bind = Function.prototype.bind || function() {
	        var args = arguments;
	        var obj = args.length > 0 ? args[0] : undefined;
	        var _this = this;
	        return function() {
	            var totalArgs = Array.prototype.concat.apply(Array.prototype.slice.call(args, 1), arguments);
	            return _this.apply(obj, totalArgs);
	        };
	    };
	    return bind.apply(fn, [thisArg].concat(Array.prototype.slice.call(arguments, 2)));
	}

	/**
	 * 用指定的参数替换掉字符串'hello {0} {1}'中的{0}和{1}
	 *
	 * @param {string} str 待替换的字符串
	 * @return {string} 返回一个转换后的字符串
	 */
	function format(str) {
	    var args = arguments;
	    return str.replace(/\{[0-9]+\}/g, function(match) {
	        return args[parseInt(match.slice(1, -1)) + 1];
	    });
	}

	function keys(obj) {
	    if (Object.keys) {
	        return Object.keys(obj);
	    }

	    var keys = [];
	    for (var k in obj) {
	        keys.push(k);
	    }
	    return keys;
	}

	function values(obj) {
	    var ks = keys(obj);
	    var values = [];
	    for (var i in ks) {
	        values.push(obj[ks[i]]);
	    }
	    return values;
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {// 依赖
	var base = __webpack_require__(10);

	module.exports = {
	    reduce: reduce,
	    map: map,
	    filter: filter,
	    forEach: forEach,
	    some: some,
	    distinctArray: distinctArray
	};

	function reduce(arr, callback, initialValue) {
	    if (!base.isArray(arr)) return;

	    var reduce = Array.prototype.reduce || function(callback, initialValue) {
	        if (!base.isFunction(callback)) return;

	        var arr = initialValue ? Array.prototype.concat.call(this, initialValue) : this;
	        if (arr.length < 2) return initialValue;

	        var previousValue = arr[0];
	        for (var i = 1, len = arr.length; i < len; i += 1) {
	            previousValue = callback(previousValue, this[i], i, this);
	        }
	        return previousValue;
	    };
	    return reduce.call(arr, callback, initialValue);
	}

	function map(arr, fn, thisArg) {
	    if (!base.isArray(arr) || !base.isFunction(fn)) return arr;

	    var map = Array.prototype.map || function(fn, thisArg) {
	        var newArr = [];
	        for (var i in this) {
	            newArr.push(fn.call(thisArg, this, this[i], i, this));
	        }
	        return newArr;
	    };

	    return map.call(arr, fn, thisArg);
	}

	function filter(arr, fn, thisArg) {
	    if (!base.isArray(arr) || !base.isFunction(fn)) return arr;

	    var filter = Array.prototype.filter || function(fn, thisArg) {
	        var newArr = [];
	        for (var i in this) {
	            if (fn.call(thisArg, this, this[i], i, this)) newArr.push(this[i]);
	        }
	        return newArr;
	    };

	    return filter.call(arr, fn, thisArg);
	}

	function forEach(arr, fn, thisArg) {
	    if (!base.isArray(arr) || !base.isFunction(fn)) return;

	    var forEach = Array.prototype.forEach || function(fn, thisArg) {
	        for (var i in this) {
	            fn.call(thisArg, this, this[i], i, this);
	        }
	    };

	    forEach.call(arr, fn, thisArg);
	}

	function some(arr, fn, thisArg) {
	    if (!base.isArray(arr) || !base.isFunction(fn)) return;

	    var some = Array.prototype.some || function(fn, thisArg) {
	        for (var i in arr) {
	            if (fn.call(thisArg, this, this[i], i, this)) return true;
	        }
	        return false;
	    };

	    return some.call(arr, fn, thisArg);
	}

	function distinctArray(array, hashFn) {
	    if (!base.isFunction(hashFn)) throw new Error('need a hash function to compare each element');
	    var compareMap = {};
	    for (var i in array) {
	        var item = array[i];
	        var hash = hashFn(item);
	        compareMap[hash] = item;
	    }
	    return global.base.values(compareMap);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var strMap = {
	    yyyy: function(dt) {
	        return dateGetter(Date.prototype.getFullYear, dt);
	    },
	    MM: function(dt) {
	        return fill(dateGetter(Date.prototype.getMonth, dt) + 1, 2);
	    },
	    dd: function(dt) {
	        return fill(dateGetter(Date.prototype.getDate, dt), 2);
	    },
	    HH: function(dt) {
	        return fill(dateGetter(Date.prototype.getHours, dt), 2);
	    },
	    mm: function(dt) {
	        return fill(dateGetter(Date.prototype.getMinutes, dt), 2);
	    },
	    ss: function(dt) {
	        return fill(dateGetter(Date.prototype.getSeconds, dt), 2);
	    }
	};

	module.exports = {
	    format: dateFormat
	};

	function fill(num, len) {
	    var numStr = String(num);
	    while (numStr.length < len) {
	        numStr = '0' + numStr;
	    }
	    return numStr;
	}

	function dateGetter(fn, dt) {
	    return fn.call(dt);
	}

	function dateFormat(dt, formatStr) {
	    return formatStr.replace(/(y{4})|([M|d|H|m|s]{2})/g, function(match) {
	        return strMap[match](dt);
	    });
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var base = __webpack_require__(10);

	module.exports = {
	    getParams: getParams,
	    buildUrl: buildUrl,
	    renderToHref: renderToHref,
	    encode: encode
	};

	// 将str字符串中的url转换成带a标签的链接
	function renderToHref(str) {
	    return str.replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|\&|-)+)/g, function() {
	        var url = arguments[0];
	        return '<a href="' + url + '">' + url + '</a>';
	    });
	}

	function getParams(url) {
	    var search = url.split('?');
	    if (search.length <= 1) {
	        return {};
	    }
	    search = search[1];

	    return _decode(search);
	}

	function buildUrl(url, params) {
	    var params = base.extend(getParams(url), params);

	    return url.split('?')[0] + '?' + encode(params);
	}

	function encode(params) {
	    var result = [];
	    for (var k in params) {
	        result.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
	    }

	    return result.join('&');
	}

	function _decode(search) {
	    if (!search) return {};

	    var searchSplit = search.split('&');
	    var result = {};
	    for (var i in searchSplit) {
	        var param = searchSplit[i].split('=');
	        if (param.length !== 2) continue;
	        result[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
	    }
	    return result;
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// 依赖
	var base = __webpack_require__(10);
	var arrayHelper = __webpack_require__(11);

	var eventDealer = {
	    on: function(eventName, cb) {
	        if (!base.isFunction(cb)) return;
	        if (!this._cbs) this._cbs = {};
	        if (!this._cbs[eventName]) this._cbs[eventName] = [];
	        this._cbs[eventName].push(cb);
	        return this;
	    },
	    trigger: function(eventName, data) {
	        if (this._cbs && this._cbs[eventName]) {
	            this._cbs[eventName] = arrayHelper.filter(this._cbs[eventName], function(val) {
	                if (base.isFunction(val)) val.call(this, data);
	                return val !== null;
	            }, this);
	        }
	        return this;
	    },
	    off: function(eventName, cb) {
	        if (!base.isFunction(cb)) return;
	        this._cbs[eventName] = arrayHelper.map(this._cbs[eventName], function(val, index, arr) {
	            return val === cb ? null : val;
	        });
	    }
	};

	module.exports = eventDealer;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var base = __webpack_require__(10);
	var arrayHelper = __webpack_require__(11);

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

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// 用于界面动画的“定时器”
	var arrayHelper = __webpack_require__(11);

	// 外部注册进来的回调函数
	var callbacks = [];

	var timerFunction = window.requestAnimationFrame ? window.requestAnimationFrame : function() {
	    return function(fn) {
	        window.setTimeout(fn, 50)
	    };
	};
	timerCallback();

	module.exports = {
	    // 添加timer回调函数
	    add: function(fn, minInterval) {
	        var fnObj = {
	            preTime: +(new Date()),
	            minInterval: minInterval ? minInterval : 0,
	            type: 'every',
	            callback: fn
	        };
	        callbacks.push(fnObj);
	    },
	    // 移除timer回调函数
	    remove: function(fn) {
	        callbacks = utils.map(callbacks, function(val) {
	            return val.callback === fn ? null : val;
	        });
	    },
	    // 注册一个只会调用一次的函数
	    once: function(fn, minDelay) {
	        callbacks.push({
	            preTime: +(new Date()),
	            minDelay: minDelay ? minDelay : 0,
	            type: 'once',
	            callback: fn
	        });
	    }
	};

	function timerCallback() {
	    callbacks = arrayHelper.filter(callbacks, function(val, index) {
	        var now = +(new Date());
	        if (
	            val
	            && (
	                (val.type === 'every' && now - val.preTime >= val.minInterval)
	                || (val.type === 'once' && now - val.preTime >= val.minDelay)
	            )
	        ) {
	            val.callback();
	            if (val.type === 'once') val = null;
	            else val.preTime = now;
	        }

	        return val !== null;
	    });

	    timerFunction(timerCallback);
	}


/***/ }
/******/ ]);