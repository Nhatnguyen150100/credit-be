const { deleteMany, insertMany } = require("../models/firebase");

const data = [
  {
    firebaseConfigSelected: "MAIN_APP_CONFIG",
  },
];

const seedFirebase = async () => {
  await deleteMany();
  await insertMany(data);
  console.info("Seeded firebase config successfully");
};

module.exports = seedFirebase;
