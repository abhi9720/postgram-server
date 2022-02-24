module.exports = function (io) {
  console.log(" io.req received ");
  // console.dir(io)
  io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users); // this is send to everyone  now get this on client side we should socket.on('getUsers')
      console.log("-----------online users ----------------------");
      console.log(users);
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);

      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
      } else {
        console.log("User is offline ");
      }
    });

    socket.on("sendFriendRequest", ({ senderId, receiverId }) => {
      const user = getUser(receiverId);

      if (user) {
        io.to(user.socketId).emit("getFriendRequest", {
          senderId,
        });
      } else {
        console.log("User is offline ");
      }
    });

    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id); // remover user
      io.emit("getUsers", users); // set new online users
    });
  });

  let users = [];

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
    console.log("new user push with id " + userId);
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
};
