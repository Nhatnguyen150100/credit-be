import Otp from "../models/otp";

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
        } else {
          return reject({
            message: "OTP not found!",
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
};

export default otpService;
