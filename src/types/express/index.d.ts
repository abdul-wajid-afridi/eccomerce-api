
// import {  User } from "../cutom";

// export {}

// declare global {
//   namespace Express {
//     export interface Request {
//       user?: User;
//     }
//   }
// }


import {  UserProps } from "../custom";

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      user?: UserProps;
    }
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: UserProps;
    }
  }
}