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
/**
 * Stores configuration options and literals that are used throughout the
 * system. Also loads and saves the configuration of changeable values (only
 * those as "user-configurable") in the storage object.
 */
var H5PConfig = /** @class */ (function () {
    /**
     * @param storage A key-value storage object that persists the changes to
     * the disk or gets them from the implementation/plugin
     * @param defaults default values to use instead of the ones set by this
     * class
     */
    function H5PConfig(storage, defaults) {
        this.ajaxUrl = '/ajax';
        this.baseUrl = '/h5p';
        this.contentFilesUrl = '/content';
        this.contentTypeCacheRefreshInterval = 1 * 1000 * 60 * 60 * 24;
        this.contentHubEnabled = false;
        this.contentHubMetadataRefreshInterval = 1 * 1000 * 60 * 60 * 24;
        this.contentUserDataUrl = '/contentUserData';
        this.contentWhitelist = 'json png jpg jpeg gif bmp tif tiff svg eot ttf woff woff2 otf webm mp4 ogg mp3 m4a wav txt pdf rtf doc docx xls xlsx ppt pptx odt ods odp xml csv diff patch swf md textile vtt webvtt gltf glb';
        this.coreApiVersion = {
            major: 1,
            minor: 24
        };
        this.coreUrl = '/core';
        this.customization = {
            global: {
                editor: {
                    scripts: [],
                    styles: []
                },
                player: {
                    scripts: [],
                    styles: []
                }
            }
        };
        this.disableFullscreen = false;
        this.downloadUrl = '/download';
        this.editorLibraryUrl = '/editor';
        this.enableLrsContentTypes = true;
        this.exportMaxContentPathLength = 255;
        this.fetchingDisabled = 0;
        this.h5pVersion = '1.24-master';
        this.hubContentTypesEndpoint = 'https://api.h5p.org/v1/content-types/';
        this.hubRegistrationEndpoint = 'https://api.h5p.org/v1/sites';
        this.installLibraryLockMaxOccupationTime = 10000;
        this.installLibraryLockTimeout = 20000;
        this.contentHubContentEndpoint = 'https://hub-api.h5p.org/v1/contents';
        this.contentHubMetadataEndpoint = 'https://hub-api.h5p.org/v1/metadata';
        this.librariesUrl = '/libraries';
        this.libraryWhitelist = 'js css';
        this.lrsContentTypes = [
            'H5P.Questionnaire',
            'H5P.FreeTextQuestion'
        ];
        this.maxFileSize = 16 * 1024 * 1024;
        this.maxTotalSize = 64 * 1024 * 1024;
        this.paramsUrl = '/params';
        this.platformName = 'H5P-Editor-NodeJs';
        this.platformVersion = '0.10';
        this.playUrl = '/play';
        this.sendUsageStatistics = false;
        this.setFinishedUrl = '/finishedData';
        this.setFinishedEnabled = true;
        this.siteType = 'local';
        this.contentUserStateSaveInterval = 5 * 1000; // the interval to save the contentUserData in milliseconds
        this.temporaryFileLifetime = 120 * 60 * 1000; // 120 minutes
        this.temporaryFilesUrl = '/temp-files';
        this.uuid = '';
        this.storage = storage;
        if (defaults) {
            for (var key in defaults) {
                if (this[key] !== undefined) {
                    this[key] = defaults[key];
                }
            }
        }
    }
    /**
     * Loads all changeable settings from storage. (Should be called when the system initializes.)
     */
    H5PConfig.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSettingFromStorage('baseUrl')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('contentFilesUrlPlayerOverride')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('contentHubEnabled')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('contentHubMetadataRefreshInterval')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('contentTypeCacheRefreshInterval')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('contentUserStateSaveInterval')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('contentWhitelist')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('customization')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('disableFullscreen')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('editorAddons')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('enableLrsContentTypes')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('exportMaxContentPathLength')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('fetchingDisabled')];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('hubContentTypesEndpoint')];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('hubRegistrationEndpoint')];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('libraryConfig')];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('libraryWhitelist')];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('maxFileSize')];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('maxTotalSize')];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('playerAddons')];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('proxy')];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('sendUsageStatistics')];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('setFinishedEnabled')];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('siteType')];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, this.loadSettingFromStorage('uuid')];
                    case 25:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Saves all changeable settings to storage. (Should be called when a setting was changed.)
     */
    H5PConfig.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveSettingToStorage('contentFilesUrlPlayerOverride')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('contentHubEnabled')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('contentHubMetadataRefreshInterval')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('contentTypeCacheRefreshInterval')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('contentUserStateSaveInterval')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('contentWhitelist')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('customization')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('disableFullscreen')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('editorAddons')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('enableLrsContentTypes')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('exportMaxContentPathLength')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('fetchingDisabled')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('hubContentTypesEndpoint')];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('hubRegistrationEndpoint')];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('libraryConfig')];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('libraryWhitelist')];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('maxFileSize')];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('maxTotalSize')];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('playerAddons')];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('proxy')];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('sendUsageStatistics')];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('setFinishedEnabled')];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('siteType')];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, this.saveSettingToStorage('uuid')];
                    case 24:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Loads a settings from the storage interface. Uses the default value
     * configured in this file if there is none in the configuration.
     * @param settingName
     * @returns the value of the setting
     */
    H5PConfig.prototype.loadSettingFromStorage = function (settingName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _b = settingName;
                        return [4 /*yield*/, ((_c = this.storage) === null || _c === void 0 ? void 0 : _c.load(settingName))];
                    case 1:
                        _a[_b] =
                            (_d = (_e.sent())) !== null && _d !== void 0 ? _d : this[settingName];
                        return [2 /*return*/, this[settingName]];
                }
            });
        });
    };
    /**
     * Saves a setting to the storage interface.
     * @param settingName
     */
    H5PConfig.prototype.saveSettingToStorage = function (settingName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.storage) === null || _a === void 0 ? void 0 : _a.save(settingName, this[settingName]))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return H5PConfig;
}());
exports.default = H5PConfig;