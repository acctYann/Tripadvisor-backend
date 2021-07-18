require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

const app = express();
app.use(formidable());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bienvenue !" });
});

app.post("/form", (req, res) => {
  const { firstname, lastname, email, message } = req.fields;
  /* CREATION DE L'OBJET DATA */
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "poncetyann@icloud.com",
    subject: "Formulaire",
    text: req.fields.message,
  };
  /* ENVOI DE L'OBJET VIA MAILGUN */
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res.status(200).json(body);
    }
    res.status(401).json(error);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started !");
});
