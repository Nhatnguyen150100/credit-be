const seedFirebase = require("./firebase_seeders");

const runSeeders = async () => {
  console.info("Seeders started");
  await seedFirebase();
  console.info("Seeders succeeded");
};

runSeeders().catch((error) => {
  console.error("Seeders failed:", error);
  process.exit(1);
});
