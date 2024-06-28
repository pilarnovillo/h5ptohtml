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
var fsExtra = require("fs-extra");
var path = require("path");
var postcss_1 = require("postcss");
var postCssUrl = require("postcss-url");
var postCssImport = require("postcss-import");
var postCssClean = require("postcss-clean");
var mimetypes = require("mime-types");
var uglifyJs = require("uglify-js");
var postcss_safe_parser_1 = require("postcss-safe-parser");
var h5p_server_1 = require("@lumieducation/h5p-server");
var upath = require("upath");
var postCssRemoveRedundantFontUrls_1 = require("./helpers/postCssRemoveRedundantFontUrls");
var LibrariesFilesList_1 = require("./helpers/LibrariesFilesList");
var framedTemplate_1 = require("./framedTemplate");
var minimalTemplate_1 = require("./minimalTemplate");
/**
 * This script is used to change the default behavior of H5P when it gets
 * resources dynamically from JavaScript. This works in most cases, but there
 * are some libraries (the H5P.SoundJS library used by single choice set) that
 * can't be modified that way.
 */
var getLibraryFilePathOverrideScript = uglifyJs.minify(fsExtra.readFileSync(path.join(__dirname, 'loadFileOverrides.js'), {
    encoding: 'utf8'
})).code;
var getContentPathOverrideScript = uglifyJs.minify("H5P.getPath = function (path, contentId) {\n        return path;\n    };\n    ").code;
/**
 * Creates standalone HTML packages that can be used to display H5P in a browser
 * without having to use the full H5P server backend.
 *
 * The bundle includes all JavaScript files, stylesheets, fonts of the H5P core
 * and all libraries used in the content. It also includes base64 encoded
 * resources used in the content itself. This can make the files seriously big,
 * if the content includes video files or lots of high-res images.
 *
 * The bundle does NOT internalize resources that are included in the content
 * via absolute URLs but only resources that are part of the H5P package.
 *
 * The HTML exports work with all content types on the official H5P Hub, but
 * there might be unexpected issues with other content types if they behave
 * weirdly and in any kind of non-standard way.
 *
 * The exported bundle contains license information for each file put into the
 * bundle in a shortened fashion (only includes author and license name and not
 * full license text).
 *
 * (important!) You need to install these NPM packages for the exporter to work:
 * postcss, postcss-clean, postcss-url, postcss-safe-parser, uglify-js
 */
