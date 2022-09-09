const cookieSession = require("cookie-session");
const express = require("express");
const bcrypt = require("bcryptjs");
const {checkUser, authenticateUser, getUrlByUser, generateRandomString} = require("./helper");
const {urlDatabase, userDatabase} = require("./databases")


const app = express();
const PORT = 8081;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.get("/", (req, res) => {
  res.send("Hello!");
});


// Create
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.sendStatus(403);
  }
  const id = generateRandomString();
  const { longURL } = req.body;
  urlDatabase[id] = { id, longURL, userId: req.session.user_id };
  res.redirect(`/urls/${id}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (!Object.keys(urlDatabase).includes(id)) {
    return res.sendStatus(400);
  }
  const longURL = urlDatabase[id].longURL;

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
  urlDatabase[id].longURL = req.body.longURL;
  res.redirect("/urls");
});

//Register User Page
app.get("/register", (req, res) => {
  const id = req.session.user_id;
  const templateVars = { user: userDatabase[id] };
  if (id) {
    return res.redirect("/urls");
  }
  res.render("user_registeration", templateVars);
});

// Collect New User Data
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
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
  userDatabase[id] = { id, email, password: hashedPassword };
  console.log(hashedPassword);
  req.session.user_id = id;
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const currentUser = userDatabase[id];
  const templateVars = { user: currentUser };
  if (!id) {
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.session.user_id;
  const templateVars = {
    id,
    user: urlDatabase[id],
  };

  res.render("urls_show", templateVars);
});

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
  req.session.user_id = currentUser.id;
  res.redirect("/urls");
});

// Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  // console.log("username", req.cookies["username"]);
  const id = req.session.user_id;
  if (!id) {
    return res.send(" <html><body><a href='/login'>LOGIN</a> OR <a href='/register'>REGISTER</a> IF YOU DON NOT ALREADY HAVE AN ACCOUNT </body></html>\n");
  }
  if (!userDatabase) {
    return res.send("You have not created any URLs");
  }
  const templateVars = {
    urls: getUrlByUser(id,urlDatabase),
    user: userDatabase[id],
  };
  res.render("urls_index", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
