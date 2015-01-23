describe('arrayHelper.js', function() {
    it('reduce', function() {
        var sum = WEBUI.arrayHelper.reduce([1, 2, 3, 4], function(pre, cur) {
            return pre + cur;
        }, 0);
        equal(10, sum);
    });

    it('map', function() {
        var newArray = WEBUI.arrayHelper.map([1, 2, 3, 4], function(item) {
            return String(item);
        });
        equal('1', newArray[0]);
        equal(4, newArray.length);
    });

    it('filter', function() {
        var newArray = WEBUI.arrayHelper.filter([1, 2, 3, 4], function(item) {
            return item > 1;
        });
        equal(2, newArray[0]);
        equal(3, newArray.length);
    });

    it('forEach', function() {
        var arr = [{a: 1}];
        WEBUI.arrayHelper.forEach(arr, function(item) {
            item.a = 2;
        });
        equal(2, arr[0].a);
    });

    it('some', function() {
        var arr = [1, 2, 3];
        var counter = 0;
        var result = WEBUI.arrayHelper.some(arr, function(item) {
            counter ++;
            return item === 1;
        });
        equal(1, counter);
        equal(true, result);
    });

    it('distinctArray', function() {
        var arr = [1, 3, 5, 4, 1, 5];
        var newArray = WEBUI.arrayHelper.distinctArray(arr, function(item) {
            return item;
        });
        equal(4, newArray.length);
        equal(3, newArray.sort()[1]);
    });
});