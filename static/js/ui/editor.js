define([
    'src/utils/base'
],
function(
    base
) {
    return {
        create: function(iframe) {
            return new Editor(iframe);
        }
    };

    function Editor(iframe) {
        this._iframe = iframe;

        if (!Editor.prototype._init) {
            base.extend(Editor.prototype, {
                _init: function() {
                    this._contentWindow = this._iframe.contentWindow;
                    this._contentDocument = this._iframe.contentWindow.document;

                    this._contentDocument.write([
                        '<html>',
                            '<head>',
                                '<meta charset="utf-8">',
                            '</head>',
                            '<body contenteditable="true"></body>',
                        '</html>'
                    ].join(''));
                },
                // http://www.quirksmode.org/dom/execCommand.html
                // backcolor bold copy
                execCommand: function(cmd, value) {
                    this._contentDocument.execCommand(cmd, false, value);
                }
            });
        }

        this._init();
    }
});