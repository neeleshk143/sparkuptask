const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose.connect("mongodb://mongodb:27017/orders_db")
    .then(() => {
        console.log("Payment Service Connected to MongoDB");
        app.listen(5000, () => console.log("Payment Service running on port 5000"));
    })
    .catch(err => console.error(err));
