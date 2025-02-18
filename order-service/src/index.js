const express = require("express");
const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();
const app = express();
app.use(express.json());

const orderRoutes = require("./routes/order.routes");
app.use("/api", orderRoutes);

mongoose.connect("mongodb://mongodb:27017/orders_db", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Order Service Connected to MongoDB");
        app.listen(4000, () => console.log("Order Service running on port 4000"));
    })
    .catch(err => console.error(err));
