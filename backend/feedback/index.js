require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Express app
const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Configure CORS to allow only trusted domains
const allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
  })
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/feedback", feedbackRoutes);

// Connect to the database
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

// Listen for requests
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Listening on port", port);
});
