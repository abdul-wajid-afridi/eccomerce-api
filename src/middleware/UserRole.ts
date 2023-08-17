// export const IsAdminRole = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.json({
//         status: "fail",
//         message: `the ${req.user.role} cannot do it!`,
//       });
//     }
//     return next();
//   };
// };

import { Request, Response, NextFunction } from "express";

export const IsAdminRole = (...roles: any) => {
  return (req: any, res: Response, next: NextFunction) => {
    console.log(req.user.role);

    if (!roles.includes(req.user.role)) {
      return res.json({
        status: "fail",
        message: `the ${req.user.role} cannot do it!`,
      });
    }
    return next();
  };
};
