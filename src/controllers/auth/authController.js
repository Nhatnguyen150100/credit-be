"use strict";
import adminAccount from "../../config/adminAccount";
import informationService from "../../services/informationService";
import otpService from "../../services/otpService";
import redisService from "../../services/redisService";
import tokenService from "../../services/token/tokenService";

const authController = {
  login: (req, res) => {
    try {
      const { userName, password } = req.body;
      const isAdmin =
        userName === adminAccount.userName &&
        password === adminAccount.password;
      if (!isAdmin) {
        return res.status(400).json({ message: "Your are not admin" });
      }
      const accessToken = tokenService.generateToken({
        userName: adminAccount.userName,
        role: adminAccount.role,
      });
      res.status(200).json({
        message: "Login successful",
        data: { accessToken: accessToken },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const rs = await informationService.getInformationByPhoneNumber(
        phoneNumber
      );
      if (!rs.data) {
        return res.status(404).json({ message: rs.message });
      }

      // Test mode
      // const TIME_OTP_IN_REDIS = 3 * 60;
      // const result = await redisService.save(
      //   phoneNumber,
      //   JSON.stringify({
      //     otp: "111111",
      //     data: rs.data,
      //   }),
      //   TIME_OTP_IN_REDIS
      // );
      // res.status(result.status).json({
      //   message: "Send otp successfully",
      // });

      const { data, status, message } = await otpService.sentOTP(phoneNumber);
      if (status === 200) {
        // lưu otp trong 3 phút
        const TIME_OTP_IN_REDIS = 3 * 60;
        const result = await redisService.save(
          phoneNumber,
          JSON.stringify({
            otp: data.otp,
            data: rs.data,
          }),
          TIME_OTP_IN_REDIS
        );
        res.status(result.status).json({
          message,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Đăng nhập thất bại" });
    }
  },
  verifyOTP: async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
      const rs = await redisService.get(phoneNumber);
      const { otp: redisOTP, data } = JSON.parse(rs);
      if (redisOTP === otp) {
        await redisService.removeItem(phoneNumber);
        const accessToken = tokenService.generateToken({
          phoneNumber: phoneNumber,
          role: "user",
        });
        res.status(200).json({
          message: "Xác thực OTP thành công",
          data: { accessToken: accessToken, user: data },
        });
      } else {
        res.status(400).json({ message: "Mã OTP không đúng" });
      }
    } catch (error) {
      res.status(500).json({ message: "Xác thực OTP thất bại" });
    }
  },
};

export default authController;
