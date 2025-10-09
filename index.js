import express from "express";
import { sequelize } from "./src/config/sequelize.js";
import routerBot from "./src/router/router.js";
import { configDotenv } from "dotenv";
import cors from "cors";
import { iniciarCobranca } from "./src/functions/mensagens/controladorMensagens.js";
import { iniciarVerificaEmail } from "./src/functions/mensagens/verificaRespostas.js";
import { iniciarResumo } from "./src/functions/mensagens/resumoSemanal.js";

const app = express();
const PORT = 3000;

configDotenv();
app.use(cors());
app.use(express.json());
app.use(routerBot);

// Autenticação com PostgreSQL
await sequelize
  .authenticate()
  .then(() => console.log("Conexão com PostgreSQL foi bem-sucedida! 🚀"))
  .catch((err) => {
    console.error("Erro ao conectar no PostgreSQL:", err);
    process.exit(1); // Encerra o servidor caso a conexão falhe
  });

// Sincronizar DB e iniciar servidor
await sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando...`);
  });
});

iniciarVerificaEmail();
iniciarCobranca();
iniciarResumo();
