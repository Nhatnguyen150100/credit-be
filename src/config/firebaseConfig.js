import { config } from "dotenv";
config();

const MAIN_APP_CONFIG = {
  apiKey: process.env.MAIN_APP_CONFIG_API_KEY,
  authDomain: process.env.MAIN_APP_CONFIG_API_DOMAIN,
  projectId: process.env.MAIN_APP_CONFIG_PROJECT_ID,
  storageBucket: process.env.MAIN_APP_CONFIG_STORAGE_BUCKET,
  messagingSenderId: process.env.MAIN_APP_CONFIG_MESSAGING_SENDER_ID,
  appId: process.env.MAIN_APP_CONFIG_APP_ID,
  measurementId: process.env.MAIN_APP_CONFIG_MEASUREMENT_ID
}

const BACKUP_APP_CONFIG = {
  apiKey: process.env.BACKUP_APP_CONFIG_API_KEY,
  authDomain: process.env.BACKUP_APP_CONFIG_API_DOMAIN,
  projectId: process.env.BACKUP_APP_CONFIG_PROJECT_ID,
  storageBucket: process.env.BACKUP_APP_CONFIG_STORAGE_BUCKET,
  messagingSenderId: process.env.BACKUP_APP_CONFIG_MESSAGING_SENDER_ID,
  appId: process.env.BACKUP_APP_CONFIG_APP_ID,
  measurementId: process.env.BACKUP_APP_CONFIG_MEASUREMENT_ID
}

const firebaseConfig = {
  MAIN_APP_CONFIG,
  BACKUP_APP_CONFIG
}

export default firebaseConfig;