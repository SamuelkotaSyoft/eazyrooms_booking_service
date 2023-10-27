import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
var router = express.Router();

//import models
import Bookings from "../../models/bookingModel.js";
import User from "../../models/userModel.js";

//get user by id
router.get("/:bookingId", async function (req, res) {
  //payload
  const bookingId = req.params.bookingId;

  //validate bookingId
  if (!bookingId) {
    return res
      .status(400)
      .json({ status: false, error: "Booking id is required" });
  }

  try {
    //query
    let query = Bookings.findOne({ _id: bookingId }).populate("guests");

    //execute query
    const queryResult = await query.exec();

    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
});

export default router;
