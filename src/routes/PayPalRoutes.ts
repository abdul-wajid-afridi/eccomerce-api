import { createPayment, executePayment } from "../controllers/PayPalController";
import {
  GetStripeKey,
  stripePayments,
} from "./../controllers/PaymentController";
import { Request, Response, Router } from "express";

const router = Router();

// Create a PayPal payment
router.post("/create-payment", createPayment);

// Execute a PayPal payment
router.get("/execute-payment", executePayment);

export default router;
