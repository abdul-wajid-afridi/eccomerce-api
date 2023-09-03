import { Request } from "express";
import multer, { StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({
  destination: "uploads",
  filename: (
    req: Request,
    file: Express.Multer.File,
    callB: (error: null, filename: string) => void
  ) => {
    return callB(null, `img-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

const filterimg = (
  req: Request,
  file: Express.Multer.File,
  callB: (error: null, acceptFile: boolean) => void
) => {
  if (file.mimetype.startsWith("image")) {
    return callB(null, true);
  } else {
    return callB(null, false);
  }
};

export const UploadFiles = multer({
  storage,
  // fileFilter: filterimg,
});
