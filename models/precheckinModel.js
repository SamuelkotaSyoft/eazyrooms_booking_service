import mongoose from "mongoose";
import { guestDetailsSubSchema } from "./guestDetailsSubSchema.js";
import { addressSubSchema } from "./addressSubSchema.js";

const precheckInSchema = mongoose.Schema(
  {
    arrivingFrom: {
      type: String,
    },
    goingTo: {
      type: String,
    },
    purposeOfVisit: {
      type: String,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    address: {
      type: addressSubSchema,
      required: false,
    },
    guestDetails: {
      type: [guestDetailsSubSchema],
    },
    specialInstructions: {
      type: String,
      required: false,
    },
    accepted: {
      type: Boolean,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Precheckin", precheckInSchema);
