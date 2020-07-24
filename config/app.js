const dotenv = require('dotenv'); // faz com que leia o arquivo .env

dotenv.config();

module.exports = {
    port: process.env.HTTP_PORT || 3000,
    auth_host: process.env.AUTH_HOST
};