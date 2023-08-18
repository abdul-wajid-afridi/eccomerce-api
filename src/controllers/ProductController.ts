import { Request, Response } from "express";
import Like from "../model/LikesModel";
import Products from "../model/ProductModel";
import Users from "../model/UserModel";

type GallProp = { url: string };
type LogUserProp = { user: { id: number }; Request: Request };

// get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const data = await Products.findAll();
    res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// get single product
export const getSingleProduct = async (req: Request, res: Response) => {
  const prodId = req.params.id;
  try {
    const findProduct = await Products.findByPk(prodId);
    if (!findProduct) {
      return res.status(200).json({
        message: `product not Found with id ${prodId}`,
      });
    }
    const data = await Products.findByPk(req.params.id);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
// posting a product
export const createProduct = async (req: Request | any, res: Response) => {
  const {
    name,
    description,
    price,
    rating,
    catagoryId,
    stock,
    num_reviews,
    reviews,
  } = req.body;
  const users_id: number = req.user?.id;
  const img = req.files;
  // const img: Express.Multer.File[] = req.files;
  const Gallary: GallProp[] = [];

  img.map((it: Express.Multer.File) => Gallary.push({ url: it.filename }));

  try {
    const data = await Products.create({
...req.body,
      user_id: users_id
    });

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// updating a product
export const updateProduct = async (req: Request | any, res: Response) => {
  const {
    name,
    description,
    price,
    rating,
    catagoryId,
    stock,
    num_reviews,
    reviews,
  } = req.body;
  const prodId = req.params.id;
  const users_id: number = req.user?.id;
  // const img: Express.Multer.File[] = req.files;
  // create a type for it
  const img: any = req.files;
  const Gallary: GallProp[] = [];

  img.map((it: any) => Gallary.push({ url: it.filename }));

  try {
    const findProduct = await Products.findByPk(prodId);
    if (!findProduct) {
      return res.status(200).json({
        message: `product not Found with id ${prodId}`,
      });
    }
    const data = await Products.update(
      {
       ...req.body,
        userId: users_id,
      },
      { where: { id: prodId } }
    );

    res.status(200).json({
      status: "success",
      message: `data is updated successfully with id ${prodId}`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// delete single product
export const deleteProduct = async (req: Request, res: Response) => {
  const prodId = req.params.id;
  try {
    const findProduct = await Products.findByPk(prodId);
    if (!findProduct) {
      return res.status(200).json({
        message: `product not Found with id ${prodId}`,
      });
    }

    const data = await Products.destroy({ where: { id: req.params.id } });
    res.status(200).json({
      status: "success",
      message: `data is deleted successfully with id ${prodId}`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// get all user products
export const getUserProducts = async (req: Request, res: Response) => {
  // const userId = req.user?.id;
  const user_id = req.params.id;
  try {
    const findUser = await Users.findByPk(user_id);
    if (!findUser) {
      return res.status(200).json({
        message: `User not Found with id ${user_id}`,
      });
    }
    const data = await Products.findAll({ where: { user_id: user_id } });
    res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// we have only one fucntion of likes controller so i will put it here coz its connected to the product

interface LikeRequest {
  productId: number;
}
interface UserRequest {
  user: {
    id: number;
  };
}
// likes controller
export const likeProduct = async (
  req: Request | any,
  //   req: Request<{}, {}, LikeRequest>,
  res: Response
) => {
  const userId = req?.user.id;
  const { productId } = req.body;

  try {
    // Check if the user has already liked the product
    const existingLike = await Like.findOne({
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
    const newLike = await Like.create({
      userId,
      productId,
    });

    return res.status(201).json({
      status: "success",
      message: "Product liked successfully.",
      data: newLike,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error,
    });
  }
};
