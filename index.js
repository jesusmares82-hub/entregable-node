require("dotenv").config();
var session = require("express-session");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
const express = require("express");
//Importar un módelo de base de datos
const { account_types, clients, accounts } = require("./models");

var session = require("express-session");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");

const app = express();
app.use(cookieParser("secret"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
app.set("view engine", "ejs");

//CRUD

//READ
//Para poder leer los datos que envía el cliente con el formato URL Encoded
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  req.flash("success_msg", "");
  res.render("home");
});

app.get("/account_types", async (req, res) => {
  let results = await account_types.findAll({ raw: true });
  res.render("account_types", {
    account_types: results,
    success_msg: req.flash("success_msg"),
  });
});

app.get("/clients", async (req, res) => {
  let results = await clients.findAll({ raw: true });
  res.render("clients", {
    clients: results,
    success_msg: req.flash("success_msg"),
  });
});

//app.get("/accounts", async (req, res) => {
//  let results = await accounts.findAll({ raw: true });
//  res.render("accounts", { accounts: results });
//});

app.get("/accounts", async (req, res) => {
  let results_clients = await clients.findAll({ raw: true });
  let results = await accounts.findAll({
    raw: true,
  });
  let results_account_type = await account_types.findAll({
    raw: true,
  });
  res.render("accounts", {
    accounts: results,
    account_types: results_account_type,
    clients: results_clients,
  });
});

//CREATE

app.post("/account_types", async (req, res) => {
  //sacar los datos que me está enviando el cliente
  const { name, description, created_at, updated_at } = req.body; //desestructuración
  try {
    //Creamos un registro en la tabla account_types
    let results = await account_types.create({ name, description });
    //Enviamos un respuesta satisfactoria
    req.flash("success_msg", "Saved successfully");
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
    req.flash("success_msg", "Saved successfully");
    res.redirect("/clients");
  } catch (error) {
    console.log(error);
    res.status(400).send("No se ha podido agregar el cliente");
  }
});

app.post("/accounts", async (req, res) => {
  //sacar los datos que me está enviando el cliente
  const {
    account_no,
    client_id,
    balance,
    type,
    created_at,
    updated_at,
  } = req.body; //desestructuración
  try {
    //Creamos un registro en la tabla account_types
    let results = await accounts.create({
      account_no,
      client_id,
      balance,
      type,
    });
    //Enviamos un respuesta satisfactoria
    res.send("Se ha agregado una cuenta");
  } catch (error) {
    console.log(error);
    res.status(400).send("No se ha podido agregar la cuenta");
  }
});

//GET EDIT
app.get("/clients/edit/:id", async (req, res) => {
  const id = req.params.id;
  let results = await clients.findByPk(id, {
    raw: true,
  });
  console.log(results);
  res.render("edit", { clients: results });
});

// POST EDIT
app.post("/clients/update/:id", async (req, res) => {
  await clients.update(
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  req.flash("success_msg", "Modified successfully");
  res.redirect("/clients");
});

app.get("/clients/delete/:id", async (req, res) => {
  try {
    const client = await clients.findByPk(req.params.id);
    client.destroy();
    req.flash("success_msg", "Deleted successfully");
    res.redirect("/clients");
    //res.render("delete", { success: "success" });
  } catch (error) {
    console.log(error);
  }
});

//Account Types:
app.get("/account_types/edit/:id", async (req, res) => {
  const id = req.params.id;
  let results = await account_types.findByPk(id, {
    raw: true,
  });
  console.log(results);
  res.render("edit", { account_types: results });
});

app.post("/account_types/update/:id", async (req, res) => {
  await account_types.update(
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  req.flash("success_msg", "Modified successfully");
  res.redirect("/account_types");
});

app.get("/account_types/delete/:id", async (req, res) => {
  try {
    const account_type = await account_types.findByPk(req.params.id);
    account_type.destroy();
    req.flash("success_msg", "Deleted successfully");
    res.redirect("/account_types");
    //res.render("delete", { success: "success" });
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 8080;

//Create server
app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
