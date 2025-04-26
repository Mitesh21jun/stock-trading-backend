import Lot from "../models/Lot.js";

export const handleDebitLots = async ({
  stock_name,
  quantity,
  sale_type,
  trade_id,
  session,
}) => {
  let remaining = quantity;

  const sortOrder = sale_type?.toLowerCase() === "fifo" ? 1 : -1;

  const lots = await Lot.find({
    stock_name,
    lot_status: { $ne: "FULLY REALIZED" },
  })
    .sort({ created_at: sortOrder })
    .session(session);

  for (const lot of lots) {
    const available = lot.lot_quantity - lot.realized_quantity;
    if (available <= 0) continue;

    const used = Math.min(available, remaining);
    const updatedRealized = lot.realized_quantity + used;

    Object.assign(lot, {
      realized_quantity: updatedRealized,
      realized_trade_id: trade_id,
      lot_status:
        updatedRealized === lot.lot_quantity
          ? "FULLY REALIZED"
          : "PARTIALLY REALIZED",
    });

    await lot.save({ session });
    remaining -= used;
    if (remaining <= 0) break;
  }

  return remaining;
};
