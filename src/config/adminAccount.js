import { config } from "dotenv";
import DEFINE_ROLE from "./role";
config();

const adminAccount = {
  userName: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  role: DEFINE_ROLE.SUPER_ADMIN,
};

export default adminAccount;
