const amqp = require("amqplib");
const Payment = require("../models/payment.model");
const Order = require("../models/payment.model")

async function processPayment(msg) {
    try {
        const { orderId, totalAmount } = JSON.parse(msg.content.toString());

        console.log(`Processing payment for Order ${orderId}`);

        // Simulate payment processing
        const payment = new Payment({ orderId, amount: totalAmount, status: "Success" });
        await payment.save();

        // Update Order Status in MongoDB
        await Order.findByIdAndUpdate(orderId, { status: "Paid" });

        console.log(`Payment successful for Order ${orderId}`);
    } catch (error) {
        console.error("Error processing payment:", error);
    }
}

async function consumeMessages(retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log("Attempting to connect to RabbitMQ...");
            const connection = await amqp.connect("amqp://rabbitmq:5672");
            const channel = await connection.createChannel();
            console.log(" Connected to RabbitMQ");

            await channel.assertQueue("orderQueue");
            console.log("📡 Payment Service is listening for messages...");

            channel.consume("orderQueue", async (msg) => {
                console.log(" Received message:", msg.content.toString());
                await processPayment(msg);
            }, { noAck: true });

            return; // Exit retry loop if successful
        } catch (error) {
            console.error(`RabbitMQ connection failed. Retrying in ${delay / 1000}s...`, error);
            await new Promise(res => setTimeout(res, delay));
        }
    }
    console.error("Failed to connect to RabbitMQ after multiple attempts.");
}


consumeMessages();

module.exports = { processPayment, consumeMessages };
