"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("debug");
var LogLevelNumber;
(function (LogLevelNumber) {
    LogLevelNumber[LogLevelNumber["error"] = 0] = "error";
    LogLevelNumber[LogLevelNumber["warn"] = 1] = "warn";
    LogLevelNumber[LogLevelNumber["info"] = 2] = "info";
    LogLevelNumber[LogLevelNumber["verbose"] = 3] = "verbose";
    LogLevelNumber[LogLevelNumber["debug"] = 4] = "debug";
    LogLevelNumber[LogLevelNumber["silly"] = 5] = "silly";
})(LogLevelNumber || (LogLevelNumber = {}));
var Logger = /** @class */ (function () {
    function Logger(scope) {
        var _a;
        this.scope = scope;
        this.DEBUG =
            this.ERROR =
                this.INFO =
                    this.SILLY =
                        this.VERBOSE =
                            this.WARN =
                                (0, debug_1.default)("h5p:".concat(this.scope));
        this.logLevel =
            ((_a = process.env.LOG_LEVEL) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'info';
    }
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.debug) {
            this.DEBUG.apply(this, args);
        }
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.error) {
            this.ERROR.apply(this, args);
        }
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.info) {
            this.INFO.apply(this, args);
        }
    };
    Logger.prototype.silly = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.silly) {
            this.SILLY.apply(this, args);
        }
    };
    Logger.prototype.verbose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.verbose) {
            this.VERBOSE.apply(this, args);
        }
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.warn) {
            this.WARN.apply(this, args);
        }
    };
    return Logger;
}());
exports.default = Logger;