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
var types_1 = require("./types");
var Logger_1 = require("./helpers/Logger");
var H5pError_1 = require("./helpers/H5pError");
var log = new Logger_1.default('ContentUserDataManager');
/**
 * The ContentUserDataManager takes care of saving user data and states. It only
 * contains storage-agnostic functionality and depends on a
 * ContentUserDataStorage object to do the actual persistence.
 */
var ContentUserDataManager = /** @class */ (function () {
    /**
     * @param contentUserDataStorage The storage object
     * @param permissionSystem grants or rejects permissions
     */
    function ContentUserDataManager(contentUserDataStorage, permissionSystem) {
        this.contentUserDataStorage = contentUserDataStorage;
        this.permissionSystem = permissionSystem;
        log.info('initialize');
    }
    /**
     * Deletes a contentUserData object for given contentId and user id. Throws
     * errors if something goes wrong.
     * @param forUserId the user for which the contentUserData object should be
     * deleted
     * @param actingUser the user who is currently active
     */
    ContentUserDataManager.prototype.deleteAllContentUserDataByUser = function (forUserId, actingUser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.contentUserDataStorage) {
                            return [2 /*return*/];
                        }
                        log.debug("Deleting contentUserData for userId ".concat(forUserId));
                        return [4 /*yield*/, this.permissionSystem.checkForUserData(actingUser, types_1.UserDataPermission.DeleteState, undefined, forUserId)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("User tried delete content states without proper permissions.");
                            throw new H5pError_1.default('h5p-server:user-state-missing-delete-permission', {}, 403);
                        }
                        return [2 /*return*/, this.contentUserDataStorage.deleteAllContentUserDataByUser(actingUser)];
                }
            });
        });
    };
    /**
     * Deletes all user data of a content object, if its "invalidate" flag is
     * set. This method is normally called, if a content object was changed and
     * the user data has become invalid because of that.
     * @param contentId
     */
    ContentUserDataManager.prototype.deleteInvalidatedContentUserDataByContentId = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.contentUserDataStorage) {
                    return [2 /*return*/];
                }
                if (contentId) {
                    log.debug("Deleting invalidated contentUserData for contentId ".concat(contentId));
                    return [2 /*return*/, this.contentUserDataStorage.deleteInvalidatedContentUserData(contentId)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Deletes all states of a content object. Normally called when the content
     * object is deleted.
     * @param contentId
     * @param actingUser
     */
    ContentUserDataManager.prototype.deleteAllContentUserDataByContentId = function (contentId, actingUser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.contentUserDataStorage) {
                            return [2 /*return*/];
                        }
                        log.debug("Deleting all content user data for contentId ".concat(contentId));
                        return [4 /*yield*/, this.permissionSystem.checkForUserData(actingUser, types_1.UserDataPermission.DeleteState, contentId, undefined)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("User tried delete content user state without proper permissions.");
                            throw new H5pError_1.default('h5p-server:user-state-missing-delete-permission', {}, 403);
                        }
                        return [2 /*return*/, this.contentUserDataStorage.deleteAllContentUserDataByContentId(contentId)];
                }
            });
        });
    };
    /**
     * Loads the contentUserData for given contentId, dataType and subContentId
     * @param contentId The id of the content to load user data from
     * @param dataType Used by the h5p.js client
     * @param subContentId The id provided by the h5p.js client call
     * @param actingUser The user who is accessing the h5p. Normally this is
     * also the user for who the state should be fetched.
     * @param contextId an arbitrary value that can be used to save multiple
     * states for one content - user tuple
     * @param asUserId If set, the state of this user will be fetched instead of
     * the one of `actingUser'
     * @returns the saved state as string or undefined when not found
     */
    ContentUserDataManager.prototype.getContentUserData = function (contentId, dataType, subContentId, actingUser, contextId, asUserId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.contentUserDataStorage) {
                            return [2 /*return*/];
                        }
                        log.debug("Loading content user data for user with id ".concat(asUserId !== null && asUserId !== void 0 ? asUserId : actingUser.id, ", contentId ").concat(contentId, ", subContentId ").concat(subContentId, ", dataType ").concat(dataType, ", contextId ").concat(contextId));
                        return [4 /*yield*/, this.permissionSystem.checkForUserData(actingUser, types_1.UserDataPermission.ViewState, contentId, asUserId !== null && asUserId !== void 0 ? asUserId : actingUser.id)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("User tried view user content state without proper permissions.");
                            throw new H5pError_1.default('h5p-server:user-state-missing-view-permission', {}, 403);
                        }
                        return [2 /*return*/, this.contentUserDataStorage.getContentUserData(contentId, dataType, subContentId, asUserId !== null && asUserId !== void 0 ? asUserId : actingUser.id, contextId)];
                }
            });
        });
    };
    /**
     * Loads the content user data for given contentId and user. The returned
     * data is an array of IContentUserData where the position in the array
     * corresponds with the subContentId or undefined if there is no content
     * user data.
     *
     * @param contentId The id of the content to load user data from
     * @param actingUser The user who is accessing the h5p. Normally this is
     * also the user for who the integration should be generated.
     * @param contextId an arbitrary value that can be used to save multiple
     * states for one content - user tuple
     * @param asUserId the user for which the integration should be generated,
     * if they are different from the user who is accessing the state
     * @returns an array of IContentUserData or undefined if no content user
     * data is found.
     */
    ContentUserDataManager.prototype.generateContentUserDataIntegration = function (contentId, actingUser, contextId, asUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var states, sortedStates, mappedStates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.contentUserDataStorage) {
                            return [2 /*return*/];
                        }
                        log.debug("Generating contentUserDataIntegration for user with id ".concat(actingUser.id, ", contentId ").concat(contentId, " and contextId ").concat(contextId, "."));
                        return [4 /*yield*/, this.permissionSystem.checkForUserData(actingUser, types_1.UserDataPermission.ViewState, contentId, asUserId !== null && asUserId !== void 0 ? asUserId : actingUser.id)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("User tried viewing user content state without proper permissions.");
                            throw new H5pError_1.default('h5p-server:user-state-missing-view-permission', {}, 403);
                        }
                        return [4 /*yield*/, this.contentUserDataStorage.getContentUserDataByContentIdAndUser(contentId, asUserId !== null && asUserId !== void 0 ? asUserId : actingUser.id, contextId)];
                    case 2:
                        states = _a.sent();
                        if (!states) {
                            return [2 /*return*/, undefined];
                        }
                        states = states.filter(function (s) { return s.preload === true; });
                        sortedStates = states.sort(function (a, b) { return Number(a.subContentId) - Number(b.subContentId); });
                        mappedStates = sortedStates
                            // filter removes states where preload is set to false
                            .filter(function (state) { return state.preload; })
                            // maps the state to an object where the key is the dataType and the userState is the value
                            .map(function (state) {
                            var _a;
                            return (_a = {},
                                _a[state.dataType] = state.userState,
                                _a);
                        });
                        return [2 /*return*/, mappedStates];
                }
            });
        });
    };
    /**
     * Saves data when a user completes content.
     * @param contentId The content id to delete.
     * @param score the score the user reached as an integer
     * @param maxScore the maximum score of the content
     * @param openedTimestamp the time the user opened the content as UNIX time
     * @param finishedTimestamp the time the user finished the content as UNIX
     * time
     * @param completionTime the time the user needed to complete the content
     * (as integer)
     * @param actingUser The user who triggers this method via /setFinished
     */
    ContentUserDataManager.prototype.setFinished = function (contentId, score, maxScore, openedTimestamp, finishedTimestamp, completionTime, actingUser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.contentUserDataStorage) {
                            return [2 /*return*/];
                        }
                        log.debug("saving finished data for ".concat(actingUser.id, " and contentId ").concat(contentId));
                        return [4 /*yield*/, this.permissionSystem.checkForUserData(actingUser, types_1.UserDataPermission.EditFinished, contentId, actingUser.id)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("User tried add finished data without proper permissions.");
                            throw new H5pError_1.default('h5p-server:finished-data-missing-edit-permission', {}, 403);
                        }
                        return [4 /*yield*/, this.contentUserDataStorage.createOrUpdateFinishedData({
                                contentId: contentId,
                                score: score,
                                maxScore: maxScore,
                                openedTimestamp: openedTimestamp,
                                finishedTimestamp: finishedTimestamp,
                                completionTime: completionTime,
                                userId: actingUser.id
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Saves the contentUserData for given contentId, dataType and subContentId
     * @param contentId The id of the content to load user data from
     * @param dataType Used by the h5p.js client
     * @param subContentId The id provided by the h5p.js client call
     * @param userState The userState as string
     * @param actingUser The user who is currently active; normally this is also
     * the owner of the user data
     * @param contextId an arbitrary value that can be used to save multiple
     * states for one content - user tuple
     * @param asUserId if the acting user is different from the owner of the
     * user data, you can specify the owner here
     * @returns the saved state as string
     */
    ContentUserDataManager.prototype.createOrUpdateContentUserData = function (contentId, dataType, subContentId, userState, invalidate, preload, actingUser, contextId, asUserId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof invalidate !== 'boolean' || typeof preload !== 'boolean') {
                            log.error("invalid arguments passed for contentId ".concat(contentId));
                            throw new Error("createOrUpdateContentUserData received invalid arguments: invalidate or preload weren't boolean");
                        }
                        if (!this.contentUserDataStorage) {
                            return [2 /*return*/];
                        }
                        log.debug("Saving contentUserData for user with id ".concat(asUserId !== null && asUserId !== void 0 ? asUserId : actingUser.id, " and contentId ").concat(contentId));
                        return [4 /*yield*/, this.permissionSystem.checkForUserData(actingUser, types_1.UserDataPermission.EditState, contentId, asUserId !== null && asUserId !== void 0 ? asUserId : actingUser.id)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("User tried add / edit user content state without proper permissions.");
                            throw new H5pError_1.default('h5p-server:user-state-missing-edit-permission', {}, 403);
                        }
                        if (this.contentUserDataStorage) {
                            return [2 /*return*/, this.contentUserDataStorage.createOrUpdateContentUserData({
                                    contentId: contentId,
                                    contextId: contextId,
                                    dataType: dataType,
                                    invalidate: invalidate,
                                    preload: preload,
                                    subContentId: subContentId,
                                    userState: userState,
                                    userId: asUserId !== null && asUserId !== void 0 ? asUserId : actingUser.id
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes all finished data for a content object
     * @param contentId the id of the content object
     * @param actingUser the currently active user
     */
    ContentUserDataManager.prototype.deleteFinishedDataByContentId = function (contentId, actingUser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.contentUserDataStorage) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.permissionSystem.checkForUserData(actingUser, types_1.UserDataPermission.DeleteFinished, contentId, undefined)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("User tried add delete finished data for content without proper permissions.");
                            throw new H5pError_1.default('h5p-server:finished-data-missing-delete-permission', {}, 403);
                        }
                        return [4 /*yield*/, this.contentUserDataStorage.deleteFinishedDataByContentId(contentId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ContentUserDataManager;
}());
exports.default = ContentUserDataManager;
