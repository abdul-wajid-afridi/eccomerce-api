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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCatagory = exports.deleteCatagory = exports.createCatagory = exports.getAllCatagories = void 0;
const CatagoryModel_1 = __importDefault(require("../model/CatagoryModel"));
// get all catagories
const getAllCatagories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield CatagoryModel_1.default.findAll();
        res.status(200).json({
            data,
        });
    }
    catch (error) {
        res.status(401).json({
            status: "failed",
            message: error,
        });
    }
});
exports.getAllCatagories = getAllCatagories;
// create Catagory
const createCatagory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat_name } = req.body;
    try {
        const data = yield CatagoryModel_1.default.create({
            cat_name,
        });
        res.status(200).json({
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "failed",
            message: error,
        });
    }
});
exports.createCatagory = createCatagory;
// delete catagory
const deleteCatagory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const findCat = yield CatagoryModel_1.default.findOne({
            where: {
                id,
            },
        });
        if (!findCat) {
            return res.status(200).json({
                status: "fail",
                message: "no catagory found",
            });
        }
        const catagory = yield CatagoryModel_1.default.destroy({ where: { id: id } });
        res.status(200).json({
            status: "success",
            message: `catagory deleted successfully with id ${id}`,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.deleteCatagory = deleteCatagory;
// update catagory
const updateCatagory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat_name } = req.body;
    const id = req.params.id;
    try {
        const findCat = yield CatagoryModel_1.default.findOne({
            where: {
                id,
            },
        });
        if (!findCat) {
            return res.status(200).json({
                status: "fail",
                message: "no catagory found",
            });
        }
        const data = yield CatagoryModel_1.default.update({
            cat_name,
        }, { where: { id: id } });
        res.status(200).json({
            status: "success",
            message: `catagory updated successfully with id ${id}`,
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.updateCatagory = updateCatagory;
