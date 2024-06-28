"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleLockProvider = exports.UrlGenerator = exports.cacheImplementations = exports.fsImplementations = exports.utils = exports.fs = exports.LaissezFairePermissionSystem = exports.H5PConfig = exports.UserDataPermission = exports.TemporaryFilePermission = exports.GeneralPermission = exports.ContentPermission = exports.PackageExporter = exports.Logger = exports.LibraryName = exports.LibraryManager = exports.LibraryAdministration = exports.InstalledLibrary = exports.H5PPlayer = exports.H5pError = exports.H5PEditor = exports.H5PAjaxEndpoint = exports.ContentUserDataManager = exports.ContentTypeCache = exports.ContentFileScanner = exports.streamToString = exports.AjaxSuccessResponse = exports.AjaxErrorResponse = exports.AggregateH5pError = void 0;
// Classes
var H5PEditor_1 = require("./H5PEditor");
exports.H5PEditor = H5PEditor_1.default;
var H5pError_1 = require("./helpers/H5pError");
exports.H5pError = H5pError_1.default;
var H5PPlayer_1 = require("./H5PPlayer");
exports.H5PPlayer = H5PPlayer_1.default;
var InstalledLibrary_1 = require("./InstalledLibrary");
exports.InstalledLibrary = InstalledLibrary_1.default;
var LibraryName_1 = require("./LibraryName");
exports.LibraryName = LibraryName_1.default;
var PackageExporter_1 = require("./PackageExporter");
exports.PackageExporter = PackageExporter_1.default;
var H5PAjaxEndpoint_1 = require("./H5PAjaxEndpoint");
exports.H5PAjaxEndpoint = H5PAjaxEndpoint_1.default;
var ContentTypeCache_1 = require("./ContentTypeCache");
exports.ContentTypeCache = ContentTypeCache_1.default;
var AggregateH5pError_1 = require("./helpers/AggregateH5pError");
exports.AggregateH5pError = AggregateH5pError_1.default;
var AjaxErrorResponse_1 = require("./helpers/AjaxErrorResponse");
exports.AjaxErrorResponse = AjaxErrorResponse_1.default;
var AjaxSuccessResponse_1 = require("./helpers/AjaxSuccessResponse");
exports.AjaxSuccessResponse = AjaxSuccessResponse_1.default;
var StreamHelpers_1 = require("./helpers/StreamHelpers");
Object.defineProperty(exports, "streamToString", { enumerable: true, get: function () { return StreamHelpers_1.streamToString; } });
var Logger_1 = require("./helpers/Logger");
exports.Logger = Logger_1.default;
var H5PConfig_1 = require("./implementation/H5PConfig");
exports.H5PConfig = H5PConfig_1.default;
var fs_1 = require("./implementation/fs");
exports.fs = fs_1.default;
var utils = require("./implementation/utils");
exports.utils = utils;
var DirectoryTemporaryFileStorage_1 = require("./implementation/fs/DirectoryTemporaryFileStorage");
var FileContentStorage_1 = require("./implementation/fs/FileContentStorage");
var FileLibraryStorage_1 = require("./implementation/fs/FileLibraryStorage");
var FileContentUserDataStorage_1 = require("./implementation/fs/FileContentUserDataStorage");
var JsonStorage_1 = require("./implementation/fs/JsonStorage");
var InMemoryStorage_1 = require("./implementation/InMemoryStorage");
var CachedLibraryStorage_1 = require("./implementation/cache/CachedLibraryStorage");
var CachedKeyValueStorage_1 = require("./implementation/cache/CachedKeyValueStorage");
var ContentFileScanner_1 = require("./ContentFileScanner");
Object.defineProperty(exports, "ContentFileScanner", { enumerable: true, get: function () { return ContentFileScanner_1.ContentFileScanner; } });
var LibraryManager_1 = require("./LibraryManager");
exports.LibraryManager = LibraryManager_1.default;
var ContentUserDataManager_1 = require("./ContentUserDataManager");
exports.ContentUserDataManager = ContentUserDataManager_1.default;
var UrlGenerator_1 = require("./UrlGenerator");
exports.UrlGenerator = UrlGenerator_1.default;
var SimpleLockProvider_1 = require("./implementation/SimpleLockProvider");
exports.SimpleLockProvider = SimpleLockProvider_1.default;
var LaissezFairePermissionSystem_1 = require("./implementation/LaissezFairePermissionSystem");
Object.defineProperty(exports, "LaissezFairePermissionSystem", { enumerable: true, get: function () { return LaissezFairePermissionSystem_1.LaissezFairePermissionSystem; } });
// Interfaces
var types_1 = require("./types");
Object.defineProperty(exports, "ContentPermission", { enumerable: true, get: function () { return types_1.ContentPermission; } });
Object.defineProperty(exports, "GeneralPermission", { enumerable: true, get: function () { return types_1.GeneralPermission; } });
Object.defineProperty(exports, "TemporaryFilePermission", { enumerable: true, get: function () { return types_1.TemporaryFilePermission; } });
Object.defineProperty(exports, "UserDataPermission", { enumerable: true, get: function () { return types_1.UserDataPermission; } });
// Adapters
var LibraryAdministration_1 = require("./LibraryAdministration");
exports.LibraryAdministration = LibraryAdministration_1.default;
var fsImplementations = {
    DirectoryTemporaryFileStorage: DirectoryTemporaryFileStorage_1.default,
    FileContentStorage: FileContentStorage_1.default,
    FileLibraryStorage: FileLibraryStorage_1.default,
    InMemoryStorage: InMemoryStorage_1.default,
    JsonStorage: JsonStorage_1.default,
    FileContentUserDataStorage: FileContentUserDataStorage_1.default
};
exports.fsImplementations = fsImplementations;
var cacheImplementations = {
    CachedKeyValueStorage: CachedKeyValueStorage_1.default,
    CachedLibraryStorage: CachedLibraryStorage_1.default
};
exports.cacheImplementations = cacheImplementations;
