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
exports.deleteOrder = exports.getUsersOrders = exports.getSingleOrder = exports.getAllOrders = exports.createOrder = void 0;
const OrderModel_1 = __importDefault(require("../model/OrderModel"));
const UserModel_1 = __importDefault(require("../model/UserModel"));
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
// export const getAllAdminOrders =  async (req:Request, res:Response) => {
//   try {
//     const order = await Orders.findAll()
//     if (!order) res.json({ status: "fail", message: "no order found" });
//     let totalPrice = 0;
//     order.map((it) => {
//       return (totalPrice += it?.totalPrice);
//     });
//     res.json({
//       status: "success",
//       length: order.length,
//       totalPrice,
//       order,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// // update order satus
// export const updateOrderStatus = async (req, res) => {
//   const order = await Orders.findById(req.params.id);
//   if (!order) {
//     return res.status(400).json({ status: "fail", message: "no order found" });
//   }
//   if (order.orderStatus == "Delivered") {
//     return res
//       .status(400)
//       .json({ status: "fail", message: "order is already delivered" });
//   }
//   // changing the quantity
//   // order.orderItems.forEach(async (it) => {
//   //   const prod = await Products.findById(it.productId);
//   //   console.log(prod.stock);
//   //   console.log(it.quantity);
//   //   await Products.findOneAndUpdate(
//   //     {
//   //       _id: it.productId,
//   //       stock: prod.stock - it.quantity,
//   //     },
//   //     { new: true }
//   //   );
//   //   await Products.bulkSave();
//   // });
//   order.orderItems.forEach(async (it) => {
//     await updateStock(it.productId, it.quantity);
//   });
//   order.orderStatus = req.body.status;
//   if (req.body.status == "Delivered") {
//     order.deliveredAt = Date.now();
//   }
//   await order.save();
//   res.status(200).json({
//     status: "success",
//     message: "done!",
//   });
// };
// // updating the quantity stock
// async function updateStock(id, quantity) {
//   const product = await Products.findById(id);
//   product.stock -= quantity;
//   await product.save();
// }
