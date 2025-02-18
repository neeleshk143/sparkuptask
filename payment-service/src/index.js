const express = require("express");
const mongoose = require("mongoose");
const { consumeMessages } = require("./controllers/payment.controller");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://mongodb:27017/orders_db", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(" Payment Service Connected to MongoDB");
        app.listen(5000, () => console.log("🚀 Payment Service running on port 5000"));

        // Start consuming messages after connecting to MongoDB
        console.log("going to payment controller")
        try{
            consumeMessages();

        }catch(error){
            // console.log()
            console.error(" Error starting RabbitMQ Consumer:", error);
        }
        
    })
    .catch(err => console.error(" MongoDB Connection Error:", err));
