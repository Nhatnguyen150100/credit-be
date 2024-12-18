"use strict";
import adminAccount from "../../config/adminAccount";
import informationService from "../../services/informationService";
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

      res.status(200).json({
        data: rs.data,
        message: "Đăng nhập thành công"
      });
    } catch (error) {
      res.status(500).json({ message: "Đăng nhập thất bại" });
    }
  },
};

export default authController;
