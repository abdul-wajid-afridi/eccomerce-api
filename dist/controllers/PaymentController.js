"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStripeKey = exports.stripePayments = void 0;
const stripe_1 = __importDefault(require("stripe"));
// dotEnv.config({ path: "../.env" });
// const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY);
// const stripe = new Stripe(
//   "sk_test_51MH7rjLByWH0aUrU8LAmJWCkLMqEpK79huBFgnAF1DdCBUENl6YuNhplsITYncAg1ijNZh8m2AgyZVSJpItSTihA00WxwVBT1e"
// );
const stripe = new stripe_1.default("sk_test_51MH7rjLByWH0aUrU8LAmJWCkLMqEpK79huBFgnAF1DdCBUENl6YuNhplsITYncAg1ijNZh8m2AgyZVSJpItSTihA00WxwVBT1e", {
    apiVersion: "2022-11-15",
});
const stripePayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield stripe.paymentIntents.create({
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
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.stripePayments = stripePayments;
const GetStripeKey = (req, res) => {
    try {
        res.status(200).json({
            publishKey: process.env.STRIPE_PUBLISH_KEY,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};
exports.GetStripeKey = GetStripeKey;
