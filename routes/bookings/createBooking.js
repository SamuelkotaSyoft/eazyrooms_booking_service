import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
//import models
import Booking from "../../models/bookingModel.js";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import { matchedData } from "express-validator";
import User from "../../models/userModel.js";
import Guest from "../../models/guestModel.js";
import Location from "../../models/locationModel.js";
var router = express.Router();
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import propertyModel from "../../models/propertyModel.js";
import { createBookingValidationSchema } from "../../validationSchema/bookings/createBookingValidationSchema.js";
import notify from "../../helpers/notifications/notify.js";
import sendEmail from "../../helpers/emails/sendEmail.js";
import axios from "axios";
import schedule from "node-schedule";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

//createBooking
async function createBooking(req, res) {
  //validate userId
  try {
    const requestData = matchedData(req);
    const uid = req.user_info.main_uid;
    const user = await User.findOne({ uid: uid });
    const location = await Location.findOne({ _id: requestData.location });
    const property = await propertyModel.findOne({ _id: user.property });
    var locationName = location.name;
    var propertyName = property.name;
    console.log("LOCATION NAME...", locationName);
    if (!user) {
      res.status(400).json({ status: false, error: "Invalid user" });
      return;
    }
    let saveGuestResults = await new Promise(async (resolve, reject) => {
      let saveGuestResults = [];
      for (let i = 0; i < requestData.guests.length; i++) {
        if (
          requestData.guests[i].phoneNumber !== "" &&
          requestData.guests[i].email !== "" &&
          requestData.guests[i].name !== "" &&
          requestData.guests[i].gender !== ""
        ) {
          const isGuestExists = await Guest.findOne({
            phoneNumber: requestData.guests[i].phoneNumber,
          });
          if (isGuestExists) {
            await Guest.findByIdAndUpdate(
              {
                _id: isGuestExists._id,
              },
              {
                property: user.property,
                location: requestData.location,
                ...requestData.guests[i],

                status: true,
              }
            );
            saveGuestResults.push(isGuestExists._id);
            continue;
          } else {
            const guest = new Guest({
              property: user.property,
              location: requestData.location,
              ...requestData.guests[i],
              status: true,
            });
            let saveGuestRes = await guest.save();
            console.log({ saveGuestRes });
            saveGuestResults.push(saveGuestRes._id);
          }
        }
      }
      resolve(saveGuestResults);
    });
    const checkInDateTime = new Date(requestData.checkInDateTime);
    checkInDateTime.setHours(checkInDateTime.getHours() - 6);
    const checkInDate6HoursBefore = checkInDateTime.toISOString();
    let precheckInExpire = false;

    if (new Date(checkInDate6HoursBefore) < new Date()) {
      precheckInExpire = true;
    }

    const booking = new Booking({
      ...{ ...requestData, guests: saveGuestResults },
      location: requestData.location,
      bookedBy: user._id,
      guests: saveGuestResults,
      property: user.property,
      createdBy: user._id,
      updatedBy: user._id,
      status: true,
      bookingStatus: "booked",
      preCheckInExpireTime: checkInDate6HoursBefore,
      preCheckInExpire: precheckInExpire,
    });
    const writableResult = await booking.save();

    const job = schedule.scheduleJob(
      checkInDate6HoursBefore,
      async function () {
        await Booking.findByIdAndUpdate(
          {
            _id: writableResult._id,
          },
          {
            preCheckInExpire: true,
          },
          {
            new: true,
          }
        );
        console.log("precheckinUpdated");
      }
    );

    try {
      axios.post(`${process.env.SOCKET_SERVICE_URL}/sendBookingListEvents`, {
        bookingId: writableResult._id,
      });
      await notify({
        userId: user._id,
        propertyId: user.property,
        location: [writableResult.location],
        role: ["locationAdmin"],
        notificationText:
          user.fullName +
          " has created a new booking having " +
          writableResult.guests.length +
          " guests",
        authToken: req.headers["eazyrooms-token"],
      });
    } catch (err) {}
    const primaryGuestEmail = requestData.guests[0]?.email;
    // const primaryGuestName = requestData.guests[0]?.name;
    var bookingId = writableResult._id;
    var checkIn = writableResult?.checkInDateTime;
    var date = new Date(checkIn);
    var localDate = dayjs(date).tz();
    // const formattedDate = localDate.format("YYYY-MM-DD");
    var dateNumber = localDate.format("D");
    var month = localDate.format("MMMM");
    var year = localDate.format("YYYY");
    var time = localDate.format("HH:mm");
    var dayOfWeek = localDate.format("dddd");
    try {
      //send email to guest
      await sendEmail({
        email: primaryGuestEmail,
        subject: `Welcome to ${propertyName} - ${locationName}!`,
        templateName: "precheckinTemplate",
        variables: {
          bookingId: bookingId,
          locationName: locationName,
          propertyName: propertyName,
          dateNumber: dateNumber,
          dayOfWeek: dayOfWeek,
          month: month,
          year: year,
          time: time,
        },
        authToken: req.headers["eazyrooms-token"],
      });
    } catch (error) {
      console.log("Error sending welcome precheckin email to guest", error);
    }
    // send whatsapp message to guest
    try {
      await axios.post(
        process.env.CAMPAIGNS_SERVICE_URL + "/sendTransactionalWAMessage",
        {
          templateName: "precheckin",
          phoneNumber: requestData.guests[0]?.phoneNumber.replace("+", ""),
          variables: {
            name: requestData.guests[0]?.name,
            locationName: locationName,
            precheckinLink: `https://guest.eazyrooms.com/pre-check-in/${bookingId}`,
          },
        }
      );
    } catch (error) {
      console.log("Error sending welcome precheckin whatsapp to guest", error);
    }
    res.status(200).json({ status: true, data: writableResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

router.post(
  "/",
  verifyToken,
  createBookingValidationSchema,
  validateRequest,
  createBooking
);

export default router;
