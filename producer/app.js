const express = require("express");
const cors = require("cors");
const http = require("http");
const { client, connectRedis } = require("./redisClient");
const { initSocket, emitEvent } = require("../socket/socketServer");

app.use(cors());

const app = express();
app.use(express.json());

const server = http.createServer(app);
initSocket(server);

connectRedis();

// Pedido normal
app.post("/order", async (req, res) => {
  const { cliente, platillo } = req.body;

  const order = JSON.stringify({
    cliente,
    platillo,
    tipo: "normal",
  });

  await client.rPush("ordersQueue", order);

  emitEvent("newOrder", { cliente, platillo, tipo: "normal" });

  res.send("Pedido enviado");
});

// Pedido VIP
app.post("/vip-order", async (req, res) => {
  const { cliente, platillo } = req.body;

  const order = JSON.stringify({
    cliente,
    platillo,
    tipo: "vip",
  });

  await client.lPush("ordersQueue", order);

  emitEvent("newOrder", { cliente, platillo, tipo: "vip" });

  res.send("Pedido VIP enviado");
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Productor corriendo en puerto 3000");
});
