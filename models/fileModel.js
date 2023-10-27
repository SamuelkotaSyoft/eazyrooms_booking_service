import mongoose from "mongoose";

const fileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  url: {
    type: String,
  },

  fileType: {
    type: String,
  },

  whatsappMediaId: {
    type: String,
  },
});

export default mongoose.model("File", fileSchema);
