import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import lotRoutes from "./routes/lotRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/",  (req, res) => res.json({ status: 'Server Online' })); // Server Status check
app.use("/api/trade", tradeRoutes);
app.use("/api/lot", lotRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server ready at http://localhost:${PORT}`)
);
