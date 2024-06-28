"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (model) { return "<!doctype html>\n<html class=\"h5p-iframe\">\n<head>\n    <meta charset=\"utf-8\">\n   \n    ".concat(model.styles
    .map(function (style) { return "<link rel=\"stylesheet\" href=\"".concat(style, "\"/>"); })
    .join('\n    '), "\n    ").concat(model.scripts
    .map(function (script) { return "<script src=\"".concat(script, "\"></script>"); })
    .join('\n    '), "\n\n    <script>\n        window.H5PIntegration = ").concat(JSON.stringify(model.integration, null, 2), ";\n    </script>\n</head>\n<body>\n    <div class=\"h5p-content\" data-content-id=\"").concat(model.contentId, "\"></div>\n    <a href=\"").concat(model.downloadPath, "\">Download</button>\n</body>\n</html>"); });
