import express, { request } from "express";
import { matchedData } from "express-validator";
import PrecheckIn from "../../models/precheckinModel.js";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import bookingModel from "../../models/bookingModel.js";
import { createPrecheckinValidationSchema } from "../../validationSchema/precheckin/createPrecheckInValidationSchema.js";
import guestModel from "../../models/guestModel.js";
import AWS from "aws-sdk";
import { encryptBufferPromise } from "./encryptKyc.js";
const router = express.Router();

const createPrecheckIn = async (req, res) => {
  let requestData = matchedData(req);
  try {
    const booking = await bookingModel.findOne({ _id: requestData.booking });
    const guestPromises = [];
    for (let i = 0; i < requestData?.guestDetails?.length; i++) {
      const guest = requestData.guestDetails[i];
      const kycDocUpload = new Promise((reject, resolve) => {
        let kycDoc = [];
        let promises = [];
        for (let j = 0; j < guest.kycDocs?.length; j++) {
          const key = `uploads/${Date.now()}_${booking?._id}`;
          const kycDocPromise = encryptBufferPromise(guest.kycDocs[j], key);
          promises.push(
            kycDocPromise
              .then((kycResult) => {
                kycDoc.push(kycResult);
                // resolve(kycDoc);
              })
              .catch((err) => {
                reject(err);
              })
          );
        }
        Promise.all(promises)
          .then(() => {
            resolve(kycDoc);
          })
          .catch((err) => {
            reject(err);
          });
      });
      guestPromises.push(
        kycDocUpload
          .then(async (doc) => {
            requestData.guestDetails[i].kycDocs = doc;
            const newone = await guestModel.updateOne(
              { email: guest.emailAddress },
              {
                $set: {
                  kycDocStatus: "submitted",
                  kycDoc: doc,
                },
              },
              { new: true }
            );
            console.log({ newone, ["sd"]: "asdf" });
          })
          .catch((err) => {
            console.log(err, "<<>>>");
          })
      );
    }
    Promise.all(guestPromises)
      .then(async () => {
        const precheckin = new PrecheckIn({
          ...requestData,
        });
        const wria = await precheckin.save();
        console.log({ wria: wria?.guestDetails[0] });
        await bookingModel.findByIdAndUpdate(
          { _id: requestData.booking },
          { preCheckIn: precheckin._id, preCheckInStatus: "submitted" }
        );
        res.status(200).json({
          status: true,
          data: {
            msg: "Precheckin created successfully",
          },
        });
      })
      .catch((err) => {
        reject(err);
      });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

router.post(
  "/",
  // uploadMulitpleImageToS3,
  createPrecheckinValidationSchema,
  validateRequest,
  createPrecheckIn
);

export default router;
