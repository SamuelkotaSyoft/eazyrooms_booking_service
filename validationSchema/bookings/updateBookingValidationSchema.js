import { body, query } from "express-validator";
import bookingModel from "../../models/bookingModel.js";

const updateBookingValidationSchema = [
  body("bookingId").custom(async (bookingId) => {
    const isValidBooking = await bookingModel.findOne({ _id: bookingId });
    if (!isValidBooking) {
      throw new Error("Invalid Booking Id");
    }
  }),
  body("roomType").optional(),
  body("checkInDateTime").optional(),
  body("checkOutDateTime").optional(),
  body("roomType").optional().notEmpty().withMessage("Room type is required"),
  body("roomNumber").optional(),
  body("status").optional(),
  body("active").optional(),
  body("paymentStatus")
    .toLowerCase()
    .optional()
    .matches(/^(paid|unpaid|pending|unsettled)$/i)
    .toLowerCase(),
  body("paymentMethod")
    .toLowerCase()
    .optional()
    .matches(/^(cash|card|bank|online|wallets)$/i),
  body("guests").optional().isArray(),
  body("initialPrice").optional().isNumeric(),
  body("discount.discountType")
    .optional()
    .toLowerCase()
    .matches(/^(flat|percentage|nodiscount)$/i)
    .isString()
    .withMessage(
      "Discount type  should be either flat,No discount or percentage"
    ),
  body("discount.discountValue")
    .optional()
    .isNumeric()
    .toFloat()
    .withMessage("Discount value is required"),
  body("tax").optional().isArray(),
  body("bookingStatus")
    .optional()
    .matches(/^(booked|checkedIn|checkedOut|cancelled|noshow)$/i),
  body("preCheckInStatus")
    .optional()
    .matches(/^(approved|rejected)$/i),
  body("transaction").optional().isString(),
];

export { updateBookingValidationSchema };
