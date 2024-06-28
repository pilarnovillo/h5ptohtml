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
var h5p_server_1 = require("@lumieducation/h5p-server");
var _2020_1 = require("ajv/dist/2020");
/**
 * Keeps track of validation functions and structures and caches them in memory.
 */
var ValidatorRepository = /** @class */ (function () {
    function ValidatorRepository(getLibraryFileAsJson) {
        this.getLibraryFileAsJson = getLibraryFileAsJson;
        this.validatorCache = {};
        this.ajv = new _2020_1.default();
    }
    /**
     * Gets the validator function for the op schema.
     * @param libraryName
     */
    ValidatorRepository.prototype.getOpSchemaValidator = function (libraryName) {
        return __awaiter(this, void 0, void 0, function () {
            var ubername, validator, schemaJson, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ubername = h5p_server_1.LibraryName.toUberName(libraryName);
                        if (((_a = this.validatorCache[ubername]) === null || _a === void 0 ? void 0 : _a.op) !== undefined) {
                            return [2 /*return*/, this.validatorCache[ubername].op];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getLibraryFileAsJson(libraryName, 'opSchema.json')];
                    case 2:
                        schemaJson = _b.sent();
                        validator = this.ajv.compile(schemaJson);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error('Error while getting op schema:', error_1);
                        this.validatorCache[ubername].op = null;
                        return [2 /*return*/, null];
                    case 4:
                        if (!this.validatorCache[ubername]) {
                            this.validatorCache[ubername] = {};
                        }
                        this.validatorCache[ubername].op = validator;
                        return [2 /*return*/, validator];
                }
            });
        });
    };
    /**
     * Gets the validator function for snapshots.
     * @param libraryName
     */
    ValidatorRepository.prototype.getSnapshotSchemaValidator = function (libraryName) {
        return __awaiter(this, void 0, void 0, function () {
            var ubername, validator, schemaJson, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ubername = h5p_server_1.LibraryName.toUberName(libraryName);
                        if (((_a = this.validatorCache[ubername]) === null || _a === void 0 ? void 0 : _a.snapshot) !== undefined) {
                            return [2 /*return*/, this.validatorCache[ubername].snapshot];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getLibraryFileAsJson(libraryName, 'snapshotSchema.json')];
                    case 2:
                        schemaJson = _b.sent();
                        validator = this.ajv.compile(schemaJson);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        console.error('Error while getting op schema:', error_2);
                        this.validatorCache[ubername].snapshot = null;
                        return [2 /*return*/, null];
                    case 4:
                        if (!this.validatorCache[ubername]) {
                            this.validatorCache[ubername] = {};
                        }
                        this.validatorCache[ubername].snapshot = validator;
                        return [2 /*return*/, validator];
                }
            });
        });
    };
    /**
     * Gets the logic check structure for ops
     * @param libraryName
     * @returns the logical structure; note that even if the structure is typed
     * at the moment, is not validated when read from storage, so it is possible
     * that a malformed file in a library does not conform to the types
     */
    ValidatorRepository.prototype.getOpLogicCheck = function (libraryName) {
        return __awaiter(this, void 0, void 0, function () {
            var ubername, logicCheck, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ubername = h5p_server_1.LibraryName.toUberName(libraryName);
                        if (((_a = this.validatorCache[ubername]) === null || _a === void 0 ? void 0 : _a.opLogicCheck) !== undefined) {
                            return [2 /*return*/, this.validatorCache[ubername].opLogicCheck];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getLibraryFileAsJson(libraryName, 'opLogicCheck.json')];
                    case 2:
                        logicCheck = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        console.error('Error while getting op schema:', error_3);
                        this.validatorCache[ubername].opLogicCheck = null;
                        return [2 /*return*/, null];
                    case 4:
                        if (!this.validatorCache[ubername]) {
                            this.validatorCache[ubername] = {};
                        }
                        this.validatorCache[ubername].opLogicCheck = logicCheck;
                        return [2 /*return*/, logicCheck];
                }
            });
        });
    };
    /**
     * Gets the logic checks for snapshots.
     * @param libraryName
     * @returns the logical structure; note that even if the structure is typed
     * at the moment, is not validated when read from storage, so it is possible
     * that a malformed file in a library does not conform to the types
     */
    ValidatorRepository.prototype.getSnapshotLogicCheck = function (libraryName) {
        return __awaiter(this, void 0, void 0, function () {
            var ubername, logicCheck, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ubername = h5p_server_1.LibraryName.toUberName(libraryName);
                        if (((_a = this.validatorCache[ubername]) === null || _a === void 0 ? void 0 : _a.snapshotLogicCheck) !== undefined) {
                            return [2 /*return*/, this.validatorCache[ubername].snapshotLogicCheck];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getLibraryFileAsJson(libraryName, 'snapshotLogicCheck.json')];
                    case 2:
                        logicCheck = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        console.error('Error while getting op schema:', error_4);
                        this.validatorCache[ubername].snapshotLogicCheck = null;
                        return [2 /*return*/, null];
                    case 4:
                        if (!this.validatorCache[ubername]) {
                            this.validatorCache[ubername] = {};
                        }
                        this.validatorCache[ubername].snapshotLogicCheck = logicCheck;
                        return [2 /*return*/, logicCheck];
                }
            });
        });
    };
    return ValidatorRepository;
}());
exports.default = ValidatorRepository;
