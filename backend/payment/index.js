const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const orders = require("./routes/orders");
const stripe = require("./routes/stripe");

const products = require("./products");

const app = express();

require("dotenv").config();

app.use(express.json());

// Configure CORS to allow only trusted domains
const allowedOrigins = [
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Routes
app.use("/api/orders", orders);
app.use("/api/stripe", stripe);

app.get("/", (req, res) => {
  res.send("Welcome to our online shop API...");
});

app.get("/products", (req, res) => {
  res.send(products);
});

// MongoDB connection
const uri = process.env.DB_URI;
const port = process.env.PORT || 5000;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});
