import admin from "firebase-admin";

import serviceAccount from "../config/ridebooking-bf93b-firebase-adminsdk-fbsvc-22f0c460a8.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
