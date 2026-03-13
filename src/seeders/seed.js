const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const seedFirebase = require("./firebase_seeders");
const seedAdmin = require("./admin_seeders");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_URL, {
    serverSelectionTimeoutMS: 10000,
    // Helps with MongoDB Atlas SSL/TLS handshake issues (Node 18+ / OpenSSL 3)
    tlsAllowInvalidCertificates: process.env.NODE_ENV !== "production",
  });
  console.info("Connected to MongoDB");
};

const runSeeders = async () => {
  console.info("Seeders started");
  await connectDB();
  await seedFirebase();
  await seedAdmin();
  await mongoose.connection.close();
  console.info("Seeders succeeded");
};

runSeeders().catch((error) => {
  console.error("Seeders failed:", error);
  process.exit(1);
});
