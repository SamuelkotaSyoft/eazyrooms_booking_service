import AWS from "aws-sdk";
import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
// Set up AWS SDK

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
});

// Set up Multer middleware for handling image uploads
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // validate file types
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG and GIF files are allowed."
        )
      );
    }
  },
}).fields([
  { name: "front", maxCount: 1 },
  { name: "back", maxCount: 1 },
]);
// the name of the file input field and the maximum files that can be uploaded

const uploadMulitpleImageToS3 = (req, res, next) => {
  imageUpload(req, res, async (err) => {
    if (!req.files) {
      req.fileUrls = [];
      next();
    } else if (req.files.length === 0) {
      req.fileUrls = [];
      next();
    } else {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      let fileUrls = [];
      const createFilesPromise = new Promise((resolve, reject) => {
        req.files?.forEach(async (file) => {
          const filename = `${uuid()}_${file?.originalname}`;
          const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `images/${uuid()}/${filename}`,
            Body: file?.buffer,
            ContentType: file?.mimetype,
          };
          const uploadToS3 = new Promise((resolve, reject) => {
            //TODO change s3.upload to a common function
            s3.upload(params, (err, data) => {
              if (err) {
                reject(err);
              }
              resolve(data.Location);
            });
          });
          uploadToS3
            .then((imageUrl) => {
              fileUrls.push(imageUrl);
              if (fileUrls.length === req.files.length) {
                resolve(fileUrls);
              }
            })
            .catch("error", (err) => {
              reject(err);
            });
        });
      });
      createFilesPromise
        .then((data) => {
          req.fileUrls = data;
          next();
        })
        .catch((err) => {
          res.status(400).json({ error: err.message });
        });
    }
  });
};

export { uploadMulitpleImageToS3 };
