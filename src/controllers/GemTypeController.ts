import { Request, Response } from "express";
import GemType from "../model/GemTypeModel";

// get all gemtTypes
export const getAllGemTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await GemType.findAll();
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

// create GemType
export const createGemType = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { gem_type } = req.body;
  try {
    const data = await GemType.create({
      gem_type,
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

// delete GemType
export const deleteGemType = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const id = req.params.id;
  try {
    const findGem = await GemType.findOne({
      where: {
        id,
      },
    });
    if (!findGem) {
      return res.status(200).json({
        status: "fail",
        message: "no GemType found",
      });
    }
    const data = await GemType.destroy({ where: { id: id } });
    res.status(200).json({
      status: "success",
      message: `GemType deleted successfully with id ${id}`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// update GemType
export const updateGemType = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const { gem_type } = req.body;

  const id = req.params.id;
  try {
    const findGem = await GemType.findOne({
      where: {
        id,
      },
    });
    if (!findGem) {
      return res.status(200).json({
        status: "fail",
        message: "no GemType found",
      });
    }
    const data = await GemType.update(
      {
        gem_type,
      },
      { where: { id: id } }
    );
    res.status(200).json({
      status: "success",
      message: `GemType updated successfully with id ${id}`,
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
