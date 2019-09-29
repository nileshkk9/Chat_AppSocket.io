const users = [];

//addUser, removeUser,getuser,getUsersInRoom

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //validate the data
  if (!username || !room) {
    return {
      error: "Username and Room is Required"
    };
  }

  //check for existing user
  const existinguser = users.find(user => {
    return user.room === room && user.username === username;
  });

  if (existinguser) {
    return {
      error: `This ${username} is in use!`
    };
  }

  //store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

//remove user
const removeUser = id => {
  const index = users.findIndex(user => user.id === id);
  if (index != -1) {
    return users.splice(index, 1);
  }
};

//get user;
const getUser = id => {
  return users.find(user => user.id === id);
};

const getUsersInRoom = room => {
  room = room.trim().toLowerCase();
  return users.filter(user => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
