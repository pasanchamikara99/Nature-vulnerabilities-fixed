require("dotenv").config();
const cors = require("cors");
// const stripe = require("stripe")(
//   "sk_test_51MxnUfIr55hAMMKQLxFCiGbaVy4gofEfsDFaiO8Le0TPSTqwlaVXTXdoau4xr0DegUzSSDuDUJWZr8PpaYGWzu3N008ZjqTtjz"
// );
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");
const feedbackRoutes = require("./routes/feedbackRoutes");

//express app
const app = express();

// Use Helmet to add various security headers, including disabling X-Powered-By
app.use(helmet());

// CSRF protection middleware
const csrfProtection = csurf({ cookie: true });

// Apply CSRF protection to all routes
app.use(csrfProtection);

app.use((req, res, next) => {
  //console.log(req.path,req.method)
  next();
});

// Your other middleware and routes
app.use("/stripe", stripe);

//middleware
app.use(express.static("public"));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });

const sanitizeLogInput = (input) => {
  return input.replace(/[\n\r\t]/g, ""); // Remove newlines, carriage returns, and tabs
};

app.use((req, res, next) => {
  const sanitizedPath = sanitizeLogInput(req.path);
  const sanitizedMethod = sanitizeLogInput(req.method);

  console.log(sanitizedPath, sanitizedMethod);

  next();
});

//routes
app.use("/api/feedback", feedbackRoutes);

//connect to DB
mongoose.set("strictQuery", false);

try {
  mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
} catch (error) {
  console.log(error);
}

//listen for requests
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Listening on port", port);
});
