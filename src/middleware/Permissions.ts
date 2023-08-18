import { Request, Response, NextFunction } from "express";
import { HttpUrl } from "../utils/BaseUrl";
import { ErrorMessage } from "../utils/ErrorMessage";

export const userPermissions = (url: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // NOTE  first you have to give permissions to the role then you have to give permissions to a apecific user.
    // if you dont do like this then you have to change the condition of user and userType && with || wise versa then it will work
    try {
      const user = await HttpUrl.post("/find-user-permission", {user_id: req.user?.user_id,permission_url: url });

      const userType = await HttpUrl.post("/find-type-permission", {user_type_id: req.user?.role_id,permission_url: url});
      if (req.user?.role_id === 1) {
        return next() 
      } else if (userType.data?.status === "fail" ||user.data?.status === "fail") {
        return ErrorMessage(res, "you are not allowed to do this", 400)
      }
      return next()
    } catch (error) {
      ErrorMessage(res, error, 400)
    }
  };
};
