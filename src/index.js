"use strict";
const {Server} = require("socket.io")
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    let io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", function (socket) {
      console.log("connection is established");
      socket.on("join", ({ username, room }) => {
        console.log("user connected");
        console.log("username is ", username);
        console.log("room is...", room);
        socket.join(room);
        socket.emit("welcome", {
          user: "bot",
          text: `${username}, Welcome to room ${room}.`,
          userData: { username, room },
        });
        socket.broadcast.to(room).emit("message", {
          user: "bot",
          text: `${username} has joined`,
        });
      });
      socket.on("sendMessage", async (data, callback) => {
        try {
          console.log("here is the message data", JSON.stringify(data));
          // const user = await userExists(data.userId);
          const user = {
            room: 1234,
            username: "Bilal",
          };
          if (user) {
            io.to(user.room).emit("message", {
              user: user.username,
              text: data.message,
            });
          } else {
            callback(`User doesn't exist in the database. Rejoin the chat`);
          }
          callback();
        } catch (err) {
          console.log("err inside catch block", err);
        }
      });
    });
  },
};
