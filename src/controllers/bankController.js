import bankService from "../services/bankService";

const bankController = {
  createBank: async (req, res) => {
    try {
      const qr_code_img = req.qr_code_img;
      if (!qr_code_img)
        return res.status(400).json({ message: "qr_code_img is required" });
      const { message, data } = await bankService.createBank({
        ...req.body,
        qr_code_img,
      });
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateBank: async (req, res) => {
    try {
      const qr_code_img = req.qr_code_img;
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Invalid id" });
      const { message, data } = await bankService.updateBank(id, {
        ...req.body,
        qr_code_img,
      });
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Invalid id" });
      const { message } = await bankService.deleteBank(id);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllBank: async (req, res) => {
    try {
      const { message, data } = await bankService.getAllBank();
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default bankController;
