const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb+srv://user:pass@cluster.mongodb.net/test?retryWrites=true&w=majority'; // I'll use the one from .env

async function run() {
  require('dotenv').config({ path: '.env' });
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    
    await db.collection("banners").insertMany([
      { image: "/banners/ai_banner_1.png", link: "/collections/offers", isActive: true, createdAt: new Date() },
      { image: "/banners/ai_banner_2.png", link: "/product/1", isActive: true, createdAt: new Date() }
    ]);
    console.log("Successfully inserted AI banners directly to MongoDB!");
  } catch (error) {
    console.error("Error inserting:", error);
  } finally {
    await client.close();
  }
}
run();
