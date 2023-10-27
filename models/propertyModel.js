import mongoose from "mongoose";

const PropertySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 40,
      minLength: 2,
      required: true,
    },
    pms: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Pms",
    },
    otherPms: {
      type: String,
      required: false,
    },
    propertyAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    status: {
      type: Boolean,
      required: true,
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
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Property", PropertySchema);
