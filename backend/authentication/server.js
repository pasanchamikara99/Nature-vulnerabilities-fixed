require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./routes/user');
const cors = require("cors");

// Express app
const app = express();

// Middleware
app.use(express.json());

// Configure CORS to allow only trusted domains
const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
}));

app.use((req, res, next) => {
  // Optionally log requests
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/user", userRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(4000, () => {
      console.log("This app is listening on port 4000");
      console.log("This app is connected to the database");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

