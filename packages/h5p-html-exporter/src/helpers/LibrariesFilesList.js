"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var h5p_server_1 = require("@lumieducation/h5p-server");
/**
 * Collects lists of files grouped by libraries.
 */
var LibrariesFilesList = /** @class */ (function () {
    function LibrariesFilesList() {
        this.usedFiles = {};
    }
    /**
     * Adds a library file to the list.
     * @param library
     * @param filename
     */
    LibrariesFilesList.prototype.addFile = function (library, filename) {
        var ubername = h5p_server_1.LibraryName.toUberName(library);
        if (!this.usedFiles[ubername]) {
            this.usedFiles[ubername] = [];
        }
        this.usedFiles[ubername].push(filename);
    };
    /**
     * Checks if a library file is in the list
     * @param library
     * @param filename
     */
    LibrariesFilesList.prototype.checkFile = function (library, filename) {
        var _a;
        return (_a = this.usedFiles[h5p_server_1.LibraryName.toUberName(library)]) === null || _a === void 0 ? void 0 : _a.includes(filename);
    };
    /**
     * Clears the list of all libraries.
     */
    LibrariesFilesList.prototype.clear = function () {
        this.usedFiles = {};
    };
    return LibrariesFilesList;
}());
exports.default = LibrariesFilesList;
