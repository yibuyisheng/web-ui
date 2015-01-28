describe('render.js', function() {
    it.only('test', function() {
        var tpl = [
            '<div class="{{name}}">',
                '{{name}}',
                '<ul>',
                    '<li repeat="items" class="{{value}}" data="{{name}}">',
                        '{{value}}-\'\'>{{index}}',
                    '</li>',
                '</ul>',
            '</div>'
        ].join('');
        WEBUI.render.createTag('test', tpl);
        var instances = WEBUI.render.mount('test', {
            name: 'zhangsan',
            items: ['a', 'b', 'c', 'd']
        });

        var counter = 0;
        document.getElementById('update').addEventListener('click', function() {
            var instance = instances[0];
            instance.vm = {name: 'haha' + counter++};
            instance.update();
        });
    });
});