const bcrypt = require("bcryptjs");

const checkUser = function(email, obj) {
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

const getUrlByUser = function(userId, urlDatabase) {
  const userUrls = {};
  for (const key in urlDatabase) {
    if (urlDatabase[key].userId === userId) {
      const { id, longURL, userId } = urlDatabase[key];
      userUrls[key] = { id, longURL, userId };
    }
  }
  if (Object.keys(userUrls).length !== 0) {
    return userUrls;
  }
  return null;
};

const generateRandomString = function() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (let i = 0; i < 3; i++) {
    const randomNumber = Math.floor(Math.random() * 52);
    randomString += Math.floor(randomNumber / 10) + chars.charAt(randomNumber);
  }
  return randomString;
};

module.exports = { checkUser, authenticateUser, getUrlByUser, generateRandomString };
