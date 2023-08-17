import { Request, Response } from "express";
import Catagory from "../model/CatagoryModel";

// get all catagories
export const getAllCatagories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await Catagory.findAll();
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: error,
    });
  }
};

// create Catagory
export const createCatagory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cat_name } = req.body;
  try {
    const data = await Catagory.create({
      cat_name,
    });
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
};

// delete catagory
export const deleteCatagory = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const id = req.params.id;
  try {
    const findCat = await Catagory.findOne({
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
    const catagory = await Catagory.destroy({ where: { id: id } });
    res.status(200).json({
      status: "success",
      message: `catagory deleted successfully with id ${id}`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// update catagory
export const updateCatagory = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const { cat_name } = req.body;

  const id = req.params.id;
  try {
    const findCat = await Catagory.findOne({
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
    const data = await Catagory.update(
      {
        cat_name,
      },
      { where: { id: id } }
    );
    res.status(200).json({
      status: "success",
      message: `catagory updated successfully with id ${id}`,
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
