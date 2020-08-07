const http = require('http');
const express = require('express');
const config = require('../config/app.js');
const router = require('./router.js');
const morgan = require('morgan');
const cors = require('cors');

let httpServer;

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express().use(cors()); // utilizando cors, para que minha api aceite requests de outras origens
        httpServer = http.createServer(app);

        app.use(morgan('dev')); // ou combine
        app.use('/api', router); // faz todas as rotas passarem por aqui
        /*
        app.get('/', (req, res) => {
            res.end('Hello World!!');
        }); 
        */
        httpServer.listen(config.port)
            .on('listening', () => {
                console.log(`Serviço funcionando em localhost:${config.port}`);
                resolve();
            }).on('error', err => {
                reject(err);
            });
    });
}

module.exports.initialize = initialize;

// Quando o serviço for removido do ar, ele informará se tudo ocorreu ok ou não.
function close() {
    return new Promise((resolve, reject) => {
      httpServer.close((err) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve();
      });
    });
  }
  
  module.exports.close = close;