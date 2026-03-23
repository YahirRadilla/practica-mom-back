const { client, connectRedis } = require("./redisClient");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PRODUCER_URL = "http://100.110.207.26:3000";

async function notify(endpoint, data) {
  try {
    await fetch(`${PRODUCER_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error notificando:", error.message);
  }
}

async function processOrders() {
  await connectRedis();

  console.log("Consumidor listo 🍳");

  while (true) {
    const order = await client.lPop("ordersQueue");

    if (order) {
      const { id, cliente, platillo, tipo } = JSON.parse(order);

      await notify("/preparing", { id, cliente, platillo });

      console.log(`Preparando ${platillo} para ${cliente}`);

      await sleep(5000);

      await notify("/ready", { id, cliente, platillo });

      console.log(`Pedido listo: ${cliente}`);
    } else {
      await sleep(3000);
    }
  }
}

processOrders();
