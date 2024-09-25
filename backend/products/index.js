const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const checkoutRouter = require("./routes/checkout");

const port = process.env.PORT || 8080;
const mongo_url = process.env.MONGO_URL;

// Specify allowed domains for CORS
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
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect(mongo_url, {});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Database Connection Successful");
});

const productRouter = require("./routes/ProductRoute");
app.use("/product", productRouter);

const cartRouter = require("./routes/CartRoute");
app.use("/cart", cartRouter);

const buyerReqRouter = require("./routes/BuyerReqRoute");
app.use("/buyerReq", buyerReqRouter);

app.use("/checkout", checkoutRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
