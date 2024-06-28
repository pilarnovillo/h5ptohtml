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
var fsExtra = require("fs-extra");
var fs = require("fs");
var path = require("path");
var tmp_promise_1 = require("tmp-promise");
// import promisePipe from 'promisepipe';
var ContentManager_1 = require("../../h5p-server/src/ContentManager");
var ContentStorer_1 = require("../../h5p-server/src/ContentStorer");
var FileContentStorage_1 = require("../../h5p-server/src/implementation/fs/FileContentStorage");
var FileLibraryStorage_1 = require("../../h5p-server/src/implementation/fs/FileLibraryStorage");
var H5PConfig_1 = require("../../h5p-server/src/implementation/H5PConfig");
var LibraryManager_1 = require("../../h5p-server/src/LibraryManager");
var PackageImporter_1 = require("../../h5p-server/src/PackageImporter");
var HtmlExporter_1 = require("../src/HtmlExporter");
var scorm_1 = require("./scorm");
// import { LaissezFairePermissionSystem } from '../../h5p-server';
var User_1 = require("./User");
var src_1 = require("../../h5p-server/src");
var InMemoryStorage_1 = require("../../h5p-server/src/implementation/InMemoryStorage");
var TemporaryFileManager_1 = require("../../h5p-server/src/TemporaryFileManager");
var DirectoryTemporaryFileStorage_1 = require("../../h5p-server/src/implementation/fs/DirectoryTemporaryFileStorage");
var browser;
var page;
function importAndExportHtml(packagePath, mode) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, tmp_promise_1.withDir)(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                        var contentDir, libraryDir, user, contentStorage, contentManager, libraryStorage, libraryManager, storage, config, tmpManager, packageImporter, htmlExporter, contentId, exportedHtml_1, dir;
                        var _this = this;
                        var tmpDirPath = _b.path;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    contentDir = path.join(tmpDirPath, 'content');
                                    libraryDir = "C:\\Users\\piluc\\h5p server\\H5P-Nodejs-library\\packages\\h5p-html-exporter\\test\\h5p\\libraries";
                                    return [4 /*yield*/, fsExtra.ensureDir(contentDir)];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, fsExtra.ensureDir(libraryDir)];
                                case 2:
                                    _c.sent();
                                    user = new User_1.default();
                                    contentStorage = new FileContentStorage_1.default(contentDir);
                                    contentManager = new ContentManager_1.default(contentStorage, new src_1.LaissezFairePermissionSystem());
                                    console.log("libraryDir: " + libraryDir);
                                    libraryStorage = new FileLibraryStorage_1.default(libraryDir);
                                    libraryManager = new LibraryManager_1.default(libraryStorage);
                                    storage = new InMemoryStorage_1.default();
                                    config = new H5PConfig_1.default(storage);
                                    tmpManager = new TemporaryFileManager_1.default(new DirectoryTemporaryFileStorage_1.default(tmpDirPath), config, new src_1.LaissezFairePermissionSystem());
                                    packageImporter = new PackageImporter_1.default(libraryManager, config, new src_1.LaissezFairePermissionSystem(), contentManager, new ContentStorer_1.default(contentManager, libraryManager, tmpManager));
                                    console.log("HERE 5");
                                    htmlExporter = new HtmlExporter_1.default(libraryStorage, contentStorage, config, path.resolve("".concat(__dirname, "/h5p/core")), path.resolve("".concat(__dirname, "/h5p/editor")), (0, scorm_1.default)());
                                    console.log("HERE 55");
                                    return [4 /*yield*/, packageImporter.addPackageLibrariesAndContent(packagePath, user)];
                                case 3:
                                    contentId = (_c.sent()).id;
                                    if (!(mode === 'singleBundle')) return [3 /*break*/, 7];
                                    return [4 /*yield*/, htmlExporter.createSingleBundle(contentId, user)];
                                case 4:
                                    exportedHtml_1 = _c.sent();
                                    console.log("HERE 2");
                                    dir = path.dirname("C:\\Users\\piluc\\h5p server\\H5P-Nodejs-library\\packages\\h5p-html-exporter\\test\\h5p\\example.html");
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir, { recursive: true });
                                    }
                                    // Write the content to the file
                                    return [4 /*yield*/, fs.promises.writeFile("C:\\Users\\piluc\\h5p server\\H5P-Nodejs-library\\packages\\h5p-html-exporter\\test\\h5p\\example.html", exportedHtml_1, 'utf8')];
                                case 5:
                                    // Write the content to the file
                                    _c.sent();
                                    return [4 /*yield*/, (0, tmp_promise_1.withFile)(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, fsExtra.writeFile(result.path, exportedHtml_1)];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }, {
                                            keep: false,
                                            postfix: '.html'
                                        })];
                                case 6:
                                    _c.sent();
                                    _c.label = 7;
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); }, { keep: false, unsafeCleanup: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
importAndExportHtml("C:\\Users\\piluc\\h5p server\\H5P-Nodejs-library\\packages\\h5p-html-exporter\\test\\h5p\\files\\arithmetic-quiz-22-57860.h5p", 'singleBundle');
