"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mime_types_1 = require("mime-types");
var H5pError_1 = require("./helpers/H5pError");
var AjaxSuccessResponse_1 = require("./helpers/AjaxSuccessResponse");
var LibraryName_1 = require("./LibraryName");
var SemanticsEnforcer_1 = require("./SemanticsEnforcer");
/**
 * Each method in this class corresponds to a route that is called by the H5P
 * client. Normally, the implementation must call them and send back the
 * return values as a JSON body in the HTTP response.
 *
 * If something goes wrong, the methods throw H5pErrors, which include HTTP
 * status codes. Send back these status codes in your HTTP response.
 *
 * Remarks:
 * - Most of the route names can be configured in the IH5PConfig object and thus
 *   might have different names in your case!
 * - The GET /content/<contentId>/<file> and GET /temp-files/<file> routes
 *   should support partials for the Interactive Video editor to work. This
 *   means that the response with HTTP 200 must send back the header
 *   'Accept-Ranges: bytes' and must send back status code 206 for partials.
 *   Check out the documentation of the methods `getContentFile` and
 *   `getTemporaryFile` for more details.
 */
var H5PAjaxEndpoint = /** @class */ (function () {
    function H5PAjaxEndpoint(h5pEditor) {
        var _this = this;
        this.h5pEditor = h5pEditor;
        /**
         * This method must be called by the GET route at the Ajax URL, e.g. GET
         * /ajax. This route must be implemented for editor to work.
         * @param action This is the sub action that should be executed. It is part
         * of the query like this: GET /ajax?action=xyz Possible values:
         *   - content-type-cache: Requests information about available content
         *     types from the server. The user parameter must be set, as the
         *     accessible content types and possible actions (update, etc.) can vary
         *     from user to user
         *   - content-hub-metadata-cache: Requests information about the metadata
         *     currently in use by the H5P Content Hub.
         *   - libraries: Requests detailed data about a single library. The
         *     parameters machineName, majorVersion, minorVersion and language must
         *     be set in this case. Queries look like this: GET
         *     /ajax?action=libraries?machineName=<machine_name>&majorVersion=<major_version>&minorVersion=<minor_version>
         * @param machineName (need if action == 'libraries') The machine name of
         * the library about which information is requested, e.g. 'H5P.Example'. It
         * is part of the query, e.g. +machineName=H5P.Example
         * @param majorVersion (need if action == 'libraries') The major version of
         * the library about which information is requested, e.g. '1'.
         * @param minorVersion (need if action == 'libraries') The minor version of
         * the library about which information is requested, e.g. '0'.
         * @param language (can be set if action == 'libraries') The language in
         * which the editor is currently displayed, e.g. 'en'. Will default to
         * English if unset.
         * @param user (needed if action == 'content-type-cache') The user who is
         * displaying the H5P Content Type Hub. It is the job of the implementation
         * to inject this object.
         * @returns an object which must be sent back in the response as JSON with
         * HTTP status code 200
         * @throws H5pErrors with HTTP status codes, which you must catch and then
         * send back in the response
         */
        this.getAjax = function (action, machineName, majorVersion, minorVersion, language, user) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = action;
                        switch (_a) {
                            case 'content-type-cache': return [3 /*break*/, 1];
                            case 'content-hub-metadata-cache': return [3 /*break*/, 2];
                            case 'libraries': return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 5];
                    case 1:
                        if (!user) {
                            throw new Error('You must specify a user when calling getAjax(...).');
                        }
                        return [2 /*return*/, this.h5pEditor.getContentTypeCache(user, language)];
                    case 2:
                        _b = AjaxSuccessResponse_1.default.bind;
                        return [4 /*yield*/, this.h5pEditor.contentHub.getMetadata(language)];
                    case 3: return [2 /*return*/, new (_b.apply(AjaxSuccessResponse_1.default, [void 0, _c.sent()]))()];
                    case 4:
                        if (machineName === undefined ||
                            majorVersion === undefined ||
                            minorVersion === undefined) {
                            throw new H5pError_1.default('malformed-request', {
                                error: 'You must specify a machineName, majorVersion and minorVersion.'
                            }, 400);
                        }
                        // getLibraryData validates the library name and language code,
                        // so we don't do it here.
                        return [2 /*return*/, this.h5pEditor.getLibraryData(machineName.toString(), majorVersion.toString(), minorVersion.toString(), language === null || language === void 0 ? void 0 : language.toString())];
                    case 5: throw new H5pError_1.default('malformed-request', {
                        error: "The only allowed actions at the GET Ajax endpoint are 'content-type-cache' and 'libraries'."
                    }, 400);
                }
            });
        }); };
        /**
         * The method must be called by the GET /content/<contentId>/<filename>
         * route.
         * As it is necessary for the method to know about a possible range start
         * and end, you need to pass in a callback function that returns the range
         * specified in the http request. The start and end of the range cannot be
         * passed to this method directly, as you need to know the file size to
         * calculate the correct range. That's why we use the callback.
         *
         * Note: You can also use a status route to serve content files, but then
         * you lose the rights and permission check.
         *
         * @param contentId the contentId of the resource
         * @param filename the filename of the resource
         * @param user the user who is requesting the resource
         * @param getRangeCallback a function that can be called to retrieve the
         * start and end of a range; if the request doesn't specify a range, simply
         * return undefined; if you do not specify getRangeCallback, the method
         * will simply always use the whole file.
         * @returns mimetype: the mimetype of the file, the range (undefined if
         * unused), stats about the file and a readable. Do this with the response:
         * - Pipe back the readable as the response with status code 200.
         * - Set this HTTP header in the response: "Content-Type: <mimetype>"
         * - If range is undefined:
         *    - Return status code 200
         *    - Set this HTTP header in the response: 'Accept-Ranges: bytes'
         * - If range is defined:
         *    - Return status code 206
         *    - Set these HTTP headers in the response: 'Content-Length: <end - start + 1>'
         *                                              'Content-Range': `bytes <start-end>/<totalLength>`
         * **IMPORTANT:** You must subscribe to the error event of the readable and
         * send back a 404 status code if an error occurs. This is necessary as the
         * AWS S3 library doesn't throw proper 404 errors.
         * @throws H5pErrors with HTTP status codes, which you must catch and then
         * send back in the response
         */
        this.getContentFile = function (contentId, filename, user, getRangeCallback) { return __awaiter(_this, void 0, void 0, function () {
            var stats, range, stream, mimetype;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!user) {
                            throw new Error('You must specify a user when calling getContentFile(...).');
                        }
                        if (!contentId) {
                            throw new Error('You must specify a contentId when calling getContentFile(...)');
                        }
                        if (!filename) {
                            throw new Error('You must specify a contentId when calling getContentFile(...)');
                        }
                        return [4 /*yield*/, this.h5pEditor.contentManager.getContentFileStats(contentId, filename, user)];
                    case 1:
                        stats = _a.sent();
                        range = getRangeCallback
                            ? getRangeCallback(stats.size)
                            : undefined;
                        return [4 /*yield*/, this.h5pEditor.getContentFileStream(contentId, filename, user, range === null || range === void 0 ? void 0 : range.start, range === null || range === void 0 ? void 0 : range.end)];
                    case 2:
                        stream = _a.sent();
                        mimetype = (0, mime_types_1.lookup)(filename) || 'application/octet-stream';
                        return [2 /*return*/, { mimetype: mimetype, range: range, stats: stats, stream: stream }];
                }
            });
        }); };
        /**
         * This method must be called when the editor requests the parameters
         * (= content.json) of a piece of content, which is done with
         * GET /params/<contentId>
         * This route must be implemented for the editor to work.
         * @param contentId the content id of the piece of content; it is part of
         * the requests URL (see above)
         * @param user the user who is using the editor. It is the job of the
         * implementation to inject this object.
         * @returns an object which must be sent back in the response as JSON with
         * HTTP status code 200
         * @throws H5pErrors with HTTP status codes, which you must catch and then
         * send back in the response
         */
        this.getContentParameters = function (contentId, user) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!user) {
                    throw new Error('You must specify a user when calling getContentParameters(...).');
                }
                if (!contentId) {
                    throw new Error('You must specify a contentId when calling getContentParameters(...)');
                }
                return [2 /*return*/, this.h5pEditor.getContent(contentId, user)];
            });
        }); };
        /**
         * This method must be called when the user downloads a H5P package (the
         * .h5p file containing all libraries and content files). The route is
         * GET /download/<contentId>
         * @param contentId the id of the content object. It is part of the request
         * URL (see above).
         * @param user the user who wants to download the package. It is the job of
         * the implementation to inject this object.
         * @param outputWritable a Writable to which the file contents are piped.
         * @returns no return value; the result is directly piped to the Writable,
         * which is the Response object in Express, for instance. Note that you must
         * set the HTTP Header 'Content-disposition: attachment; filename=xyz.h5p'
         * in your response!
         * @throws H5pErrors with HTTP status codes, which you must catch and then
         * send back in the response
         */
        this.getDownload = function (contentId, user, outputWritable) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!user) {
                    throw new Error('You must specify a user when calling getDownload(...).');
                }
                if (!contentId) {
                    throw new Error('You must specify a contentId when calling getDownload(...)');
                }
                return [2 /*return*/, this.h5pEditor.exportContent(contentId, outputWritable, user)];
            });
        }); };
        /**
         * This method must be called when the client requests a library file with
         * GET /libraries/<uberName>/<filename>.
         *
         * Note: You can also use a static route to serve library files.
         *
         * @param ubername the ubername of the library (e.g. H5P.Example-1.0). This
         * is the first component of the path after /libraries/
         * @param filename the filename of the requested file, e.g. xyz.js. This is the
         * rest of the path after the uberName.
         * @returns all the values that must be send back with HTTP status code 200.
         * You should send back:
         *   - status code 200
         *   - the mimetype
         *   - the file size (in stats)
         * @throws H5pErrors with HTTP status codes, which you must catch and then
         * send back in the response
         */
        this.getLibraryFile = function (ubername, filename) { return __awaiter(_this, void 0, void 0, function () {
            var library, _a, stats, stream, mimetype;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!filename) {
                            throw new Error('You must pass a file to getLibraryFile(...).');
                        }
                        library = LibraryName_1.default.fromUberName(ubername);
                        return [4 /*yield*/, Promise.all([
                                this.h5pEditor.libraryManager.getFileStats(library, filename),
                                this.h5pEditor.getLibraryFileStream(library, filename)
                            ])];
                    case 1:
                        _a = _b.sent(), stats = _a[0], stream = _a[1];
                        mimetype = (0, mime_types_1.lookup)(filename) || 'application/octet-stream';
                        return [2 /*return*/, { mimetype: mimetype, stream: stream, stats: stats }];
                }
            });
        }); };
        /**
         * The method must be called by the GET /temp-files/<filename> route.
         * As it is necessary for the method to know about a possible range start
         * and end, you need to pass in a callback function that returns the range
         * specified in the http request. The start and end of the range cannot be
         * passed to this method directly, as you need to know the file size to
         * calculate the correct range. That's why we use the callback.
         * @param filename the filename of the resource
         * @param user the user who is requesting the resource
         * @param getRangeCallback a function that can be called to retrieve the
         * start and end of a range; if the request doesn't specify a range, simply
         * return undefined; if you do not specify getRangeCallback, the method
         * will simply always use the whole file.
         * @returns mimetype: the mimetype of the file, the range (undefined if
         * unused), stats about the file and a readable. Do this with the response:
         * - Pipe back the readable as the response with status code 200.
         * - Set this HTTP header in the response: "Content-Type: <mimetype>"
         * - If range is undefined:
         *    - Return status code 200
         *    - Set this HTTP header in the response: 'Accept-Ranges': 'bytes'
         * - If range is defined:
         *    - Return status code 206
         *    - Set these HTTP headers in the response: 'Content-Length: <end - start + 1>'
         *                                              'Content-Range': `bytes <start-end>/<totalLength>`
         * **IMPORTANT:** You must subscribe to the error event of the readable and
         * send back a 404 status code if an error occurs. This is necessary as the
         * AWS S3 library doesn't throw proper 404 errors.
         * @throws H5pErrors with HTTP status codes, which you must catch and then
         * send back in the response
         */
        this.getTemporaryFile = function (filename, user, getRangeCallback) { return __awaiter(_this, void 0, void 0, function () {
            var stats, range, readable, mimetype;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!user) {
                            throw new Error('You must specify a user when calling getTemporaryFile(...).');
                        }
                        if (!filename) {
                            throw new Error('You must specify a filename when calling getContentParameters(...)');
                        }
                        return [4 /*yield*/, this.h5pEditor.temporaryFileManager.getFileStats(filename, user)];
                    case 1:
                        stats = _a.sent();
                        range = getRangeCallback
                            ? getRangeCallback(stats.size)
                            : undefined;
                        return [4 /*yield*/, this.h5pEditor.getContentFileStream(undefined, filename, user, range === null || range === void 0 ? void 0 : range.start, range === null || range === void 0 ? void 0 : range.end)];
                    case 2:
                        readable = _a.sent();
                        mimetype = (0, mime_types_1.lookup)(filename) || 'application/octet-stream';
                        return [2 /*return*/, { mimetype: mimetype, range: range, stats: stats, stream: readable }];
                }
            });
        }); };
        /**
         * Implements the POST /ajax route. Performs various actions. Don't be
         * confused by the fact that many of the requests dealt with here are not
         * really POST requests, but look more like GET requests. This is simply how
         * the H5P client works and we can't change it.
         * @param action This is the sub action that should be executed. It is part
         * of the query like this: POST /ajax?action=xyz Possible values:
         *   - libraries:       returns basic information about a list of libraries
         *   - translations:    returns translation data about a list of libraries
         *                      in a specific language
         *   - files:           uploads a resource file (image, video, ...) into
         *                      temporary storage
         *   - filter:          cleans the parameters passed to it to avoid XSS
         *                      attacks and schema violations (currently only
         *                      implemented as a stub)
         *   - library-install: downloads an installs content types from the H5P Hub
         *   - library-upload:  uploads a h5p package from the user's computer and
         *                      installs the libraries in it; returns the parameters
         *                      and metadata in it
         * @param body the parsed JSON content of the request body
         * @param language (needed for 'translations' and optionally possible for
         * 'libraries') the language code for which the translations should be
         * retrieved, e.g. 'en'. This paramter is part of the query URL, e.g. POST
         * /ajax?action=translations&language=en
         * @param user (needed for 'files', 'library-install' and 'get-content') the
         * user who is performing the action. It is the job of the implementation to
         * inject this object.
         * @param filesFile (needed for 'files') the file uploaded to the server;
         * this file is part of the HTTP request and has the name 'file'.
         * @param id (needed for 'library-install') the machine name of the library
         * to  install. The id is part of the query URL, e.g. POST
         * /ajax?action=library-install&id=H5P.Example
         * @param translate (needed for 'library-install' and 'library-upload') a
         * translation function used to localize messages
         * @param filesFile (needed for 'library-upload') the file uploaded to the
         * server; this file is part of the HTTP request and has the name 'h5p'.
         * @param hubId (need for 'get-content') the id of a content object on the
         * H5P Content Hub
         * @returns an object which must be sent back in the response as JSON with
         * HTTP status code 200
         * @throws H5pErrors with HTTP status codes, which you must catch and then
         * send back in the response
         */
        this.postAjax = function (action, body, language, user, filesFile, id, translate, libraryUploadFile, hubId) { return __awaiter(_this, void 0, void 0, function () {
            var updatedLibCount, installedLibCount, getLibraryResultText, _a, _b, field, unfiltered, filteredParams, filteredLibraryName, installedLibs, contentTypeCache, _c, installedLibraries, metadata, parameters, contentTypes, _d, installedLibraries2, metadata2, parameters2, contentTypes2;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        getLibraryResultText = function (installed, updated) {
                            return "".concat(installed
                                ? translate
                                    ? translate('installed-libraries', { count: installed })
                                    : "Installed ".concat(installed, " libraries.")
                                : '', " ").concat(updated
                                ? translate
                                    ? translate('updated-libraries', { count: updated })
                                    : "Updated ".concat(updated, " libraries.")
                                : '').trim();
                        };
                        _a = action;
                        switch (_a) {
                            case 'libraries': return [3 /*break*/, 1];
                            case 'translations': return [3 /*break*/, 2];
                            case 'files': return [3 /*break*/, 4];
                            case 'filter': return [3 /*break*/, 5];
                            case 'library-install': return [3 /*break*/, 7];
                            case 'library-upload': return [3 /*break*/, 10];
                            case 'get-content': return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 16];
                    case 1:
                        if (!('libraries' in body) || !Array.isArray(body.libraries)) {
                            throw new H5pError_1.default('malformed-request', {
                                error: 'the body of the request must contain an array of strings'
                            }, 400);
                        }
                        // getLibraryOverview validates the library list, so we don't do
                        // it here.
                        return [2 /*return*/, this.h5pEditor.getLibraryOverview(body.libraries, language)];
                    case 2:
                        if (!('libraries' in body) || !Array.isArray(body.libraries)) {
                            throw new H5pError_1.default('malformed-request', {
                                error: 'the body of the request must contain an array of strings'
                            }, 400);
                        }
                        _b = AjaxSuccessResponse_1.default.bind;
                        return [4 /*yield*/, this.h5pEditor.listLibraryLanguageFiles(body.libraries, language)];
                    case 3: 
                    // listLibraryLanguageFiles validates the parameters, so we
                    // don't do it here.
                    return [2 /*return*/, new (_b.apply(AjaxSuccessResponse_1.default, [void 0, _f.sent()]))()];
                    case 4:
                        if (!('field' in body)) {
                            throw new H5pError_1.default('malformed-request', {
                                error: "'field' property is missing in request body"
                            }, 400);
                        }
                        field = void 0;
                        try {
                            field = JSON.parse(body.field);
                        }
                        catch (e) {
                            throw new H5pError_1.default('malformed-request', {
                                error: "'field' property is malformed (must be in JSON)"
                            }, 400);
                        }
                        // saveContentFile only uses save properties of field, so we
                        // don't need to validate it here.
                        return [2 /*return*/, this.h5pEditor.saveContentFile(undefined, field, filesFile, user)];
                    case 5:
                        if (!('libraryParameters' in body)) {
                            throw new H5pError_1.default('malformed-request', {
                                error: 'libraryParameters is missing in request body'
                            }, 400);
                        }
                        unfiltered = void 0;
                        try {
                            unfiltered = JSON.parse(body.libraryParameters);
                        }
                        catch (_g) {
                            throw new H5pError_1.default('malformed-request', {
                                error: "'libraryParameters' property is malformed (must be in JSON)"
                            }, 400);
                        }
                        if (!(unfiltered === null || unfiltered === void 0 ? void 0 : unfiltered.library) ||
                            !(unfiltered === null || unfiltered === void 0 ? void 0 : unfiltered.params) ||
                            !(unfiltered === null || unfiltered === void 0 ? void 0 : unfiltered.metadata)) {
                            throw new H5pError_1.default('malformed-request', { error: 'Property missing in libraryParameters' }, 400);
                        }
                        filteredParams = unfiltered.params;
                        filteredLibraryName = LibraryName_1.default.fromUberName(unfiltered.library, { useWhitespace: true });
                        return [4 /*yield*/, this.semanticsEnforcer.enforceSemanticStructure(filteredParams, filteredLibraryName)];
                    case 6:
                        _f.sent();
                        // TODO: filter metadata, too
                        return [2 /*return*/, new AjaxSuccessResponse_1.default({
                                library: LibraryName_1.default.toUberName(filteredLibraryName, {
                                    useWhitespace: true
                                }),
                                metadata: unfiltered.metadata,
                                params: filteredParams
                            })];
                    case 7:
                        if (!id || !user) {
                            throw new H5pError_1.default('malformed-request', {
                                error: 'Request parameters incorrect: You need an id and a user.'
                            }, 400);
                        }
                        return [4 /*yield*/, this.h5pEditor.installLibraryFromHub(id, user)];
                    case 8:
                        installedLibs = _f.sent();
                        updatedLibCount = installedLibs.filter(function (l) { return l.type === 'patch'; }).length;
                        installedLibCount = installedLibs.filter(function (l) { return l.type === 'new'; }).length;
                        return [4 /*yield*/, this.h5pEditor.getContentTypeCache(user, language)];
                    case 9:
                        contentTypeCache = _f.sent();
                        return [2 /*return*/, new AjaxSuccessResponse_1.default(contentTypeCache, installedLibCount + updatedLibCount > 0
                                ? getLibraryResultText(installedLibCount, updatedLibCount)
                                : undefined)];
                    case 10:
                        if (!libraryUploadFile.name.endsWith('.h5p')) {
                            throw new H5pError_1.default('missing-h5p-extension', {}, 400);
                        }
                        return [4 /*yield*/, this.h5pEditor.uploadPackage(((_e = libraryUploadFile.data) === null || _e === void 0 ? void 0 : _e.length) > 0
                                ? libraryUploadFile.data
                                : libraryUploadFile.tempFilePath, user)];
                    case 11:
                        _c = _f.sent(), installedLibraries = _c.installedLibraries, metadata = _c.metadata, parameters = _c.parameters;
                        updatedLibCount = installedLibraries.filter(function (l) { return l.type === 'patch'; }).length;
                        installedLibCount = installedLibraries.filter(function (l) { return l.type === 'new'; }).length;
                        return [4 /*yield*/, this.h5pEditor.getContentTypeCache(user, language)];
                    case 12:
                        contentTypes = _f.sent();
                        return [2 /*return*/, new AjaxSuccessResponse_1.default({
                                content: parameters,
                                contentTypes: contentTypes,
                                h5p: metadata
                            }, installedLibCount + updatedLibCount > 0
                                ? getLibraryResultText(installedLibCount, updatedLibCount)
                                : undefined)];
                    case 13: return [4 /*yield*/, this.h5pEditor.getContentHubContent(hubId, user)];
                    case 14:
                        _d = _f.sent(), installedLibraries2 = _d.installedLibraries, metadata2 = _d.metadata, parameters2 = _d.parameters;
                        updatedLibCount = installedLibraries2.filter(function (l) { return l.type === 'patch'; }).length;
                        installedLibCount = installedLibraries2.filter(function (l) { return l.type === 'new'; }).length;
                        return [4 /*yield*/, this.h5pEditor.getContentTypeCache(user, language)];
                    case 15:
                        contentTypes2 = _f.sent();
                        return [2 /*return*/, new AjaxSuccessResponse_1.default({
                                content: parameters2,
                                contentTypes: contentTypes2,
                                h5p: metadata2
                            }, installedLibCount + updatedLibCount > 0
                                ? getLibraryResultText(installedLibCount, updatedLibCount)
                                : undefined)];
                    case 16: throw new H5pError_1.default('malformed-request', {
                        error: 'This action is not implemented in h5p-nodejs-library.'
                    }, 500);
                }
            });
        }); };
        this.semanticsEnforcer = new SemanticsEnforcer_1.default(h5pEditor.libraryManager);
    }
    return H5PAjaxEndpoint;
}());
exports.default = H5PAjaxEndpoint;
