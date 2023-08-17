import { Request, Response } from "express";
import Orders from "../model/OrderModel";
import Users from "../model/UserModel";

// create orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await Orders.create({
      ...req.body,
      userId: req?.user.userId,
    });
    res.status(200).json({
      status: "success",
      order,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: error,
    });
  }
};

// get All Orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const order = await Orders.findAll();
    if (!order) res.json({ status: "fail", message: "no order found" });

    res.status(200).json({
      status: "success",
      length: order.length,
      order,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// get single Orders
export const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const order = await Orders.findByPk(req.params.id, {
      include: { model: Users },
    });
    if (!order) res.json({ status: "fail", message: "no order found" });
    res.status(200).json({
      id: req.params.id,
      status: "success",
      order,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// get user's Orders
export const getUsersOrders = async (req: Request, res: Response) => {
  try {
    const order = await Orders.findAll({ where: { userId: req.user.userId } });
    if (!order) res.json({ status: "fail", message: "no order found" });

    res.status(200).json({
      status: "success",
      length: order.length,
      order,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
// delete the orders
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await Orders.destroy({ where: { id: req.params.id } });
    res.status(200).json({
      status: "success",
      message: "order deleted",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
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
