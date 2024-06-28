"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFilename = exports.checkFilename = void 0;
var H5pError_1 = require("../../helpers/H5pError");
var utils_1 = require("../utils");
function checkFilename(filename) {
    if (/\.\.\//.test(filename)) {
        throw new H5pError_1.default('storage-file-implementations:illegal-relative-filename', { filename: filename }, 400);
    }
    if (filename.startsWith('/')) {
        throw new H5pError_1.default('storage-file-implementations:illegal-absolute-filename', { filename: filename }, 400);
    }
}
exports.checkFilename = checkFilename;
/**
 * Sanitizes a filename or path by shortening it to the specified maximum length
 * and removing the invalid characters in the RegExp. If you don't specify a
 * RegExp a very strict invalid character list will be used that only leaves
 * alphanumeric filenames untouched.
 * @param filename the filename or path (with UNIX slash separator) to sanitize
 * @param maxFileLength the filename will be shortened to this length
 * @param invalidCharactersRegex these characters will be removed from the
 * filename
 * @returns the cleaned filename
 */
function sanitizeFilename(filename, maxFileLength, invalidCharactersRegex) {
    return (0, utils_1.generalizedSanitizeFilename)(filename, invalidCharactersRegex !== null && invalidCharactersRegex !== void 0 ? invalidCharactersRegex : /[^A-Za-z0-9\-._!()/]/g, maxFileLength);
}
exports.sanitizeFilename = sanitizeFilename;