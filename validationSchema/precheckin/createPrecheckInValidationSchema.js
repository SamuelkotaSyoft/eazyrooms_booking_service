import { body, query } from "express-validator";
import bookingModel from "../../models/bookingModel.js";
import { emailAddressRegex, phoneNumberRegex } from "../../helpers/regex.js";
const createPrecheckinValidationSchema = [
  body("arrivingFrom").isString(),
  body("goingTo").isString(),
  body("purposeOfVisit").isString(),
  body("booking").custom(async (bookingId) => {
    const isValidBooking = await bookingModel.findById(bookingId);
    if (!isValidBooking) {
      throw new Error("Invalid booking id");
    }
  }),
  body("guestDetails.*.address.addressLine1").notEmpty(),
  body("guestDetails.*.address.addressLine2").optional().notEmpty(),
  body("guestDetails.*.address.city").notEmpty(),
  body("guestDetails.*.address.state").notEmpty(),
  body("guestDetails.*.address.country").notEmpty(),
  body("guestDetails.*.address.postCode").notEmpty(),
  body("guestDetails.*.firstName").isString(),
  body("guestDetails.*.lastName").isString(),
  body("guestDetails.*.emailAddress").isEmail(),
  body("guestDetails.*.phoneNumber").isString().matches(phoneNumberRegex),
  // body("guestDetails.*.country").isString(),
  body("guestDetails.*.gender").matches(
    /^(male|female|other|preferNotToSay)$/i
  ),
  body("guestDetails.*.kycDocs")
    .isArray()
    .withMessage("kycDocs must be an array"),
  body("guestDetails.*.emailAddress"),
];
export { createPrecheckinValidationSchema };
