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
var promisepipe_1 = require("promisepipe");
var FileContentStorage_1 = require("./packages/h5p-server/src/implementation/fs/FileContentStorage");
var FileLibraryStorage_1 = require("./packages/h5p-server/src/implementation/fs/FileLibraryStorage");
var H5PConfig_1 = require("./packages/h5p-server/src/implementation/H5PConfig");
var HtmlExporter_1 = require("./packages/h5p-html-exporter/src/HtmlExporter");
var User_1 = require("./packages/h5p-html-exporter/test/User");
var InMemoryStorage_1 = require("./packages/h5p-server/src/implementation/InMemoryStorage");
var scorm_1 = require("./packages/h5p-html-exporter/test/scorm");
var ContentManager_1 = require("./packages/h5p-server/src/ContentManager");
var ContentStorer_1 = require("./packages/h5p-server/src/ContentStorer");
var src_1 = require("./packages/h5p-server/src");
var PackageImporter_1 = require("./packages/h5p-server/src/PackageImporter");
var TemporaryFileManager_1 = require("./packages/h5p-server/src/TemporaryFileManager");
var LaissezFairePermissionSystem_1 = require("./packages/h5p-server/src/implementation/LaissezFairePermissionSystem");
var DirectoryTemporaryFileStorage_1 = require("./packages/h5p-server/src/implementation/fs/DirectoryTemporaryFileStorage");
var ParameterService = /** @class */ (function () {
    function ParameterService() {
    }
    ParameterService.prototype.processParameter = function (parameter, parameter2) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("parameter2:" + parameter2);
                        return [4 /*yield*/, this.importAndExportHtml(parameter, "externalContentResources", parameter2)];
                    case 1:
                        html = _a.sent();
                        // Perform any business logic here, e.g., save to database, perform calculations
                        return [2 /*return*/, "".concat(html)];
                }
            });
        });
    };
    ParameterService.prototype.importAndExportHtml = function (packagePath, mode, filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var exportedHtml;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exportedHtml = "inicial";
                        return [4 /*yield*/, (0, tmp_promise_1.withDir)(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                var contentDir, libraryDir, user, contentStorage, contentManager, libraryStorage, libraryManager, storage, config, tmpManager, packageImporter, htmlExporter, contentId, exportedPath, dir, res_1;
                                var _this = this;
                                var tmpDirPath = _b.path;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            contentDir = path.join(tmpDirPath, 'content');
                                            libraryDir = path.resolve("".concat(__dirname, "/h5p/libraries"));
                                            return [4 /*yield*/, fsExtra.ensureDir(contentDir)];
                                        case 1:
                                            _c.sent();
                                            return [4 /*yield*/, fsExtra.ensureDir(libraryDir)];
                                        case 2:
                                            _c.sent();
                                            user = new User_1.default();
                                            contentStorage = new FileContentStorage_1.default(contentDir);
                                            contentManager = new ContentManager_1.default(contentStorage, new LaissezFairePermissionSystem_1.LaissezFairePermissionSystem());
                                            console.log("libraryDir: " + libraryDir);
                                            libraryStorage = new FileLibraryStorage_1.default(libraryDir);
                                            libraryManager = new src_1.LibraryManager(libraryStorage);
                                            storage = new InMemoryStorage_1.default();
                                            config = new H5PConfig_1.default(storage);
                                            tmpManager = new TemporaryFileManager_1.default(new DirectoryTemporaryFileStorage_1.default(tmpDirPath), config, new LaissezFairePermissionSystem_1.LaissezFairePermissionSystem());
                                            packageImporter = new PackageImporter_1.default(libraryManager, config, new LaissezFairePermissionSystem_1.LaissezFairePermissionSystem(), contentManager, new ContentStorer_1.default(contentManager, libraryManager, tmpManager));
                                            console.log("HERE 5");
                                            htmlExporter = new HtmlExporter_1.default(libraryStorage, contentStorage, config, path.resolve("".concat(__dirname, "/h5p/core")), path.resolve("".concat(__dirname, "/h5p/editor")), (0, scorm_1.default)());
                                            console.log("HERE 55");
                                            console.log("filePath: " + filePath);
                                            return [4 /*yield*/, packageImporter.addPackageLibrariesAndContent(filePath, user)];
                                        case 3:
                                            contentId = (_c.sent()).id;
                                            if (!(mode === 'singleBundle')) return [3 /*break*/, 6];
                                            return [4 /*yield*/, htmlExporter.createSingleBundle(packagePath, user)];
                                        case 4:
                                            exportedHtml = _c.sent();
                                            console.log("HERE 2");
                                            exportedPath = path.join(path.resolve("".concat(__dirname, "/h5p")), "index.html");
                                            console.log(exportedPath);
                                            dir = path.dirname(exportedPath);
                                            if (!fs.existsSync(dir)) {
                                                fs.mkdirSync(dir, { recursive: true });
                                            }
                                            // Write the content to the file
                                            return [4 /*yield*/, fs.promises.writeFile(exportedPath, exportedHtml, 'utf8')];
                                        case 5:
                                            // Write the content to the file
                                            _c.sent();
                                            return [3 /*break*/, 9];
                                        case 6:
                                            if (!(mode === 'externalContentResources')) return [3 /*break*/, 9];
                                            return [4 /*yield*/, htmlExporter.createBundleWithExternalContentResources(packagePath, user, contentId.toString())];
                                        case 7:
                                            res_1 = _c.sent();
                                            // const input = 'file://./content/C:/Users/piluc/Downloads/multiple-choice-713/1024301362/images/file-5885c23902f31.jpg file://./content/another/path/images/file-123456789.jpg';
                                            // // Regular expression to match everything between file:// and the images/filename.jpg
                                            // const regex = /file:\/\/.*?(\/images\/[^/]+\.(jpg|png|gif|bmp|jpeg))/gi;
                                            // var html = res.html;
                                            // // Replace the matched part with the captured group
                                            // var htmlFixed = html.replace(regex, 'file:/$1');
                                            return [4 /*yield*/, (0, tmp_promise_1.withDir)(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                                    var _i, _a, f, tempFilePath, writer, readable, _b;
                                                    return __generator(this, function (_c) {
                                                        switch (_c.label) {
                                                            case 0: return [4 /*yield*/, fsExtra.mkdirp(path.resolve("".concat(__dirname, "/h5p/").concat(contentId)))];
                                                            case 1:
                                                                _c.sent();
                                                                // console.log("result.path: "+result.path);
                                                                return [4 /*yield*/, fsExtra.writeFile(path.join(path.resolve("".concat(__dirname, "/h5p/").concat(contentId)), "".concat(contentId, ".html")), res_1.html)];
                                                            case 2:
                                                                // console.log("result.path: "+result.path);
                                                                _c.sent();
                                                                _i = 0, _a = res_1.contentFiles;
                                                                _c.label = 3;
                                                            case 3:
                                                                if (!(_i < _a.length)) return [3 /*break*/, 10];
                                                                f = _a[_i];
                                                                _c.label = 4;
                                                            case 4:
                                                                _c.trys.push([4, 8, , 9]);
                                                                tempFilePath = path.join(path.resolve("".concat(__dirname, "/h5p/").concat(contentId)), f);
                                                                return [4 /*yield*/, fsExtra.mkdirp(path.dirname(tempFilePath))];
                                                            case 5:
                                                                _c.sent();
                                                                writer = fsExtra.createWriteStream(tempFilePath);
                                                                return [4 /*yield*/, contentStorage.getFileStream(contentId, f, user)];
                                                            case 6:
                                                                readable = _c.sent();
                                                                return [4 /*yield*/, (0, promisepipe_1.default)(readable, writer)];
                                                            case 7:
                                                                _c.sent();
                                                                writer.close();
                                                                return [3 /*break*/, 9];
                                                            case 8:
                                                                _b = _c.sent();
                                                                return [3 /*break*/, 9];
                                                            case 9:
                                                                _i++;
                                                                return [3 /*break*/, 3];
                                                            case 10: return [2 /*return*/];
                                                        }
                                                    });
                                                }); }, {
                                                    keep: false,
                                                    unsafeCleanup: true
                                                })];
                                        case 8:
                                            // const input = 'file://./content/C:/Users/piluc/Downloads/multiple-choice-713/1024301362/images/file-5885c23902f31.jpg file://./content/another/path/images/file-123456789.jpg';
                                            // // Regular expression to match everything between file:// and the images/filename.jpg
                                            // const regex = /file:\/\/.*?(\/images\/[^/]+\.(jpg|png|gif|bmp|jpeg))/gi;
                                            // var html = res.html;
                                            // // Replace the matched part with the captured group
                                            // var htmlFixed = html.replace(regex, 'file:/$1');
                                            _c.sent();
                                            exportedHtml = res_1.html;
                                            _c.label = 9;
                                        case 9: return [2 /*return*/];
                                    }
                                });
                            }); }, { keep: false, unsafeCleanup: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, exportedHtml];
                }
            });
        });
    };
    return ParameterService;
}());
// Create a singleton instance of the service
var parameterService = new ParameterService();
// Export the instance to be used in controllers
exports.default = parameterService;
