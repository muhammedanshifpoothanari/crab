const { MongoClient } = require("mongodb");

// Define URIs for all potential databases to ensure we synchronize them
const uris = [
  "mongodb+srv://anshif:rrpbL58rMzIBTTxk@cluster0.8dtglzr.mongodb.net/kiswanew?retryWrites=true&w=majority",
  "mongodb+srv://anshif:rrpbL58rMzIBTTxk@cluster0.8dtglzr.mongodb.net/crabscart?retryWrites=true&w=majority",
  "mongodb+srv://anshif:rrpbL58rMzIBTTxk@cluster0.8dtglzr.mongodb.net/kiswa?retryWrites=true&w=majority"
];

// Load product data
const { allProducts } = require("../lib/product-data");

async function seedDatabase(uri) {
  const dbName = uri.split("/").pop().split("?")[0];
  console.log(`\nStarting sync for database: "${dbName}"...`);
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    console.log(`- Dropping products collection in "${dbName}" to clear old indexes...`);
    await db.collection("products").drop().catch(err => {
      // Ignore error if collection does not exist
      console.log(`- Collection "products" didn't exist or was already dropped.`);
    });
    
    console.log(`- Seeding ${allProducts.length} figurines into "${dbName}"...`);
    await db.collection("products").insertMany(allProducts);
    console.log(`✓ Database "${dbName}" synced successfully!`);
  } catch (err) {
    console.error(`✗ Failed to sync database "${dbName}":`, err.message);
  } finally {
    await client.close();
  }
}

async function main() {
  console.log("Starting multi-database figurines synchronization...");
  for (const uri of uris) {
    await seedDatabase(uri);
  }
  console.log("\nAll database synchronizations completed!");
}

main().catch(err => {
  console.error("Sync runner failed:", err);
  process.exit(1);
});
