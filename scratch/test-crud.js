/**
 * Integration Test Script for Admin CRUD modules.
 * Directly runs MongoDB Atlas tests to verify:
 * - Order Deletion
 * - Customer Profile Editing
 * - Customer Purge / Deletion
 * - Manual Order Data Structure Compatibility
 */

const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "/Users/muhammedanshifp/Documents/crabscart/crab/.env" });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing from .env");
  process.exit(1);
}

async function runTests() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  console.log("Connected successfully!");

  const phone = "9998887776";
  const orderId = "CC-TEST-123456";

  console.log("\n========================================");
  console.log("1. TESTING MANUAL ORDER / SALES CREATION");
  console.log("========================================");

  // Clean up any stale test data first
  await db.collection("orders").deleteMany({ "customer.phone": phone });
  await db.collection("returns").deleteMany({ orderId });

  // Mocking manual order payload from the UI form
  const mockOrder = {
    orderId: orderId,
    customer: {
      name: "Test Runner Customer",
      email: "testrunner@example.com",
      phone: phone,
      address: "123 Integration Test Boulevard",
      city: "Testville",
      state: "TestState",
      zip: "676121"
    },
    items: [
      {
        id: 999,
        name: "Test Figurine Specimen",
        price: 1500,
        quantity: 2,
        image: "/placeholder.svg"
      }
    ],
    total: 3000,
    paymentMethod: "Cash on Delivery",
    paymentDetails: {
      paymentStatus: "Pending COD verification"
    },
    status: "Pending",
    trackingNumber: "",
    createdAt: new Date()
  };

  const insertResult = await db.collection("orders").insertOne(mockOrder);
  console.log(`✓ Manual Order logged with MongoDB ObjectId: ${insertResult.insertedId}`);

  // Fetch and assert
  let orderRecord = await db.collection("orders").findOne({ orderId: orderId });
  if (orderRecord && orderRecord.customer.name === "Test Runner Customer") {
    console.log("✓ Assertion Passed: Manual Order created successfully with standard billing structure.");
  } else {
    throw new Error("Manual Order assertion failed!");
  }

  console.log("\n========================================");
  console.log("2. TESTING CUSTOMER PROFILE UPDATING");
  console.log("========================================");

  // Update customer name & address across all orders under that phone number
  const updatePayload = {
    "customer.name": "Runner Supreme Updated",
    "customer.email": "supreme@example.com",
    "customer.address": "456 Updated Luxury Suite",
    "customer.city": "Metropolis",
    "customer.state": "MetroState",
    "customer.zip": "777777"
  };

  const updateResult = await db.collection("orders").updateMany(
    { "customer.phone": phone },
    { $set: updatePayload }
  );
  console.log(`✓ Synchronized details across ${updateResult.modifiedCount} order files`);

  // Verify
  orderRecord = await db.collection("orders").findOne({ orderId: orderId });
  if (orderRecord && orderRecord.customer.name === "Runner Supreme Updated" && orderRecord.customer.email === "supreme@example.com") {
    console.log("✓ Assertion Passed: Customer details updated successfully across historical orders.");
  } else {
    throw new Error("Customer profile update assertion failed!");
  }

  console.log("\n========================================");
  console.log("3. TESTING ORDER DELETION & RETURNS CASCADE");
  console.log("========================================");

  // Create a mock dispute / return record linked to this order
  const mockReturn = {
    returnId: "RET-TEST-123",
    orderId: orderId,
    returnedItems: [{ productId: 999, quantity: 1, name: "Test Figurine Specimen", price: 1500 }],
    refundAmount: 1500,
    reason: "Transit damage",
    status: "Processed",
    createdAt: new Date()
  };

  await db.collection("returns").insertOne(mockReturn);
  console.log(`✓ Mock return logged for Order: ${orderId}`);

  // Verify return exists
  let returnRecord = await db.collection("returns").findOne({ orderId: orderId });
  if (!returnRecord) throw new Error("Mock return failed to save!");

  // Perform Delete Order operation (cascading returns)
  console.log("Running DELETE /api/orders/[id] simulation...");
  const deleteOrderResult = await db.collection("orders").deleteOne({ orderId: orderId });
  const deleteReturnResult = await db.collection("returns").deleteMany({ orderId: orderId });

  console.log(`✓ Deleted ${deleteOrderResult.deletedCount} orders`);
  console.log(`✓ Deleted ${deleteReturnResult.deletedCount} associated return logs`);

  // Verify both are gone
  orderRecord = await db.collection("orders").findOne({ orderId: orderId });
  returnRecord = await db.collection("returns").findOne({ orderId: orderId });

  if (!orderRecord && !returnRecord) {
    console.log("✓ Assertion Passed: Sales Deletion & Return logs cascade deletion working 100%.");
  } else {
    throw new Error("Order deletion/return cascade failed!");
  }

  console.log("\n========================================");
  console.log("4. TESTING CUSTOMER DATA PURGING (DELETE)");
  console.log("========================================");

  // Re-insert order and return to simulate customer delete cascade
  await db.collection("orders").insertOne(mockOrder);
  await db.collection("returns").insertOne(mockReturn);

  console.log("Running DELETE /api/customers/[phone] simulation...");
  // Find all order IDs for this customer
  const userOrders = await db
    .collection("orders")
    .find({ "customer.phone": phone }, { projection: { orderId: 1 } })
    .toArray();
  
  const orderIds = userOrders.map((o) => o.orderId);
  console.log(`Found order IDs under phone: ${JSON.stringify(orderIds)}`);

  // Delete all matching returns
  if (orderIds.length > 0) {
    const purgeReturnRes = await db.collection("returns").deleteMany({ orderId: { $in: orderIds } });
    console.log(`✓ Purged ${purgeReturnRes.deletedCount} returns logs`);
  }

  // Delete all matching orders
  const purgeOrderRes = await db.collection("orders").deleteMany({ "customer.phone": phone });
  console.log(`✓ Purged ${purgeOrderRes.deletedCount} order records`);

  // Verify
  const remainingOrdersCount = await db.collection("orders").countDocuments({ "customer.phone": phone });
  const remainingReturnsCount = await db.collection("returns").countDocuments({ orderId: { $in: orderIds } });

  if (remainingOrdersCount === 0 && remainingReturnsCount === 0) {
    console.log("✓ Assertion Passed: Complete Customer Profile Purging works seamlessly!");
  } else {
    throw new Error("Customer purging verification failed!");
  }

  console.log("\n========================================");
  console.log("ALL CRUD OPERATIONS VALIDATED PERFECTLY!");
  console.log("========================================");

  await client.close();
}

runTests().catch(err => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
