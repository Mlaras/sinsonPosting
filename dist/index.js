"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const instagram_private_api_1 = require("instagram-private-api");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const cron_1 = require("cron");
const scrapper_1 = __importDefault(require("./scrapper"));
var cronJob;
cronJob = new cron_1.CronJob('*/3 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const scrapper = yield new scrapper_1.default();
    try {
        const postDescription = yield scrapper.getRandomFrame();
        console.log(process.env.IG_USERNAME);
        console.log(process.env.IG_PASSWORD);
        const ig = new instagram_private_api_1.IgApiClient();
        ig.state.generateDevice(process.env.IG_USERNAME);
        yield ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
        // This is the part where I read the folder's files and return the first one.
        const folderChildren = yield fs_1.promises.readdir('to-post');
        const sinsonPostPath = folderChildren.pop();
        const full_path = 'to-post/' + sinsonPostPath;
        if (full_path != undefined) {
            const promise = fs_1.promises.readFile(path.join(full_path));
            Promise.resolve(promise).then(function (imageBuffer) {
                return __awaiter(this, void 0, void 0, function* () {
                    var oldPath = full_path;
                    var newPath = 'posted/' + sinsonPostPath;
                    fs_1.promises.rename(oldPath, newPath);
                    yield ig.publish.photo({
                        file: imageBuffer,
                        caption: postDescription, // nice caption (optional)
                    });
                });
            });
        }
    }
    catch (error) { }
}));
cronJob.start();
