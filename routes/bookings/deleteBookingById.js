import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
//import models
import BookingModel from "../../models/bookingModel.js";
import userModel from "../../models/userModel.js";
import notify from "../../helpers/notifications/notify.js";
//new buyer
var router = express.Router();
router.delete("/:bookingId", verifyToken, async function (req, res) {
  //request payload
  const bookingId = req.params.bookingId;
  const role = req.user_info.role;

  const uid = req.user_info.main_uid;

  //validate bookingId
  if (!bookingId) {
    res.status(400).json({ status: false, error: "Booking id is required" });
    return;
  }

  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    //check if task exists
    const user = userModel.findOne({ uid: uid });
    //delete task
    const writeResult = await BookingModel.deleteOne(
      { _id: bookingId },
      { status: false, updatedBy: user._id }
    );
    try {
      await notify({
        userId: user._id,
        propertyId: user.property,
        location: [writeResult.location],
        role: ["locationAdmin"],
        notificationText:
          user.fullName +
          " has deleted a new booking having" +
          writeResult.guests.length +
          " guests",
        authToken: req.headers["eazyrooms-token"],
      });
    } catch (error) {
      console.log(error);
    }

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    console.log("errr---------", err);
    res.status(500).json({ error: err });
  }
});

export default router;
