import * as paypal from "paypal-rest-sdk";

import { Request, Response } from "express";
paypal.configure({
  mode: "sandbox", // Change to 'live' for production
  client_id: "YOUR_CLIENT_ID",
  client_secret: "YOUR_CLIENT_SECRET",
});

export const createPayment = async (req: Request, res: Response) => {
  const createPaymentJson = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "YOUR_RETURN_URL",
      cancel_url: "YOUR_CANCEL_URL",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Product Name",
              sku: "SKU001",
              price: "10.00", // Replace with the actual product price
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "10.00", // Replace with the actual total amount
        },
        description: "Description of your product",
      },
    ],
  };

  try {
    paypal.payment.create(
      createPaymentJson,
      (error: paypal.SDKError, payment: any) => {
        if (error) {
          throw error;
        } else {
          // Redirect the buyer to the PayPal approval URL
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.redirect(payment.links[i].href);
            }
          }
        }
      }
    );
  } catch (error) {
    console.error("Error creating PayPal payment:", error);
    res.status(500).json({ error: "Unable to create PayPal payment." });
  }
};

// excute payemnts
export const executePayment = async (req: Request, res: Response) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId as any;

  const executePaymentJson: any = {
    payer_id: payerId,
  };

  try {
    paypal.payment.execute(paymentId, executePaymentJson, (error, payment) => {
      if (error) {
        throw error;
      } else {
        // Handle successful payment completion
        res.send("Payment successful");
      }
    });
  } catch (error) {
    console.error("Error executing PayPal payment:", error);
    res.status(500).json({ error: "Unable to execute PayPal payment." });
  }
};
