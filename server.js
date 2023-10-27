import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import "./firebase-config.js";
import "./models/roomModel.js";
import "./models/roomTypeModel.js";
const app = express();
const port = 3004;

app.use(cors());
app.use(express.json());

/**
 *
 * dotenv config
 *
 */
const __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

/**
 *
 * connect to mongodb
 */
await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
console.log("MONGODB CONNECTED...");

/**
 *
 * routes
 */

app.use(
  "/createBooking",
  (await import("./routes/bookings/createBooking.js")).default
);

app.use(
  "/getAllBookings",
  (await import("./routes/bookings/getAllBookings.js")).default
);

app.use(
  "/getBookingById",
  (await import("./routes/bookings/getBookingById.js")).default
);

app.use(
  "/updateBookingById",
  (await import("./routes/bookings/updateBookingById.js")).default
);

app.use(
  "/deleteBookingById",
  (await import("./routes/bookings/deleteBookingById.js")).default
);
app.use(
  "/createPrecheckIn",
  (await import("./routes/preCheckIn/createPreCheckIn.js")).default
);

/**
 *
 * start listening to requests
 */
app.listen(port, () => {
  console.log(`Booking service listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "Booking Service" });
});
