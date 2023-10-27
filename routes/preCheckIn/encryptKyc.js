import AWS from "aws-sdk";
import { getFileTypeFromBase64Url } from "../../helpers/fileType.js";

const kms = new AWS.KMS({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
});

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
});
const readFileFromS3 = (key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
    };
    // let url = s3.getSignedUrl("getObject", {
    //   Bucket: process.env.S3_BUCKET,
    //   Key: key,
    // });
    // console.log({ url });
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Body);
      }
    });
  });
};

const decryptFileContent = (encryptedContent) => {
  return new Promise((resolve, reject) => {
    const params = {
      CiphertextBlob: encryptedContent,
      KeyId: process.env.AWS_KMS_KEY,
    };
    kms.decrypt(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Plaintext?.toString("base64"));
      }
    });
  });
};
export const uploadFileToS3 = (key, buffer, contentType) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    };

    s3.putObject(params, async (err, data) => {
      if (err) {
        reject(err);
      } else {
        const url = s3.getSignedUrl("getObject", {
          Bucket: process.env.S3_BUCKET,
          Key: key,
        });

        resolve(url?.split("?")[0]);
      }
    });
  });
};
export const encryptBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const params = {
      KeyId: process.env.AWS_KMS_KEY,
      Plaintext: buffer,
    };

    kms.encrypt(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.CiphertextBlob);
      }
    });
  });
};

export function encryptBufferPromise(originalContent, key) {
  return new Promise(async (resolve, reject) => {
    const buffer = Buffer.from(
      originalContent.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const encryptedBuffer = await encryptBuffer(buffer);
    const contentType = getFileTypeFromBase64Url(originalContent);
    const encryptedLocation = await uploadFileToS3(
      key,
      encryptedBuffer,
      contentType
    );
    if (encryptedLocation) resolve(encryptedLocation);
    else reject();
    // const decryptedContent = await decryptFileContent(encryptedBuffer);
    // if (decryptedContent) resolve(`data:image/jpeg;base64,${decryptedContent}`);
    // else reject();
  });
}

// const decryptedContent = await decryptFileContent(originalContent);
