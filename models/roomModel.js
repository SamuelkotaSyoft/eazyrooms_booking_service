import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
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
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Block",
    },
    floor: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Floor",
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "RoomType",
    },
    name: {
      //unique in location level
      type: String,
      maxLength: 40,
      required: true,
    },
    roomStatus: {
      type: String,
      required: true,
      enum: ["available", "occupied", "maintenance", "outofservice"],
    },
    status: {
      type: Boolean,
    },
    qrCode: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
