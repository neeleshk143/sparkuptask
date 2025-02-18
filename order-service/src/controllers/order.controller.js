const Order = require("../models/order.model");
const axios = require("axios");
const amqp = require("amqplib");

async function createOrder(req, res) {
    try {
        const { userId, items, totalAmount } = req.body;
        const order = new Order({ userId, items, totalAmount });
        await order.save();
        console.log("Order sent to queue:");

        // Send event to payment service via RabbitMQ
        const connection = await amqp.connect("amqp://rabbitmq:5672");
        const channel = await connection.createChannel();
        await channel.assertQueue("orderQueue");
        channel.sendToQueue("orderQueue", Buffer.from(JSON.stringify({ orderId: order._id, totalAmount })));
        const message = JSON.stringify({ orderId: order._id.toString(), totalAmount });
         console.log(" Order sent to queue:",message);

        res.status(201).json({ message: "Order created", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createOrder };
