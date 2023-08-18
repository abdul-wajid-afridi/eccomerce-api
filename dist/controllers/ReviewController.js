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
// with mongodb
// // Create New Review or Update the review
// exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
//     const { rating, comment, productId } = req.body;
//     const review = {
//       user: req.user._id,
//       name: req.user.name,
//       rating: Number(rating),
//       comment,
//     };
//     const product = await Product.findById(productId);
//     const isReviewed = product.reviews.find(
//       (rev) => rev.user.toString() === req.user._id.toString()
//     );
//     if (isReviewed) {
//       product.reviews.forEach((rev) => {
//         if (rev.user.toString() === req.user._id.toString())
//           (rev.rating = rating), (rev.comment = comment);
//       });
//     } else {
//       product.reviews.push(review);
//       product.numOfReviews = product.reviews.length;
//     }
//     let avg = 0;
//     product.reviews.forEach((rev) => {
//       avg += rev.rating;
//     });
//     product.ratings = avg / product.reviews.length;
//     await product.save({ validateBeforeSave: false });
//     res.status(200).json({
//       success: true,
//     });
//   });
//   // Get All Reviews of a product
//   exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
//     const product = await Product.findById(req.query.id);
//     if (!product) {
//       return next(new ErrorHander("Product not found", 404));
//     }
//     res.status(200).json({
//       success: true,
//       reviews: product.reviews,
//     });
//   });
//   // Delete Review
//   exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
//     const product = await Product.findById(req.query.productId);
//     if (!product) {
//       return next(new ErrorHander("Product not found", 404));
//     }
//     const reviews = product.reviews.filter(
//       (rev) => rev._id.toString() !== req.query.id.toString()
//     );
//     let avg = 0;
//     reviews.forEach((rev) => {
//       avg += rev.rating;
//     });
//     let ratings = 0;
//     if (reviews.length === 0) {
//       ratings = 0;
//     } else {
//       ratings = avg / reviews.length;
//     }
//     const numOfReviews = reviews.length;
//     await Product.findByIdAndUpdate(
//       req.query.productId,
//       {
//         reviews,
//         ratings,
//         numOfReviews,
//       },
//       {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//       }
//     );
//     res.status(200).json({
//       success: true,
//     });
//   });
