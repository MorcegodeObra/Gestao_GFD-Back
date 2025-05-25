import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './src/config/sequelize.js';
import routerBot from './src/router/mainRouter.js';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import {runCronJob} from './src/functions/verificaContato.js'; // Importando o cron job

const app = express();
const PORT = 3000;

configDotenv();
app.use(cors());
app.use(bodyParser.json());
app.use(routerBot);

// Autenticação com PostgreSQL
sequelize.authenticate()
  .then(() => console.log('Conexão com PostgreSQL foi bem-sucedida! 🚀'))
  .catch(err => {
    console.error('Erro ao conectar no PostgreSQL:', err);
    process.exit(1); // Encerra o servidor caso a conexão falhe
  });

// Iniciando o cron job
runCronJob;

// Sincronizar DB e iniciar servidor
sequelize.sync({alter:true}).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
