const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "SUPER_ADMIN", "SYSTEM_ADMIN"],
      default: "ADMIN",
    },
    permissions: {
      type: [String],
      enum: ["CREATE", "UPDATE", "DELETE"],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

const seedAdmin = async () => {
  const accounts = [
    {
      userName: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      role: "SUPER_ADMIN",
    },
    {
      userName: process.env.SYSTEM_ADMIN_USERNAME,
      password: process.env.SYSTEM_ADMIN_PASSWORD,
      role: "SYSTEM_ADMIN",
    },
  ];

  for (const account of accounts) {
    if (!account.userName || !account.password) {
      console.warn(
        `Skipping ${account.role}: missing userName or password in environment variables`
      );
      continue;
    }

    const hashedPassword = await bcrypt.hash(account.password, 10);

    await User.findOneAndUpdate(
      { userName: account.userName },
      {
        $set: {
          userName: account.userName,
          password: hashedPassword,
          role: account.role,
          permissions: [],
        },
      },
      { upsert: true, new: true }
    );

    console.info(`Seeded ${account.role} account: ${account.userName}`);
  }
};

module.exports = seedAdmin;
