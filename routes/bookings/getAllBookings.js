import express from "express";
var router = express.Router();

//import middleware
import verifyToken from "../../helpers/verifyToken.js";

//import models
import Booking from "../../models/bookingModel.js";
import User from "../../models/userModel.js";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import { matchedData } from "express-validator";
import { commonGetRequestValidationSchema } from "../../validationSchema/commonSchema.js";
import { getAllBookingValidationSchema } from "../../validationSchema/bookings/getAllBookingValidationSchema.js";
import guestModel from "../../models/guestModel.js";

async function getAllBookings(req, res) {
  const uid = req.user_info.main_uid;
  const requestData = matchedData(req);
  const role = req.user_info.role;

  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    const user = await User.findOne({ uid: uid });
    //if the user wants pagination
    var skip = 0;
    var limit = null;
    let filterObj = {
      status: true,
    };
    if (requestData.status) {
      filterObj.status = requestData.status;
    }
    if (requestData.page && requestData.limit) {
      skip = (requestData.page - 1) * requestData.limit;
      limit = requestData.limit;
    }
    if (requestData?.locationId) {
      filterObj.location = requestData.locationId;
    }
    if (requestData?.bookingStatus) {
      filterObj.bookingStatus = requestData.bookingStatus;
    }
    console.log(filterObj);
    if (requestData?.q) {
      const guest = await guestModel.find({
        $or: [
          { email: { $regex: requestData?.q, $options: "i" } },
          { phoneNumber: { $regex: requestData?.q, $options: "i" } },
        ],
      });
      const guestIds = guest.map((guest) => guest._id);
      // filterObj.guests = { $elemMatch: { $in: guestIds } };
      filterObj.guests = { $in: guestIds };
    }

    var query = Booking.find(filterObj)
      .populate("bookedBy")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("guests")
      .populate("roomType")
      .populate("roomNumber");
    const queryResult = await query.exec();

    const bookingCount = await Booking.countDocuments(filterObj).exec();
    res.status(200).json({
      status: true,
      data: {
        bookings: queryResult,
        page: Number(requestData.page),
        limit: limit,
        totalPageCount: Math.ceil(bookingCount / limit),
        totalCount: bookingCount,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
}
//get all tasks
router.get(
  "/:locationId",
  verifyToken,
  getAllBookingValidationSchema,
  commonGetRequestValidationSchema,
  validateRequest,
  getAllBookings
);

export default router;
