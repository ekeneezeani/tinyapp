const generateRandomString = function() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (let i = 0; i < 3; i++) {
    const randomNumber = Math.floor(Math.random() * 52);
    randomString += Math.floor(randomNumber / 10) + chars.charAt(randomNumber);
  }
  return randomString;
};


console.log(generateRandomString());
module.exports = {generateRandomString};