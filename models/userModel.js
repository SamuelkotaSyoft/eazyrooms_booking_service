import mongoose from "mongoose";

import {
  phoneNumberRegex,
  emailAddressRegex,
  postCodeRegex,
} from "../helpers/regex.js";

const userSchema = mongoose.Schema({
  uid: {
    type: String,
  },

  fullName: {
    type: String,
  },

  emailAddress: {
    type: String,
    required: true,
    match: emailAddressRegex,
  },

  phoneNumber: {
    type: String,
    match: phoneNumberRegex,
  },

  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },

  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },


  blocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
    },
  ],

  floors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
    },
  ],

  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],

  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  ],

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  image: {
    type: Array,
  },

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  website: {
    type: String,
  },

  pms: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pms",
  },

  currency: {
    type: String,
  },

  role: {
    type: String,
  },
});

export default mongoose.model("User", userSchema);
