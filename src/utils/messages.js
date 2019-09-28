const generateMessage = message => {
  return {
    text: message,
    createdAt: new Date().getTime()
  };
};

module.exports = { generateMessage };
