"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var H5pError_1 = require("./helpers/H5pError");
var LibraryName = /** @class */ (function () {
    /**
     * Constructs the object and validates the parameters.
     * @throws errors if the validation fails
     */
    function LibraryName(machineName, majorVersion, minorVersion) {
        this.machineName = machineName;
        this.majorVersion = majorVersion;
        this.minorVersion = minorVersion;
        if (typeof this.majorVersion === 'string') {
            this.majorVersion = Number.parseInt(this.majorVersion, 10);
        }
        if (typeof this.minorVersion === 'string') {
            this.minorVersion = Number.parseInt(this.minorVersion, 10);
        }
        LibraryName.validate(this);
    }
    /**
     * Checks if two libraries are identical.
     * @param library1
     * @param library2
     */
    LibraryName.equal = function (library1, library2) {
        return (library1.machineName === library2.machineName &&
            library1.majorVersion === library2.majorVersion &&
            library1.minorVersion === library2.minorVersion);
    };
    /**
     * Creates a library object from a library name. Also validates the ubername
     * to protect against attempts to manipulate the server by creating library
     * names.
     * @param ubername The library name in a format "H5P.Example-1.0" or
     * "H5P.Example 1.0" (see options)
     * @param restricted true if the library is restricted
     * @param useWhitespace true if the parser should accept names like
     * "H5P.Library 1.0"
     * @param useHyphen true if the parser should accept names like
     * "H5P.Library-1.0"
     * @returns undefined if the name could not be parsed
     * @throws H5pError with 400 when the ubername is invalid
     */
    LibraryName.fromUberName = function (ubername, options) {
        if (options === void 0) { options = {
            useHyphen: true,
            useWhitespace: false
        }; }
        if (!options.useHyphen && !options.useWhitespace) {
            throw new Error('You must call fromUberName with either the useHyphen or useWhitespace option, or both!');
        }
        var nameRegex = options.useHyphen && options.useWhitespace
            ? /^([\w.]+)[-\s](\d+)\.(\d+)$/i
            : options.useHyphen
                ? /^([\w.]+)-(\d+)\.(\d+)$/i
                : /^([\w.]+)\s(\d+)\.(\d+)$/i;
        var result = nameRegex.exec(ubername);
        if (!result) {
            var example = '';
            if (options.useHyphen && options.useWhitespace) {
                example = 'H5P.Example-1.0 or H5P.Example 1.0';
            }
            else if (options.useHyphen && !options.useWhitespace) {
                example = 'H5P.Example-1.0';
            }
            else {
                example = 'H5P.Example 1.0';
            }
            throw new H5pError_1.default('invalid-ubername-pattern', {
                example: example,
                name: ubername
            }, 400);
        }
        return new LibraryName(result[1], Number.parseInt(result[2], 10), Number.parseInt(result[3], 10));
    };
    /**
     * Returns the ubername for a library (e.g. H5P.ExampleLibrary-1.0).
     * Also validates the ubername to protect against attempts to manipulate the
     * server by creating invalid ubernames.
     */
    LibraryName.toUberName = function (libraryName, options) {
        if (options === void 0) { options = {
            useHyphen: true,
            useWhitespace: false
        }; }
        if (options.useHyphen) {
            var ubername = "".concat(libraryName.machineName, "-").concat(libraryName.majorVersion, ".").concat(libraryName.minorVersion);
            if (!/^([\w.]+)-(\d+)\.(\d+)$/.test(ubername)) {
                throw new Error("Ubername ".concat(ubername, " is not a valid ubername with hyphen separator."));
            }
            return ubername;
        }
        if (options.useWhitespace) {
            var ubername = "".concat(libraryName.machineName, " ").concat(libraryName.majorVersion, ".").concat(libraryName.minorVersion);
            if (!/^([\w.]+)\s(\d+)\.(\d+)$/.test(ubername)) {
                throw new Error("Ubername ".concat(ubername, " is not a valid ubername with whitespace separator."));
            }
            return ubername;
        }
        throw new Error('You must specify either the useHyphen or useWhitespace option');
    };
    /**
     * Checks if the library name is valid.
     * @throws errors if the library name is invalid
     */
    LibraryName.validate = function (library) {
        LibraryName.validateMachineName(library.machineName);
        if (typeof library.majorVersion !== 'number' ||
            Number.isNaN(library.majorVersion)) {
            throw new Error("Major version of library is invalid. Only numbers are allowed");
        }
        if (typeof library.minorVersion !== 'number' ||
            Number.isNaN(library.minorVersion)) {
            throw new Error("Minor version of library is invalid. Only numbers are allowed");
        }
    };
    /**
     * Throws an error if the machine name is not valid.
     * @param machineName
     */
    LibraryName.validateMachineName = function (machineName) {
        if (!/^[\w.]+$/i.test(machineName)) {
            throw new Error("Machine name \"".concat(machineName, "\" is illegal."));
        }
    };
    return LibraryName;
}());
exports.default = LibraryName;