"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dbConfig_1 = __importDefault(require("./db/dbConfig"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// routes
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const ProductRoutes_1 = __importDefault(require("./routes/ProductRoutes"));
const CatagoryRoutes_1 = __importDefault(require("./routes/CatagoryRoutes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = parseInt(process.env.PORT || "3000");
// middlewares
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("", express_1.default.static("uploads"));
app.use((0, cors_1.default)({
    // origin: {
    //   URL: "http://localhost:3000/",
    // },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
// tables genrating
// make it comment when once table is created
// dbInit;
// routes
app.use("/api_v1", UserRoutes_1.default);
app.use("/api_v1", ProductRoutes_1.default);
app.use("/api_v1", CatagoryRoutes_1.default);
dbConfig_1.default.sync()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`PORT runs on ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Unable to connect to the database:", error);
});
// app.listen(port, host, () => console.log(`app runs on ${port} at http${host}`));
