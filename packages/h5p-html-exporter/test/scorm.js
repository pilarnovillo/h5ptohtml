"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (marginX, marginY, maxWidth, customCss) {
    return function (integration, scriptsBundle, stylesBundle, contentId) {
        var marginStyle = '';
        if (marginX !== undefined && marginY !== undefined) {
            marginStyle = "margin: ".concat(marginY, "px ").concat(marginX, "px;");
        }
        var flexStyle = '';
        var widthStyle = '';
        if (maxWidth !== undefined) {
            flexStyle = "display: flex; justify-content: center;";
            widthStyle = "max-width:".concat(maxWidth, "px;");
        }
        return "<!doctype html>\n<html class=\"h5p-iframe\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">  \n  <script>H5PIntegration = ".concat(JSON.stringify(integration), ";\n  ").concat(scriptsBundle, "</script>\n  <script type=\"text/javascript\" src=\"SCORM_API_wrapper.js\"></script>\n  <script type=\"text/javascript\" src=\"h5p-adaptor.js\"></script>\n  <style>").concat(stylesBundle, "</style>\n  ").concat(customCss ? "<style>".concat(customCss, "</style>") : '', "\n</head>\n<body>\n    <div style=\"").concat(marginStyle).concat(flexStyle, "\">\n        <div style=\"").concat(widthStyle, "\" class=\"h5p-content lag\" data-content-id=\"").concat(contentId, "\"></div>        \n    </div>  \n</body>\n</html>");
    };
});
