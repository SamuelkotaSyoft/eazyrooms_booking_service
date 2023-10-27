import mongoose from "mongoose";

const roomTypeSchema = mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Property",
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Location",
    },
    amenities: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: {
      type: String,
    },
    images: {
      type: Array,
      required: false,
    },
    amenities: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
    baseOccupancy: { type: Number, required: false },
    kidsOccupancy: { type: Number, required: false },
    maxOccupancy: { type: Number, required: false },
    extraPricePerPerson: { type: Number, required: false },
    initialPrice: { type: Number, required: false, default: 0 },
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
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
      ref: "User",
    },
    updatedBy: {
      type: String,
      required: true,
      ref: "User",
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RoomType", roomTypeSchema);
