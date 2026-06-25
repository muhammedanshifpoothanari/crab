const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Please set MONGODB_URI in your .env file");
  process.exit(1);
}

const collectionsData = [
  { id: "couples", name: "Couples", icon: "Heart", count: 24, image: "/cat_couples_1779270592559.png", sortOrder: 1 },
  { id: "superheroes", name: "Superheroes", icon: "Zap", count: 18, image: "/cat_superheroes_1779270608522.png", sortOrder: 2 },
  { id: "professionals", name: "Professionals", icon: "Briefcase", count: 20, image: "/cat_professionals_1779270624718.png", sortOrder: 3 },
  { id: "wedding", name: "Wedding", icon: "Sparkles", count: 16, image: "/cat_wedding_1779270641603.png", sortOrder: 4 },
  { id: "family", name: "Family", icon: "Users", count: 15, image: "/cat_family_1779270658181.png", sortOrder: 5 },
  { id: "hobbies", name: "Hobbies", icon: "Trophy", count: 22, image: "/cat_hobbies_1779269573661.png", sortOrder: 6 },
  { id: "sports", name: "Sports", icon: "Dumbbell", count: 14, image: "/cat_sports_1779269598558.png", sortOrder: 7 },
  { id: "music", name: "Music", icon: "Music", count: 12, image: "/cat_music_1779269650586.png", sortOrder: 8 },
  { id: "travel", name: "Travel", icon: "Plane", count: 10, image: "/cat_travel_1779269625783.png", sortOrder: 9 },
  { id: "pets", name: "With Pets", icon: "Heart", count: 13, image: "/cat_with_pets_1779269677237.png", sortOrder: 10 },
  { id: "vehicles", name: "With Vehicles", icon: "Car", count: 16, image: "/cat_with_vehicles_1779269693510.png", sortOrder: 11 },
  { id: "fantasy", name: "Fantasy", icon: "Sparkles", count: 11, image: "/cat_fantasy_1779269707908.png", sortOrder: 12 },
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    const db = client.db();

    // 1. Clear collections
    console.log("Clearing existing collections...");
    await db.collection("collections").deleteMany({});

    // 2. Insert new seed data
    console.log("Seeding collection categories with images...");
    const result = await db.collection("collections").insertMany(collectionsData);
    console.log(`Successfully seeded ${result.insertedCount} collections!`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
  }
}

seed();
