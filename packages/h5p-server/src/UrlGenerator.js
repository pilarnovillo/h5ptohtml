"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_querystring_1 = require("node:querystring");
/**
 * This class generates URLs for files based on the URLs set in the
 * configuration.
 *
 * It includes a basic cache buster that adds a parameter with the full version
 * to core and library files (e.g. ?version=1.2.3). You can also implement other
 * means of busting caches by implementing IUrlGenerator yourself. It would for
 * example be possible to adding a generic cache buster string instead of adding
 * the version. If you decide to do this, you must be aware of the fact that the
 * JavaScript client generates URLs dynamically in two cases (at the time of
 * writing), both in h5peditor.js:contentUpgrade. This function uses
 * H5PIntegration.pluginCacheBuster, which can be customized by overriding
 * H5PEditor.cacheBusterGenerator.
 *
 * UrlGenerator requires these values to be set in config:
 * - baseUrl
 * - contentFilesUrlPlayerOverride (includes placeholder! See documentation of
 *   config for details!)
 * - contentUserDataUrl
 * - coreUrl
 * - downloadUrl
 * - editorLibraryUrl
 * - h5pVersion
 * - librariesUrl
 * - paramsUrl
 * - playUrl
 * - setFinishedUrl
 * - temporaryFilesUrl
 *
 * The UrlGenerator can also be used to inject CSRF tokens into URLs for POST
 * requests that are sent by the H5P editor core (Joubel's code) over which you
 * don't have any control. You can then check the CSRF tokens in your middleware
 * to authenticate requests.
 */
var UrlGenerator = /** @class */ (function () {
    /**
     * @param config the config
     * @param csrfProtection (optional) If used, you must pass in a function
     * that returns a CSRF query parameter for the user for who a URL is
     * generated; the query parameter will be appended to URLs like this:
     * "baseUrl/ajax/?name=value&action=..." You must specify which routes you
     * want to be protected. If you don't pass in a csrfProtection object, no
     * CSRF tokens will be added to URLs.
     */
    function UrlGenerator(config, csrfProtection) {
        var _this = this;
        this.config = config;
        this.csrfProtection = csrfProtection;
        this.ajaxEndpoint = function (user) {
            var _a, _b;
            if (((_a = _this.csrfProtection) === null || _a === void 0 ? void 0 : _a.queryParamGenerator) &&
                ((_b = _this.csrfProtection) === null || _b === void 0 ? void 0 : _b.protectAjax)) {
                var qs_1 = _this.csrfProtection.queryParamGenerator(user);
                if (qs_1 && qs_1.name && qs_1.value) {
                    return "".concat(_this.config.baseUrl).concat(_this.config.ajaxUrl, "?").concat(qs_1.name, "=").concat(qs_1.value, "&action=");
                }
            }
            return "".concat(_this.config.baseUrl).concat(_this.config.ajaxUrl, "?action=");
        };
        this.baseUrl = function () { return _this.config.baseUrl; };
        this.contentUserData = function (user, contextId, asUserId, options) {
            var _a, _b;
            var queries = {};
            if (contextId) {
                queries.contextId = contextId;
            }
            if (asUserId) {
                queries.asUserId = asUserId;
            }
            if (options === null || options === void 0 ? void 0 : options.readonly) {
                queries.ignorePost = 'yes';
            }
            if (((_a = _this.csrfProtection) === null || _a === void 0 ? void 0 : _a.queryParamGenerator) &&
                ((_b = _this.csrfProtection) === null || _b === void 0 ? void 0 : _b.protectContentUserData)) {
                var qs_2 = _this.csrfProtection.queryParamGenerator(user);
                if (qs_2.name) {
                    queries[qs_2.name] = qs_2.value;
                }
                var queryString_1 = (0, node_querystring_1.encode)(queries);
                return "".concat(_this.config.baseUrl).concat(_this.config.contentUserDataUrl, "/:contentId/:dataType/:subContentId").concat(queryString_1 ? "?".concat(queryString_1) : '');
            }
            var queryString = (0, node_querystring_1.encode)(queries);
            return "".concat(_this.config.baseUrl).concat(_this.config.contentUserDataUrl, "/:contentId/:dataType/:subContentId").concat(queryString ? "?".concat(queryString) : '');
        };
        /**
         * Also adds a cache buster based on IH5PConfig.h5pVersion.
         * @param file
         */
        this.coreFile = function (file) {
            return "".concat(_this.baseUrl()).concat(_this.config.coreUrl, "/").concat(file, "?version=").concat(_this.config.h5pVersion);
        };
        this.coreFiles = function () {
            return "".concat(_this.baseUrl()).concat(_this.config.coreUrl, "/js");
        };
        this.downloadPackage = function (contentId) {
            return "".concat(_this.baseUrl()).concat(_this.config.downloadUrl, "/").concat(contentId);
        };
        /**
         * Also adds a cache buster based on IH5PConfig.h5pVersion.
         * @param file
         */
        this.editorLibraryFile = function (file) {
            return "".concat(_this.baseUrl()).concat(_this.config.editorLibraryUrl, "/").concat(file, "?version=").concat(_this.config.h5pVersion);
        };
        this.editorLibraryFiles = function () {
            return "".concat(_this.baseUrl()).concat(_this.config.editorLibraryUrl, "/");
        };
        this.libraryFile = function (library, file) {
            if (file.startsWith('http://') ||
                file.startsWith('https://') ||
                file.startsWith('/')) {
                return file;
            }
            return "".concat(_this.baseUrl()).concat(_this.config.librariesUrl, "/").concat(library.machineName, "-").concat(library.majorVersion, ".").concat(library.minorVersion, "/").concat(file, "?version=").concat(library.majorVersion, ".").concat(library.minorVersion, ".").concat(library.patchVersion);
        };
        this.parameters = function () {
            return "".concat(_this.baseUrl()).concat(_this.config.paramsUrl);
        };
        this.play = function () { return "".concat(_this.baseUrl()).concat(_this.config.playUrl); };
        this.setFinished = function (user) {
            var _a, _b;
            if (((_a = _this.csrfProtection) === null || _a === void 0 ? void 0 : _a.queryParamGenerator) &&
                ((_b = _this.csrfProtection) === null || _b === void 0 ? void 0 : _b.protectSetFinished)) {
                var qs_3 = _this.csrfProtection.queryParamGenerator(user);
                return "".concat(_this.config.baseUrl).concat(_this.config.setFinishedUrl, "?").concat(qs_3.name, "=").concat(qs_3.value);
            }
            return "".concat(_this.config.baseUrl).concat(_this.config.setFinishedUrl);
        };
        this.temporaryFiles = function () {
            return _this.baseUrl() + _this.config.temporaryFilesUrl;
        };
    }
    UrlGenerator.prototype.contentFilesUrl = function (contentId) {
        var _a;
        return (_a = this.config.contentFilesUrlPlayerOverride) === null || _a === void 0 ? void 0 : _a.replace('{{contentId}}', contentId);
    };
    UrlGenerator.prototype.uniqueContentUrl = function (contentId) {
        return contentId;
    };
    return UrlGenerator;
}());
exports.default = UrlGenerator;
