const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { deleteMany, insertMany } = require("../models/firebase");
dotenv.config();

const { connect, connection } = mongoose;

const connectDB = async () => {
  try {
    await connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info("Connected to Mongoose");
  } catch (error) {
    console.error("Connect to Mongoose failed:", error);
    process.exit(1);
  }
};

const data = [
  {
    firebaseConfigSelected: "MAIN_APP_CONFIG",
  },
];

const seedFirebase = async () => {
  await connectDB();

  await deleteMany();

  await insertMany(data);
  console.info("Insert firebase config successfully");

  connection.close();
};

module.exports = seedFirebase;
