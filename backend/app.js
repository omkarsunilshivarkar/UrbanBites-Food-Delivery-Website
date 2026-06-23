import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

import bodyParser from "body-parser";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());

// Serve static files both under /api and / to support local and Vercel routing
app.use("/api", express.static(path.join(__dirname, "public")));
app.use("/", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Configure data files paths
const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;
const dataDir = isVercel ? os.tmpdir() : path.join(__dirname, "data");
const ordersFilePath = path.join(dataDir, "orders.json");
const mealsFilePath = path.join(__dirname, "data", "available-meals.json");

// Helper to initialize orders.json in /tmp if it doesn't exist (Vercel read-only filesystem workaround)
async function initializeOrdersFile() {
  try {
    await fs.access(ordersFilePath);
  } catch {
    await fs.writeFile(ordersFilePath, "[]", "utf8");
  }
}

if (isVercel) {
  await initializeOrdersFile();
}

const router = express.Router();

router.get("/meals", async (req, res) => {
  const meals = await fs.readFile(mealsFilePath, "utf8");
  res.json(JSON.parse(meals));
});

router.post("/orders", async (req, res) => {
  const orderData = req.body.order;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (
    orderData === null ||
    orderData.items === null ||
    orderData.items.length === 0
  ) {
    return res.status(400).json({ message: "Missing data." });
  }

  if (
    orderData.customer.email === null ||
    !orderData.customer.email.includes("@") ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === "" ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === "" ||
    orderData.customer["postal-code"] === null ||
    orderData.customer["postal-code"].trim() === "" ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ""
  ) {
    return res.status(400).json({
      message:
        "Missing data: Email, name, street, postal code or city is missing.",
    });
  }

  const newOrder = {
    ...orderData,
    id: (Math.random() * 1000).toString(),
  };

  // Make sure file exists (safety fallback)
  if (isVercel) {
    await initializeOrdersFile();
  }

  const orders = await fs.readFile(ordersFilePath, "utf8");
  const allOrders = JSON.parse(orders);
  allOrders.push(newOrder);
  await fs.writeFile(ordersFilePath, JSON.stringify(allOrders));
  res.status(201).json({ message: "Order created!" });
});

// Route everything through the router mounted on both /api and /
app.use("/api", router);
app.use("/", router);

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

// Don't listen to port on Vercel (Vercel manages the serverless execution lifecycle)
if (!isVercel) {
  app.listen(3000, () => {
    console.log("Local Express server running on port 3000");
  });
}

export default app;
