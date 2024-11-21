import serviceAccountAPI from "../../firebaseServiceAPIKey.json";
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountAPI),
});

const otpService = {
  sentOTP: (phone_number) => {
    return new Promise(async (resolve, reject) => {
      try {
        const otpGenerated = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        const message = {
          notification: {
            title: "Your OTP Code",
            body: `Your OTP is: ${otpGenerated}`,
          },
          token: phone_number,
        };
        await admin.messaging().send(message);
        return resolve({
          status: 200,
          message:
            "Gửi otp thành công. Hãy kiểm tra điện thoại và nhập opt trong vòng 3 phút",
          data: {
            otp: otpGenerated,
          },
        });
      } catch (error) {
        console.error(error.message);
        return reject({
          status: 400,
          message: "Gửi OTP thất bại.",
        });
      }
    });
  },
};

export default otpService;
