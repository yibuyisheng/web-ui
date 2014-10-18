/** 
* 初步完成一个类似于requirejs的东西，目前还需要解决的问题：
* 1、loadScript浏览器兼容（回调函数必须要在被加载的js执行完毕才能调用）；
* 2、循环依赖问题；
* 3、加载出错提示；
* 4、性能优化，减少循环；
* 5、其他一些requirejs支持的特性;
* 6、一个页面多次调用require函数的冲突问题；
*/

(function(global, doc) {

  var addEvent = function(elem, eventName, callback) {
    if (elem.addEventListener) {
      elem.addEventListener(eventName, callback, false);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + eventName, callback);
    } else {
      elem['on' + eventName] = function(event) {
        var event = event || window.event;
        callback.call(elem, event);
      };
    }
  };

  var domReady = function(callback) {
    addEvent(doc, 'readystatechange', function() {
      if (document.readyState === 'complete') {
        callback();
      }
    });
  };

  var loadScript = function(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    addEvent(script, 'load', function() {
      callback && callback();
    });
    document.head.appendChild(script);
  };

  var isFunction = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  };
  var isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };
  var isObject = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  var extend = function() {
    var args = arguments;
    if (!args.length) return;
    if (!args.length === 1) return args[0];

    var isValueType = function(obj) {
      return typeof obj !== 'object'             // 不是对象类型
        || typeof obj === 'undefined'       
        || obj === null;
    };
    if (isValueType(args[0])) return args[0];

    var merge = function(obj1, obj2) {
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
    };

    for (var i = 1, il = args.length; i < il; i += 1) {
      args[0] = merge(args[0], args[i]);
    }

    return args[0];
  };


  // 获取当前脚本的完整url
  var getCurrentScriptUrl = function() {
    var a = {},
      expose = +new Date(),
      rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
      isLtIE8 = ('' + doc.querySelector).indexOf('[native code]') === -1;
    // FF,Chrome
    if (doc.currentScript){
      return doc.currentScript.src;
    }

    var stack;
    try{
      a.b();
    }
    catch(e){
      stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
    }
    // IE10
    if (stack){
      var absPath = rExtractUri.exec(stack)[1];
      if (absPath){
        return absPath;
      }
    }

    // IE5-9
    // 当前执行的脚本只能有一个，因为js是单线程的
    for(var scripts = doc.scripts,
      i = scripts.length - 1,
      script; script = scripts[i--];){
      if (script.className !== expose && script.readyState === 'interactive'){
        script.className = expose;
        // if less than ie 8, must get abs path by getAttribute(src, 4)
        return isLtIE8 ? script.getAttribute('src', 4) : script.src;
      }
    }
  };

  var getDependencies = function(currentScriptUrl, dependencies, fn, callback) {
    dependencies = dependencies || [];
    for (var i = 0, il = dependencies.length; i< il; i += 1) {
      var url = buildScriptUrl(dependencies[i]);
      dependencies[i] = url;
      (function(url) {
        // 避免重复加载
        if (require._cache[url]) return;

        // 加载未加载的js
        require._cache[url] = {
          state: 'loading'
        };
        loadScript(url, function() {
          // 这个js模块没有调用define方法
          if (!require._cache[url] || require._cache[url].state === 'loading') {
            require._cache[url] = {
              state: 'loaded'
            };  
          }

          if (dependenciesTreeReady()) {
            callback && callback();
          }
        });
      })(url);
    }

    require._cache[currentScriptUrl] = {
      state: 'loaded',
      exports: null,
      dependencies: dependencies,
      fn: fn
    };
  };

  // 检测整个依赖树是否构建完毕
  var dependenciesTreeReady = function() {
    for (var k in require._cache) {
      for (var i in require._cache[k].dependencies) {
        var dependency = require._cache[k].dependencies[i];
        if (!require._cache[dependency] || require._cache[dependency].state !== 'loaded') {
          return false;
        }
      }
    }
    return true;
  };

  // 依赖树创建完成就可以开始执行了
  var execute = function() {
    var exec = function(url, dependencies, fn) {
      var ret;
      if (dependencies && dependencies.length) {
        var args = [];
        for (var i in dependencies) {
          args.push(exec(dependencies[i], require._cache[dependencies[i]].dependencies, require._cache[dependencies[i]].fn));
        }
        if (fn) ret = fn.apply(null, args);
      } else {
        if (fn) ret = fn();
      }
      require._cache[url].exports = ret;
      return ret;
    };
    var dependencies = require._cache[require._mainscript].dependencies;
    exec(require._mainscript, dependencies, require._cache[require._mainscript].fn);
  };

  var require = function() {
    var args = arguments;
    if (!args.length) return;

    var dependencies, callback;
    if (isArray(args[0])) {
      dependencies = args[0];
    } else if (isFunction(args[0])) {
      callback = args[0];
    }
    if (isFunction(args[1])) {
      callback = args[1];
    }

    var currentScriptUrl = getCurrentScriptUrl();
    require._mainscript = currentScriptUrl;
    getDependencies(currentScriptUrl, dependencies, callback, execute);

  };

  var define = function() {
    var args = arguments;
    if (!args.length) return;

    var dependencies, callback;
    if (isArray(args[0])) {
      dependencies = args[0];
    } else if (isFunction(args[0])) {
      callback = args[0];
    }
    if (isFunction(args[1])) {
      callback = args[1];
    }

    getDependencies(getCurrentScriptUrl(), dependencies, callback, execute);
  };

  var buildScriptUrl = function(shortName) {
    if (require._cfg.baseUrl) {
      return location.origin + require._cfg.baseUrl.replace(/\/+$/, '') + '/' + shortName.replace(/^\/+/, '') + '.js';
    } else {
      return shortName + '.js';
    }
  };

  require._cfg = {
    baseUrl: '',
    shim: {}
  };
  require._cache = {};

  require.config = function(cfg) {
    if (!isObject(cfg)) return;

    require._cfg = extend(require._cfg, cfg);
  };

  global.require = require;
  global.define = define;

})(window, document);