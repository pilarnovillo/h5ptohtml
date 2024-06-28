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
var promisepipe_1 = require("promisepipe");
var tmp_promise_1 = require("tmp-promise");
var H5pError_1 = require("./helpers/H5pError");
var PackageImporter_1 = require("./PackageImporter");
var types_1 = require("./types");
var Logger_1 = require("./helpers/Logger");
var TranslatorWithFallback_1 = require("./helpers/TranslatorWithFallback");
var HttpClient_1 = require("./helpers/HttpClient");
var log = new Logger_1.default('ContentTypeInformationRepository');
/**
 * This class provides access to information about content types that are either available at the H5P Hub
 * or were installed locally. It is used by the editor to display the list of available content types. Technically
 * it fulfills the same functionality as the "ContentTypeCache" in the original PHP implementation, but it has been
 * renamed in the NodeJS version, as it provides more functionality than just caching the information from the Hub:
 *   - it checks if the current user has the rights to update or install a content type
 *   - it checks if a content type in the Hub is installed locally and is outdated locally
 *   - it adds information about only locally installed content types
 */
var ContentTypeInformationRepository = /** @class */ (function () {
    /**
     *
     * @param contentTypeCache
     * @param libraryManager
     * @param config
     * @param translationCallback (optional) if passed in, the object will try
     * to localize content type information (if a language is passed to the
     * `get(...)` method). You can safely leave it out if you don't want to
     * localize hub information.
     */
    function ContentTypeInformationRepository(contentTypeCache, libraryManager, config, permissionSystem, translationCallback) {
        this.contentTypeCache = contentTypeCache;
        this.libraryManager = libraryManager;
        this.config = config;
        this.permissionSystem = permissionSystem;
        log.info("initialize");
        if (translationCallback) {
            this.translator = new TranslatorWithFallback_1.default(translationCallback, [
                'hub'
            ]);
        }
        this.httpClient = (0, HttpClient_1.default)(config);
    }
    /**
     * Gets the information about available content types with all the extra
     * information as listed in the class description.
     */
    ContentTypeInformationRepository.prototype.get = function (user, language) {
        return __awaiter(this, void 0, void 0, function () {
            var cachedHubInfo, hubInfoWithLocalInfo, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        log.info("getting information about available content types");
                        return [4 /*yield*/, this.contentTypeCache.get()];
                    case 1:
                        cachedHubInfo = _d.sent();
                        if (this.translator &&
                            language &&
                            language.toLowerCase() !== 'en' && // We don't localize English as the base strings already are in English
                            !language.toLowerCase().startsWith('en-')) {
                            cachedHubInfo = this.localizeHubInfo(cachedHubInfo, language);
                        }
                        return [4 /*yield*/, this.addUserAndInstallationSpecificInfo(cachedHubInfo, user)];
                    case 2:
                        hubInfoWithLocalInfo = _d.sent();
                        return [4 /*yield*/, this.addLocalLibraries(hubInfoWithLocalInfo, user)];
                    case 3:
                        hubInfoWithLocalInfo = _d.sent();
                        _c = {
                            apiVersion: this.config.coreApiVersion,
                            details: null, // TODO: implement this (= messages to user)
                            libraries: hubInfoWithLocalInfo
                        };
                        return [4 /*yield*/, this.contentTypeCache.isOutdated()];
                    case 4:
                        _a = (_d.sent());
                        if (!_a) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.permissionSystem.checkForGeneralAction(user, types_1.GeneralPermission.InstallRecommended)];
                    case 5:
                        _b = (_d.sent());
                        if (_b) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.permissionSystem.checkForGeneralAction(user, types_1.GeneralPermission.UpdateAndInstallLibraries)];
                    case 6:
                        _b = (_d.sent());
                        _d.label = 7;
                    case 7:
                        _a = (_b);
                        _d.label = 8;
                    case 8: return [2 /*return*/, (_c.outdated = _a,
                            _c.recentlyUsed = [],
                            _c.user = user.type,
                            _c)];
                }
            });
        });
    };
    /**
     * Installs a library from the H5P Hub.
     * Throws H5PError exceptions if there are errors.
     * @param machineName The machine name of the library to install (must be listed in the Hub, otherwise rejected)
     * @returns a list of libraries that were installed (includes dependent libraries). Empty if none were installed.
     */
    ContentTypeInformationRepository.prototype.installContentType = function (machineName, user) {
        return __awaiter(this, void 0, void 0, function () {
            var localContentType, response, installedLibraries;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("installing library ".concat(machineName, " from hub ").concat(this.config.hubContentTypesEndpoint));
                        if (!machineName) {
                            log.error("content type ".concat(machineName, " not found"));
                            throw new H5pError_1.default('hub-install-no-content-type', {}, 404);
                        }
                        return [4 /*yield*/, this.contentTypeCache.get(machineName)];
                    case 1:
                        localContentType = _a.sent();
                        if (!localContentType || localContentType.length === 0) {
                            log.error("rejecting content type ".concat(machineName, ": content type is not listed in the hub ").concat(this.config.hubContentTypesEndpoint));
                            throw new H5pError_1.default('hub-install-invalid-content-type', {}, 400);
                        }
                        return [4 /*yield*/, this.canInstallLibrary(localContentType[0], user)];
                    case 2:
                        // Reject installation of content types that the user has no permission to
                        if (!(_a.sent())) {
                            log.warn("rejecting installation of content type ".concat(machineName, ": user has no permission"));
                            throw new H5pError_1.default('hub-install-denied', {}, 403);
                        }
                        return [4 /*yield*/, this.httpClient.get(this.config.hubContentTypesEndpoint + machineName, { responseType: 'stream' })];
                    case 3:
                        response = _a.sent();
                        installedLibraries = [];
                        // withFile is supposed to clean up the temporary file after it has been used
                        return [4 /*yield*/, (0, tmp_promise_1.withFile)(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                var writeStream, error_1, packageImporter;
                                var tempPackagePath = _b.path;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            writeStream = fsExtra.createWriteStream(tempPackagePath);
                                            _c.label = 1;
                                        case 1:
                                            _c.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, (0, promisepipe_1.default)(response.data, writeStream)];
                                        case 2:
                                            _c.sent();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_1 = _c.sent();
                                            log.error(error_1);
                                            throw new H5pError_1.default('hub-install-download-failed', {}, 504);
                                        case 4:
                                            packageImporter = new PackageImporter_1.default(this.libraryManager, this.config, this.permissionSystem);
                                            return [4 /*yield*/, packageImporter.installLibrariesFromPackage(tempPackagePath)];
                                        case 5:
                                            installedLibraries =
                                                _c.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, { postfix: '.h5p', keep: false })];
                    case 4:
                        // withFile is supposed to clean up the temporary file after it has been used
                        _a.sent();
                        return [2 /*return*/, installedLibraries];
                }
            });
        });
    };
    /**
     *
     * @param hubInfo
     * @returns The original hub information as passed into the method with appended information about
     * locally installed libraries.
     */
    ContentTypeInformationRepository.prototype.addLocalLibraries = function (hubInfo, user) {
        return __awaiter(this, void 0, void 0, function () {
            var localLibsWrapped, localLibs, finalLocalLibs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryManager.listInstalledLibraries()];
                    case 1:
                        localLibsWrapped = _a.sent();
                        localLibs = Object.keys(localLibsWrapped)
                            .map(function (machineName) {
                            return localLibsWrapped[machineName][localLibsWrapped[machineName].length - 1];
                        })
                            .filter(function (lib) {
                            return !hubInfo.some(function (hubLib) { return hubLib.machineName === lib.machineName; }) && lib.runnable;
                        })
                            .map(function (localLib) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = {
                                            canInstall: false,
                                            description: ''
                                        };
                                        return [4 /*yield*/, this.libraryManager.libraryFileExists(localLib, 'icon.svg')];
                                    case 1:
                                        _b.icon = (_c.sent())
                                            ? this.libraryManager.getLibraryFileUrl(localLib, 'icon.svg')
                                            : undefined,
                                            _b.installed = true,
                                            _b.isUpToDate = true,
                                            _b.localMajorVersion = localLib.majorVersion,
                                            _b.localMinorVersion = localLib.minorVersion,
                                            _b.localPatchVersion = localLib.patchVersion,
                                            _b.machineName = localLib.machineName,
                                            _b.majorVersion = localLib.majorVersion,
                                            _b.minorVersion = localLib.minorVersion,
                                            _b.owner = '',
                                            _b.patchVersion = localLib.patchVersion;
                                        _a = this.libraryIsRestricted(localLib);
                                        if (!_a) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.permissionSystem.checkForGeneralAction(user, types_1.GeneralPermission.CreateRestricted)];
                                    case 2:
                                        _a = !(_c.sent());
                                        _c.label = 3;
                                    case 3: return [2 /*return*/, (_b.restricted = _a,
                                            _b.title = localLib.title,
                                            _b)];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(localLibs)];
                    case 2:
                        finalLocalLibs = _a.sent();
                        log.info("adding local libraries: ".concat(finalLocalLibs
                            .map(function (lib) {
                            return "".concat(lib.machineName, "-").concat(lib.majorVersion, ".").concat(lib.minorVersion);
                        })
                            .join(', ')));
                        return [2 /*return*/, hubInfo.concat(finalLocalLibs)];
                }
            });
        });
    };
    /**
     * Adds information about installation status, restriction, right to install and up-to-dateness.
     * @param hubInfo
     * @returns The hub information as passed into the method with added information.
     */
    ContentTypeInformationRepository.prototype.addUserAndInstallationSpecificInfo = function (hubInfo, user) {
        return __awaiter(this, void 0, void 0, function () {
            var localLibsWrapped, localLibs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("adding user and installation specific information");
                        return [4 /*yield*/, this.libraryManager.listInstalledLibraries()];
                    case 1:
                        localLibsWrapped = _a.sent();
                        localLibs = Object.keys(localLibsWrapped).map(function (machineName) {
                            return localLibsWrapped[machineName][localLibsWrapped[machineName].length - 1];
                        });
                        return [2 /*return*/, Promise.all(hubInfo.map(function (hl) { return __awaiter(_this, void 0, void 0, function () {
                                var hubLib, localLib, _a, _b, _c, _d, _e, _f, _g;
                                return __generator(this, function (_h) {
                                    switch (_h.label) {
                                        case 0:
                                            hubLib = __assign(__assign({}, hl), { canInstall: false, installed: false, isUpToDate: false, localMajorVersion: 0, localMinorVersion: 0, localPatchVersion: 0, restricted: false });
                                            localLib = localLibs.find(function (l) { return l.machineName === hubLib.machineName; });
                                            if (!!localLib) return [3 /*break*/, 3];
                                            hubLib.installed = false;
                                            _a = hubLib;
                                            return [4 /*yield*/, this.canInstallLibrary(hubLib, user)];
                                        case 1:
                                            _a.restricted = !(_h.sent());
                                            _b = hubLib;
                                            return [4 /*yield*/, this.canInstallLibrary(hubLib, user)];
                                        case 2:
                                            _b.canInstall = _h.sent();
                                            hubLib.isUpToDate = true;
                                            return [3 /*break*/, 9];
                                        case 3:
                                            hubLib.installed = true;
                                            _c = hubLib;
                                            _d = this.libraryIsRestricted(localLib);
                                            if (!_d) return [3 /*break*/, 5];
                                            return [4 /*yield*/, this.permissionSystem.checkForGeneralAction(user, types_1.GeneralPermission.CreateRestricted)];
                                        case 4:
                                            _d = !(_h.sent());
                                            _h.label = 5;
                                        case 5:
                                            _c.restricted = _d;
                                            _e = hubLib;
                                            _f = !this.libraryIsRestricted(localLib);
                                            if (!_f) return [3 /*break*/, 7];
                                            return [4 /*yield*/, this.canInstallLibrary(hubLib, user)];
                                        case 6:
                                            _f = (_h.sent());
                                            _h.label = 7;
                                        case 7:
                                            _e.canInstall = _f;
                                            _g = hubLib;
                                            return [4 /*yield*/, this.libraryManager.libraryHasUpgrade(hubLib)];
                                        case 8:
                                            _g.isUpToDate =
                                                !(_h.sent());
                                            hubLib.localMajorVersion = localLib.majorVersion;
                                            hubLib.localMinorVersion = localLib.minorVersion;
                                            hubLib.localPatchVersion = localLib.patchVersion;
                                            _h.label = 9;
                                        case 9: return [2 /*return*/, hubLib];
                                    }
                                });
                            }); }))];
                }
            });
        });
    };
    /**
     * Checks if users can install library due to their rights.
     * @param library
     */
    ContentTypeInformationRepository.prototype.canInstallLibrary = function (library, user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        log.verbose("checking if user can install library ".concat(library.machineName));
                        return [4 /*yield*/, this.permissionSystem.checkForGeneralAction(user, types_1.GeneralPermission.UpdateAndInstallLibraries)];
                    case 1:
                        _a = (_c.sent());
                        if (_a) return [3 /*break*/, 4];
                        _b = library.isRecommended;
                        if (!_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.permissionSystem.checkForGeneralAction(user, types_1.GeneralPermission.InstallRecommended)];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        _a = (_b);
                        _c.label = 4;
                    case 4: return [2 /*return*/, (_a)];
                }
            });
        });
    };
    /**
     * Checks if the library is restricted e.g. because it is LRS dependent and the
     * admin has restricted them or because it was set as restricted individually.
     * @param library
     */
    ContentTypeInformationRepository.prototype.libraryIsRestricted = function (library) {
        log.verbose("checking if library ".concat(library.machineName, " is restricted"));
        if (this.config.enableLrsContentTypes) {
            return library.restricted;
        }
        if (this.config.lrsContentTypes.some(function (contentType) { return contentType === library.machineName; })) {
            return true;
        }
        return library.restricted;
    };
    /**
     * Returns a transformed list of content type information in which the
     * visible strings are localized into the desired language. Only works if
     * the namespace 'hub' has been initialized and populated by the i18n
     * system.
     * @param contentTypes
     * @param language
     * @returns the transformed list of content types
     */
    ContentTypeInformationRepository.prototype.localizeHubInfo = function (contentTypes, language) {
        var _this = this;
        if (!this.translator) {
            throw new Error('You need to instantiate ContentTypeInformationRepository with a translationCallback if you want to localize Hub information.');
        }
        return contentTypes.map(function (ct) {
            var cleanMachineName = ct.machineName.replace('.', '_');
            return __assign(__assign({}, ct), { summary: _this.translator.tryLocalize("".concat(cleanMachineName, ".summary"), ct.summary, language), description: _this.translator.tryLocalize("".concat(cleanMachineName, ".description"), ct.description, language), keywords: ct.keywords.map(function (kw) {
                    return _this.translator.tryLocalize("".concat(ct.machineName.replace('.', '_'), ".keywords.").concat(kw.replace('_', ' ')), kw, language);
                }), title: _this.translator.tryLocalize("".concat(cleanMachineName, ".title"), ct.title, language) });
        });
    };
    return ContentTypeInformationRepository;
}());
exports.default = ContentTypeInformationRepository;
