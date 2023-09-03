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
exports.likeProduct = exports.getUserProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getSingleProduct = exports.getAllProducts = void 0;
const LikesModel_1 = __importDefault(require("../model/LikesModel"));
const ProductModel_1 = __importDefault(require("../model/ProductModel"));
const UserModel_1 = __importDefault(require("../model/UserModel"));
// get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield ProductModel_1.default.findAll();
        res.status(200).json({
            status: "success",
            length: data.length,
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
exports.getAllProducts = getAllProducts;
// get single product
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prodId = req.params.id;
    try {
        const findProduct = yield ProductModel_1.default.findByPk(prodId);
        if (!findProduct) {
            return res.status(200).json({
                message: `product not Found with id ${prodId}`,
            });
        }
        const data = yield ProductModel_1.default.findByPk(req.params.id);
        res.status(200).json({
            status: "success",
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
exports.getSingleProduct = getSingleProduct;
// posting a product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { name, description, price } = req.body;
    const users_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const img = req.files["images"];
    const thumbnail = (_b = req.files["thumbnail"][0]) === null || _b === void 0 ? void 0 : _b.filename;
    const video = (_c = req.files["video"][0]) === null || _c === void 0 ? void 0 : _c.filename;
    const Gallary = [];
    // const file:Express.Multer.File=req.files
    img.map((it) => Gallary.push({ url: it.filename }));
    try {
        const data = yield ProductModel_1.default.create(Object.assign(Object.assign({}, req.body), { user_id: users_id, images: Gallary, video,
            thumbnail }));
        res.status(200).json({
            status: "success",
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
exports.createProduct = createProduct;
// updating a product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    const prodId = req.params.id;
    const users_id = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    // const img: Express.Multer.File[] = req.files;
    // create a type for it
    const img = req.files["images"];
    const thumbnail = (_e = req.files["thumbnail"][0]) === null || _e === void 0 ? void 0 : _e.filename;
    const video = (_f = req.files["video"][0]) === null || _f === void 0 ? void 0 : _f.filename;
    const Gallary = [];
    // const file:Express.Multer.File=req.files
    img.map((it) => Gallary.push({ url: it.filename }));
    try {
        const findProduct = yield ProductModel_1.default.findByPk(prodId);
        if (!findProduct) {
            return res.status(200).json({
                message: `product not Found with id ${prodId}`,
            });
        }
        const data = yield ProductModel_1.default.update(Object.assign(Object.assign({}, req.body), { userId: users_id, images: Gallary, video,
            thumbnail }), { where: { id: prodId } });
        res.status(200).json({
            status: "success",
            message: `data is updated successfully with id ${prodId}`,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.updateProduct = updateProduct;
// delete single product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prodId = req.params.id;
    try {
        const findProduct = yield ProductModel_1.default.findByPk(prodId);
        if (!findProduct) {
            return res.status(200).json({
                message: `product not Found with id ${prodId}`,
            });
        }
        const data = yield ProductModel_1.default.destroy({ where: { id: req.params.id } });
        res.status(200).json({
            status: "success",
            message: `data is deleted successfully with id ${prodId}`,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.deleteProduct = deleteProduct;
// get all user products
const getUserProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.user?.id;
    const user_id = req.params.id;
    try {
        const findUser = yield UserModel_1.default.findByPk(user_id);
        if (!findUser) {
            return res.status(200).json({
                message: `User not Found with id ${user_id}`,
            });
        }
        const data = yield ProductModel_1.default.findAll({ where: { user_id: user_id } });
        res.status(200).json({
            status: "success",
            length: data.length,
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
exports.getUserProducts = getUserProducts;
// likes controller
const likeProduct = (req, 
//   req: Request<{}, {}, LikeRequest>,
res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req === null || req === void 0 ? void 0 : req.user.id;
    const { productId } = req.body;
    try {
        // Check if the user has already liked the product
        const existingLike = yield LikesModel_1.default.findOne({
            where: {
                productId,
                userId,
            },
        });
        if (existingLike) {
            return res.status(400).json({
                status: "fail",
                message: "You have already liked this product.",
            });
        }
        // Create a new like for the product
        const newLike = yield LikesModel_1.default.create({
            userId,
            productId,
        });
        return res.status(201).json({
            status: "success",
            message: "Product liked successfully.",
            data: newLike,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: error,
        });
    }
});
exports.likeProduct = likeProduct;
