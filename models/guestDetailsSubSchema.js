import mongoose from "mongoose";
import { emailAddressRegex, phoneNumberRegex } from "../helpers/regex.js";
import { addressSubSchema } from "./addressSubSchema.js";

const guestDetailsSubSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  country: String,
  gender: {
    type: String,
    enum: ["male", "female", "other", "preferNoToSay"],
  },
  phoneNumber: {
    type: String,
    match: phoneNumberRegex,
  },
  emailAddress: {
    type: String,
    match: emailAddressRegex,
  },
  address: {
    type: addressSubSchema,
  },
  kycDocs: {
    type: [String],
    required: false,
  },
});

export { guestDetailsSubSchema };
