import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    checkInDateTime: {
      type: Date,
      required: true,
    },
    checkOutDateTime: {
      type: Date,
      required: false,
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "RoomType",
    },
    //TODO ask karthik weather roomNumber is a string or number or rather an objectID from room Documents
    roomNumber: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Room",
    },
    //TODO ask karthik is this false
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "pending", "unsettled"],
      required: false,
    },
    //TODO ask karthik is this false
    paymentType: {
      type: String,
      enum: ["cash", "card", "online", "wallet", "bank"],
      required: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Guest",
    },
    guests: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      default: [],
      ref: "Guest",
    },
    initialPrice: {
      type: Number,
      required: false,
    },
    discount: {
      discountType: {
        type: String,
        enum: ["flat", "percentage", "nodiscount"],
        required: false,
        default: "nodiscount",
      },
      discountValue: { type: Number, required: false, default: 0 },
    },
    tax: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
      ref: "Tax",
    },
    finalPrice: {
      type: Number,
      required: false,
    },
    bookingStatus: {
      type: String,
      enum: ["booked", "checkedIn", "checkedOut", "cancelled", "noshow"],
      required: false,
    },
    //TODO ask karthik what is meant by this transaction wheather it is a transaction id or something else
    transaction: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    status: {
      type: Boolean,
      required: true,
    },
    preCheckIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreCheckIn",
      required: false,
    },
    preCheckInStatus: {
      type: String,
      enum: ["pending", "submitted", "approved", "rejected"],
      required: false,
      default: "pending",
    },
    preCheckInExpire: {
      type: Boolean,
      required: false,
      default: false,
    },
    preCheckInExpireTime: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
