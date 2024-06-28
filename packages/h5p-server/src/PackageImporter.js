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
var promisepipe_1 = require("promisepipe");
var tmp_promise_1 = require("tmp-promise");
var yauzlPromise = require("yauzl-promise");
var H5pError_1 = require("./helpers/H5pError");
var PackageValidator_1 = require("./PackageValidator");
var types_1 = require("./types");
var Logger_1 = require("./helpers/Logger");
var LibraryName_1 = require("./LibraryName");
var log = new Logger_1.default('PackageImporter');
/**
 * Indicates what to do with content.
 */
var ContentCopyModes;
(function (ContentCopyModes) {
    /**
     * "Install" means that the content should be permanently added to the
     * system (i.e. added through ContentManager)
     */
    ContentCopyModes[ContentCopyModes["Install"] = 0] = "Install";
    /**
     * "Temporary" means that the content should not be permanently added to the
     * system. Instead only the content files (images etc.) are added to
     * temporary storage.
     */
    ContentCopyModes[ContentCopyModes["Temporary"] = 1] = "Temporary";
    /**
     * "NoCopy" means that content is ignored.
     */
    ContentCopyModes[ContentCopyModes["NoCopy"] = 2] = "NoCopy";
})(ContentCopyModes || (ContentCopyModes = {}));
/**
 * Handles the installation of libraries and saving of content from a H5P package.
 */
