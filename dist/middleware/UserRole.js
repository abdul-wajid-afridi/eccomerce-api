"use strict";
// export const IsAdminRole = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user?.role_id)) {
//       return res.json({
//         status: "fail",
//         message: `the ${req.user?.role_id} cannot do it!`,
//       });
//     }
//     return next();
//   };
// };
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAdminRole = void 0;
const IsAdminRole = (...roles) => {
    return (req, res, next) => {
        var _a, _b, _c;
        console.log((_a = req.user) === null || _a === void 0 ? void 0 : _a.role_id);
        if (!roles.includes((_b = req.user) === null || _b === void 0 ? void 0 : _b.role_id)) {
            return res.json({
                status: "fail",
                message: `the ${(_c = req.user) === null || _c === void 0 ? void 0 : _c.role_id} cannot do it!`,
            });
        }
        return next();
    };
};
exports.IsAdminRole = IsAdminRole;
