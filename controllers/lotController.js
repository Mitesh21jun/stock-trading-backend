import Lot from "../models/Lot.js";

export const getAll = async (req, res) => {
  try {
    const query = req.query;
    const lots = await Lot.find(query);
    res.status(200).json(lots);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error?.message });
  }
};
