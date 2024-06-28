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
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var get_all_files_1 = require("get-all-files");
var Logger_1 = require("../../helpers/Logger");
var filenameUtils_1 = require("./filenameUtils");
var log = new Logger_1.default('FileContentUserDataStorage');
/**
 * Saves user data in JSON files on the disk. It creates one file per content
 * object. There's a separate file for user states and one for the finished data.
 * Each file contains a list of all states or finished data objects.
 */
var FileContentUserDataStorage = /** @class */ (function () {
    function FileContentUserDataStorage(directory) {
        this.directory = directory;
        if (!fs_extra_1.default.pathExistsSync(directory)) {
            log.debug('Creating directory', directory);
            fs_extra_1.default.mkdirpSync(directory);
        }
    }
    FileContentUserDataStorage.prototype.getContentUserData = function (contentId, dataType, subContentId, userId, contextId) {
        return __awaiter(this, void 0, void 0, function () {
            var file, dataList, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = this.getUserDataFilePath(contentId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.default.readJSON(file)];
                    case 2:
                        dataList = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        log.error('getContentUserData', 'Error reading file', file, 'Error:', error_1);
                        return [2 /*return*/, null];
                    case 4:
                        try {
                            return [2 /*return*/, (dataList.find(function (data) {
                                    return data.dataType === dataType &&
                                        data.subContentId === subContentId &&
                                        data.userId === userId &&
                                        data.contextId === contextId;
                                }) || null)];
                        }
                        catch (error) {
                            log.error('getContentUserData', 'Corrupt file', file, 'Error:', error);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.getContentUserDataByUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var files, result, _i, files_1, file, data, error_2, _a, data_1, entry;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, get_all_files_1.getAllFiles)(this.directory).toArray()];
                    case 1:
                        files = _b.sent();
                        result = [];
                        _i = 0, files_1 = files;
                        _b.label = 2;
                    case 2:
                        if (!(_i < files_1.length)) return [3 /*break*/, 8];
                        file = files_1[_i];
                        if (!file.endsWith('-userdata.json')) {
                            return [3 /*break*/, 7];
                        }
                        data = void 0;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs_extra_1.default.readJSON(file)];
                    case 4:
                        data = _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _b.sent();
                        log.error('getContentUserDataByUser', 'Error reading file', file, 'Error:', error_2, 'Data in the corrupt file is not part of the list');
                        return [3 /*break*/, 6];
                    case 6:
                        try {
                            for (_a = 0, data_1 = data; _a < data_1.length; _a++) {
                                entry = data_1[_a];
                                if (entry.userId === user.id) {
                                    result.push(entry);
                                }
                            }
                        }
                        catch (error) {
                            log.error('getContentUserDataByUser', 'Error going through data in file', file, 'Error:', error);
                        }
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/, result];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.createOrUpdateContentUserData = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, oldData, error_3, newUserData, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filename = this.getUserDataFilePath(userData.contentId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.default.readJSON(filename)];
                    case 2:
                        oldData = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        log.debug('createOrUpdateContentUserData', 'Error while reading user data file for contentId', userData.contentId, '(error:', error_3, '). Seeding with empty list.');
                        oldData = [];
                        return [3 /*break*/, 4];
                    case 4:
                        newUserData = oldData.filter(function (data) {
                            return data.contentId !== userData.contentId ||
                                data.dataType !== userData.dataType ||
                                data.subContentId !== userData.subContentId ||
                                data.userId !== userData.userId ||
                                data.contextId !== userData.contextId;
                        });
                        newUserData.push(userData);
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, fs_extra_1.default.writeJSON(filename, newUserData)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_4 = _a.sent();
                        log.error('createOrUpdateContentUserData', 'Error while writing user data to file for contentId', userData.contentId, 'Error:', error_4);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.deleteInvalidatedContentUserData = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, oldData, error_5, newUserData, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filename = this.getUserDataFilePath(contentId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.default.readJSON(filename)];
                    case 2:
                        oldData = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        log.debug('deleteInvalidatedContentUserData', 'Error while reading user data file for contentId', contentId, '(error:', error_5, '). Seeding with empty list.');
                        oldData = [];
                        return [3 /*break*/, 4];
                    case 4:
                        newUserData = oldData.filter(function (data) { return data.contentId !== contentId || !data.invalidate; });
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, fs_extra_1.default.writeJSON(filename, newUserData)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_6 = _a.sent();
                        log.error('deleteInvalidatedContentUserData', 'Error while writing user data to file for contentId', contentId, 'Error:', error_6);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.deleteAllContentUserDataByUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var files, _i, files_2, file, data, error_7, newData, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, get_all_files_1.getAllFiles)(this.directory).toArray()];
                    case 1:
                        files = _a.sent();
                        _i = 0, files_2 = files;
                        _a.label = 2;
                    case 2:
                        if (!(_i < files_2.length)) return [3 /*break*/, 11];
                        file = files_2[_i];
                        if (!file.endsWith('-userdata.json')) {
                            return [3 /*break*/, 10];
                        }
                        data = void 0;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs_extra_1.default.readJSON(file)];
                    case 4:
                        data = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_7 = _a.sent();
                        log.error('deleteAllContentUserDataByUser', 'Error reading file', file, 'Error:', error_7, 'Data in the corrupt file is not part of the list');
                        return [3 /*break*/, 6];
                    case 6:
                        newData = void 0;
                        try {
                            newData = data === null || data === void 0 ? void 0 : data.filter(function (d) { return d.userId !== user.id; });
                        }
                        catch (error) {
                            log.error('deleteAllContentUserDataByUser', 'Error going through data in file', file, 'Error:', error);
                        }
                        if (!newData) return [3 /*break*/, 10];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, fs_extra_1.default.writeJson(file, newData)];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        error_8 = _a.sent();
                        log.error('deleteAllContentUserDataByUser', 'Error writing data to file', file, 'Error:', error_8);
                        return [3 /*break*/, 10];
                    case 10:
                        _i++;
                        return [3 /*break*/, 2];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.deleteAllContentUserDataByContentId = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var file, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = this.getUserDataFilePath(contentId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.default.unlink(file)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_9 = _a.sent();
                        log.error('deleteAllContentUserDataByContentId', 'Could not delete file', file, 'Error:', error_9);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.getContentUserDataByContentIdAndUser = function (contentId, userId, contextId) {
        return __awaiter(this, void 0, void 0, function () {
            var file, dataList, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = this.getUserDataFilePath(contentId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.default.readJSON(file)];
                    case 2:
                        dataList = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_10 = _a.sent();
                        log.error('getContentUserDataByContentIdAndUser', 'Error reading file', file, 'Error:', error_10);
                        return [2 /*return*/, []];
                    case 4:
                        try {
                            return [2 /*return*/, dataList.filter(function (data) { return data.userId === userId && data.contextId == contextId; })];
                        }
                        catch (error) {
                            log.error('getContentUserDataByContentIdAndUser', 'Corrupt file', file);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.createOrUpdateFinishedData = function (finishedData) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, oldData, error_11, newData, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filename = this.getFinishedFilePath(finishedData.contentId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.default.readJSON(filename)];
                    case 2:
                        oldData = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_11 = _a.sent();
                        log.debug('createOrUpdateFinishedData', 'Error while reading finished file for contentId', finishedData.contentId, '(error:', error_11, '). Seeding with empty list.');
                        oldData = [];
                        return [3 /*break*/, 4];
                    case 4:
                        newData = oldData.filter(function (data) { return data.userId !== finishedData.userId; });
                        newData.push(finishedData);
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, fs_extra_1.default.writeJSON(filename, newData)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_12 = _a.sent();
                        log.error('createOrUpdateFinishedData', 'Error while writing finished data to file for contentId', finishedData.contentId, 'Error:', error_12);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.getFinishedDataByContentId = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var file, finishedList, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = this.getFinishedFilePath(contentId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.default.readJSON(file)];
                    case 2:
                        finishedList = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_13 = _a.sent();
                        log.error('getFinishedDataByContentId', 'Error reading file', file, 'Error:', error_13);
                        return [2 /*return*/, undefined];
                    case 4:
                        if (Array.isArray(finishedList)) {
                            return [2 /*return*/, finishedList];
                        }
                        else {
                            log.error('getFinishedDataByContentId', 'Corrupt file', file);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.getFinishedDataByUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var files, result, _i, files_3, file, data, error_14, _a, data_2, entry;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, get_all_files_1.getAllFiles)(this.directory).toArray()];
                    case 1:
                        files = _b.sent();
                        result = [];
                        _i = 0, files_3 = files;
                        _b.label = 2;
                    case 2:
                        if (!(_i < files_3.length)) return [3 /*break*/, 8];
                        file = files_3[_i];
                        if (!file.endsWith('-finished.json')) {
                            return [3 /*break*/, 7];
                        }
                        data = void 0;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs_extra_1.default.readJSON(file)];
                    case 4:
                        data = _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_14 = _b.sent();
                        log.error('getFinishedDataByUser', 'Error reading file', file, 'Error:', error_14, 'Data in the corrupt file is not part of the list');
                        return [3 /*break*/, 6];
                    case 6:
                        try {
                            for (_a = 0, data_2 = data; _a < data_2.length; _a++) {
                                entry = data_2[_a];
                                if (entry.userId === user.id) {
                                    result.push(entry);
                                }
                            }
                        }
                        catch (error) {
                            log.error('getFinishedDataByUser', 'Error going through data in file', file, 'Error:', error);
                        }
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/, result];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.deleteFinishedDataByContentId = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var file, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = this.getFinishedFilePath(contentId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.default.unlink(file)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_15 = _a.sent();
                        log.error('deleteFinishedDataByContentId', 'Could not delete file', file, 'Error:', error_15);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.deleteFinishedDataByUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var files, _i, files_4, file, data, error_16, newData, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, get_all_files_1.getAllFiles)(this.directory).toArray()];
                    case 1:
                        files = _a.sent();
                        _i = 0, files_4 = files;
                        _a.label = 2;
                    case 2:
                        if (!(_i < files_4.length)) return [3 /*break*/, 11];
                        file = files_4[_i];
                        if (!file.endsWith('-finished.json')) {
                            return [3 /*break*/, 10];
                        }
                        data = void 0;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs_extra_1.default.readJSON(file)];
                    case 4:
                        data = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_16 = _a.sent();
                        log.error('deleteFinishedDataByUser', 'Error reading file', file, 'Error:', error_16, 'Data in the corrupt file is not part of the list');
                        return [3 /*break*/, 6];
                    case 6:
                        newData = void 0;
                        try {
                            newData = data === null || data === void 0 ? void 0 : data.filter(function (d) { return d.userId !== user.id; });
                        }
                        catch (error) {
                            log.error('deleteFinishedDataByUser', 'Error going through data in file', file, 'Error:', error);
                        }
                        if (!newData) return [3 /*break*/, 10];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, fs_extra_1.default.writeJson(file, newData)];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        error_17 = _a.sent();
                        log.error('deleteFinishedDataByUser', 'Error writing data to file', file, 'Error:', error_17);
                        return [3 /*break*/, 10];
                    case 10:
                        _i++;
                        return [3 /*break*/, 2];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    FileContentUserDataStorage.prototype.getUserDataFilePath = function (contentId) {
        (0, filenameUtils_1.checkFilename)(contentId);
        return path_1.default.join(this.directory, (0, filenameUtils_1.sanitizeFilename)("".concat(contentId, "-userdata.json"), 80, /[^A-Za-z0-9\-._]/g));
    };
    FileContentUserDataStorage.prototype.getFinishedFilePath = function (contentId) {
        (0, filenameUtils_1.checkFilename)(contentId);
        return path_1.default.join(this.directory, (0, filenameUtils_1.sanitizeFilename)("".concat(contentId, "-finished.json"), 80, /[^A-Za-z0-9\-._]/g));
    };
    return FileContentUserDataStorage;
}());
exports.default = FileContentUserDataStorage;