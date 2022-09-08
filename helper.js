const bcrypt = require("bcryptjs");


const checkUser = function (email, obj) {
  for (const key in obj) {
    if (obj[key].email === email) {
      return obj[key];
    }
  }
  return null;
};

const authenticateUser = function(email, password, obj) {
  for (const key in obj) {
    const hashedPassword = obj[key].password;
    if (
      obj[key].email === email &&
      bcrypt.compareSync(password, hashedPassword)
    ) {
      return obj[key];
    }
  }
  return null;
};

const getUrlByUser = function(userId,urlDatabase) {
  const userUrls = {};
  for (const key in urlDatabase) {
    if (urlDatabase[key].userId === userId) {
      const { id, longURL, userId } = urlDatabase[key];
      userUrls[key] = { id, longURL, userId };
    }
  }
  if (userUrls !== {}) {
    return userUrls;
  }
  return null;
};

module.exports = {checkUser, authenticateUser, getUrlByUser};