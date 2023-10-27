import * as app from "@firebase/app";
import * as auth from "@firebase/auth";
import * as database from "@firebase/database";
import * as fs from "firebase-admin/firestore";

import { getDownloadURL, ref } from "@firebase/storage";

import { getFirestore } from "firebase/firestore";
import { cert, initializeApp } from "firebase-admin/app";

import { getStorage } from "firebase-admin/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtGuIOhOR6D1difgbeaPQtLtHYwwGe5wM",
  authDomain: "eazyrooms-fbe83.firebaseapp.com",
  databaseURL: "https://eazyrooms-fbe83-default-rtdb.firebaseio.com",
  projectId: "eazyrooms-fbe83",
  storageBucket: "eazyrooms-fbe83.appspot.com",
  messagingSenderId: "46839470430",
  appId: "1:46839470430:web:dc28c695729fc221ead7cf",
};

const fb = app.initializeApp(firebaseConfig);
const db = database.getDatabase(fb);
const authentication = auth.getAuth(fb);
const firestore = getFirestore(fb);

initializeApp({
  credential: cert({
    type: "service_account",
    project_id: "eazyrooms-fbe83",
    private_key_id: "46606c0e8f1a08b1f269edf83a016869d0de3007",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDtYA0ELgA/GsQ1\nmDnNlyFO7toj1XrY7Gjc26TLq1TS+GmPdbotrgkdpoXq8TDilJI1okqKZARqlWLZ\nNIVPDwLm4jEIF/YIM4h2+eXiJWoy4oldp9sCL6L9s/Bi7ZH+wbhiityXrv7poQ4E\nfvnBZ0vA8PNnLxJEsfsKaFAfk3zXM666jvKdGaIS5OO8YKDLcxrdZtmB/vlcPF1f\nscCbmMaVtmRlB2RGnsThun9Dscc9UNEa4Q7ZjmPjEqQIP263OT6Cy8UHvkzO9TDo\nKHizMpx3k12Vyr8tXs9fBvntYXc0Rjsc0Pykz02sy5C2OklsOR7k/mylFBF3O3Cd\nFBCm2YqjAgMBAAECggEACossqNXePu9SbcsALkibOyVS3SqbVU1S7xR2gnFuyBwu\nnCeviF3lm8KMyj3CXR4aTHWT+AevRoiyJlG15igViencIa7mx8B6PEanVl8xE2eK\nkHVnPfadt8UpVUuWI4m5Re9DEx27xubXd42oTFXpQH2zYg7uMczyCKlPfceQUQKt\nxQsuWLRh5oc/wjkntkTToif7eBm/vVPzFn3cp8JQ5LYwOYxHsXTdLx1qsBMdoISb\nH1DGrFSQyXVbQxiREG+HKOH33nhVA7lelgsdxM4i5NNLRdGG07kh9O+6A4f3iHPr\niH7SRUgYvrzQVzRp0SiYWySwJwrMWzJkj7Yo0k5RwQKBgQD9C1f+xrZLQlLCGj9k\nTD0klvB6VJjcR45BGgb1oX96UME+dVOtzqXJPGm/456Msa8RgXL0rybrEh45ypNO\nJ7rTUuC5DTlIEK4nmW5e5+LaBFKb/RTyqRYKbfzynXiMPQeFmgy9+qMoOckfQC7g\n+tkHffxS2fWK17oSo/hwr8aVQwKBgQDwJdpnI80Umh8T327lIghUHHWzgbdi5nMn\nDNxhILVACv8XXHE1Cm95DaZrsu8cU1QKAWMFwPC9Ujegoyw+uXposE153i87cD0o\n163krxcmtTFyFjiwLWacIVjqy9J8pjXT/YC5xl6fcJYA5LKVmEwr0/b+d5QR1g03\ncfcU+bMvIQKBgBwzj3MNonNwyNhpJHeBJ69UQyjfFMo4D1qiE/R8M0DmjyLu4IyW\nY1OyL/b630i+5MwGqVEr1CKOul+mfBRRyTiUHAeDucaWVVKEfxCEt3ukz7Ai3JrO\nzW4MJAzGEBFRG+1/5bumm1h4WDnrZU4dpuJ24BA7ymnW8R3yuFWWwYMRAoGACSv4\n7m2AnKPSQgkLjDbDiKrZl/SBU4anqTslg5QjOAHzginmrPbsEPyDeaOI3FUWZZdt\n979JsoFcXIc+3lppIWxyWRAyT5vWyiOKoaxKPxE2hTvyCFCDlbz0T2tfa6FRdvo8\nm1vHK2G6aOhTJcF+T0I2MbvRbOj28kIpBKUQweECgYBDD85Zf4EuHONGfnNZXsyj\nsQIZ8TbGJhP9TW98QdgvV7fu4YdVeFkmM3Qu2v+A8VVsrOkkNzgZqNydMVzsh7aV\nyan3lo557IryKsGiEvYrliYqX/ZTz1llU/iPlaa5u8eX8k1kmm6qonlMw9lhRzf0\nRHR1dI20fxu5YjMp0YaWXQ==\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-qz5i8@eazyrooms-fbe83.iam.gserviceaccount.com",
    client_id: "117451585350750580669",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qz5i8%40eazyrooms-fbe83.iam.gserviceaccount.com",
  }),
  storageBucket: "eazyrooms-fbe83.appspot.com",
});

export { authentication, db, getStorage, getDownloadURL, ref, firestore, app };
