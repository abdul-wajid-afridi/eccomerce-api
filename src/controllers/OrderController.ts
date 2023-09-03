import { Request, Response } from "express";
import Orders, { OrderProps } from "../model/OrderModel";
import Users from "../model/UserModel";
import Products from "../model/ProductModel";
import OrderItem, { OrderItemProps } from "../model/OrderItem";

// create orders
export const createOrder = async (req: any, res: Response) => {
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
export const getUsersOrders = async (req: any, res: Response) => {
  try {
    const order = await Orders.findAll({ where: { user_id: req.user.userId } });
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
export const getAllAdminOrders = async (req: Request, res: Response) => {
  try {
    const order = await Orders.findAll();
    if (!order) res.json({ status: "fail", message: "no order found" });

    let totalPrice = 0;

    order.map((it: any) => {
      return (totalPrice += it?.total_price);
    });

    res.json({
      status: "success",
      length: order.length,
      totalPrice,
      order,
    });
  } catch (error) {
    console.log(error);
  }
};

// update order satus
export const updateOrderStatus = async (req: Request, res: Response) => {
  const order = await Orders.findByPk(req.params.id);

  if (!order) {
    return res.status(400).json({ status: "fail", message: "no order found" });
  }

  if (order.dataValues?.status === "DELIVERED") {
    return res
      .status(400)
      .json({ status: "fail", message: "order is already delivered" });
  }

  const orderItems = await OrderItem.findAll({
    where: { id: order.dataValues.id },
  });
  orderItems.map((it: any) => {
    updateStock(it.dataValues.product_id, it.dataValues.quantity);
  });

  order.dataValues.status = req.body.status;

  if (req.body.status === "DELIVERED") {
    order.dataValues.order_date = new Date();
  }

  await order.save();

  res.status(200).json({
    status: "success",
    message: "done!",
  });
};

// updating the quantity stock
async function updateStock(id: number, quantity: number) {
  const product = await Products.findByPk(id);

  if (product) {
    product.dataValues.stock = (product.dataValues.stock as number) - quantity;
  }

  // product?.dataValues.stock as number -= quantity;

  product?.save();
}
