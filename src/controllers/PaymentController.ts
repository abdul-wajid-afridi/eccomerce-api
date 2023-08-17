import Stripe from "stripe";
import dotEnv from "dotenv";
import { Request, Response } from "express";
// dotEnv.config({ path: "../.env" });
// const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY);

// const stripe = new Stripe(
//   "sk_test_51MH7rjLByWH0aUrU8LAmJWCkLMqEpK79huBFgnAF1DdCBUENl6YuNhplsITYncAg1ijNZh8m2AgyZVSJpItSTihA00WxwVBT1e"
// );

const stripe = new Stripe(
  "sk_test_51MH7rjLByWH0aUrU8LAmJWCkLMqEpK79huBFgnAF1DdCBUENl6YuNhplsITYncAg1ijNZh8m2AgyZVSJpItSTihA00WxwVBT1e",
  {
    apiVersion: "2022-11-15",
  }
);
export const stripePayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payments = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "pkr",
      metadata: {
        company: "Al-Hadi-Store",
      },
    });

    res.status(200).json({
      status: "success",
      client_secret: payments.client_secret,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const GetStripeKey = (req: Request, res: Response): void => {
  try {
    res.status(200).json({
      publishKey: process.env.STRIPE_PUBLISH_KEY,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
