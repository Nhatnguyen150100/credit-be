import informationService from "../services/informationService";
import otpService from "../services/otpService";

const otpController = {
  onCheckOtp: async (req, res) => {
    try {
      const { message, data } = await otpService.onCheckOtp(req.body);
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createOtp: async (req, res) => {
    try {
      const { otpCustom } = req.body;
      if (!otpCustom)
        return res.status(400).json({ message: "otpCustom is required" });
      const { message, data } = await otpService.createOtp({ otpCustom });
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  updateOtp: async (req, res) => {
    try {
      const { otpCustom } = req.body;
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Invalid id" });
      const { message, data } = await otpService.updateOtp({ _id: id, otpCustom });
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getOtp: async (req, res) => {
    try {
      const { message, data } = await otpService.getCustomOtp();
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  deleteOtp: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Invalid id" });
      const { message } = await otpService.deleteOtp(id);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  sendOtp: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const { message } = await otpService.sendSmsOtp(phoneNumber);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
      await otpService.verifyOtp(phoneNumber, otp);
      const rs = await informationService.getInformationByPhoneNumber(
        phoneNumber
      );
      res.status(200).json({
        data: rs.data,
        message: "Đăng nhập thành công"
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  resetOtp: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const { message } = await otpService.resetOtp(phoneNumber);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default otpController;