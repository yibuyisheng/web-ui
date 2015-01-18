define(['utils/base'], function(base) {

    return {
        reduce: reduce,
        map: map,
        filter: filter,
        forEach: forEach,
        some: some,
        distinctArray: distinctArray
    };

    function reduce(arr, callback, initialValue) {
        if (!isArray(arr)) return;

        var reduce = Array.prototype.reduce || function(callback, initialValue) {
            if (!isFunction(callback)) return;

            var arr = initialValue ? Array.prototype.concat.call(this, initialValue) : this;
            if (arr.length < 2) return initialValue;

            var previousValue = arr[0];
            for (var i = 1, len = arr.length; i < len; i += 1) {
                previousValue = callback(previousValue, this[i], i, this);
            }
            return previousValue;
        };
        reduce.call(arr, callback, initialValue);
    }

    function map(arr, fn, thisArg) {
        if (!isArray(arr) || !isFunction(fn)) return arr;

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
        if (!isArray(arr) || !isFunction(fn)) return arr;

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
        if (!isArray(arr) || !isFunction(fn)) return;

        var forEach = Array.prototype.forEach || function(fn, thisArg) {
            for (var i in this) {
                fn.call(thisArg, this, this[i], i, this);
            }
        };

        forEach.call(arr, fn, thisArg);
    }

    function some(arr, fn, thisArg) {
        if (!isArray(arr) || !isFunction(fn)) return;

        var some = Array.prototype.some || function(fn, thisArg) {
            for (var i in arr) {
                if (fn.call(thisArg, this, this[i], i, this)) return true;
            }
            return false;
        };

        return some.call(arr, fn, thisArg);
    }

    function distinctArray(array, hashFn) {
        if (!isFunction(hashFn)) throw new Error('need a hash function to compare each element');
        var compareMap = {};
        for (var i in array) {
            var item = array[i];
            var hash = hashFn(item);
            compareMap[hash] = item;
        }
        return values(compareMap);
    }
});