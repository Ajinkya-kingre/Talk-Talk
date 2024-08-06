import dotenv from "dotenv";
import http from "http";
import { connectionDB } from "./db/index.js";
import { app } from "./app.js";
import { Server } from "socket.io";

dotenv.config({
  path: "./.env",
});

// create a HTTP server
const server = http.createServer(app);

// Initialized socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

// Database connection and server start
connectionDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(
        ` Server is running at port http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("mongoDB connection error!!", error);
  });

// socket.io connection handling
io.on("connection", (socket) => {
  console.log("a user connected !!");

  socket.on("disconnect", () => {
    console.log("user disconnected !!");
  });
});
