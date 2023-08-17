"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PaymentController_1 = require("./../controllers/PaymentController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/payments", PaymentController_1.stripePayments);
router.get("/stripe-key", PaymentController_1.GetStripeKey);
exports.default = router;
