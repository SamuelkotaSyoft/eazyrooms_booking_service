import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
//import models
import { matchedData } from "express-validator";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import Booking from "../../models/bookingModel.js";
import Guest from "../../models/guestModel.js";
import User from "../../models/userModel.js";
import { updateBookingValidationSchema } from "../../validationSchema/bookings/updateBookingValidationSchema.js";
import notify from "../../helpers/notifications/notify.js";
var router = express.Router();
import axios from "axios";

//createBooking
async function updateBookingById(req, res) {
  //validate userId

  try {
    const requestData = matchedData(req);
    const uid = req.user_info.main_uid;

    const user = await User.findOne({ uid: uid });
    if (!user) {
      res.status(400).json({ status: false, error: "Invalid user" });
      return;
    }

    let updateGuestResults = await new Promise(async (resolve, reject) => {
      let updateGuestResults = [];
      for (let i = 0; i < requestData?.guests?.length; i++) {
        const updateGuestRes = await Guest.findByIdAndUpdate(
          {
            _id: requestData.guests[i].guestId,
          },
          {
            name: requestData.guests[i].name,
            email: requestData.guests[i].email,
            phoneNumber: requestData.guests[i].phoneNumber,
            dateOfBirth: requestData.guests[i].dateOfBirth,
            gender: requestData.guests[i].gender,
            address: {
              addressLine1: requestData.guests[i].addressLine1,
              addressLine2: requestData.guests[i].addressLine2,
              city: requestData.guests[i].city,
              state: requestData.guests[i].state,
              postCode: requestData.guests[i].postCode,
            },
          }, //copy values from createGuest
          { new: true }
        );
        console.log({ updateGuestRes });
        updateGuestResults.push(updateGuestRes._id);
      }
      resolve(updateGuestResults);
    });

    const updateBookingResult = await Booking.findByIdAndUpdate(
      {
        _id: requestData.bookingId,
      },

      {
        ...requestData,
        checkInDateTime: requestData.checkInDateTime,
        checkOutDateTime: requestData.checkOutDateTime,
        roomType: requestData.roomType,
        roomNumber: requestData.roomNumber,
        updatedBy: user._id,
      },
      { new: true }
    );
    axios.post(`${process.env.SOCKET_SERVICE_URL}/sendBookingListEvents`, {
      bookingId: requestData.bookingId,
    });
    await notify({
      userId: user._id,
      propertyId: user.property,
      location: [updateBookingResult.location],
      role: ["locationAdmin"],
      notificationText:
        user.fullName +
        " has updated a new booking having" +
        updateBookingResult.guests.length +
        "guests",
      authToken: req.headers["eazyrooms-token"],
    });

    // send checkout message
    try {
      await axios.post(
        process.env.CAMPAIGNS_SERVICE_URL + "/sendTransactionalWAMessage",
        {
          templateName: "checkout_confirm",
          phoneNumber: updateBookingResult.guests[0].phoneNumber?.replace(
            "+",
            ""
          ),
          variables: {
            name: updateBookingResult.guests[0].name,
            location: updateBookingResult.location,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    res.status(200).json({ status: true, data: updateBookingResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
//create chatbot
router.patch(
  "/",
  verifyToken,
  updateBookingValidationSchema,
  validateRequest,
  updateBookingById
);

export default router;
