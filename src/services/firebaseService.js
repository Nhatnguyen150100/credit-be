import firebaseConfig from "../config/firebaseConfig";
import { Firebase } from "../models/firebase";

const firebaseService = {
  getFirebaseConfig: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Firebase.findOne({});
        if (data) {
          const config = {
            ...firebaseConfig[data.firebaseConfigSelected],
            ...data.toObject(),
          };
          return resolve({ data: config });
        } else {
          return reject({ message: "Firebase configuration not found!" });
        }
      } catch (error) {
        console.log(error.message);
        return reject(error.message);
      }
    });
  },
  setFirebaseConfig: (_id, firebaseConfigSelected) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          firebaseConfigSelected !== "MAIN_APP_CONFIG" &&
          firebaseConfigSelected !== "BACKUP_APP_CONFIG"
        ) {
          return reject({ message: "Invalid Firebase configuration!" });
        }
        const firebase = await Firebase.findOneAndUpdate(
          { _id },
          { firebaseConfigSelected }
        );
        if (firebase) {
          return resolve({
            message: "Thay đổi cấu hình Firebase thành công",
          });
        }
      } catch (error) {
        console.log(error.message);
        return reject(error.message);
      }
    });
  },
};

export default firebaseService;
