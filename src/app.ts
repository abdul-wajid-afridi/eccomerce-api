import express from "express";
import cors from "cors";
import Connection from "./db/dbConfig";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// models
import dbInit from "./db/Init";
// routes
import userRoutes from "./routes/UserRoutes";
import productRoutes from "./routes/ProductRoutes";
import catagoryRoutes from "./routes/CatagoryRoutes";

const app = express();
dotenv.config();
const PORT: number = parseInt(process.env.PORT || "3004");

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
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
  })
);

// tables genrating
// make it comment when once table is created
dbInit

// routes
app.use("/api_v1", userRoutes);
app.use("/api_v1", productRoutes);
app.use("/api_v1", catagoryRoutes);

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
