const {
  default: informationService,
} = require("../services/informationService");
const { default: csvService } = require("../services/csvService");
const { default: ImportJob } = require("../models/importJob");
const { importQueue } = require("../config/queue");

const informationController = {
  getAllInformation: async (req, res) => {
    try {
      const assignee = req.user;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const nameLike = req.query.nameLike || "";
      const { phoneNumber, status, datePayable, userId, assigneeIds } = req.query;
      const { message, data } = await informationService.getAllInformation(
        page,
        limit,
        nameLike,
        userId,
        phoneNumber,
        status,
        datePayable,
        assignee,
        assigneeIds
      );
      res.status(200).json({ data, message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  saveInformation: async (req, res) => {
    try {
      const front_end_user_id_img = req.front_end_user_id_img;
      // const back_end_user_id_img = req.back_end_user_id_img;
      const user_take_id_img = req.user_take_id_img;
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
        assignee,
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
        assignee,
      });
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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

  checkUserExitsV2: async (req, res) => {
    try {
      const { user_id } = req.body;
      const { message, data } = await informationService.checkUserExitsV2(
        user_id
      );
      if (data) return res.status(200).json({ message, data });
      res.status(200).json({ message: message });
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
  deleteMultiInfo: async (req, res) => {
    try {
      const { message } = await informationService.deleteMultiInfo(req.body);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  updateStatusMultiInfo: async (req, res) => {
    try {
      const { message } = await informationService.updateStatusMultiInfo();
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  assigneeInformation: async (req, res) => {
    try {
      const rs = await informationService.assigneeInformation(req.body);
      res.status(200).json({
        data: rs.data,
        message: rs.message || "Gán thông tin thành công cho admin",
      });
    } catch (error) {
      res.status(500).json(error || "Gán thông tin thất bại");
    }
  },

  importCsv: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Vui lòng upload file CSV" });
      }

      const importJob = await ImportJob.create({
        fileName: req.file.originalname,
        filePath: req.file.path,
        createdBy: req.user?.userName || "unknown",
      });

      await importQueue.add(
        "import",
        { jobId: importJob._id.toString(), filePath: req.file.path },
        { jobId: importJob._id.toString() }
      );

      res.status(202).json({
        message: "File đã được nhận. Đang xử lý trong nền.",
        data: {
          jobId: importJob._id,
          fileName: importJob.fileName,
          status: importJob.status,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message || error });
    }
  },

  getImportJobStatus: async (req, res) => {
    try {
      const { jobId } = req.params;
      const job = await ImportJob.findById(jobId).select("-filePath");
      if (!job) {
        return res.status(404).json({ message: "Không tìm thấy job" });
      }
      res.status(200).json({ data: job });
    } catch (error) {
      res.status(500).json({ message: error.message || error });
    }
  },

  getImportJobs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const jobs = await ImportJob.find()
        .select("-filePath -duplicates -errors")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const totalItems = await ImportJob.countDocuments();
      res.status(200).json({ data: jobs, totalItems });
    } catch (error) {
      res.status(500).json({ message: error.message || error });
    }
  },

  exportCsv: async (req, res) => {
    try {
      const { nameLike, phoneNumber, status, datePayable, userId, assigneeIds } =
        req.query;
      const { data, message } = await csvService.exportCsv({
        nameLike,
        phoneNumber,
        status,
        datePayable,
        userId,
        assigneeIds,
      });
      const filename = `information_${Date.now()}.csv`;
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.status(200).send(data);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
};

export default informationController;
