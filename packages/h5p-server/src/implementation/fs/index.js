"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var H5PEditor_1 = require("../../H5PEditor");
var InMemoryStorage_1 = require("../InMemoryStorage");
var DirectoryTemporaryFileStorage_1 = require("./DirectoryTemporaryFileStorage");
var FileContentStorage_1 = require("./FileContentStorage");
var FileLibraryStorage_1 = require("./FileLibraryStorage");
function h5pfs(config, librariesPath, temporaryStoragePath, contentPath, contentUserDataStorage, contentStorage, translationCallback, urlGenerator, options) {
    return new H5PEditor_1.default(new InMemoryStorage_1.default(), config, new FileLibraryStorage_1.default(librariesPath), contentStorage || new FileContentStorage_1.default(contentPath), new DirectoryTemporaryFileStorage_1.default(temporaryStoragePath), translationCallback, urlGenerator, options, contentUserDataStorage);
}
exports.default = h5pfs;
