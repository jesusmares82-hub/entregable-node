require("dotenv").config();

const express = require("express");
//Importar un módelo de base de datos
const { account_types, clients, accounts } = require("./models");

const app = express();
app.set("view engine", "ejs");
//CRUD

//READ
//Para poder leer los datos que envía el cliente con el formato URL Encoded
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/account_types", async (req, res) => {
  let results = await account_types.findAll({ raw: true });
  res.render("account_types", { account_types: results });
});

app.get("/clients", async (req, res) => {
  let results = await clients.findAll({ raw: true });
  res.render("clients", { clients: results });
});

app.get("/accounts", async (req, res) => {
  let results = await accounts.findAll({ raw: true });
  res.render("accounts", { account_types: results });
});

//CREATE

app.post("/account_types", async (req, res) => {
  //sacar los datos que me está enviando el cliente
  const { name, description, created_at, updated_at } = req.body; //desestructuración
  try {
    //Creamos un registro en la tabla account_types
    let results = await account_types.create({ name, description });
    //Enviamos un respuesta satisfactoria
    res.redirect("/account_types");
  } catch (error) {
    console.log(error);
    res.status(400).send("No se ha podido agregar el tipo de cuenta");
  }
});

app.post("/clients", async (req, res) => {
  //sacar los datos que me está enviando el cliente
  const {
    first_name,
    last_name,
    email,
    phone,
    created_at,
    updated_at,
  } = req.body; //desestructuración
  try {
    //Creamos un registro en la tabla account_types
    let results = await clients.create({ first_name, last_name, email, phone });
    //Enviamos un respuesta satisfactoria
    res.redirect("/clients");
  } catch (error) {
    console.log(error);
    res.status(400).send("No se ha podido agregar el cliente");
  }
});

//EDIT
// GET /edit/5
app.get("/partials/clients/edit/:id", async (req, res) => {
  const id = req.params.id;
  let results = await clients.findByPk(req.params.id, {
    raw: true,
  });
  res.render("/partials/clients/edit", { edit: results });
});

const PORT = process.env.PORT || 8080;

//Create server
app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
