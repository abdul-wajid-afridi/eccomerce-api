import { Request, Response } from "express";
import AccAccounts, { AccAcountsProps } from "../model/AccAccountsModel";
import { Op } from "sequelize";
import { ErrorMessage } from "../utils/ErrorMessage";
import { ResponseMessage } from "../utils/ResponseMessage";
import { z } from "zod";
import { ValidationError } from "../utils/ValidationError";


export const accountSchema = z.object({
  acc_level: z.number(),
  acc_title: z.string(),
  acc_nature: z.string(),
  acc_parent: z.number(),
  acc_status: z.number(),
});

// create accounts'
export const createAccAccounts = async (
  req: Request,
  res: Response
): Promise<Response |undefined> => {
  const body = accountSchema.safeParse(req.body);
  try {
    if (!body.success) return ValidationError(body, res);

    const data: AccAcountsProps = req.body;
    const level = await AccAccounts.findAll();
    
    // counter
    let counter:number = 0;
    if (data.acc_parent) {
      counter = await AccAccounts.count({ where: { acc_parent: data.acc_parent } }) + 1;
      const parent = await AccAccounts.findByPk(data.acc_parent);
      data.acc_level_code = `${parent?.getDataValue('acc_level_code')}-${counter}`;
    } else {
      counter = await AccAccounts.count({ where: { acc_parent: null } }) + 1;
      data.acc_level_code = `${counter}`;
    }
    const newLevel = await AccAccounts.create(data);
    if (newLevel) {
      ResponseMessage(res,201,data,'Level added successfully!')
    } else {
      ErrorMessage(res, 'Level not added!',500)
    }
  } catch (error) {
    console.error(error);
   ErrorMessage(res,error,400)
  }

  // try {
  //   const data: AccAcountsProps = req.body;
  //   const level = await AccAccounts.findAll();
  //   let counter;
  //   if (data.acc_parent) {
  //     counter =
  //       (await AccAccounts.count({ where: { acc_parent: data?.acc_parent } })) +
  //       1;
  
  //     // const parent = await AccAccounts.findOne({where:{acc_parent:data?.acc_parent}});

  //     // console.log(parent);

  //     const parent = await AccAccounts.findByPk(data?.acc_parent);
  //     data.acc_level_code = `${parent?.getDataValue(
  //       "acc_level_code"
  //     )}-${counter}`;
  //   } else {
  //     counter = (await AccAccounts.count({ where: { acc_parent: null } })) + 1;

  //     data.acc_level_code = `${counter}`;
  //   }


  //   const newLevel = await AccAccounts.create(data);

  //   if (newLevel) {
  //     return res
  //       .status(201)
  //       .json({ message: "Level added successfully!", data: newLevel });
  //   } else {
  //     return res.status(500).json({ error: "Level not added!" });
  //   }
  // } catch (err) {
  //   console.error(err);
  //   return res.status(500).json({ error: "Something went wrong!" });
  // }

  // const {
  //   acc_level,
  //   acc_level_code,
  //   acc_title,
  //   acc_nature,
  //   acc_parent,
  // } = req.body;

  // // const { acc_active, acc_nature, acc_title, level, parent_id } = req.body;

  // try {
  //   const valid: any = {
  //     acc_status: { [Op.ne]: null },
  //     acc_nature: { [Op.ne]: null },
  //     acc_title: { [Op.ne]: null },
  //     acc_level_code: { [Op.ne]: null },
  //   };

  //   if (acc_level_code !== 1) {
  //     valid["acc_parent"] = { [Op.ne]: null };

  //     const counter = await AccAccounts.count({
  //       where: {
  //         acc_parent,
  //       },
  //     });
  //     const parent: any = await AccAccounts.findOne({
  //       where: {
  //         acc_id: acc_parent,
  //       },
  //       attributes: ["acc_level_code"],
  //     });
  //     const acc_code = `${parent?.acc_level_code}-${counter + 1}`;
  //     // res.json({ message: "Account added successfully!", parent });

  //     const account = await AccAccounts.create({
  //       acc_level_code: acc_code,
  //       ...req.body
  //     });

  //     res.json({ message: "Account added successfully!", account });
  //   } else {
  //     const counter = await AccAccounts.count({
  //       where: {
  //         // acc_parent: 1,
  //       },

  //     },);
  //     const acc_code = counter + 1;

  //     const account = await AccAccounts.create({
  //       acc_level_code: acc_code.toString(),
  //       ...req.body
  //     });

  //     res.json({ message: "Account added successfully!", account });
  //   }
  // } catch (error) {
  //   res.status(500).json({ message: "Error adding account", error });
  // }

  // try {
  //   const data = await AccAccounts.create(req.body);
  //   res.status(200).json({
  //     status: "success",
  //     message: "account created successfully",
  //     data,
  //   });
  // } catch (error) {
  //   res.status(200).json({
  //     status: "fail",
  //     message: error,
  //   });
  // }
};

