"use strict";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer);
    io.on("connection", (socket) => {
        console.log("> A new client connected: ", socket.id);
        socket.on("disconnect", () => {
            console.log("> A client disconnected");
            console.log(socket.id);
        });
        socket.on("join_room", ({ room, username }) => {
            socket.join(room);
            console.log(`> User ${username} joined room ${room}`);
            socket.to(room).emit("user_joined", username);
        });
        socket.on("leave_room", ({ room, username }) => {
            socket.leave(room);
            console.log(`> User ${username} left room ${room}`);
            socket.to(room).emit("user_left", username);
        });
        socket.on("message", ({ room, message, sender }) => {
            console.log(`> Message received in room ${room}: ${message}`);
            socket.to(room).emit("message", {
                sender: sender,
                content: message,
            });
        });
    });
    httpServer
        .listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    })
        .once("error", (err) => {
        console.error(err);
        process.exit(1);
    });
});
