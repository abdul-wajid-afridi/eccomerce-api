"use strict";
// import multer from "multer";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: "uploads",
    filename: (req, file, callB) => {
        return callB(null, `img-${Date.now()}.${file.mimetype.split("/")[1]}`);
    },
});
const filterimg = (req, file, callB) => {
    if (file.mimetype.startsWith("image")) {
        return callB(null, true);
    }
    else {
        return callB(null, false);
    }
};
exports.UploadFiles = (0, multer_1.default)({
    storage,
    fileFilter: filterimg,
});
