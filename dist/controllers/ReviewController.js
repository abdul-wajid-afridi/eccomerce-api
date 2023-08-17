"use strict";
// import { Request, Response } from 'express';
// import { Op } from 'sequelize';
// import { Product, Review } from '../models';
// export const createReview = async (req: Request, res: Response) => {
//   const { productId, rating, comment } = req.body;
//   const userId = req.user.id;
//   try {
//     // Check if the user has already reviewed the product
//     const existingReview = await Review.findOne({
//       where: {
//         productId,
//         userId,
//       },
//     });
//     if (existingReview) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'You have already reviewed this product.',
//       });
//     }
//     // Create a new review for the product
//     const newReview = await Review.create({
//       userId,
//       productId,
//       rating,
//       comment,
//     });
//     // Calculate the average rating for the product
//     const reviews = await Review.findAll({
//       where: {
//         productId,
//       },
//     });
//     const ratings = reviews.map((review) => review.rating);
//     const averageRating =
//       ratings.reduce((a, b) => a + b, 0) / ratings.length;
//     // Update the product's average rating
//     await Product.update(
//       { averageRating },
//       {
//         where: {
//           id: productId,
//         },
//       }
//     );
//     return res.status(201).json({
//       status: 'success',
//       message: 'Review created successfully.',
//       data: newReview,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: 'error',
//       message: 'Unable to create review at this time.',
//     });
//   }
// };
// import { Request, Response } from 'express';
// import { Op } from 'sequelize';
// import { Product, Review } from '../models';
// interface CreateReviewRequest {
//   productId: number;
//   rating: number;
//   comment: string;
// }
// export const createReview = async (
//   req: Request<{}, {}, CreateReviewRequest>,
//   res: Response
// ) => {
//   const { productId, rating, comment } = req.body;
//   const userId = req.user.id;
//   try {
//     // Check if the user has already reviewed the product
//     const existingReview = await Review.findOne({
//       where: {
//         productId,
//         userId,
//       },
//     });
//     if (existingReview) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'You have already reviewed this product.',
//       });
//     }
//     // Create a new review for the product
//     const newReview = await Review.create({
//       userId,
//       productId,
//       rating,
//       comment,
//     });
//     // Calculate the average rating for the product
//     const reviews = await Review.findAll({
//       where: {
//         productId,
//       },
//     });
//     const ratings = reviews.map((review) => review.rating);
//     const averageRating =
//       ratings.reduce((a, b) => a + b, 0) / ratings.length;
//     // Update the product's average rating
//     await Product.update(
//       { averageRating },
//       {
//         where: {
//           id: productId,
//         },
//       }
//     );
//     return res.status(201).json({
//       status: 'success',
//       message: 'Review created successfully.',
//       data: newReview,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: 'error',
//       message: 'Unable to create review at this time.',
//     });
//   }
// };
