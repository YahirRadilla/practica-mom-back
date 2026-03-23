const { client, connectRedis } = require("./redisClient");
const { emitEvent } = require("../socket/socketServer");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processOrders() {
  await connectRedis();

  while (true) {
    const order = await client.lPop("ordersQueue");

    if (order) {
      const { cliente, platillo, tipo } = JSON.parse(order);

      emitEvent("preparing", { cliente, platillo });

      console.log(`Preparando ${platillo} para ${cliente}`);

      await sleep(5000);

      emitEvent("ready", { cliente, platillo });

      console.log(`Pedido listo: ${cliente}`);
    } else {
      await sleep(3000);
    }
  }
}

processOrders();
