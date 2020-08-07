const dotenv = require('dotenv'); // faz com que leia o arquivo .env

dotenv.config();

// AUTH.HOST é o servidor de autenticação a ser inserido
module.exports = {
    port: process.env.HTTP_PORT || 3000,
    auth_host: process.env.AUTH_HOST
};