var PackageImporter = /** @class */ (function () {
    /**
     * @param libraryManager
     * @param config
     * @param contentStorer
     */
    function PackageImporter(libraryManager, config, permissionSystem, contentManager, contentStorer) {
        if (contentManager === void 0) { contentManager = null; }
        if (contentStorer === void 0) { contentStorer = null; }
        this.libraryManager = libraryManager;
        this.config = config;
        this.permissionSystem = permissionSystem;
        this.contentManager = contentManager;
        this.contentStorer = contentStorer;
        /**
         * Gets all libraries referenced in the metadata
         * @param metadata
         * @returns the libraries
         */
        this.getRequiredLibraries = function (metadata) {
            var _a, _b;
            return ((_a = metadata.editorDependencies) !== null && _a !== void 0 ? _a : [])
                .concat((_b = metadata.dynamicDependencies) !== null && _b !== void 0 ? _b : [])
                .concat(metadata.preloadedDependencies);
        };
        log.info("initialize");
    }
    /**
     * Extracts a H5P package to the specified directory.
     * @param packagePath The full path to the H5P package file on the local
     * disk
     * @param directoryPath The full path of the directory to which the package
     * should be extracted
     * @param includeLibraries If true, the library directories inside the
     * package will be extracted.
     * @param includeContent If true, the content folder inside the package will
     * be extracted.
     * @param includeMetadata If true, the h5p.json file inside the package will
     * be extracted.
     * @returns
     */
    PackageImporter.extractPackage = function (packagePath_1, directoryPath_1, _a) {
        return __awaiter(this, arguments, void 0, function (packagePath, directoryPath, _b) {
            var zipFile;
            var _this = this;
            var _c = _b.includeLibraries, includeLibraries = _c === void 0 ? false : _c, _d = _b.includeContent, includeContent = _d === void 0 ? false : _d, _e = _b.includeMetadata, includeMetadata = _e === void 0 ? false : _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        log.info("extracting package ".concat(packagePath, " to ").concat(directoryPath));
                        return [4 /*yield*/, yauzlPromise.open(packagePath)];
                    case 1:
                        zipFile = _f.sent();
                        return [4 /*yield*/, zipFile.walkEntries(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                                var basename, readStream, writePath, writeStream;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            basename = path.basename(entry.fileName);
                                            if (!(!entry.fileName.endsWith('/') &&
                                                !basename.startsWith('.') &&
                                                !basename.startsWith('_') &&
                                                ((includeContent && entry.fileName.startsWith('content/')) ||
                                                    (includeLibraries &&
                                                        entry.fileName.includes('/') &&
                                                        !entry.fileName.startsWith('content/')) ||
                                                    (includeMetadata && entry.fileName === 'h5p.json')))) return [3 /*break*/, 4];
                                            return [4 /*yield*/, entry.openReadStream()];
                                        case 1:
                                            readStream = _a.sent();
                                            writePath = path.join(directoryPath, entry.fileName);
                                            return [4 /*yield*/, fsExtra.mkdirp(path.dirname(writePath))];
                                        case 2:
                                            _a.sent();
                                            writeStream = fsExtra.createWriteStream(writePath);
                                            return [4 /*yield*/, (0, promisepipe_1.default)(readStream, writeStream)];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, zipFile.close()];
                    case 3:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Permanently adds content from a H5P package to the system. This means
     * that content is __permanently__ added to storage and necessary libraries
     * are installed from the package if they are not already installed.
     *
     * This is __NOT__ what you want if the user is just uploading a package in
     * the editor client!
     *
     * Throws errors if something goes wrong.
     * @deprecated The method should not be used as it anymore, as there might
     * be issues with invalid filenames!
     * @param packagePath The full path to the H5P package file on the local
     * disk.
     * @param user The user who wants to upload the package.
     * @param contentId (optional) the content id to use for the package
     * @returns the newly assigned content id, the metadata (=h5p.json) and
     * parameters (=content.json) inside the package and a list of installed
     * libraries.
     */
    PackageImporter.prototype.addPackageLibrariesAndContent = function (packagePath, user, contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, metadata, parameters, installedLibraries, _b, _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        log.info("adding content from ".concat(packagePath, " to system"));
                        _b = this.processPackage;
                        _c = [packagePath];
                        _d = {
                            copyMode: ContentCopyModes.Install
                        };
                        return [4 /*yield*/, this.permissionSystem.checkForGeneralAction(user, types_1.GeneralPermission.UpdateAndInstallLibraries)];
                    case 1: return [4 /*yield*/, _b.apply(this, _c.concat([(_d.installLibraries = _e.sent(),
                                _d), user,
                            contentId]))];
                    case 2:
                        _a = _e.sent(), id = _a.id, metadata = _a.metadata, parameters = _a.parameters, installedLibraries = _a.installedLibraries;
                        if (id === undefined) {
                            throw new H5pError_1.default('import-package-no-id-assigned');
                        }
                        return [2 /*return*/, { id: id, metadata: metadata, parameters: parameters, installedLibraries: installedLibraries }];
                }
            });
        });
    };
    /**
     * Copies files inside the package into temporary storage and installs the
     * necessary libraries from the package if they are not already installed.
     * (This is what you want to do if the user uploads a package in the editor
     * client.) Pass the information returned about the content back to the
     * editor client. Throws errors if something goes wrong.
     * @param packagePath The full path to the H5P package file on the local
     * disk.
     * @param user The user who wants to upload the package.
     * @returns the metadata and parameters inside the package and a list of
     * installed libraries
     */
    PackageImporter.prototype.addPackageLibrariesAndTemporaryFiles = function (packagePath, user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        log.info("adding content from ".concat(packagePath, " to system"));
                        _a = this.processPackage;
                        _b = [packagePath];
                        _c = {
                            copyMode: ContentCopyModes.Temporary
                        };
                        return [4 /*yield*/, this.permissionSystem.checkForGeneralAction(user, types_1.GeneralPermission.UpdateAndInstallLibraries)];
                    case 1: return [2 /*return*/, _a.apply(this, _b.concat([(_c.installLibraries = _d.sent(),
                                _c), user]))];
                }
            });
        });
    };
    /**
     * Installs all libraries from the package. Assumes that the user calling
     * this has the permission to install libraries! Throws errors if something
     * goes wrong.
     * @param packagePath The full path to the H5P package file on the local
     * disk.
     * @returns a list of the installed libraries
     */
    PackageImporter.prototype.installLibrariesFromPackage = function (packagePath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("installing libraries from package ".concat(packagePath));
                        return [4 /*yield*/, this.processPackage(packagePath, {
                                copyMode: ContentCopyModes.NoCopy,
                                installLibraries: true
                            })];
                    case 1: return [2 /*return*/, (_a.sent()).installedLibraries];
                }
            });
        });
    };
    /**
     * Generic method to process a H5P package. Can install libraries and copy
     * content.
     * @param packagePath The full path to the H5P package file on the local
     * disk
     * @param installLibraries If true, try installing libraries from package.
     * Defaults to false.
     * @param copyMode indicates if and how content should be installed
     * @param user (optional) the user who wants to copy content (only needed
     * when copying content)
     * @returns the newly assigned content id (undefined if not saved
     * permanently), the metadata (=h5p.json) and parameters (=content.json)
     * inside the package. Also includes a list of libraries that were
     * installed.
     */
    PackageImporter.prototype.processPackage = function (packagePath_1, _a, user_1, contentId_1) {
        return __awaiter(this, arguments, void 0, function (packagePath, _b, user, contentId) {
            var packageValidator, tempDirPath, installedLibraries, dirContent, metadata, requiredLibraries, missingLibraries, _c, _d, error_1;
            var _this = this;
            var _e = _b.installLibraries, installLibraries = _e === void 0 ? false : _e, _f = _b.copyMode, copyMode = _f === void 0 ? ContentCopyModes.NoCopy : _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        log.info("processing package ".concat(packagePath));
                        packageValidator = new PackageValidator_1.default(this.config, this.libraryManager);
                        // no need to check result as the validator throws an exception if there
                        // is an error
                        return [4 /*yield*/, packageValidator.validateFileSizes(packagePath)];
                    case 1:
                        // no need to check result as the validator throws an exception if there
                        // is an error
                        _g.sent();
                        return [4 /*yield*/, (0, tmp_promise_1.dir)()];
                    case 2:
                        tempDirPath = (_g.sent()).path;
                        installedLibraries = [];
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 16, 17, 19]);
                        return [4 /*yield*/, PackageImporter.extractPackage(packagePath, tempDirPath, {
                                includeContent: copyMode === ContentCopyModes.Install ||
                                    copyMode === ContentCopyModes.Temporary,
                                includeLibraries: installLibraries,
                                includeMetadata: copyMode === ContentCopyModes.Install ||
                                    copyMode === ContentCopyModes.Temporary
                            })];
                    case 4:
                        _g.sent();
                        return [4 /*yield*/, packageValidator.validateExtractedPackage(tempDirPath, copyMode === ContentCopyModes.Install ||
                                copyMode === ContentCopyModes.Temporary, installLibraries)];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, fsExtra.readdir(tempDirPath)];
                    case 6:
                        dirContent = _g.sent();
                        if (!installLibraries) return [3 /*break*/, 8];
                        return [4 /*yield*/, Promise.all(dirContent
                                .filter(function (dirEntry) {
                                return dirEntry !== 'h5p.json' &&
                                    dirEntry !== 'content';
                            })
                                .sort() // prevents deadlocks when installing libraries
                                .map(function (dirEntry) {
                                return _this.libraryManager.installFromDirectory(path.join(tempDirPath, dirEntry), false);
                            }))];
                    case 7:
                        installedLibraries = (_g.sent()).filter(function (installResult) {
                            return installResult !== undefined &&
                                installResult.type !== 'none';
                        });
                        _g.label = 8;
                    case 8:
                        metadata = void 0;
                        if (!(copyMode === ContentCopyModes.Install ||
                            copyMode === ContentCopyModes.Temporary)) return [3 /*break*/, 11];
                        return [4 /*yield*/, fsExtra.readJSON(path.join(tempDirPath, 'h5p.json'))];
                    case 9:
                        metadata = _g.sent();
                        requiredLibraries = this.getRequiredLibraries(metadata);
                        return [4 /*yield*/, this.libraryManager.getNotInstalledLibraries(requiredLibraries)];
                    case 10:
                        missingLibraries = _g.sent();
                        if (missingLibraries.length > 0) {
                            throw new H5pError_1.default('install-missing-libraries', {
                                libraries: missingLibraries
                                    .map(function (l) { return LibraryName_1.default.toUberName(l); })
                                    .join(', ')
                            }, 400);
                        }
                        _g.label = 11;
                    case 11:
                        if (!(copyMode === ContentCopyModes.Install)) return [3 /*break*/, 13];
                        if (!this.contentManager) {
                            throw new Error('PackageImporter was initialized without a ContentManager, but you want to copy content from a package. Pass a ContentManager object to the the constructor!');
                        }
                        _c = [{}];
                        return [4 /*yield*/, this.contentStorer.copyFromDirectoryToStorage(metadata, tempDirPath, user, contentId)];
                    case 12: return [2 /*return*/, __assign.apply(void 0, [__assign.apply(void 0, _c.concat([(_g.sent())])), { installedLibraries: installedLibraries }])];
                    case 13:
                        if (!(copyMode === ContentCopyModes.Temporary)) return [3 /*break*/, 15];
                        if (!this.contentStorer) {
                            throw new Error('PackageImporter was initialized without a ContentStorer, but you want to copy content from a package. Pass a ContentStorer object to the the constructor!');
                        }
                        _d = [{}];
                        return [4 /*yield*/, this.contentStorer.copyFromDirectoryToTemporary(metadata, tempDirPath, user)];
                    case 14: return [2 /*return*/, __assign.apply(void 0, [__assign.apply(void 0, _d.concat([(_g.sent())])), { installedLibraries: installedLibraries }])];
                    case 15: return [3 /*break*/, 19];
                    case 16:
                        error_1 = _g.sent();
                        // if we don't do this, finally weirdly just swallows the errors
                        throw error_1;
                    case 17: 
                    // clean up temporary files in any case
                    return [4 /*yield*/, fsExtra.remove(tempDirPath)];
                    case 18:
                        // clean up temporary files in any case
                        _g.sent();
                        return [7 /*endfinally*/];
                    case 19: return [2 /*return*/, {
                            id: undefined,
                            installedLibraries: installedLibraries,
                            metadata: undefined,
                            parameters: undefined
                        }];
                }
            });
        });
    };
    return PackageImporter;
}());
exports.default = PackageImporter;