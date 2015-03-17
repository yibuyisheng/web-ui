(function(global) {

    var eventDealer = global.eventDealer;
    var base = global.base;

    global.model = base.extend({}, eventDealer, {
        _local: function(doneFn) {},
        _server: function(doneFn) {}
    });

})((window.WEBUI = window.WEBUI || {}, window.WEBUI));