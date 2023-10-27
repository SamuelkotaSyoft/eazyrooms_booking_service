import { body, query } from "express-validator";
import { phoneNumberRegex } from "../../helpers/regex.js";
import roomModel from "../../models/roomModel.js";
import mongoose from "mongoose";
const createBookingValidationSchema = [
  body("location").notEmpty().withMessage("Location is required"),
  body("roomType").notEmpty().withMessage("RoomType is required"),
  body("checkInDateTime").notEmpty(),
  // .matches(dateTimeRegex)
  // .withMessage("CheckInDateTime is required"),
  body("checkOutDateTime").optional(),
  // .matches(dateTimeRegex)
  // .withMessage("checkOutDateTime is required"),
  body("roomNumber")
    .optional()
    .custom(async (roomNumberId, { req }) => {
      if (!mongoose.isValidObjectId(roomNumberId)) {
        throw new Error("Room number is not a valid ObjectId");
      }
      const isRoomNumberAssociatedWithRoomType = await roomModel.findOne({
        _id: roomNumberId,
        roomType: req.body.roomType,
      });
      if (!isRoomNumberAssociatedWithRoomType) {
        throw new Error("Room number is not associated with roomType");
      }
    }),
  body("paymentStatus")
    .optional()
    .matches(/^(paid|unpaid|pending|unsettled)$/i)
    .toLowerCase(),
  body("paymentMethod")
    .optional()
    .matches(/^(cash|card|bank|online|wallets)$/i),
  /**
   * guest details
   */
  body("guests").optional().isArray(),
  body("guests.*.name").optional(),
  body("guests.*.email").optional().isEmail().withMessage("Invalid email"),
  body("guests.*.phoneNumber")
    .optional({ allow: null | "" | undefined })
    .matches(phoneNumberRegex)
    .isMobilePhone("any")
    .custom((phoneNumber, { req }) => {
      const phoneNumbers = req.body.guests.map((guest) => guest.phoneNumber);
      console.log({ phoneNumbers });
      if (phoneNumber?.length < 0) {
        throw new Error("At least one Phone number is required");
      }
      function hasDuplicateStrings(array) {
        const uniqueSet = new Set(array);
        return uniqueSet.size !== array.length;
      }
      const hasDuplicates = hasDuplicateStrings(phoneNumbers);
      if (hasDuplicates) {
        throw new Error("Duplicate phone numbers are not allowed");
      } else {
        return true;
      }
    }),
  body("guests.*.isChild").optional().isBoolean(),
  body("guests.*.age").optional().isNumeric(),
  body("guests.*.gender")
    .matches(/^(male|female|other|preferNoToSay)$/i)
    .optional(),
  body("guests.*.address.city").optional(),
  body("guests.*.address.state").optional(),
  body("guests.*.address.postCode").isPostalCode("any").optional(),
  body("guests.*.address.addressLine1").optional(),
  body("guests.*.address.addressLine2").optional(),
  /**
   * discount
   */
  body("initialPrice").optional().isNumeric(),
  body("discount.discountType")
    .optional()
    .toLowerCase()
    .matches(/^(flat|percentage|nodiscount)$/i)
    .isString()
    .withMessage(
      "Discount type  should be either flat, No discount or percentage"
    ),
  body("discount.discountValue")
    .optional()
    .isNumeric()
    .toFloat()
    .withMessage("Discount value is required"),
  body("tax").optional().isArray(),
  body("transaction").optional().isString(),
];
export { createBookingValidationSchema };
