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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var LibraryName_1 = require("./LibraryName");
var UrlGenerator_1 = require("./UrlGenerator");
var Logger_1 = require("./helpers/Logger");
var ContentMetadata_1 = require("./ContentMetadata");
var player_1 = require("./renderers/player");
var H5pError_1 = require("./helpers/H5pError");
var LibraryManager_1 = require("./LibraryManager");
var SemanticsLocalizer_1 = require("./SemanticsLocalizer");
var SimpleTranslator_1 = require("./helpers/SimpleTranslator");
var ContentUserDataManager_1 = require("./ContentUserDataManager");
var ContentManager_1 = require("./ContentManager");
var LaissezFairePermissionSystem_1 = require("./implementation/LaissezFairePermissionSystem");
var log = new Logger_1.default('Player');
var englishClientStringsPath = path.resolve(__dirname, '../assets/translations/client/en.json');
var englishClientStringsContent = fs.readFileSync(englishClientStringsPath, 'utf8');
var englishClientStringsJson = JSON.parse(englishClientStringsContent);
var H5PPlayer = /** @class */ (function () {
    /**
     *
     * @param libraryStorage the storage for libraries (can be read only)
     * @param contentStorage the storage for content (can be read only)
     * @param config the configuration object
     * @param integrationObjectDefaults (optional) the default values to use for
     * the integration object
     * @param urlGenerator creates url strings for files, can be used to
     * customize the paths in an implementation application
     * @param translationCallback a function that is called to retrieve
     * translations of keys in a certain language; the keys use the i18next
     * format (e.g. namespace:key). See the ITranslationFunction documentation
     * for more details.
     * @param options more options to customize the behavior of the player; see
     * IH5PPlayerOptions documentation for more details
     */
    function H5PPlayer(libraryStorage, contentStorage, config, integrationObjectDefaults, urlGenerator, translationCallback, options, contentUserDataStorage) {
        if (urlGenerator === void 0) { urlGenerator = new UrlGenerator_1.default(config); }
        if (translationCallback === void 0) { translationCallback = new SimpleTranslator_1.default({
            // We use a simplistic translation function that is hard-wired to
            // English if the implementation does not pass us a proper one.
            client: englishClientStringsJson //englishClientStrings
        }).t; }
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        this.libraryStorage = libraryStorage;
        this.contentStorage = contentStorage;
        this.config = config;
        this.integrationObjectDefaults = integrationObjectDefaults;
        this.urlGenerator = urlGenerator;
        this.options = options;
        this.globalCustomScripts = [];
        this.globalCustomStyles = [];
        log.info('initialize');
        this.renderer = player_1.default;
        this.libraryManager = new LibraryManager_1.default(libraryStorage, urlGenerator.libraryFile, undefined, undefined, undefined, (_a = this.options) === null || _a === void 0 ? void 0 : _a.lockProvider, this.config);
        var permissionSystem = (_b = options === null || options === void 0 ? void 0 : options.permissionSystem) !== null && _b !== void 0 ? _b : new LaissezFairePermissionSystem_1.LaissezFairePermissionSystem();
        this.contentUserDataManager = new ContentUserDataManager_1.default(contentUserDataStorage, permissionSystem);
        this.contentManager = new ContentManager_1.default(contentStorage, permissionSystem, contentUserDataStorage);
        this.globalCustomScripts =
            ((_e = (_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.customization) === null || _d === void 0 ? void 0 : _d.global) === null || _e === void 0 ? void 0 : _e.scripts) || [];
        if ((_h = (_g = (_f = this.config.customization) === null || _f === void 0 ? void 0 : _f.global) === null || _g === void 0 ? void 0 : _g.player) === null || _h === void 0 ? void 0 : _h.scripts) {
            this.globalCustomScripts = this.globalCustomScripts.concat(this.config.customization.global.player.scripts);
        }
        this.globalCustomStyles =
            ((_l = (_k = (_j = this.options) === null || _j === void 0 ? void 0 : _j.customization) === null || _k === void 0 ? void 0 : _k.global) === null || _l === void 0 ? void 0 : _l.styles) || [];
        if ((_p = (_o = (_m = this.config.customization) === null || _m === void 0 ? void 0 : _m.global) === null || _o === void 0 ? void 0 : _o.player) === null || _p === void 0 ? void 0 : _p.styles) {
            this.globalCustomStyles = this.globalCustomStyles.concat(this.config.customization.global.player.styles);
        }
        this.semanticsLocalizer = new SemanticsLocalizer_1.default(translationCallback);
    }
    /**
     * Creates a frame for displaying H5P content. You can customize this frame
     * by calling setRenderer(...). It normally is enough to call this method
     * with the content id. Only call it with parameters and metadata if don't
     * want to use the IContentStorage object passed into the constructor.
     * @param contentId the content id
     * @param actingUser the user who wants to access the content
     * @param options.ignoreUserPermission (optional) If set to true, the user
     * object won't be passed to the storage classes for permission checks. You
     * can use this option if you have already checked the user's permission in
     * a different layer.
     * @param options.parametersOverride (optional) the parameters of a piece of
     * content (=content.json); if you use this option, the parameters won't be
     * loaded from storage
     * @param options.metadataOverride (optional) the metadata of a piece of
     * content (=h5p.json); if you use this option, the parameters won't be
     * loaded from storage
     * @param options.contextId (optional) allows implementations to have
     * multiple content states for a single content object and user tuple
     * @param options.asUserId (optional) allows you to impersonate another
     * user. You will see their user state instead of yours.
     * @param options.readOnlyState (optional) allows you to disable saving of
        the user state. You will still see the state, but changes won't be
        persisted. This is useful if you want to review other users' states by
        setting `asUserId` and don't want to change their state. Note that the
        H5P doesn't support this behavior and we use a workaround to implement
        it. The workaround includes setting the query parameter `ignorePost=yes`
        in the URL of the content state Ajax call. The h5p-express adapter
        ignores posts that have this query parameter. You should, however, still
        prevent malicious users from writing other users' states in the
        permission system!
     * @returns a HTML string that you can insert into your page
     */
    H5PPlayer.prototype.render = function (h5pFilePath_1, actingUser_1) {
        return __awaiter(this, arguments, void 0, function (h5pFilePath, actingUser, language, options) {
            var tempDir, parameters, metadata, contentJsonPath, metadataJsonPath, error_1, installedAddons, dependencies, _a, _b, _c, _d, _e, _f, _g, libraries, assets, mainLibrarySupportsFullscreen, model, html;
            var _h;
            var _j, _k, _l, _m, _o, _p, _q;
            if (language === void 0) { language = 'en'; }
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        log.debug("rendering page for file ".concat(h5pFilePath, " in language ").concat(language));
                        if (options === null || options === void 0 ? void 0 : options.asUserId) {
                            log.debug("Personifying ".concat(options.asUserId));
                        }
                        tempDir = h5pFilePath;
                        return [4 /*yield*/, fs.ensureDir(tempDir)];
                    case 1:
                        _r.sent();
                        console.log("tempDir: " + tempDir);
                        _r.label = 2;
                    case 2:
                        _r.trys.push([2, 9, , 10]);
                        if (!!(options === null || options === void 0 ? void 0 : options.parametersOverride)) return [3 /*break*/, 4];
                        console.log("path.join(tempDir, 'content', 'content.json'): " + path.join(tempDir, 'content', 'content.json'));
                        contentJsonPath = path.join(tempDir, 'content', 'content.json');
                        return [4 /*yield*/, fs.readJson(contentJsonPath)];
                    case 3:
                        parameters = _r.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        parameters = options.parametersOverride;
                        _r.label = 5;
                    case 5:
                        if (!!(options === null || options === void 0 ? void 0 : options.metadataOverride)) return [3 /*break*/, 7];
                        metadataJsonPath = path.join(tempDir, 'h5p.json');
                        return [4 /*yield*/, fs.readJson(metadataJsonPath)];
                    case 6:
                        metadata = _r.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        metadata = options.metadataOverride;
                        _r.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _r.sent();
                        console.log(error_1);
                        throw new H5pError_1.default('h5p-player:content-missing1', {}, 404);
                    case 10:
                        log.debug('Getting list of installed addons.');
                        installedAddons = [];
                        if (!((_j = this.libraryStorage) === null || _j === void 0 ? void 0 : _j.listAddons)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.libraryStorage.listAddons()];
                    case 11:
                        installedAddons = _r.sent();
                        _r.label = 12;
                    case 12:
                        _b = (_a = Array).from;
                        _c = Set.bind;
                        _f = (_e = (metadata.preloadedDependencies || []))
                            .concat;
                        return [4 /*yield*/, this.getAddonsByParameters(parameters, installedAddons)];
                    case 13:
                        _g = (_d = _f.apply(_e, [_r.sent()]))
                            .concat;
                        return [4 /*yield*/, this.getAddonsByLibrary(metadata.mainLibrary, installedAddons)];
                    case 14:
                        dependencies = _b.apply(_a, [new (_c.apply(Set, [void 0, _g.apply(_d, [_r.sent()])]))()]);
                        return [4 /*yield*/, this.getMetadataRecursive(dependencies)];
                    case 15:
                        libraries = _r.sent();
                        assets = this.aggregateAssetsRecursive(dependencies, libraries);
                        mainLibrarySupportsFullscreen = false;
                        _h = {
                            contentId: h5pFilePath,
                            dependencies: dependencies,
                            downloadPath: this.getDownloadPath(h5pFilePath)
                        };
                        return [4 /*yield*/, this.generateIntegration(h5pFilePath, parameters, metadata, assets, mainLibrarySupportsFullscreen, actingUser, language, {
                                showCopyButton: (_k = options === null || options === void 0 ? void 0 : options.showCopyButton) !== null && _k !== void 0 ? _k : false,
                                showDownloadButton: (_l = options === null || options === void 0 ? void 0 : options.showDownloadButton) !== null && _l !== void 0 ? _l : false,
                                showEmbedButton: (_m = options === null || options === void 0 ? void 0 : options.showEmbedButton) !== null && _m !== void 0 ? _m : false,
                                showFrame: (_o = options === null || options === void 0 ? void 0 : options.showFrame) !== null && _o !== void 0 ? _o : false,
                                showH5PIcon: (_p = options === null || options === void 0 ? void 0 : options.showH5PIcon) !== null && _p !== void 0 ? _p : false,
                                showLicenseButton: (_q = options === null || options === void 0 ? void 0 : options.showLicenseButton) !== null && _q !== void 0 ? _q : false
                            }, options === null || options === void 0 ? void 0 : options.contextId, options === null || options === void 0 ? void 0 : options.asUserId, options === null || options === void 0 ? void 0 : options.readOnlyState)];
                    case 16:
                        model = (_h.integration = _r.sent(),
                            _h.scripts = this.listCoreScripts().concat(assets.scripts),
                            _h.styles = this.listCoreStyles().concat(assets.styles),
                            _h.translations = {},
                            _h.embedTypes = metadata.embedTypes,
                            _h.user = actingUser,
                            _h);
                        html = this.renderer(model);
                        console.log("FINSISHED HERE1");
                        console.log(html);
                        return [2 /*return*/, html];
                }
            });
        });
    };
    /**
     * Overrides the default renderer.
     * @param renderer
     */
    H5PPlayer.prototype.setRenderer = function (renderer) {
        log.info('changing renderer');
        this.renderer = renderer;
        return this;
    };
    /**
     *
     * @param dependencies
     * @param libraries
     * @param assets
     * @param loaded
     * @returns aggregated asset lists
     */
    H5PPlayer.prototype.aggregateAssetsRecursive = function (dependencies, libraries, assets, loaded) {
        var _this = this;
        if (assets === void 0) { assets = { scripts: [], styles: [], translations: {} }; }
        if (loaded === void 0) { loaded = {}; }
        log.verbose("loading assets from dependencies: ".concat(dependencies
            .map(function (dep) { return LibraryName_1.default.toUberName(dep); })
            .join(', ')));
        dependencies.forEach(function (dependency) {
            var _a, _b, _c, _d;
            var key = LibraryName_1.default.toUberName(dependency);
            if (key in loaded)
                return;
            loaded[key] = true;
            var lib = libraries[key];
            if (lib) {
                _this.aggregateAssetsRecursive(lib.preloadedDependencies || [], libraries, assets, loaded);
                var cssFiles = ((_a = lib.preloadedCss) === null || _a === void 0 ? void 0 : _a.map(function (f) { return f.path; })) || [];
                var jsFiles = ((_b = lib.preloadedJs) === null || _b === void 0 ? void 0 : _b.map(function (f) { return f.path; })) || [];
                // If configured in the options, we call a hook to change the files
                // included for certain libraries.
                if ((_d = (_c = _this.options) === null || _c === void 0 ? void 0 : _c.customization) === null || _d === void 0 ? void 0 : _d.alterLibraryFiles) {
                    log.debug('Calling alterLibraryFiles hook');
                    var alteredFiles = _this.options.customization.alterLibraryFiles(lib, jsFiles, cssFiles);
                    jsFiles = alteredFiles === null || alteredFiles === void 0 ? void 0 : alteredFiles.scripts;
                    cssFiles = alteredFiles === null || alteredFiles === void 0 ? void 0 : alteredFiles.styles;
                }
                (cssFiles || []).forEach(function (style) {
                    return assets.styles.push(_this.urlGenerator.libraryFile(lib, style));
                });
                (jsFiles || []).forEach(function (script) {
                    return assets.scripts.push(_this.urlGenerator.libraryFile(lib, script));
                });
            }
        });
        return assets;
    };
    /**
     * Scans the parameters for occurances of the regex pattern in any string
     * property.
     * @param parameters the parameters (= content.json)
     * @param regex the regex to look for
     * @returns true if the regex occurs in a string inside the parametres
     */
    H5PPlayer.prototype.checkIfRegexIsInParameters = function (parameters, regex) {
        var type = typeof parameters;
        if (type === 'string') {
            if (regex.test(parameters)) {
                return true;
            }
        }
        else if (type === 'object') {
            // eslint-disable-next-line guard-for-in
            for (var property in parameters) {
                var found = this.checkIfRegexIsInParameters(parameters[property], regex);
                if (found) {
                    return true;
                }
            }
        }
        return false;
    };
    H5PPlayer.prototype.generateIntegration = function (contentId, parameters, metadata, assets, supportsFullscreen, actingUser, language, displayOptions, contextId, asUserId, readOnlyState) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultClientStringsPath, defaultClientStringsContent, defaultClientStringsJson, _a;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // see https://h5p.org/creating-your-own-h5p-plugin
                        log.info("generating integration for ".concat(contentId));
                        defaultClientStringsPath = path.resolve(__dirname, '../assets/defaultClientStrings.json');
                        defaultClientStringsContent = fs.readFileSync(defaultClientStringsPath, 'utf8');
                        defaultClientStringsJson = JSON.parse(defaultClientStringsContent);
                        _b = { ajax: {
                                contentUserData: this.urlGenerator.contentUserData(actingUser, contextId, asUserId, { readonly: readOnlyState }),
                                setFinished: this.urlGenerator.setFinished(actingUser)
                            }, ajaxPath: this.urlGenerator.ajaxEndpoint(actingUser) };
                        _c = {};
                        _a = "cid-".concat(contentId);
                        _d = {
                            displayOptions: {
                                copy: displayOptions.showCopyButton,
                                copyright: displayOptions.showLicenseButton,
                                embed: displayOptions.showEmbedButton,
                                export: displayOptions.showDownloadButton,
                                frame: displayOptions.showFrame,
                                icon: displayOptions.showH5PIcon
                            },
                            fullScreen: supportsFullscreen ? '1' : '0',
                            jsonContent: JSON.stringify(parameters),
                            library: ContentMetadata_1.ContentMetadata.toUbername(metadata),
                            contentUrl: this.urlGenerator.contentFilesUrl(contentId)
                        };
                        return [4 /*yield*/, this.contentUserDataManager.generateContentUserDataIntegration(contentId, actingUser, contextId, asUserId)];
                    case 1: return [2 /*return*/, __assign.apply(void 0, [__assign.apply(void 0, [(_b.contents = (_c[_a] = (_d.contentUserData = _e.sent(),
                                    _d.metadata = {
                                        license: metadata.license || 'U',
                                        title: metadata.title || '',
                                        defaultLanguage: metadata.language || 'en',
                                        authors: metadata.authors,
                                        changes: metadata.changes,
                                        contentType: metadata.contentType,
                                        licenseExtras: metadata.licenseExtras,
                                        a11yTitle: metadata.a11yTitle,
                                        authorComments: metadata.authorComments,
                                        licenseVersion: metadata.licenseVersion,
                                        source: metadata.source,
                                        yearFrom: metadata.yearFrom,
                                        yearTo: metadata.yearTo
                                    },
                                    _d.scripts = assets.scripts,
                                    _d.styles = assets.styles,
                                    _d.url = this.urlGenerator.uniqueContentUrl(contentId),
                                    _d.exportUrl = this.urlGenerator.downloadPackage(contentId),
                                    _d),
                                    _c), _b.core = {
                                    scripts: this.listCoreScripts(),
                                    styles: this.listCoreStyles()
                                }, _b.l10n = {
                                    H5P: this.semanticsLocalizer.localize(defaultClientStringsJson, //defaultClientStrings,
                                    language, true)
                                }, _b.libraryConfig = this.config.libraryConfig, _b.postUserStatistics = this.config.setFinishedEnabled, _b.saveFreq = this.getSaveFreq(readOnlyState), _b.url = this.urlGenerator.baseUrl(), _b.hubIsEnabled = true, _b.fullscreenDisabled = this.config.disableFullscreen ? 1 : 0, _b), this.integrationObjectDefaults]), { user: {
                                    name: actingUser.name,
                                    mail: actingUser.email,
                                    id: actingUser.id
                                } }])];
                }
            });
        });
    };
    H5PPlayer.prototype.getSaveFreq = function (readOnlyState) {
        if (readOnlyState) {
            return Number.MAX_SAFE_INTEGER;
        }
        if (this.config.contentUserStateSaveInterval !== false) {
            return (Math.round(Number(this.config.contentUserStateSaveInterval) / 1000) || 1);
        }
        return false;
    };
    /**
     * Finds out which adds should be added to the library due to the settings
     * in the global configuration or in the library metadata.
     * @param machineName the machine name of the library to which addons should
     * be added
     * @param installedAddons a list of installed addons on the system
     * @returns the list of addons to install
     */
    H5PPlayer.prototype.getAddonsByLibrary = function (machineName, installedAddons) {
        return __awaiter(this, void 0, void 0, function () {
            var neededAddons, _i, installedAddons_1, installedAddon, configRequestedAddons, _a, configRequestedAddons_1, addonMachineName, installedAddonVersions;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        neededAddons = [];
                        // add addons that are required by the H5P library metadata extension
                        for (_i = 0, installedAddons_1 = installedAddons; _i < installedAddons_1.length; _i++) {
                            installedAddon = installedAddons_1[_i];
                            // The property addTo.player.machineNames is a custom
                            // h5p-nodejs-library extension.
                            if (((_d = (_c = (_b = installedAddon.addTo) === null || _b === void 0 ? void 0 : _b.player) === null || _c === void 0 ? void 0 : _c.machineNames) === null || _d === void 0 ? void 0 : _d.includes(machineName)) ||
                                ((_g = (_f = (_e = installedAddon.addTo) === null || _e === void 0 ? void 0 : _e.player) === null || _f === void 0 ? void 0 : _f.machineNames) === null || _g === void 0 ? void 0 : _g.includes('*'))) {
                                log.debug("Addon ".concat(LibraryName_1.default.toUberName(installedAddon), " will be added to the player."));
                                neededAddons.push(installedAddon);
                            }
                        }
                        configRequestedAddons = __spreadArray(__spreadArray([], ((_j = (_h = this.config.playerAddons) === null || _h === void 0 ? void 0 : _h[machineName]) !== null && _j !== void 0 ? _j : []), true), ((_l = (_k = this.config.playerAddons) === null || _k === void 0 ? void 0 : _k['*']) !== null && _l !== void 0 ? _l : []), true);
                        _a = 0, configRequestedAddons_1 = configRequestedAddons;
                        _m.label = 1;
                    case 1:
                        if (!(_a < configRequestedAddons_1.length)) return [3 /*break*/, 4];
                        addonMachineName = configRequestedAddons_1[_a];
                        return [4 /*yield*/, this.libraryManager.listInstalledLibraries(addonMachineName)];
                    case 2:
                        installedAddonVersions = _m.sent();
                        if (!neededAddons
                            .map(function (a) { return a.machineName; })
                            .includes(addonMachineName) &&
                            installedAddonVersions[addonMachineName] !== undefined) {
                            log.debug("Addon ".concat(addonMachineName, " will be added to the player."));
                            neededAddons.push(installedAddonVersions[addonMachineName].sort()[installedAddonVersions[addonMachineName].length - 1]);
                        }
                        _m.label = 3;
                    case 3:
                        _a++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, neededAddons];
                }
            });
        });
    };
    /**
     * Determines which addons should be used for the parameters. It will scan
     * the parameters for patterns specified by installed addons.
     * @param parameters the parameters to scan
     * @param installedAddons a list of addons installed on the system
     * @returns a list of addons that should be used
     */
    H5PPlayer.prototype.getAddonsByParameters = function (parameters, installedAddons) {
        return __awaiter(this, void 0, void 0, function () {
            var addonsToAdd, _i, installedAddons_2, installedAddon, _a, _b, types, matches;
            var _c, _d;
            return __generator(this, function (_e) {
                log.debug('Checking which of the addons must be used for the content.');
                addonsToAdd = {};
                for (_i = 0, installedAddons_2 = installedAddons; _i < installedAddons_2.length; _i++) {
                    installedAddon = installedAddons_2[_i];
                    if (!((_d = (_c = installedAddon.addTo) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.types)) {
                        continue;
                    }
                    for (_a = 0, _b = installedAddon.addTo.content.types; _a < _b.length; _a++) {
                        types = _b[_a];
                        if (types.text) {
                            matches = /^\/(.+?)\/([gimy]+)?$/.exec(types.text.regex);
                            if (matches.length < 1) {
                                log.error("The addon ".concat(LibraryName_1.default.toUberName(installedAddon), " contains an invalid regexp pattern in the addTo selector: ").concat(types.text.regex, ". This will be silently ignored, but the addon will never be used!"));
                                continue;
                            }
                            if (this.checkIfRegexIsInParameters(parameters, new RegExp(matches[1], matches[2]))) {
                                log.debug("Adding addon ".concat(LibraryName_1.default.toUberName(installedAddon), " to dependencies as the regexp pattern ").concat(types.text.regex, " was found in the parameters."));
                                addonsToAdd[installedAddon.machineName] =
                                    installedAddon;
                            }
                        }
                    }
                }
                return [2 /*return*/, Object.values(addonsToAdd)];
            });
        });
    };
    H5PPlayer.prototype.getDownloadPath = function (contentId) {
        return this.urlGenerator.downloadPackage(contentId);
    };
    H5PPlayer.prototype.getMetadata = function (machineName, majorVersion, minorVersion) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log.verbose("loading library ".concat(machineName, "-").concat(majorVersion, ".").concat(minorVersion));
                return [2 /*return*/, this.libraryStorage.getLibrary(new LibraryName_1.default(machineName, majorVersion, minorVersion))];
            });
        });
    };
    /**
     *
     * @param dependencies
     * @param loaded can be left out in initial call
     */
    H5PPlayer.prototype.getMetadataRecursive = function (dependencies_1) {
        return __awaiter(this, arguments, void 0, function (dependencies, loaded) {
            var _this = this;
            if (loaded === void 0) { loaded = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.verbose("loading libraries from dependencies: ".concat(dependencies
                            .map(function (dep) { return LibraryName_1.default.toUberName(dep); })
                            .join(', ')));
                        return [4 /*yield*/, Promise.all(dependencies.map(function (dependency) { return __awaiter(_this, void 0, void 0, function () {
                                var name, majVer, minVer, key, lib, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            name = dependency.machineName;
                                            majVer = dependency.majorVersion;
                                            minVer = dependency.minorVersion;
                                            key = LibraryName_1.default.toUberName(dependency);
                                            if (key in loaded) {
                                                return [2 /*return*/];
                                            }
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.getMetadata(name, majVer, minVer)];
                                        case 2:
                                            lib = _b.sent();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            _a = _b.sent();
                                            log.info("Could not find library ".concat(name, "-").concat(majVer, ".").concat(minVer, " in storage. Silently ignoring..."));
                                            return [3 /*break*/, 4];
                                        case 4:
                                            if (!lib) return [3 /*break*/, 6];
                                            loaded[key] = lib;
                                            return [4 /*yield*/, this.getMetadataRecursive(lib.preloadedDependencies || [], loaded)];
                                        case 5:
                                            _b.sent();
                                            _b.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, loaded];
                }
            });
        });
    };
    H5PPlayer.prototype.listCoreScripts = function () {
        // Read JSON file manually to debug
        var filePath = path.resolve(__dirname, './playerAssetList.json');
        var fileContent = fs.readFileSync(filePath, 'utf8');
        var playerAssetListJson = JSON.parse(fileContent);
        return playerAssetListJson.scripts.core
            .map(this.urlGenerator.coreFile)
            .concat(this.globalCustomScripts);
    };
    H5PPlayer.prototype.listCoreStyles = function () {
        // Read JSON file manually to debug
        var filePath = path.resolve(__dirname, './playerAssetList.json');
        var fileContent = fs.readFileSync(filePath, 'utf8');
        var playerAssetListJson = JSON.parse(fileContent);
        return playerAssetListJson.styles.core
            .map(this.urlGenerator.coreFile)
            .concat(this.globalCustomStyles);
    };
    return H5PPlayer;
}());
exports.default = H5PPlayer;
