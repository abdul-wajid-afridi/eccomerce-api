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
exports.updateOrderStatus = exports.getAllAdminOrders = exports.deleteOrder = exports.getUsersOrders = exports.getSingleOrder = exports.getAllOrders = exports.createOrder = void 0;
const OrderModel_1 = __importDefault(require("../model/OrderModel"));
const UserModel_1 = __importDefault(require("../model/UserModel"));
const ProductModel_1 = __importDefault(require("../model/ProductModel"));
const OrderItem_1 = __importDefault(require("../model/OrderItem"));
// create orders
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield OrderModel_1.default.create(Object.assign(Object.assign({}, req.body), { userId: req === null || req === void 0 ? void 0 : req.user.userId }));
        res.status(200).json({
            status: "success",
            order,
        });
    }
    catch (error) {
        res.json({
            status: "fail",
            message: error,
        });
    }
});
exports.createOrder = createOrder;
// get All Orders
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield OrderModel_1.default.findAll();
        if (!order)
            res.json({ status: "fail", message: "no order found" });
        res.status(200).json({
            status: "success",
            length: order.length,
            order,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.getAllOrders = getAllOrders;
// get single Orders
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield OrderModel_1.default.findByPk(req.params.id, {
            include: { model: UserModel_1.default },
        });
        if (!order)
            res.json({ status: "fail", message: "no order found" });
        res.status(200).json({
            id: req.params.id,
            status: "success",
            order,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.getSingleOrder = getSingleOrder;
// get user's Orders
const getUsersOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield OrderModel_1.default.findAll({ where: { user_id: req.user.userId } });
        if (!order)
            res.json({ status: "fail", message: "no order found" });
        res.status(200).json({
            status: "success",
            length: order.length,
            order,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.getUsersOrders = getUsersOrders;
// delete the orders
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield OrderModel_1.default.destroy({ where: { id: req.params.id } });
        res.status(200).json({
            status: "success",
            message: "order deleted",
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.deleteOrder = deleteOrder;
// get all Orders --admin
const getAllAdminOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield OrderModel_1.default.findAll();
        if (!order)
            res.json({ status: "fail", message: "no order found" });
        let totalPrice = 0;
        order.map((it) => {
            return (totalPrice += it === null || it === void 0 ? void 0 : it.total_price);
        });
        res.json({
            status: "success",
            length: order.length,
            totalPrice,
            order,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllAdminOrders = getAllAdminOrders;
// update order satus
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const order = yield OrderModel_1.default.findByPk(req.params.id);
    if (!order) {
        return res.status(400).json({ status: "fail", message: "no order found" });
    }
    if (((_a = order.dataValues) === null || _a === void 0 ? void 0 : _a.status) === "DELIVERED") {
        return res
            .status(400)
            .json({ status: "fail", message: "order is already delivered" });
    }
    const orderItems = yield OrderItem_1.default.findAll({
        where: { id: order.dataValues.id },
    });
    orderItems.map((it) => {
        updateStock(it.dataValues.product_id, it.dataValues.quantity);
    });
    order.dataValues.status = req.body.status;
    if (req.body.status === "DELIVERED") {
        order.dataValues.order_date = new Date();
    }
    yield order.save();
    res.status(200).json({
        status: "success",
        message: "done!",
    });
});
exports.updateOrderStatus = updateOrderStatus;
// updating the quantity stock
function updateStock(id, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield ProductModel_1.default.findByPk(id);
        if (product) {
            product.dataValues.stock = product.dataValues.stock - quantity;
        }
        // product?.dataValues.stock as number -= quantity;
        product === null || product === void 0 ? void 0 : product.save();
    });
}
