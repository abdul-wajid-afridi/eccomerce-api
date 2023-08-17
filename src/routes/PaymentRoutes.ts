import {
  GetStripeKey,
  stripePayments,
} from "./../controllers/PaymentController";
import { Router } from "express";

const router = Router();

router.post("/payments", stripePayments);
router.get("/stripe-key", GetStripeKey);

export default router;
