import express from "express";
import cors from "cors";
import Connection from "./db/dbConfig";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// models
import dbInit from "./db/Init";
// routes
import catagoryRoutes from "./routes/CatagoryRoutes";
import GemTypeRoutes from "./routes/GemTypeRoute";
import orderRoute from "./routes/OrderRoutes";
import productRoutes from "./routes/ProductRoutes";
import userRoutes from "./routes/UserRoutes";

const app = express();
dotenv.config();
const PORT: number = parseInt(process.env.PORT || "3002");

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("", express.static("uploads"));
app.use(
  cors({
    // origin: {
    //   URL: "http://localhost:3000/",
    // },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// tables genrating
// make it comment when once table is created
dbInit;

// routes
app.use("/api", productRoutes);
app.use("/api", catagoryRoutes);
app.use("/api", GemTypeRoutes);
app.use("/api", orderRoute);
app.use("/api", userRoutes);

Connection.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`PORT runs on ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("Unable to connect to the database:", error);
  });

// app.listen(port, host, () => console.log(`app runs on ${port} at http${host}`));
