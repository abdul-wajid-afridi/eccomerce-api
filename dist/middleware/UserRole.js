"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAdminRole = void 0;
const IsAdminRole = (...roles) => {
    return (req, res, next) => {
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
exports.IsAdminRole = IsAdminRole;
