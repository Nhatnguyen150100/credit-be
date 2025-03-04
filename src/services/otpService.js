import { addData, getData, removeData } from "../config/redisConfig";
import Otp from "../models/otp";
import generateOTP from "../utils/generate-otp";
import isValidPhoneNumber from "../utils/invalid-phone-number";
import smsService from "./smsService";

const otpService = {
  onCheckOtp: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { otpCustom } = data;
        const rs = await Otp.findOne({ otpCustom });
        if (rs) {
          return resolve({
            data: rs,
            message: "Check OTP success!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  createOtp: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { otpCustom } = data;
        const newOtp = new Otp({
          otpCustom,
        });
        const rs = await newOtp.save();
        if (rs) {
          return resolve({
            data: rs,
            message: "Save OTP success!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  updateOtp: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { otpCustom, _id } = data;
        const rs = await Otp.findByIdAndUpdate(
          _id,
          { otpCustom },
          { new: true }
        );
        if (rs) {
          return resolve({
            data: rs,
            message: "Update OTP success!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  getCustomOtp: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const otp = await Otp.find();
        if (otp) {
          return resolve({
            data: otp,
            message: "Get OTP success!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  deleteOtp: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const rs = await Otp.findByIdAndDelete(id);
        if (rs) {
          return resolve({
            data: rs,
            message: "Delete OTP success!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  sendSmsOtp: (phoneNumber) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!isValidPhoneNumber(phoneNumber)) {
          return reject({ message: "Invalid phone number" });
        }
        const otp = generateOTP();

        await smsService.sendSMS(phoneNumber, `Your OTP is: ${otp}`);

        const success = await addData(phoneNumber, otp);
        if (!success) {
          return reject({
            message: "Failed to send SMS OTP. Please try again later.",
          });
        }

        resolve({ message: "Send SMS OTP success!" });
      } catch (error) {
        reject(error);
      }
    });
  },
  verifyOtp: (phoneNumber, otp) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!phoneNumber) {
          return reject({ message: "Phone number is required" });
        }
        if (!isValidPhoneNumber(phoneNumber)) {
          return reject({ message: "Invalid phone number" });
        }
        if (!otp) {
          return reject({ message: "OTP is required" });
        }

        const storedOtp = await getData(phoneNumber);

        if (storedOtp === otp) {
          await removeData(phoneNumber);
          resolve({ message: "OTP verified successfully!" });
        } else {
          reject({ message: "Invalid OTP!" });
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        reject({ message: "Verification failed" });
      }
    });
  },
  resetOtp: (phoneNumber) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!phoneNumber) {
          return reject({ message: "Phone number is required" });
        }
        if (!isValidPhoneNumber(phoneNumber)) {
          return reject({ message: "Invalid phone number" });
        }

        const storedOtp = await getData(phoneNumber);

        if (!storedOtp) {
          return reject({ message: "No OTP found for this phone number" });
        }

        await removeData(phoneNumber);

        const otp = generateOTP();

        await smsService.sendSMS(phoneNumber, `Your OTP is: ${otp}`);

        const success = await addData(phoneNumber, otp);
        if (!success) {
          return reject({
            message: "Failed to reset OTP. Please try again later.",
          });
        }

        await smsService.sendMessage(phoneNumber, `Your new OTP is: ${otp}`);

        resolve({ message: "Reset OTP and send SMS success!" });
      } catch (error) {
        console.log(error.message);
        reject(error);
      }
    });
  },
};

export default otpService;
