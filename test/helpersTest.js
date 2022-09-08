const { assert } = require("chai");
const bcrypt = require("bcryptjs");
const { checkUser, authenticateUser, getUrlByUser } = require("../helper");

const urlDatabase = {
  b2xVn2: {
    id: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userId: "x4R5j2",
  },
  B4n8Q1: {
    id: "B4n8Q1",
    longURL: "http://www.google.com",
    userId: "2x4R3H",
  },
  x2yL3k: {
    id: "x2yL3k",
    longURL: "http://www.gov.cic.ca",
    userId: "2x4R3H",
  },
};

const userDatabase = {
  "2x4R3H": {
    id: "2x4R3H",
    email: "limi@gmail.com",
    password: "$2a$10$Qgvur2CRHoJTT2B7uUPYc.HwtQSRs3FjAoptJq8HMhzt9f0SPwI8G",
  },
  "1p1m4T": {
    id: "1p1m4T",
    email: "GregOil@gmail.com",
    password: "$2a$10$EQWyNFEb0/eSCXrFHQDKY.GZdwVd4xk7provwhr0KVMtI0.xZrGU2",
  },
};

describe("checkUser", function () {
  it("it should return a user with valid email", function () {
    const user = checkUser("GregOil@gmail.com", userDatabase);
    const expectedId  = '1p1m4T';

    assert.equal(user.id, expectedId);
  });
  it("it should return null if there is no user with the email", function () {
    const user = checkUser("pearsons@gmail.com", userDatabase);
    const expected = null;
    assert.equal(user, expected);
  });

});

describe("authenticateUser", function () {
  it("it should return a user if email and password match input", function () {
    const user = authenticateUser("GregOil@gmail.com",'12345', userDatabase);
    const expected = {
      id: "1p1m4T",
      email: "GregOil@gmail.com",
      password: "$2a$10$EQWyNFEb0/eSCXrFHQDKY.GZdwVd4xk7provwhr0KVMtI0.xZrGU2",
    };
    assert.deepEqual(user,expected);
  });

  it("it should return null if password is wrong", function () {
    const user = authenticateUser("GregOil@gmail.com",'1245', userDatabase);
    const expected = null;
    assert.deepEqual(user,expected);
  });
  
  it("it should return null if email is wrong", function () {
    const user = authenticateUser("Oil@gmail.com",'12345', userDatabase);
    const expected = null;
    assert.deepEqual(user,expected);
  });
});


