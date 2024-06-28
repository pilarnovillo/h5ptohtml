"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (integration, scriptsBundle, stylesBundle, contentId) { return "\n<!doctype html>\n    <html class=\"h5p-iframe\">\n    <head>\n        <meta charset=\"utf-8\">                    \n        <script>H5PIntegration = ".concat(JSON.stringify(__assign(__assign({}, integration), { baseUrl: '.', url: '.', ajax: { setFinished: '', contentUserData: '' }, saveFreq: false, libraryUrl: '' })), ";\n\n        if (new URLSearchParams(window.location.search).get('embed') == 'true') {\n            H5PIntegration.contents['cid-' + '").concat(contentId, "'].displayOptions.embed = false;\n        } else {\n            H5PIntegration.contents['cid-' + '").concat(contentId, "'].embedCode = '<iframe src=\"' + window.location.protocol + \"//\" + window.location.host + window.location.pathname + '?embed=true' + '\" width=\":w\" height=\":h\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe>';\n            H5PIntegration.contents['cid-' + '").concat(contentId, "'].resizeCode = '';\n        }\n            \n        ").concat(scriptsBundle, "</script>\n        <style>").concat(stylesBundle, "</style>\n    </head>\n    <body>\n        <div class=\"h5p-content lag\" data-content-id=\"").concat(contentId, "\"></div>                \n    </body>\n</html>"); });
