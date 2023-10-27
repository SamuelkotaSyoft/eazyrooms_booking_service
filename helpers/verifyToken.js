import { getAuth } from "firebase-admin/auth";
import * as fs from "firebase-admin/firestore";

const fb = fs.getFirestore();

const verifyToken = async (req, res, next) => {
  const idToken = req.headers["eazyrooms-token"];
  // console.log("EAZYROOMS_ID_TOKEN....", idToken);

  var uid;
  var main_uid;
  var fb_info;

  if (idToken) {
    await getAuth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        fb_info = decodedToken;
        // console.log("decodedToken :>> ", decodedToken);
        try {
          uid = decodedToken.uid;
          if (decodedToken.uid) {
            main_uid = decodedToken.uid;
          }

          await fb
            .collection("userAuth")
            .doc(uid)
            .get()
            .then((querySnapshot) => {
              req.user_info = querySnapshot.data();
              req.fb_info = fb_info;
              //if user id is null returning from here
              if (!req.user_info.main_uid)
                res
                  .status(403)
                  .json({ status: false, error: [{ msg: "Invalid UserId" }] });
              next();
            })
            .catch((err) => {
              res.status(403).json(err);
            });
        } catch (err) {
          // console.log("err :>> ", err);
          res.status(403).json(err);
        }
      })
      .catch((error) => {
        // console.log("error", error);
        res.status(403).json(error);
      });
  } else {
    res.status(403);
    res.end("Not Authorized");
  }
};

// async function verifyToken(req, res, next) {
//   //get bearer token
//   const bearerHeader = req.headers.token;

//   //validate bearer token
//   if (typeof bearerHeader === "undefined") {
//     res.status(403).json({ status: false, message: "AUTH_FAILED" });
//     return;
//   }

//   //fetch token from bearer token
//   const token = bearerHeader?.split(" ")[1];

//   //verify token
//   jwt.verify(token, "testKey", (error, auth) => {
//     if (error) {
//       res.status(403).json({ message: "AUTH_FAILED" });
//       return;
//     }

//     //save auth to req object
//     req.auth = auth;

//     //execute the next function
//     next();
//   });
// }

export default verifyToken;
