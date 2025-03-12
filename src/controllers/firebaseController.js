import firebaseService from "../services/firebaseService";

const firebaseController = {
  getFirebaseConfig: async (req, res) => {
    try {
      const rs = await firebaseService.getFirebaseConfig();
      res.status(200).json(rs.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  setFirebaseConfig: async (req, res) => {
    try {
      const { id, firebaseConfigSelected } = req.body;
      const rs = await firebaseService.setFirebaseConfig(id, firebaseConfigSelected);
      res.status(200).json({ message: rs.message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default firebaseController;