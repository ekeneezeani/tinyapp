const express = require("express");
const { generateRandomString } = require("./generateRandomString");

const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

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

app.get('/u/:id', (req,res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id]
  res.redirect(longURL)
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const templateVars = { id, longURL: urlDatabase[id] };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
