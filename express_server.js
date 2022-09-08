const express = require("express");
const { generateRandomString } = require("./generateRandomString");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const userDatabase = {
  "3R4v8z": {
    id: "3R4v8z",
    email: "orjiakor@gmail.com",
    password: "ojiwe12",
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello!");
});

const checkUser = function (email, obj) {
  for (const key in obj) {
    if (obj[key].email === email) {
      return obj[key];
    }
  }
  return null;
};

const authenticateUser = function (email, password, obj) {
  for (const key in obj) {
    if (obj[key].email === email && obj[key].password === password) {
      return obj[key];
    }
  }
  return null;
};
// Create
app.post("/urls", (req, res) => {
  const id = generateRandomString();
  const { longURL } = req.body;
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
  // console.log(req.body);
  // res.send("Ok");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

// Delete
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
  // console.log(id);
});

// Edit
app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect("/urls");
});

//Register User Page
app.get("/register", (req, res) => {
  const id = req.cookies["user_id"];
  const templateVars = { user: userDatabase[id] };
  res.render("user_registeration", templateVars);
});

// Collect New User Data
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.sendStatus(400);
  }
  if (!password) {
    return res.sendStatus(400);
  }

  if (checkUser(email, userDatabase)) {
    return res.sendStatus(400);
  }

  const id = generateRandomString();
  userDatabase[id] = { id, email, password };
  res.cookie("user_id", id);
  res.redirect("/urls");
  res.json(userDatabase);
});

app.get("/urls/new", (req, res) => {
  const id = req.cookies["user_id"];
  const templateVars = { user: userDatabase[id] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.cookies["user_id"];
  const templateVars = {
    id,
    longURL: urlDatabase[id],
    user: userDatabase[userId],
  };
  res.render("urls_show", templateVars);
});

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });
// Login Form

app.get("/login", (req, res) => {
  const id = req.params.id;
  const templateVars = { user: userDatabase[id] };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const currentUser = authenticateUser(email, password, userDatabase);
  if (!currentUser) {
    return res.redirect("/login");
  }
  res.cookie("user_id", currentUser.id);
  res.redirect("/urls");
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  // console.log("username", req.cookies["username"]);
  const id = req.cookies["user_id"];
  const templateVars = {
    urls: urlDatabase,
    user: userDatabase[id],
  };
  res.render("urls_index", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
