import { config } from "dotenv";
config();

const adminAccount = {
  userName: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  role: "ADMIN",
};

export default adminAccount;
