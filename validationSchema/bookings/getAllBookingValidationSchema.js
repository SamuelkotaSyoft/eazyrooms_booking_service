import { body, query, param } from "express-validator";
import locationModel from "../../models/locationModel.js";

const getAllBookingValidationSchema = [
  query("bookingStatus")
    .optional()
    .matches(/^(booked|checkedIn|checkedOut|cancelled|noshow|null)$/i),
  param("locationId").custom(async (locationId) => {
    const isValidLocation = await locationModel.findOne({
      _id: locationId,
      status: true,
    });
    if (!isValidLocation) {
      throw new Error("Invalid location id");
    }
  }),
];

export { getAllBookingValidationSchema };