var HtmlExporter = /** @class */ (function () {
    /**
     * @param libraryStorage
     * @param contentStorage
     * @param config
     * @param coreFilePath the path on the local filesystem at which the H5P
     * core files can be found. (should contain a js and styles directory)
     * @param editorFilePath the path on the local filesystem at which the H5P
     * editor files can be found. (Should contain the scripts, styles and
     * ckeditor directories).
     */
    function HtmlExporter(libraryStorage, contentStorage, config, coreFilePath, editorFilePath, template, translationFunction) {
        var _this = this;
        this.libraryStorage = libraryStorage;
        this.contentStorage = contentStorage;
        this.config = config;
        this.coreFilePath = coreFilePath;
        this.editorFilePath = editorFilePath;
        this.template = template;
        this.defaultAdditionalScripts = [
            // The H5P core client creates paths to resource files using the
            // hostname of the current URL, so we have to make sure data: URLs
            // work.
            "const realH5PGetPath = H5P.getPath;\n        H5P.getPath = function (path, contentId) {\n            if(path.startsWith('data:')){\n                return path;\n            }\n            else {\n                return realH5PGetPath(path, contentId);\n            }\n        };"
        ];
        /**
         * Returns true if the filename is not an absolute URL or empty.
         * @param filename
         */
        this.isLocalPath = function (filename) {
            return !(filename === '' ||
                filename.toLocaleLowerCase().startsWith('http://') ||
                filename.toLocaleLowerCase().startsWith('https://'));
        };
        /**
         * Creates HTML strings out of player models.
         * @param model the player model created by H5PPlayer
         * @returns a string with HTML markup
         */
        this.renderer = function (mode, options) {
            return function (model) { return __awaiter(_this, void 0, void 0, function () {
                var usedFiles, _a, scriptsBundle, stylesBundle, unusedFiles, contentFiles, template, html;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (mode.core === 'files') {
                                throw new Error('Core mode "files" not supported yet.');
                            }
                            if (mode.libraries === 'files') {
                                throw new Error('Library mode "files" not supported yet.');
                            }
                            usedFiles = new LibrariesFilesList_1.default();
                            return [4 /*yield*/, Promise.all([
                                    this.getScriptBundle(model, usedFiles, this.defaultAdditionalScripts),
                                    this.getStylesBundle(model, usedFiles),
                                    (mode === null || mode === void 0 ? void 0 : mode.contentResources) === 'inline'
                                        ? this.internalizeContentResources(model)
                                        : undefined
                                ])];
                        case 1:
                            _a = _d.sent(), scriptsBundle = _a[0], stylesBundle = _a[1];
                            return [4 /*yield*/, this.getUnusedLibraryFiles(model.dependencies, usedFiles)];
                        case 2:
                            unusedFiles = _d.sent();
                            // If there are files in the directory of a library that haven't been
                            // included in the bundle yet, we add those as base64 encoded variables
                            // and rewire H5P.ContentType.getLibraryFilePath to return these files
                            // as data urls. (needed for resource files of H5P.BranchingScenario)
                            if (Object.keys(unusedFiles).length) {
                                scriptsBundle = scriptsBundle.concat(" var furtherH5PInlineResources=".concat(JSON.stringify(unusedFiles), ";"), getLibraryFilePathOverrideScript);
                            }
                            if (!(mode.contentResources === 'files')) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.findAndPrefixContentResources(model, options === null || options === void 0 ? void 0 : options.contentResourcesPrefix)];
                        case 3:
                            contentFiles = _d.sent();
                            _d.label = 4;
                        case 4:
                            if (this.template) {
                                // Caller has overriden the template
                                template = this.template;
                            }
                            else {
                                if (((_c = (_b = model.integration.contents["cid-".concat(model.contentId)]) === null || _b === void 0 ? void 0 : _b.displayOptions) === null || _c === void 0 ? void 0 : _c.frame) === true) {
                                    // display the standard H5P frame around the content
                                    template = framedTemplate_1.default;
                                }
                                else {
                                    // nothing around the content
                                    template = minimalTemplate_1.default;
                                }
                            }
                            html = template(__assign(__assign({}, model.integration), { baseUrl: '.', url: '.', ajax: { setFinished: '', contentUserData: '' }, saveFreq: false, libraryUrl: '' }), scriptsBundle, stylesBundle, model.contentId);
                            return [2 /*return*/, { html: html, contentFiles: contentFiles }];
                    }
                });
            }); };
        };
        /**
         * A factory method that returns functions that can be passed to the url
         * option of postcss-url. The function returns the base64 encoded resource.
         * @param filename the filename of the css file being internalized
         * @param library the library name if the css file is a library file
         * @param editor true if the css file is a editor file
         * @param core true if the css file is a core file
         * @param asset the object received from the postcss-url plugin call
         */
        this.urlInternalizer = function (filename, library, editor, core, usedFiles) {
            return function (asset) { return __awaiter(_this, void 0, void 0, function () {
                var mimetype, p, _a, _b, _c, _d, basePath, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            // If a url already is internalized we simply return it
                            if (asset.url.startsWith('data:') && asset.url.includes('base64')) {
                                return [2 /*return*/, asset.url];
                            }
                            mimetype = mimetypes.lookup(path.extname(asset.relativePath));
                            if (!library) return [3 /*break*/, 5];
                            p = upath.join(path.dirname(filename), asset.relativePath);
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 4, , 5]);
                            usedFiles.addFile(library, p);
                            console.log("Test4");
                            _b = (_a = "data:".concat(mimetype, ";base64,")).concat;
                            _c = h5p_server_1.streamToString;
                            return [4 /*yield*/, this.libraryStorage.getFileStream(library, p)];
                        case 2: return [4 /*yield*/, _c.apply(void 0, [_g.sent(), 'base64'])];
                        case 3: return [2 /*return*/, _b.apply(_a, [_g.sent()])];
                        case 4:
                            _d = _g.sent();
                            // There are edge cases in which there are non-existent files in
                            // stylesheets as placeholders (H5P.BranchingScenario), so we
                            // have to leave them in.
                            return [2 /*return*/, asset.relativePath];
                        case 5:
                            if (!(editor || core)) return [3 /*break*/, 7];
                            basePath = editor
                                ? path.join(this.editorFilePath, 'styles')
                                : path.join(this.coreFilePath, 'styles');
                            _f = (_e = "data:".concat(mimetype, ";base64,")).concat;
                            return [4 /*yield*/, fsExtra.readFile(path.resolve(basePath, asset.relativePath), 'base64')];
                        case 6: return [2 /*return*/, _f.apply(_e, [_g.sent()])];
                        case 7: return [2 /*return*/, undefined];
                    }
                });
            }); };
        };
        this.player = new h5p_server_1.H5PPlayer(this.libraryStorage, this.contentStorage, this.config, undefined, undefined, translationFunction);
        this.coreSuffix = "".concat(this.config.baseUrl + this.config.coreUrl, "/");
        this.editorSuffix = "".concat(this.config.baseUrl + this.config.editorLibraryUrl, "/");
        this.contentFileScanner = new h5p_server_1.ContentFileScanner(new h5p_server_1.LibraryManager(this.libraryStorage));
    }
    /**
     * Creates a HTML file that contains **all** scripts, styles and library
     * resources (images and fonts) inline. All resources used inside the
     * content are only listed and must be retrieved from library storage by the
     * caller.
     * @param contentId a content id that can be found in the content repository
     * passed into the constructor
     * @param user the user who wants to create the bundle
     * @param contentResourcesPrefix (optional) if set, the prefix will be added
     * to all content files in the content's parameters; example:
     * contentResourcesPrefix = '123'; filename = 'images/image.jpg' => filename
     * in parameters: '123/images/image.jpg' (the directory separated is added
     * automatically)
     * @param options (optional) allows settings display options, e.g. if there
     * should be a embed button
     * @throws H5PError if there are access violations, missing files etc.
     * @returns a HTML string that can be written into a file and a list of
     * content files used by the content; you can use the filenames in
     * IContentStorage.getFileStream. Note that the returned filenames DO NOT
     * include the prefix, so that the caller doesn't have to remove it when
     * calling getFileStream.
     */
    HtmlExporter.prototype.createBundleWithExternalContentResources = function (contentId_1, user_1) {
        return __awaiter(this, arguments, void 0, function (contentId, user, contentResourcesPrefix, options) {
            var _a;
            if (contentResourcesPrefix === void 0) { contentResourcesPrefix = ''; }
            return __generator(this, function (_b) {
                this.player.setRenderer(this.renderer({
                    contentResources: 'files',
                    core: 'inline',
                    libraries: 'inline'
                }, {
                    contentResourcesPrefix: contentResourcesPrefix
                }));
                return [2 /*return*/, this.player.render(contentId, user, (_a = options === null || options === void 0 ? void 0 : options.language) !== null && _a !== void 0 ? _a : 'en', {
                        showEmbedButton: options === null || options === void 0 ? void 0 : options.showEmbedButton,
                        showFrame: (options === null || options === void 0 ? void 0 : options.showEmbedButton) || (options === null || options === void 0 ? void 0 : options.showLicenseButton)
                            ? true
                            : options === null || options === void 0 ? void 0 : options.showFrame,
                        showLicenseButton: options === null || options === void 0 ? void 0 : options.showLicenseButton
                    })];
            });
        });
    };
    /**
     * Creates a single HTML file that contains **all** scripts, styles and
     * resources (images, videos, etc.) inline. This bundle will grow very large
     * if there are big videos in the content.
     * @param contentId a content id that can be found in the content repository
     * passed into the constructor
     * @param user the user who wants to create the bundle
     * @param options (optional) allows settings display options, e.g. if there
     * should be a embed button
     * @throws H5PError if there are access violations, missing files etc.
     * @returns a HTML string that can be written into a file
     */
    HtmlExporter.prototype.createSingleBundle = function (contentId, user, options) {
        return __awaiter(this, void 0, void 0, function () {
            var htmlCode;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.player.setRenderer(this.renderer({
                            contentResources: 'inline',
                            core: 'inline',
                            libraries: 'inline'
                        }));
                        console.log("HERE 3");
                        console.log("contentId: " + contentId.toString());
                        return [4 /*yield*/, this.player.render(contentId.toString(), user, (_a = options === null || options === void 0 ? void 0 : options.language) !== null && _a !== void 0 ? _a : 'en', {
                                showEmbedButton: options === null || options === void 0 ? void 0 : options.showEmbedButton,
                                showFrame: (options === null || options === void 0 ? void 0 : options.showEmbedButton) || (options === null || options === void 0 ? void 0 : options.showLicenseButton)
                                    ? true
                                    : options === null || options === void 0 ? void 0 : options.showFrame,
                                showLicenseButton: options === null || options === void 0 ? void 0 : options.showLicenseButton
                            })];
                    case 1:
                        htmlCode = _b.sent();
                        console.log("HERE 4");
                        // console.log(htmlCode);
                        return [2 /*return*/, htmlCode.html];
                }
            });
        });
    };
    /**
     * Finds all files in the content's parameters and returns them. Also
     * appends the prefix if necessary. Note: This method has a mutating effect
     * on model!
     * @param model
     * @param prefix this prefix will be added to all file references as
     * subdirectory
     */
    HtmlExporter.prototype.findAndPrefixContentResources = function (model_1) {
        return __awaiter(this, arguments, void 0, function (model, prefix) {
            var content, params, mainLibraryUbername, fileRefs;
            var _this = this;
            if (prefix === void 0) { prefix = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        content = model.integration.contents["cid-".concat(model.contentId)];
                        params = JSON.parse(content.jsonContent);
                        mainLibraryUbername = content.library;
                        console.log("PASSED HERE10");
                        return [4 /*yield*/, this.contentFileScanner.scanForFiles(params, h5p_server_1.LibraryName.fromUberName(mainLibraryUbername, {
                                useWhitespace: true
                            }))];
                    case 1:
                        fileRefs = (_a.sent()).filter(function (ref) { return _this.isLocalPath(ref.filePath); });
                        fileRefs.forEach(function (ref) {
                            console.log("upath.join(prefix, ref.filePath): " + upath.join(prefix, ref.filePath));
                            ref.context.params.path = upath.join(prefix, ref.filePath);
                        });
                        model.integration.contents["cid-".concat(model.contentId)].jsonContent =
                            JSON.stringify(params);
                        return [2 /*return*/, fileRefs.map(function (ref) { return ref.filePath; })];
                }
            });
        });
    };
    /**
     * Generates JavaScript / CSS comments that includes license information
     * about a file. Includes: filename, author, license. Note that some H5P
     * libraries don't contain any license information.
     * @param filename
     * @param core
     * @param editor
     * @param library
     * @returns a multi-line comment with the license information. The comment
     * is marked as important and includes @license so that uglify-js and
     * postcss-clean leave it in.
     */
    HtmlExporter.prototype.generateLicenseText = function (filename, core, editor, library) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, author, license;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (core) {
                            return [2 /*return*/, "/*!@license ".concat(filename, " by Joubel and other contributors, licensed under GNU GENERAL PUBLIC LICENSE Version 3*/")];
                        }
                        if (editor) {
                            return [2 /*return*/, "/*!@license ".concat(filename, " by Joubel and other contributors, licensed under MIT license*/")];
                        }
                        if (!library) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.libraryStorage.getLibrary(library)];
                    case 1:
                        _a = _b.sent(), author = _a.author, license = _a.license;
                        if (!author || author === '') {
                            author = 'unknown';
                        }
                        if (!license || license === '') {
                            license = 'unknown license';
                        }
                        return [2 /*return*/, "/*!@license ".concat(h5p_server_1.LibraryName.toUberName(library), "/").concat(filename, " by ").concat(author, " licensed under ").concat(license, "*/")];
                    case 2: return [2 /*return*/, ''];
                }
            });
        });
    };
    /**
     * Gets the contents of a file as a string. Only works for text files, not
     * binary files.
     * @param filename the filename as generated by H5PPlayer. This can be a
     * path to a) a core file b) an editor file c) a library file
     * @returns an object giving more detailed information about the file:
     * - core: true if the file is a core file, undefined otherwise
     * - editor: true if the file is an editor file, undefined otherwise
     * - library: the library name if the file is a library file, undefined
     *   otherwise
     * - filename: the filename if the suffix of the core/editor/library is
     *   stripped
     * - text: the text in the file
     */
    HtmlExporter.prototype.getFileAsText = function (filename, usedFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var libraryFileMatch, filenameWithoutDir, filenameWithoutDir, library, filenameWithoutDir, _a;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        libraryFileMatch = new RegExp("^".concat(this.config.baseUrl).concat(this.config.librariesUrl, "/([\\w\\.]+)-(\\d+)\\.(\\d+)\\/(.+)$")).exec(filename);
                        if (!!libraryFileMatch) return [3 /*break*/, 5];
                        if (!filename.startsWith(this.coreSuffix)) return [3 /*break*/, 2];
                        filenameWithoutDir = this.removeQueryString(filename.substr(this.coreSuffix.length));
                        _b = {};
                        return [4 /*yield*/, fsExtra.readFile(path.resolve(this.coreFilePath, filenameWithoutDir))];
                    case 1: return [2 /*return*/, (_b.text = (_e.sent()).toString(),
                            _b.core = true,
                            _b.filename = filenameWithoutDir,
                            _b)];
                    case 2:
                        if (!filename.startsWith(this.editorSuffix)) return [3 /*break*/, 4];
                        filenameWithoutDir = this.removeQueryString(filename.substr(this.editorSuffix.length));
                        _c = {};
                        return [4 /*yield*/, fsExtra.readFile(path.resolve(this.editorFilePath, filenameWithoutDir))];
                    case 3: return [2 /*return*/, (_c.text = (_e.sent()).toString(),
                            _c.editor = true,
                            _c.filename = filenameWithoutDir,
                            _c)];
                    case 4: return [3 /*break*/, 8];
                    case 5:
                        library = {
                            machineName: libraryFileMatch[1],
                            majorVersion: Number.parseInt(libraryFileMatch[2], 10),
                            minorVersion: Number.parseInt(libraryFileMatch[3], 10)
                        };
                        filenameWithoutDir = this.removeQueryString(libraryFileMatch[4]);
                        usedFiles.addFile(library, filenameWithoutDir);
                        console.log("Test1");
                        _d = {};
                        _a = h5p_server_1.streamToString;
                        return [4 /*yield*/, this.libraryStorage.getFileStream(library, filenameWithoutDir)];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_e.sent()])];
                    case 7: return [2 /*return*/, (_d.text = _e.sent(),
                            _d.library = library,
                            _d.filename = filenameWithoutDir,
                            _d)];
                    case 8: throw Error("Unknown file pattern: ".concat(filename, " is neither a library file, a core file or an editor file."));
                }
            });
        });
    };
    /**
     * Creates a big minified bundle of all script files in the model
     * @param model
     * @param additionalScripts an array of scripts (actual script code as
     * string, not filenames!) that should be appended at the end of the bundle
     * @returns all scripts in a single bundle
     */
    HtmlExporter.prototype.getScriptBundle = function (model_1, usedFiles_1) {
        return __awaiter(this, arguments, void 0, function (model, usedFiles, additionalScripts) {
            var texts, scripts;
            var _this = this;
            if (additionalScripts === void 0) { additionalScripts = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        texts = {};
                        return [4 /*yield*/, Promise.all(model.scripts.map(function (script) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, text, filename, core, editor, library, licenseText;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this.getFileAsText(script, usedFiles)];
                                        case 1:
                                            _a = _b.sent(), text = _a.text, filename = _a.filename, core = _a.core, editor = _a.editor, library = _a.library;
                                            return [4 /*yield*/, this.generateLicenseText(filename, core, editor, library)];
                                        case 2:
                                            licenseText = _b.sent();
                                            // We must escape </script> tags inside scripts.
                                            texts[script] =
                                                licenseText + text.replace(/<\/script>/g, '<\\/script>');
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        scripts = model.scripts
                            .map(function (script) { return texts[script]; })
                            .concat(additionalScripts);
                        return [2 /*return*/, uglifyJs.minify(scripts, { output: { comments: 'some' } }).code];
                }
            });
        });
    };
    /**
     * Creates a big minified bundle of all style files in the model. Also
     * internalizes all url(...) resources in the styles.
     * @param model
     * @returns all styles in a single bundle
     */
    HtmlExporter.prototype.getStylesBundle = function (model, usedFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var styleTexts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        styleTexts = {};
                        return [4 /*yield*/, Promise.all(model.styles.map(function (style) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, text, filename, library, editor, core, licenseText, processedCss, pCss, oldCwd, error_1;
                                var _this = this;
                                var _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0: return [4 /*yield*/, this.getFileAsText(style, usedFiles)];
                                        case 1:
                                            _a = _d.sent(), text = _a.text, filename = _a.filename, library = _a.library, editor = _a.editor, core = _a.core;
                                            return [4 /*yield*/, this.generateLicenseText(filename, core, editor, library)];
                                        case 2:
                                            licenseText = _d.sent();
                                            processedCss = '';
                                            pCss = (0, postcss_1.default)(
                                            // add support for @import statements in CSS
                                            postCssImport({
                                                resolve: function (importedFile) {
                                                    // Here, we need to return the path of the file that
                                                    // is passed to `load`. As we use our own
                                                    // `getFileAsText` in `load`, we need to add the
                                                    // directory of the file that is importing. That way
                                                    // we preserve the origin of the file (core, editor,
                                                    // library).
                                                    return upath.join(path.dirname(style), importedFile);
                                                },
                                                load: function (importedFile) { return __awaiter(_this, void 0, void 0, function () {
                                                    var txt;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, this.getFileAsText(importedFile, usedFiles)];
                                                            case 1:
                                                                txt = (_a.sent()).text;
                                                                return [2 /*return*/, txt];
                                                        }
                                                    });
                                                }); },
                                                plugins: [
                                                    // We need to add the plugins redundantly, as the
                                                    // files inside the imported css files also need to
                                                    // be parsed.
                                                    (0, postCssRemoveRedundantFontUrls_1.default)(undefined, library
                                                        ? function (f) {
                                                            usedFiles.addFile(library, upath.join(path.dirname(filename), f));
                                                        }
                                                        : undefined),
                                                    postCssUrl({
                                                        url: this.urlInternalizer(
                                                        // Even though we don't operate on the file
                                                        // but on a file that is imported, we pass
                                                        // in the filename here, as it's only used
                                                        // to determine the file's parent directory.
                                                        filename, library, editor, core, usedFiles)
                                                    }),
                                                    postCssClean()
                                                ]
                                            }), (0, postCssRemoveRedundantFontUrls_1.default)(undefined, library
                                                ? function (f) {
                                                    usedFiles.addFile(library, upath.join(path.dirname(filename), f));
                                                }
                                                : undefined), postCssUrl({
                                                url: this.urlInternalizer(filename, library, editor, core, usedFiles)
                                            }), postCssClean());
                                            _d.label = 3;
                                        case 3:
                                            _d.trys.push([3, , 11, 12]);
                                            // This is a workaround for a bug in path.relative in
                                            // Windows. If the current working directory includes the
                                            // Turkish İ character, the resulting relative path is
                                            // broken. We work around this by temporarily changing the
                                            // working directory to the root. See
                                            // https://github.com/Lumieducation/H5P-Nodejs-library/issues/1679#issuecomment-909344236
                                            if (process.platform === 'win32') {
                                                oldCwd = process.cwd();
                                                process.chdir('c:');
                                            }
                                            _d.label = 4;
                                        case 4:
                                            _d.trys.push([4, 6, , 10]);
                                            return [4 /*yield*/, pCss.process(licenseText + text, {
                                                    from: filename
                                                })];
                                        case 5:
                                            processedCss = (_b = (_d.sent())) === null || _b === void 0 ? void 0 : _b.css;
                                            return [3 /*break*/, 10];
                                        case 6:
                                            error_1 = _d.sent();
                                            if (!(error_1 instanceof postcss_1.CssSyntaxError)) return [3 /*break*/, 8];
                                            return [4 /*yield*/, pCss.process(licenseText + text, {
                                                    parser: postcss_safe_parser_1.default,
                                                    from: filename
                                                })];
                                        case 7:
                                            processedCss = (_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.css;
                                            return [3 /*break*/, 9];
                                        case 8: throw error_1;
                                        case 9: return [3 /*break*/, 10];
                                        case 10: return [3 /*break*/, 12];
                                        case 11:
                                            // Part of the workaround explained above.
                                            if (process.platform === 'win32' && oldCwd) {
                                                process.chdir(oldCwd);
                                            }
                                            return [7 /*endfinally*/];
                                        case 12:
                                            styleTexts[style] = processedCss;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, model.styles.map(function (style) { return styleTexts[style]; }).join('\n')];
                }
            });
        });
    };
    /**
     * Gets base64 encoded contents of library files that have not been used in
     * the bundle so far. Ignores files that are only used by the editor.
     * @param libraries the libraries for which to get files
     * @returns an object with the filenames of files as keys and base64 strings
     * as values
     */
    HtmlExporter.prototype.getUnusedLibraryFiles = function (libraries, usedFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        return [4 /*yield*/, Promise.all(libraries.map(function (library) { return __awaiter(_this, void 0, void 0, function () {
                                var ubername, allLibraryFiles, unusedLibraryFiles;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            ubername = h5p_server_1.LibraryName.toUberName(library);
                                            return [4 /*yield*/, this.libraryStorage.listFiles(library)];
                                        case 1:
                                            allLibraryFiles = _a.sent();
                                            unusedLibraryFiles = allLibraryFiles.filter(function (filename) {
                                                if (!usedFiles.checkFile(library, filename) &&
                                                    !filename.startsWith('language/') &&
                                                    (filename !== 'library.json' ||
                                                        // We allow the library.json file for timeline
                                                        // as it's needed at runtime.
                                                        ubername.startsWith('H5P.Timeline-')) &&
                                                    filename !== 'semantics.json' &&
                                                    filename !== 'icon.svg' &&
                                                    filename !== 'upgrades.js' &&
                                                    filename !== 'presave.js') {
                                                    var mt = mimetypes.lookup(path.basename(filename));
                                                    if (filename.endsWith('.js') ||
                                                        filename.endsWith('.css') ||
                                                        filename.endsWith('.json') ||
                                                        (mt &&
                                                            (mt.startsWith('audio/') ||
                                                                mt.startsWith('video/') ||
                                                                mt.startsWith('image/')) &&
                                                            !filename.includes('font'))) {
                                                        return true;
                                                    }
                                                }
                                                return false;
                                            });
                                            console.log("Test2");
                                            return [4 /*yield*/, Promise.all(unusedLibraryFiles.map(function (unusedFile) { return __awaiter(_this, void 0, void 0, function () {
                                                    var _a, _b, _c, _d, _e;
                                                    return __generator(this, function (_f) {
                                                        switch (_f.label) {
                                                            case 0:
                                                                _a = result;
                                                                _b = "".concat(ubername, "/").concat(unusedFile);
                                                                _d = (_c = "data:".concat(mimetypes.lookup(path.basename(unusedFile)), ";base64,")).concat;
                                                                _e = h5p_server_1.streamToString;
                                                                return [4 /*yield*/, this.libraryStorage.getFileStream(library, unusedFile)];
                                                            case 1: return [4 /*yield*/, _e.apply(void 0, [_f.sent(), 'base64'])];
                                                            case 2:
                                                                _a[_b] = _d.apply(_c, [_f.sent()]);
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }))];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Changes the content params by internalizing all files references with
     * base64 data strings. Has a side effect on contents[cid-xxx]!
     * @param model
     */
    HtmlExporter.prototype.internalizeContentResources = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var content, params, mainLibraryUbername, contentFiles;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        content = model.integration.contents["cid-".concat(model.contentId)];
                        params = JSON.parse(content.jsonContent);
                        mainLibraryUbername = content.library;
                        console.log("mainLibraryUbername: " + mainLibraryUbername);
                        console.log("PASSED HERE11");
                        return [4 /*yield*/, this.contentFileScanner.scanForFiles(params, h5p_server_1.LibraryName.fromUberName(mainLibraryUbername, {
                                useWhitespace: true
                            }))];
                    case 1:
                        contentFiles = _a.sent();
                        return [4 /*yield*/, Promise.all(contentFiles.map(function (fileRef) { return __awaiter(_this, void 0, void 0, function () {
                                var base64, _a, mimetype, error_2;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!this.isLocalPath(fileRef.filePath)) return [3 /*break*/, 5];
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 4, , 5]);
                                            console.log("Test3");
                                            _a = h5p_server_1.streamToString;
                                            return [4 /*yield*/, this.contentStorage.getFileStream(model.contentId, fileRef.filePath, model.user)];
                                        case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent(), 'base64'])];
                                        case 3:
                                            base64 = _b.sent();
                                            mimetype = fileRef.mimeType ||
                                                mimetypes.lookup(path.extname(fileRef.filePath));
                                            fileRef.context.params.path = "data:".concat(mimetype, ";base64,").concat(base64);
                                            return [3 /*break*/, 5];
                                        case 4:
                                            error_2 = _b.sent();
                                            return [3 /*break*/, 5];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        content.jsonContent = JSON.stringify(params);
                        content.contentUrl = '.';
                        content.url = '.';
                        return [2 /*return*/];
                }
            });
        });
    };
    HtmlExporter.prototype.removeQueryString = function (filename) {
        var questionMarkIndex = filename.indexOf('?');
        if (questionMarkIndex >= 0) {
            return filename.substring(0, questionMarkIndex);
        }
        return filename;
    };
    return HtmlExporter;
}());
exports.default = HtmlExporter;
