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
var LibraryName_1 = require("./LibraryName");
var Logger_1 = require("./helpers/Logger");
var log = new Logger_1.default('DependencyGetter');
/**
 * Gets the libraries required to run a specific library.
 * Uses LibraryManager to get metadata for libraries.
 */
var DependencyGetter = /** @class */ (function () {
    function DependencyGetter(libraryStorage) {
        this.libraryStorage = libraryStorage;
        log.info("initialize");
    }
    /**
     * Gets all dependent libraries of the libraries in the list.
     * @param libraries the libraries whose dependencies should be retrieved
     * @param dynamic include dependencies that are part of the dynamicDependencies property or used in the content
     * @param editor include dependencies that are listed in editorDependencies
     * @param preloaded include regular dependencies that are included in preloadedDependencies
     * @param doNotAdd libraries in this list will not be added to the dependency list
     * @returns a list of libraries
     */
    DependencyGetter.prototype.getDependentLibraries = function (libraries_1, _a, doNotAdd_1) {
        return __awaiter(this, arguments, void 0, function (libraries, _b, doNotAdd) {
            var dependencies, _i, libraries_2, library;
            var _c = _b.dynamic, dynamic = _c === void 0 ? false : _c, _d = _b.editor, editor = _d === void 0 ? false : _d, _e = _b.preloaded, preloaded = _e === void 0 ? false : _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        log.info("getting dependent libraries for ".concat(libraries
                            .map(function (dep) {
                            return "".concat(dep.machineName, "-").concat(dep.majorVersion, ".").concat(dep.minorVersion);
                        })
                            .join(', ')));
                        dependencies = new Set();
                        _i = 0, libraries_2 = libraries;
                        _f.label = 1;
                    case 1:
                        if (!(_i < libraries_2.length)) return [3 /*break*/, 4];
                        library = libraries_2[_i];
                        return [4 /*yield*/, this.addDependenciesRecursive(new LibraryName_1.default(library.machineName, typeof library.majorVersion === 'string'
                                ? Number.parseInt(library.majorVersion, 10)
                                : library.majorVersion, typeof library.minorVersion === 'string'
                                ? Number.parseInt(library.minorVersion, 10)
                                : library.minorVersion), { preloaded: preloaded, editor: editor, dynamic: dynamic }, dependencies, doNotAdd)];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, Array.from(dependencies).map(function (str) {
                            return LibraryName_1.default.fromUberName(str);
                        })];
                }
            });
        });
    };
    /**
     * Recursively walks through all dependencies of a library and adds them to the set libraries.
     * @param library the library that is currently being processed
     * @param libraries the set to add to
     * @returns the set that was added to (same as libraries; can be used to chain the call)
     */
    DependencyGetter.prototype.addDependenciesRecursive = function (library_1, _a, libraries_1, doNotAdd_1) {
        return __awaiter(this, arguments, void 0, function (library, _b, libraries, doNotAdd) {
            var metadata, _c;
            var _d = _b.dynamic, dynamic = _d === void 0 ? false : _d, _e = _b.editor, editor = _e === void 0 ? false : _e, _f = _b.preloaded, preloaded = _f === void 0 ? false : _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        log.debug("adding dependencies recursively");
                        // we use strings to make equality comparison easier
                        if (libraries.has(LibraryName_1.default.toUberName(library))) {
                            return [2 /*return*/, null];
                        }
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.libraryStorage.getLibrary(library)];
                    case 2:
                        metadata = _g.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _c = _g.sent();
                        // We silently ignore missing libraries, as this can happen with
                        // 'fake libraries' used by the H5P client (= libraries which are
                        // referenced in the parameters, but don't exist)
                        return [2 /*return*/, libraries];
                    case 4:
                        if (!(doNotAdd === null || doNotAdd === void 0 ? void 0 : doNotAdd.some(function (dna) { return LibraryName_1.default.equal(dna, library); }))) {
                            libraries.add(LibraryName_1.default.toUberName(library));
                        }
                        if (!(preloaded && metadata.preloadedDependencies)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.addDependenciesToSet(metadata.preloadedDependencies, { preloaded: preloaded, editor: editor, dynamic: dynamic }, libraries)];
                    case 5:
                        _g.sent();
                        _g.label = 6;
                    case 6:
                        if (!(editor && metadata.editorDependencies)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.addDependenciesToSet(metadata.editorDependencies, { preloaded: preloaded, editor: editor, dynamic: dynamic }, libraries)];
                    case 7:
                        _g.sent();
                        _g.label = 8;
                    case 8:
                        if (!(dynamic && metadata.dynamicDependencies)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.addDependenciesToSet(metadata.dynamicDependencies, { preloaded: preloaded, editor: editor, dynamic: dynamic }, libraries)];
                    case 9:
                        _g.sent();
                        _g.label = 10;
                    case 10:
                        if (dynamic) {
                            // TODO: recurse through semantic structure of content.json
                        }
                        return [2 /*return*/, libraries];
                }
            });
        });
    };
    /**
     * Adds all dependencies in the list to the set.
     */
    DependencyGetter.prototype.addDependenciesToSet = function (dependencies_1, _a, libraries_1, doNotAdd_1) {
        return __awaiter(this, arguments, void 0, function (dependencies, _b, libraries, doNotAdd) {
            var _i, dependencies_2, dependency;
            var _c = _b.dynamic, dynamic = _c === void 0 ? false : _c, _d = _b.editor, editor = _d === void 0 ? false : _d, _e = _b.preloaded, preloaded = _e === void 0 ? false : _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        log.info("adding dependencies to set");
                        _i = 0, dependencies_2 = dependencies;
                        _f.label = 1;
                    case 1:
                        if (!(_i < dependencies_2.length)) return [3 /*break*/, 4];
                        dependency = dependencies_2[_i];
                        return [4 /*yield*/, this.addDependenciesRecursive(new LibraryName_1.default(dependency.machineName, dependency.majorVersion, dependency.minorVersion), { preloaded: preloaded, editor: editor, dynamic: dynamic }, libraries, doNotAdd)];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DependencyGetter;
}());
exports.default = DependencyGetter;