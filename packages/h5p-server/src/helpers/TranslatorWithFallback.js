"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("./Logger");
var log = new Logger_1.default('TranslatorWithFallback');
/**
 * Performs localizations with a custom fallback strategy: It tries all the
 * namespaces specified in the tryLocalize(...) call or in the constructor (in
 * the order of the list). If no localization was found, it will fallback to the
 * source string passed to tryLocalize.
 */
var TranslatorWithFallback = /** @class */ (function () {
    /**
     *
     */
    function TranslatorWithFallback(translationCallback, namespaces) {
        if (namespaces === void 0) { namespaces = []; }
        this.translationCallback = translationCallback;
        this.namespaces = namespaces;
    }
    /**
     * Tries localizing the key. If it fails (indicated by the fact that the key
     * is part of the localized string), it will return the original source
     * string. Tries through all the namespaces specified before falling back.
     * @param key the key to look up the translation in the i18n data
     * @param sourceString the original English string received from the Hub
     * @param language the desired language
     * @param namespaces (optional) the namespaces to try. Will default to the
     * namespaces passed into the constructor if unspecified.
     * @returns the localized string or the original English source string
     */
    TranslatorWithFallback.prototype.tryLocalize = function (key, sourceString, language, namespaces) {
        log.debug("Trying to localize key ".concat(key, " into ").concat(language));
        for (var _i = 0, _a = namespaces !== null && namespaces !== void 0 ? namespaces : this.namespaces; _i < _a.length; _i++) {
            var namespace = _a[_i];
            log.debug("Trying namespace ".concat(namespace));
            var localized = this.translationCallback("".concat(namespace, ":").concat(key), language);
            if (!localized.includes(key)) {
                log.debug("Successfully localized to ".concat(localized));
                return localized;
            }
        }
        log.debug("Falling back to default string: ".concat(sourceString));
        return sourceString;
    };
    return TranslatorWithFallback;
}());
exports.default = TranslatorWithFallback;
