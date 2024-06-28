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
var Logger_1 = require("./helpers/Logger");
var types_1 = require("./types");
var FilenameGenerator_1 = require("./helpers/FilenameGenerator");
var H5pError_1 = require("./helpers/H5pError");
var log = new Logger_1.default('TemporaryFileManager');
/**
 * Keeps track of temporary files (images, video etc. upload for unsaved content).
 */
var TemporaryFileManager = /** @class */ (function () {
    /**
     * @param config Used to get values for how long temporary files should be stored.
     */
    function TemporaryFileManager(storage, config, permissionSystem) {
        this.storage = storage;
        this.config = config;
        this.permissionSystem = permissionSystem;
        log.info('initialize');
    }
    /**
     * Saves a file to temporary storage. Assigns access permission to the
     * user passed as an argument only.
     * @param filename the original filename of the file to store
     * @param dataStream the data of the file in a readable stream
     * @param user the user who requests the file
     * @returns the new filename (not equal to the filename passed to the
     * method to unsure uniqueness)
     */
    TemporaryFileManager.prototype.addFile = function (filename, dataStream, user) {
        return __awaiter(this, void 0, void 0, function () {
            var uniqueFilename, tmpFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.permissionSystem.checkForTemporaryFile(user, types_1.TemporaryFilePermission.Create, undefined)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("User tried upload file to temporary storage without proper permissions.");
                            throw new H5pError_1.default('h5p-server:temporary-file-missing-write-permission', {}, 403);
                        }
                        log.info("Storing temporary file ".concat(filename));
                        return [4 /*yield*/, this.generateUniqueName(filename, user)];
                    case 2:
                        uniqueFilename = _a.sent();
                        log.debug("Assigned unique filename ".concat(uniqueFilename));
                        return [4 /*yield*/, this.storage.saveFile(uniqueFilename, dataStream, user, new Date(Date.now() + this.config.temporaryFileLifetime))];
                    case 3:
                        tmpFile = _a.sent();
                        return [2 /*return*/, tmpFile.filename];
                }
            });
        });
    };
    /**
     * Removes temporary files that have expired.
     */
    TemporaryFileManager.prototype.cleanUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var temporaryFiles, now, filesToDelete;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info('cleaning up temporary files');
                        return [4 /*yield*/, this.storage.listFiles()];
                    case 1:
                        temporaryFiles = _a.sent();
                        now = Date.now();
                        filesToDelete = temporaryFiles.filter(function (f) { return f.expiresAt.getTime() < now; });
                        if (filesToDelete.length > 0) {
                            log.debug("these temporary files have expired and will be deleted: ".concat(filesToDelete
                                .map(function (f) {
                                return "".concat(f.filename, " (expired at ").concat(f.expiresAt.toISOString(), ")");
                            })
                                .join(' ')));
                        }
                        else {
                            log.debug('no temporary files have expired and must be deleted');
                        }
                        return [4 /*yield*/, Promise.all(filesToDelete.map(function (f) {
                                return _this.storage.deleteFile(f.filename, f.ownedByUserId);
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a file from temporary storage. Will silently do nothing if the file does not
     * exist or is not accessible.
     * @param filename
     * @param user
     */
    TemporaryFileManager.prototype.deleteFile = function (filename, user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.storage.fileExists(filename, user)];
                    case 1:
                        if (!_b.sent()) return [3 /*break*/, 5];
                        _a = user !== null;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.permissionSystem.checkForTemporaryFile(user, types_1.TemporaryFilePermission.Delete, filename)];
                    case 2:
                        _a = !(_b.sent());
                        _b.label = 3;
                    case 3:
                        if (_a) {
                            log.error("User tried to delete a file from a temporary storage without proper permissions.");
                            throw new H5pError_1.default('h5p-server:temporary-file-missing-delete-permission', {}, 403);
                        }
                        return [4 /*yield*/, this.storage.deleteFile(filename, user.id)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if a file exists in temporary storage.
     * @param filename the filename to check; can be a path including subdirectories (e.g. 'images/xyz.png')
     * @param user the user for who to check
     * @returns true if file already exists
     */
    TemporaryFileManager.prototype.fileExists = function (filename, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.storage.fileExists(filename, user)];
            });
        });
    };
    /**
     * Returns a file stream for temporary file.
     * Will throw H5PError if the file doesn't exist or the user has no access permissions!
     * Make sure to close this stream. Otherwise the temporary files can't be deleted properly!
     * @param filename the file to get
     * @param user the user who requests the file
     * @param rangeStart (optional) the position in bytes at which the stream should start
     * @param rangeEnd (optional) the position in bytes at which the stream should end
     * @returns a stream to read from
     */
    TemporaryFileManager.prototype.getFileStream = function (filename, user, rangeStart, rangeEnd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.permissionSystem.checkForTemporaryFile(user, types_1.TemporaryFilePermission.View, filename)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("User tried to display a file from a content object without proper permissions.");
                            throw new H5pError_1.default('h5p-server:temporary-file-missing-delete-permission', {}, 403);
                        }
                        log.info("Getting temporary file ".concat(filename));
                        return [2 /*return*/, this.storage.getFileStream(filename, user, rangeStart, rangeEnd)];
                }
            });
        });
    };
    /**
     * Returns a information about a temporary file.
     * Throws an exception if the file does not exist.
     * @param filename the relative path inside the library
     * @param user the user who wants to access the file
     * @returns the file stats
     */
    TemporaryFileManager.prototype.getFileStats = function (filename, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.permissionSystem.checkForTemporaryFile(user, types_1.TemporaryFilePermission.View, filename)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("User tried to get stats of a content object without proper permissions.");
                            throw new H5pError_1.default('h5p-server:temporary-file-missing-view-permission', {}, 403);
                        }
                        return [2 /*return*/, this.storage.getFileStats(filename, user)];
                }
            });
        });
    };
    /**
     * Tries generating a unique filename for the file by appending a
     * id to it. Checks in storage if the filename already exists and
     * tries again if necessary.
     * Throws an H5PError if no filename could be determined.
     * @param filename the filename to check
     * @param user the user who is saving the file
     * @returns the unique filename
     */
    TemporaryFileManager.prototype.generateUniqueName = function (filename, user) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, FilenameGenerator_1.default)(filename, this.storage.sanitizeFilename
                        ? function (f) { return _this.storage.sanitizeFilename(f); }
                        : function (f) { return f; }, function (f) { return _this.storage.fileExists(f, user); })];
            });
        });
    };
    return TemporaryFileManager;
}());
exports.default = TemporaryFileManager;