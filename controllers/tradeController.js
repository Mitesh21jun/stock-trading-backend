import mongoose from "mongoose";
import Trade from "../models/Trade.js";
import Lot from "../models/Lot.js";
import { handleDebitLots } from "../utils/lotHelper.js";

export const create = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      stock_name,
      trade_type,
      quantity,
      price,
      broker_name,
      sale_type = "fifo",
    } = req.body;

    if (
      ![stock_name, trade_type, quantity, price, broker_name].every(Boolean)
    ) {
      return res
        .status(400)
        .json({
          message:
            "stock_name, trade_type, quantity, price, broker_name required",
        });
    }
    const amount = quantity * price;
    const trade = await new Trade({
      stock_name,
      trade_type,
      quantity,
      price,
      amount,
      broker_name,
    }).save({ session });

    if (trade_type === "CREDIT") {
      await new Lot({
        trade_id: trade._id,
        stock_name,
        lot_quantity: quantity,
        realized_quantity: 0,
        lot_status: "OPEN",
      }).save({ session });
    } else if (trade_type === "DEBIT") {
      const remaining = await handleDebitLots({
        stock_name,
        quantity,
        sale_type,
        trade_id: trade._id,
        session,
      });

      if (remaining > 0) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({
            message: "Not enough stock",
            remaining_quantity: `${remaining} quantity needed`,
          });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid trade_type" });
    }

    await session.commitTransaction();
    res
      .status(201)
      .json({
        message: `Trade processed${
          trade_type === "DEBIT" ? ` with ${sale_type.toUpperCase()}` : ""
        }`,
        trade,
      });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ message: "Error processing trade", error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAll = async (req, res) => {
  try {
    const query = req.query;
    const trades = await Trade.find(query);
    res.status(200).json(trades);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error?.message });
  }
};
