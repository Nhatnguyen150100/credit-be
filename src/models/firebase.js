const { Schema, model } = require("mongoose");

const FirebaseSchema = new Schema(
  {
    firebaseConfigSelected: {
      type: String,
      enum: ["MAIN_APP_CONFIG", "BACKUP_APP_CONFIG"],
      required: true,
      unique: true,
      default: "MAIN_APP_CONFIG",
    },
  },
  {
    timestamps: true,
  }
);

const deleteMany = async () => {
  try {
    const result = await Firebase.deleteMany({});
    console.info(`Delete ${result.length} item successfully`);
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};

const insertMany = async (items) => {
  try {
    const result = await Firebase.insertMany(items);
    console.info(`Insert ${result.length} item successfully`);
    return result;
  } catch (error) {
    console.error("Insert failed:", error);
    throw error;
  }
};

const Firebase = model("Firebase", FirebaseSchema);

module.exports = { Firebase, deleteMany, insertMany };
