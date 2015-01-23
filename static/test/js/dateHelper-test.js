describe('dateHelper.js', function() {
    it('format', function() {
        var dt = new Date(1422006289753);
        equal('2015-01-23 17:44:49', WEBUI.dateHelper.format(dt, 'yyyy-MM-dd HH:mm:ss'));
    });
});