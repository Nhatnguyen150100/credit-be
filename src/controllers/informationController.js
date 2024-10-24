const {
  default: informationService,
} = require("../services/informationService");

const informationController = {
  getAllInformation: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const nameLike = req.query.nameLike || "";
      const { message, data } = await informationService.getAllInformation(
        page,
        limit,
        nameLike
      );
      res.status(200).json({ data, message });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  saveInformation: async (req, res) => {
    try {
      const front_end_user_id_img = req.front_end_user_id_img;
      // const back_end_user_id_img = req.back_end_user_id_img;
      const user_take_id_img = req.user_take_id_img;
      if (!(front_end_user_id_img || back_end_user_id_img)) {
        return res.status(400).json({
          message: "front_end_user_id_img or front_end_user_id_img is required",
        });
      }
      const {
        user_id,
        name,
        phone_number,
        loan_amount,
        loan_date,
        receiving_account_number,
        date_payable,
        amount_payable,
        status,
        address,
        company,
        bank_name,
      } = req.body;
      const { message, data } = await informationService.saveInformation({
        user_id,
        name,
        user_take_id_img,
        front_end_user_id_img,
        // back_end_user_id_img,
        phone_number,
        loan_amount,
        loan_date: new Date(loan_date),
        receiving_account_number,
        date_payable: new Date(date_payable),
        amount_payable,
        status,
        address,
        company,
        bank_name,
      });
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  updateInformation: async (req, res) => {
    try {
      const front_end_user_id_img = req.front_end_user_id_img;
      // const back_end_user_id_img = req.back_end_user_id_img;
      const user_take_id_img = req.user_take_id_img;
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Invalid id" });
      const dataUpdate = {
        ...req.body,
        user_take_id_img,
        front_end_user_id_img,
        // back_end_user_id_img,
      };
      const { message, data } = await informationService.updateInformation(
        id,
        dataUpdate
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  getInformation: async (req, res) => {
    try {
      const { id } = req.params;
      const { message, data } = await informationService.getInformation(id);
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  checkUserExits: async (req, res) => {
    try {
      const { user_id } = req.body;
      const { message, data } = await informationService.checkUserExits(
        user_id
      );
      if (data) return res.status(200).json({ message, data });
      res.status(400).json({ message: "error" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  deleteInformation: async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = await informationService.deleteInformation(id);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
};

export default informationController;
