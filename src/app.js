import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";



const app = express();




// cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);



app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// Import Routes
import userRouter from "./routes/user.route.js"
import chatRouter from "./routes/chat.route.js"
import msgRouter from "./routes/message.route.js"

// routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/msg", msgRouter);

export { app };
