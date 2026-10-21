require("dotenv").config();

const express = require("express");
const app = express();
const porta = process.env.APP_PORT || 3000;

// indicação de pasta de arquivos estáticos - css, js, img
app.use(express.static("./app/public"));

// configurar o ejs como mecanismo de renderização
app.set("view engine", "ejs");
// configurar a pasta das views - html -> ejs
app.set("views", "./app/views");

// SEMPRE ANTES DA REQUISIÇÃO DAS ROTAS
// configurar o envio e a análise de dados na requisição
// configurar o payload para formato JSON (API)
app.use(express.json());
// configurar o payload para formato URLencoded (form HTML)
app.use(express.urlencoded({ extended: true }));

// requisitar arquivos de rotas
const rota = require("./app/routes/router");
// indicar o local de uso das rotas
app.use("/", rota);
// ("/") indica a raiz do site - http://localhost:3000

app.listen(porta, () => {
    console.log(`Servidor on-line!\nhttp://localhost:${porta}`);
});
