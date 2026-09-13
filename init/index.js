const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const mongo_url = process.env.ATLASDB_URL || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(mongo_url);
  console.log("Connected to DB for initialization.");
}

async function getOrCreateDefaultOwner() {
  let defaultUser = await User.findOne({ email: "team@roomwati.com" });
  if (!defaultUser) {
    const newUser = new User({
      email: "team@roomwati.com",
      username: "Team Roomwati",
      bio: "We're the RoomWati team, powering seamless stays and unique spaces.",
      image: {
        url: "https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
        filename: "default-avatar"
      },
      coverImage: {
        url: "https://res.cloudinary.com/dxqjlxgsh/image/upload/v1703420360/RoomWati/default-cover_kxn8dr.jpg",
        filename: "default-cover"
      }
    });
    defaultUser = await User.register(newUser, "roomwati123");
    console.log("Created default 'Team Roomwati' user:", defaultUser._id);
  }
  return defaultUser._id;
}

const initDB = async () => {
  try {
    await main();
    const ownerId = await getOrCreateDefaultOwner();
    await Listing.deleteMany({});
    
    const formattedData = initData.data.map((obj) => ({
      ...obj,
      owner: ownerId
    }));

    await Listing.insertMany(formattedData);
    console.log(`✅ Successfully initialized ${formattedData.length} listings in DB.`);
  } catch (err) {
    console.error("❌ Database initialization error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("DB disconnected.");
  }
};

initDB();