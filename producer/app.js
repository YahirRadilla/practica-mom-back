const express = require("express");
const cors = require("cors");
const http = require("http");
const { client, connectRedis } = require("./redisClient");
const { initSocket, emitEvent } = require("../socket/socketServer");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
initSocket(server);

connectRedis();

// Pedido normal
app.post("/order", async (req, res) => {
  const { id, cliente, platillo } = req.body;

  const orderData = {
    id: Date.now(),
    cliente,
    platillo,
    tipo: "normal",
  };

  await client.rPush("ordersQueue", JSON.stringify(orderData));

  emitEvent("newOrder", orderData);

  res.send("Pedido enviado");
});

// Pedido VIP
app.post("/vip-order", async (req, res) => {
  const { id, cliente, platillo } = req.body;

  const orderData = {
    id: Date.now(),
    cliente,
    platillo,
    tipo: "vip",
  };

  await client.lPush("ordersQueue", JSON.stringify(orderData));

  emitEvent("newOrder", orderData);

  res.send("Pedido VIP enviado");
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Productor corriendo en puerto 3000");
});

app.post("/preparing", (req, res) => {
  const { id, cliente, platillo } = req.body;

  emitEvent("preparing", { id, cliente, platillo });

  res.send("ok");
});

app.post("/ready", (req, res) => {
  const { id, cliente, platillo } = req.body;

  emitEvent("ready", { id, cliente, platillo });

  res.send("ok");
});