// get all accounts
export const getAccAccounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await AccAccounts.findAll();
    ResponseMessage(res,200,data)
  } catch (error) {
    ErrorMessage(res,error,400)
  }
};

// get single accounts
export const getSingleAccAccounts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const data: any = await AccAccounts.findOne({
      where: { acc_id: req.params.id },

    });
    if (!data) return ErrorMessage(res,"no data found",404)
    ResponseMessage(res,200,data)
  } catch (error) {
    ErrorMessage(res,error,400)
  }
};

// edit accounts
export const editAccAccounts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const data: any = await AccAccounts.findOne({
      where: { acc_id: req.params.id },
    });
    if (!data) return ErrorMessage(res,"no data found",404)
    let updateData = await AccAccounts.update(
      {
        acc_title: req.body.acc_title,
      },
      { where: { acc_id: req.params.id } }
    );
    // data.acc_title = req.body.acc_title;
    // data.acc_status = req.body.acc_status;
    // data?.save();
    ResponseMessage(res,200,undefined,"data updated successfully")
  } catch (error) {
    ErrorMessage(res,error,400)
  }
};

// update account status
export const updateAccAccountStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const data: any = await AccAccounts.findOne({
      where: { acc_id: req.params.id },
    });
    if (!data) return ErrorMessage(res,"no data found",404)
    let updateData = await AccAccounts.update(
      {
        acc_status: req.body.acc_status,
      },
      { where: { acc_id: req.params.id } }
    );
    ResponseMessage(res,200,undefined,"status updated successfully")
  } catch (error) {
    ErrorMessage(res,error,400)
  }
};

// import express, { Request, Response } from 'express';
// import { Op } from 'sequelize';
// import { Account } from './models/Account';

// const app = express();
// const port = 3000;

// // Middleware for parsing JSON body
// app.use(express.json());

// // Routes
// app.get('/accounts', async (req: Request, res: Response) => {
//   try {
//     const levels = await Account.findAll();
//     res.json(levels);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching accounts', error });
//   }
// });

// app.post('/accounts', async (req: Request, res: Response) => {
//   const { acc_active, acc_nature, acc_title, level, parent_id } = req.body;

//   try {
//     const valid = {
//       acc_active: { [Op.ne]: null },
//       acc_nature: { [Op.ne]: null },
//       acc_title: { [Op.ne]: null },
//       level: { [Op.ne]: null },
//     };

//     if (level !== 1) {
//       valid['parent_id'] = { [Op.ne]: null };

//       const counter = await Account.count({
//         where: {
//           parent_id,
//         },
//       });
//       const parent = await Account.findOne({
//         where: {
//           acc_id: parent_id,
//         },
//         attributes: ['acc_code'],
//       });
//       const acc_code = `${parent?.acc_code}-${counter + 1}`;

//       const account = await Account.create({
//         acc_active,
//         acc_nature,
//         acc_title,
//         level,
//         parent_id,
//         acc_code,
//       });

//       res.json({ message: 'Account added successfully!', account });
//     } else {
//       const counter = await Account.count({
//         where: {
//           parent_id: null,
//         },
//       });
//       const acc_code = counter + 1;

//       const account = await Account.create({
//         acc_active,
//         acc_nature,
//         acc_title,
//         level,
//         acc_code,
//       });

//       res.json({ message: 'Account added successfully!', account });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding account', error });
//   }
// });

// app.get('/accounts/:id', async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const record = await Account.findOne({
//       where: {
//         acc_id: id,
//       },
//       include: [
//         {
//           model: Account,
//           as: 'parent',
//           attributes: ['acc_title'],
//         },
//       ],
//     });

//     res.json(record);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching account', error });
//   }
// });

// app.patch('/accounts/:id', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { acc_title, acc_active } = req.body;

//   try {
//     const account = await Account.update(
//       {
//         acc_title,
//         acc_active,
//       },
//       {
//         where: {
//           acc_id: id,
//         },
//       }
//     );

//     if (account[0] === 1) {
//       res.json({ message: 'Record updated successfully' });
//     } else {
//       res.status(404).json({ message: 'Record not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating record', error });
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
